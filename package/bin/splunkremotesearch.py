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
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
import time
import csv
import json
import re

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
import splunklib.client as client

@Configuration(distributed=False)

class SplunkRemoteSearch(GeneratingCommand):

    account = Option(
        doc='''
        **Syntax:** **account=****
        **Description:** Splunk remote deployment account to be used for the query.''',
        require=True, default=None)

    search = Option(
        doc='''
        **Syntax:** **search=****
        **Description:** The Splunk query to be executed.''',
        require=True, default=None)

    earliest = Option(
        doc='''
        **Syntax:** **earliest=****
        **Description:** The earliest time for the search.''',
        require=True, default=None)

    latest = Option(
        doc='''
        **Syntax:** **latest=****
        **Description:** The latest time for the search.''',
        require=True, default=None)

    def generate(self, **kwargs):

        if self:

            # Get the session key
            session_key = self._metadata.searchinfo.session_key

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']

            # Splunk credentials store
            storage_passwords = self.service.storage_passwords

            # get all acounts
            accounts = []
            conf_file = "trackme_account"
            confs = self.service.confs[str(conf_file)]
            for stanza in confs:
                # get all accounts
                for name in stanza.name:
                    accounts.append(stanza.name)
                    break
                
            # define the account target
            account = str(self.account)

            # account configuration
            isfound = False
            splunk_url = None
            app_namespace = None

            conf_file = "trackme_account"
            confs = self.service.confs[str(conf_file)]
            for stanza in confs:
                if stanza.name == str(account):
                    isfound = True
                    for key, value in stanza.content.items():
                        if key == "splunk_url":
                            splunk_url = value
                        if key == "app_namespace":
                            app_namespace = value

            # end of get configuration

            # enforce https
            if not splunk_url.startswith("https://"):
                splunk_url = "https://" + str(splunk_url)

            # remote trailing slash in the URL, if any
            if splunk_url.endswith('/'):
                splunk_url = splunk_url[:-1]

            # Stop here if we cannot find the submitted account
            if not isfound:
                self.logger.fatal('This acount has not been configured on this instance, cannot proceed!: %s', self)
                sys.exit(1)

            # Splunk remote application namespace where searches are going to be executed, default to search if not defined
            if not app_namespace:
                app_namespace = "search"

            # else get the bearer token stored encrypted
            else:

                # realm
                credential_realm = '__REST_CREDENTIAL__#trackme#configs/conf-trackme_account'

                # extract as raw json
                bearer_token_rawvalue = ""

                for credential in storage_passwords:
                    if credential.content.get('realm') == str(credential_realm):
                        bearer_token_rawvalue = bearer_token_rawvalue + str(credential.content.clear_password)

                # extract a clean json object
                bearer_token_rawvalue_match = re.search('\{\"bearer_token\":\s*\"(.*)\"\}', bearer_token_rawvalue)
                if bearer_token_rawvalue_match:
                    bearer_token = bearer_token_rawvalue_match.group(1)
                else:
                    bearer_token = None

            if not bearer_token:
                self.logger.fatal('The bearer token could not be retrieved for this account, cannot proceed!: %s', self)
                sys.exit(1)

            else:

                # set the header
                header = 'Bearer ' + str(bearer_token)

                # run the search
                # Define the search url endpoint
                url = str(splunk_url) + "/services/" + str(app_namespace) + "/jobs/export"

                # transform the results into a json field defining the _raw
                search = str(self.search) + " | eval epochtime=if(isnotnull(_time), _time, now()) | tojson | table _time, epochtime, _raw"

                # Get data
                output_mode = "csv"
                exec_mode = "oneshot"
                response = requests.post(url, headers={'Authorization': header}, verify=False, data={'search': search, 'output_mode': output_mode, 'exec_mode': exec_mode, 'earliest_time': self.earliest, 'latest_time': self.latest}) 
                csv_data = response.text

                if response.status_code not in (200, 201, 204):
                    response_error = 'remote search has failed!. url={}, data={}, HTTP Error={}, content={}'.format(url, search, response.status_code, response.text)
                    self.logger.fatal(str(response_error))
                    data = { '_time': time.time(), '_raw': "{\"response\": \"" + str(response_error) + "\"" }
                    yield data
                    sys.exit(0)

                else:

                    # Use the CSV dict reader
                    readCSV = csv.DictReader(csv_data.splitlines(True), delimiter=str(u','), quotechar=str(u'"'))

                    # For row in CSV, generate the _raw
                    for row in readCSV:

                        # handle _time is not present
                        try:
                            epochtime = str(row['epochtime'])
                        except Exception as e:
                            epochtime = time.time()

                        yield { '_time': str(epochtime), '_raw': str(row['_raw']) }

dispatch(SplunkRemoteSearch, sys.argv, sys.stdin, sys.stdout, __name__)
