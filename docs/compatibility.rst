Compatibility
=============

Splunk core compatibility
#########################

.. admonition:: Splunk core

    - TrackMe is compatible with Splunk 7.2.x and later.

The previous main branch of TrackMe (V1.1.x) was compatible with Splunk versions starting from Splunk 7.0.x, which changed from 7.2.x due to the usage of the mcollect command.

Splunk Cloud compatibility
##########################

.. admonition:: Splunk Cloud vetting

    - TrackMe is vetted for Splunk Cloud deployments
    - When a new release is pubished, there can be some time before the last release is vetted
    - Even if the latest release would not be vetted yet, open a request to Cloud Ops and the vetting process will be achieved

*Splunk Cloud notes:*

- When a new release of TrackMe is published, there is a certain amount of time required for the vetting process to be performed
- As such, in Splunk Base the current release might appear as not vetted yet
- To get TrackMe deployed in Splunk Cloud, you can submit a case to Cloud Ops, if the latest release is not vetted yet, you can request its deployment and vetting will be performed, or you can check what the latest version is in Splunk Base and request its deployment
- TrackMe currently requires an "assisted" deployment, which means that it is not currently deployable by Splunk Cloud Self Services and you need to submit a request

*Checkout the latest vetted version in Splunk Base:*

- In Splunk Base, if the latest version is not yet vetted the following message is displayed "This version is not yet available for Splunk Cloud."
- Use the version dropdown to select an earlier version to see "Splunk Cloud" listed in the Products, which confirms that this version has been vetted

Python compatibility
####################

.. admonition:: Python 3 compatibility

    - TrackMe is fully compatible with Python 3
    - Splunk Python SDK libs embedded in TrackMe are maintained up to date with official releases
    - While Python 3 compatibility is the main target, TrackMe is as well cross compatible with Python 2

Web Browser compatibility
#########################

The application can be used with any of the supported Web Browser by Splunk:

https://docs.splunk.com/Documentation/Splunk/latest/Installation/Systemrequirements
