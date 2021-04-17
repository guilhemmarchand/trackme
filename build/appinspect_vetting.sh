#!/bin/bash

# author: Guilhem Marchand
# purpose: Automated Splunk app vetting by Splunk Appinspect API
# Usage: ./appinspect_vetting.sh <splunk base login> <splunk base password> <app tgz archive>
# The script exit with exit code 0 if all operations are successful and appinspect reports no failures
# Any failure at any step of the process including any number of failures during the vetting causes the script produce exit code!=0
# This simple shell script is intended to be used for automation purposes with Jenkins, CircleCI, Git Workflow and so forth.
# requirements: the script requires bash, curl and jq

# edit the script up to your needs if you wish to include or exclude specific tags, for reference:
# https://dev.splunk.com/enterprise/docs/reference/appinspecttagreference/
# https://dev.splunk.com/enterprise/docs/reference/splunkappinspectcheck/

# arguments to be given at the execution
username=$1
password=$2
app=$3

# export TERM
export TERM=xterm

# life needs some colors
red=" \x1b[31m "
green=" \x1b[32m "
yellow=" \x1b[33m "
blue=" \x1b[34m "
reset=" \x1b[0m "

# simple argument verification
if [ -z "$username" ]; then
    printf "${red}\nERROR: Splunk Base user name is not set"
    exit 1
fi

if [ -z "$password" ]; then
    printf "${red}\nERROR: Splunk Base password is not set"
    exit 2
fi

if [ ! -s $app ]; then
    printf "${red}\nERROR: app archive $app does not exist or is empty, marking the build as failed.${reset}\n"
    exit 3
fi

printf "${blue}\nINFO: Attempting login to appinspect API...${reset}\n"

export appinspect_token=$(curl -X GET \
    -u ${username}:${password} \
    --url "https://api.splunk.com/2.0/rest/login/splunk" -s | sed 's/%//g' | jq -r .data.token)

case "$appinspect_token" in
"null")
    printf "${red}\nERROR: login to appinspect API has failed, an authentication token could be not be generated.${reset}\n"
    exit 4
    ;;
*)
    printf "${green}\nSUCCESS: Authentication was successful and we got a token.${reset}\n"
    ;;
esac

printf "${blue}\nINFO: Please wait while submitting to appinspect...${reset}\n"
uuid=$(curl -X POST --connect-timeout 30 --max-time 300 \
    -H "Authorization: bearer ${appinspect_token}" \
    -H "Cache-Control: no-cache" \
    -s \
    -F "app_package=@${app}" \
    -F "included_tags=advanced_xml,alert_actions_conf,appapproval,cloud,custom_search_commands_v2,custom_search_commands,custom_visualizations,custom_workflow_actions,deprecated_feature,developer_guidance,django_bindings,inputs_conf,markdown,malicious,modular_input(s),offensive,packaging_standards,private_app,removed_feature,restmap_config,savedsearches,security,service,web_conf,splunk_5_0,splunk_6_0,splunk_6_1,splunk_6_2,splunk_6_3,splunk_6_4,splunk_6_5,splunk_6_6,splunk_7_0,splunk_7_1,splunk_7_2,splunk_7_3,splunk_8_0" \
    --url "https://appinspect.splunk.com/v1/app/validate" | jq -r .links | grep href | head -1 | awk -F\" '{print $4}' | awk -F\/ '{print $6}')

if [ $? -eq 0 ]; then
    printf "${green}\nSUCCESS: upload was successful, polling status...${reset}\n"

    status=$(curl -X GET \
        -s \
        -H "Authorization: bearer ${appinspect_token}" \
        --url https://appinspect.splunk.com/v1/app/validate/status/${uuid} | jq -r .status)

    while [ $status != "SUCCESS" ]; do

        printf "${blue}\nINFO: appinspect is currently running:${reset}\n\n"
        curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/validate/status/${uuid} | jq
        sleep 2
        status=$(curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/validate/status/${uuid} | jq -r .status)

    done

    case ${status} in
    "SUCCESS")
        printf "${green}\nSUCESS: appinspect review was successfully proceeded:${reset}\n"

        info=$(curl -X GET \
            -s \
            -H "Authorization: bearer ${appinspect_token}" \
            --url https://appinspect.splunk.com/v1/app/validate/status/${uuid} | jq -r .info)

        # Show info summary json
        echo $info | jq .

        # Verify failures
        failures=$(echo $info | jq -r .failure)

        if [ $failures -eq 0 ]; then
            printf "${green}\nSUCCESS: appinspect reported no failures, marking this build as successful.${reset}\n"
            exit 0
        else
            # retrieve and show the report in case of failures
            curl -X GET \
                -s \
                -H "Authorization: bearer ${appinspect_token}" \
                --url https://appinspect.splunk.com/v1/app/report/${uuid} | jq
            printf "${red}\nERROR: appinspect reported failures, marking this build as failed.${reset}\n"
            exit 5
        fi

        ;;

    "*")
        printf "${red}\nERROR: appinspect review was not successfull, marking the build as failed.${reset}\n"
        exit 6
        ;;

    esac

else
    printf "${red}\nERROR: upload to Splunk appinspect API has failed (did we timed out?), marking the build as failed.${reset}\n"
    exit 7
fi
