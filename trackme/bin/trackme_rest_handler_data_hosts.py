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


class TrackMeHandlerDataHosts_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerDataHosts_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data hosts collection as a Python array
    def get_dh_collection(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the entire data hosts collection returned as a JSON array, it requires a GET call with no data required\"}"\

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

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

            # Render
            return {
                "payload": json.dumps(collection.data.query(), indent=1),
                'status': 200 # HTTP status code
            }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Get data host by _key
    def get_dh_by_key(self, request_info, **kwargs):

        describe = False

        # By object_category and object
        key = None

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
                key = resp_dict['_key']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint retrieves an existing data host record by the Kvstore key, it requires a GET call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"_key\": \"KVstore unique identifier for this record\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }
        
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

            # Get the record
            record = json.dumps(collection.data.query_by_id(key), indent=1)

            # Render result
            if record is not None and len(record)>2:
                return {
                    "payload": str(record),
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

    # Get Ack by object name
    def get_dh_by_name(self, request_info, **kwargs):

        # By data_host
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

            response = "{\"describe\": \"This endpoint retrieves an existing data host record by the data host name (data_host), it requires a GET call with the following information:\""\
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

    # Disable monitoring by object name
    def post_dh_disable_monitoring(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint disables data monitoring for an existing data host by the data host name (data_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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
                
            # define the new state
            data_monitored_state = "disabled"

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'), 
                    "data_index": record[0].get('data_index'), 
                    "data_sourcetype": record[0].get('data_sourcetype'), 
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'), 
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'), 
                    "data_monitored_state": str(data_monitored_state), 
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'), 
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_st_summary": record[0].get('data_host_st_summary'), 
                    "data_host_alerting_policy": record[0].get('data_host_alerting_policy'), 
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'), 
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'), 
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'), 
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'), 
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'), 
                    "OutlierSpan": record[0].get('OutlierSpan'), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

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
                        "change_type": "disable monitoring",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
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

    # Enable monitoring by object name
    def post_dh_enable_monitoring(self, request_info, **kwargs):

        # By data_host
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

            response = "{\"describe\": \"This endpoint enables data monitoring for an existing data host by the data host name (data_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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
                
            # define the new state
            data_monitored_state = "enabled"

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({                    
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'), 
                    "data_index": record[0].get('data_index'), 
                    "data_sourcetype": record[0].get('data_sourcetype'), 
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'), 
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'), 
                    "data_monitored_state": str(data_monitored_state), 
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'), 
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_st_summary": record[0].get('data_host_st_summary'), 
                    "data_host_alerting_policy": record[0].get('data_host_alerting_policy'), 
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'), 
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'), 
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'), 
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'), 
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'), 
                    "OutlierSpan": record[0].get('OutlierSpan'), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

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
                        "change_type": "enable monitoring",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
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

    # Reset by object name
    def post_dh_reset(self, request_info, **kwargs):

        # By data_host
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

            response = "{\"describe\": \"This endpoint resets (removal of index and sourcetype knowledge) an existing data host by the data host name (data_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'), 
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'), 
                    "data_monitored_state": record[0].get('data_monitored_state'), 
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'), 
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_alerting_policy": record[0].get('data_host_alerting_policy'), 
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'), 
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'), 
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'), 
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'), 
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'), 
                    "OutlierSpan": record[0].get('OutlierSpan'), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

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
                        "change_type": "reset data",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
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

    # Update priority by object name
    def post_dh_update_priority(self, request_info, **kwargs):

        # By data_host
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
                priority = resp_dict['priority']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint updates the priority definition for an existing data host by the data host name (data_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
                + "\"priority\": \"priority value, valid options are low / medium / high\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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
            if key is not None and len(key)>2 and priority in ("low", "medium", "high"):

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'), 
                    "data_index": record[0].get('data_index'), 
                    "data_sourcetype": record[0].get('data_sourcetype'), 
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'), 
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'), 
                    "data_monitored_state": record[0].get('data_monitored_state'), 
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'), 
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_st_summary": record[0].get('data_host_st_summary'), 
                    "data_host_alerting_policy": record[0].get('data_host_alerting_policy'), 
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'), 
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'), 
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'), 
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'), 
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'), 
                    "OutlierSpan": record[0].get('OutlierSpan'), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": str(priority)
                    }))

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
                        "change_type": "modify priority",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found or request is incorrect ' + str(query_string),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Update lagging policy by object name
    def post_dh_update_lag_policy(self, request_info, **kwargs):

        # By data_host
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
                data_lag_alert_kpis = resp_dict['data_lag_alert_kpis'] # all_kpis / lag_ingestion_kpi / lag_event_kpi
                data_max_lag_allowed = int(resp_dict['data_max_lag_allowed']) # seconds
                data_override_lagging_class = resp_dict['data_override_lagging_class'] # true / false
                data_host_alerting_policy = resp_dict['data_host_alerting_policy'] # global_policy / track_per_sourcetype / track_per_host

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint resets (removal of index and sourcetype knowledge) an existing data host by the data host name (data_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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
            if key is not None and len(key)>2 and data_override_lagging_class in ("true", "false") and data_lag_alert_kpis in ("all_kpis", "lag_ingestion_kpi", "lag_event_kpi") and data_host_alerting_policy in ("global_policy", "track_per_sourcetype", "track_per_host"):

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'), 
                    "data_index": record[0].get('data_index'), 
                    "data_sourcetype": record[0].get('data_sourcetype'), 
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": str(data_max_lag_allowed), 
                    "data_lag_alert_kpis": str(data_lag_alert_kpis), 
                    "data_monitored_state": record[0].get('data_monitored_state'), 
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'), 
                    "data_override_lagging_class": str(data_override_lagging_class), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_st_summary": record[0].get('data_host_st_summary'), 
                    "data_host_alerting_policy": str(data_host_alerting_policy), 
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'), 
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'), 
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'), 
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'), 
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'), 
                    "OutlierSpan": record[0].get('OutlierSpan'), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

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
                        "change_type": "modify monitoring lag policy",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found or request is incorrect ' + str(query_string),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Update monitoring week days by object name
    def post_dh_update_wdays(self, request_info, **kwargs):

        # By data_host
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
                # Week days monitoring can be:
                # manual:all_days / manual:monday-to-friday / manual:monday-to-saturday / [ 0, 1, 2, 3, 4, 5, 6 ] where Sunday is 0
                data_monitoring_wdays = resp_dict['data_monitoring_wdays']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint configures the week days monitoring rule for an existing data host, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
                + "\"data_monitoring_wdays\": \"the week days rule, valid options are manual:all_days / manual:monday-to-friday / manual:monday-to-saturday / [ 0, 1, 2, 3, 4, 5, 6 ] where Sunday is 0\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'), 
                    "data_index": record[0].get('data_index'), 
                    "data_sourcetype": record[0].get('data_sourcetype'), 
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'), 
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'), 
                    "data_monitored_state": record[0].get('data_monitored_state'), 
                    "data_monitoring_wdays": str(data_monitoring_wdays), 
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_st_summary": record[0].get('data_host_st_summary'), 
                    "data_host_alerting_policy": record[0].get('data_host_alerting_policy'), 
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'), 
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'), 
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'), 
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'), 
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'), 
                    "OutlierSpan": record[0].get('OutlierSpan'), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

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
                        "change_type": "modify week days monitoring",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found or request is incorrect ' + str(query_string),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Update outliers configuration by object name
    def post_dh_update_outliers(self, request_info, **kwargs):

        # By data_host
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
                OutlierMinEventCount = resp_dict['OutlierMinEventCount'] # integer, default to 0 (disabled)
                OutlierLowerThresholdMultiplier = resp_dict['OutlierLowerThresholdMultiplier'] # integer, defaults to 4
                OutlierUpperThresholdMultiplier = resp_dict['OutlierUpperThresholdMultiplier'] # integer, defaults to 4
                OutlierAlertOnUpper = resp_dict['OutlierAlertOnUpper'] # true / false
                OutlierTimePeriod = resp_dict['OutlierTimePeriod'] # relative time period, default to -7d
                OutlierSpan = resp_dict['OutlierSpan'] # span period Splunk notation, defaults to 5m
                enable_behaviour_analytic = resp_dict['enable_behaviour_analytic'] # true / false

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint configures the week days monitoring rule for an existing data host, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"OutlierMinEventCount\": \"the minimal number of events, if set to anything bigger than 0, the lower bound becomes a static value, needs to be an integer, default to 0 (disabled)\", "\
                + "\"OutlierLowerThresholdMultiplier\": \"The lower bound threshold multiplier, must be an integer, defaults to 4\", "\
                + "\"OutlierUpperThresholdMultiplier\": \"The upper bound threshold multiplier, must be integer, defaults to 4\", "\
                + "\"OutlierAlertOnUpper\": \"Enables / Disables alerting on upper outliers detection, valid options are true / false, defaults to false\", "\
                + "\"OutlierTimePeriod\": \"relative time period for outliers calculation, default to -7d\", "\
                + "\"OutlierSpan\": \"span period Splunk notation for outliers UI rendering, defaults to 5m\", "\
                + "\"enable_behaviour_analytic\": \"Enables / Disables outliers detection for that object, valid options are true / false, defaults to true\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\", "\
                + "\"data_host\": \"name of the data host\""\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_host": record[0].get('data_host'), 
                    "data_index": record[0].get('data_index'), 
                    "data_sourcetype": record[0].get('data_sourcetype'), 
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'), 
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'), 
                    "data_eventcount": record[0].get('data_eventcount'), 
                    "data_first_time_seen": record[0].get('data_first_time_seen'), 
                    "data_last_time_seen": record[0].get('data_last_time_seen'), 
                    "data_last_ingest": record[0].get('data_last_ingest'), 
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'), 
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'), 
                    "data_monitored_state": record[0].get('data_monitored_state'), 
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'), 
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'), 
                    "data_host_state": record[0].get('data_host_state'), 
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'), 
                    "data_previous_host_state": record[0].get('data_previous_host_state'), 
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'), 
                    "data_host_st_summary": record[0].get('data_host_st_summary'), 
                    "data_host_alerting_policy": record[0].get('data_host_alerting_policy'), 
                    "OutlierMinEventCount": str(OutlierMinEventCount), 
                    "OutlierLowerThresholdMultiplier": str(OutlierLowerThresholdMultiplier), 
                    "OutlierUpperThresholdMultiplier": str(OutlierUpperThresholdMultiplier), 
                    "OutlierAlertOnUpper": str(OutlierAlertOnUpper), 
                    "OutlierTimePeriod": str(OutlierTimePeriod), 
                    "OutlierSpan": str(OutlierSpan), 
                    "isOutlier": record[0].get('isOutlier'), 
                    "enable_behaviour_analytic": str(enable_behaviour_analytic), 
                    "latest_flip_state": record[0].get('latest_flip_state'), 
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')

                    }))

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
                        "change_type": "modify outliers",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found or request is incorrect ' + str(query_string),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Remove data host temporary by object name
    def delete_dh_delete_temporary(self, request_info, **kwargs):

        # By data_host
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

            response = "{\"describe\": \"This endpoint performs a temporary deletion of an existing data host, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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

                # Store the record for audit purposes
                json_data = str(json.dumps(collection.data.query_by_id(key), indent=1))

                # Remove the record
                collection.data.delete(json.dumps({"_key":key}))

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
                        "change_type": "delete temporary",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json_data),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": "Record with _key " + str(key) + " was temporarily deleted from the collection.",
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found or request is incorrect ' + str(query_string),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Remove data host permanent by object name
    def delete_dh_delete_permanent(self, request_info, **kwargs):

        # By data_host
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

            response = "{\"describe\": \"This endpoint performs a permanent deletion of an existing data host, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"name of the data host\", "\
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
        query_string = '{ "data_host": "' + data_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_host_monitoring"            
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

                # Store the record for audit purposes
                json_data = str(json.dumps(collection.data.query_by_id(key), indent=1))

                # Remove the record
                collection.data.delete(json.dumps({"_key":key}))

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
                        "change_type": "delete permanent",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(json_data),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": "Record with _key " + str(key) + " was permanently deleted from the collection.",
                    'status': 200 # HTTP status code
                }

            else:
                return {
                    "payload": 'Warn: resource not found or request is incorrect ' + str(query_string),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }
