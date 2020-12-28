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


class TrackMeHandlerDataSources_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerDataSources_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data sources collection as a Python array
    def get_ds_collection(self, request_info, **kwargs):

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

            # Render
            return {
                "payload": json.dumps(collection.data.query(), indent=1),
                'status': 200 # HTTP status code
            }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Get data source by _key
    def get_ds_by_key(self, request_info, **kwargs):

        # By object_category and object
        key = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        key = resp_dict['_key']
        
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
    def get_ds_by_name(self, request_info, **kwargs):

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
    def post_ds_disable_monitoring(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": str(data_monitored_state),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "disable monitoring",
                        "object": str(data_name),
                        "object_category": "data_source",
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
    def post_ds_enable_monitoring(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": str(data_monitored_state),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "enable monitoring",
                        "object": str(data_name),
                        "object_category": "data_source",
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
    def post_ds_update_priority(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        priority = resp_dict['priority']

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": record[0].get('data_monitored_state'),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": str(priority)
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "modify priority",
                        "object": str(data_name),
                        "object_category": "data_source",
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
    def post_ds_update_lag_policy(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        data_lag_alert_kpis = resp_dict['data_lag_alert_kpis'] # all_kpis / lag_ingestion_kpi / lag_event_kpi
        data_max_lag_allowed = int(resp_dict['data_max_lag_allowed']) # seconds
        data_override_lagging_class = resp_dict['data_override_lagging_class'] # true / false

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
            if key is not None and len(key)>2 and data_override_lagging_class in ("true", "false") and data_lag_alert_kpis in ("all_kpis", "lag_ingestion_kpi", "lag_event_kpi"):

                # Update the record
                collection.data.update(str(key), json.dumps({
                    "object_category": record[0].get('object_category'), 
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": str(data_max_lag_allowed),
                    "data_lag_alert_kpis": str(data_lag_alert_kpis),
                    "data_monitored_state": record[0].get('data_monitored_state'),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": str(data_override_lagging_class),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "modify monitoring lag policy",
                        "object": str(data_name),
                        "object_category": "data_source",
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

    # Update min dcount host by object name
    def post_ds_update_min_dcount_host(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        min_dcount_host = int(resp_dict['min_dcount_host']) # integer

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": record[0].get('data_monitored_state'),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": str(min_dcount_host),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "modify minimal hosts distinct count number",
                        "object": str(data_name),
                        "object_category": "data_source",
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
    def post_ds_update_wdays(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        
        # Week days monitoring can be:
        # manual:all_days / manual:monday-to-friday / manual:monday-to-saturday / [ 0, 1, 2, 3, 4, 5, 6 ] where Sunday is 0
        data_monitoring_wdays = resp_dict['data_monitoring_wdays']

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": record[0].get('data_monitored_state'),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": str(data_monitoring_wdays),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "modify week days monitoring",
                        "object": str(data_name),
                        "object_category": "data_source",
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

    # Update monitoring level by object name
    def post_ds_update_monitoring_level(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        data_monitoring_level = resp_dict['data_monitoring_level'] # index / sourcetype

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": record[0].get('data_monitored_state'),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": str(data_monitoring_level),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": record[0].get('OutlierMinEventCount'),
                    "OutlierLowerThresholdMultiplier": record[0].get('OutlierLowerThresholdMultiplier'),
                    "OutlierUpperThresholdMultiplier": record[0].get('OutlierUpperThresholdMultiplier'),
                    "OutlierAlertOnUpper": record[0].get('OutlierAlertOnUpper'),
                    "OutlierTimePeriod": record[0].get('OutlierTimePeriod'),
                    "OutlierSpan": record[0].get('OutlierSpan'),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": record[0].get('enable_behaviour_analytic'),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "modify monitoring level",
                        "object": str(data_name),
                        "object_category": "data_source",
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

    # Update monitoring level by object name
    def post_ds_update_outliers(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        OutlierMinEventCount = resp_dict['OutlierMinEventCount'] # integer, default to 0 (disabled)
        OutlierLowerThresholdMultiplier = resp_dict['OutlierLowerThresholdMultiplier'] # integer, defaults to 4
        OutlierUpperThresholdMultiplier = resp_dict['OutlierUpperThresholdMultiplier'] # integer, defaults to 4
        OutlierAlertOnUpper = resp_dict['OutlierAlertOnUpper'] # true / false
        OutlierTimePeriod = resp_dict['OutlierTimePeriod'] # relative time period, default to -7d
        OutlierSpan = resp_dict['OutlierSpan'] # span period Splunk notation, defaults to 5m
        enable_behaviour_analytic = resp_dict['enable_behaviour_analytic'] # true / false

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                    "data_index": record[0].get('data_index'),
                    "data_last_lag_seen": record[0].get('data_last_lag_seen'),
                    "data_last_ingestion_lag_seen": record[0].get('data_last_ingestion_lag_seen'),
                    "data_eventcount": record[0].get('data_eventcount'),
                    "data_last_lag_seen_idx": record[0].get('data_last_lag_seen_idx'),
                    "data_first_time_seen": record[0].get('data_first_time_seen'),
                    "data_last_time_seen": record[0].get('data_last_time_seen'),
                    "data_last_ingest": record[0].get('data_last_ingest'),
                    "data_last_time_seen_idx": record[0].get('data_last_time_seen_idx'),
                    "data_max_lag_allowed": record[0].get('data_max_lag_allowed'),
                    "data_lag_alert_kpis": record[0].get('data_lag_alert_kpis'),
                    "data_monitored_state": record[0].get('data_monitored_state'),
                    "data_name": record[0].get('data_name'),
                    "data_sourcetype": record[0].get('data_sourcetype'),
                    "data_monitoring_level": record[0].get('data_monitoring_level'),
                    "data_monitoring_wdays": record[0].get('data_monitoring_wdays'),
                    "data_override_lagging_class": record[0].get('data_override_lagging_class'),
                    "data_source_state": record[0].get('data_source_state'),
                    "data_tracker_runtime": record[0].get('data_tracker_runtime'),
                    "data_previous_source_state": record[0].get('data_previous_source_state'),
                    "data_previous_tracker_runtime": record[0].get('data_previous_tracker_runtime'),
                    "dcount_host": record[0].get('dcount_host'),
                    "min_dcount_host": record[0].get('min_dcount_host'),
                    "OutlierMinEventCount": str(OutlierMinEventCount),
                    "OutlierLowerThresholdMultiplier": str(OutlierLowerThresholdMultiplier),
                    "OutlierUpperThresholdMultiplier": str(OutlierUpperThresholdMultiplier),
                    "OutlierAlertOnUpper": str(OutlierAlertOnUpper),
                    "OutlierTimePeriod": str(OutlierTimePeriod),
                    "OutlierSpan": str(OutlierSpan),
                    "isOutlier": record[0].get('isOutlier'),
                    "enable_behaviour_analytic": str(enable_behaviour_analytic),
                    "isAnomaly": record[0].get('isAnomaly'),
                    "data_sample_lastrun": record[0].get('data_sample_lastrun'),
                    "tags": record[0].get('tags'),
                    "latest_flip_state": record[0].get('latest_flip_state'),
                    "latest_flip_time": record[0].get('latest_flip_time'),
                    "priority": record[0].get('priority')
                    }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "modify outliers",
                        "object": str(data_name),
                        "object_category": "data_source",
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

    # Remove data source temporary by object name
    def delete_ds_delete_temporary(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete temporary",
                        "object": str(data_name),
                        "object_category": "data_source",
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

    # Remove data source permanent by object name
    def delete_ds_delete_permanent(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

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
            collection_name = "kv_trackme_data_source_monitoring"            
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
                user = "nobody"

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete permanent",
                        "object": str(data_name),
                        "object_category": "data_source",
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

    # Enable Data Sampling by object name
    def post_ds_enable_data_sampling(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

        # Static
        data_sample_feature = "enabled"

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name' + '": "' + data_name + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_data_sampling"            
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
                collection.data.update(str(key), json.dumps({"data_name": str(data_name),
                    "data_sampling_nr": record[0].get('data_sampling_nr'),
                    "raw_sample": record[0].get('raw_sample'),
                    "data_sample_mtime": record[0].get('data_sample_mtime'),
                    "data_sample_feature": str(data_sample_feature),
                    "data_sample_iteration": record[0].get('data_sample_iteration'),
                    "data_sample_anomaly_reason": record[0].get('data_sample_anomaly_reason'),
                    "data_sample_status_colour": record[0].get('data_sample_status_colour'),
                    "data_sample_anomaly_ack_status": record[0].get('data_sample_anomaly_ack_status'),
                    "data_sample_anomaly_ack_mtime": record[0].get('data_sample_anomaly_ack_mtime'),
                    "data_sample_anomaly_detected": record[0].get('data_sample_anomaly_detected'),
                    "data_sample_status_message": record[0].get('data_sample_status_message'),
                    "multiformat_detected": record[0].get('multiformat_detected'),
                    "current_detected_format": record[0].get('current_detected_format'),
                    "current_detected_format_id": record[0].get('current_detected_format_id'),
                    "current_detected_format_dcount": record[0].get('current_detected_format_dcount'),
                    "previous_detected_format": record[0].get('previous_detected_format'),
                    "previous_detected_format_id": record[0].get('previous_detected_format_id'),
                    "previous_detected_format_dcount": record[0].get('previous_detected_format_dcount')
                }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    record = "{" + "object:" + str(data_name) + ", " +  "data_sample_feature:" + str(data_sample_feature) + "}"

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "enable data sampling",
                        "object": str(data_name),
                        "object_category": "data_source",
                        "object_attrs": str(record),
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
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Disable Data Sampling by object name
    def post_ds_disable_data_sampling(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

        # Static
        data_sample_feature = "disabled"

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name' + '": "' + data_name + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_data_sampling"            
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
                collection.data.update(str(key), json.dumps({"data_name": str(data_name),
                    "data_sampling_nr": record[0].get('data_sampling_nr'),
                    "raw_sample": record[0].get('raw_sample'),
                    "data_sample_mtime": record[0].get('data_sample_mtime'),
                    "data_sample_feature": str(data_sample_feature),
                    "data_sample_iteration": record[0].get('data_sample_iteration'),
                    "data_sample_anomaly_reason": record[0].get('data_sample_anomaly_reason'),
                    "data_sample_status_colour": record[0].get('data_sample_status_colour'),
                    "data_sample_anomaly_ack_status": record[0].get('data_sample_anomaly_ack_status'),
                    "data_sample_anomaly_ack_mtime": record[0].get('data_sample_anomaly_ack_mtime'),
                    "data_sample_anomaly_detected": record[0].get('data_sample_anomaly_detected'),
                    "data_sample_status_message": record[0].get('data_sample_status_message'),
                    "multiformat_detected": record[0].get('multiformat_detected'),
                    "current_detected_format": record[0].get('current_detected_format'),
                    "current_detected_format_id": record[0].get('current_detected_format_id'),
                    "current_detected_format_dcount": record[0].get('current_detected_format_dcount'),
                    "previous_detected_format": record[0].get('previous_detected_format'),
                    "previous_detected_format_id": record[0].get('previous_detected_format_id'),
                    "previous_detected_format_dcount": record[0].get('previous_detected_format_dcount')
                }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    record = "{" + "object:" + str(data_name) + ", " +  "data_sample_feature:" + str(data_sample_feature) + "}"

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "disable data sampling",
                        "object": str(data_name),
                        "object_category": "data_source",
                        "object_attrs": str(record),
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
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Update number of records per sample by object name
    def post_ds_update_data_sampling_records_nr(self, request_info, **kwargs):

        # By data_name
        data_name = None
        data_sampling_nr = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']
        data_sampling_nr = resp_dict['data_sampling_nr']

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "data_name' + '": "' + data_name + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_data_sampling"            
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
                collection.data.update(str(key), json.dumps({"data_name": str(data_name),
                    "data_sampling_nr": str(data_sampling_nr),
                    "raw_sample": record[0].get('raw_sample'),
                    "data_sample_mtime": record[0].get('data_sample_mtime'),
                    "data_sample_feature": record[0].get('data_sample_feature'),
                    "data_sample_iteration": record[0].get('data_sample_iteration'),
                    "data_sample_anomaly_reason": record[0].get('data_sample_anomaly_reason'),
                    "data_sample_status_colour": record[0].get('data_sample_status_colour'),
                    "data_sample_anomaly_ack_status": record[0].get('data_sample_anomaly_ack_status'),
                    "data_sample_anomaly_ack_mtime": record[0].get('data_sample_anomaly_ack_mtime'),
                    "data_sample_anomaly_detected": record[0].get('data_sample_anomaly_detected'),
                    "data_sample_status_message": record[0].get('data_sample_status_message'),
                    "multiformat_detected": record[0].get('multiformat_detected'),
                    "current_detected_format": record[0].get('current_detected_format'),
                    "current_detected_format_id": record[0].get('current_detected_format_id'),
                    "current_detected_format_dcount": record[0].get('current_detected_format_dcount'),
                    "previous_detected_format": record[0].get('previous_detected_format'),
                    "previous_detected_format_id": record[0].get('previous_detected_format_id'),
                    "previous_detected_format_dcount": record[0].get('previous_detected_format_dcount')
                }))

                # Record an audit change
                import time
                current_time = int(round(time.time() * 1000))
                user = "nobody"

                try:

                    record = "{" + "object:" + str(data_name) + ", " +  "data_sampling_nr:" + str(data_sampling_nr) + "}"

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "update data sampling records_nr",
                        "object": str(data_name),
                        "object_category": "data_source",
                        "object_attrs": str(record),
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
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }
