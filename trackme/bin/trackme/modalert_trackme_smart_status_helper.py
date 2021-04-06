
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

    helper.log_info("Alert action trackme_smart_status started.")

    # TODO: Implement your alert action logic here
    
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
    
    # conditionally define the source value
    source_value = None
    if str(object_category) in ("data_source"):
        source_value = "ds_smart_status"
        object_category = "data_name"
        endpoint_url = "/services/trackme/v1/smart_status/ds_smart_status"
    elif str(object_category) in ("data_host"):
        source_value = "dh_smart_status"
        endpoint_url = "/services/trackme/v1/smart_status/dh_smart_status"
    elif str(object_category) in ("metric_host"):
        source_value = "mh_smart_status"
        endpoint_url = "/services/trackme/v1/smart_status/mh_smart_status"
    helper.log_info("source_value={}".format(source_value))
    
    # build body
    body="{'" + str(object_category) + "': '" + str(object_name) + "'}"
    
    # HTTP mode
    http_mode = "get"
    helper.log_info("http_mode={}".format(http_mode))    

    # build header and target
    header = 'Splunk ' + str(session_key)
    target_url = "https://localhost:" + str(splunkd_port) + str(endpoint_url)
        
    # prepare the body data, if any
    json_data = None
    if body:
        json_data = json.dumps(json.loads(body.replace("\'", "\""), strict=False), indent=1)

    # Get
    response = requests.get(target_url, headers={'Authorization': header}, verify=False, data=json_data)

    # parse if response is a proper json, otherwise returns as string
    response_data = None

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

    # yield
    data = {'_time': time.time(), '_raw': response_data}
    helper.log_debug("data={}".format(data))

    # retrieve index target from trackme_idx macro
    record_url = 'https://localhost:' + str(splunkd_port) \
                 + '/servicesNS/-/-/admin/macros/trackme_idx'
    headers = {
        'Authorization': 'Splunk %s' % session_key,
        'Content-Type': 'application/json'}

    response = requests.get(record_url, headers=headers, verify=False)
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

    # write event to Splunk
    helper.addevent(json.dumps(data), sourcetype="trackme_smart_status")
    helper.writeevents(index=str(splunk_index), source=str(source_value))

    return 0
