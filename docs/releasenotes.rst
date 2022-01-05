Release notes
#############

Version 2.0.0
=============

.. hint:: **Splunk 8.x and Python3 support only**

- HTML deprecation: migration of TrackMe to a full JS stack extension mode to handle the deprecation of HTML based user interfaces
- Dark theme: TrackMe moves to a full dark theme based user interface
- License model changed to TrackMe EULA
- Introducing the Hybrid Trackers component and Splunk remote search, allowing you to easily track data based on any number of custom models, and to remotely track data at scale for any number of Splunk remote deployments
- Introducing the job executors, which handle all tracking jobs in TrackMe in a controlled and monitored fashion, from the regular OOTB trackers to the Elastic Sources and Data sampling
- Introducing the TrackMe components management, allowing to enable / disable TrackMe single components (Data Sources tracking, Data Hosts tracking, Metric hosts tracking) at the application level in a single click, disabling the component from the UI and its associated search workload
- Introducing the hours range monitoring, allowing for each single entity to specify hours ranges when monitoring rules are applied for granular monitoring in addition with the week days monitoring
- Introducing auto-diagnostic, an automated analysis and remediation concept for TrackMe main components configuration
- Various bug fixes and UI improvements
- Long term logic issues handling for data sources and data hosts

Version 1.2.58
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Fix Issue #379 - urllib3 insecure error messages from custom endpoint when interracting with splunkd
- Fix Issue #378 - backup and restore generate POST related warning messages
- Fix Issue #377 - Typos in sample instructions in backup and restore user interface
- Fix Issue #364 - The long term tracker can impact some data sources unexpectly in some specific conditions

Version 1.2.57
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Fix Issue #375 - restore fails due to max document per batch API limit reached
- Fix Issue #371 - typo in Data sampling error messages
- Fix Issue #374 - missing shortcut to trackme_data_source_monitoring_blacklist_data_name in the nav menu

Version 1.2.56
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Fix Issue #372 - Non existing id section in app.conf was reported to cause trouble to Splunk Cloud internal automation

Version 1.2.55
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Feature: Provides a new split by custom mode to allow defining a custom indexed field in the data source discovery and maintenance workflow
- Feature: Notification bar and various UI improvements in the configuration UI

Version 1.2.54
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Fix - Issue #368 - Disable the KVstore to indexers replication for the kv_trackme_objects_summary collection

Version 1.2.53
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Fix - Issue #362 - Windows based deployment reports ERROR JSON reply had no "payload" value in rest calls

Version 1.2.52
==============

.. hint:: **Splunk 8.x and Python3 support only**

    - Starting from this release, only Splunk 8.x and Python3 are supported
    - Some functions such as builtin alert actions are not compatible any longer with Python2 and Splunk 7.x
    - For the latest version available for Splunk 7.x, see the release 1.2.51

- Enhancement - Issue #360 - JQuery upgrade for Simple XML dashboards
- Enhancement - migration to ucc-gen for the librairies management and the app generation
- Change - Python2 and Splunk 7.x support is dropped starting from this release, TrackMe now only supports Splunk 8.x and Python3

Version 1.2.51
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix - Issue #356 - trackme.py endpoint check can be circumvented to perform REST calls to endpoints external to TrackMe
- Fix - Issue #357 - In Splunk Cloud the UI manage and configure will not provide the right URL for quick access to the macro definition

Version 1.2.50
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix - Issue #352 - Splunk 8.2 regression in data sampling engine causes only 1 event to be stored in the sampling KVstore post execution due stats first(*) change in behaviour

Version 1.2.49
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Fix Issue #343 - REST CALL - use nobody context to optimize rest calls performance in large scale environments

Version 1.2.48
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Issue #335 - addresses memory overhead of the metric trackers using span=1s by default
- Fix - Issue #336 - Fix - SmartStatus - future tolerance macro is not taken into account by the endpoint
- Fix - Issue #333 - Nav - Wrong search for metric hosts allow list collection
- Fix - Issue #337 - Data sources - Short term tracker run via the UI should use latest=+4h, long term tracker should match savedsearch earliest=-24h latest=-4h
- Fix - Issue #338 - Splunk 8.2 regression in rootUri for UI TrackMe manage drilldowns to macro due to a root URL change in manager
- Fix - Issue #339 - Data sources - Data source overview chart tab should honor the trackme_tstats_main_filter macro
- Change - Nav - remaining whitelist and blocklists terms

Version 1.2.47
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix - Issue #328 - Data host - Regex based block lists are not honored as documented
- Fix - Issue #329 - Data host - Splunk 8.2 regression with multivalue aggregation caused by a change in behaviour
- Change: Update splunktaucclib to 4.2.0
- Change: Update splunktalib to 1.2.1

Version 1.2.46
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Issue #327 - Smart Status - Add search history quick access button in Smart Status screens
- Fix - Issue #324 - Lagging classes - lagging classes applying at the same level (all/data_source/data_host) for different types of objects and the same name are not honoured properly due to a logic default in the lookup mapping

Version 1.2.45
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #312 - Migration from Addon Builder based libs to Splunk Addon factory UCC based libs
- Feature - Issue #316 - Provides day time filtering options when creating custom alerts

Version 1.2.44
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix Issue #310 - Alert actions - Dropdown object in Smart Status tab rendering errors

Version 1.2.43
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix Issue #308 - Alert actions - extraction failure for Smart Status in the UI for rendering purposes

Version 1.2.42
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #306 - Alert actions - UI enhancements
- Fix - Issue #305 - Custom alerts - created alerts should set alert.digest_mode

