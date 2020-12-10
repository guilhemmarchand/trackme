import logging
import os, sys
import splunk
import splunk.rest
import json

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import rest_handler

class TrackMeHandler(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandler, self).__init__(command_line, command_arg, logger)

    def get_ack(self, request_info, **kwargs):

        # By key
        key = ''
        resp_dict = json.loads(str(request_info.raw_args['payload']))
        key = resp_dict['key']

        try:
            response, content = splunk.rest.simpleRequest('/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_alerts_ack/' + key,
                                    sessionKey=request_info.session_key,
                                    getargs={'output_mode': 'json'})
            if response.status == 200:
                return {
                    'payload': str(content), # Payload of the request.
                    'status': response.status # HTTP status code
                }
            else:
                return {
                    'payload': 'Warn: no resources found.', # Payload of the request.
                    'status': response.status # HTTP status code
                }
        except Exception as e:
            return {
                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
            }
