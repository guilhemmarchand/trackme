import logging
import os, sys
import splunk
import json

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import rest_handler
import splunklib.client as client

class TrackMeHandlerAck_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerAck_v1, self).__init__(command_line, command_arg, logger)

    def get_ack_by_key(self, request_info, **kwargs):

        # By object_category and object
        key = ''
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        key = resp_dict['_key']
        
        try:

            collection_name = "kv_trackme_alerts_ack"            
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

    def get_ack_by_object(self, request_info, **kwargs):

        # By object_category and object
        object_category_value = ''
        object_value = ''
        query_string = None

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        object_value = resp_dict['object']
        object_category_value = resp_dict['object_category']

        # Define the KV query
        query_string = '{ "$and": [ { "object_category": "' + object_category_value + '" }, { "object' + '": "' + object_value + '" } ] }'
        
        try:

            collection_name = "kv_trackme_alerts_ack"            
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
