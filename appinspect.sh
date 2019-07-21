#!/bin/bash

splunk-appinspect inspect `ls trackme_*.tgz | head -1` --mode precert --included-tags splunk_appinspect
