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

Initial deployment
==================

**The deployment of the Splunk application is very straight forward:**

- Using the application manager in Splunk Web (Settings / Manages apps)

- Extracting the content of the tgz archive in the "apps" directory of Splunk

- For SHC configurations (Search Head Cluster), extract the tgz content in the SHC deployer and publish the SHC bundle

Upgrades
========

Upgrading the Splunk application is pretty much the same operation than the initial deployment.
