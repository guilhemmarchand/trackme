Release notes
#############

Version 1.0.21
==============

- feature: Introducing a priority (low/medium/high) concept to ease granular alerting of data sources and hosts
- feature: Home landing page reviewed to expose data sources and host and any alert, and with high priority in alerts
- feature: Colored vignette design in modal window to ease investigating statuses
- feature: Default OOTB alerts now filter on red, and medium (default priority) or high priority entities
- feature: Improvement of OOTB alerts (outputs by default human readable time stamps for key fields)
- feature: TrackMe Mobile dashboard for dark theme summary view compatible with Splunk Mobile Experience (Apple TV, Mobile)
- fix: data sources that came of scope might loose time context upon time and returned as green state
- fix: over time, trackers can re-add old entries due to flipping state cross-searches
- fix: data_host_state icon shown as empty if state=orange due to mismatch in macro eval state icon for data_host

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
