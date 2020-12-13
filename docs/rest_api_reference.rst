REST API Reference Manual
=========================

Introduction
------------

TrackMe provides a builtin Python based API, serviced by the Splunk API, and categorized by resource groups.

These resource groups are accessible by specific endpoint paths as following:

+--------------------------------------+-----------------------------------+
| Resource group                       | API Path                          |
+======================================+===================================+
| :ref:`Acknowledgment endpoints`      | /services/trackme/v1/ack          |
+--------------------------------------+-----------------------------------+
| :ref:`Data Sources endpoints`        | /services/trackme/v1/data_sources |
+--------------------------------------+-----------------------------------+
| :ref:`Data Hosts endpoints`          | /services/trackme/v1/data_hosts   |
+--------------------------------------+-----------------------------------+
| :ref:`Metric Hosts endpoints`        | /services/trackme/v1/metric_hosts |
+--------------------------------------+-----------------------------------+
| :ref:`Maintenance mode endpoints`    | /services/trackme/v1/maintenance  |
+--------------------------------------+-----------------------------------+

Using these endpoints provide the capabilities to interract with TrackMe in a programmatic fashion, which allow for instance to implement any kind of automation task.

Authentication
--------------

User and roles
^^^^^^^^^^^^^^

You can use any combination of user and roles depending on your preferences, technically, using the TrackMe API endpoint requires read and write permissions to various objects all hosted in the TrackMe namespace.

TrackMe contains a builtin role ``trackme_admin`` which defines required accesses to these objects, you can use this role and make sure the user that will be achieving the rest calls is member of this role, or inherits from it.

Prior Splunk 7.3.0
^^^^^^^^^^^^^^^^^^

Prior to Splunk Splunk 7.3.0, the easiest is to used a standard login / password approach to authenticate against Splunk API, similary to:

::

    curl -k -u admin:'ch@ngeM3'

Alternatively, it is possible to perform a first authentication, retrieve a temporary token to be used within the REST calls:

Official documentation: `Splunk docs API token <https://docs.splunk.com/Documentation/Splunk/latest/RESTUM/RESTusing#Authentication_and_authorization>`_.

*Example authenticating with a user called svc_kafka that is member of the kafka_admin role:*

::

    curl -k https://localhost:8089/services/auth/login --data-urlencode username=svc_splunk --data-urlencode password=pass

    <response>
      <sessionKey>DWGNbGpJgSj30w0GxTAxMj8t0dZKjvjxLYaP^yphdluFN_FGz4gz^NhcgPCLDkjWH3BUQa1Vewt8FTF8KXyyfI09HqjOicIthMuBIB70dVJA8Jg</sessionKey>
      <messages>
        <msg code=""></msg>
      </messages>
    </response>

    export token="DWGNbGpJgSj30w0GxTAxMj8t0dZKjvjxLYaP^yphdluFN_FGz4gz^NhcgPCLDkjWH3BUQa1Vewt8FTF8KXyyfI09HqjOicIthMuBIB70dVJA8Jg"

A token remains valid for the time of a session, which is by default valid for 1 hour.

The token would be used as following:

::

    curl -k -H "Authorization: Splunk $token"

For Splunk 7.3.0 and later
^^^^^^^^^^^^^^^^^^^^^^^^^^

Splunk 7.3.0 introduced the usage of proper authentication tokens, which is the recommended way to authenticate against splunkd API:

Official documentation: `Splunk docs JSON authentication token <https://docs.splunk.com/Documentation/Splunk/latest/Security/UseAuthTokens>`_.

Once you have created an authentication token for the user to be used as the service account, using curl specify the bearer token:

::

    curl -k –H "Authorization: Bearer <token>"


Acknowledgment endpoints
------------------------

**Resources summary:**

+-------------------------------------------------------+--------------------------------------------------+
| Resource                                              | API Path                                         |
+=======================================================+==================================================+
| :ref:`ack_collection / Get full Ack collection`       | /services/trackme/v1/ack/ack_collection          |
+-------------------------------------------------------+--------------------------------------------------+
| :ref:`ack_by_key / Get Ack by _key`                   | /services/trackme/v1/ack/ack_by_key              |
+-------------------------------------------------------+--------------------------------------------------+
| :ref:`ack_by_object / Get Ack by object`              | /services/trackme/v1/ack/ack_by_object           |
+-------------------------------------------------------+--------------------------------------------------+
| :ref:`ack_enable / Enable Ack`                        | /services/trackme/v1/ack/ack_enable              |
+-------------------------------------------------------+--------------------------------------------------+
| :ref:`ack_disable / Disable Ack`                      | /services/trackme/v1/ack/ack_disable             |
+-------------------------------------------------------+--------------------------------------------------+

