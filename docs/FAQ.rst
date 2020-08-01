FAQ
===

*You will find in this page different smart and understandable questions, which are made available for everyone's value, thank you so much for asking!*

What is the "data name" useful for?
-----------------------------------

See :ref:`Data Sources tracking concept and features`

In the context of data source, the field **"data_name"** represents the unique identifier of the data source.

- for regular data sources created by TrackMe, this is equal to combination of <index>:<sourcetype>.
- for Elastic Sources, the definition defined when the entity is created

The data_name unique identifier is used in different parts of the application, such as the search trackers which rely on it to identify the data source.

**What are the numbers in the "lag summary" column?**

See :ref:`Data Sources tracking concept and features`

The field **"lag summary (lag event / lag ingestion)"** is exposed within the UI to summarise the two key metrics handled by TrackMe to monitor the Splunk data.

The field is composed by:

- lag_ingestion_sec: delta between index time and latest event timestamp, which can be represented as: ``(_indextime - _time)``
- lag_event_sec: delta between now when the measure is taken (when the tracker was run), and the latest event timestamp, which can be represented as ``(now() - _time)``

In this context:

- event time stamp is the _time field, which is the time stamp that Splunk affected for a given event when it was indexed on disk
- index time is the _indextime field, which is the epoch time corresponding to the moment when Splunk indexed the event on disk

Depending on the use cases, both key performance metrics might be very important, or potentially one will matter more than the other.

For continuous data flow, you need to know that the data is being indexed with the expected performance, and that you are not running late due to some underneath performance issues, this is where the lag_ingestion_sec matters.

On the other side, you need as well to be able to detect if the data flow is somehow broken, and the ingestion stopped unexpectly, this is where the lag_event_sec matters.

Is the "priority" a configurable value? If yes how do you configure it, if not how does the app derives it?
-----------------------------------------------------------------------------------------------------------

See :ref:`Priority management`

The **"priority"** field is configurable within the UI, when you click on any entity and enter the modification space (``Modify`` bytton).

Its value is defined automatically when the entity is discovered, stored in the KVstores, its default value is defined by the following macro:

``[trackme_default_priority]``

Each iteration of the trackers preserve the priority value.

The priority is used in the main charts and single forms in the UI to expose the current situation.
As well, the OOTB alerts are filtering by default on a given list of priorities, driven by the following macro:

``[trackme_alerts_priority]``

By default, all entities are added as “medium”, one option can be to update the macro to be looking at high only, such that you qualify for each entity is you want to be alerted on it and define it to high priority.
Another option would be to define everything to low besides what you qualify and want to be monitoring and get alerted.

The purpose of the priority field is to provide a granularity in which entities should be generating alerts, while all information remains easily visible and summarised in the UI.

Can the priority be externally managed?
---------------------------------------

See :ref:`Priority management`

In some use cases you may want to retrieve and/or define the value of the priority field from an external source such as a CMDB lookup stored in Splunk. (specially for data hosts)

As the value of a priority is preserved over iterations, a simple search that does a mapping and finally a KVstore update could be scheduled and run on a regular basis.

Some logic similar to:

::

    | inputlookup trackme_host_monitoring | eval key=_key
    | lookup <my CMDB lookup> data_host as host OUTPUT priority as cmdb_priority
    | eval priority=if(isnotnull(cmdb_priority), cmdb_priority, priority)
    | outputlookup trackme_host_monitoring append=t key_field=key

This search would take input the content of the lookup, perform a mapping to retrieve the priority value from the CMDB, run a simplistic evaluation and finally updates the KVstore entries.

Why do we need both short and long term trackers?
-------------------------------------------------

This is required to cover most of the use cases, in the most performing manner, at the lowest cost for the environment.

For reference:

- Short term trackers run every 5 minutes, earliest=-4h latest=+4h
- Long term trackers run once per hour, earliest=-7d latest=+4h

