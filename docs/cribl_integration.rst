Cribl LogStream and TrackMe integration
=======================================

.. image:: img/cribl/cribl_logo.png
   :alt: cribl_logo.png
   :align: center
   :width: 196px
   :class: with-border

**If you are using Cribl LogStream, you can easily integrate TrackMe in a just a few steps, using the excellent native Cribl LogStream design, TrackMe will take into account the concept of pipelines to create, monitor and render the data sources automatically.**

*In a nutshell:*

- A configuration parameter is available in TrackMe to enable the Cribl mode
- Once activated, the Cribl mode updates the way TrackMe is identifying and breaking the data sources
- To achieve this, TrackMe relies on the **cribl_pipe** indexed field automatically created by LogStream when data is indexed in Splunk
- Related searches transparenly use the **cribl_pipe** information, that accurately represents the data pipeline as it should be monitored, from LogStream to Splunk

Enable the Cribl mode
---------------------

**To enable the Cribl mode, go in "TrackMe manage and configure" and click on the enable Cribl mode:**

.. image:: img/cribl/enable_cribl_mode.png
   :alt: enable_cribl_mode.png
   :align: center
   :width: 1200px
   :class: with-border

**Once the Cribl mode is enabled, perform a reset of the data source collection:**

.. image:: img/cribl/cribl_reset_collection.png
   :alt: cribl_reset_collection.png
   :align: center
   :width: 1200px
   :class: with-border

Cribl mode data sources
-----------------------

**Let's assume the following simple scenario:**

- Cribl LogStream receives incoming data from any kind of sources, and streams to Splunk with associated pipelines
- In our example, we instruct LogStream to index data in Splunk into a few indexes, but we have many more pipelines since we perform various operations on LogStream, indexes and sourcetypes are likely fed by much more than just one pipeline
- In regular TrackMe mode, TrackMe would represent the data sources broken by indexes and sourcetypes, however, this does not represent what the incoming data flow is underneath, and does not provide the valuable information and monitoring layer we need
- Once we enable the Cribl mode, TrackMe relies on the ``cribl_pipe`` pipeline information to properly distinguish the real data flow as it is from the data provider (Cribl LogStream) perspective

*Cribl LogStream pipeline examples:*

.. image:: img/cribl/cribl_pipelines.png
   :alt: cribl_pipelines.png
   :align: center
   :width: 1200px
   :class: with-border

*In this example, the default TrackMe mode has different issues, we stream data to an index called "network", however we have different pipelines that are potentially linked to multiple sources and from the LogStream point of view could be affected independently in case of an issue or misconfiguration:*

.. image:: img/cribl/cribl_trackme1.png
   :alt: cribl_trackme1.png
   :align: center
   :width: 1200px
   :class: with-border

*Once we enable the Cribl mode, we see a very different picture, TrackMe automatically creates data sources broken by index, sourcetype and cribl_pipe:*

.. image:: img/cribl/cribl_trackme2.png
   :alt: cribl_trackme2.png
   :align: center
   :width: 1200px
   :class: with-border

Data sources are created as ``index + ":" + sourcetype + ":" + cribl_pipe``, this represents the data flow from Cribl LogStream to Splunk.

Every search actioned by trackMe now automatically recycles the cribl_pipe information naturally, such as latency tracking, data sampling, open in search buttons, etc:

.. image:: img/cribl/cribl_trackme3.png
   :alt: cribl_trackme3.png
   :align: center
   :width: 1200px
   :class: with-border

.. image:: img/cribl/cribl_trackme4.png
   :alt: cribl_trackme4.png
   :align: center
   :width: 1200px
   :class: with-border

.. image:: img/cribl/cribl_trackme5.png
   :alt: cribl_trackme5.png
   :align: center
   :width: 1200px
   :class: with-border

Cribl LogStream pre-processing pipelines and cribl_pipe field
-------------------------------------------------------------

If you have a proprocessing pipelines in your LogStream workflow, the ``cribl_pipe`` field becomes a multi-value indexed field that contains both the processing pipeline and pre-processing pipeline:

.. image:: img/cribl/cribl_preprocessing_pipeline.png
   :alt: cribl_preprocessing_pipeline.png
   :align: center
   :width: 1200px
   :class: with-border

.. image:: img/cribl/cribl_preprocessing_pipeline1.png
   :alt: cribl_preprocessing_pipeline1.png
   :align: center
   :width: 1200px
   :class: with-border

In the TrackMe context, this means that for the same data source, we get at least two entities, one per pipeline and one for the pre-processing pipeline:

.. image:: img/cribl/cribl_preprocessing_pipeline2.png
   :alt: cribl_preprocessing_pipeline2.png
   :align: center
   :width: 1200px
   :class: with-border

From the TrackMe point of view, the pre-processing pipeline view has no value and all that we care about is the data flow itself, to get rid of these entities automatically, we can add a data_name blocklist based in a very simple regular expression:

- from the main TrackMe screen, go to "Manage: allowlists & blocklists"
- add a new data_name blocklist according to the name of your pre-processing pipeline, in our case we will use ``.*cribl:splunk_reduce_metadata``
- once it has been added, existing entities are not taken into account anymore, and if new data sources are discovered, these will exclude the pre-processing pipeline automatically

.. image:: img/cribl/cribl_preprocessing_pipeline3.png
   :alt: cribl_preprocessing_pipeline3.png
   :align: center
   :width: 700px
   :class: with-border

.. image:: img/cribl/cribl_preprocessing_pipeline4.png
   :alt: cribl_preprocessing_pipeline4.png
   :align: center
   :width: 1200px
   :class: with-border

Congratulations!

You have a now a comprehensive integration between the wonderful and amazing Cribl LogStream and TrackMe allowing you to track your Splunk data the easy way!

Handling both Cribl mode and regular or additional custom modes
---------------------------------------------------------------

In some cases, you may have both Cribl Logstream feeding Splunk, and regular other types of data coming from Universal, Heavy Forwarders, HTTP event collector and so forth.

When TrackMe is configured in the Cribl mode, only data coming from Cribl Logstream will be taken into account, which happens because we expect a ``cribl_pipe`` indexed field for every data source to be discovered and maintained.

.. hint::

   - You can rely on :ref:`Hybrid trackers` to create any number of special trackers, and handle any additional use case as needed!

.. image:: img/cribl/cribl_hybrid.png
   :alt: cribl_hybrid.png
   :align: center
   :width: 1200px
   :class: with-border