Version 1.2.41
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #300 - TrackMe now comes builtin with alert actions enabled by default on out of the box alerts, these actions perform auto acknowledgement, call and index the Smart Status result, the third action is a free style action that call any of the TrackMe REST API endpoints
- Change: Normalize the suppress fields for all alerts to use the object/object_category TrackMe naming convention
- Fix - Issue #293 - Splunk telemetry causes DateParserVerbose Warnings logged
- Fix - Issue #299 - Data Sampling - In some circumstances, the custom rule editor might fail to render events
- Fix - Issue #301 - Smart Status - the REST handler should call the eval state status macro in case it is called before the KVstore is updated
- Fix - Issue #302 - REST endpoints - Ack - wrong audit event logged
- Fix - Issue #303 - REST endpoints - Backup and Restore - the purge operation purges the archive but not the KVstore record

Version 1.2.40
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Issue #297 - Performances - Long term tracker improvements

Version 1.2.39
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #292 - Alerts - New screen for alerts management in TrackMe, review, edit and add alerts within the UI
- Enhancement - Issue #295 - Long term trackers performance - Major reduction of the long term trackers runtime by better taking into account the existing short term entities knowledge
- Enhancement - Issue #290 - Alerts - OOTB alert TrackMe - Alert on data source availability should suppress on data_name only
- Fix - Issue #291 - REST endpoint - the endpoint mh_update_priority does not preserve the monitored_state
- Fix - Issue #294 - Data hosts - Long term tracker filter error causes the long term to miss entities indexing lately

Version 1.2.38
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix - Issue #287 - Since version 1.2.37 most of interractions in the UI are made via TrackMe rest endpoints, however the capability list_settings is required for non privileged users and should be added to the trackme_admin role

Version 1.2.37
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Issue #279 - Decomission of the getlistdef custom command in favor of a simpler and cleaner pure SPL approach
- Enhancement - Issue #280 - Add new REST endpoint to manage logical group associations
- Enhancement - Issue #285 - Flipping statuses workflow improvements
- Change - Issue #275 - permissions - provides a builtin trackme_user role to handle the minimal non admin access for TrackMe
- Change - Issue #276 - User Interface - Migration of Ajax javascript REST calls made within the UI from splunkd to TrackMe based API endpoints
- Change - Issue #278 - Upgrade of splunklib Python SDK to latest release 1.6.15
- Fix - Issue #273 - User Interfaces - Several searches should not kick off start at TrackMe main UI loading time
- Fix - Issue #274 - Data Sources - tags dropdown can render unwanted results when no tags are defined
- Fix - Issue #277 - REST endpoint - the endpoint ds_update_min_dcount_host should allow any as the input

Version 1.2.36
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #266 - ID cards - Wildcard matching for ID cards allowing matching any number of entities for the same card using wildcards and your naming conventions
- Enhancement - Issue #268 - Backup and Restore - Perform an additional get call in the Backup operation to automically discover any missing backup files
- Fix - Issue #267 - Backup and Restore - Python2 compatibility issues with Splunk 7.x
- Fix - Issue #261 - SLA - SLA reporting should honour allow/block list and not monitored entities #261
- Fix - Issue #266 - ID cards - Updating an existing card within the UI removes other associations with the card that is updated
- Fix - Issue #270 - REST endpoint resources groups wrong exposure for Splunk Web proxied behaviors

Version 1.2.35
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #249 - CRIBL native integration - TrackMe can now be configured to be transparently reliying on the Cribl pipeline concept to discover and track data sources based on the cirbl_pipe to provide an easy and performing integration
- Feature - Issue #250 - new blocklisting capabilities based on the data_name for data sources
- Feature - Issue #254 - Data Sampling - The new Data Sampling obfuscation mode allows preventing unwanted data accesses to the collection by obfuscating samples at the processing step instead of storing samples within the KVstore collection
- Feature - Issue #253 - Splunk Infrastructure Monitoring, Splunk instances are now monitored automatically in the data hosts tracking via the splunkd sourcetype, this behaviour can be enabled/disabled on demand via the configuration UI
- Feature - Issue #260 - REST API endpoints - new endpoints for identity cards management
- Enhancement - Issue #251 - Reset collections should better run short term trackers rather than long term trackers for data sources and hosts when resetting
- Enhancement - Issue #257 - Allow listing - provides explicit expression addition capabilities with wildcard support
- Enhancement - Issue #258 - Metric hosts - adds the _metrics in hosts and metrics discovery
- Enhancement - Issue #259 - Lagging performances tab - Improve rendering and analytics
- Enhancement - Issue #263 - Default priority taken into account by OOTB alerts should rather filter for high priority by default (macro: trackme_alerts_priority)
- Fix - Issue #245 - SLA & QOS - Inconsistency in the calculations using stats range function, replaced with a streamstats based approach for accurate calculations
- Fix - Issue #246 - Data sources - misleading status message for data sources ingesting data in the future due to bad TZ
- Fix - Issue #256 - host blocking list based on regex does not work properly
- Fix - Issue #261 - SLA reporting should honour allow and block lists for each category

Version 1.2.34
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Issue #241 - KVstore backup and restore - Improved workflow with Metadata recording of backup archives, new dashboard providing insights on the workflow and its features
- Fix - Issues #242 - UI - interfaces like lagging classes, allow and block listing should not remove the search input form if there are no results found

Version 1.2.33
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix - Appinspect failures due to CSV lookup files not referenced as lookups (non Cloud failure)

