Release notes
#############

Version 1.2.20
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

- Fix: getlistdef.py custom command fails with a Python decode error if running in a Python3 only instance
- Fix: Allowlist / Blacklist and similar deletion checkbox may fail to refresh the window content properly upon record(s) deletion
- Change: Minor UI changes and improvements

Version 1.2.19
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: error in metric hosts rendering results which are not exposing the full list of metrics per entity in the UI

Version 1.2.14
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

TrackMe requires a summary index (defaults to trackme_summary) and a metric index (defaults to trackme_metrics):
https://trackme.readthedocs.io/en/latest/configuration.html

**release notes:**

- Fix: error in metric hosts rendering results which are duplicated in the UI after their expansion

Version 1.2.13
==============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Fix: conflict with Enterprise Security due to the tstats macro defined in TrackMe when co-located, macro renamed to avoid this issue
- Fix: cancel button in Elastic sources main modal, review help content

Version 1.2.4
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Fix: Remove useless lookup call in the data hosts view which impacts search time performance in large scale environments

Version 1.2.3
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

**release notes:**

- Feature: Allows running the tracker directly after the Elastic source creation within the modal creation window (feature introduced in version 1.2.0)

Version 1.2.2
=============

**CAUTION:**

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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

This is a new main release branch, TrackMe 1.2.x require the deployment of the following dependencies:

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
