from __future__ import absolute_import, division, print_function, unicode_literals

__name__ = "trackme_rest_handler_blocklist.py"
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
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_rest_handler_blocklist.log", 'a')
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

class TrackMeHandlerBlockList_v1(trackme_rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerBlockList_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire collection as a Python array
    def get_blocklist_ds_host(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_source_monitoring_blacklist_host"            
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


    # Get the entire collection as a Python array
    def get_blocklist_ds_index(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_source_monitoring_blacklist_index"            
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


    # Get the entire collection as a Python array
    def get_blocklist_ds_sourcetype(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_source_monitoring_blacklist_sourcetype"            
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


    # Get the entire collection as a Python array
    def get_blocklist_ds_data_name(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_source_monitoring_blacklist_data_name"            
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


    # Get the entire collection as a Python array
    def get_blocklist_dh_host(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_host_monitoring_blacklist_host"            
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


    # Get the entire collection as a Python array
    def get_blocklist_dh_index(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_host_monitoring_blacklist_index"            
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


    # Get the entire collection as a Python array
    def get_blocklist_dh_sourcetype(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_data_host_monitoring_blacklist_sourcetype"            
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


    # Get the entire collection as a Python array
    def get_blocklist_mh_host(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_metric_host_monitoring_blacklist_host"            
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


    # Get the entire collection as a Python array
    def get_blocklist_mh_index(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_metric_host_monitoring_blacklist_index"            
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


    # Get the entire collection as a Python array
    def get_blocklist_mh_metric_category(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint retrieves the current block list collection returned as a JSON array, it requires a GET call with no data required\"}"\

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

            collection_name = "kv_trackme_metric_host_monitoring_blacklist_metric_category"            
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

    # Add new blocklist index if does not exist yet
    def post_blocklist_ds_host_add(self, request_info, **kwargs):

        # Declare
        data_host = None
        query_string = None
        data_blacklist_state = "true"

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

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_host"            
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
                        "change_type": "add blocklist host",
                        "object": str(data_host),
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

                logging.debug(str(record))
                return {                    
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_host": data_host, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist host",
                        "object": str(data_host),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Add new blocklist index if does not exist yet
    def post_blocklist_ds_index_add(self, request_info, **kwargs):

        # Declare
        data_index = None
        query_string = None
        data_blacklist_state = "true"

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
                data_index = resp_dict['data_index']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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
        query_string = '{ "data_index": "' + data_index + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_index"            
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
                        "change_type": "add blocklist index",
                        "object": str(data_index),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_index": data_index, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist index",
                        "object": str(data_index),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist index if does not exist yet
    def post_blocklist_ds_sourcetype_add(self, request_info, **kwargs):

        # Declare
        data_sourcetype = None
        query_string = None
        data_blacklist_state = "true"

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
                data_sourcetype = resp_dict['data_sourcetype']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_sourcetype\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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
        query_string = '{ "data_sourcetype": "' + data_sourcetype + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_sourcetype"            
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
                        "change_type": "add blocklist sourcetype",
                        "object": str(data_sourcetype),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_sourcetype": data_sourcetype, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist sourcetype",
                        "object": str(data_sourcetype),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist data_name if does not exist yet
    def post_blocklist_ds_data_name_add(self, request_info, **kwargs):

        # Declare
        data_name = None
        query_string = None
        data_blacklist_state = "true"

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

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_data_name"            
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
                        "change_type": "add blocklist data_name",
                        "object": str(data_name),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_name": data_name, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist data_name",
                        "object": str(data_name),
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

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist index if does not exist yet
    def delete_blocklist_ds_host_del(self, request_info, **kwargs):

        # Declare
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

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"value to be removed from the collection\", "\
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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_host"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist host",
                        "object": str(data_host),
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


    # Add new blocklist index if does not exist yet
    def delete_blocklist_ds_index_del(self, request_info, **kwargs):

        # Declare
        data_index = None
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
                data_index = resp_dict['data_index']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_index\": \"value to be removed from the collection\", "\
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
        query_string = '{ "data_index": "' + data_index + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_index"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist index",
                        "object": str(data_index),
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


    # Add new blocklist index if does not exist yet
    def delete_blocklist_ds_sourcetype_del(self, request_info, **kwargs):

        # Declare
        data_sourcetype = None
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
                data_sourcetype = resp_dict['data_sourcetype']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_sourcetype\": \"value to be removed from the collection\", "\
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
        query_string = '{ "data_sourcetype": "' + data_sourcetype + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_sourcetype"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist sourcetype",
                        "object": str(data_sourcetype),
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

                logging.debug("Record with _key " + str(key) + " was deleted from the collection.")
                return {
                    "payload": "Record with _key " + str(key) + " was deleted from the collection.",
                    'status': 200 # HTTP status code
                }

            else:

                logging.debug('Warn: resource not found ' + str(key))
                return {
                    "payload": 'Warn: resource not found ' + str(key),
                    'status': 404 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Add new blocklist data_name if does not exist yet
    def delete_blocklist_ds_data_name_del(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_name\": \"value to be removed from the collection\", "\
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

            # Data collection
            collection_name = "kv_trackme_data_source_monitoring_blacklist_data_name"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist data_name",
                        "object": str(data_name),
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


    # Add new blocklist index if does not exist yet
    def post_blocklist_dh_host_add(self, request_info, **kwargs):

        # Declare
        data_host = None
        query_string = None
        data_blacklist_state = "true"

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

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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

            # Data collection
            collection_name = "kv_trackme_data_host_monitoring_blacklist_host"            
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
                        "change_type": "add blocklist host",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_host": data_host, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist host",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Add new blocklist index if does not exist yet
    def post_blocklist_dh_index_add(self, request_info, **kwargs):

        # Declare
        data_index = None
        query_string = None
        data_blacklist_state = "true"

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
                data_index = resp_dict['data_index']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_index\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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
        query_string = '{ "data_index": "' + data_index + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_host_monitoring_blacklist_index"            
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
                        "change_type": "add blocklist index",
                        "object": str(data_index),
                        "object_category": "data_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_index": data_index, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist index",
                        "object": str(data_index),
                        "object_category": "data_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist index if does not exist yet
    def post_blocklist_dh_sourcetype_add(self, request_info, **kwargs):

        # Declare
        data_sourcetype = None
        query_string = None
        data_blacklist_state = "true"

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
                data_sourcetype = resp_dict['data_sourcetype']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"data_sourcetype\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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
        query_string = '{ "data_sourcetype": "' + data_sourcetype + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_host_monitoring_blacklist_sourcetype"            
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
                        "change_type": "add blocklist sourcetype",
                        "object": str(data_sourcetype),
                        "object_category": "data_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"data_sourcetype": data_sourcetype, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist sourcetype",
                        "object": str(data_sourcetype),
                        "object_category": "data_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist index if does not exist yet
    def delete_blocklist_dh_host_del(self, request_info, **kwargs):

        # Declare
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

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_host\": \"value to be removed from the blocklist\", "\
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

            # Data collection
            collection_name = "kv_trackme_data_host_monitoring_blacklist_host"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist host",
                        "object": str(data_host),
                        "object_category": "data_host",
                        "object_attrs": str(record),
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


    # Add new blocklist index if does not exist yet
    def delete_blocklist_dh_index_del(self, request_info, **kwargs):

        # Declare
        data_index = None
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
                data_index = resp_dict['data_index']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_index\": \"value to be removed from the blocklist\", "\
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
        query_string = '{ "data_index": "' + data_index + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_host_monitoring_blacklist_index"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist index",
                        "object": str(data_index),
                        "object_category": "data_host",
                        "object_attrs": str(record),
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


    # Add new blocklist index if does not exist yet
    def delete_blocklist_dh_sourcetype_del(self, request_info, **kwargs):

        # Declare
        data_sourcetype = None
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
                data_sourcetype = resp_dict['data_sourcetype']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_index\": \"value to be removed from the blocklist\", "\
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
        query_string = '{ "data_sourcetype": "' + data_sourcetype + '" }'

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

            # Data collection
            collection_name = "kv_trackme_data_host_monitoring_blacklist_sourcetype"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist sourcetype",
                        "object": str(data_sourcetype),
                        "object_category": "data_host",
                        "object_attrs": str(record),
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

    # Add new blocklist index if does not exist yet
    def post_blocklist_mh_host_add(self, request_info, **kwargs):

        # Declare
        metric_host = None
        query_string = None
        data_blacklist_state = "true"

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

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"data_index\": \"value to be removed from the blocklist\", "\
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

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring_blacklist_host"            
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
                        "change_type": "add blocklist host",
                        "object": str(metric_host),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"metric_host": metric_host, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist host",
                        "object": str(metric_host),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }

    # Add new blocklist index if does not exist yet
    def post_blocklist_mh_index_add(self, request_info, **kwargs):

        # Declare
        metric_index = None
        query_string = None
        data_blacklist_state = "true"

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
                metric_index = resp_dict['metric_index']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"metric_index\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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
        query_string = '{ "metric_index": "' + metric_index + '" }'

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

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring_blacklist_index"            
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
                        "change_type": "add blocklist index",
                        "object": str(metric_index),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"metric_index": metric_index, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist index",
                        "object": str(metric_index),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist index if does not exist yet
    def post_blocklist_mh_metric_category_add(self, request_info, **kwargs):

        # Declare
        metric_category = None
        query_string = None
        data_blacklist_state = "true"

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
                metric_category = resp_dict['metric_category']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint adds a new record returned as a JSON array, it requires a POST call with no data required:\""\
                + ", \"options\" : [ { "\
                + "\"metric_category\": \"value to be added to the blocklist, accepts wildcards and regular expressions\", "\
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
        query_string = '{ "metric_category": "' + metric_category + '" }'

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

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring_blacklist_metric_category"            
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
                        "change_type": "add blocklist metric_category",
                        "object": str(metric_category),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

            else:

                # This record does not exist yet

                # Insert the record
                collection.data.insert(json.dumps({"metric_category": metric_category, "data_blacklist_state": data_blacklist_state}))

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
                        "change_type": "add blocklist metric_category",
                        "object": str(metric_category),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
                        "result": "N/A",
                        "comment": str(update_comment)
                        }))

                except Exception as e:
                    logging.error('Warn: exception encountered: ' + str(e))
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

                logging.debug(str(record))
                return {
                    "payload": str(record),
                    'status': 200 # HTTP status code
                }

        except Exception as e:
            logging.error('Warn: exception encountered: ' + str(e))
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }


    # Add new blocklist index if does not exist yet
    def delete_blocklist_mh_host_del(self, request_info, **kwargs):

        # Declare
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

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"metric_host\": \"value to be removed from the collection\", "\
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

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring_blacklist_host"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist host",
                        "object": str(metric_host),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
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


    # Add new blocklist index if does not exist yet
    def delete_blocklist_mh_index_del(self, request_info, **kwargs):

        # Declare
        metric_index = None
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
                metric_index = resp_dict['metric_index']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"metric_index\": \"value to be removed from the blocklist\", "\
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
        query_string = '{ "metric_index": "' + metric_index + '" }'

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

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring_blacklist_index"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist index",
                        "object": str(metric_index),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
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


    # Add new blocklist index if does not exist yet
    def delete_blocklist_mh_metric_category_del(self, request_info, **kwargs):

        # Declare
        metric_category = None
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
                metric_category = resp_dict['metric_category']

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint deletes an existing record returned as a JSON array, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"metric_category\": \"value to be removed from the blocklist\", "\
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
        query_string = '{ "metric_category": "' + metric_category + '" }'

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

            # Data collection
            collection_name = "kv_trackme_metric_host_monitoring_blacklist_metric_category"            
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

                    # Remove the record
                    collection.data.delete(json.dumps({"_key":key}))

                    # Insert the record
                    collection_audit.data.insert(json.dumps({    
                        "time": str(current_time),
                        "user": str(user),
                        "action": "success",
                        "change_type": "delete blocklist metric_category",
                        "object": str(metric_category),
                        "object_category": "metric_host",
                        "object_attrs": str(record),
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

