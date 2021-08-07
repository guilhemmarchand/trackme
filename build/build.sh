#!/usr/bin/env bash
#set -x

# for Mac OS X
export COPYFILE_DISABLE=true

PWD=$(pwd)
OUTDIR="output"

app="trackme"
version=$(grep 'version =' ../version.txt | head -1 | awk '{print $3}' | sed 's/\.//g')
ta_version=$(grep 'version =' ../version.txt | head -1 | awk '{print $3}')

cd ../
ucc-gen --ta-version "$ta_version"

cd "${OUTDIR}"
find . -name "*.pyc" -type f -exec rm -f {} \;
rm -f *.tgz
if [ -f ${app}/metadata/local.meta ]; then
  rm -f ${app}/metadata/local.meta
fi
tar -czf ${app}_${version}.tgz ${app}
echo "Wrote: ${app}_${version}.tgz"

sha256=$(sha256sum ${app}_${version}.tgz)
echo "Wrote: ${sha256} in $OUTDIR"
echo ${sha256} > release-sha256.txt

exit 0