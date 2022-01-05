from __future__ import absolute_import, division, print_function, unicode_literals

__name__ = "trackme_rest_handler_hybrid_trackers.py"
__author__ = "TrackMe Limited"
__copyright__ = "Copyright 2021, TrackMe Limited, U.K."
__credits__ = ["Guilhem Marchand"]
__license__ = "TrackMe Limited, all rights reserved"
__version__ = "0.1.0"
__maintainer__ = "TrackMe Limited, U.K."
__email__ = "support@trackme-solutions.com"
__status__ = "PRODUCTION"

import logging
import os, sys
import splunk
import splunk.entity
import splunk.Intersplunk
import json
import requests
import time
import uuid
from urllib.parse import urlencode

splunkhome = os.environ['SPLUNK_HOME']

# set logging
logger = logging.getLogger(__name__)
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_rest_api.log", 'a')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(filename)s %(funcName)s %(lineno)d %(message)s')
filehandler.setFormatter(formatter)
log = logging.getLogger()
for hdlr in log.handlers[:]:
    if isinstance(hdlr,logging.FileHandler):
        log.removeHandler(hdlr)
log.addHandler(filehandler)
log.setLevel(logging.INFO)

sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import trackme_rest_handler
import splunklib.client as client


class TrackMeHandlerHybridTracker_v1(trackme_rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerHybridTracker_v1, self).__init__(command_line, command_arg, logger)

    # Create a local hybrid tracker
    def post_hybrid_local_tracker(self, request_info, **kwargs):

        # args
        tracker_name = None
        search_mode = None
        root_constraint = None
        break_by_field = None
        owner = None
        earliest = None
        latest = None
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

            # gets args
            if not describe:

                #
                # mandatory args
                #

                # tracker name, convert to lower case and remove spaces
                tracker_name = resp_dict['tracker_name']
                if tracker_name:
                    tracker_name = tracker_name.lower().replace(" ", "_").replace("-", "_")
                    # include a random UUID
                    tracker_name = str(tracker_name) + "_" + str(uuid.uuid4())
                    # report name len is 100 chars max
                    tracker_name = tracker_name[:100]

                # search_mode: accepted values are: tstats,raw
                search_mode = resp_dict['search_mode']
                if not search_mode in ('tstats', 'raw'):
                    search_mode = 'tstats'

                # the root constraing of the tracker
                root_constraint = resp_dict['root_constraint']

                # the break by fields sequence, expressed as a comma separated list of fields
                break_by_field = resp_dict['break_by_field']
                if break_by_field:
                    break_by_field = break_by_field.lower().replace(" ", "")

                #
                # optional args
                #

                try:
                    owner = resp_dict['owner']
                except Exception as e:
                    owner = 'admin'

                # Update comment is optional and used for audit changes
                try:
                    update_comment = resp_dict['update_comment']
                except Exception as e:
                    update_comment = "API update"

                # earliest and latest for the tracker, if not specified, defaults to -4h / +4h
                try:
                    earliest = resp_dict['earliest']
                except Exception as e:
                    earliest = "-4h"

                try:
                    latest = resp_dict['latest']
                except Exception as e:
                    latest = "+4h"

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        # if describe is requested, show the usage
        if describe:

            response = "{\"describe\": \"This endpoint allows creating a custom hybrid tracker for data sources, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"tracker_name\": \"name of the hybrid tracker report\", "\
                + "\"search_mode\": \"the search mode for the tracker, can be tstats or raw\", "\
                + "\"root_constraint\": \"the tracker report root search constraint, to define search filters scoping the data set\", "\
                + "\"break_by_field\": \"the break by key field, used to discover and maintain the entities via this tracker\", "\
                + "\"owner\": \"Optional, the Splunk user owning the objects to be created, defaults to admin\", "\
                + "\"earliest\": \"Optional, the earliest time value for the tracker, defaults to -4h\", "\
                + "\"latest\": \"Optional, the latest time value for the tracker, defaults to +4h\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # run creation
        else:

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=request_info.session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']

            # Get service
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            # set loglevel
            loglevel = 'INFO'
            conf_file = "trackme_settings"
            confs = service.confs[str(conf_file)]
            for stanza in confs:
                if stanza.name == 'logging':
                    for stanzakey, stanzavalue in stanza.content.items():
                        if stanzakey == "loglevel":
                            loglevel = stanzavalue
            logginglevel = logging.getLevelName(loglevel)
            log.setLevel(logginglevel)

            # Define an header for requests authenticated communications with splunkd
            header = {
                'Authorization': 'Splunk %s' % request_info.session_key,
                'Content-Type': 'application/json'}

            # Get audit service
            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            service_audit = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            try:
                collection_audit = service_audit.kvstore[collection_name_audit]

            except Exception as e:
                logging.error('Warn: exception encountered while getting the audit collection service: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered while getting the audit collection service: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 1: for local trackers, init a variable only
            #

            if break_by_field:
                trackme_root_splitby = "index,sourcetype," + str(break_by_field)
            else:
                trackme_root_splitby = "index,sourcetype"

            #
            # step 2: create the intermediate macro
            #

            macro_name = "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name)
            macros = service.confs["macros"]

            if search_mode in 'tstats':
                definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                    "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                    "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                    "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                    "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                    "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                    "`comment(\"#### create the data_name value ####\")`\n" +\
                    "| eval data_name=data_index . \":\" . data_sourcetype . \":\" . \"|key:\" . \"" + str(break_by_field) + "\" . \"|\" . " + str(break_by_field)
            elif search_mode in 'raw':
                definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                    "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                    "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                    "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                    "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                    "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                    "`comment(\"#### create the data_name value ####\")`\n" +\
                    "| eval data_name=data_index . \":\" . data_sourcetype . \":\" . \"|rawkey:\" . \"" + str(break_by_field) + "\" . \"|\" . " + str(break_by_field)

            # create the macro
            try:
                macros.create(name=str(macro_name), **{"app": "trackme", "sharing": "app", "definition": str(definition), "owner": str(owner)})

            except Exception as e:
                logging.error('Warn: exception encountered while creating the break by fields macro: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered while creating the break by fields macro: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            record_url = 'https://localhost:' + str(splunkd_port) \
                        + '/servicesNS/admin/trackme/data/macros/' + macro_name + "/acl"

            response = requests.post(record_url, headers=header, data={'owner' : str(owner), 'sharing' : 'app', 'perms.write' : 'admin,trackme_admin', 'perms.read' : '*'},
                                    verify=False)

            #
            # step 3: create the abstract report
            #

            report_name = "trackme_abstract_root_hybrid_" + str(tracker_name)
            if search_mode in 'tstats':
                report_search = "| `trackme_tstats` max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, " +\
                    "count as data_eventcount, dc(host) as dcount_host where index=* sourcetype=* " + str(root_constraint) + " by " + str(trackme_root_splitby) + "\n" +\
                    "`comment(\"#### tstats result table is loaded ####\")`\n" +\
                    "| eval data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\n" +\
                    "`comment(\"#### intermediate calculation ####\")`\n" +\
                    "| `" + "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name) + "`\n" +\
                    "`comment(\"#### call the abstract macro ####\")`\n" +\
                    "`trackme_data_source_tracker_abstract`"
            elif search_mode in 'raw':
                report_search = "index=* sourcetype=* " + str(root_constraint) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, " +\
                    "count as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                    "`comment(\"#### stats result table is loaded ####\")`\n" +\
                    "| eval data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\n" +\
                    "`comment(\"#### intermediate calculation ####\")`\n" +\
                    "| `" + "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name) + "`\n" +\
                    "`comment(\"#### call the abstract macro ####\")`\n" +\
                    "`trackme_data_source_tracker_abstract`"

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
                logging.error('Warn: exception encountered while creating the abstract tracker report: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered while creating the abstract tracker report: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # update the properties
            newtracker_update = service.saved_searches[str(report_name)]

            # Complete the report definition
            kwargs = {"description": "TrackMe abstract hybrid root tracker",
                    "is_scheduled": False}

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 4: create the short term wrapper
            #

            report_name = "trackme_tracker_hybrid_" + str(tracker_name) + "_wrapper"
            report_search = "| savedsearch \"" + "trackme_abstract_root_hybrid_" + str(tracker_name) + "\"\n" +\
                "`comment(\"#### collects latest collection state into the summary index ####\")`\n" +\
                "| `trackme_collect_state(\"current_state_tracking:data_source\", \"data_name\")`\n" +\
                "`comment(\"#### output flipping change status if changes ####\")`\n" +\
                "| `trackme_get_flip(data_source_state, data_previous_source_state, data_name, trackme_audit_flip_temp_data_source)`\n" +\
                "| `trackme_outputlookup(trackme_data_source_monitoring, key)`\n" +\
                "| where data_source_is_online=\"true\"\n" +\
                "| `trackme_mcollect(data_name, data_source, \"metric_name:trackme.eventcount_4h=data_eventcount, " +\
                "metric_name:trackme.hostcount_4h=dcount_host, metric_name:trackme.lag_event_sec=data_last_lag_seen, " +\
                "metric_name:trackme.lag_ingestion_sec=data_last_ingestion_lag_seen\", \"object_category, object, OutlierTimePeriod, enable_behaviour_analytic\")`\n" +\
                "| stats count as entities_count"

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # update the properties
            newtracker_update = service.saved_searches[str(report_name)]

            # Complete the report definition
            kwargs = {"description": "TrackMe hybrid short term wrapper",
                    "is_scheduled": False,
                    "dispatch.earliest_time": str(earliest),
                    "dispatch.latest_time": str(latest)}

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 5: create the short term tracker
            #

            report_name = "trackme_tracker_hybrid_" + str(tracker_name) + "_tracker"
            report_search = "| trackmetrackerexecutor component=\"hybrid_trackers\" report=\"" + "trackme_tracker_hybrid_" + str(tracker_name) + "_wrapper" + "\" earliest=\"" + str(earliest) + "\" latest=\"" + str(latest) + "\""

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # update the properties
            newtracker_update = service.saved_searches[str(report_name)]

            # Complete the report definition
            kwargs = {"description": "TrackMe hybrid short term tracker",
                    "is_scheduled": True,
                    "cron_schedule": "*/5 * * * *",
                    "dispatch.earliest_time": str(earliest),
                    "dispatch.latest_time": str(latest)}

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

        #
        # END
        #

        # re-transform as a string
        if not break_by_field:
            break_by_field = 'none'

        audit_record = json.dumps({
                "aggreg_intermediate_macro": "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name),
                "abstract_report": "trackme_abstract_root_hybrid_" + str(tracker_name),
                "wrapper_report": "trackme_tracker_hybrid_" + str(tracker_name) + "_wrapper",
                "tracker_report": "trackme_tracker_hybrid_" + str(tracker_name) + "_tracker",
                "root_constraint": str(root_constraint),
                "tracker_name": str(tracker_name),
                "break_by_field": str(break_by_field),
                "search_mode": str(search_mode),
                "earliest": str(earliest),
                "latest": str(latest),
                "action": "success"
                })

        # Record an audit change
        current_time = int(round(time.time() * 1000))
        user = request_info.user

        try:

            # Insert the record
            collection_audit.data.insert(json.dumps({    
                "time": str(current_time),
                "user": str(user),
                "action": "success",
                "change_type": "add hybrid tracker",
                "object": "trackme_tracker_hybrid_" + str(tracker_name),
                "object_category": "hybrid_tracker",
                "object_attrs": str(audit_record),
                "result": "N/A",
                "comment": str(update_comment)
                }))

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

        # final return
        logging.info(str(audit_record))
        return {
            "payload": str(audit_record),
            'status': 200 # HTTP status code
        }

    # Create a remote hybrid tracker
    def post_hybrid_remote_tracker(self, request_info, **kwargs):

        # args
        tracker_name = None
        search_mode = None
        root_constraint = None
        break_by_field = None
        owner = None
        earliest = None
        latest = None
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

            # gets args
            if not describe:

                #
                # mandatory args
                #

                # tracker name, convert to lower case and remove spaces
                tracker_name = resp_dict['tracker_name']
                if tracker_name:
                    tracker_name = tracker_name.lower().replace(" ", "_").replace("-", "_")
                    # include a random UUID
                    tracker_name = str(tracker_name) + "_" + str(uuid.uuid4())
                    # report name len is 100 chars max
                    tracker_name = tracker_name[:100]

                # remote account
                account = resp_dict['account']

                # search_mode: accepted values are: tstats,raw
                search_mode = resp_dict['search_mode']
                if not search_mode in ('tstats', 'raw'):
                    search_mode = 'tstats'

                # the root constraing of the tracker
                root_constraint = resp_dict['root_constraint']

                #
                # optional args
                #

                try:
                    owner = resp_dict['owner']
                except Exception as e:
                    owner = 'admin'

                # Update comment is optional and used for audit changes
                try:
                    update_comment = resp_dict['update_comment']
                except Exception as e:
                    update_comment = "API update"

                # earliest and latest for the tracker, if not specified, defaults to -4h / +4h
                try:
                    earliest = resp_dict['earliest']
                except Exception as e:
                    earliest = "-4h"

                try:
                    latest = resp_dict['latest']
                except Exception as e:
                    latest = "+4h"

                # Optional the additional break by field
                try:
                    break_by_field = resp_dict['break_by_field']
                except Exception as e:
                    break_by_field = None
                # accept none as a way to deactivate the option
                if break_by_field == 'none':
                    break_by_field = None

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        # if describe is requested, show the usage
        if describe:

            response = "{\"describe\": \"This endpoint allows creating a custom remote hybrid tracker for data sources, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"tracker_name\": \"name of the hybrid tracker report\", "\
                + "\"account\": \"name of tremote Splunk deployment account as configured in TrackMe\", "\
                + "\"search_mode\": \"the search mode for the tracker, can be tstats or raw\", "\
                + "\"root_constraint\": \"the tracker report root search constraint, to define search filters scoping the data set\", "\
                + "\"break_by_field\": \"Optional, the break by key field, used to discover and maintain the entities via this tracker\", "\
                + "\"owner\": \"Optional, the Splunk user owning the objects to be created, defaults to admin\", "\
                + "\"earliest\": \"Optional, the earliest time value for the tracker, defaults to -4h\", "\
                + "\"latest\": \"Optional, the latest time value for the tracker, defaults to +4h\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # run creation
        else:

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=request_info.session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']

            # Get service
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            # set loglevel
            loglevel = 'INFO'
            conf_file = "trackme_settings"
            confs = service.confs[str(conf_file)]
            for stanza in confs:
                if stanza.name == 'logging':
                    for stanzakey, stanzavalue in stanza.content.items():
                        if stanzakey == "loglevel":
                            loglevel = stanzavalue
            logginglevel = logging.getLevelName(loglevel)
            log.setLevel(logginglevel)

            # Define an header for requests authenticated communications with splunkd
            header = {
                'Authorization': 'Splunk %s' % request_info.session_key,
                'Content-Type': 'application/json'}

            # Get audit service
            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            service_audit = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            try:
                collection_audit = service_audit.kvstore[collection_name_audit]

            except Exception as e:
                logging.error('Warn: exception encountered while getting the audit collection service: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered while getting the audit collection service: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 1: for remote trackers, init a variable only
            #

            if break_by_field:
                trackme_root_splitby = "index,sourcetype," + str(break_by_field)
            else:
                trackme_root_splitby = "index,sourcetype"

            #
            # step 2: create the intermediate macro
            #

            macro_name = "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name)
            macros = service.confs["macros"]

            if break_by_field:

                if search_mode in 'tstats':
                    definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                        "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                        "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                        "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                        "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                        "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                        "`comment(\"#### create the data_name value ####\")`\n" +\
                        "| eval data_name=\"remote:|account:" + str(account.replace('"', '')) + "|\" . data_index . \":\" . data_sourcetype . \":\" . \"|key:\" . \"" + str(break_by_field) + "\" . \"|\" . " + str(break_by_field)
                elif search_mode in 'raw':
                    definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                        "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                        "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                        "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                        "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                        "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                        "`comment(\"#### create the data_name value ####\")`\n" +\
                        "| eval data_name=\"remoteraw:|account:" + str(account.replace('"', '')) + "|\" . data_index . \":\" . data_sourcetype . \":\" . \"|rawkey:\" . \"" + str(break_by_field) + "\" . \"|\" . " + str(break_by_field)

            else:

                if search_mode in 'tstats':
                    definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                        "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                        "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                        "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                        "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                        "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                        "`comment(\"#### create the data_name value ####\")`\n" +\
                        "| eval data_name=\"remote:|account:" + str(account.replace('"', '')) + "|\" . data_index . \":\" . data_sourcetype"
                elif search_mode in 'raw':
                    definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                        "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                        "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) + "\n" +\
                        "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                        "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                        "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                        "`comment(\"#### create the data_name value ####\")`\n" +\
                        "| eval data_name=\"remoteraw:|account:" + str(account.replace('"', '')) + "|\" . data_index . \":\" . data_sourcetype"

            # create the macro
            try:
                macros.create(name=str(macro_name), **{"app": "trackme", "sharing": "app", "definition": str(definition), "owner": str(owner)})

            except Exception as e:
                logging.error('Warn: exception encountered while creating the break by fields macro: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered while creating the break by fields macro: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            record_url = 'https://localhost:' + str(splunkd_port) \
                        + '/servicesNS/admin/trackme/data/macros/' + macro_name + "/acl"

            response = requests.post(record_url, headers=header, data={'owner' : str(owner), 'sharing' : 'app', 'perms.write' : 'admin,trackme_admin', 'perms.read' : '*'},
                                    verify=False)

            #
            # step 3: create the abstract report
            #

            report_name = "trackme_abstract_root_hybrid_" + str(tracker_name)
            if search_mode in 'tstats':
                report_search = "| splunkremotesearch account=\"" + str(account) + "\"" +\
                    " search=\"" + "| tstats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, " +\
                    "count as data_eventcount, dc(host) as dcount_host where index=* sourcetype=* " + str(root_constraint.replace('"', '\\"')) + " by " + str(trackme_root_splitby) +\
                    "\" " + "earliest=\"" + str(earliest) + "\" " + "latest=\"" + str(latest) + "\" | spath" + "\n" +\
                    "`comment(\"#### tstats result table is loaded ####\")`\n" +\
                    "| eval data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\n" +\
                    "`comment(\"#### intermediate calculation ####\")`\n" +\
                    "| `" + "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name) + "`\n" +\
                    "`comment(\"#### call the abstract macro ####\")`\n" +\
                    "`trackme_data_source_tracker_abstract`"

            elif search_mode in 'raw':
                report_search = "| splunkremotesearch account=\"" + str(account) + "\"" +\
                    " search=\"" + "search index=* sourcetype=* " + str(root_constraint.replace('"', '\\"')) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, " +\
                    "count as data_eventcount, dc(host) as dcount_host by " + str(trackme_root_splitby) +\
                    "\" " + "earliest=\"" + str(earliest) + "\" " + "latest=\"" + str(latest) + "\" | spath" + "\n" +\
                    "`comment(\"#### stats result table is loaded ####\")`\n" +\
                    "| eval data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\n" +\
                    "`comment(\"#### intermediate calculation ####\")`\n" +\
                    "| `" + "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name) + "`\n" +\
                    "`comment(\"#### call the abstract macro ####\")`\n" +\
                    "`trackme_data_source_tracker_abstract`"

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
                logging.error('Warn: exception encountered while creating the abstract tracker report: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered while creating the abstract tracker report: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # update the properties
            newtracker_update = service.saved_searches[str(report_name)]

            # Complete the report definition
            kwargs = {"description": "TrackMe abstract hybrid root tracker",
                    "is_scheduled": False}

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 4: create the short term wrapper
            #

            report_name = "trackme_tracker_hybrid_" + str(tracker_name) + "_wrapper"
            report_search = "| savedsearch \"" + "trackme_abstract_root_hybrid_" + str(tracker_name) + "\"\n" +\
                "`comment(\"#### collects latest collection state into the summary index ####\")`\n" +\
                "| `trackme_collect_state(\"current_state_tracking:data_source\", \"data_name\")`\n" +\
                "`comment(\"#### output flipping change status if changes ####\")`\n" +\
                "| `trackme_get_flip(data_source_state, data_previous_source_state, data_name, trackme_audit_flip_temp_data_source)`\n" +\
                "| `trackme_outputlookup(trackme_data_source_monitoring, key)`\n" +\
                "| where data_source_is_online=\"true\"\n" +\
                "| `trackme_mcollect(data_name, data_source, \"metric_name:trackme.eventcount_4h=data_eventcount, " +\
                "metric_name:trackme.hostcount_4h=dcount_host, metric_name:trackme.lag_event_sec=data_last_lag_seen, " +\
                "metric_name:trackme.lag_ingestion_sec=data_last_ingestion_lag_seen\", \"object_category, object, OutlierTimePeriod, enable_behaviour_analytic\")`\n" +\
                "| stats count as entities_count"

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # update the properties
            newtracker_update = service.saved_searches[str(report_name)]

            # Complete the report definition
            kwargs = {"description": "TrackMe hybrid wrapper",
                    "dispatch.earliest_time": str(earliest),
                    "dispatch.latest_time": str(latest),
                    "is_scheduled": False}

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 5: create the short term tracker
            #

            report_name = "trackme_tracker_hybrid_" + str(tracker_name) + "_tracker"
            report_search = "| trackmetrackerexecutor component=\"hybrid_trackers\" report=\"" + "trackme_tracker_hybrid_" + str(tracker_name) + "_wrapper" + "\" earliest=\"" + str(earliest) + "\" latest=\"" + str(latest) + "\""

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # update the properties
            newtracker_update = service.saved_searches[str(report_name)]

            # Complete the report definition
            kwargs = {"description": "TrackMe hybrid short term tracker",
                    "is_scheduled": True,
                    "cron_schedule": "*/5 * * * *",
                    "dispatch.earliest_time": str(earliest),
                    "dispatch.latest_time": str(latest)}

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                logging.error('Warn: exception encountered: ' + str(e))
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

        #
        # END
        #

        # re-transform as a string
        if not break_by_field:
            break_by_field = 'none'

        audit_record = json.dumps({
                "account": str(account),
                "aggreg_intermediate_macro": "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name),
                "abstract_report": "trackme_abstract_root_hybrid_" + str(tracker_name),
                "wrapper_report": "trackme_tracker_hybrid_" + str(tracker_name) + "_wrapper",
                "tracker_report": "trackme_tracker_hybrid_" + str(tracker_name) + "_tracker",
                "root_constraint": str(root_constraint),
                "tracker_name": str(tracker_name),
                "break_by_field": str(break_by_field),
                "search_mode": str(search_mode),
                "earliest": str(earliest),
                "latest": str(latest),
                "action": "success"
                })

        # Record an audit change
        current_time = int(round(time.time() * 1000))
        user = request_info.user

        try:

            # Insert the record
            collection_audit.data.insert(json.dumps({    
                "time": str(current_time),
                "user": str(user),
                "action": "success",
                "change_type": "add remote hybrid tracker with custom key",
                "object": "trackme_tracker_hybrid_" + str(tracker_name),
                "object_category": "hybrid_tracker",
                "object_attrs": str(audit_record),
                "result": "N/A",
                "comment": str(update_comment)
                }))

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

        # final return
        logging.info(str(audit_record))
        return {
            "payload": str(audit_record),
            'status': 200 # HTTP status code
        }
