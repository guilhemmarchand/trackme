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
filehandler = logging.FileHandler(splunkhome + "/var/log/splunk/trackme_tracker_executor.log", 'a')
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

    component = Option(
        doc='''
        **Syntax:** **component=****
        **Description:** The tracker component name to be executed.''',
        require=True, default=None)

    report = Option(
        doc='''
        **Syntax:** **report=****
        **Description:** The tracker report to be executed.''',
        require=True, default=None)

    earliest = Option(
        doc='''
        **Syntax:** **earliest=****
        **Description:** The earliest time quantifier.''',
        require=True, default=None)

    latest = Option(
        doc='''
        **Syntax:** **latest=****
        **Description:** The latest time quantifier.''',
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

            # runquery boolean
            runquery = False

            if self.component in ('data_sources', 'data_hosts', 'metric_hosts', "hybrid_trackers"):

                if self.component == 'data_sources':

                    if component_data_sources == 'enabled':
                        runquery = True
                        logging.info('Starting the data sources tracker report=\"' + str(self.report) + "\"")
                    else:
                        runquery = False
                        logging.info('The data sources tracking component is currently disabled, nothing to do')
                        data = {'_time': time.time(), '_raw': "{\"response\": \"" + "The data sources tracking component is currently disabled, nothing to do\"}"}
                        yield data

                elif self.component == 'data_hosts':

                    if component_data_hosts == 'enabled':
                        runquery = True
                        logging.info('Starting the data hosts tracker report=\"' + str(self.report) + "\"")
                    else:
                        runquery = False
                        logging.info('The data hosts tracking component is currently disabled, nothing to do')
                        data = {'_time': time.time(), '_raw': "{\"response\": \"" + "The data hosts tracking component is currently disabled, nothing to do\"}"}
                        yield data

                elif self.component == 'metric_hosts':

                    if component_metric_sources == 'enabled':
                        runquery = True
                        logging.info('Starting the metric hosts tracker report=\"' + str(self.report) + "\"")
                    else:
                        runquery = False
                        logging.info('The metric hosts tracking component is currently disabled, nothing to do')
                        data = {'_time': time.time(), '_raw': "{\"response\": \"" + "The metric hosts tracking component is currently disabled, nothing to do\"}"}
                        yield data

                elif self.component == 'hybrid_trackers':
                    runquery = True

            else:
                logging.error("The component " + str(self.component) + " is not a valid TrackMe component.")
                data = {
                    '_time': time.time(), 
                    '_raw': "{\"response\": \"" + "The component " + str(self.component) + " is not a valid TrackMe component." + "}"}
                yield data

            if runquery:

                # performance counter
                start = time.process_time()

                # Get data, purge any record older than 48 hours
                search = "| savedsearch \"" + str(self.report) + "\""
                kwargs_oneshot = {
                                    "earliest_time": self.earliest,
                                    "latest_time": self.latest,
                                    "count": 0
                                }

                # run the main report, every result is a Splunk search to be executed on its own thread
                try:

                    oneshotsearch_results = service.jobs.oneshot(search, **kwargs_oneshot)
                    reader = results.ResultsReader(oneshotsearch_results)

                    for item in reader:
                        logging.info("tracker report=\"" + str(self.report) + "\", status=\"success\", run_time=\"" + str(time.process_time() - start) + "\", results: " + json.dumps(item, indent = 2))
                        data = {'_time': time.time(), '_raw': "tracker report=\"" + str(self.report) +  "\" successfully executed in " + str(time.process_time() - start) + " seconds" }
                        yield data

                except Exception as e:
                    logging.error("main search failed with exception: " + str(e))

        else:

            # yield
            data = {'_time': time.time(), '_raw': "{\"response\": \"" + "Error: bad request}"}
            yield data
            logging.error("{\"response\": \"" + "Error: bad request}")

dispatch(DataSamplingExecutor, sys.argv, sys.stdin, sys.stdout, __name__)
