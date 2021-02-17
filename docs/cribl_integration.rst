Cribl and TrackMe integration
=============================

.. image:: img/cribl/cribl_logo.png
   :alt: cribl_logo.png
   :align: center
   :width: 196px

**If you are using Cribl, you can easily inegrate TrackMe in a just a few steps, using the excellent native Cribl design, TrackMe will take into account the concept of Cribl pipelines to create, monitor and render the data sources automatically.**

- A configuration parameter is available in TrackMe to enable the Cribl mode
- Once activated, the Cribl mode updates the way TrackMe is breaking the data sources
- To achieve this, TrackMe relies on the **crible_pipe** indexed field automatically created by Cribl when data is indexed in Splunk
- Related searches naturally uses the **crible_pipe** information, which accurately represents the data pipeline as it should be monitored, from Cribl to Splunk

Enable the Cribl mode
---------------------

**To enable the Cribl mode, go in "TrackMe manage and configure" and click on the enable Cribl mode:**

.. image:: img/cribl/enable_cribl_mode.png
   :alt: enable_cribl_mode.png
   :align: center
   :width: 1200px

**Once the Cribl mode is enabled, perform a reset of the data source collection:**

.. image:: img/cribl/cribl_reset_collection.png
   :alt: cribl_reset_collection.png
   :align: center
   :width: 1200px

Cribl mode data sources
-----------------------

**Let's assume the following simple scenario:**

- Cribl receives incoming data from any kind of sources, and streams to Splunk with associated pipelines
- In our example, we instruct Cribl to index data in Splunk into a few indexes, but we have many more pipelines since we perform various operations on Cribl, indexes and sourcetypes are potentially fed by more than just one pipeline
- In regular TrackMe mode, TrackMe would represent the data sources broken by indexes and sourcetypes, which does not represent the incoming what the data pipeline is, and does not provide the valuable information and monitoring we need
- Once we enable the Cribl mode, TRackMe relies on the Cribl pipeline information, which allows us to have a different and accurate picture of each Cribl pipeline

*Cribl pipeline examples:*

.. image:: img/cribl/cribl_pipelines.png
   :alt: cribl_pipelines.png
   :align: center
   :width: 1200px

*In this example, the default TrackMe mode has different issues, we stream data to an index called "network", however we have different pipelines that are potentially linked to multiple sources and from the Cribl point of view could be affected independently in case of an issue or misconfiguration:*

.. image:: img/cribl/cribl_trackme1.png
   :alt: cribl_trackme1.png
   :align: center
   :width: 1200px

*Once we enable the Cribl mode, we see a drastically different picture, TrackMe automatically creates data sources broken by index, sourcetype and cribl_pipe:*

.. image:: img/cribl/cribl_trackme2.png
   :alt: cribl_trackme2.png
   :align: center
   :width: 1200px

Data sources are created as ``index . ":" . sourcetype . ":" . cribl_pipe``, which accurately represent the Cribl to Splunk data flow.

Every search actioned by trackMe now automatically recycles the cribl_pipe information naturally, such as latency tracking, data sampling, open in search buttons, etc:

.. image:: img/cribl/cribl_trackme3.png
   :alt: cribl_trackme3.png
   :align: center
   :width: 1200px

.. image:: img/cribl/cribl_trackme4.png
   :alt: cribl_trackme4.png
   :align: center
   :width: 1200px

Congrats!

You have a now a natural integration between the wonderful and amazing Cribl, and TrackMe to carefully monitor and track your Splunk data the easy way!