ack_collection / Get full Ack collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves the entire acknowledgment collection and renders as a JSON array, it requires a GET call with no data required:**

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/ack/ack_collection

*JSON response: (full collection)*

::

    [
     {
      "ack_expiration": "1607796255.2581134",
      "ack_mtime": "1607709855.2581134",
      "ack_state": "active",
      "keyid": "5fd3b49f5cfa0d7b797c6181",
      "limit_expiration": "1607795955.2581134",
      "object": "pan:traffic",
      "object_category": "data_source",
      "_user": "nobody",
      "_key": "5fd3b49f5cfa0d7b797c6181"
     },
     {
      "ack_expiration": "1607848092.4875946",
      "ack_mtime": "1607761692.4875946",
      "ack_state": "active",
      "keyid": "5fd47f165cfa0d7b797c8e8f",
      "limit_expiration": "1607847792.4875946",
      "object": "docker_logs:httpevent",
      "object_category": "data_source",
      "object_current_state": "red",
      "_user": "nobody",
      "_key": "5fd47f165cfa0d7b797c8e8f"
     }
    ]
    ...

ack_by_key / Get Ack by _key
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing acknowledgment record by the Kvstore key, it requires a GET call with the following information:**

- ``"_key": "<KVstore unique identifier for this record>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/ack/ack_by_key -d '{"_key": "5fd3fe737b1bef735d3f3532"}'

*JSON response:*

::

    {
     "ack_expiration": "1608333555",
     "ack_mtime": "1607728755",
     "ack_state": "active",
     "keyid": "5fd3fe737b1bef735d3f3532",
     "limit_expiration": "1608333255",
     "object": "network:pan:traffic",
     "object_category": "data_source",
     "object_current_state": "red",
     "_user": "nobody",
     "_key": "5fd3fe737b1bef735d3f3532"
    }

ack_by_object / Get Ack by object
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing acknowledgment record by the object name, it requires a GET call with the following information:**


- ``"object_category": "<type of object (data_source / data_host / metric_host)>"`` 
- ``"object": "<name of the object (data source / data host / metric host)>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/ack/ack_by_object -d '{"object_category": "data_source", "object": "network:pan:traffic"}'

*JSON response:*

::

    [
     {
      "ack_expiration": "1608333555",
      "ack_mtime": "1607728755",
      "ack_state": "active",
      "keyid": "5fd3fe737b1bef735d3f3532",
      "limit_expiration": "1608333255",
      "object": "network:pan:traffic",
      "object_category": "data_source",
      "object_current_state": "red",
      "_user": "nobody",
      "_key": "5fd3fe737b1bef735d3f3532"
     }
    ]

ack_enable / Enable Ack
^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint will enable an acknowledgment by the object name, it requires a POST call with the following information:**

- ``"object_category": "<type of object (data_source / data_host / metric_host)>"``
- ``"object": "<name of the object (data source / data host / metric host)>"``
- ``"ack_period": "<period for the acknowledgment in seconds>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/ack/ack_enable -d '{"object_category": "data_source", "object": "network:pan:traffic", "ack_period": "86400", "update_comment": "Updated by automation."}'

*JSON response:*

::

    {
     "object": "network:pan:traffic",
     "object_category": "data_source",
     "ack_expiration": "1607815805.7918282",
     "ack_state": "active",
     "ack_mtime": "1607729405.7918282",
     "_user": "nobody",
     "_key": "5fd3fe737b1bef735d3f3532"
    }

ack_disable / Disable Ack
^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint will disable an acknowledgment by the object name, it requires a POST call with the following information:**

- ``"object_category": "<type of object (data_source / data_host / metric_host)>"`` 
- ``"object": "<name of the object (data source / data host / metric host)>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/ack/ack_disable -d '{"object_category": "data_source", "object": "network:pan:traffic", "update_comment": "Updated by automation."}'

*JSON response:*

::

    {
     "object": "network:pan:traffic",
     "object_category": "data_source",
     "ack_expiration": "N/A",
     "ack_state": "inactive",
     "ack_mtime": "1607729326.6667607",
     "_user": "nobody",
     "_key": "5fd3fe737b1bef735d3f3532"
    }

Data Sources endpoints
----------------------

**Resources summary:**