Version 1.2.32
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Enhancement - Issue #230 - data host over time and single search performance improvements
- Enhancement - Issue #222 - Automatically Backup Main KV Store collections, provide endpoints for backup and restore operations
- Enhancement - Issue #232 - REST API and tooling - Provide a new app nav menu and a new dashboard to demonstrate the REST API endpoints and the usage of the trackme API in SPL commands
- Fix - Issue #231 - UI - reduce the max number of entries in the tag policies screen (goes beyond the modal limitation)
- Fix - Issue #233 - Smart Status - orange state due to week days monitoring is not properly handled
- Fix - Issue #235 - Data sources - Week days monitoring rules are not honoured if triggering due to dcount host
- Fix - Issue #236 - Data sources - status message is inaccurate if data source is in data sampling alert but week days monitoring rules are not met

Version 1.2.31
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Introducing the trackme REST API wrapper SPL command, allows interracting with the TrackMe REST API endpoints within SPL queries!
- Feature: Introducing the smart status REST API endpoints, performs advanced status correlations and investigations easily and automatically, within the UI, as part of an alert action or within your third party automation!
- Feature: REST API endpoint for Data Sampling - allow reset and run sampling
- Feature: UI - Issue #223 - multiselect form enhancement with auto disablement of the ALL choice when selecting at least one entry in the multiselect
- Feature: Identity cards - Issue #226 - allow defining a global default identity card associated with all data sources (per data source identity cards can still be created and take precedence over the global card)
- Feature: Elastic Sources - Issue #227 - allow deletion of both dedicated and shared sources in the UI via the new REST framework, deletion automatically performs the deletion of related objects (KVstore contents, report, etc)
- Fix - Issue #217 - Activity alerts view results link would result to 404 page not found for out of the box alerts
- Fix - Issue #218 - Data sampling - creating custom rule from the main screen, then clicking on back button leads to wrong window
- Fix - Issue #219 - Outliers detection - dropdown for alert on upper is not pre-filled with the actual setting of the entity
- Fix - Issue #220 - Audit scheduling - in some environments, status="success" is replaced at search time by status="completed" (internal scheduler) which is not expected by the searches
- Fix - Issue #221 - Data sources - Tags are not preserved following actions in the UI
- Fix - Issue #224 - Outliers - Switching an entity between different periods may lead the outliers generation to be failing
- Fix - Issue #225 - Outliers - Data hosts outliers configuration update within the UI causes an entity refresh which does not generate flipping statuses events as expected
- Fix - Issue #228 - REST API - Endpoints should honour the user context while logging the action in the audit log collection
- Change: Icons change

Version 1.2.30
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature - Issue #210 - new REST API endpoints for Elastic Sources / Logical Groups / Data Sampling / Tags Policies / Lagging Classes / Lagging Classes Metrics
- Feature - Issue #212 - Data sampling - Allows defining exclusive rules for data sampling custom models, this can be used when a regex must not be matched, such as detecting PII data automatically
- Feature - Issue #214 - Data sampling - Allows defining a custom number of records to be sampled on a per data source basis
- Feature - Issue #215 - Data Hosts - Support for priority based lagging classes
- Fix - Data sampling - Clear state and run sampling action would fail if actioned on a data source which data sampling has not run yet at least once, fixes and UI improvements for Data sampling
- Change - Issue #213 - knowledge objects default permissions - Review of the app related KVstores default permissions, fixing missing collections and transforms

Version 1.2.29
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature Issue #205 - Introducing TrackMe REST API endpoints for automation integration and future UI evolutions (https://trackme.readthedocs.io/en/latest/rest_api_reference.html)
- Feature Issue #209 - Feature - Provides a new mode for data sources to allow by index level analysis
- Fix Issue #208 - Fix - creating a rest based search causes regression in the data sampling and event recognition engine

Version 1.2.28
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature Issue #201 - Elastic Sources - Support for lookup tracking with from commands
- Feature Issue #202 - Elastic Sources - Support for remote searches using rest
- Fix Issue #203 - Provides a macro based definition for first level span of Metrics trackers
- Change: Upgrade of splunklib Python SDK to latest release 1.6.14

Version 1.2.27
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

*Major improvements in data host monitoring capabilities:*

- Feature: Data hosts - monitoring workflow improvement with alerting policy, monitor hosts with sourcetype level granularity at scale
- Feature: Lagging classes - policies can now be defined against the priority (data sources only), in addition policies can be set for all objects, data sources or hosts only
- Feature: Better management of allow lists / blocking lists for data hosts monitoring
- Feature: Data hosts and metric hosts rendering improvements in multi-value field structure with state rendered as emoji icons for better readability
- Change: Data hosts monitoring uses same default lagging than data sources (3600 sec)

*Data sources changes:*

- Feature: Issue #196 Data sources - Provides distinct count threshold capabilities to turn a data source red if the number of hosts goes below a static threshold, provides chart visibility in Overview screen of the data source

*Others:*

- Fix: Issue #193 - data hosts - the refresh button does not refresh the host screen header (priority, etc) #193
- Fix: Issue #198 - Elastic Sources - When creating a from based source, if there are no additional search constraints after the data model name, no results will be returned
- Fix: Issue #199 - Data sampling - some builtin rules are too restrictive regarding multiple spaces
- Change: Increase max height for timeline chart in Status message tab (current max height might be too low when multiple statuses)

Version 1.2.26
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Issue #186 - Data sampling - during the creation of a custom rule, its scope can now be restricted to a list of specific sourcetypes to dedicate custom rules and avoid rules overlapping issues
- Feature: Issue #188 - SLA calculation migration from flipping statuses events to current statuses events for reliable results / SLA dashboard improvements / Drilldown from SLA single percentage in TrackMe main UI to SLA dashboard
- Feature: Issue #190 - UI improvements - provide quick access to data sampling custom rules in the main data sources tab, unify trackers manual run for data sources and hosts in a single button and window
- Feature: Issue #191 - UI improvements - Load spinner at TrackMe loading stage, Spinner design refresh globally in TrackMe

