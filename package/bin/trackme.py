#!/usr/bin/env python
# coding=utf-8

from __future__ import absolute_import, division, print_function, unicode_literals

__author__ = "TrackMe Limited"
__copyright__ = "Copyright 2021, TrackMe Limited, U.K."
__credits__ = ["Guilhem Marchand"]
__license__ = "TrackMe Limited, all rights reserved"
__version__ = "0.1.0"
__maintainer__ = "TrackMe Limited, U.K."
__email__ = "support@trackme-solutions.com"
__status__ = "PRODUCTION"

import os
import sys
import splunk
import splunk.entity
import requests
import json
import re
import time
import logging

splunkhome = os.environ['SPLUNK_HOME']

# set logging
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme.log", 'a')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(filename)s %(funcName)s %(lineno)d %(message)s')
filehandler.setFormatter(formatter)
log = logging.getLogger()  # root logger - Good to get it only once.
for hdlr in log.handlers[:]:  # remove the existing file handlers
    if isinstance(hdlr,logging.FileHandler):
        log.removeHandler(hdlr)
log.addHandler(filehandler)      # set the new handler
# set the log level to INFO, DEBUG as the default is ERROR
log.setLevel(logging.INFO)

sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
import trackme_rest_handler
import splunklib.client as client


@Configuration(distributed=False)

class TrackMeRestHandler(GeneratingCommand):

    # url and mode are required arguments of the SPL command
    url = Option(require=True)
    mode = Option(require=True)
    # body is optional and required for post and delete calls
    body = Option(require=False)

    def generate(self, **kwargs):

        if (self.url and re.search(r"^\/services\/trackme\/v\d*", self.url)) and self.mode in ("get", "post", "delete"):

            # set loglevel
            loglevel = 'INFO'
            conf_file = "trackme_settings"
            confs = self.service.confs[str(conf_file)]
            for stanza in confs:
                if stanza.name == 'logging':
                    for stanzakey, stanzavalue in stanza.content.items():
                        if stanzakey == "loglevel":
                            loglevel = stanzavalue
            logginglevel = logging.getLevelName(loglevel)
            log.setLevel(logginglevel)

            # Get the session key
            session_key = self._metadata.searchinfo.session_key

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']

            # build header and target
            header = 'Splunk ' + str(session_key)
            target_url = "https://localhost:" + str(splunkd_port) + str(self.url)

            # prepare the body data, if any
            json_data = None
            if self.body:
                json_data = json.dumps(json.loads(self.body.replace("\'", "\""), strict=False), indent=1)

            # Run http request
            response_data = None

            # Get
            if self.mode in ("get"):
                if self.body:
                    logging.info("Running GET query to endpoint=" + str(target_url) + "with body=" + str(json_data))
                    response = requests.get(target_url, headers={'Authorization': header, 'Content-Type': 'application/json'}, verify=False, data=json_data)
                else:
                    logging.info("Running GET query to endpoint=" + str(target_url))
                    response = requests.get(target_url, headers={'Authorization': header}, verify=False)                    

            # Post (body is required)
            elif self.mode in ("post"):
                logging.info("Running POST query to endpoint=" + str(target_url) + "with body=" + str(json_data))
                response = requests.post(target_url, headers={'Authorization': header, 'Content-Type': 'application/json'}, verify=False, data=json_data)

            # Delete (body is required)
            elif self.mode in ("delete"):
                logging.info("Running DELETE query to endpoint=" + str(target_url) + "with body=" + str(json_data))
                response = requests.delete(target_url, headers={'Authorization': header, 'Content-Type': 'application/json'}, verify=False, data=json_data)

            # yield data

            # parse if response is a proper json, otherwise returns as string
            response_data = None

            # if is an array containing multiple json, return as response.text
            if re.search(r"^\[", response.text) and re.search(r"\}\,", response.text) and re.search(r"\]$", response.text):
                response_data = response.text

            # otherwise attempts json format
            else:

                try:
                    response_data = json.loads(json.dumps(response.json(), indent=1))
                except Exception as e:
                    # Response is not json, let's parse and make it a json answer
                    response_data = str(response.text)
                    response_data = "{\"response\": \"" + str(response_data.replace("\"", "\\\"")) + "\"}"

            # yield
            data = {'_time': time.time(), '_raw': response_data}
            yield data
            logging.debug(response_data)
            logging.info("call terminated, response is logged in debug mode only")

        else:
            # yield
            data = {'_time': time.time(), '_raw': "{\"response\": \"" + "Error: bad request, URL must match /services/trackme/v1/<endpoint> and accepted HTTP modes are get / post / delete\"}"}
            yield data
            logging.error("{\"response\": \"" + "Error: bad request, URL must match /services/trackme/v1/<endpoint> and accepted HTTP modes are get / post / delete\"}")

dispatch(TrackMeRestHandler, sys.argv, sys.stdin, sys.stdout, __name__)
