#!/usr/bin/env python
# coding=utf-8

# TrackMe audit records purge

from __future__ import absolute_import, division, print_function, unicode_literals

import os
import sys
import splunk
import splunk.entity
import requests
import time
import datetime
import csv
import json
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
import splunklib.client as client

@Configuration(distributed=False)

class PurgeAuditRecords(GeneratingCommand):

    def generate(self, **kwargs):

        if self:

            # Get the session key
            session_key = self._metadata.searchinfo.session_key

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']

            # log all actions
            SPLUNK_HOME = os.environ["SPLUNK_HOME"]
            splunklogfile = SPLUNK_HOME + "/var/log/splunk/trackme_audit_purge.log"
        
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

                    # write to log file
                    outputlog = open(splunklogfile, "a")
                    t = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S,%f')
                    raw_kv_message = 'action=\"success"' \
                        + '\", ' + str(raw)
                    outputlog.write(str(t[:-3]) + " INFO file=trackmepurgeaudit.py | customaction - signature=\"trackmepurgeaudit custom command called, " + str(raw_kv_message) + "\", app=\"trackme\" action_mode=\"saved\"\n")
                    outputlog.close()

                    # yield as output of the generation command
                    yield {'_time': time.time(), '_raw': str(raw)}

                except Exception as e:
                    msg = "KVstore record with key: " + str(row['key']) + " failed to be deleted with exception: " + str(e)
                    self.logger.fatal(msg)

                    # write to log file
                    outputlog = open(splunklogfile, "a")
                    t = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S,%f')
                    raw_kv_message = 'action=\"failure"' \
                        + '\", ' + str(raw)
                    outputlog.write(str(t[:-3]) + " INFO file=trackmepurgeaudit.py | customaction - signature=\"trackmepurgeaudit custom command called, " + str(msg) + "\", app=\"trackme\" action_mode=\"saved\"\n")
                    outputlog.close()

                    data = {'_time': time.time(), '_raw': "{\"response\": \"" + msg + "}"}
                    yield data
                    sys.exit(1)

        else:

            # yield
            data = {'_time': time.time(), '_raw': "{\"response\": \"" + "Error: bad request}"}
            yield data

dispatch(PurgeAuditRecords, sys.argv, sys.stdin, sys.stdout, __name__)
