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

.. hint:: Since TrackMe 1.2.0, there are several application dependencies

- Semicircle Donut Chart Viz, Splunk Base: https://splunkbase.splunk.com/app/4378
- Splunk Machine Learning Toolkit, Splunk Base: https://splunkbase.splunk.com/app/2890
- Splunk Timeline - Custom Visualization, Splunk Base: https://splunkbase.splunk.com/app/3120
- Splunk SA CIM - Splunk Common Information Model, Splunk Base: https://splunkbase.splunk.com/app/1621 (require for alert actions and result ingestion purposes)

Indexes
=======

.. hint:: Since TrackMe 1.2.0, the application requires the creation of an event index and a metric index

- summary event index defaults to ``trackme_summary``, handled by the macro ``trackme_idx``
- metric index defaults to ``trackme_metrics``, handled by the macro ``trackme_metrics_idx``

Customise these macros via the UI or via a local/macros.conf file if you wish to use a different index naming convention.

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
