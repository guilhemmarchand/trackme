Compatibility
=============

Splunk core compatibility
#########################

.. admonition:: Splunk core

    - TrackMe is compatible with Splunk 8.x and later. (Python3 only support starting from release 1.2.52)

The previous main branch of TrackMe (V1.1.x) was compatible with Splunk versions starting from Splunk 7.0.x, which changed from 7.2.x due to the usage of the mcollect command.

The latest release compatible with Splunk 7.2.x/7.3.x and Python2 is the release 1.2.51.

Splunk Cloud compatibility
##########################

.. important:: Splunk Cloud compatibility has stopped

   - Since September 2022, TrackMe V1 is not compatible anymore for new deployments in Splunk Cloud.

   - For the time being, existing deployments can allow the execution of the deprecated HTML based dashboards: https://docs.splunk.com/Documentation/SplunkCloud/9.0.2208/ReleaseNotes/NewSplunkCloudFeatures

   - jQuery v3.5 is shipped as default with Splunk Cloud Platform, Splunk Cloud Platform now ships with jQuery 3.5 by default. Older jQuery versions are still supported and can be accessed via the jQuery toggle in the internal library settings by Splunk Admins. Splunk will be removing support for all older versions of jQuery in the near future.

   - Once you did, TrackMe will be functional again

Python compatibility
####################

.. admonition:: Python 3 compatibility

    - TrackMe supports Python 3 exclusively
    - Python2 support was dropped in release 1.2.51, starting from release 1.2.52 TrackMe only supports Python3

Web Browser compatibility
#########################

The application can be used with any of the supported Web Browser by Splunk:

https://docs.splunk.com/Documentation/Splunk/latest/Installation/Systemrequirements
