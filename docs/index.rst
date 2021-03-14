.. trackme documentation master file, created by
   sphinx-quickstart on Tue Sep 18 23:25:46 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to the Splunk TrackMe application documentation
========================================================

**TrackMe provides automated monitoring and visibility insight of your data sources, with a powerful user interface and workflow for Splunk product owners to detect and alert on lack of availability, abnormal latency, volume outliers detection and quality issues:**

- Discover and store key states information of data sources, data hosts and metric hosts availability
- Provides a powerful user interface to manage activation states, configuration and quickly identify data availability failures
- Analyse and detect lack of data and performance lagging of data sources and hosts within your Splunk deployment
- Behaviour analytic with outlier detection based on machine learning outliers calculations
- Behaviour analytic with data sampling and event format recognition, monitor and detect anomalies in raw events to detect event format changes or misbehaviour based on builtin rules and extended with your own custom rules
- Create elastic sources for any kind of custom monitoring requirements based on tstats / raw / mstats / from searches to fullfill any requirements
- Record and investigate historical changes of statuses, as well as administrators changes (audit flipping and changes)
- Easy administration via graphical human interface from A to Z
- No matters the purpose of your Splunk deployment, trackMe will become an essential piece of your deployment, providing key value for PCI or compliance requirements
- Keep things under your control and be the first to know when data is not available, get alerted before your users get back to you!

.. image:: img/screenshots_main/img001.png
   :alt: img001.png
   :align: center
   :width: 1200px

.. image:: img/screenshots_main/img002.png
   :alt: img002.png
   :align: center
   :width: 1200px

.. image:: img/screenshots_main/img003.png
   :alt: img003.png
   :align: center
   :width: 1200px

.. image:: img/screenshots_main/img004.png
   :alt: img004.png
   :align: center
   :width: 1200px

.. image:: img/screenshots_main/img005.png
   :alt: img005.png
   :align: center
   :width: 1200px

**Why this application?**

Splunk administrators and engineers have to spend a good amount of time and energy to on-board and monitor data sources, which becomes more and more complex and time consuming with the explosion of volume and variety of data.

However, it is very frequent to realise after math that something went wrong, for some reason the sender stopped sending, an upgrade broke a configuration, a network rule was lost, an unexpected side effect of a change occurred, parsing issues are not detected...

No administrator should be informed of an issue in the data flow by the customer or the end users, this is why you need pro-activity, costless and scalable availability monitoring.

with the massive amount and variety of data sources, this becomes easily a painful and problematic activity, this application aims to drastically help you in these daily tasks.

TrackMe provides a handy user interface associated with an efficient data discovery, state and alerting workflow.

Made by Splunk admins for Splunk admins, the TrackMe application provides builtin powerful features to monitor and administer you data source monitoring the easy way!

**Use cases for TrackMe?**

No matters the purpose of your Splunk deployment, trackMe will easily become an essential and positive piece of your Splunk journey:

- Security Operation Centers (SOC) with or without Enterprise Security compliance: detect lack of data, abnormal latency potentially impacting your security posture
- PCI and compliance: deliver, alert and action
- Monitoring and insight visibility about your indexes, sourcetypes, events and metrics
- General data activity monitoring and detection of Zombie data
- Continous and automated data quality assessment
- PII data detection with custom regular expression based rules and data sampling
- many more!

Overview:
=========

.. toctree::
   :maxdepth: 2
   :caption: Overview

   about
   compatibility
   support
   download

Deployment and configuration:
=============================

.. toctree::
   :maxdepth: 2
   :caption: Deployment and configuration

   deployment
   configuration

User guide:
===========

.. toctree::
   :maxdepth: 2
   :caption: Usage

   userguide
   itsi_integration
   cribl_integration
   monitor_forwarders
   rest_api_reference

Troubleshoot:
=============

.. toctree::
   :maxdepth: 1
   :caption: Troubleshoot

   FAQ

Versioning and build history:
=============================

.. toctree::
   :maxdepth: 1
   :caption: Versioning

   releasenotes.rst
