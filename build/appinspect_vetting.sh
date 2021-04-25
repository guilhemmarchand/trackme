#!/bin/bash

# author: Guilhem Marchand, guilhem.marchand@gmail.com
# purpose: Automated Splunk app vetting by Splunk Appinspect API
# Usage: See show_usage function
# The script exit with exit code 0 if all operations are successful and appinspect reports no failures
# Any failure at any step of the process including any number of failures during the vetting causes the script produce exit code!=0
# This simple shell script is intended to be used for automation purposes with Jenkins, CircleCI, Git Workflow and so forth.
# requirements: the script requires bash, curl and jq

# edit the script up to your needs if you wish to include or exclude specific tags, for reference:
# https://dev.splunk.com/enterprise/docs/reference/appinspecttagreference/
# https://dev.splunk.com/enterprise/docs/reference/splunkappinspectcheck/

# Current limitations of Appinspect:

# Appinspect does not currently allows to exclude specific checks, one can only exclude tags which would exclude entire sets of checks
# An easy and agile workaround is to parse the JSON response from the API, then parse the failures and decide which failures to be ignored
# depending on your preferences
# In this script context, we provide as part of the argument the native included tags, excluded tags (if any), and custom excluded checks (if any)

# included_tags / excluded_tags / excluded_checks should be given as CSV formated list
# Only included_tags is mandatory

# exit codes:

# exit 0: Appinspect is successful, failures were not reported or reported failures are excluded
# exit 100: bad parameters
# exit 1: tgz app archive not found or empty
# exit 2: Appinspect API login failed
# exit 3: Appinspect API upload has failed or timed out
# exit 4: Appinspect reported failures, which failures are not excluded checks
# exit 5: Appinspect status is unknown, likely something unexpected happened

# show usage
show_usage() {
    echo -e "${blue}\n\nUsage: ./${0} --username=<splunk_base_login> --password=<splunk_base_password> --app=<tgz_app_archive> --included_tags=<appinspect_included_tags> --excluded_tags=<appinspect_excluded_tags> --excluded_checks=<appinspect_excluded_checks>\n\n"
}

# get arguments
while [ "$1" != "" ]; do
    PARAM=$(echo "$1" | awk -F= '{print $1}')
    VALUE=$(echo "$1" | awk -F= '{print $2}')
    case $PARAM in
    -h | --help)
        show_usage
        exit
        ;;
    --username)
        username=$VALUE
        ;;
    --password)
        password=$VALUE
        ;;
    --app)
        app=$VALUE
        ;;
    --included_tags)
        included_tags=$VALUE
        ;;
    --excluded_tags)
        excluded_tags=$VALUE
        ;;
    --excluded_checks)
        excluded_checks=$VALUE
        ;;
    --html_report_out)
        html_report_out=$VALUE
        ;;

    *)
        echo "ERROR: unknown parameter \"$PARAM\""
        show_usage
        exit 1
        ;;
    esac
    shift
done

# export TERM
export TERM=xterm

# Handle colors
red=" \x1b[31m "
green=" \x1b[32m "
yellow=" \x1b[33m "
blue=" \x1b[34m "
reset=" \x1b[0m "

# simple argument verification
if [ -z "$username" ]; then
    echo -e "${red}\nERROR: Splunk Base user name is not set"
    show_usage
    exit 100
fi

if [ -z "$password" ]; then
    echo -e "${red}\nERROR: Splunk Base password is not set"
    show_usage
    exit 100
fi

if [ ! -s "$app" ]; then
    echo -e "${red}\nERROR: app archive $app does not exist or is empty, marking the build as failed.${reset}\n"
    show_usage
    exit 1
fi

if [ -z "$included_tags" ]; then
    echo -e "${red}\nERROR: Appinspect included tags have not been provided, this is a mandatory argument\n"
    show_usage
    exit 100
fi

# html report output file, if not specified defaults to appinspect_report.html
if [ -z "$html_report_out" ]; then
    datetime=$(date '+%m%d%Y_%H%M%S')
    html_report_out="appinspect_${datetime}.html"
fi

# program start

# excluded checks are expected to be CSV list of strings
excluded_checks=$(echo "$excluded_checks" | tr , "\n")
excluded_checks_4grep=$(echo "$excluded_checks" | tr , "\|")

# login to Appinspect API
echo -e "${blue}\nINFO: Attempting login to appinspect API...${reset}\n"

appinspect_token=$(curl -X GET \
    -u "${username}":"${password}" \
    --url "https://api.splunk.com/2.0/rest/login/splunk" -s | sed 's/%//g' | jq -r .data.token)

