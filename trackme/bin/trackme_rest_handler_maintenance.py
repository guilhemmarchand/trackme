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

class TrackMeHandlerMaintenance_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerMaintenance_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data sources collection as a Python array
    def get_maintenance_status(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current maintenance mode collection returned as a JSON array, it requires a GET call with no data required\"}"\

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_maintenance_mode"            
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


    # Enable the maintenance mode
    def post_maintenance_enable(self, request_info, **kwargs):

        # Declare
        maintenance_mode_start = None
        maintenance_mode_end = None
        maintenance_duration = None
        maintenance_mode = "enabled"
        update_comment = "API update"

        import time

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

                try:
                    resp_dict = json.loads(str(request_info.raw_args['payload']))
                except Exception as e:
                    resp_dict = []

                # Get start and end maintenance, both are optionals

                # maintenance_mode_start
                try:
                    maintenance_mode_start = int(resp_dict['maintenance_mode_start'])
                except Exception as e:
                    maintenance_mode_start = 0

                # maintenance_mode_end
                try:
                    maintenance_mode_end = int(resp_dict['maintenance_mode_end'])
                except Exception as e:
                    maintenance_mode_end = 0

                # maintenance_duration
                try:
                    maintenance_duration = int(resp_dict['maintenance_duration'])
                except Exception as e:
                    maintenance_duration = 0

                # Update comment is optional and used for audit changes
                try:
                    update_comment = resp_dict['update_comment']
                except Exception as e:
                    update_comment = "API update"

        else:
            # body is not required in this endpoint
            describe = False

        if describe:

            response = "{\"describe\": \"This endpoint enables the maintenance mode, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"maintenance_duration\": \"(integer) OPTIONAL: the duration of the maintenance window in seconds, if unspecified and maintenance_mode_end is not specified either, defaults to now plus 24 hours\", "\
                + "\"maintenance_mode_end\": \"(integer) OPTIONAL: the date time in epochtime format for the end of the maintenance window, it is overriden by maintenance_duration if specified, defaults to now plus 24 hours if not specified and maintenance_duration is not specified\", "\
                + "\"maintenance_mode_start\": \"(integer) OPTIONAL: the date time in epochtime format for the start of the maintennce window, defaults to now if not specified\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Calculates start and end
        time_updated = round(time.time())

        # if maintenance start is not specified, starts at now
        if (maintenance_mode_start is None) or (maintenance_mode_start <= 0):
            maintenance_mode_start = str(round(time_updated))

        # if maintenance end is not specified, and maintenance duration is not specified either, defaults to now + 24 hours
        if (maintenance_mode_end is None) or (maintenance_mode_end <= 0):
            maintenance_mode_end = str(round(time.time() + 86400))

        # if maintenance duration is specified, it overrides the maintenance end whenever it is specified or not
        if (maintenance_duration is not None) and (maintenance_duration > 0):
            maintenance_mode_end = str(round(time.time() + maintenance_duration))

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_maintenance_mode"            
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
                record = collection.data.query()
                key = record[0].get('_key')

            except Exception as e:
                key = None

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({"maintenance_mode": str(maintenance_mode),
                    "time_updated": str(time_updated),
                    "maintenance_mode_start": str(maintenance_mode_start),
                    "maintenance_mode_end": str(maintenance_mode_end)}))

                # Record an audit change
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({                        
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "enable maintenance mode",
                        "object": "all",
                        "object_category": "all",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query(), indent=1),
                    'status': 200 # HTTP status code
                }

            else:

                # Insert the record
                collection.data.insert(json.dumps({"maintenance_mode": str(maintenance_mode),
                    "time_updated": str(time_updated),
                    "maintenance_mode_start": str(maintenance_mode_start),
                    "maintenance_mode_end": str(maintenance_mode_end)}))

                # Record an audit change
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({                        
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "enable maintenance mode",
                        "object": "all",
                        "object_category": "all",
                        "object_attrs": json.dumps({"maintenance_mode": str(maintenance_mode), "time_updated": str(time_updated), "maintenance_mode_start": str(maintenance_mode_start), "maintenance_mode_end": str(maintenance_mode_end)}, index=1),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                # Render
                return {
                    "payload": json.dumps(collection.data.query(), indent=1),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Disable the maintenance mode
    def post_maintenance_disable(self, request_info, **kwargs):

        import time

        # Declare
        maintenance_mode_start = "N/A"
        maintenance_mode_end = "N/A"
        maintenance_mode = "disabled"
        update_comment = "API update"

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

                try:
                    resp_dict = json.loads(str(request_info.raw_args['payload']))
                except Exception as e:
                    resp_dict = []

                # Update comment is optional and used for audit changes
                try:
                    update_comment = resp_dict['update_comment']
                except Exception as e:
                    update_comment = "API update"

        else:
            # body is not required in this endpoint
            describe = False

        if describe:

            response = "{\"describe\": \"This endpoint disables the maintenance mode, it requires a POST call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
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

            collection_name = "kv_trackme_maintenance_mode"            
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
                record = collection.data.query()
                key = record[0].get('_key')

            except Exception as e:
                key = None

            # An ack record exists already in the collection, perform an update
            time_updated = round(time.time())

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({"maintenance_mode": str(maintenance_mode),
                    "time_updated": str(time_updated),
                    "maintenance_mode_start": str(maintenance_mode_start),
                    "maintenance_mode_end": str(maintenance_mode_end)}))

                # Record an audit change
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({                        
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "disable maintenance mode",
                        "object": "all",
                        "object_category": "all",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query(), indent=1),
                    'status': 200 # HTTP status code
                }

            else:

                # Insert the record
                collection.data.insert(json.dumps({"maintenance_mode": str(maintenance_mode),
                    "time_updated": str(time_updated),
                    "maintenance_mode_start": str(maintenance_mode_start),
                    "maintenance_mode_end": str(maintenance_mode_end)}))

                # Record an audit change
                current_time = int(round(time.time() * 1000))
                user = request_info.user

                try:

                    # Insert the record
                    collection_audit.data.insert(json.dumps({                        
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "disable maintenance mode",
                        "object": "all",
                        "object_category": "all",
                        "object_attrs": json.dumps({"maintenance_mode": str(maintenance_mode), "time_updated": str(time_updated), "maintenance_mode_start": str(maintenance_mode_start), "maintenance_mode_end": str(maintenance_mode_end)}, index=1),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                # Render
                return {
                    "payload": json.dumps(collection.data.query(), indent=1),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }
