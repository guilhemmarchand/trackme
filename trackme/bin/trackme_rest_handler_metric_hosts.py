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


class TrackMeHandlerMetricHosts_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerMetricHosts_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data hosts collection as a Python array
    def get_mh_collection(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the entire metric hosts collection returned as a JSON array, it requires a GET call with no data required\"}"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

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
    def get_mh_by_key(self, request_info, **kwargs):

        # By object_category and object
        key = None

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
                key = resp_dict['_key']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint retrieves an existing metric host record by the Kvstore key, it requires a GET call with the following information:\""\
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

            collection_name = "kv_trackme_metric_host_monitoring"            
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
    def get_mh_by_name(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves an existing metric host record by the metric host name (metric_host), it requires a GET call with the following information:\""\
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
    def post_mh_disable_monitoring(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint disables data monitoring for an existing metric host by the metric host name (metric_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\", "\
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
        query_string = '{ "metric_host": "' + metric_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring"            
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
            metric_monitored_state = "disabled"

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'),
                    "metric_host": record[0].get('metric_host'),
                    "metric_index": record[0].get('metric_index'),
                    "metric_category": record[0].get('metric_category'),
                    "metric_details": record[0].get('metric_details'),
                    "metric_last_lag_seen": record[0].get('metric_last_lag_seen'),
                    "metric_first_time_seen": record[0].get('metric_first_time_seen'), 
                    "metric_last_time_seen": record[0].get('metric_last_time_seen'),
                    "metric_max_lag_allowed": record[0].get('metric_max_lag_allowed'),
                    "metric_monitored_state": str(metric_monitored_state),
                    "metric_monitoring_wdays": record[0].get('metric_monitoring_wdays'),
                    "metric_override_lagging_class": record[0].get('metric_override_lagging_class'),
                    "metric_host_state": record[0].get('metric_host_state'),
                    "metric_tracker_runtime": record[0].get('metric_tracker_runtime'),
                    "metric_previous_host_state": record[0].get('metric_previous_host_state'),
                    "metric_previous_tracker_runtime": record[0].get('metric_previous_tracker_runtime'),
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
                        "object": str(metric_host),
                        "object_category": "metric_host",
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
    def post_mh_enable_monitoring(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint enables data monitoring for an existing metric host by the metric host name (metric_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\", "\
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
        query_string = '{ "metric_host": "' + metric_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring"            
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
            metric_monitored_state = "enabled"

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'),
                    "metric_host": record[0].get('metric_host'),
                    "metric_index": record[0].get('metric_index'),
                    "metric_category": record[0].get('metric_category'),
                    "metric_details": record[0].get('metric_details'),
                    "metric_last_lag_seen": record[0].get('metric_last_lag_seen'),
                    "metric_first_time_seen": record[0].get('metric_first_time_seen'), 
                    "metric_last_time_seen": record[0].get('metric_last_time_seen'),
                    "metric_max_lag_allowed": record[0].get('metric_max_lag_allowed'),
                    "metric_monitored_state": str(metric_monitored_state),
                    "metric_monitoring_wdays": record[0].get('metric_monitoring_wdays'),
                    "metric_override_lagging_class": record[0].get('metric_override_lagging_class'),
                    "metric_host_state": record[0].get('metric_host_state'),
                    "metric_tracker_runtime": record[0].get('metric_tracker_runtime'),
                    "metric_previous_host_state": record[0].get('metric_previous_host_state'),
                    "metric_previous_tracker_runtime": record[0].get('metric_previous_tracker_runtime'),
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
                        "object": str(metric_host),
                        "object_category": "metric_host",
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

    # Reset metrics by object name
    def post_mh_reset(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint resets (removal of indexes and metrics knowledge) an existing metric host by the metric host name (metric_host), it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\", "\
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
        query_string = '{ "metric_host": "' + metric_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring"            
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
                    "metric_host": record[0].get('metric_host'),
                    "metric_index": record[0].get('metric_index'),
                    "metric_last_lag_seen": record[0].get('metric_last_lag_seen'),
                    "metric_first_time_seen": record[0].get('metric_first_time_seen'), 
                    "metric_last_time_seen": record[0].get('metric_last_time_seen'),
                    "metric_max_lag_allowed": record[0].get('metric_max_lag_allowed'),
                    "metric_monitored_state": record[0].get('metric_monitored_state'),
                    "metric_monitoring_wdays": record[0].get('metric_monitoring_wdays'),
                    "metric_override_lagging_class": record[0].get('metric_override_lagging_class'),
                    "metric_host_state": record[0].get('metric_host_state'),
                    "metric_tracker_runtime": record[0].get('metric_tracker_runtime'),
                    "metric_previous_host_state": record[0].get('metric_previous_host_state'),
                    "metric_previous_tracker_runtime": record[0].get('metric_previous_tracker_runtime'),
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
                        "change_type": "reset metrics",
                        "object": str(metric_host),
                        "object_category": "metric_host",
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
    def post_mh_update_priority(self, request_info, **kwargs):

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
                priority = resp_dict['priority']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint updates the priority definition for an existing metric host, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\", "\
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
        query_string = '{ "metric_host": "' + metric_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring"            
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
                    "metric_host": record[0].get('metric_host'),
                    "metric_index": record[0].get('metric_index'),
                    "metric_category": record[0].get('metric_category'),
                    "metric_details": record[0].get('metric_details'),
                    "metric_last_lag_seen": record[0].get('metric_last_lag_seen'),
                    "metric_first_time_seen": record[0].get('metric_first_time_seen'), 
                    "metric_last_time_seen": record[0].get('metric_last_time_seen'),
                    "metric_max_lag_allowed": record[0].get('metric_max_lag_allowed'),
                    "metric_monitored_state": record[0].get('metric_max_lag_allowed'),
                    "metric_monitoring_wdays": record[0].get('metric_monitoring_wdays'),
                    "metric_override_lagging_class": record[0].get('metric_override_lagging_class'),
                    "metric_host_state": record[0].get('metric_host_state'),
                    "metric_tracker_runtime": record[0].get('metric_tracker_runtime'),
                    "metric_previous_host_state": record[0].get('metric_previous_host_state'),
                    "metric_previous_tracker_runtime": record[0].get('metric_previous_tracker_runtime'),
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
                        "object": str(metric_host),
                        "object_category": "metric_host",
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
    def delete_mh_delete_temporary(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint performs a temporary deletion of an existing metric host, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\", "\
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
        query_string = '{ "metric_host": "' + metric_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring"            
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
                        "object": str(metric_host),
                        "object_category": "metric_host",
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
    def delete_mh_delete_permanent(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint performs a temporary deletion of an existing metric host, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"name of the metric host\", "\
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
        query_string = '{ "metric_host": "' + metric_host + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring"            
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
                        "object": str(metric_host),
                        "object_category": "metric_host",
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