There are different scenarios where the short term tracker would not be able to catch information about a data flow, for example if you are recovering from an outage and the data is still running late (you are catching up), or if you are indexing data in the past which would be out of the time frame scope of the short term trackers.

For these reasons and for performance considerations, the search workload is split into two main trackers which each cover a specific time frame.

How the app determines what's a good status and what's a bad status?
--------------------------------------------------------------------

This depends on different factors, and depends on the configuration of the entity too, but in short:

- Up to the version 1.2.18, if either the lag ingestion or the lag event exceeds the max lag allowed value, the entity status will be ``red``
- Starting version 1.2.19, it is possible to define if the status should be defined depending of both KPIs, the lag ingestion only or the lag event only, depending on the configuration the status will ``red`` if the monitoring conditions are not met
- If Outliers detection is enabled, and if the Outliers status does not meet the policy, the status will be ``red``
- If TrackMe detects data ingested in the future, that exceeds the tolerance defined in the macro "trackme_future_indexing_tolerance", the status will be ``orange``
- If the status is red, and if the week days monitoring policy implies not triggering, the status will be ``orange``
- In addition for data and metric hosts, if the entity is red and is part of a logical group which status complies with its policy (example 50% available and only of the 2 members is red), the status will be ``blue``

The OOTB Alerts by default alert on the ``red`` status only.

For each status condition, a clear description is provided as part of a message which is visible in the UI, visible as focus over the icon, and as part of the alert output.

Example:

::

    Alert: data source status is red, monitoring conditions are not met due to lagging or interruption in the data flow, latest data available is 24/07/2020 19:30 (7149 seconds from now) and ingestion latency is approximately 30 seconds, max lag configured is 125 seconds.

How can you see a list of deleted entries? Can you undelete an entry?
---------------------------------------------------------------------

A user can delete an entity stored in the KVstore, assuming the user has write permissions over the KVstores and other objects. (admin, part of trackme_admin role or custom allowed)

The deletion feature is provided natively via the UI, when an entity is deleted the following workflow happens:

- The UI retrieves the key id of the record in the KVstore and performs a DELETE rest call over the KVstore endpoint
- In addition, the full entity record is logged to the audit KVstore, and exposed via the UI within the audit changes tab
- When the user deletes an entity, it can be delete temporary or permanently
- If the deletion is temporary, the entity will be recreated automatically if it is still actively sending data to Splunk, and the conditions (allow lists, block lists...) permit it
- If the deletion is permanent, an additional flag is added to the record in the audit, this flag allow the trackers to exclude creating an entitythat was permanently deleted

While it is not supported at the moment to undo the deletion, the audit record contains all the information related to the entitypreviously deleted.

Finally, the audit changes tab provides the relevant filters to allow accessing to all deletion events, including answers to when / who / how and why if an update note was added filled during the operation. 

What are Elastic Sources and what are they useful for?
------------------------------------------------------

The Elastic source concept is covered in deep in the :ref:`Elastic sources` documentation, wich includes comprehensive examples.

How to deal with sourcetypes that are emitting data occasionally or sporadically? Does TrackMe automatically detects this?
--------------------------------------------------------------------------------------------------------------------------

There are no easy answers to this question, however:

- From a data source perspective, what matters is monitoring the data from a pipeline point of view, which translated in TrackMe means making sure you have a data source that corresponds to this unique data flow
- From a data host perspective, there wouldn't be the value one could be expecting in having a strict monitoring of every single sourcetype linked to a given host, especially because many of them can be generating data in a sporadic fashion depending on the circumstances
- On the opposite, what matters and provides value is being able to detect global failures of hosts (endpoints, whatever you call these) in a way that is not generating noises and alert fatigue
- This is why the data host design takes in consideration the data globally sent on a per host basis, TrackMe provides many different features (allowlist / blocklist, etc) to manage use cases with the level of granularity required 
- Finally, from the data host perspective, the outliers detection is a powerful feature that would provide the capability to detect a significant change in the data volume, for example when a major sourcetype has stopped to be emitted 