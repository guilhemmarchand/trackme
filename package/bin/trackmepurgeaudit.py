#!/usr/bin/env python
# coding=utf-8

# TrackMe audit records purge

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
import time
import datetime
import csv
import json
import logging
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

splunkhome = os.environ['SPLUNK_HOME']

# set logging
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_trackmepurgeaudit.log", 'a')
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
import splunklib.client as client

@Configuration(distributed=False)

class PurgeAuditRecords(GeneratingCommand):

    def generate(self, **kwargs):

        if self:

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
        
            # Define the headers
            header = 'Splunk ' + str(session_key)

            # Define the url
            url = "https://localhost:" + str(splunkd_port) + "/services/search/jobs/export"

            # local service
            service = client.connect(
                token=str(session_key),
                owner="nobody",
                app="trackme",
                host="localhost",
                port=splunkd_port
            )

            # local cache record submitted
            audit_kvstore_name = "kv_trackme_audit_changes"
            audit_kvstore = service.kvstore[audit_kvstore_name]

            # Get data, purge any record older than 48 hours
            search = "| inputlookup trackme_audit_changes | eval key=_key | sort limit=0 - time | eval _time=time/1000 | eval record_age=now()-_time" +\
                "| eval retention_days=`trackme_audit_changes_retention_days` | where record_age>=(retention_days*86400)"
            output_mode = "csv"
            exec_mode = "oneshot"
            response = requests.post(url, headers={'Authorization': header}, verify=False, data={'search': search, 'output_mode': output_mode, 'exec_mode': exec_mode}) 
            csv_data = response.text

            # Use the CSV dict reader
            readCSV = csv.DictReader(csv_data.splitlines(True), delimiter=str(u','), quotechar=str(u'"'))

            # For row in CSV, generate the _raw
            for row in readCSV:

                try:
                    audit_kvstore.data.delete(json.dumps({"_key": str(row['key'])}))

                    # get the record age in seconds
                    record_age = str(row['record_age'])

                    # Set the raw message
                    raw = "purged record=\"" + str(row['key']) + "\", _time=\"" + str(row['_time']) + "\", record_age=\"" + str(record_age) + "\""

                    # log
                    raw_kv_message = 'action=\"success"' \
                        + '\", ' + str(raw)
                    logging.info(raw_kv_message)

                    # yield as output of the generation command
                    yield {'_time': time.time(), '_raw': str(raw)}

                except Exception as e:
                    msg = "KVstore record with key: " + str(row['key']) + " failed to be deleted with exception: " + str(e)
                    self.logger.fatal(msg)
                    logging.error(msg)

                    data = {'_time': time.time(), '_raw': "{\"response\": \"" + msg + "}"}
                    yield data
                    sys.exit(1)

        else:

            # yield
            data = {'_time': time.time(), '_raw': "{\"response\": \"" + "Error: bad request}"}
            yield data
            logging.error("{\"response\": \"" + "Error: bad request}")

dispatch(PurgeAuditRecords, sys.argv, sys.stdin, sys.stdout, __name__)
