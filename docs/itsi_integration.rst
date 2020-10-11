Splunk ITSI and TrackMe integration
===================================

**If you are an ITSI customer, you can integrate trackMe concepts in ITSI and use the product capabilities to extend your monitoring.**

**Key information:**

- TrackMe generates metrics in the metric index which can directly be turned into KPIs in a KPI base search
- Dimensions are indexed within the metrics which describe the entity and provide the by statement keys required to compute the KPIs
- Additionally, if TrackMe is running on the same search header layer than ITSI, search time lookups can be used to enrich the entities
- Every time a tracker runs, TrackMe records the statuses as summary events in the TrackMe summary index, which are used by ITSI to track and detect changes in the entity statuses

Step 1: entity search and creation
----------------------------------

**Create an entity search to generate entities in ITSI:**

- If ITSI and TrackMe are running on the same search head layer, you can enrich the entities results with information from TrackMe such as the priority or the monitored stated
- You can include any kind of filter required, for example you might want to monitoring within ITSI only data sources, that are monitored and a medium or high priority.

*Example:*

::

    | mcatalog values(metric_name) as metrics where index=trackme_metrics metric_name=* object_category="data_source" by object_category, object
    | eval itsi_role = "trackme"
    | fields - metrics
    | eval itsi_entity = object_category . ":" . object
    | lookup trackme_data_source_monitoring object_category, data_name as object OUTPUT data_monitored_state as trackme_monitored_state, priority as trackme_priority
    | where trackme_monitored_state="enabled" AND (trackme_priority="medium" OR trackme_priority="high")

*Run this search in the search view in the ITSI space, then save it as a report and the export globally for ease of use in the future:*

.. image:: img/itsi_entities_start.png
   :alt: itsi_entities_start.png
   :align: center

.. image:: img/itsi_entities_start2.png
   :alt: itsi_entities_start2.png
   :align: center

.. image:: img/itsi_entities_start3.png
   :alt: itsi_entities_start3.png
   :align: center

Note: make sure to edit the permission of the report and shared at the global level

*Now, in ITSI Configure/Entities then Entities / new import from search, we will proceed to the entities creation and a recurrent job definition:*

::

    | savedsearch "TrackMe - Entities gen report"

*Make sure you select a time range that makes sense, TrackMe generate metrics potentially every 5 minutes but less frequent data sources might not appear if the time range is too short.*

.. image:: img/itsi_entities.png
   :alt: itsi_entities.png
   :align: center

**Click next and define the entities fields import:**

- **object_category:** import as Entity information field
- **object:** import as Entity Alias
- **itsi_entity:** import as Entity Title
- **itsi_role:** import as Entity information field
- **trackme_monitored_state:** import as Entity information field
- **trackme_priority:** import as Entity information field

.. image:: img/itsi_entities2.png
   :alt: itsi_entities2.png
   :align: center

**Click next to generate the entities, and setup a recurrent import job:**

.. image:: img/itsi_entities3.png
   :alt: itsi_entities3.png
   :align: center

.. image:: img/itsi_entities4.png
   :alt: itsi_entities4.png
   :align: center

Any new data source discovered and configured in TrackMe will be created in ITSI, and existing entities will be maintained automatically.

Step 2: create the KPI base search for metrics
----------------------------------------------

**The next step is to create a KPI base saarch that will turn the metrics into ITSI KPIs, within the KPI base search editor, create a new base search:**

.. image:: img/itsi_kpi1.png
   :alt: itsi_kpi1.png
   :align: center

**We will create a KPI base search handling the metric index, we use an adhoc search instead of the Metric Search type to allow one KPI base search to handle all of the metrics at once:**

*Ad-hoc search:*

::

    | mstats latest(trackme.eventcount_4h) as trackme.eventcount_4h, latest(trackme.lag_event_sec) as trackme.lag_event_sec, latest(trackme.lag_ingestion_sec) as trackme.lag_ingestion_sec where index=trackme_metrics by object_category, object

.. image:: img/itsi_kpi2.png
   :alt: itsi_kpi2.png
   :align: center

*Then add each metric as a new KPI: (see the last screen for the definition of the calculation and service level aggregation)*

.. image:: img/itsi_kpi3.png
   :alt: itsi_kpi3.png
   :align: center

.. image:: img/itsi_kpi4.png
   :alt: itsi_kpi4.png
   :align: center

Step 3: create the KPI base searches for summary statuses events
----------------------------------------------------------------

**TrackMe automatically generates statuses summary events every time trackers are executed.**

**These summary events can be used by ITSI to detect changes in the state of TrackMe entities and feed ITSI episodes:**

*Create three new KPI base searches:*

*data sources tracking*

::

   `trackme_idx` object_category="data_source" source="current_state_tracking:data_source" priority=*
   | eval {priority}_{current_state} = current_state