Version 1.2.25
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Issue #181 - Disable data sampling on demande via the UI #181
- Fix: Issue #180 - Outliers detection impacts offline data such as low frequency batched data sources #180
- Fix: Issue #182 - Data sampling - Manual run, Clear state and run sampling UI period constraint is too short for cold data sources #182
- FIx: Issue #183 - Data Sampling - number of entities to process calculation can lead to no entities being processes #183

Version 1.2.24
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Issue #153 - For ITSI and timeline integration purposes, generate and store last states information as summary events #153
- Feature: Issue #141 - Enhancement - ability to search for hosts in Data Hosts Tracking by Logical Group Name #141
- Feature: Issue #148 - Enhancement: Allow 'NOT' filter for Keyword filter name: #148
- Feature: Issue #166 - Enhancement - Provides a UI feature to allow reseting the list of metrics known for a given metric host
- Feature: Issue #174 - Enhancement - Adding the timeline viz view in the status tabs #174
- Fix: Issue #147 / Issue #161 Outliers management and configuration - fixes and improvements
- Fix: Issue #167 - Issue - Pressing "Manage: manual tags" displays dialog with ALL tags in "List of current tags for this data source" field #167
- Fix: Issue #170 - install_source_checksum should not be in app.conf (appinspect warning) #170

Version 1.2.23
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix: Exclusion of metrics generated by TrackMe itself would exclude other metrics generated on the same search head
- Fix: Issue #151 - error handling does not catch a failure during the creation of a new elastic source #151
- Fix: Issue #154 - Splunk Cloud vetting - capability in role will not be be granted #154
- Fix: Issue #155 - Splunk Cloud - In some specific contexts, Elastic source dedicated tracker creation fails #155

Version 1.2.22
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Extending the Tags features with tags policies, this feature provides a workflow to automatically define tags using regular expressions rules matching the data_name value and its naming convention
- Feature: Improved views for Ops queues (renamed to Ops: Queues center) and Ops parsing, multi hosts selector, improved analytics
- Fix: Issue #131 - The enable data source action does not preserve the current value of data_lag_alert_kpis in the collection, which ends as a null value
- Fix: Issue #138 - Typo in the metrics screen, Metrics categories was mispelled
- Fix: Issue #139 - TrackMe metrics should be excluded out of the box from the metrics tracking
- Fix: Issue #142 - Disabing Acknowledment is broken due to the add comment feature introduction
- Fix: Issue #144 - Ack disable should use the comment for update if any #144
- Change: Include the priority value when generating the flipping status summary events
- Change: Do not load the raw_sample field when during the execution of data sources tracker execution for optimization purposes

Version 1.2.21
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Introducing a new very hot feature! Data sampling and event format recognition is a new workflow that allows monitoring the event formats behaviour by processing automated sampling of the data sources and monitoring their behaviour over time, builtin rules are provided and can be extended with custom rules to handle any custom data format
- Feature: Introducing the new tags capability, you can now add tags to data sources, tags are keywords which can be set per data source to provide new filtering capabilities
- Fix: When using a custom Splunk URI path (root_endpoint in web.conf), internal calls to splunkd made the UI can fail if splunkd does not accept the root context and only accepts the custom root context
- Fix: When creating new dedicated elastic sources, if the search result name exceeds 100 characters, this results in a silent failure to create the new source 
- Fix: Shorten default naming convention used for new Elastic Sources tracker names
- Fix: Limitation of the list function used in stats limits the number for Elastic shared data sources to 99 sources maximum, fixed by alternative improved syntax
- Fix: For Elastic shared sources, if the first source is a raw search, the addition of the "search" key word in the first pipeline fails under some conditions
- Change: Automatically join the acknowledgement comment in the acknowledgement screen
- Change: Time to live definition for scheduled reports (dispatch.ttl) to reduce overhead in the dispatch directory
- Change: Automatically affect a 1 minute time window when creating Elastic dedicated trackers

Version 1.2.20
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix: getlistdef.py custom command fails with a Python decode error if running in a Python3 only instance
- Fix: Allowlist / Blacklist and similar deletion checkbox may fail to refresh the window content properly upon record(s) deletion
- Change: UI rendering improvements
- Fix: For metric hosts, logical group mapping generates false positive status flipping events, blue hosts should not appear in single count of hosts in alert, refresh button should respect the current blue status 
- Fix: For data hosts, logical group mapping (blue hosts) should not appear in single count of hosts in alert, refresh button should respect the current blue status

Version 1.2.19
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Feature: Improved rendering of the ingestion lag and event lag metrics for data sources and hosts modal windows (new single for event lag, automatically converted to a duration format)
- Feature: over KPI alerting option, this new feature allows for data sources and data hosts entities to choose which KPI to be alerting against, between all KPIS, lag ingestion KPI only or lag event KPI only.
- Feature: Improved look and feel of modal windows with a header color scheme based on the action performed
- Fix: In table checkbox CSS code fix to get square shape instead of a rectangle
- Fix: In auto lagging definition modal windows, the current modal window should be hidden automatically when the action is executed
- Fix: Minor fix of input forms spacing in the main UI related to the keyword search text input box
- Fix: Alignment of header separator issues with Firefox for the main modal Windows
- Change: Remove data_index and data_sourcetype in the table output for data sources as the data_name field itself summarises these information

