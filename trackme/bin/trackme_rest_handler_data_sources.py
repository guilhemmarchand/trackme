import logging
import os, sys
import splunk
import json
import time

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import rest_handler
import splunklib.client as client

class TrackMeHandlerDataSources_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerDataSources_v1, self).__init__(command_line, command_arg, logger)

    # Get data source by _key
    def get_ds_by_key(self, request_info, **kwargs):

        # By object_category and object
        key = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        key = resp_dict['_key']
        
        try:

            collection_name = "kv_trackme_data_source_monitoring"            
            service = client.connect(
                owner="nobody",
                app="trackme",
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
        
        try:

            collection_name = "kv_trackme_data_source_monitoring"            
            service = client.connect(
                owner="nobody",
                app="trackme",
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
    def post_ds_disable_monitoring_by_name(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'
        
        try:

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            service_audit = client.connect(
                owner="nobody",
                app="trackme",
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
                        "comment": "API update"
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
    def post_ds_enable_monitoring_by_name(self, request_info, **kwargs):

        # By data_name
        data_name = None
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        data_name = resp_dict['data_name']

        # Define the KV query
        query_string = '{ "data_name": "' + data_name + '" }'
        
        try:

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring"            
            service = client.connect(
                owner="nobody",
                app="trackme",
                token=request_info.session_key
            )
            collection = service.kvstore[collection_name]

            # Audit collection
            collection_name_audit = "kv_trackme_audit_changes"            
            service_audit = client.connect(
                owner="nobody",
                app="trackme",
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
                        "comment": "API update"
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
