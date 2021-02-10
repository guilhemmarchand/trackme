#!/usr/bin/env bash
#set -x

# for Mac OS X
export COPYFILE_DISABLE=true

PWD=`pwd`
app="trackme"
cp -a ../${app} .
version=`grep 'version =' ${app}/default/app.conf | awk '{print $3}' | sed 's/\.//g'`

rm -f *.tgz
find . -name "*.pyc" -type f | xargs rm -f
find . -name "*.py" -type f | xargs chmod go-x
find trackme/lib -name "*.py" -type f | xargs chmod a-x
tar -czf ${app}_${version}.tgz --exclude=${app}/local --exclude=${app}/backup --exclude=${app}/metadata/local.meta --exclude=${app}/lookups/lookup_file_backups --exclude=${app}/default.old* --exclude='./.*'  --exclude='.[^/]*' --exclude="._*" ${app}
echo "Wrote: ${app}_${version}.tgz"

rm -rf ${app}
exit 0
