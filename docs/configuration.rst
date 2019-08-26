Configuration
#############

**Very few specific configuration items that are required:**

tstats root macro definition
============================

Searches in the main UI rely on the usage of the following macro:

::

    # For Splunk 7.3.x and later, you might want to include include_reduced_buckets=t
    [tstats]
    definition = tstats
    iseval = 0

If you are using Splunk 7.3.x or a later version, you can include the reduced buckets in the tstats results, as:

::

    [tstats]
    definition = tstats include_reduced_buckets=t
    iseval = 0

Index macro definition
======================

The builtin views "Ops: Indexes queues" and "Ops: Parsing issues" rely on the usage of the following macro:

::

    # defined pattern filter for indexers
    [trackme_idx_filter]
    definition = host=idx*
    iseval = 0

Customise the macro definition to match your indexers host naming convention.

Time format for human readable output
=====================================

The UI generates human readable time stamps in the following format:

::

    %d/%m/%Y %H:%M

This is driven by the following macro definition:

::

    [trackme_date_format(1)]
    args = input_field
    definition = eval "$input_field$ (translated)"=strftime($input_field$, "%d/%m/%Y %H:%M")
    iseval = 0

If you prefer to have a different format, customise this macro definition.
