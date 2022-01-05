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
import time
import datetime
import csv
import json
import logging
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

splunkhome = os.environ['SPLUNK_HOME']

# set logging
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_sampling_executor.log", 'a')
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

import splunklib.results as results

@Configuration(distributed=False)

class DataSamplingExecutor(GeneratingCommand):

    search = Option(
        doc='''
        **Syntax:** **report=****
        **Description:** The data sampling search code.''',
        require=True, default=None)

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

            # performance counter
            mainstart = time.process_time()
            count = 0

            # Get the session key
            session_key = self._metadata.searchinfo.session_key

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']
        
            # local service
            service = client.connect(
                token=str(session_key),
                owner="nobody",
                app="trackme",
                host="localhost",
                port=splunkd_port
            )

            # Get data, purge any record older than 48 hours
            search = self.search
            kwargs_oneshot = {
                                "earliest_time": "-24h",
                                "latest_time": "now",
                                "count": 0
                            }

            # run the main report, every result is a Splunk search to be executed on its own thread
            try:

                oneshotsearch_results = service.jobs.oneshot(search, **kwargs_oneshot)
                reader = results.ResultsReader(oneshotsearch_results)

                for item in reader:
                    logging.debug(item)

                    # run the resulting search
                    search = item.get('_raw')
                    if not search.startswith("|"):
                        search = "search " + search

                    logging.info("Executing data sampling resulting search: " + search)
                    start = time.process_time()
                    try:
                        suboneshotsearch_results = service.jobs.oneshot(search, **kwargs_oneshot)
                        count+=1

                        # Get the results and display them using the ResultsReader
                        subreader = results.ResultsReader(suboneshotsearch_results)
                        for subitem in subreader:
                            logging.debug(subitem)                    

                            data = {'_time': time.time(), '_raw': subitem, 'key': subitem.get('key'), 'data_name': subitem.get('data_name'), 'raw_sample': subitem.get('raw_sample'), 'data_sourcetype': subitem.get('data_sourcetype')}
                            yield data

                        logging.info("search successfully executed in " + str(time.process_time() - start) + " seconds")

                    except Exception as e:
                        logging.error("search failed with exception: " + str(e))

            except Exception as e:
                logging.error("main search failed with exception: " + str(e))

            # end
            logging.info("data sampling job successfully executed in " + str(time.process_time() - mainstart) + " seconds for " + str(count) + " entities")

        else:

            # yield
            data = {'_time': time.time(), '_raw': "{\"response\": \"" + "Error: bad request}"}
            yield data
            logging.error("{\"response\": \"" + "Error: bad request}")

dispatch(DataSamplingExecutor, sys.argv, sys.stdin, sys.stdout, __name__)
