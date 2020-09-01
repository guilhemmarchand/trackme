FAQ
===

*You will find in this page different smart and understandable questions, which are made available for everyone's value, thank you so much for asking!*

What is the "data name" useful for?
-----------------------------------

See :ref:`data sources tracking and features`

In the context of data source, the field **"data_name"** represents the unique identifier of the data source.

- for regular data sources created by TrackMe, this is equal to combination of <index>:<sourcetype>.
- for Elastic Sources, the definition defined when the entity is created

The data_name unique identifier is used in different parts of the application, such as the search trackers which rely on it to identify the data source.

**What are the numbers in the "lag summary" column?**

See :ref:`data sources tracking and features`

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

- The default concept of data sources tracking relies on entities broken per index and sourcetype, this can be extended easily using the Elastic sources feature to fullfil any kind of requirements and make sure that a data source represents the data pipeline
- The data hosts tracking feature provides the vision broken on a per host basis (using the Splunk host Metadata) 
- TrackMe does not replace the knowledge you have regarding the way you are ingesting data into Splunk, instead it provides various features and options you can use to configure what should raise an alert or not, and how
- The basic configuration for data tracking are related to the latency and the delta in seconds between the latest time data was indexed in Splunk and now
- In addition, the volume Outliers feature allows detecting automatically behaviour changes in the volume of data indexed in Splunk for a given sourcetype
- In most cases, you should focus on the most valuable and important sourcetypes, TrackMe provides different levels of features (allowlists / blocklists) to exclude automatically data of low interest, and the priority feature allows granular definition of the importance of an entity
- A sourcetype that comes very occasionally in Splunk might be something that you need to track carefully, however if it does you need to define the tresholds accordlingy and TrackMe provides different options to do so on a per data source basis for instance

What is the purpose of the enable / disable button?
---------------------------------------------------

The purpose of the enable / disable button is to provide a way to disable the monitoring of an entity, without removing it from the collections entirely.

There are different aspects to consider:

- Sometimes you have some sourcetypes you do not care about really, you can use allowlisting / blocklisting, or disable it
- When an entity is disabled, the value of the field "data_monitored_state" is set to false (default is true when it is discovered initially)
- The UI by default filters on entities which are being monitored effectively, you can show disabled entities by using the "Filter monitored_state:" filter form, or looking at the lookup content manually
- Out of the box alerts do not take in consideration disabled entities
- Various other parts of the application will as well stop considering these disabled entities, for instance there will not be metrics generated anymore, etc.
- When an entity is disabled, all information are preserved, if you re-enable a disabled entity, TrackMe will simply start to consider it again and refresh its state and other actions automatically
- You should consider disabling entities rather than deleting entities if these are actively generating data to Splunk and cannot be excluded easily by allow listing / block listing
- The reason is that if you delete an active entity, in temporary deletion mode it will be re-added very quickly (when the trackers will capture activity for it), and permanent mode it would re-added after a certain period of time

What's the difference between disabled and (permanently) deleted?
-----------------------------------------------------------------

The deletion of entities is explained in details in :ref:`Deletion of entities`.

In short, the purpose of the permanent deletion is to prevent an entity from being disovered again after it is deleted.

To achieve this, when an entity is permanently deleted the value of the field "change_type" is defined to "delete permanent", when the entity is temporarily deleted, the value is set to "delete tempoary".

Then, Trackers reports wich perform discovery of the data use a filter to exclude entities that have been permanently deleted, such that even if the entity is still actively sending data to Splunk, TrackMe will ignore it automatically as long as the audit record is available. (by default audit records are purged after 90 days)

The UI does not provide a function to undo a permanent deletion, however updating or purging the audit record manually would allow to re-create an entity after it was permanently deleted.
