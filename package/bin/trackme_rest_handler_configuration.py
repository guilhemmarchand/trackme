from __future__ import absolute_import, division, print_function, unicode_literals

__name__ = "trackme_rest_handler_configuration.py"
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
import requests
import time
from urllib.parse import urlencode

splunkhome = os.environ['SPLUNK_HOME']

# set logging
logger = logging.getLogger(__name__)
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_rest_api.log", 'a')
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


class TrackMeHandlerConfiguration_v1(trackme_rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerConfiguration_v1, self).__init__(command_line, command_arg, logger)

    # Create a local hybrid tracker
    def get_components(self, request_info, **kwargs):

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

        # if describe is requested, show the usage
        if describe:

            response = "{\"describe\": \"This endpoint retrieves the current status of the TrackMe components and returns a JSON object\"}"
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

        # Define an header for requests authenticated communications with splunkd
        header = {
            'Authorization': 'Splunk %s' % request_info.session_key,
            'Content-Type': 'application/json'}

        # Get audit service
        # Audit collection
        collection_name_audit = "kv_trackme_audit_changes"            
        service_audit = client.connect(
            owner="nobody",
            app="trackme",
            port=splunkd_port,
            token=request_info.session_key
        )

        # retieve the components configuration
        component_data_hosts = None
        component_data_sources = None
        component_metric_sources = None
        conf_file = "trackme_settings"
        confs = service.confs[str(conf_file)]
        for stanza in confs:
            if stanza.name == 'components':
                for stanzakey, stanzavalue in stanza.content.items():
                    if stanzakey == "component_data_hosts":
                        component_data_hosts = stanzavalue
                    elif stanzakey == "component_data_sources":
                        component_data_sources = stanzavalue
                    elif stanzakey == "component_metric_sources":
                        component_metric_sources = stanzavalue


        response = {
            'component_data_sources': component_data_sources,
            'component_data_hosts': component_data_hosts,
            'component_metric_sources': component_metric_sources
        }

        return {
            "payload": json.dumps(response, indent=1),
            'status': 200 # HTTP status code
        }
