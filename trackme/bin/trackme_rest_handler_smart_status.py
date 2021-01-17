import logging
import os, sys
import splunk
import splunk.entity
import splunk.Intersplunk
import json
import re

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

                # inititate the smart_code status, we start at 0 then increment using the following rules:
                # - TBD

                smart_code = 0

                import splunklib.results as results

                # Spawn a new search
                # Get lagging statistics from live data
                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                searchquery = "| inputlookup trackme_data_source_monitoring where _key=\"" + str(key) + "\""\
                + "| eval keyid=_key"\
                + "| `trackme_get_identity_card(data_name)`"\
                + "| `trackme_lookup_elastic_sources`"\
                + "| `trackme_ack_lookup_main(data_name)`"\
                + "| `trackme_lookup_data_sampling`"\
                + "| nomv tags"\
                + "| eval data_last_lag_seen=round(data_last_lag_seen, 0), data_last_time_seen=round(data_last_time_seen, 0)"\
                + "| fillnull value=\"null\" data_name data_index data_sourcetype data_source_state data_lag_alert_kpis"\
                + "data_last_lag_seen data_last_ingestion_lag_seen data_max_lag_allowed data_last_time_seen enable_behaviour_analytic dcount_host "\
                + "min_dcount_host isOutlier isAnomaly data_sample_anomaly_reason data_sample_status_colour data_sample_status_message "\
                + "elastic_source_from_part1 elastic_source_from_part2 elastic_source_search_constraint elastic_source_search_mode"

                # spawn the search and get the results
                searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                # Get the results and display them using the ResultsReader
                try:
                    reader = results.ResultsReader(searchresults)
                    for item in reader:
                        query_result = item

                    data_index = query_result["data_index"]
                    data_sourcetype = query_result["data_sourcetype"]
                    data_source_state = query_result["data_source_state"]
                    data_lag_alert_kpis = query_result["data_lag_alert_kpis"]
                    data_last_lag_seen = query_result["data_last_lag_seen"]
                    data_last_ingestion_lag_seen = query_result["data_last_ingestion_lag_seen"]
                    data_max_lag_allowed = query_result["data_max_lag_allowed"]
                    data_last_time_seen = query_result["data_last_time_seen"]
                    enable_behaviour_analytic = query_result["enable_behaviour_analytic"]
                    dcount_host = query_result["dcount_host"]
                    min_dcount_host = query_result["min_dcount_host"]
                    isOutlier = query_result["isOutlier"]
                    isAnomaly = query_result["isAnomaly"]
                    data_sample_anomaly_reason = query_result["data_sample_anomaly_reason"]
                    data_sample_status_colour = query_result["data_sample_status_colour"]
                    data_sample_status_message = query_result["data_sample_status_message"]
                    elastic_source_search_constraint = query_result["elastic_source_search_constraint"]
                    elastic_source_search_mode = query_result["elastic_source_search_mode"]
                    elastic_source_from_part1 = query_result["elastic_source_from_part1"]
                    elastic_source_from_part2 = query_result["elastic_source_from_part2"]

                except Exception as e:
                    data_index = None
                    data_sourcetype = None
                    data_source_state = None
                    data_lag_alert_kpis = None
                    data_last_lag_seen = None
                    data_last_ingestion_lag_seen = None
                    data_max_lag_allowed = None
                    data_last_time_seen = None
                    enable_behaviour_analytic = None
                    dcount_host = None
                    min_dcount_host = None
                    isOutlier = None
                    isAnomaly = None
                    data_sample_anomaly_reason = None
                    data_sample_status_colour = None
                    data_sample_status_message = None
                    elastic_source_search_constraint = None
                    elastic_source_search_mode = None
                    elastic_source_from_part1 = None
                    elastic_source_from_part2 = None

                # min_dcount_host defaults to str any, for ease of code, comvert to 0
                if min_dcount_host in ("any"):
                    min_dcount_host = 0

                #
                # Flipping status correlation
                #

                flipping_count = 0
                flipping_stdev = 0
                flipping_perc95 = 0
                flipping_sum = 0

                # retrieve the number of time this entity has flipped during the last 24 hours, multiple back and forth movements is suspicious
                # and indicates either a misconfiguration (lagging values not adapted) or something very wrong happening
                import splunklib.results as results

                kwargs_search = {"app": "trackme", "earliest_time": "-24h", "latest_time": "now"}
                searchquery = "search `trackme_idx` source=\"flip_state_change_tracking\" object_category=\"data_source\" object=\"" + str(data_name) + "\" | bucket _time span=4h | stats count by _time | stats stdev(count) as stdev perc95(count) as perc95 max(count) as max latest(count) as count sum(count) as sum"

                # spawn the search and get the results
                searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                # Get the results and display them using the ResultsReader
                try:
                    reader = results.ResultsReader(searchresults)
                    for item in reader:
                        query_result = item
                    flipping_count = query_result["count"]
                    flipping_stdev = query_result["stdev"]
                    flipping_perc95 = query_result["perc95"]
                    flipping_sum = query_result["sum"]

                except Exception as e:
                    flipping_count = 0

                # round flipping_stdev
                flipping_stdev = round(float(flipping_stdev), 2)
                flipping_perc95 = round(float(flipping_perc95), 2)

                if (int(flipping_count)>float(flipping_perc95) or int(flipping_count)>float(flipping_stdev)) and int(flipping_count)>1:
                    flipping_correlation_msg = 'state: [ orange ], message: [ ' + 'The amount of flipping events is abnormally high (last 24h count: ' + str(flipping_sum) + ', perc95: ' + str(flipping_perc95) + ', stdev: ' + str(flipping_stdev) + ', last 4h count: ' + str(flipping_count) + '), review the data source activity to determine potential root causes leading the data flow to flip abnormally. ]'
                    # increment the smart_code by 1
                    smart_code += 1
                else:
                    flipping_correlation_msg = 'state: [ green ], message: [ There were no anomalies detected in the flipping state activity threshold. ]'

                # data sampling state

                data_sampling_state = "state: [ " + str(data_sample_status_colour) + " ], message: [ " + str(data_sample_status_message) + " ]"

                #
                # Proceed
                #

                if data_source_state is None or data_source_state in ("green", "blue"):

                    results = '{' \
                    + '"data_name": "' + data_name + '", '\
                    + '"data_source_state": "' + data_source_state + '", '\
                    + '"smart_result": "The data source is currently in a normal state, therefore further investigations are not required at this stage.", '\
                    + '"smart_code": "' + str(smart_code) + '", '\
                    + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                    + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                    + '}'

                    return {
                        "payload": json.dumps(json.loads(results), indent=1),
                        'status': 200 # HTTP status code
                    }

                else:

                    # This data source exist, runs investigations

                    #
                    # case: latest data is out of the acceptable window (lag event)
                    #

                    report_name = None
                    report_desc = None

                    if data_lag_alert_kpis in ("all_kpis", "lag_event_kpi") and int(data_last_lag_seen)>int(data_max_lag_allowed):

                        # Get lagging statistics from live data

                        # To define the search, we need to know if the data source is a normal data source or an Elastic source
                        isElastic = False
                        if elastic_source_search_mode in ("null"):
                            isElastic = False
                        else:
                            isElastic = True

                        # Define the query
                        # For normal data sources, use tstats
                        
                        # data source is regular
                        if (not isElastic):

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "| tstats max(_time) as data_last_time_seen "\
                            + "where (index=" + str(data_index) + " sourcetype=" + str(data_sourcetype) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: last 4 hours hosts report ], "
                            report_name = "hosts_report"

                        # data source is Elastic and tstats
                        elif isElastic and elastic_source_search_mode in("tstats"):

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "| tstats max(_time) as data_last_time_seen "\
                            + "where (" + str(elastic_source_search_constraint) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: last 4 hours hosts report ], "
                            report_name = "hosts_report"

                        # data source is Elastic and raw
                        elif isElastic and elastic_source_search_mode in("raw"):

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "search " + str(elastic_source_search_constraint)\
                            + " | stats max(_time) as data_last_time_seen by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: last 4 hours hosts report ], "
                            report_name = "hosts_report"

                        # data source is Elastic and mstats
                        elif isElastic and elastic_source_search_mode in("mstats"):

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "| mstats latest(_value) as value where " + str(elastic_source_search_constraint) + " by host, metric_name span=1s"\
                            + " | stats max(_time) as lastTime by metric_name"\
                            + " | eval metric_lag=now()-lastTime"\
                            + " | where (metric_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 metric_lag"\
                            + " | foreach metric_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + " | fields metric_name, metric_lag"\
                            + " | eval summary = \"[ metric_name:\" . metric_name . \", metric_lag:\" . metric_lag . \" ]\""\
                            + " | stats values(summary) as summary"\
                            + " | fields summary | eval summary=mvjoin(mvsort(summary), \", \")"
                            
                            report_desc = "[ description: top 10 metric_name out of accepted lag window ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": "-1h", "latest_time": "now"}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | stats max(_time) as data_last_time_seen by host"\
                                + " | eval event_lag=now()-data_last_time_seen"\
                                + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                                + " | sort - limit=10 event_lag"\
                                + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                                + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                                report_desc = "[ description: last 60 minutes hosts report ], "
                                report_name = "hosts_report"

                            # if lookup based
                            elif re.search("lookup:", str(elastic_source_search_constraint)):

                                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | " + str(elastic_source_from_part2)\
                                + " | stats max(_indextime) as lastIngest, min(_time) as earliestRecord, max(_time) as latestRecord, count as numberRecords, dc(host) as numberHost"\
                                + " | eval summary=\"[ lastIngest: \" . strftime(lastIngest, \"%c\") . \", latestRecord: \" . strftime(latestRecord, \"%c\") . \", earliestRecord: \" . strftime(earliestRecord, \"%c\") . \", numberRecords: \" . numberRecords . \", numberHosts: \" . numberHost . \" ]\" | fields summary"

                                report_desc = "[ description: Investigate lookup based data source ], "
                                report_name = "lookup_report"

                        # data source is Elastic, rest tstats
                        elif isElastic and elastic_source_search_mode in ("rest_tstats"):

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + "| tstats max(_time) as data_last_time_seen "\
                            + "where (" + str(elastic_source_from_part2) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . \\" (event_lag: \\" . event_lag . \\")\\"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"-4h\" latest_time=\"+4h\" | table value | restextractsummary"

                            report_desc = "[ description: last 4 hours hosts report ], "
                            report_name = "hosts_report"

                        # data source is Elastic, rest raw
                        elif isElastic and elastic_source_search_mode in ("rest_raw"):

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " search " + str(elastic_source_from_part2)\
                            + " | stats max(_time) as data_last_time_seen by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . \\" (event_lag: \\" . event_lag . \\")\\"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"-4h\" latest_time=\"+4h\" | table value | restextractsummary"

                            report_desc = "[ description: last 4 hours hosts report ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("rest_from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": "-1h", "latest_time": "now"}
                                searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                                + " | from " + str(elastic_source_search_constraint)\
                                + " | stats max(_time) as data_last_time_seen by host"\
                                + " | eval event_lag=now()-data_last_time_seen"\
                                + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                                + " | sort - limit=10 event_lag"\
                                + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                                + ' | eval summary = host . \\" (event_lag: \\" . event_lag . \\")"'\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"\
                                + " \" output_mode=\"csv\" earliest_time=\"-4h\" latest_time=\"+4h\" | table value | restextractsummary"

                                report_desc = "[ description: last 60 minutes hosts report ], "
                                report_name = "hosts_report"

                            # if lookup based
                            elif re.search("lookup:", str(elastic_source_search_constraint)):

                                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                                searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                                + " | from " + str(elastic_source_from_part2)\
                                + " | stats max(_indextime) as lastIngest, min(_time) as earliestRecord, max(_time) as latestRecord, count as numberRecords, dc(host) as numberHost"\
                                + " | eval summary=\\\"[ lastIngest: \\\" . strftime(lastIngest, \\\"%c\\\") . \\\", latestRecord: \\\" . strftime(latestRecord, \\\"%c\\\") . \\\", earliestRecord: \\\" . strftime(earliestRecord, \\\"%c\\\") . \\\", numberRecords: \\\" . numberRecords . \\\", numberHosts: \\\" . numberHost . \\\" ]\\\" | fields summary"\
                                + " \" output_mode=\"csv\" earliest_time=\"-4h\" latest_time=\"+4h\" | table value | restextractsummary"

                                report_desc = "[ description: Investigate lookup based data source ], "
                                report_name = "lookup_report"

                        # data source is Elastic, mstats
                        elif isElastic and elastic_source_search_mode in ("rest_mstats"):

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " | mstats latest(_value) as value where " + str(elastic_source_from_part2) + " by host, metric_name span=1s"\
                            + " | stats max(_time) as lastTime by metric_name"\
                            + " | eval metric_lag=now()-lastTime"\
                            + " | where (metric_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 metric_lag"\
                            + " | foreach metric_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + " | fields metric_name, metric_lag"\
                            + " | eval summary = \\\"[ metric_name:\\\" . metric_name . \\\", metric_lag:\\\" . metric_lag . \\\" ]\\\""\
                            + " | stats values(summary) as summary"\
                            + " | fields summary | eval summary=mvjoin(mvsort(summary), \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"-4h\" latest_time=\"+4h\" | table value | restextractsummary"
                            
                            report_desc = "[ description: top 10 metric_name out of accepted lag window ], "
                            report_name = "hosts_report"

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

                        # increment the smart_code by 10
                        smart_code += 10

                        results_message = '{' \
                        + '"data_name": "' + str(data_name)  + '", '\
                        + '"data_source_state": "' + str(data_source_state)  + '", '\
                        + '"smart_result": "TrackMe triggered an alert due to the latest data available that is out of the acceptable window, the maximal event lag allowed is: ' + str(data_max_lag_allowed) + ' seconds, while the latest data available is: ' + str(human_last_datetime) + ', the data is late by: ' + str(current_delay) + ' (days, HH:MM:SS)", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    #
                    # case: ingestion lag is out of acceptable values
                    #

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

                        # increment the smart_code by 20
                        smart_code += 20

                        results_message = '{' \
                        + '"data_name": "' + str(data_name) + '", '\
                        + '"data_source_state": "' + str(data_source_state) + '", '\
                        + '"smart_result": "TrackMe triggered an alert due to indexing lag detected out of the acceptable window, the maximal ingestion lag allowed is: ' + str(data_max_lag_allowed) + ' seconds, while an ingestion lag of ' + str(datetime.timedelta(seconds=int(data_last_ingestion_lag_seen))) + ' (days, HH:MM:SS) was detected, review the hosts attached to this report to investigate the root cause.", '\
                        + '"host_report": "' + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    #
                    # case: dcount host threshold unmet
                    #

                    elif int(min_dcount_host)>0 and int(dcount_host)<int(min_dcount_host):

                        # define the message
                        smart_result_msg = 'TrackMe triggered an alert due to the minimal distinct count of hosts configured for this data source (threshold: '\
                            + str(min_dcount_host) + ' hosts) which condition is not met as only ' + str(dcount_host) \
                            + ' hosts are detected currently. Review this threshold and the current data source activity accordingly.'

                        # increment the smart_code by 30
                        smart_code += 30

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "' + str(smart_result_msg) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }


                    # case: outliers anomaly detection

                    elif isOutlier in ("1") and enable_behaviour_analytic in ("true"):

                        # first, retrieve different information we need to investigate the outliers
                        OutlierSpan = None

                        kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                        searchquery = "| `trackme_outlier_table(trackme_data_source_monitoring, data_name, " + str(data_name) + ")` | fields OutlierSpan"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            OutlierSpan = query_result["OutlierSpan"]

                        except Exception as e:
                            OutlierSpan = None

                        # Then, investigate current outliers
                        countOutliers = None
                        lastOutlier = None
                        latest4hcount = None
                        lowerBound = None
                        upperBound = None

                        kwargs_search = {"app": "trackme", "earliest_time": "-24h", "latest_time": "now"}
                        searchquery = "| `trackme_outlier_chart(data_source, " + str(data_name) + ", data_name, " + str(OutlierSpan) + ")`"\
                        + "| eval object_category=\"data_name\", object=\"" + str(data_name) + "\""\
                        + "| lookup trackme_data_source_monitoring data_name as object OUTPUT OutlierAlertOnUpper"\
                        + "| eval isOutlier=case("\
                        + "OutlierAlertOnUpper=\"false\", if(eventcount_4h_span<lowerBound, \"true\", \"false\"),"\
                        + "OutlierAlertOnUpper=\"true\", if(eventcount_4h_span<lowerBound OR eventcount_4h_span>upperBound, \"true\", \"false\")"\
                        + ")"\
                        + "| eventstats count(eval(isOutlier=\"true\")) as countOutliers"\
                        + "| where isOutlier=\"true\""\
                        + "| stats count as countOutliers, max(_time) as lastOutlier, latest(eventcount_4h_span) as latest4hcount, latest(lowerBound) as lowerBound, latest(upperBound) as upperBound, latest(OutlierAlertOnUpper) as OutlierAlertOnUpper"\
                        + "| eval lastOutlier=strftime(lastOutlier, \"%c\") | foreach lowerBound upperBound latest4hcount [ eval <<FIELD>> = round('<<FIELD>>', 2) ]"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            countOutliers = query_result["countOutliers"]
                            lastOutlier = query_result["lastOutlier"]
                            latest4hcount = query_result["latest4hcount"]
                            lowerBound = query_result["lowerBound"]
                            upperBound = query_result["upperBound"]
                            OutlierAlertOnUpper = query_result["OutlierAlertOnUpper"]

                        except Exception as e:
                            countOutliers = None
                            lastOutlier = None
                            latest4hcount = None
                            lowerBound = None
                            upperBound = None
                            OutlierAlertOnUpper = None

                        # increment the smart_code by 40
                        smart_code += 40

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "TrackMe triggered an alert on this data source due to outliers detection in the '\
                        + 'event count, outliers are based on the calculation of a lower and upper bound (if alerting on upper) determined '\
                        + 'against the data source usual behaviour and outliers parameters. Review the correlation results to determine '\
                        + 'if the behaviour is expected or symptomatic of an issue happening on the data source (lost of '\
                        + 'sources or hosts, etc.) and proceed to any outliers configuration fine tuning if necessary.", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_outliers": "[ description: Last 24h outliers detection ], [ OutliersCount: ' \
                        + str(countOutliers) + ' ], [ latest4hcount: ' + str(latest4hcount) + ' ], [ lowerBound: ' \
                        + str(lowerBound) + ' ], [ upperBound: ' + str(upperBound) + ' ], [ lastOutlier: ' \
                        + str(lastOutlier) + ' ], [ OutlierAlertOnUpper: ' + str(OutlierAlertOnUpper) + ' ]", '\
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }

                    elif isAnomaly in ("1"):

                        #
                        # case: data sampling has detected an anomaly
                        #

                        anomaly_reason = None
                        smart_correlation = None
                        data_sampling_correlation = None

                        # Get the current anomaly reason
                        import splunklib.results as results
                        import time, datetime

                        kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                        searchquery = "| inputlookup trackme_data_sampling where data_name=\"" + str(data_name) + "\" | head 1"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            anomaly_reason = query_result["data_sample_anomaly_reason"]
                            anomaly_mtime = query_result["data_sample_anomaly_ack_mtime"]
                            # convert to human readable format
                            anomaly_mtime = datetime.datetime.fromtimestamp(int(anomaly_mtime)).strftime('%c')

                        except Exception as e:
                            anomaly_reason = None
                            anomaly_mtime = None

                        if anomaly_reason in ("exclusive_rule_match"):

                            # increment the smart_code by 50
                            smart_code += 50

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| inputlookup trackme_data_sampling where data_name=\"" + str(data_name) + "\" | mvexpand raw_sample" \
                            "| lookup trackme_data_sampling_custom_models model_name as current_detected_format output model_type" \
                            "| eval model_type=if(isnull(model_type) AND isnotnull(current_detected_format), \"inclusive\", model_type) | where model_type=\"exclusive\"" \
                            "| stats count, values(current_detected_format) as rules | mvexpand rules | lookup trackme_data_sampling_custom_models model_name as rules output model_type" \
                            "| where model_type=\"exclusive\" | stats first(count) as count, values(rules) as rules | eval rules_match=mvjoin(rules, \"; \"), rules_csv=mvjoin(mvmap(rules, \"\\\"\" . rules . \"\\\"\"), \",\")"

                            # spawn the search and get the results
                            searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                            # Get the results and display them using the ResultsReader
                            try:
                                reader = results.ResultsReader(searchresults)
                                for item in reader:
                                    query_result = item
                                exclusive_rules_count = query_result["count"]
                                rules_match = query_result["rules_match"]
                                rules_csv = query_result["rules_csv"]

                            except Exception as e:
                                exclusive_rules_count = 0
                                rules_match = None
                                rules_csv = None

                            # correlation message
                            smart_correlation = "Exclusive type of rule match alert: " + str(exclusive_rules_count)\
                            + " events were matched during the latest sampling operation (rules matched: "\
                            + str(rules_match) + "), exclusive rules shall not be matched under normal circumstances and are configured"\
                            + " to track for patterns and conditions that must NOT be found in the data such as PII data. Review these events accordingly,"\
                            + " once the root cause is identified and fixed, proceed to clear state and run sampling."

                            # Perform an additional correlation: run a search for the past 4 hours over raw events and calculate proportion of events found for every model matched by the engine
                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "search index=\"" + str(data_index) + "\" sourcetype=\"" + str(data_sourcetype) + "\""\
                            + "| eval [ | inputlookup trackme_data_sampling_custom_models | where model_name in (" + str(rules_csv) + ")"\
                            + "| fields model_name, model_regex"\
                            + "| eval model_regex=\"match(raw_sample, \\\"\" . model_regex . \"\\\")\""\
                            + "| append ["\
                            + "| `trackme_show_builtin_model_rules`"\
                            + "| where model_name in (" + str(rules_csv) + ")"\
                            + "| fields model_name, model_regex ]"\
                            + "| dedup model_name"\
                            + "| eval spl=model_regex . \", \\\"\" . model_name . \"\\\"\""\
                            + "| fields spl"\
                            + "| streamstats count | eventstats count as total"\
                            + "| eval spl = if(count!=total, spl . \",\", spl)"\
                            + "| fields spl"\
                            + "| stats list(spl) as spl"\
                            + "| mvcombine spl"\
                            + "| eval spl = \"model_match = case(\" . spl . \")\""\
                            + "| rex field=spl mode=sed \"s/match\(raw_sample/match(_raw/g\""\
                            + "| return $spl ]"\
                            + "| eval model_match = if(isnull(model_match), \"Other types of events\", model_match)"\
                            + "| top model_match | eval summary = \"model: [ \" . model_match . \" ], count: [ \" . count . \" ], percent: [ \" . round(percent, 2) . \" % ]\""\
                            + "| stats values(summary) as summary"\
                            + "| eval summary=mvjoin(summary, \", \")"

                            # spawn the search and get the results
                            searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                            # Get the results and display them using the ResultsReader
                            try:
                                reader = results.ResultsReader(searchresults)
                                for item in reader:
                                    query_result = item
                                data_sampling_correlation = query_result["summary"]

                            except Exception as e:
                                data_sampling_correlation = None

                        elif anomaly_reason in ("multiformat_detected"):

                            # increment the smart_code by 51
                            smart_code += 51

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| inputlookup trackme_data_sampling where data_name=\"" + str(data_name)\
                            + "\" | stats values(current_detected_format) as rules | eval rules_match=mvjoin(rules, \"; \"), rules_csv=mvjoin(mvmap(rules, \"\\\"\" . rules . \"\\\"\"), \",\")"

                            # spawn the search and get the results
                            searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                            # Get the results and display them using the ResultsReader
                            try:
                                reader = results.ResultsReader(searchresults)
                                for item in reader:
                                    query_result = item
                                rules_match = query_result["rules_match"]
                                rules_csv = query_result["rules_csv"]

                            except Exception as e:
                                rules_match = None
                                rules_csv = None

                            # correlation message
                            smart_correlation = "Multi-format match alert: during the last sampling operation, multiple rules were matched (rules matched: ["\
                            + str(rules_match) + "]), this likely indicates a quality issue in the indexing process (index time parsing failures leading to incomplete"\
                            + " or malformed events, producer failures, etc). Review these events accordingly, once the root cause has been identified and fixed, proceed"\
                            + " to a clear state and run sampling action."

                            # Perform an additional correlation: run a search for the past 4 hours over raw events and calculate proportion of events found for every model matched by the engine
                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "search index=\"" + str(data_index) + "\" sourcetype=\"" + str(data_sourcetype) + "\""\
                            + "| eval [ | inputlookup trackme_data_sampling_custom_models | where model_name in (" + str(rules_csv) + ")"\
                            + "| fields model_name, model_regex"\
                            + "| eval model_regex=\"match(raw_sample, \\\"\" . model_regex . \"\\\")\""\
                            + "| append ["\
                            + "| `trackme_show_builtin_model_rules`"\
                            + "| where model_name in (" + str(rules_csv) + ")"\
                            + "| fields model_name, model_regex ]"\
                            + "| dedup model_name"\
                            + "| eval spl=model_regex . \", \\\"\" . model_name . \"\\\"\""\
                            + "| fields spl"\
                            + "| streamstats count | eventstats count as total"\
                            + "| eval spl = if(count!=total, spl . \",\", spl)"\
                            + "| fields spl"\
                            + "| stats list(spl) as spl"\
                            + "| mvcombine spl"\
                            + "| eval spl = \"model_match = case(\" . spl . \")\""\
                            + "| rex field=spl mode=sed \"s/match\(raw_sample/match(_raw/g\""\
                            + "| return $spl ]"\
                            + "| top model_match | eval summary = \"model: [ \" . model_match . \" ], count: [ \" . count . \" ], percent: [ \" . round(percent, 2) . \" % ]\""\
                            + "| stats values(summary) as summary"\
                            + "| eval summary=mvjoin(summary, \", \")"

                            # spawn the search and get the results
                            searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                            # Get the results and display them using the ResultsReader
                            try:
                                reader = results.ResultsReader(searchresults)
                                for item in reader:
                                    query_result = item
                                data_sampling_correlation = query_result["summary"]

                            except Exception as e:
                                data_sampling_correlation = None

                        elif anomaly_reason in ("format_change"):

                            # increment the smart_code by 52
                            smart_code += 52

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| inputlookup trackme_data_sampling where data_name=\"" + str(data_name)\
                            + "\" | eval \" \" = \"<--\""\
                            + "| fields data_sample_status_colour, data_sample_status_message, data_sample_feature, data_sampling_nr, current_detected_format, " ","\
                            + " previous_detected_format, data_sample_anomaly_detected, data_sample_anomaly_reason, multiformat_detected, data_sample_mtime"\
                            + "| eval mtime=strftime(data_sample_mtime, \"%c\") | `trackme_eval_icons_data_sampling_enablement` | `trackme_eval_icons_data_sampling_summary`"\
                            + "| rename data_sample_anomaly_reason as anomaly_reason, multiformat_detected as multiformat"\
                            + "| eval previous_detected_format=if(isnull(previous_detected_format), \"N/A\", previous_detected_format)"\
                            + "| append [ | makeresults | eval data_sample_feature=\"N/A\", current_detected_format=\"N/A\", previous_detected_format=\"N/A\", state=\"N/A\", anomaly_reason=\"N/A\", multiformat=\"N/A\", mtime=\"N/A\" ]"\
                            + "| eval data_sampling_nr=if(isnum(data_sampling_nr), data_sampling_nr, `trackme_data_sampling_default_sample_record_at_run`) | fields - data_name | rename data_sample_feature as feature | head 1"

                            # spawn the search and get the results
                            searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                            # Get the results and display them using the ResultsReader
                            try:
                                reader = results.ResultsReader(searchresults)
                                for item in reader:
                                    query_result = item
                                previous_detected_format = query_result["previous_detected_format"]
                                current_detected_format = query_result["current_detected_format"]

                            except Exception as e:
                                rules_match = None

                            # correlation message
                            smart_correlation = "Format change alert: during the last sampling operation, a change was detected in the recognized event format (previous format: ["\
                            + str(previous_detected_format) + "], new format detected: [" + str(current_detected_format)\
                            + "]), the format of a sourcetype properly defined is not supposed to change unexpectly and could indicate a quality issue"\
                            + " in the indexing process. Review these events accordingly, once the root cause has been identified and fixed, proceed to a clear state and run sampling action."

                            # Perform an additional correlation: run a search for the past 4 hours over raw events and calculate proportion of events found with both models
                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "search index=\"" + str(data_index) + "\" sourcetype=\"" + str(data_sourcetype) + "\""\
                            + "| `trackme_data_sampling_correlate_format_change(\"" + str(previous_detected_format) + "\", \"" + str(current_detected_format) + "\")`"

                            # spawn the search and get the results
                            searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                            # Get the results and display them using the ResultsReader
                            try:
                                reader = results.ResultsReader(searchresults)
                                for item in reader:
                                    query_result = item
                                data_sampling_correlation = query_result["summary"]

                            except Exception as e:
                                data_sampling_correlation = None

                        # Result

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "TrackMe triggered an alert due to anomaly detection in the data sampling worfklow (reason: ' + str(anomaly_reason) \
                        + ' detected on ' + str(anomaly_mtime) + '), [ message: ' + str(smart_correlation) + ' ]", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_data_sampling": "description: [ Last 4h top event count/model ], ' + str(data_sampling_correlation) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }


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

