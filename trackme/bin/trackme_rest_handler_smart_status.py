import logging
import os, sys
import splunk
import splunk.entity
import splunk.Intersplunk
import json
import re
import datetime, time

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

        describe = False

        # Retrieve from data
        try:
            resp_dict = json.loads(str(request_info.raw_args['payload']))
        except Exception as e:
            resp_dict = None

        if resp_dict is not None:
            try:
                describe = resp_dict['describe']
                if describe in ("true", "True"):
                    describe = True
            except Exception as e:
                describe = False
            if not describe:
                data_name = resp_dict['data_name']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoints runs the smart status for a given data source, it requires a GET call with the following options:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the data source\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

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
                + "| `trackme_eval_icons`"\
                + "| `trackme_smart_status_weekdays_to_human`"\
                + "| fillnull value=\"null\" data_name data_index data_sourcetype data_source_state data_lag_alert_kpis"\
                + "data_last_lag_seen data_last_ingestion_lag_seen data_max_lag_allowed data_last_time_seen data_monitoring_wdays status_message enable_behaviour_analytic dcount_host "\
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
                    data_monitoring_wdays = query_result["data_monitoring_wdays"]
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
                    status_message = query_result["status_message"]

                except Exception as e:
                    data_index = None
                    data_sourcetype = None
                    data_source_state = None
                    data_lag_alert_kpis = None
                    data_last_lag_seen = None
                    data_last_ingestion_lag_seen = None
                    data_max_lag_allowed = None
                    data_last_time_seen = None
                    data_monitoring_wdays = None
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
                    status_message = None

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

                    ###############################################################
                    # case: latest data is out of the acceptable window (lag event)
                    ###############################################################

                    report_name = None
                    report_desc = None

                    # To define the search, we need to know if the data source is a normal data source or an Elastic source
                    isElastic = False
                    if elastic_source_search_mode in ("null"):
                        isElastic = False
                    else:
                        isElastic = True

                    # There are different types of data sources, these can be regular data source or Elastic sources

                    ###############################################################
                    # subcase: data is in the future
                    ###############################################################

                    if data_source_state in ("orange") and not (re.search("week days rules conditions are not met", str(status_message)) or isOutlier in ("1")):

                        # Get lagging statistics from live data

                        # data source is regular
                        if (not isElastic):

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                            searchquery = "| tstats max(_time) as data_last_time_seen "\
                            + "where (index=" + str(data_index) + " sourcetype=" + str(data_sourcetype) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag<-600)"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                            report_name = "hosts_report"

                        # data source is Elastic and tstats
                        elif isElastic and elastic_source_search_mode in("tstats"):

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "| tstats max(_time) as data_last_time_seen "\
                            + "where (" + str(elastic_source_search_constraint) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag<-600)"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                            report_name = "hosts_report"

                        # data source is Elastic and raw
                        elif isElastic and elastic_source_search_mode in("raw"):

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "search " + str(elastic_source_search_constraint)\
                            + " | stats max(_time) as data_last_time_seen by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag<-600)"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                            report_name = "hosts_report"

                        # data source is Elastic and mstats
                        elif isElastic and elastic_source_search_mode in("mstats"):

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "| mstats latest(_value) as value where " + str(elastic_source_search_constraint) + " by host, metric_name span=1s"\
                            + " | stats max(_time) as lastTime by metric_name"\
                            + " | eval metric_lag=now()-lastTime"\
                            + " | where (metric_lag><-600)"\
                            + " | sort - limit=10 metric_lag"\
                            + " | foreach metric_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + " | fields metric_name, metric_lag"\
                            + " | eval summary = \"[ metric_name:\" . metric_name . \", metric_lag:\" . metric_lag . \" ]\""\
                            + " | stats values(summary) as summary"\
                            + " | fields summary | eval summary=mvjoin(mvsort(summary), \", \")"
                            
                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 24h time range starting now in the future
                                earliest_time = "now"
                                latest_time = "+24h"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | stats max(_time) as data_last_time_seen by host"\
                                + " | eval event_lag=now()-data_last_time_seen"\
                                + " | where (event_lag<-600)"\
                                + " | sort - limit=10 event_lag"\
                                + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                                + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                                report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                                report_name = "hosts_report"

                            # if lookup based
                            elif re.search("lookup:", str(elastic_source_search_constraint)):

                                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | " + str(elastic_source_from_part2)\
                                + " | stats max(_indextime) as lastIngest, min(_time) as earliestRecord, max(_time) as latestRecord, count as numberRecords, dc(host) as numberHost"\
                                + " | eval summary=\"[ lastIngest: \" . strftime(lastIngest, \"%c\") . \", latestRecord: \" . strftime(latestRecord, \"%c\") . \", earliestRecord: \" . strftime(earliestRecord, \"%c\") . \", numberRecords: \" . numberRecords . \", numberHosts: \" . numberHost . \" ]\" | fields summary"

                                report_desc = "[ description: Investigate lookup based data source (duration days, HH:MM:SS) ], "
                                report_name = "lookup_report"

                        # data source is Elastic, rest tstats
                        elif isElastic and elastic_source_search_mode in ("rest_tstats"):

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + "| tstats max(_time) as data_last_time_seen "\
                            + "where (" + str(elastic_source_from_part2) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag<-600)"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . \\" (event_lag: \\" . event_lag . \\")\\"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                            report_name = "hosts_report"

                        # data source is Elastic, rest raw
                        elif isElastic and elastic_source_search_mode in ("rest_raw"):

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " search " + str(elastic_source_from_part2)\
                            + " | stats max(_time) as data_last_time_seen by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag<-600)"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . \\" (event_lag: \\" . event_lag . \\")\\"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("rest_from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 24h time range starting now in the future
                                earliest_time = "now"
                                latest_time = "+24h"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": "-1h", "latest_time": "now"}
                                searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                                + " | from " + str(elastic_source_search_constraint)\
                                + " | stats max(_time) as data_last_time_seen by host"\
                                + " | eval event_lag=now()-data_last_time_seen"\
                                + " | where (event_lag<-600)"\
                                + " | sort - limit=10 event_lag"\
                                + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                                + ' | eval summary = host . \\" (event_lag: \\" . event_lag . \\")"'\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"\
                                + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                                report_desc = "[ description: report top 10 hosts indexing data in the future ], "
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

                            # calculate a 24h time range starting now in the future
                            earliest_time = "now"
                            latest_time = "+24h"

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " | mstats latest(_value) as value where " + str(elastic_source_from_part2) + " by host, metric_name span=1s"\
                            + " | stats max(_time) as lastTime by metric_name"\
                            + " | eval metric_lag=now()-lastTime"\
                            + " | where (metric_lag<-600)"\
                            + " | sort - limit=10 metric_lag"\
                            + " | foreach metric_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + " | fields metric_name, metric_lag"\
                            + " | eval summary = \\\"[ metric_name:\\\" . metric_name . \\\", metric_lag:\\\" . metric_lag . \\\" ]\\\""\
                            + " | stats values(summary) as summary"\
                            + " | fields summary | eval summary=mvjoin(mvsort(summary), \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"
                            
                            report_desc = "[ description: report top 10 hosts indexing data in the future ], "
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
                        current_delay = int(data_last_time_seen)-round(time.time())

                        # convert the current delay to a human friendly format
                        current_delay = str(datetime.timedelta(seconds=int(current_delay)))

                        # increment the smart_code by 5
                        smart_code += 5

                        results_message = '{' \
                        + '"data_name": "' + str(data_name)  + '", '\
                        + '"data_source_state": "' + str(data_source_state)  + '", '\
                        + '"smart_result": "TrackMe triggered an alert due to data indexed in the future which is likely to be caused by time zone misconfiguration '\
                        + 'at the ingestion level, the latest data available is: ' + str(human_last_datetime) + ', the data is in the future by: '\
                        + str(current_delay) + ' (days, HH:MM:SS)", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    elif data_lag_alert_kpis in ("all_kpis", "lag_event_kpi") and int(data_last_lag_seen)>int(data_max_lag_allowed):

                        # Get lagging statistics from live data

                        # data source is regular
                        if (not isElastic):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                            searchquery = "| tstats max(_time) as data_last_time_seen "\
                            + "where (index=" + str(data_index) + " sourcetype=" + str(data_sourcetype) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range ], "
                            report_name = "hosts_report"

                        # data source is Elastic and tstats
                        elif isElastic and elastic_source_search_mode in("tstats"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "| tstats max(_time) as data_last_time_seen "\
                            + "where (" + str(elastic_source_search_constraint) + ") by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range ], "
                            report_name = "hosts_report"

                        # data source is Elastic and raw
                        elif isElastic and elastic_source_search_mode in("raw"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "search " + str(elastic_source_search_constraint)\
                            + " | stats max(_time) as data_last_time_seen by host"\
                            + " | eval event_lag=now()-data_last_time_seen"\
                            + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 event_lag"\
                            + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic and mstats
                        elif isElastic and elastic_source_search_mode in("mstats"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
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
                            
                            report_desc = "[ description: report top 10 metrics out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 1h time range relative to the latest time seen in the data source
                                earliest_time = int(data_last_time_seen) - (1*3600)
                                latest_time = "now"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | stats max(_time) as data_last_time_seen by host"\
                                + " | eval event_lag=now()-data_last_time_seen"\
                                + " | where (event_lag>" + str(data_max_lag_allowed) + ")"\
                                + " | sort - limit=10 event_lag"\
                                + " | foreach event_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                                + ' | eval summary = host . " (event_lag: " . event_lag . ")"'\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                                report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                                report_name = "hosts_report"

                            # if lookup based
                            elif re.search("lookup:", str(elastic_source_search_constraint)):

                                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | " + str(elastic_source_from_part2)\
                                + " | stats max(_indextime) as lastIngest, min(_time) as earliestRecord, max(_time) as latestRecord, count as numberRecords, dc(host) as numberHost"\
                                + " | eval summary=\"[ lastIngest: \" . strftime(lastIngest, \"%c\") . \", latestRecord: \" . strftime(latestRecord, \"%c\") . \", earliestRecord: \" . strftime(earliestRecord, \"%c\") . \", numberRecords: \" . numberRecords . \", numberHosts: \" . numberHost . \" ]\" | fields summary"

                                report_desc = "[ description: Investigate lookup based data source (duration days, HH:MM:SS) ], "
                                report_name = "lookup_report"

                        # data source is Elastic, rest tstats
                        elif isElastic and elastic_source_search_mode in ("rest_tstats"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

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
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic, rest raw
                        elif isElastic and elastic_source_search_mode in ("rest_raw"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

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
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("rest_from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 1h time range relative to the latest time seen in the data source
                                earliest_time = int(data_last_time_seen) - (1*3600)
                                latest_time = "now"

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
                                + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                                report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
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

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

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
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"
                            
                            report_desc = "[ description: report top 10 metrics out of accepted event lag range (duration days, HH:MM:SS) ], "
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

                        if data_source_state in ("orange") and re.search("week days rules conditions are not met", str(status_message)):
                            smart_result = "TrackMe triggered an alert due to the latest data available that is out of the acceptable window, the maximal event lag allowed is: " + str(data_max_lag_allowed) + " seconds, while the latest data available is: " + str(human_last_datetime) + ", the data is late by: " + str(current_delay) + " (days, HH:MM:SS)"\
                                + ", however due to week days monitoring rules (" + str(data_monitoring_wdays) + "), the entity is currently in a state that will not generate an active alert."
                        else:
                            smart_result = "TrackMe triggered an alert due to the latest data available that is out of the acceptable window, the maximal event lag allowed is: " + str(data_max_lag_allowed) + " seconds, while the latest data available is: " + str(human_last_datetime) + ", the data is late by: " + str(current_delay) + " (days, HH:MM:SS)"

                        results_message = '{' \
                        + '"data_name": "' + str(data_name) + '", '\
                        + '"data_source_state": "' + str(data_source_state)  + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    #################################################
                    # case: ingestion lag is out of acceptable values
                    #################################################

                    elif data_lag_alert_kpis in ("all_kpis", "lag_ingestion_kpi") and int(data_last_ingestion_lag_seen)>int(data_max_lag_allowed):

                        # investigate top 10 lagging hosts
                        import splunklib.results as results

                        # data source is regular
                        if (not isElastic):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                            searchquery = "| tstats max(_indextime) as data_last_ingest "\
                            + "where (index=" + str(data_index) + " sourcetype=" + str(data_sourcetype) + ") by _time, index, sourcetype, host span=1s"\
                            + " | eval data_last_ingestion_lag_seen=data_last_ingest-_time"\
                            + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                            + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 avg_ingest_lag"\
                            + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + " | eval summary=host . \" (avg_ingest_lag: \" . avg_ingest_lag . \")\""\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts out of accepted ingestion lag range ], "
                            report_name = "hosts_report"

                        # data source is Elastic and tstats
                        elif isElastic and elastic_source_search_mode in("tstats"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                            searchquery = "| tstats max(_indextime) as data_last_ingest "\
                            + "where (" + str(elastic_source_search_constraint) + ") by _time, index, sourcetype, host span=1s"\
                            + " | eval data_last_ingestion_lag_seen=data_last_ingest-_time"\
                            + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                            + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 avg_ingest_lag"\
                            + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + " | eval summary=host . \" (avg_ingest_lag: \" . avg_ingest_lag . \")\""\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts out of accepted ingestion lag range ], "
                            report_name = "hosts_report"

                        # data source is Elastic and raw
                        elif isElastic and elastic_source_search_mode in("raw"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "search " + str(elastic_source_search_constraint)\
                            + " | eval data_last_ingestion_lag_seen=_indextime-_time"\
                            + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                            + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 avg_ingest_lag"\
                            + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                            + " | eval summary=host . \" (avg_ingest_lag: \" . avg_ingest_lag . \")\""\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic and mstats
                        elif isElastic and elastic_source_search_mode in("mstats"):

                            # mstats has no indextime, so this stage will not be reached
                            report_desc = None
                            report_name = None

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 1h time range relative to the latest time seen in the data source
                                earliest_time = int(data_last_time_seen) - (1*3600)
                                latest_time = "now"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | eval data_last_ingestion_lag_seen=_indextime-_time"\
                                + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                                + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                                + " | sort - limit=10 avg_ingest_lag"\
                                + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\"duration\"), round('<<FIELD>>', 0)) ]"\
                                + " | eval summary=host . \" (avg_ingest_lag: \" . avg_ingest_lag . \")\""\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \", \")"

                                report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                                report_name = "hosts_report"

                            # if lookup based
                            elif re.search("lookup:", str(elastic_source_search_constraint)):

                                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | " + str(elastic_source_from_part2)\
                                + " | stats max(_indextime) as lastIngest, min(_time) as earliestRecord, max(_time) as latestRecord, count as numberRecords, dc(host) as numberHost"\
                                + " | eval summary=\"[ lastIngest: \" . strftime(lastIngest, \"%c\") . \", latestRecord: \" . strftime(latestRecord, \"%c\") . \", earliestRecord: \" . strftime(earliestRecord, \"%c\") . \", numberRecords: \" . numberRecords . \", numberHosts: \" . numberHost . \" ]\" | fields summary"

                                report_desc = "[ description: Investigate lookup based data source (duration days, HH:MM:SS) ], "
                                report_name = "lookup_report"

                        # data source is Elastic, rest tstats
                        elif isElastic and elastic_source_search_mode in ("rest_tstats"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + "| tstats max(_indextime) as data_last_ingest "\
                            + "where (" + str(elastic_source_from_part2) + ") by _time, index, sourcetype, host span=1s"\
                            + " | eval data_last_ingestion_lag_seen=data_last_ingest-_time"\
                            + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                            + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 avg_ingest_lag"\
                            + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + " | eval summary=host . \\\" (avg_ingest_lag: \\\" . avg_ingest_lag . \\\")\\\""\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic, rest raw
                        elif isElastic and elastic_source_search_mode in ("rest_raw"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + "search " + str(elastic_source_from_part2)\
                            + " | eval data_last_ingestion_lag_seen=_indextime-_time"\
                            + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                            + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                            + " | sort - limit=10 avg_ingest_lag"\
                            + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                            + " | eval summary=host . \\\" (avg_ingest_lag: \\\" . avg_ingest_lag . \\\")\\\""\
                            + " | fields summary"\
                            + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("rest_from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 1h time range relative to the latest time seen in the data source
                                earliest_time = int(data_last_time_seen) - (1*3600)
                                latest_time = "now"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": "-1h", "latest_time": "now"}
                                searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                                + " | from " + str(elastic_source_from_part2)\
                                + " | eval data_last_ingestion_lag_seen=_indextime-_time"\
                                + " | stats avg(data_last_ingestion_lag_seen) as avg_ingest_lag, max(data_last_ingestion_lag_seen) as max_ingest_lag by host"\
                                + " | where (avg_ingest_lag>" + str(data_max_lag_allowed) + " OR max_ingest_lag>" + str(data_max_lag_allowed) + ")"\
                                + " | sort - limit=10 avg_ingest_lag"\
                                + " | foreach avg_ingest_lag [ eval <<FIELD>> = if('<<FIELD>>'>60, tostring(round('<<FIELD>>',0),\\\"duration\\\"), round('<<FIELD>>', 0)) ]"\
                                + " | eval summary=host . \\\" (avg_ingest_lag: \\\" . avg_ingest_lag . \\\")\\\""\
                                + " | fields summary"\
                                + " | stats values(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                                + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                                report_desc = "[ description: report top 10 hosts out of accepted event lag range (duration days, HH:MM:SS) ], "
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

                            # mstats has no indextime, so this stage will not be reached
                            report_desc = None
                            report_name = None

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

                        if data_source_state in ("orange") and re.search("week days rules conditions are not met", str(status_message)):
                            smart_result = "TrackMe triggered an alert due to indexing lag detected out of the acceptable window, the maximal ingestion lag allowed is: " + str(data_max_lag_allowed) + " seconds, while an ingestion lag of " + str(datetime.timedelta(seconds=int(data_last_ingestion_lag_seen))) + " (days, HH:MM:SS) was detected, review the hosts attached to this report to investigate the root cause."\
                                + " However due to week days monitoring rules (" + str(data_monitoring_wdays) + "), the entity is currently in a state that will not generate an active alert."
                        else:
                            smart_result = "TrackMe triggered an alert due to indexing lag detected out of the acceptable window, the maximal ingestion lag allowed is: " + str(data_max_lag_allowed) + " seconds, while an ingestion lag of " + str(datetime.timedelta(seconds=int(data_last_ingestion_lag_seen))) + " (days, HH:MM:SS) was detected, review the hosts attached to this report to investigate the root cause."

                        results_message = '{' \
                        + '"data_name": "' + str(data_name) + '", '\
                        + '"data_source_state": "' + str(data_source_state) + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    ###################################
                    # case: dcount host threshold unmet
                    ###################################

                    elif int(min_dcount_host)>0 and int(dcount_host)<int(min_dcount_host):

                        # Retrieve latest flip state

                        # calculate a 4h time range relative to the latest time seen in the data source
                        earliest_time = int(data_last_time_seen) - (24*3600)
                        latest_time = "now"

                        kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                        searchquery = " search `trackme_idx` source=\"flip_state_change_tracking\" object_category=\"data_source\" object=\"" + str(data_name) + "\" object_state=\"red\""\
                        + " | stats max(_time) as flipping_time | eval flipping_time=strftime(flipping_time, \"%c\")"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            flipping_time = query_result["flipping_time"]

                        except Exception as e:
                            flipping_time = None

                        # data source is regular
                        if (not isElastic):

                            # calculate a 24h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (24*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                            searchquery = "| tstats dc(host) as dcount_host where index=\"" + str(data_index) + "\" sourcetype=\"" + str(data_sourcetype) + "\" by _time span=1h"\
                            + " | timechart span=1h first(dcount_host) as dcount_host"\
                            + " | eval time=strftime(_time, \"%m/%d %H\")"\
                            + " | eval summary = time . \"h: \" . dcount_host . if(dcount_host>1, \" hosts\", \" host\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report hourly distinct count hosts last 24 hours ], "
                            report_name = "distinct_count_hosts_report"

                        # data source is Elastic and tstats
                        elif isElastic and elastic_source_search_mode in("tstats"):

                            # calculate a 24h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (24*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                            searchquery = "| tstats dc(host) as dcount_host where (" + str(elastic_source_search_constraint) + ") by _time span=1h"\
                            + " | timechart span=1h first(dcount_host) as dcount_host"\
                            + " | eval time=strftime(_time, \"%m/%d %H\")"\
                            + " | eval summary = time . \"h: \" . dcount_host . if(dcount_host>1, \" hosts\", \" host\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report hourly distinct count hosts last 24 hours ], "
                            report_name = "distinct_count_hosts_report"

                        # data source is Elastic and raw
                        elif isElastic and elastic_source_search_mode in("raw"):

                            # calculate a 24h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (24*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "search " + str(elastic_source_search_constraint)\
                            + " | timechart span=1h dc(host) as dcount_host"\
                            + " | eval time=strftime(_time, \"%m/%d %H\")"\
                            + " | eval summary = time . \"h: \" . dcount_host . if(dcount_host>1, \" hosts\", \" host\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report hourly distinct count hosts last 24 hours ], "
                            report_name = "hosts_report"

                        # data source is Elastic and mstats
                        elif isElastic and elastic_source_search_mode in("mstats"):

                            # calculate a 24h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (24*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "| mstats max(_value) where " + str(elastic_source_search_constraint) + " by host span=1h"\
                            + " | stats dc(host) as dcount_host by _time" \
                            + " | eval time=strftime(_time, \"%m/%d %H\")"\
                            + " | eval summary = time . \"h: \" . dcount_host . if(dcount_host>1, \" hosts\", \" host\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \", \")"

                            report_desc = "[ description: report hourly distinct count hosts last 24 hours ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 1h time range relative to the latest time seen in the data source
                                earliest_time = int(data_last_time_seen) - (3600)
                                latest_time = "now"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | timechart span=10m dc(host) as dcount_host"\
                                + " | eval time=strftime(_time, \"%m/%d %H:%M\")"\
                                + " | eval summary = time . \": \" . dcount_host . if(dcount_host>1, \" hosts\", \" host\")"\
                                + " | stats list(summary) as summary | eval summary=mvjoin(summary, \", \")"

                                report_desc = "[ description: report last relative hour distinct count hosts ], "
                                report_name = "hosts_report"

                            # if lookup based
                            elif re.search("lookup:", str(elastic_source_search_constraint)):

                                kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                                searchquery = "| from " + str(elastic_source_search_constraint)\
                                + " | " + str(elastic_source_from_part2)\
                                + " | stats max(_indextime) as lastIngest, min(_time) as earliestRecord, max(_time) as latestRecord, count as numberRecords, dc(host) as numberHost"\
                                + " | eval summary=\"[ lastIngest: \" . strftime(lastIngest, \"%c\") . \", latestRecord: \" . strftime(latestRecord, \"%c\") . \", earliestRecord: \" . strftime(earliestRecord, \"%c\") . \", numberRecords: \" . numberRecords . \", numberHosts: \" . numberHost . \" ]\" | fields summary"

                                report_desc = "[ description: Investigate lookup based data source (duration days, HH:MM:SS) ], "
                                report_name = "lookup_report"

                        # data source is Elastic, rest tstats
                        elif isElastic and elastic_source_search_mode in ("rest_tstats"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " | tstats dc(host) as dcount_host where (" + str(elastic_source_from_part2) + ") by _time span=1h"\
                            + " | timechart span=1h first(dcount_host) as dcount_host"\
                            + " | eval time=strftime(_time, \\\"%m/%d %H\\\")"\
                            + " | eval summary = time . \\\"h: \\\" . dcount_host . if(dcount_host>1, \\\" hosts\\\", \\\" host\\\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                            report_desc = "[ description: report last relative hour distinct count hosts ], "
                            report_name = "hosts_report"

                        # data source is Elastic, rest raw
                        elif isElastic and elastic_source_search_mode in ("rest_raw"):

                            # calculate a 4h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (4*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " search " + str(elastic_source_from_part2)\
                            + " | timechart span=1h dc(host) as dcount_host"\
                            + " | eval time=strftime(_time, \\\"%m/%d %H\\\")"\
                            + " | eval summary = time . \\\"h: \\\" . dcount_host . if(dcount_host>1, \\\" hosts\\\", \\\" host\\\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"                            
                            
                            report_desc = "[ description: report last relative hour distinct count hosts ], "
                            report_name = "hosts_report"

                        # data source is Elastic, from
                        elif isElastic and elastic_source_search_mode in ("rest_from"):

                            # if datamodel based
                            if re.search("datamodel:", str(elastic_source_search_constraint)):

                                # calculate a 1h time range relative to the latest time seen in the data source
                                earliest_time = int(data_last_time_seen) - (3600)
                                latest_time = "now"

                                # from datamodel searches are likely to be very slow, shorter the time range to the last 60 minutes
                                kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                                searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                                + " | from " + str(elastic_source_from_part2)\
                                + " | timechart span=10m dc(host) as dcount_host"\
                                + " | eval time=strftime(_time, \\\"%m/%d %H:%M\\\")"\
                                + " | eval summary = time . \\\": \\\" . dcount_host . if(dcount_host>1, \\\" hosts\\\", \\\" host\\\")"\
                                + " | stats list(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                                + " \" output_mode=\"csv\" earliest_time=\"" + str(earliest_time) + "\" latest_time=\"" + str(latest_time) + "\" | table value | restextractsummary"

                                report_desc = "[ description: report last relative hour distinct count hosts ], "
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

                            # calculate a 24h time range relative to the latest time seen in the data source
                            earliest_time = int(data_last_time_seen) - (24*3600)
                            latest_time = "now"

                            kwargs_search = {"app": "trackme", "earliest_time": earliest_time, "latest_time": latest_time}
                            searchquery = "| rest " + str(elastic_source_from_part1) + " /servicesNS/admin/search/search/jobs/export search=\""\
                            + " | mstats max(_value) where " + str(elastic_source_from_part2) + " by host span=1h"\
                            + " | stats dc(host) as dcount_host by _time" \
                            + " | eval time=strftime(_time, \\\"%m/%d %H\\\")"\
                            + " | eval summary = time . \\\"h: \\\" . dcount_host . if(dcount_host>1, \\\" hosts\\\", \\\" host\\\")"\
                            + " | stats list(summary) as summary | eval summary=mvjoin(summary, \\\", \\\")"\
                            + " \" output_mode=\"csv\" earliest_time=\"-4h\" latest_time=\"+4h\" | table value | restextractsummary"

                            report_desc = "[ description: report hourly distinct count hosts last 24 hours ], "
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

                        # define the message
                        if data_source_state in ("orange") and re.search("week days rules conditions are not met", str(status_message)):
                            smart_result = "TrackMe triggered an alert on " + str(flipping_time) + " due to the minimal distinct count of hosts configured for this data source (threshold: "\
                            + str(min_dcount_host) + " hosts) which condition is not met as only " + str(dcount_host) \
                            + " hosts are detected currently. Review this threshold and the current data source activity accordingly."\
                            + " However due to week days monitoring rules (" + str(data_monitoring_wdays) + "), the entity is currently in a state that will not generate an active alert."
                        else:
                            smart_result = "TrackMe triggered an alert on " + str(flipping_time) + " due to the minimal distinct count of hosts configured for this data source (threshold: "\
                            + str(min_dcount_host) + " hosts) which condition is not met as only " + str(dcount_host)\
                            + " hosts are detected currently. Review this threshold and the current data source activity accordingly."

                        # increment the smart_code by 30
                        smart_code += 30

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }

                    ##################################
                    # case: outliers anomaly detection
                    ##################################

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
                        lastOutlierReason = None
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
                        + "| eval lastOutlier=strftime(lastOutlier, \"%c\"),"\
                        + "lastOutlierReason=case(latest4hcount<lowerBound, \"EventCount beyond lowerBound\", latest4count>upperBound AND OutlierAlertOnUpper=\"true\", \"EventCount over upperBound\", isnull(lastOutlierReason), \"unknown\")"\
                        + "| foreach lowerBound upperBound latest4hcount [ eval <<FIELD>> = round('<<FIELD>>', 2) ]"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            countOutliers = query_result["countOutliers"]
                            lastOutlier = query_result["lastOutlier"]
                            lastOutlierReason = query_result["lastOutlierReason"]
                            latest4hcount = query_result["latest4hcount"]
                            lowerBound = query_result["lowerBound"]
                            upperBound = query_result["upperBound"]
                            OutlierAlertOnUpper = query_result["OutlierAlertOnUpper"]

                        except Exception as e:
                            countOutliers = None
                            lastOutlier = None
                            lastOutlierReason = None
                            latest4hcount = None
                            lowerBound = None
                            upperBound = None
                            OutlierAlertOnUpper = None

                        # increment the smart_code by 40
                        smart_code += 40

                        # define the message
                        if data_source_state in ("orange"):
                            smart_result = "TrackMe triggered an alert on this data source due to outliers detection in the "\
                            + "event count, outliers are based on the calculation of a lower and upper bound (if alerting on upper) determined "\
                            + "against the data source usual behaviour and outliers parameters. Review the correlation results to determine "\
                            + "if the behaviour is expected or symptomatic of an issue happening on the data source (lost of "\
                            + "sources or hosts, etc.) and proceed to any outliers configuration fine tuning if necessary."\
                            + " However due to week days monitoring rules (" + str(data_monitoring_wdays) + "), the entity is currently in a state that will not generate an active alert."
                        else:
                            smart_result =  "TrackMe triggered an alert on this data source due to outliers detection in the "\
                            + "event count, outliers are based on the calculation of a lower and upper bound (if alerting on upper) determined "\
                            + "against the data source usual behaviour and outliers parameters. Review the correlation results to determine "\
                            + "if the behaviour is expected or symptomatic of an issue happening on the data source (lost of "\
                            + "sources or hosts, etc.) and proceed to any outliers configuration fine tuning if necessary."\

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_outliers": "[ description: Last 24h outliers detection ], [ OutliersCount: ' \
                        + str(countOutliers) + ' ], [ latest4hcount: ' + str(latest4hcount) + ' ], [ lowerBound: ' \
                        + str(lowerBound) + ' ], [ upperBound: ' + str(upperBound) + ' ], [ lastOutlier: ' \
                        + str(lastOutlier) + ' ], [ lastOutlierReason: ' + str(lastOutlierReason) + ' ], [ OutlierAlertOnUpper: '\
                        + str(OutlierAlertOnUpper) + ' ]", '\
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '", '\
                        + '"correlation_data_sampling": "' + str(data_sampling_state) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }

                    elif isAnomaly in ("1"):

                        #############################################
                        # case: data sampling has detected an anomaly
                        #############################################

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
                            # About type of sources: not every type of data source is eligible to data sampling, only tstats and raw based (non rest) can reach that stage

                            kwargs_search = {"app": "trackme", "earliest_time": "-4h", "latest_time": "now"}
                            search_root = None

                            if not isElastic:
                                search_root = "search index=\"" + str(data_index) + "\" sourcetype=\"" + str(data_sourcetype) + "\""
                            elif isElastic and elastic_source_search_mode in("tstats", "raw"):
                                search_root = "search " + str(elastic_source_search_constraint)

                            searchquery = str(search_root)\
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

                        # define the message
                        if data_source_state in ("orange") and re.search("week days rules conditions are not met", str(status_message)):
                            smart_result = "TrackMe triggered an alert due to anomaly detection in the data sampling worfklow (reason: " + str(anomaly_reason)\
                            + " detected on " + str(anomaly_mtime) + "), "\
                            + " However due to week days monitoring rules (" + str(data_monitoring_wdays) + "), the entity is currently in a state that will not generate an active alert."\
                            + ", [ message: " + str(smart_correlation) + " ]"
                        else:
                            smart_result =  "TrackMe triggered an alert due to anomaly detection in the data sampling worfklow (reason: " + str(anomaly_reason)\
                            + " detected on " + str(anomaly_mtime) + "), [ message: " + str(smart_correlation) + " ]"

                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_source_state": "' + data_source_state + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_data_sampling": "description: [ Last 4h top event count/model ], ' + str(data_sampling_correlation) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }


                    else:

                        # Ops, this should not be reached, but in case
                        results = '{' \
                        + '"data_name": "' + data_name  + '", '\
                        + '"data_index": "' + data_index  + '", '\
                        + '"data_sourcetype": "' + data_sourcetype  + '", '\
                        + '"data_source_state": "' + data_source_state  + '", '\
                        + '"data_lag_alert_kpis": "' + str(data_lag_alert_kpis) + '", '\
                        + '"data_last_lag_seen": "' + str(data_last_lag_seen) + '", '\
                        + '"data_max_lag_allowed": "' + str(data_max_lag_allowed) + '", '\
                        + '"data_last_ingestion_lag_seen": "' + str(data_last_ingestion_lag_seen) + '", '\
                        + '"data_monitoring_wdays": "' + str(data_monitoring_wdays) + '", '\
                        + '"status_message": "' + str(status_message) + '", '\
                        + '"dcount_host": "' + str(dcount_host) + '", '\
                        + '"min_dcount_host": "' + str(min_dcount_host) + '", '\
                        + '"isOutlier": "' + str(isOutlier) + '", '\
                        + '"isAnomaly": "' + str(isAnomaly) + '", '\
                        + '"enable_behaviour_analytic": "' + str(enable_behaviour_analytic) + '", '\
                        + '"smart_result": "Ops! Sorry, it looks like an unexpected condition was reached, please submit an issue with this content.", '\
                        + '"smart_code": "' + "99" + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
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


    # Get smart status for data hosts
    def get_dh_smart_status(self, request_info, **kwargs):

        # By data_name
        data_host = None
        query_string = None

        describe = False

        # Retrieve from data
        try:
            resp_dict = json.loads(str(request_info.raw_args['payload']))
        except Exception as e:
            resp_dict = None

        if resp_dict is not None:
            try:
                describe = resp_dict['describe']
                if describe in ("true", "True"):
                    describe = True
            except Exception as e:
                describe = False
            if not describe:
                data_host = resp_dict['data_host']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoints runs the smart status for a given data host, it requires a GET call with the following options:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Define the KV query
        query_string = '{ "data_host": "' + data_host + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_host_monitoring"
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
                searchquery = "| inputlookup trackme_host_monitoring where _key=\"" + str(key) + "\""

                # spawn the search and get the results
                searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                # Get the results and display them using the ResultsReader
                try:
                    reader = results.ResultsReader(searchresults)
                    for item in reader:
                        query_result = item

                    data_host_state = query_result["data_host_state"]
                    data_lag_alert_kpis = query_result["data_lag_alert_kpis"]
                    data_last_lag_seen = query_result["data_last_lag_seen"]
                    data_last_ingestion_lag_seen = query_result["data_last_ingestion_lag_seen"]
                    data_max_lag_allowed = query_result["data_max_lag_allowed"]
                    data_last_time_seen = query_result["data_last_time_seen"]
                    isOutlier = query_result["isOutlier"]
                    enable_behaviour_analytic = query_result["enable_behaviour_analytic"]
                    data_host_alerting_policy = query_result["data_host_alerting_policy"]

                except Exception as e:
                    data_host_state = None
                    data_lag_alert_kpis = None
                    data_last_lag_seen = None
                    data_last_ingestion_lag_seen = None
                    data_max_lag_allowed = None
                    data_last_time_seen = None
                    enable_behaviour_analytic = None
                    isOutlier = None
                    data_host_alerting_policy = None

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
                searchquery = "search `trackme_idx` source=\"flip_state_change_tracking\" object_category=\"data_host\" object=\"" + str(data_host) + "\" | bucket _time span=4h | stats count by _time | stats stdev(count) as stdev perc95(count) as perc95 max(count) as max latest(count) as count sum(count) as sum"

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
                    flipping_correlation_msg = 'state: [ orange ], message: [ ' + 'The amount of flipping events is abnormally high (last 24h count: ' + str(flipping_sum) + ', perc95: ' + str(flipping_perc95) + ', stdev: ' + str(flipping_stdev) + ', last 4h count: ' + str(flipping_count) + '), review the data host activity to determine potential root causes leading the data flow to flip abnormally. ]'
                    # increment the smart_code by 1
                    smart_code += 1
                else:
                    flipping_correlation_msg = 'state: [ green ], message: [ There were no anomalies detected in the flipping state activity threshold. ]'

                #
                # Proceed
                #

                if data_host_state is None or data_host_state in ("green", "blue"):

                    results = '{' \
                    + '"data_host": "' + data_host  + '", '\
                    + '"data_host_state": "' + str(data_host_state) + '", '\
                    + '"smart_result": "The data host is currently in a normal state, therefore further investigations are not required at this stage.", '\
                    + '"smart_code": "' + str(smart_code) + '", '\
                    + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                    + '}'

                    return {
                        "payload": json.dumps(json.loads(results), indent=1),
                        'status': 200 # HTTP status code
                    }

                else:

                    # runs investigations

                    #
                    # host policy: retrieve the current global policy definition
                    #

                    global_host_policy = "track_per_host"

                    kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                    searchquery = "| makeresults | eval global_host_policy=`trackme_default_data_host_alert_policy` | fields - _time"

                    # spawn the search and get the results
                    searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                    # Get the results and display them using the ResultsReader
                    try:
                        reader = results.ResultsReader(searchresults)
                        for item in reader:
                            query_result = item
                        global_host_policy = query_result["global_host_policy"]

                    except Exception as e:
                        # Ops, default is track_per_host let's assume this is the case if for some reasons we failed to retrieve it
                        global_host_policy = "track_per_host"

                    # Now investigate the current status of the host:
                    if data_host_alerting_policy is not None and data_host_alerting_policy in ("global_policy") and global_host_policy in ("track_per_host"):
                        data_host_alerting_policy = "track_per_host"

                    elif data_host_alerting_policy is not None and data_host_alerting_policy in ("global_policy") and global_host_policy in ("track_per_sourcetype"):
                        data_host_alerting_policy = "track_per_sourcetype"

                    if data_host_alerting_policy is not None and data_host_alerting_policy in ("track_per_host"):
                        data_host_alerting_policy = "track_per_host"

                    elif data_host_alerting_policy is not None and data_host_alerting_policy in ("track_per_sourcetype"):
                        data_host_alerting_policy = "track_per_sourcetype"

                    # Hum, that is not possible normally, assume the default
                    else:
                        data_host_alerting_policy = "track_per_host"

                    ######################################
                    # case: lag event and/or lag ingestion
                    ######################################

                    report_name = None
                    report_desc = None

                    ######################################
                    # subcase: data indexed in the future
                    ######################################

                    if data_host_state in ("orange"):

                        # calculate a 24h time range in the future starting from now
                        earliest_time = "now"
                        latest_time = "+24h"

                        kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                        searchquery = "`trackme_smart_status_summary_future_dh(\"" + str(data_host) + "\")`"

                        report_desc = "[ description: sourcetypes in alert state ], "
                        report_name = "sourcetype_report"

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
                        current_delay = round(int(data_last_time_seen)-time.time())

                        # convert the current delay to a human friendly format
                        current_delay = str(datetime.timedelta(seconds=int(current_delay)))

                        # increment the smart_code by 5
                        smart_code += 5

                        smart_result = "TrackMe triggered an alert due to data detected in the future which is likely caused by time zone misconfiguration, "\
                        + "the latest data available is: " + str(human_last_datetime) + ", the data is in the future by: " + str(current_delay) + " (days, HH:MM:SS)"

                        results_message = '{' \
                        + '"data_host": "' + str(data_host)  + '", '\
                        + '"data_host_state": "' + str(data_host_state) + '", '\
                        + '"data_host_alerting_policy": "' + str(data_host_alerting_policy) + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    elif isOutlier in ("0"):

                        # calculate a 4h time range relative to the latest time seen in the data source
                        earliest_time = int(data_last_time_seen) - (4*3600)
                        latest_time = "now"

                        kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                        searchquery = "`trackme_smart_status_summary_dh(\"" + str(data_host) + "\")`"

                        report_desc = "[ description: sourcetypes in alert state ], "
                        report_name = "sourcetype_report"

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

                        if data_host_alerting_policy in ("track_per_host") and data_lag_alert_kpis in ("all_kpis", "lag_event_kpi") and int(data_last_lag_seen)>int(data_max_lag_allowed):
                            smart_result = "TrackMe triggered an alert due to the latest data available that is out of the acceptable window, "\
                            + "the maximal event lag allowed is: " + str(data_max_lag_allowed) + " seconds, while the latest data available is: "\
                            + str(human_last_datetime) + ", the data is late by: " + str(current_delay) + " (days, HH:MM:SS)"

                        elif data_host_alerting_policy in ("track_per_host") and data_lag_alert_kpis in ("all_kpis", "lag_ingestion_kpi") and int(data_last_ingestion_lag_seen)>int(data_max_lag_allowed):
                            smart_result = "TrackMe triggered an alert due to indexing lag detected out of the acceptable window, "\
                            + "the maximal ingestion lag allowed is: " + str(data_max_lag_allowed) + " seconds, while an ingestion lag of "\
                            + str(datetime.timedelta(seconds=int(data_last_ingestion_lag_seen))) + " (days, HH:MM:SS) was detected, review "\
                            + "the sourcetypes attached to this report to investigate the root cause."

                        elif data_host_alerting_policy in ("track_per_sourcetype"):
                            smart_result = "TrackMe triggered an alert due to one or more sourcetypes in alert state, "\
                            + "as the host policy is currently set to track per sourcetype, any sourcetype will impact the host global status. "\
                            + "Review the attached report, if these sourcetypes have been decomissioned or blocklisted, reset the host to clear "\
                            + "the current sourcetype knownledge."

                        else:
                            smart_result = None

                        results_message = '{' \
                        + '"data_host": "' + str(data_host)  + '", '\
                        + '"data_host_state": "' + str(data_host_state) + '", '\
                        + '"data_host_alerting_policy": "' + str(data_host_alerting_policy) + '", '\
                        + '"smart_result": "' + str(smart_result) + '", '\
                        + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results_message), indent=1),
                            'status': 200 # HTTP status code
                        }

                    ##################################
                    # case: outliers anomaly detection
                    ##################################

                    elif isOutlier in ("1"):

                        # first, retrieve different information we need to investigate the outliers
                        OutlierSpan = None

                        kwargs_search = {"app": "trackme", "earliest_time": "-5m", "latest_time": "now"}
                        searchquery = "| `trackme_outlier_table(trackme_host_monitoring, data_host, " + str(data_host) + ")` | fields OutlierSpan"

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
                        searchquery = "| `trackme_outlier_chart(data_host, " + str(data_host) + ", data_host, " + str(OutlierSpan) + ")`"\
                        + "| eval object_category=\"data_host\", object=\"" + str(data_host) + "\""\
                        + "| lookup trackme_host_monitoring data_host as object OUTPUT OutlierAlertOnUpper"\
                        + "| eval isOutlier=case("\
                        + "OutlierAlertOnUpper=\"false\", if(eventcount_4h_span<lowerBound, \"true\", \"false\"),"\
                        + "OutlierAlertOnUpper=\"true\", if(eventcount_4h_span<lowerBound OR eventcount_4h_span>upperBound, \"true\", \"false\")"\
                        + ")"\
                        + "| eventstats count(eval(isOutlier=\"true\")) as countOutliers"\
                        + "| where isOutlier=\"true\""\
                        + "| stats count as countOutliers, max(_time) as lastOutlier, latest(eventcount_4h_span) as latest4hcount, latest(lowerBound) as lowerBound, latest(upperBound) as upperBound, latest(OutlierAlertOnUpper) as OutlierAlertOnUpper"\
                        + "| eval lastOutlier=strftime(lastOutlier, \"%c\"),"\
                        + "lastOutlierReason=case(latest4hcount<lowerBound, \"EventCount beyond lowerBound\", latest4count>upperBound AND OutlierAlertOnUpper=\"true\", \"EventCount over upperBound\", isnull(lastOutlierReason), \"unknown\")"\
                        + "| foreach lowerBound upperBound latest4hcount [ eval <<FIELD>> = round('<<FIELD>>', 2) ]"

                        # spawn the search and get the results
                        searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                        # Get the results and display them using the ResultsReader
                        try:
                            reader = results.ResultsReader(searchresults)
                            for item in reader:
                                query_result = item
                            countOutliers = query_result["countOutliers"]
                            lastOutlier = query_result["lastOutlier"]
                            lastOutlierReason = query_result["lastOutlierReason"]
                            latest4hcount = query_result["latest4hcount"]
                            lowerBound = query_result["lowerBound"]
                            upperBound = query_result["upperBound"]
                            OutlierAlertOnUpper = query_result["OutlierAlertOnUpper"]

                        except Exception as e:
                            countOutliers = None
                            lastOutlier = None
                            lastOutlierReason = None
                            latest4hcount = None
                            lowerBound = None
                            upperBound = None
                            OutlierAlertOnUpper = None

                        # increment the smart_code by 40
                        smart_code += 40

                        results = '{' \
                        + '"data_host": "' + data_host  + '", '\
                        + '"data_host_state": "' + data_host_state  + '", '\
                        + '"smart_result": "TrackMe triggered an alert on this data host due to outliers detection in the '\
                        + 'event count, outliers are based on the calculation of a lower and upper bound (if alerting on upper) determined '\
                        + 'against the data host usual behaviour and outliers parameters. Review the correlation results to determine '\
                        + 'if the behaviour is expected or symptomatic of an issue happening on the data host (lost of '\
                        + 'sources, etc.) and proceed to any outliers configuration fine tuning if necessary.", '\
                        + '"smart_code": "' + str(smart_code) + '", ' \
                        + '"correlation_outliers": "[ description: Last 24h outliers detection ], [ OutliersCount: ' \
                        + str(countOutliers) + ' ], [ latest4hcount: ' + str(latest4hcount) + ' ], [ lowerBound: ' \
                        + str(lowerBound) + ' ], [ upperBound: ' + str(upperBound) + ' ], [ lastOutlier: ' \
                        + str(lastOutlier) + ' ], [ lastOutlierReason: ' + str(lastOutlierReason) + ' ], [ OutlierAlertOnUpper: '\
                        + str(OutlierAlertOnUpper) + ' ]", '\
                        + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
                            'status': 200 # HTTP status code
                        }

                    else:

                        # Ops, this should not be reached, but in case
                        results = '{' \
                        + '"data_host": "' + data_host  + '", '\
                        + '"data_host_state": "' + str(data_host_state) + '", '\
                        + '"data_lag_alert_kpis": "' + str(data_lag_alert_kpis) + '", '\
                        + '"data_last_lag_seen": "' + str(data_last_lag_seen) + '", '\
                        + '"data_max_lag_allowed": "' + str(data_max_lag_allowed) + '", '\
                        + '"data_last_ingestion_lag_seen": "' + str(data_last_ingestion_lag_seen) + '", '\
                        + '"data_host_alerting_policy": "' + str(data_host_alerting_policy) + '", '\
                        + '"isOutlier": "' + str(isOutlier) + '", '\
                        + '"enable_behaviour_analytic": "' + str(enable_behaviour_analytic) + '", '\
                        + '"smart_result": "Ops! Sorry, it looks like an unexpected condition was reached, please submit an issue with this content.", '\
                        + '"smart_code": "' + "99" + '"'\
                        + '}'

                        return {
                            "payload": json.dumps(json.loads(results), indent=1),
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

    # Get smart status for data hosts
    def get_mh_smart_status(self, request_info, **kwargs):

        # By metric_host
        metric_host = None
        query_string = None

        describe = False

        # Retrieve from data
        try:
            resp_dict = json.loads(str(request_info.raw_args['payload']))
        except Exception as e:
            resp_dict = None

        if resp_dict is not None:
            try:
                describe = resp_dict['describe']
                if describe in ("true", "True"):
                    describe = True
            except Exception as e:
                describe = False
            if not describe:
                metric_host = resp_dict['metric_host']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoints runs the smart status for a given metric_host host, it requires a GET call with the following options:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Define the KV query
        query_string = '{ "metric_host": "' + metric_host + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_metric_host_monitoring"
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
                searchquery = "| inputlookup trackme_metric_host_monitoring where _key=\"" + str(key) + "\""

                # spawn the search and get the results
                searchresults = service.jobs.oneshot(searchquery, **kwargs_search)

                # Get the results and display them using the ResultsReader
                try:
                    reader = results.ResultsReader(searchresults)
                    for item in reader:
                        query_result = item

                    metric_host_state = query_result["metric_host_state"]
                    metric_last_lag_seen = query_result["metric_last_lag_seen"]
                    metric_last_time_seen = query_result["metric_last_time_seen"]

                except Exception as e:
                    metric_host_state = None
                    metric_last_lag_seen = None
                    metric_last_time_seen = None

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
                searchquery = "search `trackme_idx` source=\"flip_state_change_tracking\" object_category=\"metric_host\" object=\"" + str(metric_host) + "\" | bucket _time span=4h | stats count by _time | stats stdev(count) as stdev perc95(count) as perc95 max(count) as max latest(count) as count sum(count) as sum"

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
                    flipping_correlation_msg = 'state: [ orange ], message: [ ' + 'The amount of flipping events is abnormally high (last 24h count: ' + str(flipping_sum) + ', perc95: ' + str(flipping_perc95) + ', stdev: ' + str(flipping_stdev) + ', last 4h count: ' + str(flipping_count) + '), review the data host activity to determine potential root causes leading the data flow to flip abnormally. ]'
                    # increment the smart_code by 1
                    smart_code += 1
                else:
                    flipping_correlation_msg = 'state: [ green ], message: [ There were no anomalies detected in the flipping state activity threshold. ]'

                #
                # Proceed
                #

                if metric_host_state is None or metric_host_state in ("green", "blue"):

                    results = '{' \
                    + '"metric_host": "' + metric_host  + '", '\
                    + '"metric_host_state": "' + str(metric_host_state) + '", '\
                    + '"smart_result": "The metric host is currently in a normal state, therefore further investigations are not required at this stage.", '\
                    + '"smart_code": "' + str(smart_code) + '", '\
                    + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                    + '}'

                    return {
                        "payload": json.dumps(json.loads(results), indent=1),
                        'status': 200 # HTTP status code
                    }

                else:

                    # runs investigations

                    report_name = None
                    report_desc = None

                    # we get current last 5 minutes of data
                    earliest_time = "-5m"
                    latest_time = "now"

                    kwargs_search = {"app": "trackme", "earliest_time": str(earliest_time), "latest_time": str(latest_time)}
                    searchquery = "| `trackme_smart_status_summary_mh(\"" + str(metric_host) + "\")`"

                    report_desc = "[ description: metrics in alert state ], "
                    report_name = "metric_category_report"

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
                    human_last_datetime = datetime.datetime.fromtimestamp(int(metric_last_time_seen)).strftime('%c')

                    # eval current delay
                    current_delay = round(time.time()-int(metric_last_time_seen))

                    # convert the current delay to a human friendly format
                    current_delay = str(datetime.timedelta(seconds=int(current_delay)))

                    # increment the smart_code by 10
                    smart_code += 10

                    smart_result = "TrackMe triggered an alert due to one or more metrics latest availability that are out of the acceptable time window, "\
                    + "the very last metric (between any metrics) for this host was received on: " + str(human_last_datetime) + ", global delay if any: " + str(current_delay) + " (days, HH:MM:SS)"

                    results_message = '{' \
                    + '"metric_host": "' + str(metric_host)  + '", '\
                    + '"metric_host_state": "' + str(metric_host_state) + '", '\
                    + '"smart_result": "' + str(smart_result) + '", '\
                    + '"' + str(report_name) + '": "' + str(report_desc) + str(summary) + '", '\
                    + '"smart_code": "' + str(smart_code) + '", ' \
                    + '"correlation_flipping_state": "' + str(flipping_correlation_msg) + '"'\
                    + '}'

                    return {
                        "payload": json.dumps(json.loads(results_message), indent=1),
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

