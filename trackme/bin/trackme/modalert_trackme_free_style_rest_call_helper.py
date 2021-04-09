
# encoding = utf-8

def process_event(helper, *args, **kwargs):
    """
    # IMPORTANT
    # Do not remove the anchor macro:start and macro:end lines.
    # These lines are used to generate sample code. If they are
    # removed, the sample code will not be updated when configurations
    # are updated.

    [sample_code_macro:start]

    # The following example gets the alert action parameters and prints them to the log
    endpoint_url = helper.get_param("endpoint_url")
    helper.log_info("endpoint_url={}".format(endpoint_url))

    http_mode = helper.get_param("http_mode")
    helper.log_info("http_mode={}".format(http_mode))

    http_body = helper.get_param("http_body")
    helper.log_info("http_body={}".format(http_body))


    # The following example adds two sample events ("hello", "world")
    # and writes them to Splunk
    # NOTE: Call helper.writeevents() only once after all events
    # have been added
    helper.addevent("hello", sourcetype="sample_sourcetype")
    helper.addevent("world", sourcetype="sample_sourcetype")
    helper.writeevents(index="summary", host="localhost", source="localhost")

    # The following example gets the events that trigger the alert
    events = helper.get_events()
    for event in events:
        helper.log_info("event={}".format(event))

    # helper.settings is a dict that includes environment configuration
    # Example usage: helper.settings["server_uri"]
    helper.log_info("server_uri={}".format(helper.settings["server_uri"]))
    [sample_code_macro:end]
    """

    helper.log_info("Alert action trackme_free_style_rest_call started.")

    import os
    import sys
    import splunk
    import splunk.entity
    import requests
    import json
    import re
    import time
    
    from splunklib.modularinput.event import Event, ET
    from splunklib.modularinput.event_writer import EventWriter

    # disable urlib3 warnings for SSL
    # we are talking to localhost splunkd in SSL
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    # Retrieve the session_key
    helper.log_debug("Get session_key.")
    session_key = helper.session_key
    
    # Get splunkd port
    entity = splunk.entity.getEntity('/server', 'settings',
                                        namespace='trackme', sessionKey=session_key, owner='-')
    splunkd_port = entity['mgmtHostPort']

    endpoint_url = helper.get_param("endpoint_url")
    helper.log_info("endpoint_url={}".format(endpoint_url))

    http_mode = helper.get_param("http_mode")
    helper.log_info("http_mode={}".format(http_mode))

    http_body = helper.get_param("http_body")
    helper.log_info("http_body={}".format(http_body))
    # format the body
    http_body = json.dumps(json.loads(http_body.replace("\'", "\""), strict=False), indent=1)

    # build header and target
    header = {
        'Authorization': 'Splunk %s' % session_key,
        'Content-Type': 'application/json'}
    target_url = "https://localhost:" + str(splunkd_port) + str(endpoint_url)

    # retrieve index target from trackme_idx macro
    record_url = 'https://localhost:' + str(splunkd_port) \
                 + '/servicesNS/-/-/admin/macros/trackme_idx'

    response = requests.get(record_url, headers=header, verify=False)
    helper.log_info("response status_code:={}".format(response.status_code))
    if response.status_code == 200:
        splunk_response = response.text
        splunk_index_match = re.search('name=\"definition\"\>index=\"{0,1}([\w|\_]*)\"{0,1}\<', splunk_response, re.IGNORECASE)
        if splunk_index_match:
            splunk_index = splunk_index_match.group(1)
        else:
            splunk_index = "trackme_summary"
    else:
        splunk_index = "trackme_summary"
    helper.log_info("splunk_index:={}".format(splunk_index))

    # Run http request
    response_data = None

    # Get
    if str(http_mode) in ("get"):
        if str(http_body) not in ["", "None", None]:
            
            # Get
            msg = "Performing HTTP get call to " + str(endpoint_url) + " with HTTP body: " + str(http_body)
            helper.log_info("action:={}".format(msg))
            try:
                response = requests.get(target_url, headers=header, verify=False, data=http_body)
            
                if response.status_code == 200:
                    response_data = response.text

                    # if is an array containing multiple json, return as response.text
                    if re.search(r"^\[", response.text) and re.search(r"\}\,", response.text) and re.search(r"\]$", response.text):
                        response_data = response.text
                
                    # otherwise attempts json format
                    else:
                
                        try:
                            response_data = json.loads(json.dumps(response.json(), indent=1))
                        except Exception as e:
                            # Response is not json, let's parse and make it a json answer
                            response_data = str(response.text)
                            response_data = "{\"response\": \"" + str(response_data.replace("\"", "\\\"")) + "\"}"

                    # write event to Splunk
                    data = {'_time': time.time(), '_raw': response_data}
                    helper.addevent(json.dumps(data), sourcetype="trackme_alert_action")
                    helper.writeevents(index=str(splunk_index), source=str(endpoint_url))
                    helper.log_info("TrackMe REST call was successfull, the response was indexed in the TrackMe summary index.")
                    return 0
                else:
                    helper.log_error("TrackMe alert action has failed, HTTP error code " + str(response.status_code) + " was returned, server responded with: " + str(response.text))
            except Exception as e:
                helper.log_error("TrackMe alert action has failed!:{}".format(str(e)))            
            
        else:
            
            # Get
            msg = "Performing get call to " + str(endpoint_url) + " no HTTP body"
            helper.log_info("action:={}".format(msg))
            try:
                response = requests.get(target_url, headers=header, verify=False)                    
            
                if response.status_code == 200:
                    response_data = response.text

                    # if is an array containing multiple json, return as response.text
                    if re.search(r"^\[", response.text) and re.search(r"\}\,", response.text) and re.search(r"\]$", response.text):
                        response_data = response.text
                
                    # otherwise attempts json format
                    else:
                
                        try:
                            response_data = json.loads(json.dumps(response.json(), indent=1))
                        except Exception as e:
                            # Response is not json, let's parse and make it a json answer
                            response_data = str(response.text)
                            response_data = "{\"response\": \"" + str(response_data.replace("\"", "\\\"")) + "\"}"

                    # write event to Splunk
                    data = {'_time': time.time(), '_raw': response_data}
                    helper.addevent(json.dumps(data), sourcetype="trackme_alert_action")
                    helper.writeevents(index=str(splunk_index), source=str(endpoint_url))
                    helper.log_info("TrackMe REST call was successfull, the response was indexed in the TrackMe summary index.")
                    return 0
                else:
                    helper.log_error("TrackMe alert action has failed, HTTP error code " + str(response.status_code) + " was returned, server responded with: " + str(response.text))
            except Exception as e:
                helper.log_error("TrackMe alert action has failed!:{}".format(str(e)))            
            
    # Post (body is required)
    elif str(http_mode) in ("post"):

        msg = "Performing HTTP post call to " + str(endpoint_url) + " with HTTP body: " + str(http_body)
        helper.log_info("action:={}".format(msg))

        try:
            response = requests.post(target_url, headers=header, verify=False, data=http_body)

            if response.status_code == 200:
                response_data = response.text

                # if is an array containing multiple json, return as response.text
                if re.search(r"^\[", response.text) and re.search(r"\}\,", response.text) and re.search(r"\]$", response.text):
                    response_data = response.text
            
                # otherwise attempts json format
                else:
            
                    try:
                        response_data = json.loads(json.dumps(response.json(), indent=1))
                    except Exception as e:
                        # Response is not json, let's parse and make it a json answer
                        response_data = str(response.text)
                        response_data = "{\"response\": \"" + str(response_data.replace("\"", "\\\"")) + "\"}"

                # write event to Splunk
                data = {'_time': time.time(), '_raw': response_data}
                helper.addevent(json.dumps(data), sourcetype="trackme_alert_action")
                helper.writeevents(index=str(splunk_index), source=str(endpoint_url))
                helper.log_info("TrackMe REST call was successfull, the response was indexed in the TrackMe summary index.")
                return 0
            else:
                helper.log_error("TrackMe alert action has failed, HTTP error code " + str(response.status_code) + " was returned, server responded with: " + str(response.text))
        except Exception as e:
            helper.log_error("TrackMe alert action has failed!:{}".format(str(e)))            

    # Delete (body is required)
    elif str(http_mode) in ("delete"):

        msg = "Performing HTTP delete call to " + str(endpoint_url) + " with HTTP body: " + str(http_body)
        helper.log_info("action:={}".format(msg))

        # Get
        try:
            response = requests.delete(target_url, headers=header, verify=False, data=http_body)

            if response.status_code == 200:
                response_data = response.text
                
                # if is an array containing multiple json, return as response.text
                if re.search(r"^\[", response.text) and re.search(r"\}\,", response.text) and re.search(r"\]$", response.text):
                    response_data = response.text
            
                # otherwise attempts json format
                else:
            
                    try:
                        response_data = json.loads(json.dumps(response.json(), indent=1))
                    except Exception as e:
                        # Response is not json, let's parse and make it a json answer
                        response_data = str(response.text)
                        response_data = "{\"response\": \"" + str(response_data.replace("\"", "\\\"")) + "\"}"

                # write event to Splunk
                data = {'_time': time.time(), '_raw': response_data}
                helper.addevent(json.dumps(data), sourcetype="trackme_alert_action")
                helper.writeevents(index=str(splunk_index), source=str(endpoint_url))
                helper.log_info("TrackMe REST call was successfull, the response was indexed in the TrackMe summary index.")
                return 0
            else:
                helper.log_error("TrackMe alert action has failed, HTTP error code " + str(response.status_code) + " was returned, server responded with: " + str(response.text))
        except Exception as e:
            helper.log_error("TrackMe alert action has failed!:{}".format(str(e)))            
