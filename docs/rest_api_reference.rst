REST API Reference Manual
=========================

Acknowledgment endpoints
------------------------

ack_by_key / Get Ack by _key
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint retrieves an existing acknowledgment record by the Kvstore key, it expects a GET call with the following information:**

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

**This endpoint retrieves an existing acknowledgment record by the object name, it expects a GET call with the following information:**


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

ack_enable_by_object / Enable Ack
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint will enable an acknowledgment by the object name, it expects a POST call with the following information:**

- ``"object_category": "<type of object (data_source / data_host / metric_host)>"``
- ``"object": "<name of the object (data source / data host / metric host)>"``
- ``"ack_period": "<period for the acknowledgment in seconds>"``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/ack/ack_enable_by_object -d '{"object_category": "data_source", "object": "network:pan:traffic", "ack_period": "86400"}'

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

ack_disable_by_object / Disable Ack
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**This endpoint will disable an acknowledgment by the object name, it expects a POST call with the following information:**

- ``"object_category": "<type of object (data_source / data_host / metric_host)>"`` 
- ``"object": "<name of the object (data source / data host / metric host)>"``

::

    curl -k -u admin:'ch@ngeM3' -X POST https://localhost:8089/services/trackme/v1/ack/ack_disable_by_object -d '{"object_category": "data_source", "object": "network:pan:traffic"}'

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
