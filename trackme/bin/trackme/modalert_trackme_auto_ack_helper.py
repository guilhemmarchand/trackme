
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
    object_category = helper.get_param("object_category")
    helper.log_info("object_category={}".format(object_category))

    object_name = helper.get_param("object_name")
    helper.log_info("object_name={}".format(object_name))

    ack_period = helper.get_param("ack_period")
    helper.log_info("ack_period={}".format(ack_period))


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

    helper.log_info("Alert action trackme_auto_ack started.")

    import os
    import sys
    import splunk
    import splunk.entity
    import requests
    import json
    import re
    import time
    
    # Retrieve the session_key
    helper.log_debug("Get session_key.")
    session_key = helper.session_key
    
    # Get splunkd port
    entity = splunk.entity.getEntity('/server', 'settings',
                                        namespace='trackme', sessionKey=session_key, owner='-')
    splunkd_port = entity['mgmtHostPort']
    
    object_category = helper.get_param("object_category")
    helper.log_info("object_category={}".format(object_category))

    object_name = helper.get_param("object_name")
    helper.log_info("object_name={}".format(object_name))

    ack_period = helper.get_param("ack_period")
    helper.log_info("ack_period={}".format(ack_period))

    # endpoint url
    endpoint_url = "/services/trackme/v1/ack/ack_enable"

    # build body
    body="{'object_category': '" + str(object_category) + "', 'object': '" + str(object_name) + "', 'ack_period': '" + str(ack_period) + "', 'update_comment': 'alert action auto-acknowledgement'}"
    helper.log_info("body={}".format(body))

    # build header and target
    header = 'Splunk ' + str(session_key)
    target_url = "https://localhost:" + str(splunkd_port) + str(endpoint_url)
        
    # prepare the body data, if any
    json_data = None
    if body:
        json_data = json.dumps(json.loads(body.replace("\'", "\""), strict=False), indent=1)

    # Run http request
    response_data = None

    # Get
    try:
        response = requests.post(target_url, headers={'Authorization': header}, verify=False, data=json_data)
    
        if response.status_code == 200:
            response_data = response.text
            helper.log_info("response_data={}".format(response_data))
            return 0
        else:
            helper.log_error("TrackMe auto acknowledgement action has failed, HTTP error code " + str(response.status_code) + " was returned, server response: " + response.text)
    except Exception as e:
        helper.log_error("TrackMe auto acknowledgement alert action has failed!:{}".format(str(e)))
