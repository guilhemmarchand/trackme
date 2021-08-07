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

class TrackMeHandlerLogicalGroups_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerLogicalGroups_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data sources collection as a Python array
    def get_logical_groups_collection(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the entire Logical Groups collection returned as a JSON array, it requires a GET call with no data required\"}"\

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_logical_group"            
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

    # Get group
    def get_logical_groups_get_grp(self, request_info, **kwargs):

        # By object_category and object
        object_group_name = None

        # query_string to find records
        query_string = None

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
                object_group_name = resp_dict['object_group_name']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint retrieve a specific logial group record, it requires a GET call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"object_group_name\": \"name of the logical group\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Define the KV query
        query_string = '{ "object_group_name": "' + object_group_name + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_logical_group"            
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

    # Add a new group
    def post_logical_groups_add_grp(self, request_info, **kwargs):

        # By object_category and object
        object_group_name = None
        object_group_members = None
        # object_group_min_green_percent is optional and set after data retrieve

        # query_string to find records
        query_string = None

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
                object_group_name = resp_dict['object_group_name']
                object_group_members = resp_dict['object_group_members']

                # object_group_members is expected as a comma separted list of values
                # We accept comma with or without a space after the seperator, let's remove any space after the separator
                object_group_members = object_group_members.replace(", ", ",")
                # Split by the separator
                object_group_members = object_group_members.split(",")

                # group min percentage is optional and set to 50% if not provided
                try:
                    object_group_min_green_percent = resp_dict['object_group_min_green_percent']
                except Exception as e:
                    object_group_min_green_percent = "50"

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint creates a new logical group, it requires a POST call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"object_group_name\": \"name of the logical group to be created\", "\
                + "\"object_group_members\": \"comma separated list of the group members\", "\
                + "\"object_group_min_green_percent\": \"OPTIONAL: minimal percentage of hosts that need to be green for the logical group to be green, if unset defaults to 50. Recommended options for this value: 12.5 / 33.33 / 50\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"

        # Define the KV query
        query_string = '{ "object_group_name": "' + object_group_name + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_logical_group"            
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

            # update time for the object
            import time
            object_group_mtime = time.time()

            # Get the current record
            # Notes: the record is returned as an array, as we search for a specific record, we expect one record only
            
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                key = None
                record = json.dumps({"object_group_name": object_group_name,
                    "object_group_members": object_group_members,
                    "object_group_min_green_percent": str(object_group_min_green_percent),
                    "object_group_mtime": str(object_group_mtime)})

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({"object_group_name": object_group_name,
                    "object_group_members": object_group_members,
                    "object_group_min_green_percent": str(object_group_min_green_percent),
                    "object_group_mtime": str(object_group_mtime)}))

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
                        "change_type": "Logical group add",
                        "object": str(object_group_name),
                        "object_category": "logical_group",
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

                # Insert the record
                collection.data.insert(json.dumps({"object_group_name": object_group_name,
                    "object_group_members": object_group_members,
                    "object_group_min_green_percent": str(object_group_min_green_percent),
                    "object_group_mtime": str(object_group_mtime)}))

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
                        "change_type": "Logical group add",
                        "object": str(object_group_name),
                        "object_category": "logical_group",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": json.dumps(collection.data.query(query=str(query_string)), indent=1),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Delete group
    def delete_logical_groups_del_grp(self, request_info, **kwargs):

        # By object_category and object
        object_group_name = None

        # query_string to find records
        query_string = None

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
                object_group_name = resp_dict['object_group_name']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes a logical group, it requires a DELETE call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"object_group_name\": \"name of the logical group to be removed\", "\
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
        query_string = '{ "object_group_name": "' + object_group_name + '" }'
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_logical_group"            
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
                record = json.dumps(collection.data.query_by_id(key), indent=1)

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
                        "change_type": "Logical group delete",
                        "object": str(object_group_name),
                        "object_category": "logical_group",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                return {
                    "payload": "Record with _key " + str(key) + " was deleted from the logical groups collection.",
                    'status': 200 # HTTP status code
                }

            else:

                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception2 encountered: ' + str(e) # Payload of the request.
            }


    # Associate a logical group with a member
    def post_logical_groups_associate_group(self, request_info, **kwargs):

        # By object
        object_name = None
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
                object_name = resp_dict['object']
                key = resp_dict['key']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint associates an object (data host or metric host) with an existing logical group (existing members"\
                " of the logical groups are preserved and this object membership will be removed), "\
                "it requires a POST call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"object\": \"the name of the data host or the metric host\", "\
                + "\"key\": \"the KVstore unique key of the logical group\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_logical_group"            
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

            # Get the record
            query_string = '{ "_key": "' + key + '" }'
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                record = None

            # Render result
            if record is not None:

                # get object_group_name                
                try:
                    object_group_name = record[0].get('object_group_name')
                except Exception as e:
                    object_group_name = None

                # get object_group_min_green_percent
                try:
                    object_group_min_green_percent = record[0].get('object_group_min_green_percent')
                except Exception as e:
                    object_group_min_green_percent = None

                # update time for the object
                import time
                object_group_mtime = time.time()

                # object: it can be defined, or not, if defined it can be a single item or a list
                object_list = None
                try:
                    object_list = record[0].get('object_group_members')
                except Exception as e:
                    object_list = None

                if object_list is None:
                    object_list = [ object_name ]

                # Analyse the content
                else:

                    # if is not a list, make it a list
                    if type(object_list) is not list:

                        # Split by the separator to convert as a list
                        object_list = object_list.split(",")

                        # append
                        object_list.append(object_name)

                    # this is a list, append if not in the list
                    else:

                        if object_name not in object_list:

                            # finally append the new object
                            object_list.append(object_name)

                # define the new record
                new_record = json.dumps({
                    "object_group_name": str(object_group_name),
                    "object_group_members": object_list,
                    "object_group_min_green_percent": str(object_group_min_green_percent),
                    "object_group_mtime": str(object_group_mtime)})

                # Update the record
                try:
                    collection.data.update(str(key), new_record)

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

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
                        "change_type": "associate logical group",
                        "object": str(object_name),
                        "object_category": "logical_groups",
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
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Unassociate a member and a logical group
    def post_logical_groups_unassociate(self, request_info, **kwargs):

        # By object
        object_name = None

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
                object_name = resp_dict['object']
                key = resp_dict['key']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint unassociates an object (data host or metric host) from a logical group it is member of "\
                "(existing associations of the logical groups are preserved), "\
                "it requires a POST call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"object\": \"the object name (data host or metric host) to remove association for\", "\
                + "\"key\": \"KVstore unique identifier of the logical group\", "\
                + "\"update_comment\": \"OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Retrieve from data
        resp_dict = json.loads(str(request_info.raw_args['payload']))

        # Update comment is optional and used for audit changes
        try:
            update_comment = resp_dict['update_comment']
        except Exception as e:
            update_comment = "API update"
        
        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        try:

            collection_name = "kv_trackme_logical_group"            
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

            # Get the record
            query_string = '{ "_key": "' + key + '" }'
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                record = None

            # Render result
            if record is not None and key is not None:

                # get object_group_name                
                try:
                    object_group_name = record[0].get('object_group_name')
                except Exception as e:
                    object_group_name = None

                # get object_group_min_green_percent
                try:
                    object_group_min_green_percent = record[0].get('object_group_min_green_percent')
                except Exception as e:
                    object_group_min_green_percent = None

                # update time for the object
                import time
                object_group_mtime = time.time()

                # object: it can be defined, or not, if defined it can be a single item or a list
                object_list = None
                try:
                    object_list = record[0].get('object_group_members')
                except Exception as e:
                    object_list = None

                if object_list is not None and object_name in object_list:

                    # if is a list
                    if type(object_list) is not list:

                        # We accept comma with or without a space after the seperator, let's remove any space after the separator
                        object_list = object_list.replace(", ", ",")
                        # Split by the separator to convert as a list
                        object_list = object_list.split(",")

                    # finally append the new object
                    object_list.remove(object_name)
                
                    # define the new record
                    new_record = json.dumps({
                        "object_group_name": str(object_group_name),
                        "object_group_members": object_list,
                        "object_group_min_green_percent": str(object_group_min_green_percent),
                        "object_group_mtime": str(object_group_mtime)})

                    # Update the record
                    try:
                        collection.data.update(str(key), new_record)

                    except Exception as e:
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }

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
                            "change_type": "unassociate logical group",
                            "object": str(object_name),
                            "object_category": "logical_groups",
                            "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                            "result": "N/A",
                            "comment": str(update_comment)
                            }))

                    except Exception as e:
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }
                
                    # end of work, return
                    return {
                        "payload": json.loads('{ "response": "object ' + str(object_name) + ' has been unassociated from logical group record key: ' + str(key) + "\" }"),
                        'status': 200 # HTTP status code
                    }

                # no association, nothing to do                
                else:
                    return {
                        "payload": json.loads('{ "response": "object ' + str(object_name) + ' has no active association with logical group record key: ' + str(key) + "\" }"),
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
