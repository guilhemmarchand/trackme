#!/usr/bin/env python

from __future__ import absolute_import, division, print_function, unicode_literals
import app
import os,sys
import csv

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))
from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option, validators
from splunklib import six


@Configuration()
class CsvInputCommand(StreamingCommand):

    def stream(self, records):
        self.logger.debug('CsvInputCommand: %s', self)  # logs command line

        for record in records:
            # Extract the value field only
            value = [value for value in record.values()][0]

            # Use the CSV dict reader
            readCSV = csv.DictReader(value.splitlines(), delimiter=',', quotechar='"')

            # For row in CSV, generate the _raw
            for row in readCSV:
                yield {'data_last_ingest': str(row['data_last_ingest']), 'data_first_time_seen': str(row['data_first_time_seen']), 'data_last_time_seen': str(row['data_last_time_seen']), 'data_eventcount': str(row['data_eventcount']), 'dcount_host': str(row['dcount_host']), 'data_index': str(row['data_index']), 'data_last_ingestion_lag_seen': str(row['data_last_ingestion_lag_seen']), 'data_name': str(row['data_name']), 'data_sourcetype': str(row['data_sourcetype'])}

dispatch(CsvInputCommand, sys.argv, sys.stdin, sys.stdout, __name__)