case "$appinspect_token" in
"null" | "")
    echo -e "${red}\nERROR: login to appinspect API has failed, an authentication token could be not be generated.${reset}\n"
    exit 2
    ;;
*)
    echo -e "${green}\nSUCCESS: Authentication was successful and we got a token.${reset}\n"
    ;;
esac

# upload to Appinspect API
echo -e "${blue}\nINFO: Please wait while submitting to appinspect...${reset}\n"

# Run Appinspect, depending on select options

case $excluded_tags in

# No excluded_tags were provided
"")
    uuid=$(curl -X POST --connect-timeout 30 --max-time 300 \
        -H "Authorization: bearer ${appinspect_token}" \
        -H "Cache-Control: no-cache" \
        -s \
        -F "app_package=@${app}" \
        -F "included_tags=${included_tags}" \
        -F "excluded_tags=${excluded_tags}" \
        --url "https://appinspect.splunk.com/v1/app/validate" | jq -r .links | grep href | head -1 | awk -F\" '{print $4}' | awk -F'/' '{print $6}')
        EXIT_CODE=$?
    ;;

# excluded_tags were provided
*)
    uuid=$(curl -X POST --connect-timeout 30 --max-time 300 \
        -H "Authorization: bearer ${appinspect_token}" \
        -H "Cache-Control: no-cache" \
        -s \
        -F "app_package=@${app}" \
        -F "included_tags=${included_tags}" \
        --url "https://appinspect.splunk.com/v1/app/validate" | jq -r .links | grep href | head -1 | awk -F\" '{print $4}' | awk -F'/' '{print $6}')
        EXIT_CODE=$?
    ;;

esac

# Looping and polling the status
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${green}\nSUCCESS: upload was successful, polling status...${reset}\n"

    status=$(curl -X GET \
        -s \
        -H "Authorization: bearer ${appinspect_token}" \
        --url https://appinspect.splunk.com/v1/app/validate/status/"${uuid}" | jq -r .status)

    while [ "$status" != "SUCCESS" ]; do

        echo -e "${blue}\nINFO: appinspect is currently running:${reset}\n\n"
        curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/validate/status/"${uuid}" | jq
        sleep 2
        status=$(curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/validate/status/"${uuid}" | jq -r .status)

    done

    case ${status} in
    "SUCCESS")
        echo -e "${green}\nSUCESS: appinspect review was successfully proceeded:${reset}\n"

        info=$(curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/validate/status/"${uuid}" | jq -r .info)

        # Show info summary json
        echo "$info" | jq .

        # Get the list of failures, if any
        failures_list=$(curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/report/"${uuid}" | jq '.reports[].groups[].checks[] | select(.result | test("failure")) | .name')

        # Get failures and count
        failures_included_count=0
        failures_excluded_count=0

        # included count
        for failure in $failures_list; do
            for excluded_check in $excluded_checks; do
                if ! echo "$failure" | grep -q "$excluded_check" ; then
                    ((failures_included_count = failures_included_count + 1))
                fi
            done
        done

        # excluded count
        for failure in $failures_list; do
            for excluded_check in $excluded_checks; do
                if echo "$failure" | grep -q "$excluded_check" ; then
                    ((failures_excluded_count = failures_excluded_count + 1))
                fi
            done
        done

        # Inform if we had failures we are ignoring
        if [ "$failures_excluded_count" -ne 0 ]; then
            echo -e "${yellow}\n\nWARN: $failures_excluded_count failure(s) were excluded due to custom checks exclusion list${reset}"
            echo ""
            echo "$failures_list" | grep -E "$excluded_checks_4grep"
            echo ""
        fi

        # download the HTML report automatically
        curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            -H "Cache-Control: no-cache" \
            -H "Content-Type: text/html" \
            --url "https://appinspect.splunk.com/v1/app/report/${uuid}" \
            -o "${html_report_out}"
        echo -e "${blue}\nINFO: report downloaded to file ${html_report_out} ${reset}\n"

        if [ "$failures_included_count" -eq 0 ]; then
            echo -e "${green}\n\nSUCCESS: appinspect reported no failures or no failures excluded via custom lists, marking this build as successful.${reset}\n\n"
            exit 0
        else
            echo -e "${red}\n\nERROR: appinspect reported failures, marking this build as failed.${reset}\n\n"
            exit 4
        fi

        ;;

    "*")
        echo -e "${red}\nERROR: appinspect review was not successfull, marking the build as failed.${reset}\n"
        exit 5
        ;;

    esac

else
    echo -e "${red}\nERROR: upload to Splunk appinspect API has failed (did we timed out?), marking the build as failed.${reset}\n"
    exit 3
fi