Version 1.2.18
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix: Builtin alerts should do not honour index allowlisting (for entities created before allowlists were configured)
- Change: In support with the elimination of long term used negative words in IT, whitelist and blacklist concepts are replaced with allowlist and blocklist concepts
- Fix/Feature: UI improvement with a checkbox in table approach to provide deletion capabilities on the different screens such as allowlist and blocklist, in some circumstances the drilldown approach was causing trouble with unexpected closure of the modal window
- Fix: Outliers generation with mstats and the append=true mode fails in some distributed architecture, the single schedule report is replaced with a scheduled per potential period configured for entities, in a high performing fashion and capable of dealing with any number of entities
- Fix: Active links such as opening in a search a data source might get broken in some environments when using a custom Splunk URI path (root_endpoint in web.conf)

Version 1.2.17
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: Outliers detection framework issues (some parameters are not properly honoured due to regressions in prior versions)
- Fix: When modifying outliers configuration on Elastic sources, entities could be temporary stated in red state due to entity refresh started as a background action, while for Elastic searches the combo index/sourcetype might not refer to real values depending on their configuration
- Fix: Outliers simulation under some circumstances can show discrepancy in results regarding results which would be calculated once applied
- Feature: Improved refresh capabilities for data sources and automatically define the best suitable search depending on the type of the data source (standard, shared or dedicated Elastic source)

Version 1.2.16
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Feature: New tab for data sources and hosts exposing recorded metrics in the metric index for ingestion lag and event lag performances
- Feature: Provides metric host search capabilities with msearch button when clicking on a host metric (Splunk 8.x required), which is used as well for Elastic mstats sources
- Feature: Improved readability of high lagging seconds records by using duration formatting rendering automatically
- Fix: Flipping state detection failure for Elastic shared and dedicated sources due to regression introduced in trackMe 1.2.13
- Fix: Outliers table view might seem truncated with high volume sources, improve rendering by using thousands and millions units for high volume sources
- Fix: Outliers detection framework issues rendering current outliers accordingly to the outliers configuration for that entity
- Fix: Outliers detection framework issues generating metrics for some periods and failing to render the expected results
- Fix: Under some specific conditions, blacklist sub-searches at the tstats / mstats first pipeline levels end in error and generated high skipped scheduled rate, the root searches now use the same technique than whitelisting
- Fix: For metric host monitoring, off line hosts are constantly generating flipping status detection while this should happen once and be properly preserved over iterations
- Fix: UI does not honour search parameters and constraints for Elastic sources when clicking on the search button in modal windows

Version 1.2.15
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: error in metric hosts rendering results which are not exposing the full list of metrics per entity in the UI

Version 1.2.14
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: error in metric hosts rendering results which are duplicated in the UI after their expansion

Version 1.2.13
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: Flipping status detection should exclude the short term trackers time range for data sources and hosts
- Fix: Avoids conflicts between data handled in the short term and long term data trackers, by restricting the long term scope out of the short term scope in a improved fashion
- Fix: Long term data trackers calls via the UI should respect the same earliest and latest definition than the scheduler does
- Feature: Enhanced modal window for auto lagging definition for data sources and hosts

Version 1.2.12
==============

- unpublished

Version 1.2.11
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Feature: New data parsing quality tab, flipping status tab and audit changes tab per entity when applicable to provide quick and fast visibility on a per entity level
- Feature: Design improvements for the status message tab in modal windows which appears now with a new color scheme
- Feature: Provides Outliers span definition capability, the span value to be used for outliers rendering purposes can now be customised per entity
- Feature: Automatically handle metrics re-generation when an entity outliers period calculation is changed
- Feature: Acknowledge icon scheme when Ack is active, improve Ack workflow
- Fix Issue #96: "click save", but there is no "save"
- Fix: SLA single calculation can show 0% if there are no previous records in audit flipping status and status has changed to non green
- Fix: Remove useless stats call in metric report savedsearch which impacts its performance
- Change: Provides and call a macro per builtin alert to allow customisation of the fields order in the alert results
- Change: Add app.manifest from packaging toolkit to ease dependencies and target workloads deployment

Version 1.2.10
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Feature: Improved flipping statuses detection workflow, with immediate detection and deprecation of the dedicated flipping statuses tracker and associated collections
- Feature: UI improvements with change to multiselect form input for most of the selectors
- Fix: Flipping statuses table in main UI is not ordered by latest events
- Fix: Error in Elastic source simulation UI, in some conditions, a wrong data_name appears in the table which incorrectly claims that the data source already exists
- Fix: Elastic sources do not honour data_index and data_sourcetype definition, this does not impact the reliability of the results but this impacts sources visibility in the UI when using whitelists / blacklists
- Fix: For data hosts, several information are not properly preserved over tracker iterations, such a custom outliers configuration
- Fix: For data hosts, outlier event count record is not properly aggregated and is summed continuously over time rather a 4 hours event count recording
- Fix: Per entity refresh when outlier modification is saved should run over 4 hours period, and should filter results on the selected entity only
- Fix: UI input selectors for metric hosts should not show content for non whitelisted indexes if whitelists are being used
- Fix: Clean up of various objects which were deprecated in V1.2.x

Version 1.2.9
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: mcollect syntax compatibility issues with Splunk 7.2.x/7.3.x
- Fix: status_message fields shows N/A for translated last lagging value for data objects, and does not show up for metric objects
- Fix: switch from latest to max for outliers over time calculation, graphical rendering side effects introduced in 1.2.8 with mcollect switch

Version 1.2.8
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Feature: Design and performances major improvements in the outlier detection workflow with metric based index and mcollect approach, to proper handle any high scale environments
- Feature: Major improvements in UI performance and stability, specially designed and qualified for very high scale environments and a high numbers of entities
- Feature: flipping status collection switches from KVstore based to summary index based for better performances and design at high scale
- Feature: improved workflow for SLA management and calculation based on the summary data
- Fix: Version 1.2.x introduced failures in the management of metric hosts, where detection of entirely inactive entities was not behaving as required
- Fix: hard coded metric index name in the trackme_summary_investigator_mstats macro

