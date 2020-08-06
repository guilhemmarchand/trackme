#!/bin/bash

#set -x
unset username
unset uuid

echo -n "Enter your Splunk Base login: "; read username

echo "Attempting login to appinspect API..."

export appinspect_token=$(curl -X GET \
     -u ${username} \
     --url "https://api.splunk.com/2.0/rest/login/splunk" -s | sed 's/%//g' | jq -r .data.token)

case "$appinspect_token" in
"null")
    echo "ERROR: login to appinspect API has failed, an authentication token could be not be generated."; exit 1
    ;;
*)
    echo "SUCCESS: Authentication was successful and we got a token."
    ;;
esac

for app in $(ls *.tgz); do

    echo -n "RUN: Please confirm submitting the app ${app} to appinspect API vetting (yes / no) ?  "; read submit
    case ${submit} in
    y|yes|Yes)
        echo "RUN: Please wait while submitting to appinspect..."
        uuid=$(curl -X POST \
            -H "Authorization: bearer ${appinspect_token}" \
            -H "Cache-Control: no-cache" \
            -s \
            -F "app_package=@${app}" \
            -F "included_tags=cloud" \
            --url "https://appinspect.splunk.com/v1/app/validate" | jq -r .links | grep href | head -1 | awk -F\" '{print $4}' | awk -F\/ '{print $6}')

        if [ $? -eq 0 ]; then
            echo "INFO: upload was successful, polling status..."

            status=$(curl -X GET \
                -s \
                -H "Authorization: bearer ${appinspect_token}" \
                    --url https://appinspect.splunk.com/v1/app/validate/status/${uuid} | jq -r .status)

            while [ $status != "SUCCESS" ]; do

                echo -e "INFO: appinspect is currently running: \n"
                echo "INFO: Sleeping 2 seconds..."

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
                echo "INFO: appinspect review was successfully proceeded:"
                curl -X GET \
                    -s \
                    -H "Authorization: bearer ${appinspect_token}" \
                        --url https://appinspect.splunk.com/v1/app/validate/status/${uuid} | jq .
                echo -e "RUN: Download the HTML report in the current directory? (yes / no) "; read download

                case ${download} in
                y|yes|Yes)
                    datetime=$(date '+%m%d%Y_%H%M%S')
                    filename="appinspect_report_${datetime}.html"
                    curl -X GET \
                        -s \
                        -H "Authorization: bearer ${appinspect_token}" \
                        -H "Cache-Control: no-cache" \
                        -H "Content-Type: text/html" \
                        --url "https://appinspect.splunk.com/v1/app/report/${uuid}" \
                        -o ${filename}

                    echo "INFO: report downloaded to file ${filename} in the current directory." 

                    ;;
                n|no|No)
                    echo "INFO: Operation completed for ${app} - thank you."
                    ;;
                esac

            ;;
            "*")
                echo "ERROR: appinspect review was not successful!"
            ;;

            esac

        else
            echo "ERROR: upload has failed!"
            break

        fi

        ;;
    n|no|No)

        echo "INFO: Application was not submitted"

        ;;

    esac

done

exit 0
