#!/usr/bin/env bash
# set -x

PWD=`pwd`
app="trackme"
version=`grep 'version =' trackme/default/app.conf | awk '{print $3}' | sed 's/\.//g'`

rm -f *.tgz
tar -czf ${app}_${version}.tgz --exclude=trackme/local --exclude=trackme/metadata/local.meta --exclude=trackme/lookups/lookup_file_backups trackme
echo "Wrote: ${app}_${version}.tgz"

exit 0
