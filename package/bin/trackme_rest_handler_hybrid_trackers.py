from __future__ import absolute_import, division, print_function, unicode_literals

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
from urllib.parse import urlencode

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import trackme_rest_handler
import splunklib.client as client


class TrackMeHandlerHybridTracker_v1(trackme_rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerHybridTracker_v1, self).__init__(command_line, command_arg, logger)

    # Disable monitoring by object name
    def post_hybrid_tracker(self, request_info, **kwargs):

        # args
        tracker_name = None
        search_mode = None
        root_constraint = None
        break_by_field = None
        owner = None
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
                # Generate the tenant_id from tenant_name
                if tracker_name:
                    tracker_name = tracker_name.lower().replace(" ", "_").replace("-", "_")

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

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        # if describe is requested, show the usage
        if describe:

            response = "{\"describe\": \"This endpoint allows creating a custom hybrid tracker for data sources, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the data source\", "\
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

            # Define an header for requests authenticated communications with splunkd
            header = {
                'Authorization': 'Splunk %s' % request_info.session_key,
                'Content-Type': 'application/json'}

            # Get SDK service
            try:
                service = client.connect(
                    owner="nobody",
                    app="trackme",
                    port=splunkd_port,
                    token=request_info.session_key
                )

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered while getting the SDK service to splunkd: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

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
                return {
                    'payload': 'Warn: exception encountered while getting the audit collection service: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 1: create the split by macro
            #

            macro_name = "trackme_root_splitby" + "_hybrid_" + str(tracker_name)
            macros = service.confs["macros"]
            definition = "index,sourcetype," + str(break_by_field)

            # create the macro
            try:
                macros.create(name=str(macro_name), **{"app": "trackme", "sharing": "app", "definition": str(definition), "owner": str(owner)})

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered while creating the break by fields macro: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            record_url = 'https://localhost:' + str(splunkd_port) \
                        + '/servicesNS/admin/trackme/data/macros/' + macro_name + "/acl"

            response = requests.post(record_url, headers=header, data={'owner' : str(owner), 'sharing' : 'app', 'perms.write' : 'admin,trackme_admin', 'perms.read' : '*'},
                                    verify=False)

            #
            # step 2: create the intermediate macro
            #

            macro_name = "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name)
            macros = service.confs["macros"]

            if search_mode in 'tstats':
                definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                    "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                    "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by index,sourcetype," + str(break_by_field) + "\n" +\
                    "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                    "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                    "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                    "`comment(\"#### create the data_name value ####\")`\n" +\
                    "| eval data_name=data_index . \":\" . data_sourcetype . \":\" . \"|key:\" . \"" + str(break_by_field) + "\" . \"|\" . " + str(break_by_field)
            elif search_mode in 'raw':
                definition = "stats max(data_last_ingest) as data_last_ingest, min(data_first_time_seen) as data_first_time_seen, " +\
                    "max(data_last_time_seen) as data_last_time_seen, avg(data_last_ingestion_lag_seen) as data_last_ingestion_lag_seen, " +\
                    "sum(data_eventcount) as data_eventcount, dc(host) as dcount_host by index,sourcetype," + str(break_by_field) + "\n" +\
                    "| eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0)\n" +\
                    "`comment(\"#### rename index and sourcetype ####\")`\n" +\
                    "| rename index as data_index, sourcetype as data_sourcetype\n" +\
                    "`comment(\"#### create the data_name value ####\")`\n" +\
                    "| eval data_name=data_index . \":\" . data_sourcetype . \":\" . \"|rawkey:\" . \"" + str(break_by_field) + "\" . \"|\" . " + str(break_by_field)

            # create the macro
            try:
                macros.create(name=str(macro_name), **{"app": "trackme", "sharing": "app", "definition": str(definition), "owner": str(owner)})

            except Exception as e:
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
                    "count as data_eventcount, dc(host) as dcount_host where index=* sourcetype=* " + str(root_constraint) + " by `" + "trackme_root_splitby" + "_hybrid_" + str(tracker_name) + "`\n" +\
                    "`comment(\"#### tstats result table is loaded ####\")`\n" +\
                    "| eval data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\n" +\
                    "`comment(\"#### intermediate calculation ####\")`\n" +\
                    "| `" + "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name) + "`\n" +\
                    "`comment(\"#### call the abstract macro ####\")`\n" +\
                    "`trackme_data_source_tracker_abstract`"
            elif search_mode in 'raw':
                report_search = "index=* sourcetype=* " + str(root_constraint) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, " +\
                    "count as data_eventcount, dc(host) as dcount_host by `" + "trackme_root_splitby" + "_hybrid_" + str(tracker_name) + "`\n" +\
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
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            #
            # step 4: create the short term tracker
            #

            report_name = "trackme_tracker_hybrid_" + str(tracker_name)
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
                "| stats c"

            # create a new report
            try:
                newtracker = service.saved_searches.create(str(report_name), str(report_search))

            except Exception as e:
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
                    "dispatch.earliest_time": "-4h",
                    "dispatch.latest_time": "+4h"}                            

            # Update the server and refresh the local copy of the object
            try:
                newtracker_update.update(**kwargs).refresh()

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

            # Handler the owner (cannot be performed via splunklib)
            kwargs = { "sharing": "app", "owner": str(owner) }

            try:
                service.post("%s/%s" % (newtracker_update.links["alternate"], "acl"), body=urlencode(kwargs))

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered: ' + str(e), # Payload of the request.
                    'status': 500 # HTTP status code
                }

        #
        # END
        #

        audit_record = json.dumps({    
                "split_by_macro": "trackme_root_splitby" + "_hybrid_" + str(tracker_name),
                "aggreg_intermediate_macro": "trackme_intermediate_aggreg" + "_hybrid_" + str(tracker_name),
                "abstract_report": "trackme_abstract_root_hybrid_" + str(tracker_name),
                "tracker_report": "trackme_tracker_hybrid_" + str(tracker_name),
                "root_constraint": str(root_constraint),
                "tracker_name": str(tracker_name),
                "break_by_field": str(break_by_field),
                "search_mode": str(search_mode),
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
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

        # final return
        return {
            "payload": str(audit_record),
            'status': 200 # HTTP status code
        }
