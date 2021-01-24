#!/usr/bin/env python
# coding=utf-8

# REST API SPL handler for TrackMe, allows interracting with the TrackMe API endpoints with get / post / delete calls
# See: https://trackme.readthedocs.io/en/latest/rest_api_reference.html

from __future__ import absolute_import, division, print_function, unicode_literals

import os
import sys
import splunk
import splunk.entity
import requests
import json
import re
import time

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
import rest_handler
import splunklib.client as client


@Configuration(distributed=False)

class TrackMeRestHandler(GeneratingCommand):

    # url and mode are required arguments of the SPL command
    url = Option(require=True)
    mode = Option(require=True)
    # body is optional and required for post and delete calls
    body = Option(require=False)

    def generate(self, **kwargs):

        if (self.url and re.search(r"services\/trackme", self.url)) and self.mode in ("get", "post", "delete"):

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
                    response = requests.get(target_url, headers={'Authorization': header}, verify=False, data=json_data)
                else:
                    response = requests.get(target_url, headers={'Authorization': header}, verify=False)                    

            # Post (body is required)
            elif self.mode in ("post"):
                response = requests.post(target_url, headers={'Authorization': header}, verify=False, data=json_data)

            # Delete (body is required)
            elif self.mode in ("delete"):
                response = requests.delete(target_url, headers={'Authorization': header}, verify=False, data=json_data)

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

        else:

            # yield
            data = {'_time': time.time(), '_raw': "{\"response\": \"" + "Error: bad request, URL must match /services/trackme/v1/<endpoint> and accepted HTTP modes are get / post / delete\"}"}
            yield data

dispatch(TrackMeRestHandler, sys.argv, sys.stdin, sys.stdout, __name__)