*data hosts tracking*

::

   `trackme_idx` object_category="data_host" source="current_state_tracking:data_host" priority=*
   | eval {priority}_{current_state} = current_state

*metric hosts tracking*

::

   `trackme_idx` object_category="metric_host" source="current_state_tracking:metric_host" priority=*
   | eval {priority}_{current_state} = current_state

.. image:: img/itsi_summary_events_kpi_data_source.png
   :alt: iitsi_summary_events_kpi_data_source.png
   :align: center

.. image:: img/itsi_summary_events_kpi_data_host.png
   :alt: iitsi_summary_events_kpi_data_host.png
   :align: center

.. image:: img/itsi_summary_events_kpi_metric_host.png
   :alt: iitsi_summary_events_kpi_metric_host.png
   :align: center

*Notes:*

- the technique ``{priority}_{current_state} = current_state`` allows you to track different levels of priorities easily without any conditional operations
- these examples above assume you monitor in ITSI only high priority entities, repeat these operations if you want to track other levels of priorities

Step 4: create a service that will be used for the service template definition
------------------------------------------------------------------------------

**This is optional and is part of your ITSI design choices, therefore using service templates provide centralization features and changes can be reflected to all linked services.**

**Now that the KPI base searches have been created, we will create a pseudo service for TrackMe that will be used as the source service for the service template creation:**

- Click on Configure / Service
- Create a new service that recycles our KPIs and filters

.. image:: img/itsi_service2.png
   :alt: itsi_service2.png
   :align: center

*Create a KPI manually based on the KPI base searches we created for each of the TrackMe metrics including the event based metric:*

*Note: there might be no results show in the mini charts during the service creation which can be ignored at this level*

.. image:: img/itsi_service3.png
   :alt: itsi_service3.png
   :align: center

.. image:: img/itsi_service4.png
   :alt: itsi_service4.png
   :align: center

*Create KPIs and tresholds for summary statuses events:*

*data sources tracking*

.. image:: img/itsi_service_kpi_data_source.png
   :alt: itsi_service_kpi_data_source.png
   :align: center

.. image:: img/itsi_service_kpi_threshold_data_source.png
   :alt: itsi_service_kpi_threshold_data_source.png
   :align: center

*data hosts tracking*

.. image:: img/itsi_service_kpi_data_host.png
   :alt: itsi_service_kpi_data_host.png
   :align: center

.. image:: img/itsi_service_kpi_threshold_data_host.png
   :alt: itsi_service_kpi_threshold_data_host.png
   :align: center

*metric hosts tracking*

.. image:: img/itsi_service_kpi_metric_host.png
   :alt: itsi_service_kpi_metric_host.png
   :align: center

*repeat the same threshold configuration*

**Finally, save but DO NOT activate the pseudo service, this service was required temporarily for the purposes of the service template creation in the next step:**

.. image:: img/itsi_service6.png
   :alt: itsi_service6.png
   :align: center

*Note: This pseudo service can optionally be deleted post service template creation, but you can as well keep it to allow future service creation based on this service rather using the service template feature.*

Step 5: create a service template
---------------------------------

**Now that we have a pseudo service, we can create a service template based on it, the service template would be used to create and link new services:**

- Click on Configure / Services Templates
- Use the previously created pseudo service to create a new service template
- Any future customization of this service template will be reflected to all linked services (which can be controlled when modifications on the template are made)

.. image:: img/itsi_service_template.png
   :alt: itsi_service_template.png
   :align: center

Final: Create services business and technical services using TrackMe KPIs
-------------------------------------------------------------------------

Finally, the ITSI integration is ready and you can create new services using the template service or manually cloning the pseudo service we created earlier.

**Once you created and activated a new service, ITSI will start to report TrackMe KPIs after a short moment: (metrics are generated every 5 minutes)**

.. image:: img/itsi_example1.png
   :alt: itsi_example1.png
   :align: center

.. image:: img/itsi_example2.png
   :alt: itsi_example2.png
   :align: center

.. image:: img/itsi_customer_example1.png
   :alt: itsi_customer_example1.png
   :align: center

.. image:: img/itsi_customer_example2.png
   :alt: itsi_customer_example2.png
   :align: center

.. image:: img/itsi_customer_example3.png
   :alt: itsi_customer_example3.png
   :align: center

.. image:: img/itsi_customer_example4.png
   :alt: itsi_customer_example4.png
   :align: center

.. image:: img/itsi_customer_example5.png
   :alt: itsi_customer_example5.png
   :align: center

**TrackMe acts now transparently as a companion of ITSI, you will continue to manage data sources in TrackMe, create Elastic sources, manage states and max lagging values which are reflected naturally in ITSI.**