Version 1.2.7
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Feature: Design and performances major improvements in the outlier detection workflow with metric based index and mcollect approach, to proper handle any high scale environments
- Feature: Major improvements in UI performance and stability, specially designed and qualified for very high scale environments and a high numbers of entities
- Feature: flipping status collection switches from KVstore based to summary index based for better performances and design at high scale
- Feature: improved workflow for SLA management and calculation based on the summary data
- Fix: Version 1.2.x introduced failures in the management of metric hosts, where detection of entirely inactive entities was not behaving as required

Version 1.2.5
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Fix: conflict with Enterprise Security due to the tstats macro defined in TrackMe when co-located, macro renamed to avoid this issue
- Fix: cancel button in Elastic sources main modal, review help content

Version 1.2.4
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Fix: Remove useless lookup call in the data hosts view which impacts search time performance in large scale environments

Version 1.2.3
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Feature: Allows running the tracker directly after the Elastic source creation within the modal creation window (feature introduced in version 1.2.0)

Version 1.2.2
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Feature: TrackMe goes with a touch of Machine Learning! Automatically detect outliers in the event distribution based on the summary investigator, a new internal workflow that records and detects a suspicious decrease of events over time based in the outliers detection method.
- Feature: Improved UI, Donuts charts completing the exposing of statuses, multi tabs in modal windows to navigate through the views, new outliers detection view, new message status view.
- Feature: Elastic tracker concept introduction, create and manage any kind of virtual data sources depending on your needs and requirements using any of the main Splunk search commands available (raw, tstats, from, mstats).
- Fix: collections monitoring are limited to 50K entries #80
- Fix: Modification of objects via the UI do not preserve some fields during KVstore update #81
- Change: fix app.py to avoid Readiness App warning, update Splunk Python SDK splunklib to very last version
- Fix: red donut chart error in metric hosts, rounding not effective of ingestion lag, donut red other priority serie appears in orange (v1.2.0 introduced)

Version 1.2.1
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Feature: TrackMe goes with a touch of Machine Learning! Automatically detect outliers in the event distribution based on the summary investigator, a new internal workflow that records and detects a suspicious decrease of events over time based in the outliers detection method.
- Feature: Improved UI, Donuts charts completing the exposing of statuses, multi tabs in modal windows to navigate through the views, new outliers detection view, new message status view.
- Feature: Elastic tracker concept introduction, create and manage any kind of virtual data sources depending on your needs and requirements using any of the main Splunk search commands available (raw, tstats, from, mstats).
- Fix: collections monitoring are limited to 50K entries #80
- Fix: Modification of objects via the UI do not preserve some fields during KVstore update #81
- Change: fix app.py to avoid Readiness App warning, update Splunk Python SDK splunklib to very last version
- Fix: red donut chart error in metric hosts, rounding not effective of ingestion lag (v1.2.0 introduced)

Version 1.2.0
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x requires the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Feature: TrackMe goes with a touch of Machine Learning! Automatically detect outliers in the event distribution based on the summary investigator, a new internal workflow that records and detects a suspicious decrease of events over time based in the outliers detection method.
- Feature: Improved UI, Donuts charts completing the exposing of statuses, multi tabs in modal windows to navigate through the views, new outliers detection view, new message status view.
- Feature: Elastic tracker concept introduction, create and manage any kind of virtual data sources depending on your needs and requirements using any of the main Splunk search commands available (raw, tstats, from, mstats).
- Fix: collections monitoring are limited to 50K entries #80
- Fix: Modification of objects via the UI do not preserve some fields during KVstore update #81
- Change: fix app.py to avoid Readiness App warning, update Splunk Python SDK splunklib to very last version

Version 1.1.16
==============

- change: Decommission of the two auto mode tracker reports, these searches were designed to automatically define a potential value for the week days monitoring, therefore the searches can have a potential cost in term of resources without providing a key value justifying it.

Version 1.1.15
==============

- feature: Introducing the maintenance mode feature, which allows to enable / schedule / disable the maintenance mode to silence all alerts during a scheduled maintenance window
- fix: Refresh buttons should refresh header main information for the entities too

Version 1.1.14
==============

- unpublished

Version 1.1.13
==============

- feature: Introducing inter-updates automatic refresh, operations that involve updates (modification of the max lag, etc) now dynamically refresh the entity drilldown view and related tokens, which prevents and automatically fixes conflicts during entity updates within the UI.
- feature: Introducing on demand auto determination of entity max lagging for data sources and hosts, based on either the percentile 95 or average lagging observed for that entity
- fix: minor fixes and code improvements

Version 1.1.12
==============

- fix: SLA calculation is incorrect, this release fixes and improves the SLA calculation logic
- feature: Monitoring state auto disablement, provides a customizable macro logic that automatically disables the monitoring state of a data source, data host or metric host that has not actively sent data to Splunk since a given amount of days, by default 45 days

Version 1.1.11
==============

- feature: Enrichment tags is a new feature available for data and metric hosts which allows you to provide automatic access to your assets context within TrackMe (Enterprise Security assets, custom CMDB data, etc)
- feature: Provides update comment capabilities for acknowledgments

Version 1.1.10
==============

- fix: TrackMe admin members that are not admin cannot access to the audit collection content due to missing role statement in Metadata
- change: Change priority color code scheme to avoid confusion with object statuses

Version 1.1.9
=============

