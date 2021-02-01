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


class TrackMeHandlerElasticSources_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerElasticSources_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data hosts collection as a Python array
    def get_elastic_shared(self, request_info, **kwargs):

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

        else:
            # body is not required in this endpoint, if not submitted do not describe the usage
            describe = False

        if describe:

            response = "{\"describe\": \"This endpoint retrieves the entired shared Elastic Sources collection returned as a JSON array, it requires a GET call with no data required\"}"\

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_elastic_sources"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Render
            return {
                "payload": json.dumps(collection.data.query(), indent=1),
                'status': 200 # HTTP status code
            }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Get the entire data hosts collection as a Python array
    def get_elastic_dedicated(self, request_info, **kwargs):

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

        else:
            # body is not required in this endpoint, if not submitted do not describe the usage
            describe = False

        if describe:

            response = "{\"describe\": \"This endpoint retrieves the entired dedicated Elastic Sources collection returned as a JSON array, it requires a GET call with no data required\"}"\

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_elastic_sources_dedicated"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Render
            return {
                "payload": json.dumps(collection.data.query(), indent=1),
                'status': 200 # HTTP status code
            }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Get a target by name
    def get_elastic_shared_by_name(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves a shared Elastic Source configuration stored in the collection returned as a JSON array, it requires a GET call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the Elastic Source\""\
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

            collection_name = "kv_trackme_elastic_sources"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Get the record
            record = json.dumps(collection.data.query(query=str(query_string)), indent=1)

            # Render result
            if record is not None and len(record)>2:
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found ' + str(query_string),
                    'status': 404 # HTTP status code
                }


        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Get a target by name
    def get_elastic_dedicated_by_name(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves a dedicated Elastic Source configuration stored in the collection returned as a JSON array, it requires a GET call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the Elastic Source\""\
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

            collection_name = "kv_trackme_elastic_sources_dedicated"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Get the record
            record = json.dumps(collection.data.query(query=str(query_string)), indent=1)

            # Render result
            if record is not None and len(record)>2:
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found ' + str(query_string),
                    'status': 404 # HTTP status code
                }


        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new shared Elastic Source if does not exist yet
    def post_elastic_shared_add(self, request_info, **kwargs):

        # Declare
        data_name = None
        search_constraint = None
        search_mode = None
        elastic_data_index = None
        elastic_data_sourcetype = None
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
                search_constraint = resp_dict['search_constraint']
                search_mode = resp_dict['search_mode']
                elastic_data_index = resp_dict['elastic_data_index']
                elastic_data_sourcetype = resp_dict['elastic_data_sourcetype']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint create a new shared Elastic Source, if the entity already exists it will be updated using the data provided, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the Elastic Source\", "\
                + "\"search_constraint\": \"the SPL code for this entity, double quotes need to be escaped\", "\
                + "\"search_mode\": \"the search mode, valid options are tstats / raw / from / mstats / rest_tstats / rest_raw / rest_from / rest_mstats\", "\
                + "\"elastic_index\": \"pseudo index value, this value will be used in the UI but has no impacts on the search\", "\
                + "\"elastic_sourcetype\": \"pseudo sourcetype value name, this value will be used in the UI but has no impacts on the search\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_elastic_sources"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            service_audit = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection_audit = service_audit.kvstore[collection_name_audit]

            # Get the current record
            # Notes: the record is returned as an array, as we search for a specific record, we expect one record only
            
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                key = None
                
            # Render result
            if key is not None and len(key)>2:

                # This record exists already

                # Store the record for audit purposes
                record = str(json.dumps(collection.data.query_by_id(key), indent=1))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "add elastic source tracker",
                        "object": str(data_name),
                        "object_category": "elastic_sources_tracker",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_name": str(data_name), "search_constraint": str(search_constraint), "search_mode": str(search_mode), "elastic_data_index": elastic_data_index, "elastic_data_sourcetype": elastic_data_sourcetype}))

                # Get record
                record = json.dumps(collection.data.query(query=str(query_string)), indent=1)

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "add elastic source tracker",
                        "object": str(data_name),
                        "object_category": "elastic_sources_tracker",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Add new shared Elastic Source if does not exist yet
    def post_elastic_dedicated_add(self, request_info, **kwargs):

        # Declare
        data_name = None
        search_constraint = None
        search_mode = None
        elastic_data_index = None
        elastic_data_sourcetype = None
        tracker_name = None
        earliest_time = None
        latest_time = None
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
                resp_dict = json.loads(str(request_info.raw_args['payload']))
                data_name = resp_dict['data_name']
                search_constraint = resp_dict['search_constraint']
                search_mode = resp_dict['search_mode']
                elastic_data_index = resp_dict['elastic_data_index']
                elastic_data_sourcetype = resp_dict['elastic_data_sourcetype']

                # earliest and latest are optional, if unset we define default values
                try:
                    earliest_time = resp_dict['earliest_time']
                except Exception as e:
                    earliest_time = "-4h"

                try:
                    latest_time = resp_dict['latest_time']
                except Exception as e:
                    latest_time = "+4h"

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint create a new shared Elastic Source, if the entity already exists it will be updated using the data provided, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the Elastic Source\", "\
                + "\"search_constraint\": \"the SPL code for this entity, double quotes need to be escaped\", "\
                + "\"search_mode\": \"the search mode, valid options are tstats / raw / from / mstats / rest_tstats / rest_raw / rest_from / rest_mstats\", "\
                + "\"elastic_index\": \"pseudo index value, this value will be used in the UI but has no impacts on the search\", "\
                + "\"elastic_sourcetype\": \"pseudo sourcetype value name, this value will be used in the UI but has no impacts on the search\", "\
                + "\"earliest_time\": \"OPTIONAL: earliest time for the scheduled report definition, if unset will be defined to -4h\", "\
                + "\"latest_time\": \"OPTIONAL: latest time for the scheduled report definition, if unset will be defined to -4h\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # elastic_report is generated during ops

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        # Create a new scheduled report via the SDK
        import uuid
        tracker_name = "TrackMe - " + str(data_name) + " tracker " + str(uuid.uuid4())
        # report name len is 100 chars max
        tracker_name = tracker_name[:100]

        import re
        
        # define the report root search depending on various conditions
        if search_mode in ("tstats"):
            elastic_report_root_search = "| `trackme_tstats` max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host where " + str(search_constraint) + " | eval data_name=\"" + str(data_name) + "\", data_index=\"" + str(elastic_data_index) + "\", data_sourcetype=\"" + str(elastic_data_sourcetype) + "\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"
        
        elif search_mode in ("raw"):
            elastic_report_root_search = str(search_constraint) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\"" + str(data_name) +"\", data_index=\"" + str(elastic_data_sourcetype) + "\", data_sourcetype=\"" + str(elastic_data_sourcetype) + "\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

        elif search_mode in ("from"):
            if re.match("datamodel:", str(search_constraint)):
                elastic_report_root_search = "| " + str(search_mode) + " " + str(search_constraint) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\"" + str(data_name) + "\", data_index=\"" + str(elastic_data_index) + "\", data_sourcetype=\"" + str(elastic_data_sourcetype) + "\" | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"
            if re.match("lookup:", str(search_constraint)):
                elastic_report_root_search = "| " + str(search_mode) + " " + str(search_constraint) + " | eventstats max(_time) as indextime | eval _indextime=if(isnum(_indextime), _indextime, indextime) | fields - indextime | eval host=if(isnull(host), \"none\", host) | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\"" + str(data_name) + "\", data_index=\"" + str(elastic_data_index) + "\", data_sourcetype=\"" + str(elastic_data_sourcetype) + "\" | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

        elif search_mode in ("mstats"):
            elastic_report_root_search = "| mstats latest(_value) as value where " + str(search_constraint) + " by host, metric_name span=1s | stats min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, dc(metric_name) as data_eventcount, dc(host) as dcount_host | eval data_name=\"" + str(data_name) + "\", data_index=\"" + str(elastic_data_index) + "\", data_sourcetype=\"" + str(elastic_data_sourcetype) + "\", data_last_ingest=data_last_time_seen, data_last_ingestion_lag_seen=now()-data_last_time_seen | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

        elif search_mode in ("rest_tstats"):

            # extract using rex
            rest_matches = re.match(r'((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)/)', search_constraint)
            if rest_matches:
                rest_target = rest_matches.group(1)
                rest_constraint = rest_matches.group(2)

            # escape back slashes
            rest_constraint = rest_constraint.replace("\\", "\\\\")

            # final search
            elastic_report_root_search = "| rest " + str(rest_target) + " /servicesNS/admin/search/search/jobs/export search=\"| tstats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host where " + str(rest_constraint) + " | eval data_name=\\\"" + str(data_name) + "\\\", data_index=\\\"" + str(elastic_data_index) + "\\\", data_sourcetype=\\\"" + str(elastic_data_sourcetype) + "\\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\"" + " output_mode=\"csv\"" + " earliest_time=\"" + str(earliest_time) + "\"" + " latest_time=\"" + str(latest_time) + "\"" + " | head 1 | table value | restextract " + " | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

        elif search_mode in ("rest_mstats"):

            # extract using rex
            rest_matches = re.match(r'((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)', search_constraint)
            if rest_matches:
                rest_target = rest_matches.group(1)
                rest_constraint = rest_matches.group(2)

            # escape back slashes
            rest_constraint = rest_constraint.replace("\\", "\\\\")

            # final search
            elastic_report_root_search = "| rest " + str(rest_target) + " /servicesNS/admin/search/search/jobs/export search=\"| mstats latest(_value) as value where " + str(rest_constraint) + " by host, metric_name span=1s | stats min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, dc(metric_name) as data_eventcount, dc(host) as dcount_host | eval data_last_ingest=data_last_time_seen | eval data_name=\\\"" + str(data_name) + "\\\", data_index=\\\"" + str(elastic_data_index) + "\\\", data_sourcetype=\\\"" + str(elastic_data_sourcetype) + "\\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\"" + " output_mode=\"csv\"" + " earliest_time=\"" + str(earliest_time) + "\"" + " latest_time=\"" + str(latest_time) + "\"" + " | head 1 | table value | restextract " + " | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

        elif search_mode in ("rest_raw"):

            # extract using rex
            rest_matches = re.match(r'((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)', search_constraint)
            if rest_matches:
                rest_target = rest_matches.group(1)
                rest_constraint = rest_matches.group(2)

            # escape back slashes
            rest_constraint = rest_constraint.replace("\\", "\\\\")

            # final search
            elastic_report_root_search = "| rest " + str(rest_target) + " /servicesNS/admin/search/search/jobs/export search=\"search " + str(rest_constraint) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host" + " | eval data_name=\\\"" + str(data_name) + "\\\", data_index=\\\"" + str(elastic_data_index) + "\\\", data_sourcetype=\\\"" + str(elastic_data_sourcetype) + "\\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\"" + " output_mode=\"csv\"" + " earliest_time=\"" + str(earliest_time) + "\"" + " latest_time=\"" + str(earliest_time) + "\"" + " | head 1 | table value | restextract " + " | `trackme_elastic_dedicated_tracker(\"" + str(latest_time) + "\")` | stats c"

        elif search_mode in ("rest_from"):

            if re.match("datamodel:", str(search_mode)):
                # extract using rex
                rest_matches = re.match(r'((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)', search_constraint)
                if rest_matches:
                    rest_target = rest_matches.group(1)
                    rest_constraint = rest_matches.group(2)

                # escape back slashes
                rest_constraint = rest_constraint.replace("\\", "\\\\")

                # final search
                elastic_report_root_search = "| rest " + str(rest_target) + " /servicesNS/admin/search/search/jobs/export search=\"| from " + str(rest_constraint) + " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\\\"" + str(data_name) + "\\\", data_index=\\\"" + str(elastic_data_index) + "\\\", data_sourcetype=\\\"" + str(elastic_data_sourcetype) + "\\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\"" + " output_mode=\"csv\" " + " earliest_time=\"" + str(earliest_time) + "\"" + " latest_time=\"" + str(latest_time) + "\"" + " | head 1 | table value | restextract " + " | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

            if re.match("lookup:", str(search_mode)):

                if rest_matches:
                    rest_target = rest_matches.group(1)
                    rest_constraint = rest_matches.group(2)

                # escape back slashes
                rest_constraint = rest_constraint.replace("\\", "\\\\")

                # final search
                elastic_report_root_search = "| rest " + str(rest_target) + " /servicesNS/admin/search/search/jobs/export search=\"| from " + str(rest_constraint) + " | eventstats max(_time) as indextime | eval _indextime=if(isnum(_indextime), _indextime, indextime) | fields - indextime | eval host=if(isnull(host), \\\"none\\\", host) | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\\\"" + str(data_name) + "\\\", data_index=\\\"" + str(elastic_data_index) + "\\\", data_sourcetype=\\\"" + str(elastic_data_sourcetype) + "\\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen\"" + " output_mode=\"csv\" " + " earliest_time=\"" + str(earliest_time) + "\"" + " latest_time=\"" + str(latest_time) + "\"" + " | head 1 | table value | restextract " + " | `trackme_elastic_dedicated_tracker(\"" + str(data_name) + "\")` | stats c"

        try:

            # Data collection
            collection_name = "kv_trackme_elastic_sources_dedicated"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            service_audit = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection_audit = service_audit.kvstore[collection_name_audit]

            # Get the current record
            # Notes: the record is returned as an array, as we search for a specific record, we expect one record only
            
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                key = None
                
            # Render result
            if key is not None and len(key)>2:

                # This Elastic Source exists already, the report and record will be updated with the POST data

                # Get the tracker name from the record
                tracker_name = record[0].get('elastic_report')

                # update the properties
                newtracker_update = service.saved_searches[str(tracker_name)]

                # Specify a description for the search
                # Enable the saved search to run on schedule
                # Run the search on Saturdays at 4:15am
                # Search everything in a 24-hour time range starting June 19, 12:00pm
                kwargs = {"search": str(elastic_report_root_search),
                        "description": "Dedicated elastic tracker for data source",
                        "is_scheduled": True,
                        "cron_schedule": "*/5 * * * *",
                        "dispatch.earliest_time": str(earliest_time),
                        "dispatch.latest_time": str(latest_time)}

                # Update the server and refresh the local copy of the object
                newtracker_update.update(**kwargs).refresh()

                # Store the record for audit purposes
                record = str(json.dumps(collection.data.query_by_id(key), indent=1))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "add elastic source tracker",
                        "object": str(data_name),
                        "object_category": "elastic_sources_tracker",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                try:

                    # connect to service and create the tracker
                    service = client.connect(
                        owner="nobody",
                        app="trackme",
                        port=splunkd_port,
                        token=request_info.session_key
                    )

                    # create a new report
                    newtracker = service.saved_searches.create(str(tracker_name), str(elastic_report_root_search))
                    if newtracker:
                        action = "success"
                    else:
                        action = "failure"

                    # update the properties
                    newtracker_update = service.saved_searches[str(tracker_name)]

                    # Specify a description for the search
                    # Enable the saved search to run on schedule
                    # Run the search on Saturdays at 4:15am
                    # Search everything in a 24-hour time range starting June 19, 12:00pm
                    kwargs = {"description": "Dedicated elastic tracker for data source",
                            "is_scheduled": True,
                            "cron_schedule": "*/5 * * * *",
                            "dispatch.earliest_time": str(earliest_time),
                            "dispatch.latest_time": str(latest_time)}

                    # Update the server and refresh the local copy of the object
                    newtracker_update.update(**kwargs).refresh()

                    # Insert the record
                    collection.data.insert(json.dumps({"data_name": str(data_name), "search_constraint": str(search_constraint), "search_mode": str(search_mode), "elastic_data_index": str(elastic_data_index), "elastic_data_sourcetype": str(elastic_data_sourcetype), "elastic_report": str(tracker_name)}))

                    # Get record
                    record = json.dumps(collection.data.query(query=str(query_string)), indent=1)

                    # Record an audit change
                    import time
                    current_time = int(round(time.time() * 1000))
                    user = request_info.user

                    try:

                        # Insert the record
                        collection_audit.data.insert(json.dumps({    
                            "time": str(current_time),
                            "user": str(user),
                            "action": str(action),
                            "change_type": "add elastic source tracker",
                            "object": str(data_name),
                            "object_category": "elastic_sources_tracker",
                            "object_attrs": str(record),
                            "result": "N/A",
                            "comment": str(update_comment)
                            }))

                    except Exception as e:
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }

                    return {
                        "payload": str(record),
                        'status': 200 # HTTP status code
                    }

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Delete shared elastic source
    def delete_elastic_shared_del(self, request_info, **kwargs):

        # Declare
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

            response = "{\"describe\": \"This endpoint deletes a shared Elastic Source, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the Elastic Source\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # service
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            # Elastic sources collection
            collection_name = "kv_trackme_elastic_sources"
            collection = service.kvstore[collection_name]

            # Data sources collection
            collection_name_data_sources = "kv_trackme_data_source_monitoring"
            collection_data_sources = service.kvstore[collection_name_data_sources]

            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            collection_audit = service.kvstore[collection_name_audit]

            # Get the current record
            # Notes: the record is returned as an array, as we search for a specific record, we expect one record only
            
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                key = None

            # Get the data sources record

            try:
                record2 = collection_data_sources.data.query(query=str(query_string))
                key2 = record2[0].get('_key')

            except Exception as e:
                key2 = None
                
            # Render result
            if key is not None and len(key)>2:

                # This record exists already

                # Store the records for audit purposes
                record = str(json.dumps(collection.data.query_by_id(key), indent=1))

                # Store the data source record, it might not exist if not yet created
                if key2 is not None and len(key2)>2:
                    record2 = str(json.dumps(collection_data_sources.data.query_by_id(key2), indent=1))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                # Handle the Elastic Source record
                try:

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the audit record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete elastic tracker",
                        "object": str(data_name),
                        "object_category": "elastic_sources_tracker",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                # Handle the data source record, might not exist yet or anymore if deleted in between
                if key2 is not None and len(key2)>2:

                    try:

                        # Remove the record
                        collection_data_sources.data.delete(json.dumps({"_key":key2}))

                        # Insert the audit record
                        collection_audit.data.insert(json.dumps({    
                            "time": str(current_time),
                            "user": str(user),
                            "action": "success",
                            "change_type": "delete temporary",
                            "object": str(data_name),
                            "object_category": "data_source",
                            "object_attrs": str(record2),
                            "result": "N/A",
                            "comment": str(update_comment)
                            }))

                    except Exception as e:
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }

                if key is not None and len(key)>2 and key2 is not None and len(key2)>2:
                    return {
                        "payload": "Record with _key " + str(key) + " was deleted from the Elastic source collection, record with _key " + str(key2) + " was deleted from the data sources collection.",
                        'status': 200 # HTTP status code
                    }
                
                else:
                    return {
                        "payload": "Record with _key " + str(key) + " was deleted from the Elastic source collection.",
                        'status': 200 # HTTP status code
                    }

            else:

                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Delete dedicated elastic source
    def delete_elastic_dedicated_del(self, request_info, **kwargs):

        # Declare
        data_name = None
        query_string = None
        tracker_name = None

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

            response = "{\"describe\": \"This endpoint deletes a dedicated Elastic Source, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"name of the Elastic Source\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # tracker_name is extracted from the KVstore record

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # service
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            # Elastic sources collection
            collection_name = "kv_trackme_elastic_sources_dedicated"
            collection = service.kvstore[collection_name]

            # Data sources collection
            collection_name_data_sources = "kv_trackme_data_source_monitoring"
            collection_data_sources = service.kvstore[collection_name_data_sources]

            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            collection_audit = service.kvstore[collection_name_audit]

            # Get the current record
            # Notes: the record is returned as an array, as we search for a specific record, we expect one record only
            
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

                # Get the tracker name
                tracker_name = record[0].get('elastic_report')

            except Exception as e:
                key = None
                
            # Get the data sources record

            try:
                record2 = collection_data_sources.data.query(query=str(query_string))
                key2 = record2[0].get('_key')

            except Exception as e:
                key2 = None

            # Render result
            if key is not None and len(key)>2:

                # This record exists already

                # Store the record for audit purposes
                record = str(json.dumps(collection.data.query_by_id(key), indent=1))

                # Store the data source record, it might not exist if not yet created
                if key2 is not None and len(key2)>2:
                    record2 = str(json.dumps(collection_data_sources.data.query_by_id(key2), indent=1))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Get the current tracker for audit purposes
                    try:
                        tracker_service = service.saved_searches[str(tracker_name)]
                        tracker_audit = '{' \
                            + '"name": "' + tracker_service["name"] \
                            + '", description": "' + tracker_service["description"] \
                            + '", "is_scheduled": "' + tracker_service["is_scheduled"] \
                            + '", "search": "' + tracker_service["search"].replace('"', '\\"') \
                            + '", "cron_schedule": "' + tracker_service["cron_schedule"] \
                            + '", "dispatch.earliest_time": "' + tracker_service["dispatch.earliest_time"] \
                            + '", "dispatch.latest_time": "' + tracker_service["dispatch.latest_time"] \
                            + '"}'
                        tracker_audit = json.loads(json.dumps(tracker_audit, indent=1))

                    except Exception as e:
                        tracker_audit = None

                    # Remove the tracker
                    tracker_was_removed = False
                    try:
                        service.saved_searches.delete(str(tracker_name))
                        tracker_was_removed = True

                    except Exception as e:
                        tracker_was_removed = False

                    # audit
                    if tracker_was_removed:
                        # Insert the record
                        collection_audit.data.insert(json.dumps({    
                            "time": str(current_time),
                            "user": str(user),
                            "action": "success",
                            "change_type": "delete elastic tracker savedsearch",
                            "object": str(data_name),
                            "object_category": "elastic_sources_tracker",
                            "object_attrs": str(tracker_audit),
                            "result": "N/A",
                            "comment": str(update_comment)
                            }))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete elastic tracker",
                        "object": str(data_name),
                        "object_category": "elastic_sources_tracker",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                # Handle the data source record, might not exist yet or anymore if deleted in between
                if key2 is not None and len(key2)>2:

                    try:

                        # Remove the record
                        collection_data_sources.data.delete(json.dumps({"_key":key2}))

                        # Insert the audit record
                        collection_audit.data.insert(json.dumps({    
                            "time": str(current_time),
                            "user": str(user),
                            "action": "success",
                            "change_type": "delete temporary",
                            "object": str(data_name),
                            "object_category": "data_source",
                            "object_attrs": str(record2),
                            "result": "N/A",
                            "comment": str(update_comment)
                            }))

                    except Exception as e:
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }

                if key is not None and len(key)>2 and key2 is not None and len(key2)>2 and tracker_was_removed:
                    return {
                        "payload": "Record with _key " + str(key) + " was deleted from the Elastic source collection, report with name " + str(tracker_name) + " was deleted, record with _key " + str(key2) + " was deleted from the data sources collection.",
                        'status': 200 # HTTP status code
                    }

                elif key is not None and len(key)>2 and key2 is not None and len(key2)>2:
                    return {
                        "payload": "Record with _key " + str(key) + " was deleted from the Elastic source collection, record with _key " + str(key2) + " was deleted from the data sources collection.",
                        'status': 200 # HTTP status code
                    }

                elif key is not None and len(key)>2 and tracker_was_removed:
                    return {
                        "payload": "Record with _key " + str(key) + " was deleted from the Elastic source collection, report with name " + str(tracker_name) + " was deleted.",
                        'status': 200 # HTTP status code
                    }

                else:
                    return {
                        "payload": "Record with _key " + str(key) + " was deleted from the Elastic source collection.",
                        'status': 200 # HTTP status code
                    }

            else:

                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

