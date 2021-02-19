Step by step installation and configuration
###########################################

Step 1: Deploy TrackMe
======================

Where to deploy TrackMe
-----------------------

The first question you need an answer when you look at deploying TrackMe the very first time is generally where to deploy TrackMe?

**To answer this question in a nutshell:**

- TrackMe runs exclusively on a search head layer, there are no components running on forwarders (Universal Forwarders, Heavy Forwarders) or Splunk indexers
- The seach head layer targets deponds on your preference, it can be standalone search head you are using to run monitoring tools, it can be the monitoring console host or a Search Head Cluster
- The essential part of the content TrackMe is generated in dedicated indexes (summary events and metrics) and non replicated KVstore collections which have near zero impacts on the search knowledge bundle size that is replicated automatically to your indexers

Configure indexes
-----------------

Once you decided which search head layer will host TrackMe, the next step is to configure its indexes.

TrackMe requires the creation on your indexes of two indexes, one for the summary events and one for the metrics, the second is a metric type of index opposed to events indexes, TrackMe includes the following indexes.conf:

``default/indexes.conf``

::

    [trackme_summary]
    coldPath = $SPLUNK_DB/trackme_summary/colddb
    homePath = $SPLUNK_DB/trackme_summary/db
    thawedPath = $SPLUNK_DB/trackme_summary/thaweddb

    [trackme_metrics]
    coldPath = $SPLUNK_DB/trackme_metrics/colddb
    homePath = $SPLUNK_DB/trackme_metrics/db
    thawedPath = $SPLUNK_DB/trackme_metrics/thaweddb
    datatype = metric

In well designed Splunk environments, you will most likely use volumes on the indexers, you would translate this within your indexer configuration to the following configuration potentially:

::

    [trackme_summary]
    coldPath = volume:primary/trackme_summary/colddb
    homePath = volume:primary/trackme_summary/db
    thawedPath = $SPLUNK_DB/trackme_summary/thaweddb

    [trackme_metrics]
    coldPath = volume:primary/trackme_metrics/colddb
    homePath = volume:primary/trackme_metrics/db
    thawedPath = $SPLUNK_DB/trackme_metrics/thaweddb
    datatype = metric

*To be adapted depending on your volume configuration!*

.. hint:: In properly configured Splunk environments, your indexes should be defined on ``both`` the search heads and in the indexers, on the search head this allows autocompletion and is required by collect/mcollect at some levels

Using a different naming convention for indexes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In some cases you may need to use a different naming convention for the two TrackMe indexes, this is not an issue and the only thing you will need to update in the application will be defining the custom configuration in the following two macros:

- ``trackme_idx``
- ``trackme_metrics_idx``

The out of the box definition is:

``default/macros.conf``

::

    [trackme_idx]
    definition = index="trackme_summary"
    iseval = 0

    [trackme_metrics_idx]
    definition = index="trackme_metrics"
    iseval = 0

Up to your choice, you can do this manually in the same time you deploy TrackMe (in a local/macros.conf) or you can update this within the UI once the application has been deployed:

``TrackMe manage and configure``

.. image:: img/step_by_step_configure/ui_update_indexes.png
   :alt: ui_update_indexes.png
   :align: center
   :width: 1200px

Step 2: Configure TrackMe to is best
====================================

TrackMe strategy for data access
--------------------------------

The first thing to consider once your deployed TrackMe is to design your strategy for which data TrackMe will be monitoring.

By default, TrackMe will search efficiently (tstats based queries for events) against any index the search head can access, you can choose betweem **two** main strategies:

- Either you use ``allow listing`` features to restrict access to explicit list of indexes
- Either you use ``block listing`` features to be looking at everything **but** specific items you exclude explicitly (indexes, sourcetypes, hosts and so forth)

Both approaches are configurable via the TrackMe UI, and both approaches have its advantages and inconvenients:

- Allow listing is the cleaner and more effiscient way but requires that you have a deep knowledge of your environment
- Allow listing can lead to be missing things you should have been tracking if not configured properly nor maintained over time
- Block listing can require more work over time as you need to exclude the bad things you do not want to consider

The two approaches are not exclusive, you can use allow listing AND block listing! This means you can restrict the basic index access scope AND block list certain things you do not want to consider.

See :ref:`Allowlisting & Blocklisting` in the User guide.

*Interface to allow listing and block listing definitions:*

.. image:: img/allowlist_and_blocklist.png
   :alt: allowlist_and_blocklist.png
   :align: center
   :width: 800px

.. hint:: Each main TrackMe categories have their own definitions for allow and block listing: ``Data souces``, ``Data hosts`` and ``Metric hosts``
