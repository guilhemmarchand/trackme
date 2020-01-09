Release notes
#############

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
