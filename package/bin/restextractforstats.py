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
                yield {'_time': str(row['_time']), 'count': str(row['count']), 'event_lag': str(row['event_lag']), 'delta': str(row['delta']), 'dcount_host': str(row['dcount_host'])}

dispatch(CsvInputCommand, sys.argv, sys.stdin, sys.stdout, __name__)