+---------------------------------------------------------------------+-----------------------------------------------------------------+
| Resource                                                            | API Path                                                        | 
+=====================================================================+=================================================================+
| :ref:`ds_collection / Get full Data Sources collection`             | /services/trackme/v1/data_sources/ds_collection                 |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_by_key / Get Data Source by _key`                          | /services/trackme/v1/data_sources/ds_by_key                     |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_by_name / Get Data Source by name`                         | /services/trackme/v1/data_sources/ds_by_name                    |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_enable_monitoring / Enable monitoring`                     | /services/trackme/v1/data_sources/ds_enable_monitoring          |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_disable_monitoring / Disable monitoring`                   | /services/trackme/v1/data_sources/ds_disable_monitoring         |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_update_lag_policy / Update lagging policy`                 | /services/trackme/v1/data_sources/ds_update_lag_policy          |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_update_min_dcount_host / Update minimal host dcount`       | /services/trackme/v1/data_sources/ds_update_min_dcount_host     |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_update_wdays_by_name / Update week days monitoring`        | /services/trackme/v1/data_sources/ds_update_wdays               |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_update_outliers / Update outliers detection configuration` | /services/trackme/v1/data_sources/ds_update_outliers            |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_delete_temporary / Delete temporary`                       | /services/trackme/v1/data_sources/ds_delete_temporary           |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_delete_permanent / Delete permanently`                     | /services/trackme/v1/data_sources/ds_delete_permanent           |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_enable_data_sampling / Enable data sampling`               | /services/trackme/v1/data_sources/ds_enable_data_sampling       |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`ds_disable_data_sampling / Disable data sampling`             | /services/trackme/v1/data_sources/ds_disable_data_sampling      |
+---------------------------------------------------------------------+-----------------------------------------------------------------+

ds_collection / Get full Data Sources collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves the entire data sources collection and renders as a JSON array, it requires a GET call with no data required:**

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/data_sources/ds_collection

*JSON response: (full collection)*

::

    [
     {
      "OutlierAlertOnUpper": "false",
      "OutlierLowerThresholdMultiplier": "4",
      "OutlierMinEventCount": "0",
      "OutlierSpan": "5m",
      "OutlierTimePeriod": "-7d",
      "OutlierUpperThresholdMultiplier": "4",
      "_time": "1607779500",
      ...

ds_by_key / Get Data Source by _key
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing data source record by the Kvstore key, it requires a GET call with the following information:**

- ``"_key": "<KVstore unique identifier for this record>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/data_sources/ds_by_key -d '{"_key": "7e8670878a9ad91844f18655f1819c06"}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_by_name / Get Data Source by name
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing data source record by the data source name (data_name), it requires a GET call with the following information:**

- ``"data_name": "<name of the data source>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/data_sources/ds_by_name -d '{"data_name": "network:pan:traffic"}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_enable_monitoring / Enable monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint enables data monitoring for an existing data source by the data source name (data_name), it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_enable_monitoring -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_disable_monitoring / Disable monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint disables data monitoring for an existing data source by the data source name (data_name), it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_disable_monitoring -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_update_lag_policy / Update lagging policy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the lagging policy for an existing data source, it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"data_lag_alert_kpis": "<KPIs policy to be applied, valid options are all_kpis / lag_ingestion_kpi / lag_event_kpi>"``
- ``"data_max_lag_allowed": "<maximal accepted lagging value in seconds, must be an integer>"``
- ``"data_override_lagging_class": "<overrides lagging classes, valid options are true / false>``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_update_lag_policy -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation.", "data_lag_alert_kpis": "lag_ingestion_kpi", "data_max_lag_allowed": "300", "data_override_lagging_class": "true"}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_update_min_dcount_host / Update minimal host dcount
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the minimal number of distinct hosts count for an existing data source, it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"data_max_lag_allowed": "<minimal accepted number of distinct count hosts, must be an integer>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_update_min_dcount_host -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation.", "min_dcount_host": "100"}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_update_wdays_by_name / Update week days monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the week days monitoring rule for an existing data source, it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"data_monitoring_wdays": "< the week days rule, valid options are manual:all_days / manual:monday-to-friday / manual:monday-to-saturday / [ 0, 1, 2, 3, 4, 5, 6 ] where Sunday is 0>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_update_wdays -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation.", "data_monitoring_wdays": "manual:monday-to-friday"}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_update_outliers / Update outliers detection configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the week days monitoring rule for an existing data source, it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"OutlierMinEventCount": "<the minimal number of events, if set to anything bigger than 0, the lower bound becomes a static value, needs to be an integer, default to 0 (disabled)>"``
- ``"OutlierLowerThresholdMultiplier": "<The lower bound threshold multiplier, must be an integer, defaults to 4>"``
- ``"OutlierUpperThresholdMultiplier": "<The upper bound threshold multiplier, must be integer, defaults to 4>"``
- ``"OutlierAlertOnUpper": "Enables / Disables alerting on upper outliers detection, valid options are true / false, defaults to false>"``
- ``"OutlierTimePeriod": "<relative time period for outliers calculation, default to -7d>"``
- ``"OutlierSpan": "<span period Splunk notation for outliers UI rendering, defaults to 5m>"``
- ``"enable_behaviour_analytic": "Enables / Disables outliers detection for that object, valid options are true / false, defaults to true>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_update_outliers -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation.", "OutlierMinEventCount": "0", "OutlierLowerThresholdMultiplier": "6", "OutlierUpperThresholdMultiplier": "6", "OutlierAlertOnUpper": "false", "OutlierTimePeriod": "7d", "OutlierSpan": "5m", "enable_behaviour_analytic": "true"}'

*JSON response: (full record)*

::

    {
    "OutlierAlertOnUpper": "false",
    "OutlierLowerThresholdMultiplier": "4",
    "OutlierMinEventCount": "0",
    "OutlierSpan": "5m",
    "OutlierTimePeriod": "-7d",
    "OutlierUpperThresholdMultiplier": "4",
    "_time": "1607770500",
    "current_state": "green",
    ...

ds_delete_temporary / Delete temporary
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint performs a temporary deletion of an existing data source, it requires a DELETE call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

Note: A temporary deletion removes the entity and its configuration, if search conditions such as data avaibility allow it, the same entitiy will be re-created automatically by the Trackers.

::

    curl -k -u admin:'ch@ngeM3' -X DELETE https://localhost:8089/services/trackme/v1/data_sources/ds_delete_temporary -d '{"data_name": "network:pan:traffic"}'

*JSON response: (full record)*

::

    Record with _key 7e8670878a9ad91844f18655f1819c06 was temporarily deleted from the collection.%

ds_delete_permanent / Delete permanently
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint performs a permanent deletion of an existing data source, it requires a DELETE call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

Note: A permanent deletion removes the entity and its configuration, in addition its a specific audit record to prevent the entity from being created as long as the audit record is not purged. if the audit record is purged and the search conditions such as data avaibility allow it, the same entitiy will be re-created automatically by the Trackers.

::

    curl -k -u admin:'ch@ngeM3' -X DELETE https://localhost:8089/services/trackme/v1/data_sources/ds_delete_permanent -d '{"data_name": "network:pan:traffic"}'

*JSON response: (full record)*

::

    Record with _key 7e8670878a9ad91844f18655f1819c06 was permanently deleted from the collection.% 

ds_enable_data_sampling / Enable data sampling
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint enables the data sampling feature for an existing data source by the data source name (data_name), it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_enable_data_sampling -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
     "data_name": "network:pan:traffic",
     "data_sample_feature": "enabled",
     "_user": "nobody",
     "_key": "7e8670878a9ad91844f18655f1819c06"
    }

ds_disable_data_sampling / Disable data sampling
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint disables the data sampling feature for an existing data source by the data source name (data_name), it requires a POST call with the following information:**

- ``"data_name": "<name of the data source>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_sources/ds_disable_data_sampling -d '{"data_name": "network:pan:traffic", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
     "data_name": "network:pan:traffic",
     "data_sample_feature": "disabled",
     "_user": "nobody",
     "_key": "7e8670878a9ad91844f18655f1819c06"
    }

Data Hosts endpoints
--------------------

**Resources summary:**

+---------------------------------------------------------------------+-----------------------------------------------------------------+
| Resource                                                            | API Path                                                        | 
+=====================================================================+=================================================================+
| :ref:`dh_collection / Get full Data Hosts collection`               | /services/trackme/v1/data_hosts/dh_collection                   |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_by_key / Get Data host by _key`                            | /services/trackme/v1/data_hosts/dh_by_key                       |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_by_name / Get Data host by name`                           | /services/trackme/v1/data_hosts/dh_by_name                      |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_enable_monitoring / Enable monitoring`                     | /services/trackme/v1/data_hosts/dh_enable_monitoring            |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_disable_monitoring / Disable monitoring`                   | /services/trackme/v1/data_hosts/dh_disable_monitoring           |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_update_lag_policy / Update lagging policy`                 | /services/trackme/v1/data_hosts/dh_update_lag_policy            |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_update_wdays_by_name / Update week days monitoring`        | /services/trackme/v1/data_hosts/dh_update_wdays                 |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_update_outliers / Update outliers detection configuration` | /services/trackme/v1/data_hosts/dh_update_outliers              |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_delete_temporary / Delete temporary`                       | /services/trackme/v1/data_hosts/dh_delete_temporary             |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`dh_delete_permanent / Delete permanently`                     | /services/trackme/v1/data_hosts/dh_delete_permanent             |
+---------------------------------------------------------------------+-----------------------------------------------------------------+

dh_collection / Get full Data Hosts collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves the entire data hosts collection and renders as a JSON array, it requires a GET call with no data required:**

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/data_hosts/dh_collection

*JSON response: (full collection)*

::

    [
     {
     "OutlierAlertOnUpper": "false",
     "OutlierLowerThresholdMultiplier": "4",
     "OutlierMinEventCount": "0",
     "OutlierSpan": "5m",
     "OutlierTimePeriod": "-7d",
     "OutlierUpperThresholdMultiplier": "4",
     "_time": "1607781900",
     "current_state": "green",
     "data_custom_max_lag_allowed": "0",
     "data_eventcount": "60",
     "data_first_time_seen": "1607781871",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     "data_host_alerting_policy": "global_policy",
    ...

dh_by_key / Get data host by _key
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing data host record by the Kvstore key, it requires a GET call with the following information:**

- ``"_key": "<KVstore unique identifier for this record>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/data_hosts/dh_by_key -d '{"_key": "14781cf495c76f1373382197f071c5d6"}'

*JSON response: (full record)*

::

    {
     "OutlierAlertOnUpper": "false",
     "OutlierLowerThresholdMultiplier": "4",
     "OutlierMinEventCount": "0",
     "OutlierSpan": "5m",
     "OutlierTimePeriod": "-7d",
     "OutlierUpperThresholdMultiplier": "4",
     "_time": "1607781900",
     "current_state": "green",
     "data_custom_max_lag_allowed": "0",
     "data_eventcount": "60",
     "data_first_time_seen": "1607781871",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     ...

dh_by_name / Get data host by name
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing data host record by the data host name (data_host), it requires a GET call with the following information:**

- ``"data_host": "<name of the data host>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/data_hosts/dh_by_name -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1"}'

*JSON response: (full record)*

::

    [
     {
      "OutlierAlertOnUpper": "false",
      "OutlierLowerThresholdMultiplier": "4",
      "OutlierMinEventCount": "0",
      "OutlierSpan": "5m",
      "OutlierTimePeriod": "-7d",
      "OutlierUpperThresholdMultiplier": "4",
      "_time": "1607782200",
      "current_state": "green",
      "data_custom_max_lag_allowed": "0",
      "data_eventcount": "338",
      "data_first_time_seen": "1607781871",
      "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",

dh_enable_monitoring / Enable monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint enables data monitoring for an existing data host by the data host name (data_host), it requires a POST call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_hosts/dh_enable_monitoring -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
     "object_category": "data_host",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     "data_index": "firewall",
     "data_sourcetype": "pan:traffic",
     "data_last_lag_seen": "-5",
     "data_last_ingestion_lag_seen": "0",
     "data_eventcount": "338",
     "data_first_time_seen": "1607781871",
     ...

dh_disable_monitoring / Disable monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint disables data monitoring for an existing data host by the data host name (data_host), it requires a POST call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_hosts/dh_disable_monitoring -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
     "object_category": "data_host",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     "data_index": "firewall",
     "data_sourcetype": "pan:traffic",
     "data_last_lag_seen": "-5",
     "data_last_ingestion_lag_seen": "0",
     "data_eventcount": "338",
     "data_first_time_seen": "1607781871",
     ...

dh_update_lag_policy / Update lagging policy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the lagging policy for an existing data host, it requires a POST call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"data_lag_alert_kpis": "<KPIs policy to be applied, valid options are all_kpis / lag_ingestion_kpi / lag_event_kpi>"``
- ``"data_max_lag_allowed": "<maximal accepted lagging value in seconds, must be an integer>"``
- ``"data_override_lagging_class": "<overrides lagging classes, valid options are true / false>``
- ``"data_host_alerting_policy": "<policy alerting, valid options are global_policy / track_per_sourcetype / track_per_host>``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_hosts/dh_update_lag_policy -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1", "update_comment": "Updated by automation.", "data_lag_alert_kpis": "lag_ingestion_kpi", "data_max_lag_allowed": "300", "data_override_lagging_class": "true", "data_host_alerting_policy": "track_per_sourcetype"}'

*JSON response: (full record)*

::

    {
     "object_category": "data_host",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     "data_index": "firewall",
     "data_sourcetype": "pan:traffic",
     "data_last_lag_seen": "-4",
     "data_last_ingestion_lag_seen": "0",
     "data_eventcount": "5756",
     "data_first_time_seen": "1607205117",
     ...

dh_update_wdays_by_name / Update week days monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the week days monitoring rule for an existing data host, it requires a POST call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"data_monitoring_wdays": "< the week days rule, valid options are manual:all_days / manual:monday-to-friday / manual:monday-to-saturday / [ 0, 1, 2, 3, 4, 5, 6 ] where Sunday is 0>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_hosts/dh_update_wdays -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1", "update_comment": "Updated by automation.", "data_monitoring_wdays": "manual:monday-to-friday"}'

*JSON response: (full record)*

::

    {
     "object_category": "data_host",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     "data_index": "firewall",
     "data_sourcetype": "pan:traffic",
     "data_last_lag_seen": "-7",
     "data_last_ingestion_lag_seen": "0",
     "data_eventcount": "938",
     "data_first_time_seen": "1607781871",
     ...

dh_update_outliers / Update outliers detection configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint configures the week days monitoring rule for an existing data host, it requires a POST call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"OutlierMinEventCount": "<the minimal number of events, if set to anything bigger than 0, the lower bound becomes a static value, needs to be an integer, default to 0 (disabled)>"``
- ``"OutlierLowerThresholdMultiplier": "<The lower bound threshold multiplier, must be an integer, defaults to 4>"``
- ``"OutlierUpperThresholdMultiplier": "<The upper bound threshold multiplier, must be integer, defaults to 4>"``
- ``"OutlierAlertOnUpper": "Enables / Disables alerting on upper outliers detection, valid options are true / false, defaults to false>"``
- ``"OutlierTimePeriod": "<relative time period for outliers calculation, default to -7d>"``
- ``"OutlierSpan": "<span period Splunk notation for outliers UI rendering, defaults to 5m>"``
- ``"enable_behaviour_analytic": "Enables / Disables outliers detection for that object, valid options are true / false, defaults to true>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/data_hosts/dh_update_outliers -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1", "update_comment": "Updated by automation.", "OutlierMinEventCount": "0", "OutlierLowerThresholdMultiplier": "6", "OutlierUpperThresholdMultiplier": "6", "OutlierAlertOnUpper": "false", "OutlierTimePeriod": "7d", "OutlierSpan": "5m", "enable_behaviour_analytic": "true"}'

*JSON response: (full record)*

::

    {
     "object_category": "data_host",
     "data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1",
     "data_index": "firewall",
     "data_sourcetype": "pan:traffic",
     "data_last_lag_seen": "-7",
     "data_last_ingestion_lag_seen": "0",
     "data_eventcount": "938",
     ...

dh_delete_temporary / Delete temporary
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint performs a temporary deletion of an existing data host, it requires a DELETE call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

Note: A temporary deletion removes the entity and its configuration, if search conditions such as data avaibility allow it, the same entitiy will be re-created automatically by the Trackers.

::

    curl -k -u admin:'ch@ngeM3' -X DELETE https://localhost:8089/services/trackme/v1/data_hosts/dh_delete_temporary -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1"}'

*JSON response: (full record)*

::

    Record with _key 7e8670878a9ad91844f18655f1819c06 was temporarily deleted from the collection.%

dh_delete_permanent / Delete permanently
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint performs a permanent deletion of an existing data host, it requires a DELETE call with the following information:**

- ``"data_host": "<name of the data host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

Note: A permanent deletion removes the entity and its configuration, in addition its a specific audit record to prevent the entity from being created as long as the audit record is not purged. if the audit record is purged and the search conditions such as data avaibility allow it, the same entitiy will be re-created automatically by the Trackers.

::

    curl -k -u admin:'ch@ngeM3' -X DELETE https://localhost:8089/services/trackme/v1/data_hosts/dh_delete_permanent -d '{"data_host": "FIREWALL.PAN.AMER.DESIGN.NODE1"}'

*JSON response: (full record)*

::

    Record with _key 7e8670878a9ad91844f18655f1819c06 was permanently deleted from the collection.% 

Metric Hosts endpoints
----------------------

**Resources summary:**

+---------------------------------------------------------------------+-----------------------------------------------------------------+
| Resource                                                            | API Path                                                        | 
+=====================================================================+=================================================================+
| :ref:`mh_collection / Get full Metric Hosts collection`             | /services/trackme/v1/metric_hosts/mh_collection                 |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`mh_by_key / Get Metric host by _key`                          | /services/trackme/v1/metric_hosts/mh_by_key                     |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`mh_by_name / Get Metric host by name`                         | /services/trackme/v1/metric_hosts/mh_by_name                    |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`mh_enable_monitoring / Enable monitoring`                     | /services/trackme/v1/metric_hosts/mh_enable_monitoring          |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`mh_disable_monitoring / Disable monitoring`                   | /services/trackme/v1/metric_hosts/mh_disable_monitoring         |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`mh_delete_temporary / Delete temporary`                       | /services/trackme/v1/metric_hosts/mh_delete_temporary           |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`mh_delete_permanent / Delete permanently`                     | /services/trackme/v1/metric_hosts/mh_delete_permanent           |
+---------------------------------------------------------------------+-----------------------------------------------------------------+

mh_collection / Get full Metric Hosts collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves the entire metric hosts collection and renders as a JSON array, it requires a GET call with no data required:**

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/metric_hosts/mh_collection

*JSON response: (full collection)*

::

    [
     {
      "_time": "1607815039",
      "current_state": "green",
      "info_max_time": "1607815039.000",
      "info_min_time": "1607814739.000",
      "info_search_time": "1607815039.524",
      "info_sid": "1607815039.126",
      "latest_flip_state": "green",
      "latest_flip_time": "1607815039",
      ...

mh_by_key / Get metric host by _key
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing metric host record by the Kvstore key, it requires a GET call with the following information:**

- ``"_key": "<KVstore unique identifier for this record>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/metric_hosts/mh_by_key -d '{"_key": "afb0c5fc92f20c8011ecac371b04f77e"}'

*JSON response: (full record)*

::

    {
     "_time": "1607815039",
     "current_state": "green",
     "info_max_time": "1607815039.000",
     "info_min_time": "1607814739.000",
     "info_search_time": "1607815039.524",
     "info_sid": "1607815039.126",
     "latest_flip_state": "green",
     "latest_flip_time": "1607815039",
     ...

mh_by_name / Get metric host by name
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing metric host record by the metric host name (metric_host), it requires a GET call with the following information:**

- ``"metric_host": "<name of the metric host>"``

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/metric_hosts/mh_by_name -d '{"metric_host": "telegraf-node1"}'

*JSON response: (full record)*

::

    [
     {
      "_time": "1607815200",
      "current_state": "green",
      "info_max_time": "1607815200.000",
      "info_min_time": "1607814900.000",
      "info_search_time": "1607815201.133",
      "info_sid": "scheduler__admin__trackme__RMD56299d9dc7b583db4_at_1607815200_6",
      "latest_flip_state": "green",
      "latest_flip_time": "1607815039",

mh_enable_monitoring / Enable monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint enables data monitoring for an existing metric host by the metric host name (metric_host), it requires a POST call with the following information:**

- ``"metric_host": "<name of the metric host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/metric_hosts/mh_enable_monitoring -d '{"metric_host": "telegraf-node1", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
     "object_category": "metric_host",
     "metric_host": "telegraf-node1",
     "metric_index": "telegraf",
     "metric_category": "docker,docker_container_blkio,docker_container_cpu,docker_container_health,docker_container_mem,docker_container_net,docker_container_status",
    ...

mh_disable_monitoring / Disable monitoring
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint disables data monitoring for an existing metric host by the metric host name (metric_host), it requires a POST call with the following information:**

- ``"metric_host": "<name of the metric host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/metric_hosts/mh_disable_monitoring -d '{"metric_host": "telegraf-node1", "update_comment": "Updated by automation."}'

*JSON response: (full record)*

::

    {
     "object_category": "metric_host",
     "metric_host": "telegraf-node1",
     "metric_index": "telegraf",
     "metric_category": "docker,docker_container_blkio,docker_container_cpu,docker_container_health,docker_container_mem,docker_container_net,docker_container_status",
     ...

mh_delete_temporary / Delete temporary
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint performs a temporary deletion of an existing metric host, it requires a DELETE call with the following information:**

- ``"metric_host": "<name of the metric host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

Note: A temporary deletion removes the entity and its configuration, if search conditions such as data avaibility allow it, the same entitiy will be re-created automatically by the Trackers.

::

    curl -k -u admin:'ch@ngeM3' -X DELETE https://localhost:8089/services/trackme/v1/metric_hosts/mh_delete_temporary -d '{"metric_host": "telegraf-node1"}'

*JSON response: (full record)*

::

    Record with _key afb0c5fc92f20c8011ecac371b04f77e was temporarily deleted from the collection.%

mh_delete_permanent / Delete permanently
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint performs a permanent deletion of an existing metric host, it requires a DELETE call with the following information:**

- ``"metric_host": "<name of the metric host>"``
- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

Note: A permanent deletion removes the entity and its configuration, in addition its a specific audit record to prevent the entity from being created as long as the audit record is not purged. if the audit record is purged and the search conditions such as data avaibility allow it, the same entitiy will be re-created automatically by the Trackers.

::

    curl -k -u admin:'ch@ngeM3' -X DELETE https://localhost:8089/services/trackme/v1/metric_hosts/mh_delete_permanent -d '{"metric_host": "telegraf-node1"}'

*JSON response: (full record)*

::

    Record with _key afb0c5fc92f20c8011ecac371b04f77e was permanently deleted from the collection.%

Maintenance mode endpoints
--------------------------

**Resources summary:**

+---------------------------------------------------------------------+-----------------------------------------------------------------+
| Resource                                                            | API Path                                                        | 
+=====================================================================+=================================================================+
| :ref:`maintenance_status / Get maintenance mode`                    | /services/trackme/v1/maintenance/maintenance_status             |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`maintenance_enable / Enable maintenance mode`                 | /services/trackme/v1/maintenance/maintenance_enable             |
+---------------------------------------------------------------------+-----------------------------------------------------------------+
| :ref:`maintenance_disable / Disable maintenance mode`               | /services/trackme/v1/maintenance/maintenance_disable            |
+---------------------------------------------------------------------+-----------------------------------------------------------------+

maintenance_status / Get maintenance mode
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves the current maintenance mode collection and renders as a JSON array, its requires a GET call with no data required::**

::

    curl -k -u admin:'ch@ngeM3' -X GET https://localhost:8089/services/trackme/v1/maintenance/maintenance_status

*JSON response: (full collection)*

::

    [
     {
      "maintenance_mode": "disabled",
      "time_updated": "1607859191",
      "_user": "nobody",
      "_key": "5fd5fd92b21b3338341e63c1"
     }
    ]

maintenance_enable / Enable maintenance mode
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint enables the maintenance mode, it requires a POST call with the following information:**

- ``"maintenance_duration": "<integer>"``

OPTIONAL: the duration of the maintenance window in seconds, if unspecified and maintenance_mode_end is not specified either, defaults to now plus 24 hours

- ``"maintenance_mode_end": "<integer>"``

OPTIONAL: the date time in epochtime format for the end of the maintenance window, it is overriden by maintenance_duration if specified, defaults to now plus 24 hours if not specified and maintenance_duration is not specified

- ``"maintenance_mode_start": "<integer>"``

OPTIONAL: the date time in epochtime format for the start of the maintennce window, defaults to now if not specified

- ``"update_comment": "<string>"``

OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update

*Immediately start a maintenance window for 24 hours:*

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/maintenance/maintenance_enable -d '{"updated_comment": "Beginning a 24 hours maintenance window."}'

*Immediately start a maintenance window for 1 hour:*

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/maintenance/maintenance_enable -d '{"updated_comment": "Beginning maintenance window for 1 hour.", "maintenance_duration": "3600"}'

*Create a scheduled maintenance window with an explicit start and end in epochtime:*

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/maintenance/maintenance_enable -d '{"updated_comment": "Beginning maintenance window for 1 hour.", "maintenance_mode_start": "1607878800", "maintenance_mode_end": "1607904000"}'

*JSON response:*

::

    [
     {
      "maintenance_mode": "enabled",
      "time_updated": "1607859834",
      "maintenance_mode_start": "1607859834",
      "maintenance_mode_end": "1607946234",
      "_user": "nobody",
      "_key": "5fd5fd92b21b3338341e63c1"
     }
    ]

maintenance_disable / Disable maintenance mode
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint disables the maintenance mode, it requires a POST call with the following information:**

- ``"update_comment": "<OPTIONAL: a comment for the update, comments are added to the audit record, if unset will be defined to: API update>``

*Immediately stops the maintenance window:*

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/maintenance/maintenance_disable -d '{"updated_comment": "Terminating the maintenance window."}'

*JSON response:*

::

    [
     {
      "maintenance_mode": "disabled",
      "time_updated": "1607860485",
      "maintenance_mode_start": "N/A",
      "maintenance_mode_end": "N/A",
      "_user": "nobody",
      "_key": "5fd600aec14381564521b181"
     }
    ]

