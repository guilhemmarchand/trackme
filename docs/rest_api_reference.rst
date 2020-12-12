REST API Reference Manual
=========================

Acknowledgment endpoints
------------------------

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
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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

Data sources endpoints
----------------------

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