- fix: Prevents data source identity card note failing if note contains double quotes (leads the underneath Splunk search adding to the collection to fail)
- fix: Reduce the maximal number of tables count in logical group show group table modal window, to avoid large number of groups hidden next pages
- fix: Refresh in modal window does not refresh SLA single forms

Version 1.1.8
=============

- fix: SLA incorrect calculation, improvements and corrections in calculating the percentage of time spent in green/blue mode
- feature: Implement time based approach for SLA calculation restriction, provides time range picker in QOS dashboard

Version 1.1.7
=============

- fix: Blacklist modal windows might under some resolution not be entirely visible, reduce height and max count table
- fix: Acknowledgment expiration is not honoured properly

Version 1.1.6
=============

- feature: Introducing the SLA compliance reporting dashboard and features, providing analytic over the level of compliance based on the time objects have spent in red state (flipping mode detection)
- feature: Allows entering an update note for logging and notification purposes when a modification a KVstore entry is made via the UI
- feature: Regular expression support for data sources and host blacklisting entries
- feature: Pretty parse and print json objects in audit changes
- feature: Provides index and host blacklisting features for metric hosts monitoring
- feature: New tracker "TrackMe - Audit change notification tracker" which is due to be used for dedicated team work for updates notification (Slack...)
- change: Increase default retention for flipping states KVstore collection from 3 months to 6 months
- fix: Provides KVstore entry modification window for entity deletion to allow note update
- fix: Blue state icon will not show up in flipping status tab
- fix: Improvements in initial discovery detection for flipping status and SLA calculation purposes

Version 1.1.5
=============

- fix: Previously added data sources or hosts can under some conditions appear with no state icon if status remained red and added in the collections before collecting last data ingestion statistics

Version 1.1.4 (unpublished)
===========================

- fix: Previously added data sources or hosts can under some conditions appear with no state icon if status remained red and added in the collections before collecting last data ingestion statistics

Version 1.1.3
=============

- feature: Creation of an additional blue status, used for data hosts and metric hosts managed in a logical group when logical group monitoring conditions are met but entity is not green
- fix: Improved dynamic icon messages (reference the current latency when state is red)
- change: Increased default tolerance for data indexed in the future detection macro
- change: limit embedded charts searches overhead for data sources (do not split by host which limits accuracy but slightly improves searches performance in large environments)

Version 1.1.2
=============

- fix: Under some circumstances, the last flipping status and date fail to be properly updated in the collections due to a weakness in the merging process
- fix: data_source modal window embedded chart should split by host in a first pipeline level for better lagging calculation accuracy
- fix: modal window embedded chart searches should refer to the tstats macro for consistency
- feature: Add audit view for KVstore collections

Version 1.1.1
=============

- fix: Long term trackers should use latest time in the future too
- fix: New trackme_data_host_rule_filter macro does not show up properly in manage UI

Version 1.1.0
==============

- feature: Better lagging management handling by storing and comparing both event based lagging and ingestion based lagging for multi-factor status definition
- feature: Detection of data indexed in the future, data sources or hosts indexing in the future appear as orange state with a dynamic icon message
- feature: Alert acknowledgment improvements, allows selecting an extended period for acknowledgment
- feature: Provides by default a collection based search rather than a Meta search based approach (dropdown selector in UI) for better performances on large deployments
- feature: Store first time seen and eventcount base for further use
- feature: Provides a rex based filter and length condition to avoid taking incorrect hosts in consideration
- change: Refresh default is now defined to 5 min instead of 1 min by default
- fix: Ensure results coherence with various lookup command calls used for enrichment purposes where never more than one match should be achieved
- fix: Various fixes

Version 1.0.39
==============

- fix: minor audit changes logging improvements for metric SLA policies edition

Version 1.0.38
==============

- fix: Error in TrackMe Mobile dashboard for summary not green statuses for metric hosts (count not green counts green metrics)

Version 1.0.37
==============

- feature: Introducing the logical group concept which allows grouping data hosts and metric hosts in groups of clusters to manage use cases such as active / passive appliances which passive members do not actively generate data
- feature: Icon message are now dynamics and provide inline information describing the reason of the status
- feature: Collection navigation menu to expose quick access to raw KVstore collections content
- fix: Bad modal cancel action for week days (detailed per day selection) for data host monitoring

Version 1.0.36
==============

- feature: Introducing the active alert acknowledgement feature, provides a framework to acknowledge an active alert which will inhibits generating new alerts while continuing to monitor and investigate in the UI.
- feature: Identity card improvements, allow existing identity card records to be associated with sources within the UI

Version 1.0.35
==============

- fix: Ops indexers queues issue, first queue should be splunk tcpin queue

Version 1.0.34
==============

- feature: introduction of the concept of source identity card, allows defining and store a documentation link and note for data sources, which identity cards are made available automatically via the UI and via the OOTB alert. Identity cards records can be created, maintained and delete via the UI.
- feature: increase default size of modal windows
- feature: fixed charts color for data sources and data hosts events vs lag embedded charts
- feature: add last 48 hours in link time selectors

Version 1.0.33
==============

- fix: Avoids post processed searches in the Mobile dashboard, better single form placement for Apple TV rendering

Version 1.0.32
==============

- fix: Performance issues with TrackMe mobile dashboard on mobile devices
- fix: TrackMe does not honour indexes whitelisting for metric hosts
- fix: Add metric host lookup in initial configuration load check operation
- fix: Wrong message for flush of metric KVstore collection
- feature: Remove management features from main UI to be transferred to a second management UI available from the nav menu

Version 1.0.31
==============

- fix: Regression in flipping state introduced by metric implementation, does not trigger anymore for events indexes
- feature: Add auditing view to report on application scheduling search workload
- feature: Nav menus re-organized

