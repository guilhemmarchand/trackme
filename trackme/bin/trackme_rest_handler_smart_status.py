import logging
import os, sys
import splunk
import splunk.entity
import splunk.Intersplunk
import json

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import rest_handler
import splunklib.client as client
import splunklib.results as results

class TrackMeHandlerSmartStatus_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerSmartStatus_v1, self).__init__(command_line, command_arg, logger)

# Get smart status for data sources
    def get_ds_smart_status(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_data_source_monitoring"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Get the current record
            # Notes: the record is returned as an array, as we search for a specific record, we expect one record only
            
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                key = None
                
            # Render result
            if key is not None and len(key)>2:

                # Get the data source state, and start from there
                data_index = record[0].get('data_index')
                data_sourcetype = record[0].get('data_sourcetype')
                data_source_state = record[0].get('data_source_state')
                data_lag_alert_kpis = record[0].get('data_lag_alert_kpis')
                data_last_lag_seen = record[0].get('data_last_lag_seen')
                data_last_ingestion_lag_seen = record[0].get('data_last_ingestion_lag_seen')
                data_max_lag_allowed = record[0].get('data_max_lag_allowed')
                data_last_time_seen = record[0].get('data_last_time_seen')
                enable_behaviour_analytic = record[0].get('enable_behaviour_analytic')
                system_behaviour_analytic_mode = record[0].get('system_behaviour_analytic_mode')
                dcount_host = record[0].get('dcount_host')
                min_dcount_host = record[0].get('min_dcount_host')
                isOutlier = record[0].get('isOutlier')
                isAnomaly = record[0].get('isAnomaly')

                # min_dcount_host defaults to str any, for ease of code, comvert to 0
                if min_dcount_host in ("any"):
                    min_dcount_host = 0

                if data_source_state is None or data_source_state in ("green", "blue"):

                    results = '{' \
                    + '"data_name": "' + data_name + '", '\
                    + '"data_source_state": "' + data_source_state + '", '\
                    + '"smart_result": "The data source is currently in a normal state, therefore further investigations are not required at this stage, good bye.", '\
                    + '"smart_code": "0"' \
                    + '}'

                    return {
                        "payload": json.dumps(json.loads(results), indent=1),
                        'status': 200 # HTTP status code
                    }

                else:

                    # This data source exist, runs investigations

                    # case: latest data is out of the acceptable window (lag event)

                    if data_lag_alert_kpis in ("all_kpis", "lag_event_kpi") and int(data_last_lag_seen)>int(data_max_lag_allowed):

                        import splunklib.results as results

                        # retrieve the number of time this entity has flipped during the last 24 hours, multiple back and forth movements is suspicious
                        # and indicates either a misconfiguration (lagging values not adapted) or something very wrong happening
                        kwargs_search = {"app": "trackme", "earliest_time": "-24h", "latest_time": "now"}
                        searchquery = "`trackme_idx` source=\"flip_state_change_tracking\" object_category=\"data_source\" object=\"" + str(data_name) + "\" | stats count"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            flipping_count = query_result["count"]

                        except Exception as e:
                            flipping_count = 0

                        # Get lagging statistics from live data
                        kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "+4h"}
                        searchquery = "| tstats max(_time) as data_last_time_seen "\
                        + "where (index=" + str(data_index) + " sourcetype=" + str(data_sourcetype) + ") by host"\
                        + "| eval event_lag=now()-data_last_time_seen"\
                        + "| where (event_lag>" + str(data_max_lag_allowed) + ")"\
                        + "| sort - limit=10 event_lag"\
                        + "| foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                        + '| eval summary = host . " (event_lag: " . event_lag . ")"'\
                        + "| fields summary"\
                        + "| stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            summary = query_result["summary"]
                            summary = summary.replace(", ", ",")
                            summary = summary.split(",")

                        except Exception as e:
                            summary = None

                        import datetime, time

                        # convert the epochtime to a human friendly format
                        human_last_datetime = datetime.datetime.fromtimestamp(int(data_last_time_seen)).strftime('%c')

                        # eval current delay
                        current_delay = round(time.time()-int(data_last_time_seen))

                        # convert the current delay to a human friendly format
                        current_delay = str(datetime.timedelta(seconds=int(current_delay)))

                        results_message = '{' \
                        + '"data_name": "' + str(data_name)  + '", '\
                        + '"data_source_state": "' + str(data_source_state)  + '", '\
                        + '"smart_result": "TrackMe triggered an alert due to the latest data available that is out of the acceptable window, the maximal event lag allowed is: ' + str(data_max_lag_allowed) + ' seconds, while the latest data available is: ' + str(human_last_datetime) + ', the data is late by: ' + str(current_delay) + ' (days, HH:MM:SS)", '\
                        + '"hosts_report": "' + str(summary) + '", '\
                        + '"smart_code": "1"' \
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    # case: ingestion lag is out of acceptable values

                    elif data_lag_alert_kpis in ("all_kpis", "lag_ingestion_kpi") and int(data_last_ingestion_lag_seen)>int(data_max_lag_allowed):

                        # investigate top 10 lagging hosts
                        import splunklib.results as results

                        kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "+4h"}
                        searchquery = "| tstats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount "\
                        + "where (index=" + str(data_index) + " sourcetype=" + str(data_sourcetype) + ") by _time, index, sourcetype, host span=1s"\
                        + "| eval data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"\
                        + "| stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                        + "| where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                        + "| sort - limit=10 avg_ingest_lag"\
                        + "| foreach avg_ingest_lag, max_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                        + "| eval summary=host . \" (avg_ingest_lag: \" . avg_ingest_lag . \")\""\
                        + "| fields summary"\
                        + "| stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            summary = query_result["summary"]
                            summary = summary.replace(", ", ",")
                            summary = summary.split(",")

                        except Exception as e:
                            summary = None

                        import datetime, time

                        results_message = '{' \
                        + '"data_name": "' + str(data_name) + '", '\
                        + '"data_source_state": "' + str(data_source_state) + '", '\
                        + '"smart_result": "TrackMe triggered an alert due to indexing lag detected out of the acceptable window, the maximal ingestion lag allowed is: ' + str(data_max_lag_allowed) + ' seconds, while an ingestion lag of ' + str(datetime.timedelta(seconds=int(data_last_ingestion_lag_seen))) + ' (days, HH:MM:SS) was detected, review the hosts attached to this report to investigate the root cause.", '\
                        + '"host_report": "' + str(summary) + '", '\
                        + '"smart_code": "1"' \
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    # case: dcount 

                    elif int(min_dcount_host)>0 and int(dcount_host)<int(min_dcount_host):

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "dcoun thost detection.", "smart_code": "1"' \
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }


                    # case: outliers anomaly detection

                    elif isOutlier in ("1") and enable_behaviour_analytic in ("true"):

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "Outlier anomaly detection.", "smart_code": "1"' \
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }

                    elif isAnomaly in ("1"):

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "Data sampling anomaly.", "smart_code": "1"' \
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }

                    # case: data sampling has detected an anomaly

                    else:

                        return {
                            "payload": "investigations to be processed.",
                            'status': 200 # HTTP status code
                        }

            # This data source does not exist
            else:
                return {
                    "payload": 'Warn: resource not found ' + str(query_string),
                    'status': 404 # HTTP status code
                }


        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                'status': 500 # HTTP status code
            }

