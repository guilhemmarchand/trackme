.. trackme documentation master file, created by
   sphinx-quickstart on Tue Sep 18 23:25:46 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to the Splunk TrackMe application documentation
========================================================

**The Splunk TrackMe application provides automated monitoring and visibility insight of your data sources availability, with a powerful user interface and workflow for Splunk product owners to detect and alert on failures or abnormal latency:**

- Discover and store key states information of data sources, data hosts and metric hosts availability
- Provides a powerful user interface to manage activation states, configuration and quickly trouble availability failure detection
- Analyse and detect lack of data and performance lagging of data sources and hosts within your Splunk deployment
- Behaviour analytic with outlier detection based on machine learning outliers calculations
- Create elastic sources for any kind of custom monitoring requirements based on tstats / raw / mstats / from searches to fullfill any requirements
- Record and investigate historical changes of statuses, as well as administrators changes (audit flipping and changes)
- Easy administration via graphical human interface from A to Z
- No matters the purpose of your Splunk deployment, trackMe will easily become an essential and easy piece of your deployment, and even providing efficient answers to PCI and compliance requirements
- Never let again your team be the last to discover what empty and no results found mean!

.. image:: img/screenshots_main/img001.png
   :alt: img001.png
   :align: center

.. image:: img/screenshots_main/img002.png
   :alt: img002.png
   :align: center

.. image:: img/screenshots_main/img003.png
   :alt: img003.png
   :align: center

.. image:: img/screenshots_main/img004.png
   :alt: img004.png
   :align: center

.. image:: img/screenshots_main/img005.png
   :alt: img005.png
   :align: center

**Why this application?**

Splunk administrators and engineers have to spend a good amount of time and energy to on-board new data sources, another data source after another data source.

However, it is very frequent to realise after math that something went wrong, for some reason the sender stopped sending, an upgrade broke a configuration, a network rule was lost…

No administrator should be informed of an issue in the data flow by the customer or end users, this is why you need pro-activity and costless availability monitoring.

with the massive amount of data sources, this becomes easily a painful and time consuming activity, this application aims to drastically help you in these tasks.

This tiny application provides a handy user interface associated with a simple but efficient data discovery, state and alerting workflow.

Made by Splunk admins for Splunk admins, the TrackMe application provides builtin powerful features to monitor and administer you data source monitoring the easy way!

**Use case for TrackMe?**

No matters the purpose of your Splunk deployment, trackMe will easily become an essential and positive piece of your Splunk journey:

- Security Operation Centers (SOC) with or without Enterprise Security compliance: detect lack of data, abnormal latency potentially impacting your security posture
- PCI and compliance: deliver, alert and action
- Monitoring and insight visibility about your indexes, sourcetypes, events and metrics
- General data activity monitoring and detection of Zombie data

Overview:
=========

.. toctree::
   :maxdepth: 2

   about
   compatibility
   support
   download

Deployment and configuration:
=============================

.. toctree::
   :maxdepth: 2

   deployment
   configuration

User guide:
===========

.. toctree::
   :maxdepth: 2

   userguide
   itsi_integration

Troubleshoot:
=============

.. toctree::
   :maxdepth: 1

   FAQ

Versioniong and build history:
==============================

.. toctree::
   :maxdepth: 1

   releasenotes.rst
