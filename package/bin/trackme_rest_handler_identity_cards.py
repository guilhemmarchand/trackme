from __future__ import absolute_import, division, print_function, unicode_literals

__name__ = "trackme_rest_handler_identity_cards.py"
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

splunkhome = os.environ['SPLUNK_HOME']

# set logging
logger = logging.getLogger(__name__)
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_rest_handler_identity_cards.log", 'a')
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

class TrackMeHandlerIdentityCards_v1(trackme_rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerIdentityCards_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data sources collection as a Python array
    def get_identity_cards_collection(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the entire Identity Cards collection returned as a JSON array, it requires a GET call with no data required\"}"\

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
            collection = service.kvstore[collection_name]

            # Render
            logging.debug(json.dumps(collection.data.query(), indent=1))
            return {
                "payload": json.dumps(collection.data.query(), indent=1),
                'status': 200 # HTTP status code
            }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Get card for an object
    def get_identity_cards_get_card(self, request_info, **kwargs):

        # By object_category and object
        object_name = None

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
                object_name = resp_dict['object']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint retrieve the identity card linked to a specific data source, it requires a GET call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"object\": \"name of the data source\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Define the KV query
        query_string = '{ "object": "' + object_name + '" }'
        
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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
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

                logging.debug(json.dumps(collection.data.query_by_id(key), indent=1))
                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:

                logging.error('Warn: resource not found ' + str(key))
                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Get card by doc_link
    def get_identity_cards_get_card_by_doc_link(self, request_info, **kwargs):

        # By object_category and object
        doc_link = None

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
                doc_link = resp_dict['doc_link']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint retrieve the identity card by a doc_link, it requires a GET call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"doc_link\": \"value of the doc link\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        # Define the KV query
        query_string = '{ "doc_link": "' + doc_link + '" }'
        
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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
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

                logging.debug(json.dumps(collection.data.query_by_id(key), indent=1))
                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:

                logging.error('Warn: resource not found ' + str(key))
                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add a new card
    def post_identity_cards_add_card(self, request_info, **kwargs):

        # By doc_link
        doc_link = None
        doc_note = None

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
                doc_link = resp_dict['doc_link']

                # doc_note is optional
                try:                
                    doc_note = resp_dict['doc_note']
                except Exception as e:
                    doc_note = None

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint creates a new identity card that can later on be associated with one or more data sources "\
                "(if the card based on the doc_link does not exist it is created, if the card exists already, the doc_link and doc_note are updated "\
                "and the definition of object is preserved), it requires a POST call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"doc_link\": \"href link of the identity card\", "\
                + "\"doc_note\": \"OPTIONAL: documentation note\", "\
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
        query_string = '{ "doc_link": "' + doc_link + '" }'
        
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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
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
                record = json.dumps({"doc_link": str(doc_note),
                    "doc_note": str(doc_note)})

            # Render result
            if key is not None and len(key)>2:

                # Update the record
                collection.data.update(str(key), json.dumps({"object": record[0].get('object'),
                    "doc_link": str(doc_link),
                    "doc_note": str(doc_note)}))

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
                        "change_type": "update identity card",
                        "object": str(doc_link),
                        "object_category": "data_source",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(json.dumps(collection.data.query_by_id(key), indent=1))
                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:

                # Insert the record
                collection.data.insert(json.dumps({"doc_link": str(doc_link),
                    "doc_note": str(doc_note)}))

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
                        "change_type": "create identity card",
                        "object": str(doc_link),
                        "object_category": "data_source",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(json.dumps(collection.data.query(query=str(query_string)), indent=1))
                return {
                    "payload": json.dumps(collection.data.query(query=str(query_string)), indent=1),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Associate a data source with an identity card
    def post_identity_cards_associate_card(self, request_info, **kwargs):

        # By doc_link
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

            response = "{\"describe\": \"This endpoint associates an existing identity card with a data source (if there are data sources associated "\
                "with this card already, the list of data sources is preserved and the data source to be associated is added to the list), "\
                "it requires a POST call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"object\": \"the data source name to be associated with this card\", "\
                + "\"key\": \"the KVstore unique key for this identity card\", "\
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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
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

                # get doc_link                
                try:
                    doc_link = record[0].get('doc_link')
                except Exception as e:
                    doc_link = None

                # get doc_note
                try:
                    doc_note = record[0].get('doc_note')
                except Exception as e:
                    doc_note = None

                # object: it can be defined, or not, if defined it can be a single item or a list
                object_list = None
                try:
                    object_list = record[0].get('object')
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
                if doc_note is not None:
                    new_record = json.dumps({
                        "object": object_list,
                        "doc_link": str(doc_link),
                        "doc_note": str(doc_note)})

                else:
                    new_record = json.dumps({
                            "object": object_name,
                            "doc_link": str(doc_link)})

                # Update the record
                try:
                    collection.data.update(str(key), new_record)

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
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
                        "change_type": "associate identity card",
                        "object": str(object_name),
                        "object_category": "data_source",
                        "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(json.dumps(collection.data.query_by_id(key), indent=1))
                return {
                    "payload": json.dumps(collection.data.query_by_id(key), indent=1),
                    'status': 200 # HTTP status code
                }

            else:
                logging.error('Warn: resource not found ' + str(key))
                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Unassociate a data source and a card
    def post_identity_cards_unassociate(self, request_info, **kwargs):

        # By doc_link
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

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint unassociates the identify card of an object (other data sources association are preserved, "\
                "if this data source is the last associated with this card, the card is preserved), "\
                "it requires a POST call with the following data required:\""\
                + ", \"options\" : [ { "\
                + "\"object\": \"the object name (data source) to remove association for\", "\
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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
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
            query_string = '{ "object": "' + object_name + '" }'
            try:
                record = collection.data.query(query=str(query_string))
                key = record[0].get('_key')

            except Exception as e:
                record = None

            # Render result
            if record is not None and key is not None:

                # get doc_link                
                try:
                    doc_link = record[0].get('doc_link')
                except Exception as e:
                    doc_link = None

                # get doc_note
                try:
                    doc_note = record[0].get('doc_note')
                except Exception as e:
                    doc_note = None

                # object: it can be defined, or not, if defined it can be a single item or a list
                object_list = None
                try:
                    object_list = record[0].get('object')
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
                    if doc_note is not None:
                        new_record = json.dumps({
                            "object": object_list,
                            "doc_link": str(doc_link),
                            "doc_note": str(doc_note)})

                    else:
                        new_record = json.dumps({
                                "object": object_name,
                                "doc_link": str(doc_link)})

                    # Update the record
                    try:
                        collection.data.update(str(key), new_record)

                    except Exception as e:
                        logging.error('Warn: exception encountered: ' + str(e))
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
                            "change_type": "associate identity card",
                            "object": str(object_name),
                            "object_category": "data_source",
                            "object_attrs": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                            "result": "N/A",
                            "comment": str(update_comment)
                            }))

                    except Exception as e:
                        logging.error('Warn: exception encountered: ' + str(e))
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }
                
                    # end of work, return
                    logging.debug(json.loads('{ "response": "object ' + str(object_name) + ' has been unassociated from identity card record key: ' + str(key) + "\" }"))
                    return {
                        "payload": json.loads('{ "response": "object ' + str(object_name) + ' has been unassociated from identity card record key: ' + str(key) + "\" }"),
                        'status': 200 # HTTP status code
                    }

                # no association, nothing to do                
                else:
                    logging.debug(str(json.dumps(collection.data.query_by_id(key), indent=1)))
                    return {
                        "payload": str(json.dumps(collection.data.query_by_id(key), indent=1)),
                        'status': 200 # HTTP status code
                    }

            else:
                logging.debug(json.loads('{ "response": "object ' + str(object_name) + ' already has no identity card association."}'))
                return {
                    "payload": json.loads('{ "response": "object ' + str(object_name) + ' already has no identity card association."}'),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # delete identity card by _key
    def delete_identity_cards_delete_card(self, request_info, **kwargs):

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
                key = resp_dict['key']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an idenfity card by the Kvstore key, it requires a DELETE call with the following information:\""\
                + ", \"options\" : [ { "\
                + "\"key\": \"KVstore unique identifier for this record\", "\
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

        try:

            collection_name = "kv_trackme_sources_knowledge"            
            collection = service.kvstore[collection_name]

            # Get the record
            try:
                record = json.dumps(collection.data.query_by_id(key), indent=1)
            except Exception as e:
                record = None

            # Render result
            if record is not None and len(record)>2:

                # Audit collection
                collection_name_audit = "kv_trackme_audit_changes"
                service_audit = client.connect(
                    owner="nobody",
                    app="trackme",
                    port=splunkd_port,
                    token=request_info.session_key
                )
                collection_audit = service_audit.kvstore[collection_name_audit]

                # Update the record
                try:
                    collection.data.delete(json.dumps({"_key":key}))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
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
                        "change_type": "delete identity card",
                        "object": str(key),
                        "object_category": "data_source",
                        "object_attrs": str(json.dumps(record, indent=1)),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug("Record with _key " + str(key) + " was deleted from the collection.")
                return {
                    "payload": "Record with _key " + str(key) + " was deleted from the collection.",
                    'status': 200 # HTTP status code
                }

            else:
                logging.error('Warn: resource not found ' + str(key))
                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }


        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }
