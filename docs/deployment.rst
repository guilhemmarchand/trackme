Deployment & Upgrades
#####################

Deployment matrix
=================

+----------------------+---------------------+
| Splunk roles         | required            |
+======================+=====================+
| Search head          |   yes               |
+----------------------+---------------------+
| Indexer tiers        |   no                |
+----------------------+---------------------+

If Splunk search heads are running in Search Head Cluster (SHC), the Splunk application must be deployed by the SHC deployer.

Dependencies
============

**Since TrackMe 1.2.0, there are dependencies:**

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890

Indexes
=======

**Since the version 1.2.6**, TrackMe requires the creation of a **metric index (trackme_metrics)**, or the customisation of the **trackme_idx_metrics** macro if you wish to use an existing metric index.

Initial deployment
==================

**The deployment of the Splunk application is very straight forward:**

- Using the application manager in Splunk Web (Settings / Manages apps)

- Extracting the content of the tgz archive in the "apps" directory of Splunk

- For SHC configurations (Search Head Cluster), extract the tgz content in the SHC deployer and publish the SHC bundle

Upgrades
========

Upgrading the Splunk application is pretty much the same operation than the initial deployment.

All of TrackMe components and configuration items are upgraded resilient, in respects with Splunk configuration good practices.