Version 1.0.30
==============

- fix: Splunk Mobile Dashboard does not honour whitelist and blacklists for data sources

Version 1.0.29
==============

- fix: errors in Splunk Mobile dashboard (Any priority SLA alerts singles do not filter on red state)
- fix: better table rendering in Splunk Mobile dashboard for metric hosts

Version 1.0.28
==============

- fix: collection key id retrieval fails if a metric category has been blacklisted for an existing object

Version 1.0.27
==============

- fix: appinspect failure with metric_host variable replacement in "trackMe - metric per host table report"

Version 1.0.26
==============

- fix: appinspect failure with metric_host variable replacement in "trackMe - metric host live report" report

Version 1.0.25
==============

- feature: Introducing support for metric store availability monitoring with metric hosts and granular detection of metric availability failure and latency
- feature: Refresh button in all modal windows, improved placements for buttons, improved navigation coherence between modal windows
- fix: data host modal embedded charts and table should honour tstats main filter, whitelists and blacklists
- fix: Improved Mobile dashboard

Version 1.0.24
==============

- fix: appinspect failure to local=true in commands.conf which is not required when chunked = true

Version 1.0.23
==============

- fix: error in lib path call to the new custom command for whitelisting

Version 1.0.22
==============

- feature: Whitelisting major improvement with UI supported and driven whitelisting of indexes at data discovery and search time (Issue #27)
- feature: Improve builtin choices for time input link selection within modal windows
- feature: Abstract tracker saved searches to remove useless code redundancy
- fix: Remove auto-refresh search link for searches which shouldn't be refreshed automatically (audit changes & flip, various collection management)
- fix: Drilldown on any priority entities in alert should define monitored_state to enabled
- fix: Monitor split share percentage error (Single forms shall share 25% each)
- fix: Lagging class auditing can register an incorrect type of operation
- fix: All time time range picker will not work for audit changes & status flipping
- fix: Auto refresh set to none has random side effects on embedded chart loading, fixed by none set to long period
- fix: Switched from default last 7 days to last 24 hours in audit and status flipping UIs
- fix: TrackMe Mobile view does not honour blacklists

Version 1.0.21
==============

- feature: Introducing a priority (low/medium/high) concept to ease granular alerting of data sources and hosts
- feature: Home landing page reviewed to expose data sources and host and any alert, and with high priority in alerts
- feature: Colored vignette design in modal window to ease investigating statuses
- feature: Default OOTB alerts now filter on red, and medium (default priority) or high priority entities
- feature: Improvement of OOTB alerts (outputs by default human readable time stamps for key fields)
- feature: TrackMe Mobile dashboard for dark theme summary view compatible with Splunk Mobile Experience (Apple TV, Mobile)
- feature: Improved navigation for unified modification modal windows
- feature: Drilldown on single forms, defines filtering based on the single form purpose
- feature: Manage and configure tab in main UI, access to reset collections functions or key macros definition and short cuts
- fix: data sources that came of scope might loose time context upon time and returned as green state
- fix: over time, trackers can re-add old entries due to flipping state cross-searches
- fix: data_host_state icon shown as empty if state=orange due to mismatch in macro eval state icon for data_host
- fix: trackers should refer to the tstats macro

Version 1.0.20
==============

- fix: Issue #34: Lagging class override for data_source is not registered properly

Version 1.0.19
==============

- Fix: Issue #32, if the data is offline for a long period that is out of the scope of the long term trackers, the last lag seen in seconds is not properly updated at each run time of the trackers.

Version 1.0.18
==============

- Fix: data index dropdown shouldn't itself be filtering on selected index

Version 1.0.17
==============

- Feature: Unified update modal Windows for data source and host modification
- Feature: Suspension effect when modification of entity is registered
- Fix: Prevent bootstrap button to remain focused once clicked

Version 1.0.16
==============

- Fix: Dropdown populating issues caused by 1.0.15 update

Version 1.0.15
==============

- Feature: Provide a time range picker for audit flipping and audit changes investigations

Version 1.0.14
==============

- Fix: Flipping chart over time should be stacked

Version 1.0.13
==============

- Fix: Flipping object dropdown populating issue

Version 1.0.12
==============

- Fix: Flipping audit tracker is not filtering on monitored entities

Version 1.0.11
==============

- Feature: Introducing status flipping audit and investigation to record and report on historical changes of data sources and hosts status

Version 1.0.10
==============

- Feature: Provides a trackme_admin role with relevant default meta configuration to allow granular access control for non admin users

Version 1.0.9
=============

- Fix: bad reference to a group in default Meta

Version 1.0.8
=============

- Feature: Add dropdown filters for data host monitoring (data_index, data_sourcetype)
- Feature: Improve filtering logics

Version 1.0.7
=============

- Fix: Missing lagging class button in data sources view

Version 1.0.6
=============

- Fix: Minor UI fixes
- Fix: Remove include_reduced_buckets for Splunk pre 7.3.x compatibility

Version 1.0.5
=============

- Feature: Implementation of audit changes
- Feature: Unify blacklist buttons in main modal
- Feature: Provides entities deletion permanent or temporary options to avoid re-creation of unwanted entities
- Feature: Add last ingest column in data sources and hosts

Version 1.0.4
=============

- Fix: case issue when hosts are seen in both lower and upper case, or a mix or them

Version 1.0.3
=============

- Fix: better bootstrap buttons alignment

Version 1.0.2
=============

- Feature: custom lagging classes feature introduction
- Fix: provides detailed explanation about the reset collection button
- Feature: UI experience improvements

Version 1.0.1
=============

- Fix: bad lookup referenced in host trackers

Version 1.0.0
=============

- initial and first public release
