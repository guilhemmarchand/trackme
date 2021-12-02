const { Callbacks } = require("jquery");

require([
  "jquery",
  "underscore",
  "splunkjs/mvc",
  "splunkjs/mvc/utils",
  "splunkjs/mvc/tokenutils",
  "splunkjs/mvc/simpleform/formutils",
  "splunkjs/mvc/searchcontrolsview",
  "splunkjs/mvc/searchmanager",
  "splunkjs/mvc/postprocessmanager",
  "splunkjs/mvc/dropdownview",
  "splunkjs/mvc/multidropdownview",
  "splunkjs/mvc/tableview",
  "splunkjs/mvc/textinputview",
  "splunkjs/mvc/singleview",
  "splunkjs/mvc/chartview",
  "splunkjs/mvc/simpleform/input/linklist",
  "splunkjs/mvc/resultslinkview",
  "splunkjs/mvc/simplexml/searcheventhandler",
  "splunkjs/mvc/visualizationregistry",
  "splunkjs/mvc/simplexml/ready!",
  "splunkjs/mvc/simpleform/input/multiselect",
], function (
  $,
  _,
  mvc,
  utils,
  TokenUtils,
  FormUtils,
  SearchControlsView,
  SearchManager,
  PostProcessManager,
  DropdownView,
  MultiDropdownView,
  LinkListInput,
  TableView,
  TextInputView,
  SingleView,
  ChartView,
  ResultsLinkView,
  SearchEventHandler,
  VisualizationRegistry
) {
  // TOKENS

  //var defaultTokenModel = mvc.Components.get("default");

  var defaultTokenModel = mvc.Components.getInstance("default", {
    create: true,
  });
  var submittedTokenModel = mvc.Components.getInstance("submitted", {
    create: true,
  });

  function setToken(name, value) {
    defaultTokenModel.set(name, value);
    submittedTokenModel.set(name, value);
  }

  function getToken(name) {
    var ret = null;
    if (defaultTokenModel.get(name) != undefined) {
      ret = defaultTokenModel.get(name);
    } else if (submittedTokenModel.get(name) != undefined) {
      ret = submittedTokenModel.get(name);
    }
    return ret;
  }

  function unsetToken(name) {
    defaultTokenModel.unset(name);
    submittedTokenModel.unset(name);
  }

  //
  // FUNCTIONS
  //

  //
  // Notify
  //

  function notify(varCss, varPosition, varHtml, vardelay) {
    require([
      "jquery",
      "/static/app/trackme/notifybar/jquery.notifyBar.js",
    ], function ($) {
      //code here
      jQuery(function () {
        jQuery.notifyBar({
          cssClass: varCss,
          position: varPosition,
          html: varHtml,
          delay: vardelay,
        });
      });
    });
  }

  // Returns true if numeric
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n > 0;
  }

  //
  // SERVICE OBJECT
  //

  // Create a service object using the Splunk SDK for JavaScript
  // to send REST requests
  var service = mvc.createService({
    owner: "nobody",
  });

  //
  // BEGIN OPERATIONS
  //

  // Audit changes
  var tokens = mvc.Components.get("default");
  var currentUser = Splunk.util.getConfigValue("USERNAME");
  tokens.set("currentUser", currentUser);
  var auditendpoint_URl =
    "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_audit_changes/";

  // FUNCTIONS

  function updateDataSource(tk_keyid) {
    // Perform a target search to update key values
    var searchQuery =
      "| savedsearch trackme_get_data_source_table_by_key key=" + tk_keyid;

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-5m",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        { period: 200 },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];

                  // update state color
                  if (field == "data_source_state") {
                    setToken("tk_data_source_state", value);
                    tk_data_source_state = value;
                    // Dynamically manage state color
                    if (tk_data_source_state == "green") {
                      setToken("tk_data_source_state_class", "title_green");
                      setToken(
                        "tk_data_source_status_message_class",
                        "status_message_green"
                      );
                    } else if (tk_data_source_state == "orange") {
                      setToken("tk_data_source_state_class", "title_orange");
                      setToken(
                        "tk_data_source_status_message_class",
                        "status_message_orange"
                      );
                    } else if (tk_data_source_state == "blue") {
                      setToken("tk_data_source_state_class", "title_blue");
                      setToken(
                        "tk_data_source_status_message_class",
                        "status_message_blue"
                      );
                    } else if (tk_data_source_state == "red") {
                      setToken("tk_data_source_state_class", "title_red");
                      setToken(
                        "tk_data_source_status_message_class",
                        "status_message_red"
                      );
                    }
                  }

                  // update priority color
                  if (field == "priority") {
                    setToken("tk_priority", value);
                    tk_priority = value;
                    // Dynamically manage state color
                    if (tk_priority == "low") {
                      setToken("tk_priority_class", "title_low_priority");
                    } else if (tk_priority == "medium") {
                      setToken("tk_priority_class", "title_medium_priority");
                    } else if (tk_priority == "high") {
                      setToken("tk_priority_class", "title_high_priority");
                    }
                  }

                  // update monitored state
                  if (field == "data_monitored_state") {
                    setToken("tk_data_monitored_state", value);
                    tk_data_monitored_state = value;
                    // Dynamically manage state color
                    if (tk_data_monitored_state == "enabled") {
                      document.getElementById(
                        "btn_enable_monitoring"
                      ).disabled = true;
                      document.getElementById(
                        "btn_disable_monitoring"
                      ).disabled = false;
                      setToken("tk_data_monitored_state_class", "title_green");
                    } else {
                      document.getElementById(
                        "btn_enable_monitoring"
                      ).disabled = false;
                      document.getElementById(
                        "btn_disable_monitoring"
                      ).disabled = true;
                      setToken("tk_data_monitored_state_class", "title_grey");
                    }
                  }

                  // update lag summary
                  if (field == "lag (event / ingestion)") {
                    setToken("tk_data_lag_summary", value);
                    tk_data_lag_summary = value;
                  }

                  // update last time
                  if (field == "last time") {
                    setToken("tk_data_last_time_seen_human", value);
                    tk_data_last_time_seen_human = value;
                  }

                  // update last ingest
                  if (field == "last ingest") {
                    setToken("tk_data_last_ingest_human", value);
                    tk_data_last_ingest_human = value;
                  }

                  // update data_monitoring_level
                  if (field == "data_monitoring_level") {
                    setToken("tk_data_monitoring_level", value);
                    tk_data_monitoring_level = value;
                  }

                  // update data_max_lag_allowed
                  if (field == "data_max_lag_allowed") {
                    setToken("tk_data_max_lag_allowed", value);
                    tk_data_max_lag_allowed = value;
                  }

                  // update flip
                  if (field == "latest_flip_time (translated)") {
                    setToken("tk_latest_flip_time_human", value);
                    tk_latest_flip_time_human = value;
                  }

                  if (field == "latest_flip_state") {
                    setToken("tk_latest_flip_state", value);
                    tk_latest_flip_state = value;
                  }

                  // update status_message
                  if (field == "status_message") {
                    setToken("tk_status_message", value);
                    tk_status_message = value;
                  }

                  // update data sampling
                  if (field == "data_sample_status_message") {
                    setToken("tk_data_sampling_status_message", value);
                    tk_data_sampling_status_message = value;
                  }

                  // update state color
                  if (field == "data_sample_status_colour") {
                    setToken("tk_data_sampling_status_message_class", value);
                    tk_data_sampling_status_message_class = value;
                    // Dynamically manage state color
                    if (tk_data_sampling_status_message_class == "green") {
                      setToken(
                        "tk_data_sampling_status_message_class",
                        "status_message_green"
                      );
                    } else if (
                      tk_data_sampling_status_message_class == "orange"
                    ) {
                      setToken(
                        "tk_data_sampling_status_message_class",
                        "status_message_orange"
                      );
                    } else if (
                      tk_data_sampling_status_message_class == "blue"
                    ) {
                      setToken(
                        "tk_data_sampling_status_message_class",
                        "status_message_blue"
                      );
                    } else if (tk_data_sampling_status_message_class == "red") {
                      setToken(
                        "tk_data_sampling_status_message_class",
                        "status_message_red"
                      );
                    }
                  }
                }
              }
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  function updateDataHost(tk_keyid) {
    // Perform a target search to update key values
    var searchQuery =
      "| savedsearch trackme_get_data_host_table_by_key key=" + tk_keyid;

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-5m",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        { period: 200 },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];

                  // update state color
                  if (field == "data_host_state") {
                    setToken("tk_data_host_state", value);
                    tk_data_host_state = value;
                    // Dynamically manage state color
                    if (tk_data_host_state == "green") {
                      setToken("tk_data_host_state_class", "title_green");
                      setToken(
                        "tk_data_host_status_message_class",
                        "status_message_green"
                      );
                    } else if (tk_data_host_state == "orange") {
                      setToken("tk_data_host_state_class", "title_orange");
                      setToken(
                        "tk_data_host_status_message_class",
                        "status_message_orange"
                      );
                    } else if (tk_data_host_state == "blue") {
                      setToken("tk_data_host_state_class", "title_blue");
                      setToken(
                        "tk_data_host_status_message_class",
                        "status_message_blue"
                      );
                    } else if (tk_data_host_state == "red") {
                      setToken("tk_data_host_state_class", "title_red");
                      setToken(
                        "tk_data_host_status_message_class",
                        "status_message_red"
                      );
                    }
                  }

                  // update priority color
                  if (field == "priority") {
                    setToken("tk_priority", value);
                    tk_priority = value;
                    // Dynamically manage state color
                    if (tk_priority == "low") {
                      setToken("tk_priority_class", "title_low_priority");
                    } else if (tk_priority == "medium") {
                      setToken("tk_priority_class", "title_medium_priority");
                    } else if (tk_priority == "high") {
                      setToken("tk_priority_class", "title_high_priority");
                    }
                  }

                  // update monitored state
                  if (field == "data_monitored_state") {
                    setToken("tk_data_monitored_state", value);
                    tk_data_monitored_state = value;
                    // Dynamically manage state color
                    if (tk_data_monitored_state == "enabled") {
                      document.getElementById(
                        "btn_enable_monitoring"
                      ).disabled = true;
                      document.getElementById(
                        "btn_disable_monitoring"
                      ).disabled = false;
                      setToken("tk_data_monitored_state_class", "title_green");
                    } else {
                      document.getElementById(
                        "btn_enable_monitoring"
                      ).disabled = false;
                      document.getElementById(
                        "btn_disable_monitoring"
                      ).disabled = true;
                      setToken("tk_data_monitored_state_class", "title_grey");
                    }
                  }

                  // update lag summary
                  if (field == "lag (event / ingestion)") {
                    setToken("tk_data_lag_summary", value);
                    tk_data_lag_summary = value;
                  }

                  // update last time
                  if (field == "last time") {
                    setToken("tk_data_last_time_seen_human", value);
                    tk_data_last_time_seen_human = value;
                  }

                  // update last ingest
                  if (field == "last ingest") {
                    setToken("tk_data_last_ingest_human", value);
                    tk_data_last_ingest_human = value;
                  }

                  // update data_monitoring_level
                  if (field == "data_monitoring_level") {
                    setToken("tk_data_monitoring_level", value);
                    tk_data_monitoring_level = value;
                  }

                  // update data_max_lag_allowed
                  if (field == "data_max_lag_allowed") {
                    setToken("tk_data_max_lag_allowed", value);
                    tk_data_max_lag_allowed = value;
                  }

                  // update flip
                  if (field == "latest_flip_time (translated)") {
                    setToken("tk_latest_flip_time_human", value);
                    tk_latest_flip_time_human = value;
                  }

                  if (field == "latest_flip_state") {
                    setToken("tk_latest_flip_state", value);
                    tk_latest_flip_state = value;
                  }

                  // update status_message
                  if (field == "status_message") {
                    setToken("tk_status_message", value);
                    tk_status_message = value;
                  }
                }
              }
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  function clearDataHost(tk_data_host, tk_comment) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_reset";

    // Create a dictionary to store the field names and values
    var record = {
      data_host: tk_data_host,
      update_comment: tk_comment,
    };

    $.ajax({
      url: myendpoint_URl,
      type: "POST",
      async: true,
      contentType: "application/json",
      dataType: "text",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      },
      data: JSON.stringify(record),
      success: function (returneddata) {
        // Nothind to do yet
      },
      error: function (xhr, textStatus, error) {
        message =
          "server response: " +
          xhr.responseText +
          "\n - http response: " +
          error;

        // Audit
        action = "failure";
        change_type = "reset data";
        object = tk_data_host;
        object_category = "data_host";
        object_attrs = "N/A";
        result = message;
        comment = tk_comment;
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );

        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(message);
        $("#modal_update_collection_failure_return").modal();
      },
    });

    // Perform a target search to update key values
    var searchQuery =
      '| savedsearch "TrackMe - Data host entity refresh" host=' + tk_data_host;

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-4h",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        { period: 200 },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];
                }
              }
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  function clearMetricHost(tk_metric_host, tk_comment) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/metric_hosts/mh_reset";

    // Create a dictionary to store the field names and values
    var record = {
      metric_host: tk_metric_host,
      update_comment: tk_comment,
    };

    $.ajax({
      url: myendpoint_URl,
      type: "POST",
      async: true,
      contentType: "application/json",
      dataType: "text",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      },
      data: JSON.stringify(record),
      success: function (returneddata) {
        // Nothind to do yet
      },
      error: function (xhr, textStatus, error) {
        message =
          "server response: " +
          xhr.responseText +
          "\n - http response: " +
          error;

        // Audit
        action = "failure";
        change_type = "reset metrics";
        object = tk_metric_host;
        object_category = "metric_host";
        object_attrs = "N/A";
        result = message;
        comment = tk_comment;
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );

        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(message);
        $("#modal_update_collection_failure_return").modal();
      },
    });

    // Perform a target search to update key values
    var searchQuery =
      '| savedsearch trackme_update_metric_host_target_by_metric_host host="' +
      tk_metric_host +
      '"';

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-5m",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        { period: 200 },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];
                }
              }
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  function updateMetricHost(tk_keyid) {
    // Perform a target search to update key values
    var searchQuery =
      '| savedsearch trackme_get_metric_host_table_by_key key="' +
      tk_keyid +
      '"';

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-5m",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        { period: 200 },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];

                  // update state color
                  if (field == "metric_host_state") {
                    setToken("tk_metric_host_state", value);
                    tk_metric_host_state = value;
                    // Dynamically manage state color
                    if (tk_metric_host_state == "green") {
                      setToken("tk_metric_host_state_class", "title_green");
                      setToken(
                        "tk_metric_host_status_message_class",
                        "status_message_green"
                      );
                    } else if (tk_metric_host_state == "orange") {
                      setToken("tk_metric_host_state_class", "title_orange");
                      setToken(
                        "tk_metric_host_status_message_class",
                        "status_message_orange"
                      );
                    } else if (tk_metric_host_state == "blue") {
                      setToken("tk_metric_host_state_class", "title_blue");
                      setToken(
                        "tk_metric_host_status_message_class",
                        "status_message_blue"
                      );
                    } else if (tk_metric_host_state == "red") {
                      setToken("tk_metric_host_state_class", "title_red");
                      setToken(
                        "tk_metric_host_status_message_class",
                        "status_message_red"
                      );
                    }
                  }

                  // update priority color
                  if (field == "priority") {
                    setToken("tk_priority", value);
                    tk_priority = value;
                    // Dynamically manage state color
                    if (tk_priority == "low") {
                      setToken("tk_priority_class", "title_low_priority");
                    } else if (tk_priority == "medium") {
                      setToken("tk_priority_class", "title_medium_priority");
                    } else if (tk_priority == "high") {
                      setToken("tk_priority_class", "title_high_priority");
                    }
                  }

                  // update monitored state
                  if (field == "metric_monitored_state") {
                    setToken("tk_metric_monitored_state", value);
                    tk_metric_monitored_state = value;
                    // Dynamically manage state color
                    if (tk_metric_monitored_state == "enabled") {
                      document.getElementById(
                        "btn_enable_monitoring"
                      ).disabled = true;
                      document.getElementById(
                        "btn_disable_monitoring"
                      ).disabled = false;
                      setToken(
                        "tk_metric_monitored_state_class",
                        "title_green"
                      );
                    } else {
                      document.getElementById(
                        "btn_enable_monitoring"
                      ).disabled = false;
                      document.getElementById(
                        "btn_disable_monitoring"
                      ).disabled = true;
                      setToken("tk_metric_monitored_state_class", "title_grey");
                    }
                  }

                  // update last time
                  if (field == "last time") {
                    setToken("tk_metric_last_time_seen_human", value);
                    tk_metric_last_time_seen_human = value;
                  }

                  // update flip
                  if (field == "latest_flip_time (translated)") {
                    setToken("tk_latest_flip_time_human", value);
                    tk_latest_flip_time_human = value;
                  }

                  if (field == "latest_flip_state") {
                    setToken("tk_latest_flip_state", value);
                    tk_latest_flip_state = value;
                  }

                  // update status_message
                  if (field == "status_message") {
                    setToken("tk_status_message", value);
                    tk_status_message = value;
                  }
                }
              }
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  function updateDataSourceEntity(
    tk_data_name,
    tk_data_index,
    tk_data_sourcetype
  ) {
    // First retrieve the name of the search to run depending on the context

    // Define the query
    var searchQuery =
      '| `trackme_get_tracker_data_source("' +
      tk_data_name +
      '", "' +
      tk_data_index +
      '", "' +
      tk_data_sourcetype +
      '")`';

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-4h",
    };

    // Run a oneshot search that returns the job's results
    service.oneshotSearch(searchQuery, searchParams, function (err, results) {
      // Display the results
      var fields = results.fields;
      var rows = results.rows;
      var current_maintenance_mode;
      var current_time_updated;

      for (var i = 0; i < rows.length; i++) {
        var values = rows[i];

        for (var j = 0; j < values.length; j++) {
          var field = fields[j];

          if (fields[j] == "savedsearch_name") {
            savedsearch_name = values[j];
          }
        }
      }

      var searchQuery = "| savedsearch " + savedsearch_name;

      // Set the search parameters
      var searchParams = {
        exec_mode: "normal",
        earliest_time: "-4h",
      };

      service.search(searchQuery, searchParams, function (err, job) {
        // Poll the status of the search job
        job.track(
          { period: 200 },
          {
            done: function (job) {
              // Get the results and print them
              job.results({}, function (err, results, job) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];
                  }
                }
              });
            },
            failed: function (job) {},
            error: function (err) {
              done(err);
            },
          }
        );
      });
    });
  }

  function updateDataHostEntity(tk_summary_report, tk_data_host) {
    // Perform a target search to update key values
    var searchQuery =
      '| savedsearch "TrackMe - Data host entity refresh" host=' + tk_data_host;

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-4h",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        { period: 200 },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];
                }
              }
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  // This function generates outliers statistics and be called when the outliers period calculaton is changed

  function metricOutliersGen(object_category, object, TargetOutlierTimePeriod) {
    // Perform a target search to update key values
    var searchQuery =
      "| `trackme_outliers_gen_metrics(" +
      object_category +
      "," +
      object +
      "," +
      TargetOutlierTimePeriod +
      ")`";

    // Set the search parameters
    var searchParams = {
      exec_mode: "normal",
      earliest_time: "-30d",
    };

    service.search(searchQuery, searchParams, function (err, job) {
      // Poll the status of the search job
      job.track(
        {
          period: 200,
        },
        {
          done: function (job) {
            // Get the results and print them
            job.results({}, function (err, results, job) {
              var fields = results.fields;
              var rows = results.rows;
              for (var i = 0; i < rows.length; i++) {
                var values = rows[i];
                for (var j = 0; j < values.length; j++) {
                  var field = fields[j];
                  var value = values[j];
                }
              }

              // Perform a target search to update key values
              var searchQuery =
                "| `trackme_summary_investigator_mstats(" +
                object_category +
                "," +
                object +
                ")`" +
                ' `trackme_summary_investigator_define_bound_abstract` | eval key = md5(object_category . ":" . object) | `trackme_outputlookup(trackme_summary_investigator_volume_outliers, key)` | stats c';

              // Set the search parameters
              var searchParams = {
                exec_mode: "normal",
                earliest_time: "-30d",
              };

              service.search(searchQuery, searchParams, function (err, job) {
                // Poll the status of the search job
                job.track(
                  {
                    period: 200,
                  },
                  {
                    done: function (job) {
                      // Get the results and print them
                      job.results({}, function (err, results, job) {
                        var fields = results.fields;
                        var rows = results.rows;
                        for (var i = 0; i < rows.length; i++) {
                          var values = rows[i];
                          for (var j = 0; j < values.length; j++) {
                            var field = fields[j];
                            var value = values[j];
                          }
                        }
                      });
                    },
                    failed: function (job) {},
                    error: function (err) {
                      done(err);
                    },
                  }
                );
              });
            });
          },
          failed: function (job) {},
          error: function (err) {
            done(err);
          },
        }
      );
    });
  }

  //
  // ALERT SUMMARY
  //

  $("#btn_refresh_alerts").click(function () {
    submitTokens();
    search_alerts_main_table.startSearch();
    searchDonutAlertsTriggered.startSearch();
    searchAlertTriggeredOverTime.startSearch();
  });

  $("#btn_refresh_alert_tracking").click(function () {
    submitTokens();
    searchAlertTriggeredOverTimePerAlert.startSearch();
    searchPopulateAlertActionsAck.startSearch();
    searchPopulateAlertActionsSmartStatus.startSearch();
    searchPopulateAlertActionsFreeStyle.startSearch();
    searchAlertActionsTriggeredOverTimePerAlert.startSearch();
    searchAlertActionsAckEventsOverTimePerAlert.startSearch();
    searchAlertActionsSmartStatusdEventsOverTimePerAlert.startSearch();
    searchAlertActionsFreeStyleEventsOverTimePerAlert.startSearch();
  });

  $("#btn_create_alert").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // fire up some searches
    setToken("start_get_tags_for_custom_alert", "true");

    $("#add_custom_alert").modal();
  });

  $("#btn_modal_custom_alert_add_new").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_custom_alert_name = tokens.get("tk_input_custom_alert_name");
    var tk_input_create_alert_data_source = tokens.get(
      "create_alert_data_source"
    );
    var tk_input_create_alert_data_host = tokens.get("create_alert_data_host");
    var tk_input_create_alert_metric_host = tokens.get(
      "create_alert_metric_host"
    );
    var tk_input_custom_alert_priority = tokens.get(
      "tk_input_custom_alert_priority"
    );
    var tk_input_custom_alert_state = tokens.get("tk_input_custom_alert_state");
    var tk_input_custom_alert_data_source_filter = tokens.get(
      "tk_input_custom_alert_data_source_filter"
    );
    var tk_input_custom_alert_data_host_filter = tokens.get(
      "tk_input_custom_alert_data_host_filter"
    );
    var tk_input_custom_alert_metric_host_filter = tokens.get(
      "tk_input_custom_alert_metric_host_filter"
    );
    var tk_input_custom_tags = tokens.get("tk_input_custom_tags");
    var tk_input_custom_alert_trigger_on_outliers = tokens.get(
      "tk_input_custom_alert_trigger_on_outliers"
    );
    var tk_input_custom_alert_trigger_on_outliers_data_host = tokens.get(
      "tk_input_custom_alert_trigger_on_outliers_data_host"
    );
    var tk_input_custom_alert_trigger_on_data_sampling = tokens.get(
      "tk_input_custom_alert_trigger_on_data_sampling"
    );
    var tk_input_custom_alert_cron = tokens.get("tk_input_custom_alert_cron");
    var tk_input_custom_alert_suppress_fields = tokens.get(
      "tk_input_custom_alert_suppress_fields"
    );
    var tk_input_custom_alert_suppress_period = tokens.get(
      "tk_input_custom_alert_suppress_period"
    );
    var tk_input_custom_alert_time_filtering = tokens.get(
      "tk_input_custom_alert_time_filtering"
    );
    var tk_input_custom_alert_smart_status = tokens.get(
      "tk_input_custom_alert_smart_status"
    );
    var tk_input_custom_alert_auto_ack = tokens.get(
      "tk_input_custom_alert_auto_ack"
    );

    // Splunk limits report names to max 100 chars, and will refuse otherwise
    var tk_tracker_name = tk_input_custom_alert_name.substring(0, 100);

    // define the alert search
    var tk_custom_alert;
    var tk_object_category;

    if (tk_input_create_alert_data_source == "true") {
      tk_object_category = "data_source";
      tk_custom_alert =
        '| inputlookup trackme_data_source_monitoring\n| appendcols [ | inputlookup trackme_maintenance_mode ] | filldown maintenance_mode | where NOT maintenance_mode="enabled"';

      // get state
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_eval_data_source_state`";

      // add the data_name filter
      tk_custom_alert =
        tk_custom_alert +
        '\n| search data_name="' +
        tk_input_custom_alert_data_source_filter +
        '"';

      // add the priority filter
      tk_custom_alert =
        tk_custom_alert + "\n| search " + tk_input_custom_alert_priority;

      // add the state filter
      tk_custom_alert =
        tk_custom_alert +
        '\n| eval state=coalesce(data_source_state,data_host_state,metric_host_state) | where (state="red" OR state="orange") | search ' +
        tk_input_custom_alert_state;

      // handle tags
      if (tk_input_custom_tags != 'tags="*"') {
        tk_custom_alert =
          tk_custom_alert +
          '\n| makemv delim="," tags | search ' +
          tk_input_custom_tags;
      }

      // handle outliers
      if (tk_input_custom_alert_trigger_on_outliers == "false") {
        tk_custom_alert = tk_custom_alert + "\n| where isOutlier=0 ";
      }

      // handle data sampling
      if (tk_input_custom_alert_trigger_on_data_sampling == "false") {
        tk_custom_alert = tk_custom_alert + "\n| where isAnomaly=0";
      }

      // terminate the search
      tk_custom_alert =
        tk_custom_alert +
        "\n| search `trackme_get_idx_whitelist_searchtime(trackme_data_source_monitoring_whitelist_index, data_index)`";
      tk_custom_alert = tk_custom_alert + "\n| `apply_data_source_blacklists`";
      tk_custom_alert =
        tk_custom_alert + '\n| where data_monitored_state="enabled"';

      // handle time filtering
      tk_custom_alert =
        tk_custom_alert + "\n| `" + tk_input_custom_alert_time_filtering + "`";

      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(data_last_ingest)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(data_last_time_seen)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(data_tracker_runtime)`";
      tk_custom_alert =
        tk_custom_alert +
        "\n| `trackme_date_format(data_previous_tracker_runtime)`";
      tk_custom_alert = tk_custom_alert + "\n| `trackme_eval_icons`";
      tk_custom_alert = tk_custom_alert + '\n| rename "* (translated)" as "*"';
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_get_identity_card(data_name)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_ack_lookup(data_name, data_source)`";
      tk_custom_alert = tk_custom_alert + "\n| fields - monitoring, state";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_alerts_order_data_source`";
    } else if (tk_input_create_alert_data_host == "true") {
      tk_object_category = "data_host";
      tk_custom_alert =
        '| inputlookup trackme_host_monitoring\n| appendcols [ | inputlookup trackme_maintenance_mode ] | filldown maintenance_mode | where NOT maintenance_mode="enabled"';

      // get state
      tk_custom_alert = tk_custom_alert + "\n| `trackme_eval_data_host_state`";

      // add the data_host filter
      tk_custom_alert =
        tk_custom_alert +
        '\n| search data_host="' +
        tk_input_custom_alert_data_host_filter +
        '"';

      // add the priority filter
      tk_custom_alert =
        tk_custom_alert + "\n| search " + tk_input_custom_alert_priority;

      // add the state filter
      tk_custom_alert =
        tk_custom_alert +
        '\n| eval state=coalesce(data_source_state,data_host_state,metric_host_state) | where (state="red" OR state="orange") | search ' +
        tk_input_custom_alert_state;

      // handle outliers
      if (tk_input_custom_alert_trigger_on_outliers == "false") {
        tk_custom_alert = tk_custom_alert + "\n| where isOutlier=0 ";
      }

      // terminate the search
      tk_custom_alert = tk_custom_alert + '\n| makemv delim="," data_index';
      tk_custom_alert =
        tk_custom_alert + '\n| makemv delim="," data_sourcetype';
      tk_custom_alert =
        tk_custom_alert + '\n| makemv delim="," data_host_st_summary';
      tk_custom_alert =
        tk_custom_alert +
        "\n| `trackme_data_host_extract_mvstsummary` | fields - summary_first_time	summary_idx	summary_last_ingest	time, data_host_st_summary";
      tk_custom_alert =
        tk_custom_alert +
        "\n| search `trackme_get_idx_whitelist_searchtime(trackme_data_host_monitoring_whitelist_index, data_index)`";
      tk_custom_alert = tk_custom_alert + "\n| `apply_data_host_blacklists`";
      tk_custom_alert =
        tk_custom_alert + '\n| where data_monitored_state="enabled"';

      // handle time filtering
      tk_custom_alert =
        tk_custom_alert + "\n| `" + tk_input_custom_alert_time_filtering + "`";

      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_data_host_group_lookup`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(data_last_ingest)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(data_last_time_seen)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(data_tracker_runtime)`";
      tk_custom_alert =
        tk_custom_alert +
        "\n| `trackme_date_format(data_previous_tracker_runtime)`";
      tk_custom_alert = tk_custom_alert + "\n| `trackme_eval_icons_host`";
      tk_custom_alert = tk_custom_alert + '\n| rename "* (translated)" as "*"';
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_ack_lookup(data_host, data_host)`";
      tk_custom_alert =
        tk_custom_alert +
        "\n| fields - monitoring, state, data_index, data_sourcetype";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_alerts_order_data_host`";
    } else if (tk_input_create_alert_metric_host == "true") {
      tk_object_category = "metric_host";
      tk_custom_alert =
        '| inputlookup trackme_metric_host_monitoring\n| appendcols [ | inputlookup trackme_maintenance_mode ] | filldown maintenance_mode | where NOT maintenance_mode="enabled"';

      // add the metric_host filter
      tk_custom_alert =
        tk_custom_alert +
        '\n| search metric_host="' +
        tk_input_custom_alert_metric_host_filter +
        '"';

      // add the priority filter
      tk_custom_alert =
        tk_custom_alert + "\n| search " + tk_input_custom_alert_priority;

      // add the state filter
      tk_custom_alert =
        tk_custom_alert +
        '\n| eval state=coalesce(data_source_state,data_host_state,metric_host_state) | where (state="red" OR state="orange") | search ' +
        tk_input_custom_alert_state;

      // terminate the search
      tk_custom_alert = tk_custom_alert + '\n| makemv delim="," metric_index';
      tk_custom_alert =
        tk_custom_alert +
        "\n| search `trackme_get_idx_whitelist_searchtime(trackme_metric_host_monitoring_whitelist_index, metric_index)`";
      tk_custom_alert = tk_custom_alert + "\n| `apply_metric_host_blacklists`";
      tk_custom_alert =
        tk_custom_alert + '\n| where metric_monitored_state="enabled"';

      // handle time filtering
      tk_custom_alert =
        tk_custom_alert + "\n| `" + tk_input_custom_alert_time_filtering + "`";

      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(metric_last_time_seen)`";
      tk_custom_alert =
        tk_custom_alert +
        "\n| eval \"last time\"='metric_last_time_seen (translated)'";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_date_format(metric_tracker_runtime)`";
      tk_custom_alert =
        tk_custom_alert +
        "\n| `trackme_date_format(metric_previous_tracker_runtime)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_eval_icons_metric_host`";
      tk_custom_alert = tk_custom_alert + '\n| rename "* (translated)" as "*"';
      tk_custom_alert =
        tk_custom_alert + '\n| makemv metric_category delim=","';
      tk_custom_alert = tk_custom_alert + '\n| makemv metric_details delim=","';
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_ack_lookup(metric_host, metric_host)`";
      tk_custom_alert =
        tk_custom_alert + "\n| `trackme_alerts_order_metric_host`";
    }

    function done(err) {
      //error handling logic here
    }

    var alertOptions;

    // Specify properties for the alert.
    if (
      tk_input_custom_alert_auto_ack == "1" &&
      tk_input_custom_alert_smart_status == "1"
    ) {
      alertOptions = {
        name: tk_tracker_name,
        description: "TrackMe alert",
        search: tk_custom_alert,
        alert_type: "always",
        "alert.severity": "5",
        "alert.suppress": "1",
        "alert.suppress.fields": tk_input_custom_alert_suppress_fields,
        "alert.suppress.period": tk_input_custom_alert_suppress_period,
        "alert.track": "1",
        "dispatch.earliest_time": "-5m",
        "dispatch.latest_time": "now",
        is_scheduled: "1",
        alert_comparator: "greater than",
        alert_type: "number of events",
        alert_threshold: "0",
        "alert.digest_mode": "0",
        cron_schedule: tk_input_custom_alert_cron,
        actions: "trackme_auto_ack,trackme_smart_status",
        "action.trackme_auto_ack.param.object_category":
          "$result.object_category$",
        "action.trackme_auto_ack.param.object_name": "$result.object$",
        "action.trackme_smart_status.param.object_category":
          "$result.object_category$",
        "action.trackme_smart_status.param.object_name": "$result.object$",
      };
    } else if (tk_input_custom_alert_auto_ack == "1") {
      alertOptions = {
        name: tk_tracker_name,
        description: "TrackMe alert",
        search: tk_custom_alert,
        alert_type: "always",
        "alert.severity": "1",
        "alert.suppress": "1",
        "alert.suppress.fields": tk_input_custom_alert_suppress_fields,
        "alert.suppress.period": tk_input_custom_alert_suppress_period,
        "alert.track": "1",
        "dispatch.earliest_time": "-5m",
        "dispatch.latest_time": "now",
        is_scheduled: "1",
        cron_schedule: tk_input_custom_alert_cron,
        actions: "trackme_auto_ack",
        "action.trackme_auto_ack.param.object_category":
          "$result.object_category$",
        "action.trackme_auto_ack.param.object_name": "$result.object$",
      };
    } else if (tk_input_custom_alert_smart_status == "1") {
      alertOptions = {
        name: tk_tracker_name,
        description: "TrackMe alert",
        search: tk_custom_alert,
        alert_type: "always",
        "alert.severity": "1",
        "alert.suppress": "1",
        "alert.suppress.fields": tk_input_custom_alert_suppress_fields,
        "alert.suppress.period": tk_input_custom_alert_suppress_period,
        "alert.track": "1",
        "dispatch.earliest_time": "-5m",
        "dispatch.latest_time": "now",
        is_scheduled: "1",
        cron_schedule: tk_input_custom_alert_cron,
        actions: "trackme_smart_status",
        "action.trackme_smart_status.param.object_category":
          "$result.object_category$",
        "action.trackme_smart_status.param.object_name": "$result.object$",
      };
    } else {
      alertOptions = {
        name: tk_tracker_name,
        description: "TrackMe alert",
        search: tk_custom_alert,
        alert_type: "always",
        "alert.severity": "1",
        "alert.suppress": "1",
        "alert.suppress.fields": tk_input_custom_alert_suppress_fields,
        "alert.suppress.period": tk_input_custom_alert_suppress_period,
        "alert.track": "1",
        "dispatch.earliest_time": "-5m",
        "dispatch.latest_time": "now",
        is_scheduled: "1",
        cron_schedule: tk_input_custom_alert_cron,
      };
    }

    // Create a saved search/report as an alert.
    service.savedSearches().create(alertOptions, function (err, alert) {
      // Error checking.
      if (err && err.status === 409) {
        msg =
          "ERROR: A saved search/report with the name " +
          alertOptions.name +
          " already exists";

        // Audit
        action = "failure";
        change_type = "add custom alert";
        object = tk_tracker_name;
        object_category = tk_object_category;
        object_attrs = tk_custom_alert;
        result = msg;
        comment = "N/A";
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );

        $("#modal_alert_creation_error")
          .find(".modal-error-message p")
          .text(msg);
        $("#add_custom_alert").modal("hide");
        $("#modal_alert_creation_error").modal();
        done();
        return;
      } else if (err) {
        msg =
          "There was an error creating the saved search/report: error code " +
          err.status;

        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr =
            "error code: " + err.status + " - " + err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(
            "error code: " + err.status + " - " + err.data.messages
          );
        }

        // Audit
        action = "failure";
        change_type = "add custom alert";
        object = tk_tracker_name;
        object_category = tk_object_category;
        object_attrs = tk_custom_alert;
        result = errorStr;
        comment = "N/A";
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );

        $("#modal_alert_creation_error")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#add_custom_alert").modal("hide");
        $("#modal_alert_creation_error").modal();
        done(err);
        return;
      } else {
        // Confirmation message.

        // Audit
        action = "success";
        change_type = "add custom alert";
        object = tk_tracker_name;
        object_category = tk_object_category;
        object_attrs = tk_custom_alert;
        result = "N/A";
        comment = "N/A";
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );

        msg = "Created saved search/report as alert: " + alert.name;
        $("#modal_alert_creation_success")
          .find(".modal-error-message p")
          .text(msg);
        $("#add_custom_alert").modal("hide");
        $("#modal_alert_creation_success").modal();

        search_alerts_main_table.startSearch();
        searchDonutAlertsTriggered.startSearch();
        searchAlertTriggeredOverTime.startSearch();

        done();
      }
    });
  });

  // enable monitoring

  $("#btn_enable_monitoring").click(function (mode) {
    // Hide main modal
    $("#modal_manage").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_enable_monitoring";

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // Create a dictionary to store the field names and values
        var record = {
          data_name: tk_data_name,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Run the search again to update the table
            searchDataSourcesMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "enable monitoring";
            object = tk_data_name;
            object_category = "data_source";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      });
    }
  });

  $("#btn_enable_monitoring_host").click(function (mode) {
    // Hide main modal
    $("#modal_manage_host").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_enable_monitoring";

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // Create a dictionary to store the field names and values
        var record = {
          data_host: tk_data_host,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Run the search again to update the table
            searchDataHostsMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "enable monitoring";
            object = tk_data_host;
            object_category = "data_host";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      });
    }
  });

  // refresh data_source
  $("#btn_refresh_data_source").click(function (mode) {
    // notify
    notification("Refresh completed.", 6000);
    searchSingleLag.startSearch();
    searchSingleByMetricsLag.startSearch();
    searchChartLag.startSearch();
    searchSingleSLApct.startSearch();
    searchOutlierDetectionChart.startSearch();
    searchOutlierDetectionTable.startSearch();
    searchLaggingMetricDataSource.startSearch();
    searchDataSourceMainAuditFlip.startSearch();
    searchDataSourceMainAuditChanges.startSearch();
    SearchDataSourceParsingQualityMain.startSearch();
    searchDataSourceTimeline.startSearch();
    // call update summary investigator for that entity only
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    updateDataSourceEntity(tk_data_name, tk_data_index, tk_data_sourcetype);
    // call update data source
    var tk_keyid = tokens.get("tk_keyid");
    updateDataSource(tk_keyid);
  });

  // refresh data_host
  $("#btn_refresh_data_host").click(function (mode) {
    // notify
    notification("Refresh completed.", 6000);
    searchSingleLagHost.startSearch();
    searchSingleLagByMetricsHost.startSearch();
    searchChartHostBaseSearch.startSearch();
    searchChartLagHostOverTime.startSearch();
    searchSingleSLAHostpct.startSearch();
    searchOutlierDetectionChartDataHost.startSearch();
    searchOutlierDetectionTableDataHost.startSearch();
    searchLaggingMetricDataHost.startSearch();
    searchDataHostMainAuditFlip.startSearch();
    searchDataHostMainAuditChanges.startSearch();
    SearchDataHostParsingQualityMain.startSearch();
    searchDataHostTimeline.startSearch();

    // call update summary investigator for that entity only
    var tk_data_host = tokens.get("tk_data_host");
    updateDataHostEntity("trackme_datahost_tracker_shorterm", tk_data_host);
    // call update data host
    var tk_keyid = tokens.get("tk_keyid");
    updateDataHost(tk_keyid);
  });

  // refresh metric_host
  $("#btn_refresh_metric_host").click(function (mode) {
    // notify
    notification("Refresh completed.", 6000);
    searchHostTableMetricHost.startSearch();
    searchSingleSLAMetricHostpct.startSearch();
    searchMetricHostMainAuditFlip.startSearch();
    searchMetricHostMainAuditChanges.startSearch();
    searchMetricHostTimeline.startSearch();

    var tk_keyid = tokens.get("tk_keyid");
    // call update metric host
    updateMetricHost(tk_keyid);
  });

  $("#btn_enable_monitoring_metric_host").click(function (mode) {
    // Hide main modal
    $("#modal_manage_metric_host").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/metric_hosts/mh_enable_monitoring";

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // Create a dictionary to store the field names and values
        var record = {
          metric_host: tk_metric_host,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Run the search again to update the table
            searchMetricHostsMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "enable monitoring";
            object = tk_metric_host;
            object_category = "metric_host";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      });
    }
  });

  // cancel button: returns to selected
  $("#btn_close_metric_host_unified").click(function () {
    submitTokens();

    // Show modal
    $("#modal_manage_metric_host").modal();
  });

  // metric host priority
  $("#btn_modal_modify_priority_metric_host_confirm").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");
    var tk_priority = tokens.get("tk_priority");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/metric_hosts/mh_update_priority";

    var tk_origin_priority = tk_priority;
    var tk_new_priority = tokens.get("tk_input_metric_host_priority");

    if (!tk_new_priority || !tk_new_priority.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        metric_host: tk_metric_host,
        priority: tk_new_priority,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchMetricHostsMain.startSearch();

          // notify
          notification("Modification has been registered successfully.", 2000);

          // call update data source
          updateMetricHost(tk_keyid);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify priority";
          object = tk_metric_host;
          object_category = "metric_host";
          object_attrs =
            "priority changed from:" +
            tk_origin_priority +
            " to:" +
            tk_new_priority;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // disable monitoring

  $("#btn_disable_monitoring").click(function (mode) {
    // Hide main modal
    $("#modal_manage").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_disable_monitoring";

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // Create a dictionary to store the field names and values
        var record = {
          data_name: tk_data_name,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Run the search again to update the table
            searchDataSourcesMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "disable monitoring";
            object = tk_data_name;
            object_category = "data_source";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      });
    }
  });

  $("#btn_disable_monitoring_host").click(function (mode) {
    // Hide main modal
    $("#modal_manage_host").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_disable_monitoring";

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // Create a dictionary to store the field names and values
        var record = {
          data_host: tk_data_host,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Run the search again to update the table
            searchDataHostsMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "disable monitoring";
            object = tk_data_host;
            object_category = "data_host";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      });
    }
  });

  $("#btn_disable_monitoring_metric_host").click(function (mode) {
    // Hide main modal
    $("#modal_manage_metric_host").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/metric_hosts/mh_disable_monitoring";

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // Create a dictionary to store the field names and values
        var record = {
          metric_host: tk_metric_host,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Run the search again to update the table
            searchMetricHostsMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "disable monitoring";
            object = tk_metric_host;
            object_category = "metric_host";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      });
    }
  });

  //
  // RESET BUTTON
  //

  $("#btn_reset_metric_host").click(function (mode) {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get tokens
    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");

    // Hide main modal
    $("#modal_manage_metric_host").modal("hide");

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // notify
        notification("Reset completed.", 6000);
        // call reset metric host
        clearMetricHost(tk_metric_host, tk_comment);
        searchHostTableMetricHost.startSearch();
        searchSingleSLAMetricHostpct.startSearch();
        searchMetricHostMainAuditFlip.startSearch();
        searchMetricHostMainAuditChanges.startSearch();
        // call update metric host
        updateMetricHost(tk_keyid);

        // Return to modal
        $("#modal_manage_metric_host").modal();
      });
    }
  });

  //
  // DELETE BUTTON
  //

  $("#btn_delete_metric_host").click(function () {
    // Hide main modal
    $("#modal_manage_metric_host").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");
    var tk_metric_index = tokens.get("tk_metric_index");
    var tk_metric_category = tokens.get("tk_metric_category");
    var tk_metric_details = tokens.get("tk_metric_details");
    var tk_metric_last_lag_seen = tokens.get("tk_metric_last_lag_seen");
    var tk_metric_first_time_seen = tokens.get("tk_metric_first_time_seen");
    var tk_metric_last_time_seen = tokens.get("tk_metric_last_time_seen");
    var tk_metric_host_state = tokens.get("tk_metric_host_state");
    var tk_metric_tracker_runtime = tokens.get("tk_metric_tracker_runtime");
    var tk_metric_previous_host_state = tokens.get(
      "tk_metric_previous_host_state"
    );
    var tk_metric_previous_tracker_runtime = tokens.get(
      "tk_metric_previous_tracker_runtime"
    );
    var tk_metric_monitored_state = "disabled";
    var tk_latest_flip_state = tokens.get("tk_latest_flip_state");
    var tk_latest_flip_time = tokens.get("tk_latest_flip_time");
    var tk_priority = tokens.get("tk_priority");

    // Create a dictionary to store the field names and values
    var record = {
      metric_host: tk_metric_host,
      metric_index: tk_metric_index,
      metric_category: tk_metric_category,
      metric_details: tk_metric_details,
      metric_last_lag_seen: tk_metric_last_lag_seen,
      metric_first_time_seen: tk_metric_first_time_seen,
      metric_last_time_seen: tk_metric_last_time_seen,
      metric_monitored_state: tk_metric_monitored_state,
      metric_host_state: tk_metric_host_state,
      metric_tracker_runtime: tk_metric_tracker_runtime,
      metric_previous_host_state: tk_metric_previous_host_state,
      metric_previous_tracker_runtime: tk_metric_previous_tracker_runtime,
      latest_flip_state: tk_latest_flip_state,
      latest_flip_time: tk_latest_flip_time,
      priority: tk_priority,
    };

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring/" +
      tk_keyid;

    if (tk_keyid && tk_keyid.length) {
      $("#modal_entry_deletion").modal();

      $("#btn_modal_entry_deletion_temporary")
        .unbind("click")
        .click(function () {
          var that = $(this);
          that.off("click"); // remove handler

          $("#modal_entry_modification").modal();

          $("#btn_modal_entry_modification").click(function () {
            var that = $(this);
            that.off("click"); // remove handler

            // Retrieve update comment if any
            var tk_comment = document.getElementById(
              "input_update_comment"
            ).value;

            // if is not defined, give it a value and override text box content
            if (tk_comment == "null") {
              setToken(
                "tk_update_comment",
                TokenUtils.replaceTokenNames(
                  "No comments for update.",
                  _.extend(submittedTokenModel.toJSON(), e.data)
                )
              );
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            } else if (tk_comment == "update note") {
              tk_comment = "No comment for update.";
              document.getElementById("input_update_comment").value =
                "update note";
            } else {
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            }

            $.ajax({
              url: myendpoint_URl,
              type: "DELETE",
              async: true,
              contentType: "application/json",
              success: function (returneddata) {
                // Run the search again to update the table
                searchMetricHostsMain.startSearch();

                // Audit
                action = "success";
                change_type = "delete temporary";
                object = tk_metric_host;
                object_category = "metric_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
                tk_keyid = undefined;
                delete tk_keyid;
                return;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;

                // Audit
                action = "failure";
                change_type = "delete temporary";
                object = tk_metric_host;
                object_category = "metric_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = message;
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(message);
                $("#modal_update_collection_failure_return").modal();
              },
            });
          });
        });

      $("#btn_modal_entry_deletion")
        .unbind("click")
        .click(function () {
          var that = $(this);
          that.off("click"); // remove handler

          $("#modal_entry_modification").modal();

          $("#btn_modal_entry_modification").click(function () {
            var that = $(this);
            that.off("click"); // remove handler

            // Retrieve update comment if any
            var tk_comment = document.getElementById(
              "input_update_comment"
            ).value;

            // if is not defined, give it a value and override text box content
            if (tk_comment == "null") {
              setToken(
                "tk_update_comment",
                TokenUtils.replaceTokenNames(
                  "No comments for update.",
                  _.extend(submittedTokenModel.toJSON(), e.data)
                )
              );
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            } else if (tk_comment == "update note") {
              tk_comment = "No comment for update.";
              document.getElementById("input_update_comment").value =
                "update note";
            } else {
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            }

            $.ajax({
              url: myendpoint_URl,
              type: "DELETE",
              async: true,
              contentType: "application/json",
              success: function (returneddata) {
                // Run the search again to update the table
                searchMetricHostsMain.startSearch();

                // Audit
                action = "success";
                change_type = "delete permanent";
                object = tk_metric_host;
                object_category = "metric_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
                tk_keyid = undefined;
                delete tk_keyid;
                return;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;

                // Audit
                action = "failure";
                change_type = "delete permanent";
                object = tk_metric_host;
                object_category = "metric_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = message;
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(message);
                $("#modal_update_collection_failure_return").modal();
              },
            });
          });
        });
    }
  });

  // delete entry

  $("#btn_delete_data_source").click(function () {
    // Hide main modal
    $("#modal_manage").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_data_last_lag_seen = tokens.get("tk_data_last_lag_seen");
    var tk_data_last_ingestion_lag_seen = tokens.get(
      "tk_data_last_ingestion_lag_seen"
    );
    var tk_data_eventcount = tokens.get("tk_data_eventcount");
    var tk_data_first_time_seen = tokens.get("tk_data_first_time_seen");
    var tk_data_last_time_seen = tokens.get("tk_data_last_time_seen");
    var tk_data_last_ingest = tokens.get("tk_data_last_ingest");
    var tk_data_last_lag_seen_idx = tokens.get("tk_data_last_lag_seen_idx");
    var tk_data_last_time_seen_idx = tokens.get("tk_data_last_time_seen_idx");
    var tk_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_lag_alert_kpis = tokens.get("tk_data_lag_alert_kpis");
    var tk_data_monitored_state = tokens.get("tk_data_monitored_state");
    var tk_data_monitoring_level = tokens.get("tk_data_monitoring_level");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");
    var tk_data_override_lagging_class = tokens.get(
      "tk_data_override_lagging_class"
    );
    var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
    var tk_outlierlowerthresholdmultiplier = tokens.get(
      "tk_outlierlowerthresholdmultiplier"
    );
    var tk_outlierupperthresholdmultiplier = tokens.get(
      "tk_outlierupperthresholdmultiplier"
    );
    var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
    var tk_outlier_period = tokens.get("tk_outlier_period");
    var tk_outlier_span = tokens.get("tk_outlier_span");
    var tk_isoutlier = tokens.get("tk_isoutlier");
    var tk_enable_behaviour_analytic = tokens.get(
      "tk_enable_behaviour_analytic"
    );
    var tk_isanomaly = tokens.get("tk_isanomaly");
    var tk_data_sample_lastrun = tokens.get("tk_data_sample_lastrun");
    var tk_latest_flip_state = tokens.get("tk_latest_flip_state");
    var tk_latest_flip_time = tokens.get("tk_latest_flip_time");
    var tk_priority = tokens.get("tk_priority");
    var tk_dcount_host = tokens.get("tk_dcount_host");
    var tk_min_dcount_host = tokens.get("tk_min_dcount_host");
    var tk_tags = tokens.get("tk_tags");

    // Create a dictionary to store the field names and values
    var record = {
      object_category: "data_source",
      data_name: tk_data_name,
      data_index: tk_data_index,
      data_sourcetype: tk_data_sourcetype,
      data_last_lag_seen: tk_data_last_lag_seen,
      data_last_ingestion_lag_seen: tk_data_last_ingestion_lag_seen,
      data_eventcount: tk_data_eventcount,
      data_first_time_seen: tk_data_first_time_seen,
      data_last_time_seen: tk_data_last_time_seen,
      data_last_ingest: tk_data_last_ingest,
      data_last_lag_seen_idx: tk_data_last_lag_seen_idx,
      data_last_time_seen_idx: tk_data_last_time_seen_idx,
      data_max_lag_allowed: tk_data_max_lag_allowed,
      data_lag_alert_kpis: tk_data_lag_alert_kpis,
      data_monitored_state: tk_data_monitored_state,
      data_monitoring_level: tk_data_monitoring_level,
      data_monitoring_wdays: tk_data_monitoring_wdays,
      data_override_lagging_class: tk_data_override_lagging_class,
      OutlierMinEventCount: tk_outliermineventcount,
      OutlierLowerThresholdMultiplier: tk_outlierlowerthresholdmultiplier,
      OutlierUpperThresholdMultiplier: tk_outlierupperthresholdmultiplier,
      OutlierAlertOnUpper: tk_outlieralertonupper,
      OutlierTimePeriod: tk_outlier_period,
      OutlierSpan: tk_outlier_span,
      isOutlier: tk_isoutlier,
      enable_behaviour_analytic: tk_enable_behaviour_analytic,
      isAnomaly: tk_isanomaly,
      data_sample_lastrun: tk_data_sample_lastrun,
      latest_flip_state: tk_latest_flip_state,
      latest_flip_time: tk_latest_flip_time,
      priority: tk_priority,
      dcount_host: tk_dcount_host,
      min_dcount_host: tk_min_dcount_host,
      tags: tk_tags,
    };

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring/" +
      tk_keyid;

    if (tk_keyid && tk_keyid.length) {
      $("#modal_entry_deletion").modal();

      // Delete temporary: change_type will be set to temporary
      $("#btn_modal_entry_deletion_temporary")
        .unbind("click")
        .click(function () {
          var that = $(this);
          that.off("click"); // remove handler

          $("#modal_entry_modification").modal();

          $("#btn_modal_entry_modification").click(function () {
            var that = $(this);
            that.off("click"); // remove handler

            // Retrieve update comment if any
            var tk_comment = document.getElementById(
              "input_update_comment"
            ).value;

            // if is not defined, give it a value and override text box content
            if (tk_comment == "null") {
              setToken(
                "tk_update_comment",
                TokenUtils.replaceTokenNames(
                  "No comments for update.",
                  _.extend(submittedTokenModel.toJSON(), e.data)
                )
              );
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            } else if (tk_comment == "update note") {
              tk_comment = "No comment for update.";
              document.getElementById("input_update_comment").value =
                "update note";
            } else {
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            }

            $.ajax({
              url: myendpoint_URl,
              type: "DELETE",
              async: true,
              contentType: "application/json",
              success: function (returneddata) {
                // Run the search again to update the table
                searchDataSourcesMain.startSearch();

                // Audit
                action = "success";
                change_type = "delete temporary";
                object = tk_data_name;
                object_category = "data_source";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
                tk_keyid = undefined;
                delete tk_keyid;
                return;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;

                // Audit
                action = "failure";
                change_type = "delete temporary";
                object = tk_data_name;
                object_category = "data_source";
                object_attrs = JSON.stringify(record, null, "\t");
                result = message;
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(message);
                $("#modal_update_collection_failure_return").modal();
              },
            });
          });
        });

      // Delete temporary: change_type will be set to permanent
      $("#btn_modal_entry_deletion")
        .unbind("click")
        .click(function () {
          var that = $(this);
          that.off("click"); // remove handler

          $("#modal_entry_modification").modal();

          $("#btn_modal_entry_modification").click(function () {
            var that = $(this);
            that.off("click"); // remove handler

            // Retrieve update comment if any
            var tk_comment = document.getElementById(
              "input_update_comment"
            ).value;

            // if is not defined, give it a value and override text box content
            if (tk_comment == "null") {
              setToken(
                "tk_update_comment",
                TokenUtils.replaceTokenNames(
                  "No comments for update.",
                  _.extend(submittedTokenModel.toJSON(), e.data)
                )
              );
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            } else if (tk_comment == "update note") {
              tk_comment = "No comment for update.";
              document.getElementById("input_update_comment").value =
                "update note";
            } else {
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            }

            $.ajax({
              url: myendpoint_URl,
              type: "DELETE",
              async: true,
              contentType: "application/json",
              success: function (returneddata) {
                // Run the search again to update the table
                searchDataSourcesMain.startSearch();

                // Audit
                action = "success";
                change_type = "delete permanent";
                object = tk_data_name;
                object_category = "data_source";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
                tk_keyid = undefined;
                delete tk_keyid;
                return;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;

                // Audit
                action = "failure";
                change_type = "delete permanent";
                object = tk_data_name;
                object_category = "data_source";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(message);
                $("#modal_update_collection_failure_return").modal();
              },
            });
          });
        });
    }
  });

  //
  // RESET BUTTON
  //

  $("#btn_reset_data_host").click(function (mode) {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get tokens
    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");

    // Hide main modal
    $("#modal_manage_host").modal("hide");

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $("#modal_entry_modification").modal();

      $("#btn_modal_entry_modification").click(function () {
        var that = $(this);
        that.off("click"); // remove handler

        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_update_comment").value;

        // if is not defined, give it a value and override text box content
        if (tk_comment == "null") {
          setToken(
            "tk_update_comment",
            TokenUtils.replaceTokenNames(
              "No comments for update.",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_update_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_update_comment").value = "update note";
        }

        // notify
        notification("Reset completed.", 6000);
        // call reset data host
        var tk_data_host = tokens.get("tk_data_host");
        clearDataHost(tk_data_host, tk_comment);
        searchSingleLagHost.startSearch();
        searchSingleLagByMetricsHost.startSearch();
        searchChartHostBaseSearch.startSearch();
        searchChartLagHostOverTime.startSearch();
        searchSingleSLAHostpct.startSearch();
        searchOutlierDetectionChartDataHost.startSearch();
        searchOutlierDetectionTableDataHost.startSearch();
        searchLaggingMetricDataHost.startSearch();
        searchDataHostMainAuditFlip.startSearch();
        searchDataHostMainAuditChanges.startSearch();
        SearchDataHostParsingQualityMain.startSearch();
        searchDataHostTimeline.startSearch();

        // call update summary investigator for that entity only
        var tk_data_host = tokens.get("tk_data_host");
        updateDataHostEntity("trackme_datahost_tracker_shorterm", tk_data_host);
        // call update data host
        var tk_keyid = tokens.get("tk_keyid");
        updateDataHost(tk_keyid);

        // Return to modal
        $("#modal_manage_host").modal();
      });
    }
  });

  //
  // DELETE BUTTON
  //

  $("#btn_delete_data_host").click(function () {
    // Hide main modal
    $("#modal_manage_host").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_data_host_st_summary = tokens.get("tk_data_host_st_summary");
    var tk_data_host_alerting_policy = tokens.get(
      "tk_data_host_alerting_policy"
    );
    var tk_data_last_lag_seen = tokens.get("tk_data_last_lag_seen");
    var tk_data_last_ingestion_lag_seen = tokens.get(
      "tk_data_last_ingestion_lag_seen"
    );
    var tk_data_eventcount = tokens.get("tk_data_eventcount");
    var tk_data_first_time_seen = tokens.get("tk_data_first_time_seen");
    var tk_data_last_time_seen = tokens.get("tk_data_last_time_seen");
    var tk_data_last_ingest = tokens.get("tk_data_last_ingest");
    var tk_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_lag_alert_kpis = tokens.get("tk_data_lag_alert_kpis");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");
    var tk_data_monitored_state = tokens.get("tk_data_monitored_state");
    var tk_data_override_lagging_class = tokens.get(
      "tk_data_override_lagging_class"
    );
    var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
    var tk_outlierlowerthresholdmultiplier = tokens.get(
      "tk_outlierlowerthresholdmultiplier"
    );
    var tk_outlierupperthresholdmultiplier = tokens.get(
      "tk_outlierupperthresholdmultiplier"
    );
    var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
    var tk_outlier_period = tokens.get("tk_outlier_period");
    var tk_outlier_span = tokens.get("tk_outlier_span");
    var tk_isoutlier = tokens.get("tk_isoutlier");
    var tk_enable_behaviour_analytic = tokens.get(
      "tk_enable_behaviour_analytic"
    );
    var tk_latest_flip_state = tokens.get("tk_latest_flip_state");
    var tk_latest_flip_time = tokens.get("tk_latest_flip_time");
    var tk_priority = tokens.get("tk_priority");

    // Create a dictionary to store the field names and values
    var record = {
      object_category: "data_host",
      data_host: tk_data_host,
      data_index: tk_data_index,
      data_sourcetype: tk_data_sourcetype,
      data_host_st_summary: tk_data_host_st_summary,
      data_host_alerting_policy: tk_data_host_alerting_policy,
      data_last_lag_seen: tk_data_last_lag_seen,
      data_last_ingestion_lag_seen: tk_data_last_ingestion_lag_seen,
      data_eventcount: tk_data_eventcount,
      data_first_time_seen: tk_data_first_time_seen,
      data_last_time_seen: tk_data_last_time_seen,
      data_last_ingest: tk_data_last_ingest,
      data_max_lag_allowed: tk_data_max_lag_allowed,
      data_lag_alert_kpis: tk_data_lag_alert_kpis,
      data_monitored_state: tk_data_monitored_state,
      data_monitoring_wdays: tk_data_monitoring_wdays,
      data_override_lagging_class: tk_data_override_lagging_class,
      OutlierMinEventCount: tk_outliermineventcount,
      OutlierLowerThresholdMultiplier: tk_outlierlowerthresholdmultiplier,
      OutlierUpperThresholdMultiplier: tk_outlierupperthresholdmultiplier,
      OutlierAlertOnUpper: tk_outlieralertonupper,
      OutlierTimePeriod: tk_outlier_period,
      OutlierSpan: tk_outlier_span,
      isOutlier: tk_isoutlier,
      enable_behaviour_analytic: tk_enable_behaviour_analytic,
      latest_flip_state: tk_latest_flip_state,
      latest_flip_time: tk_latest_flip_time,
      priority: tk_priority,
    };

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_host_monitoring/" +
      tk_keyid;

    if (tk_keyid && tk_keyid.length) {
      $("#modal_entry_deletion").modal();

      $("#btn_modal_entry_deletion_temporary")
        .unbind("click")
        .click(function () {
          var that = $(this);
          that.off("click"); // remove handler

          $("#modal_entry_modification").modal();

          $("#btn_modal_entry_modification").click(function () {
            var that = $(this);
            that.off("click"); // remove handler

            // Retrieve update comment if any
            var tk_comment = document.getElementById(
              "input_update_comment"
            ).value;

            // if is not defined, give it a value and override text box content
            if (tk_comment == "null") {
              setToken(
                "tk_update_comment",
                TokenUtils.replaceTokenNames(
                  "No comments for update.",
                  _.extend(submittedTokenModel.toJSON(), e.data)
                )
              );
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            } else if (tk_comment == "update note") {
              tk_comment = "No comment for update.";
              document.getElementById("input_update_comment").value =
                "update note";
            } else {
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            }

            $.ajax({
              url: myendpoint_URl,
              type: "DELETE",
              async: true,
              contentType: "application/json",
              success: function (returneddata) {
                // Run the search again to update the table
                searchDataHostsMain.startSearch();

                // Audit
                action = "success";
                change_type = "delete temporary";
                object = tk_data_host;
                object_category = "data_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
                tk_keyid = undefined;
                delete tk_keyid;
                return;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;

                // Audit
                action = "failure";
                change_type = "delete temporary";
                object = tk_data_host;
                object_category = "data_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = message;
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(message);
                $("#modal_update_collection_failure_return").modal();
              },
            });
          });
        });

      $("#btn_modal_entry_deletion")
        .unbind("click")
        .click(function () {
          var that = $(this);
          that.off("click"); // remove handler

          $("#modal_entry_modification").modal();

          $("#btn_modal_entry_modification").click(function () {
            var that = $(this);
            that.off("click"); // remove handler

            // Retrieve update comment if any
            var tk_comment = document.getElementById(
              "input_update_comment"
            ).value;

            // if is not defined, give it a value and override text box content
            if (tk_comment == "null") {
              setToken(
                "tk_update_comment",
                TokenUtils.replaceTokenNames(
                  "No comments for update.",
                  _.extend(submittedTokenModel.toJSON(), e.data)
                )
              );
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            } else if (tk_comment == "update note") {
              tk_comment = "No comment for update.";
              document.getElementById("input_update_comment").value =
                "update note";
            } else {
              // replace the textarea for modification requests
              document.getElementById("input_update_comment").value =
                "update note";
            }

            $.ajax({
              url: myendpoint_URl,
              type: "DELETE",
              async: true,
              contentType: "application/json",
              success: function (returneddata) {
                // Run the search again to update the table
                searchDataHostsMain.startSearch();

                // Audit
                action = "success";
                change_type = "delete permanent";
                object = tk_data_host;
                object_category = "data_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
                tk_keyid = undefined;
                delete tk_keyid;
                return;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;

                // Audit
                action = "failure";
                change_type = "delete permanent";
                object = tk_data_host;
                object_category = "data_host";
                object_attrs = JSON.stringify(record, null, "\t");
                result = message;
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(message);
                $("#modal_update_collection_failure_return").modal();
              },
            });
          });
        });
    }
  });

  // metrics sla policy

  // add policy

  $("#btn_modal_metric_policy_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_metric_policy_metric_category = tokens.get(
      "tk_input_metric_policy_metric_category"
    );
    var tk_input_metric_policy_metric_value = tokens.get(
      "tk_input_metric_policy_metric_value"
    );

    // Define the query
    var searchQuery =
      '| inputlookup trackme_metric_lagging_definition | append [ | makeresults | eval metric_category="' +
      tk_input_metric_policy_metric_category +
      '", metric_max_lag_allowed="' +
      tk_input_metric_policy_metric_value +
      '" ] | dedup metric_category | sort limit=0 metric_category | outputlookup trackme_metric_lagging_definition';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (
      tk_input_metric_policy_metric_category &&
      tk_input_metric_policy_metric_category.length &&
      tk_input_metric_policy_metric_value &&
      tk_input_metric_policy_metric_value.length &&
      isNumeric(tk_input_metric_policy_metric_value)
    ) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "create metric sla policy";
          object = tk_input_metric_policy_metric_category;
          object_category = "metric_sla_policy";
          object_attrs =
            "SLA policy was created for metric_category:" +
            tk_input_metric_policy_metric_category +
            ", metric_max_lag_allowed:" +
            tk_input_metric_policy_metric_value;
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                unsetToken("form.tk_input_metric_policy_metric_category");
                searchMetricHostsMain.startSearch();
                searchMetricPolicies.startSearch();

                // Audit
                action = "success";
                change_type = "create metric sla policy";
                object = tk_input_metric_policy_metric_category;
                object_category = "metric_sla_policy";
                object_attrs =
                  "SLA policy was created for metric_category:" +
                  tk_input_metric_policy_metric_category +
                  ", metric_max_lag_allowed:" +
                  tk_input_metric_policy_metric_value;
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_metric_sla_policies").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete policy

  $("#btn_delete_metric_sla_policy_level1").click(function () {
    $("#modal_metric_sla_policies").modal("hide");
    $("#manage_metric_sla_policy").modal();
  });

  function foreachDeleteMetricSlaPolicy(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_lagging_definition/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.metric_category;
          var removedObjectAttr = returneddata.metric_max_lag_allowed;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "metric_host_sla_policy_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete metric sla policy";
              object = removedObject;
              object_category = "metric_sla_policy";
              object_attrs =
                "{" +
                '"metric_category": "' +
                removedObject +
                '", "metric_max_lag_allowed": "' +
                removedObjectAttr +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_metric_sla_policies").modal();

              // Refresh the search
              searchMetricPolicies.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete metric sla policy";
              object = removedObject;
              object_category = "metric_sla_policy";
              object_attrs =
                "{" +
                '"metric_category": "' +
                removedObject +
                '", "metric_max_lag_allowed": "' +
                removedObjectAttr +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_metric_sla_policy_level2").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeMetricPolicies");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteMetricSlaPolicy);

    // Hide main modal
    $("#manage_metric_sla_policy").modal("hide");

    // Run the search again to update the table
    searchMetricHostsMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeMetricPolicies");
  });

  // Custom lagging

  $("#btn_modal_custom_lagging_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_custom_lagging_type = tokens.get(
      "tk_input_custom_lagging_type"
    );
    var tk_input_custom_lagging_name = tokens.get(
      "tk_input_custom_lagging_name"
    );
    var tk_input_custom_lagging_value = tokens.get(
      "tk_input_custom_lagging_value"
    );
    var tk_input_custom_lagging_object = tokens.get(
      "tk_input_custom_lagging_object"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_custom_lagging_definition";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_custom_lagging_definition | append [ | makeresults | eval level="' +
      tk_input_custom_lagging_type +
      '", name="' +
      tk_input_custom_lagging_name +
      '", object="' +
      tk_input_custom_lagging_object +
      '", value="' +
      tk_input_custom_lagging_value +
      '" ] | dedup level, name, object, value | sort limit=0 level, name | outputlookup trackme_custom_lagging_definition';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (
      tk_input_custom_lagging_name &&
      tk_input_custom_lagging_name.length &&
      tk_input_custom_lagging_value &&
      tk_input_custom_lagging_value.length &&
      isNumeric(tk_input_custom_lagging_value)
    ) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "create lagging class";
          object = tk_input_custom_lagging_name;
          object_category = "lagging_class";
          object_attrs =
            "{" +
            '"type": "' +
            tk_input_custom_lagging_type +
            '", "name": "' +
            tk_input_custom_lagging_name +
            '", "object": "' +
            tk_input_custom_lagging_object +
            '", "value": "' +
            tk_input_custom_lagging_value +
            '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchCustomLagging.startSearch();

                // Audit
                action = "success";
                change_type = "create lagging class";
                object = tk_input_custom_lagging_name;
                object_category = "lagging_class";
                object_attrs =
                  "{" +
                  '"type": "' +
                  tk_input_custom_lagging_type +
                  '", "name": "' +
                  tk_input_custom_lagging_name +
                  '", "object": "' +
                  tk_input_custom_lagging_object +
                  '", "value": "' +
                  tk_input_custom_lagging_value +
                  '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modify_custom_lagging").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete lagging class

  $("#btn_lagging_data_source_policy_delete_level1").click(function () {
    $("#modify_custom_lagging").modal("hide");
    $("#manage_custom_lagging").modal();
  });

  function foreachDeleteLaggingClassDataSource(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_custom_lagging_definition/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.name;
          var removedObjectAttr1 = returneddata.level;
          var removedObjectAttr2 = returneddata.value;
          var removedObjectAttr3 = returneddata.object;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_source_lagging_policy_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete lagging class";
              object = removedObject;
              object_category = "lagging_class";
              object_attrs =
                "{" +
                '"name": "' +
                removedObject +
                '", "level": "' +
                removedObjectAttr1 +
                '", "value": "' +
                removedObjectAttr2 +
                '", "object": "' +
                removedObjectAttr3 +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modify_custom_lagging").modal();

              // Refresh the search
              searchCustomLagging.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete lagging class";
              object = removedObject;
              object_category = "lagging_class";
              object_attrs =
                "{" +
                '"name": "' +
                removedObject +
                '", "level": "' +
                removedObjectAttr1 +
                '", "value": "' +
                removedObjectAttr2 +
                '", "object": "' +
                removedObjectAttr3 +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_lagging_data_source_policy_delete_level2").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeDataSourceLaggingPolicy");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteLaggingClassDataSource);

    // Hide main modal
    $("#manage_custom_lagging").modal("hide");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeDataSourceLaggingPolicy");
  });

  // delete lagging class

  $("#btn_delete_custom_lagging").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_keyid = tokens.get("tk_keyid");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_custom_lagging_definition/" +
      tk_keyid;

    // Get tokens
    var tk_input_custom_lagging_type = tokens.get(
      "tk_input_custom_lagging_type"
    );
    var tk_input_custom_lagging_name = tokens.get(
      "tk_input_custom_lagging_name"
    );
    var tk_input_custom_lagging_value = tokens.get(
      "tk_input_custom_lagging_value"
    );

    if (tk_keyid && tk_keyid.length) {
      $.ajax({
        url: myendpoint_URl,
        type: "DELETE",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          // Hide main modal
          $("#manage_custom_lagging").modal("hide");

          // Run the search again to update the table
          searchCustomLagging.startSearch();

          // Audit
          action = "success";
          change_type = "delete lagging class";
          object = tk_input_custom_lagging_name;
          object_category = "lagging_class";
          object_attrs =
            "type:" +
            tk_input_custom_lagging_type +
            ", name:" +
            tk_input_custom_lagging_name +
            ", value:" +
            tk_input_custom_lagging_value;
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;

          // Return to modal
          $("#modify_custom_lagging").modal();
        },
        error: function (xhr, textStatus, error) {
          message = "Error Updating!" + xhr + textStatus + error;

          // Audit
          action = "failure";
          change_type = "delete lagging class";
          object = tk_input_custom_lagging_name;
          object_category = "lagging_class";
          object_attrs =
            "type:" +
            tk_input_custom_lagging_type +
            ", name:" +
            tk_input_custom_lagging_name +
            ", value:" +
            tk_input_custom_lagging_value;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          // Hide main modal
          $("#modify_custom_lagging").modal("hide");
          $("#manage_custom_lagging").modal("hide");
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // whitelist

  // add entry from whitelist

  $("#btn_modal_data_source_whitelist_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_whitelist_data_source = tokens.get(
      "tk_input_whitelist_data_source"
    );

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_textinput_whitelist_data_source = tokens.get(
      "tk_textinput_whitelist_data_source"
    );

    // choose
    var tk_add_new_item;
    if (
      tk_textinput_whitelist_data_source &&
      tk_textinput_whitelist_data_source.length
    ) {
      tk_add_new_item = tk_textinput_whitelist_data_source;
    } else {
      tk_add_new_item = tk_input_whitelist_data_source;
    }

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_whitelist_index";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring_whitelist_index | append [ | makeresults | eval data_index="' +
      tk_add_new_item +
      '"] | dedup data_index | sort limit=0 data_index | outputlookup trackme_data_source_monitoring_whitelist_index';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_add_new_item && tk_add_new_item.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add allowlist index";
          object = tk_add_new_item;
          object_category = "data_source";
          object_attrs = "{" + '"data_index": "' + tk_add_new_item + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchWhiteListDataSource.startSearch();
                searchSingleWhiteListDataSource.startSearch();
                searchDataSourcesMain.startSearch();
                searchPopulateIndexesForWhiteListDataSource.startSearch();
                unsetToken("form.tk_input_whitelist_data_source");
                unsetToken("form.tk_textinput_whitelist_data_source");

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add allowlist index";
                object = tk_add_new_item;
                object_category = "data_source";
                object_attrs = "{" + '"data_index": "' + tk_add_new_item + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_source_whitelist").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from whitelist

  $("#btn_modal_data_source_whitelist_add_delete").click(function () {
    $("#modal_modify_data_source_whitelist").modal("hide");
    $("#modal_manage_data_source_whitelist").modal();
  });

  function foreachDeleteWhitelistDataSource(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_whitelist_index/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_index;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_source_whitelist_index_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete allowlist index";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_source_whitelist").modal();

              // Refresh the searches
              searchWhiteListDataSource.startSearch();
              searchPopulateIndexesForWhiteListDataSource.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete allowlist index";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_source_whitelist").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeWhitelistDataSource");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteWhitelistDataSource);

    // Hide main modal
    $("#modal_manage_data_source_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();
    unsetToken("form.tk_input_whitelist_data_source");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeWhitelistDataSource");
  });

  // add entry from whitelist

  $("#btn_modal_metric_host_whitelist_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_whitelist_metric_host = tokens.get(
      "tk_input_whitelist_metric_host"
    );

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_textinput_whitelist_metric_host = tokens.get(
      "tk_textinput_whitelist_metric_host"
    );

    // choose
    var tk_add_new_item;
    if (
      tk_textinput_whitelist_metric_host &&
      tk_textinput_whitelist_metric_host.length
    ) {
      tk_add_new_item = tk_textinput_whitelist_metric_host;
    } else {
      tk_add_new_item = tk_input_whitelist_metric_host;
    }

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_whitelist_index";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_metric_host_monitoring_whitelist_index | append [ | makeresults | eval metric_index="' +
      tk_add_new_item +
      '"] | dedup metric_index | sort limit=0 metric_index | outputlookup trackme_metric_host_monitoring_whitelist_index';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_add_new_item && tk_add_new_item.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add allowlist index";
          object = tk_add_new_item;
          object_category = "metric_host";
          object_attrs = "{" + '"metric_index": "' + tk_add_new_item + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchPopulateIndexesForWhiteListMetricHost.startSearch();
                searchWhiteListMetricHost.startSearch();
                searchSingleWhiteListMetricHost.startSearch();
                searchMetricHostsMain.startSearch();
                unsetToken("form.tk_input_whitelist_metric_host");
                unsetToken("form.tk_textinput_whitelist_metric_host");

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add allowlist index";
                object = tk_add_new_item;
                object_category = "metric_host";
                object_attrs =
                  "{" + '"metric_index": "' + tk_add_new_item + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_metric_host_whitelist").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from whitelist

  $("#btn_modal_metric_host_whitelist_add_delete").click(function () {
    $("#modal_modify_metric_host_whitelist").modal("hide");
    $("#modal_manage_metric_host_whitelist").modal();
  });

  function foreachDeleteWhitelistMetricHost(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_whitelist_index/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.metric_index;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "metric_host_whitelist_index_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete allowlist index";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_metric_host_whitelist").modal();

              // Refresh the searches
              searchWhiteListMetricHost.startSearch();
              searchPopulateIndexesForWhiteListMetricHost.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete allowlist index";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_metric_host_whitelist").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeWhitelistMetricHost");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteWhitelistMetricHost);

    // Hide main modal
    $("#modal_manage_metric_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchMetricHostsMain.startSearch();
    unsetToken("form.tk_input_whitelist_metric_host");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeWhitelistMetricHost");
  });

  // add entry from whitelist

  $("#btn_modal_data_host_whitelist_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_whitelist_data_host = tokens.get(
      "tk_input_whitelist_data_host"
    );

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_textinput_whitelist_data_host = tokens.get(
      "tk_textinput_whitelist_data_host"
    );

    // choose
    var tk_add_new_item;
    if (
      tk_textinput_whitelist_data_host &&
      tk_textinput_whitelist_data_host.length
    ) {
      tk_add_new_item = tk_textinput_whitelist_data_host;
    } else {
      tk_add_new_item = tk_input_whitelist_data_host;
    }

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_whitelist_index";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_host_monitoring_whitelist_index | append [ | makeresults | eval data_index="' +
      tk_add_new_item +
      '"] | dedup data_index | sort limit=0 data_index | outputlookup trackme_data_host_monitoring_whitelist_index';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_add_new_item && tk_add_new_item.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add allowlist host";
          object = tk_add_new_item;
          object_category = "data_host";
          object_attrs = "{" + '"data_host": "' + tk_add_new_item + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchWhiteListDataHost.startSearch();
                searchSingleWhiteListDataHost.startSearch();
                searchDataHostsMain.startSearch();
                searchPopulateIndexesForWhiteListDataHost.startSearch();
                unsetToken("form.tk_input_whitelist_data_host");
                unsetToken("form.tk_textinput_whitelist_data_host");

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add allowlist host";
                object = tk_add_new_item;
                object_category = "data_host";
                object_attrs = "{" + '"data_host": "' + tk_add_new_item + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_host_whitelist").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from whitelist

  $("#btn_modal_data_host_whitelist_add_delete").click(function () {
    $("#modal_modify_data_host_whitelist").modal("hide");
    $("#modal_manage_data_host_whitelist").modal();
  });

  function foreachDeleteWhitelistDataHost(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_whitelist_index/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_index;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_host_whitelist_index_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete allowlist index";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_host_whitelist").modal();

              // Refresh the searches
              searchWhiteListDataHost.startSearch();
              searchPopulateIndexesForWhiteListDataHost.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete allowlist index";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_host_whitelist").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeWhitelistDataHost");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteWhitelistDataHost);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataHostsMain.startSearch();
    unsetToken("form.tk_input_whitelist_data_host");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeWhitelistDataHost");
  });

  // blacklist

  // host blacklist

  // add entry from blacklist

  $("#btn_modal_data_source_blacklist_host_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_host = tokens.get(
      "tk_input_data_source_blacklist_host"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_host";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring_blacklist_host | append [ | makeresults | eval data_host="' +
      tk_input_blacklist_host +
      '", data_blacklist_state="true" ] | dedup data_host | sort limit=0 data_host | outputlookup trackme_data_source_monitoring_blacklist_host';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_host && tk_input_blacklist_host.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist host";
          object = tk_input_blacklist_host;
          object_category = "data_source";
          object_attrs =
            "{" + '"data_host": "' + tk_input_blacklist_host + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataSourceHost.startSearch();
                searchSingleBlackListDataSourceHost.startSearch();
                searchDataSourcesMain.startSearch();
                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist host";
                object = tk_input_blacklist_host;
                object_category = "data_source";
                object_attrs =
                  "{" + '"data_host": "' + tk_input_blacklist_host + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_source_blacklist_host").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_data_source_blacklist_host_add_delete").click(function () {
    $("#modal_modify_data_source_blacklist_host").modal("hide");
    $("#modal_manage_data_source_blacklist_host").modal();
  });

  function foreachDeleteBlacklistDataSourceHost(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_host/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_host;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_source_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist host";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_host": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_source_blacklist_host").modal();

              // Refresh the search
              searchBlackListDataSourceHost.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist host";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_host": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_source_blacklist_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistDataSourceHost");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataSourceHost);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataSourceHost");
  });

  // add entry from blacklist

  $("#btn_modal_data_host_blacklist_host_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_host = tokens.get(
      "tk_input_data_host_blacklist_host"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_host";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_host_monitoring_blacklist_host | append [ | makeresults | eval data_host="' +
      tk_input_blacklist_host +
      '", data_blacklist_state="true" ] | dedup data_host | sort limit=0 data_host | outputlookup trackme_data_host_monitoring_blacklist_host';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_host && tk_input_blacklist_host.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist host";
          object = tk_input_blacklist_host;
          object_category = "data_host";
          object_attrs =
            "{" + '"data_host": "' + tk_input_blacklist_host + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataHostHost.startSearch();
                searchSingleBlackListDataHostHost.startSearch();
                searchDataHostsMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist host";
                object = tk_input_blacklist_host;
                object_category = "data_host";
                object_attrs =
                  "{" + '"data_host": "' + tk_input_blacklist_host + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_host_blacklist_host").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // index blacklist

  // add entry from blacklist

  $("#btn_modal_data_source_blacklist_index_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_index = tokens.get("tk_input_blacklist_index");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_index";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring_blacklist_index | append [ | makeresults | eval data_index="' +
      tk_input_blacklist_index +
      '", data_blacklist_state="true" ] | dedup data_index | sort limit=0 data_index | outputlookup trackme_data_source_monitoring_blacklist_index';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_index && tk_input_blacklist_index.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist index";
          object = tk_input_blacklist_index;
          object_category = "data_source";
          object_attrs =
            "{" + '"data_index": "' + tk_input_blacklist_index + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataSourceIndex.startSearch();
                searchSingleBlackListDataSourceIndex.startSearch();
                searchDataSourcesMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist index";
                object = tk_input_blacklist_index;
                object_category = "data_source";
                object_attrs =
                  "{" + '"data_index": "' + tk_input_blacklist_index + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_source_blacklist_index").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_data_source_blacklist_index_add_delete").click(function () {
    $("#modal_modify_data_source_blacklist_index").modal("hide");
    $("#modal_manage_data_source_blacklist_index").modal();
  });

  function foreachDeleteBlacklistDataSourceIndex(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_index/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_index;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_source_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist index";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_source_blacklist_index").modal();

              // Refresh the searches
              searchBlackListDataSourceIndex.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist index";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_source_blacklist_index").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistDataSourceIndex");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataSourceIndex);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataSourceIndex");
  });

  // delete entry from blacklist

  $("#btn_modal_data_host_blacklist_index_add_delete").click(function () {
    $("#modal_modify_data_host_blacklist_index").modal("hide");
    $("#modal_manage_data_host_blacklist_index").modal();
  });

  function foreachDeleteBlacklistDataHostIndex(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_index/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_index;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_host_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist index";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_host_blacklist_index").modal();

              // Refresh the search
              searchBlackListDataHostIndex.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist index";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_host_blacklist_index").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistDataHostIndex");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataHostIndex);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataHostIndex");
  });

  // add entry from blacklist

  $("#btn_modal_data_host_blacklist_index_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_index = tokens.get(
      "tk_input_data_host_blacklist_index"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_index";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_host_monitoring_blacklist_index | append [ | makeresults | eval data_index="' +
      tk_input_blacklist_index +
      '", data_blacklist_state="true" ] | dedup data_index | sort limit=0 data_index | outputlookup trackme_data_host_monitoring_blacklist_index';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_index && tk_input_blacklist_index.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist index";
          object = tk_input_blacklist_index;
          object_category = "data_host";
          object_attrs =
            "{" + '"data_index": "' + tk_input_blacklist_index + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataHostIndex.startSearch();
                searchSingleBlackListDataHostIndex.startSearch();
                searchDataHostsMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist index";
                object = tk_input_blacklist_index;
                object_category = "data_host";
                object_attrs =
                  "{" + '"data_index": "' + tk_input_blacklist_index + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_host_blacklist_index").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_data_host_blacklist_host_add_delete").click(function () {
    $("#modal_modify_data_host_blacklist_host").modal("hide");
    $("#modal_manage_data_host_blacklist_host").modal();
  });

  function foreachDeleteBlacklistDataHostHost(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_host/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_host;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_host_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist host";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_host": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_host_blacklist_host").modal();

              // Refresh the search
              searchBlackListDataHostHost.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist host";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_host": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_host_blacklist_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistDataHostHost");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataHostHost);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataHostsMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataHostHost");
  });

  // add entry from blacklist

  $("#btn_modal_metric_host_blacklist_index_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_index = tokens.get(
      "tk_input_metric_host_blacklist_index"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_index";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_metric_host_monitoring_blacklist_index | append [ | makeresults | eval metric_index="' +
      tk_input_blacklist_index +
      '", metric_blacklist_state="true" ] | dedup metric_index | sort limit=0 metric_index | outputlookup trackme_metric_host_monitoring_blacklist_index';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_index && tk_input_blacklist_index.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist index";
          object = tk_input_blacklist_index;
          object_category = "metric_host";
          object_attrs =
            "{" + '"metric_index": "' + tk_input_blacklist_index + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListMetricHostIndex.startSearch();
                searchSingleBlackListMetricHostIndex.startSearch();
                searchMetricHostsMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist index";
                object = tk_input_blacklist_index;
                object_category = "metric_host";
                object_attrs =
                  "{" + '"metric_index": "' + tk_input_blacklist_index + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_metric_host_blacklist_index").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_metric_host_blacklist_index_add_delete").click(function () {
    $("#modal_modify_metric_host_blacklist_index").modal("hide");
    $("#modal_manage_metric_host_blacklist_index").modal();
  });

  function foreachDeleteBlacklistMetricHostIndex(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_index/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.metric_index;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "metric_host_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist index";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_metric_host_blacklist_index").modal();

              // Refresh the search
              searchBlackListMetricHostIndex.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist index";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_index": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_metric_host_blacklist_index").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistMetricHostIndex");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistMetricHostIndex);

    // Hide main modal
    $("#modal_manage_metric_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchMetricHostsMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistMetricHostIndex");
  });

  // sourcetype blacklist

  $("#btn_modal_data_source_blacklist_sourcetype_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_sourcetype = tokens.get(
      "tk_input_data_source_blacklist_sourcetype"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_sourcetype";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring_blacklist_sourcetype | append [ | makeresults | eval data_sourcetype="' +
      tk_input_blacklist_sourcetype +
      '", data_blacklist_state="true" ] | dedup data_sourcetype | sort limit=0 data_sourcetype | outputlookup trackme_data_source_monitoring_blacklist_sourcetype';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_sourcetype && tk_input_blacklist_sourcetype.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist sourcetype";
          object = tk_input_blacklist_sourcetype;
          object_category = "data_source";
          object_attrs =
            "{" + '"data_sourcetype": "' + tk_input_blacklist_sourcetype + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataSourceSourcetype.startSearch();
                searchSingleBlackListDataSourceSourcetype.startSearch();
                searchDataSourcesMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist sourcetype";
                object = tk_input_blacklist_sourcetype;
                object_category = "data_source";
                object_attrs =
                  "{" +
                  '"data_sourcetype": "' +
                  tk_input_blacklist_sourcetype +
                  '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_source_blacklist_sourcetype").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_data_source_blacklist_sourcetype_add_delete").click(
    function () {
      $("#modal_modify_data_source_blacklist_sourcetype").modal("hide");
      $("#modal_manage_data_source_blacklist_sourcetype").modal();
    }
  );

  function foreachDeleteBlacklistDataSourceSourcetype(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_sourcetype/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_sourcetype;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_source_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist sourcetype";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_sourcetype": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_source_blacklist_sourcetype").modal();

              // Refresh the search
              searchBlackListDataSourceSourcetype.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist sourcetype";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_sourcetype": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_source_blacklist_sourcetype").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get(
      "removeBlacklistDataSourceSourcetype"
    );
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataSourceSourcetype);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataSourceSourcetype");
  });

  // data_name blacklist

  $("#btn_modal_data_source_blacklist_data_name_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_data_name = tokens.get(
      "tk_input_data_source_blacklist_data_name"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_data_name";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring_blacklist_data_name | append [ | makeresults | eval data_name="' +
      tk_input_blacklist_data_name +
      '", data_blacklist_state="true" ] | dedup data_name | sort limit=0 data_name | outputlookup trackme_data_source_monitoring_blacklist_data_name';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_data_name && tk_input_blacklist_data_name.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist data_name";
          object = tk_input_blacklist_data_name;
          object_category = "data_source";
          object_attrs =
            "{" + '"data_name": "' + tk_input_blacklist_data_name + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataSourceDataName.startSearch();
                searchSingleBlackListDataSourceDataName.startSearch();
                searchDataSourcesMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist data_name";
                object = tk_input_blacklist_data_name;
                object_category = "data_source";
                object_attrs =
                  "{" + '"data_name": "' + tk_input_blacklist_data_name + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_source_blacklist_data_name").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_data_source_blacklist_data_name_add_delete").click(function () {
    $("#modal_modify_data_source_blacklist_data_name").modal("hide");
    $("#modal_manage_data_source_blacklist_data_name").modal();
  });

  function foreachDeleteBlacklistDataSourceDataName(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_data_name/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_data_name;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_source_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist data_name";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_data_name": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_source_blacklist_data_name").modal();

              // Refresh the search
              searchBlackListDataSourceDataName.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist data_name";
              object = removedObject;
              object_category = "data_source";
              object_attrs =
                "{" +
                '"data_data_name": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_source_blacklist_data_name").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistDataSourceDataName");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataSourceDataName);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataSourceDataName");
  });

  // sourcetype blacklist

  $("#btn_modal_data_host_blacklist_sourcetype_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_sourcetype = tokens.get(
      "tk_input_data_host_blacklist_sourcetype"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_sourcetype";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_host_monitoring_blacklist_sourcetype | append [ | makeresults | eval data_sourcetype="' +
      tk_input_blacklist_sourcetype +
      '", data_blacklist_state="true" ] | dedup data_sourcetype | sort limit=0 data_sourcetype | outputlookup trackme_data_host_monitoring_blacklist_sourcetype';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_sourcetype && tk_input_blacklist_sourcetype.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist sourcetype";
          object = tk_input_blacklist_sourcetype;
          object_category = "data_host";
          object_attrs =
            "{" + '"data_sourcetype": "' + tk_input_blacklist_sourcetype + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataHostSourcetype.startSearch();
                searchSingleBlackListDataHostSourcetype.startSearch();
                searchDataHostsMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist sourcetype";
                object = tk_input_blacklist_sourcetype;
                object_category = "data_host";
                object_attrs =
                  "{" +
                  '"data_sourcetype": "' +
                  tk_input_blacklist_sourcetype +
                  '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_data_host_blacklist_sourcetype").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_data_host_blacklist_sourcetype_add_delete").click(function () {
    $("#modal_modify_data_host_blacklist_sourcetype").modal("hide");
    $("#modal_manage_data_host_blacklist_sourcetype").modal();
  });

  function foreachDeleteBlacklistDataHostSourcetype(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_sourcetype/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.data_sourcetype;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "data_host_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist sourcetype";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_sourcetype": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_data_host_blacklist_sourcetype").modal();

              // Refresh the search
              searchBlackListDataHostSourcetype.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist sourcetype";
              object = removedObject;
              object_category = "data_host";
              object_attrs =
                "{" +
                '"data_sourcetype": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_data_host_blacklist_sourcetype").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistDataHostSourcetype");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistDataHostSourcetype);

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistDataHostSourcetype");
  });

  // metric host moonitoring
  // add entry from blacklist

  $("#btn_modal_metric_host_blacklist_host_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_host = tokens.get(
      "tk_input_metric_host_blacklist_host"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_host";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_metric_host_monitoring_blacklist_host | append [ | makeresults | eval metric_host="' +
      tk_input_blacklist_host +
      '", metric_blacklist_state="true" ] | dedup metric_host | sort limit=0 metric_host | outputlookup trackme_metric_host_monitoring_blacklist_host';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (tk_input_blacklist_host && tk_input_blacklist_host.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist host";
          object = tk_input_blacklist_host;
          object_category = "metric_host";
          object_attrs =
            "{" + '"metric_host": "' + tk_input_blacklist_host + '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListMetricHostHost.startSearch();
                searchSingleBlackListMetricHostHost.startSearch();
                searchMetricHostsMain.startSearch();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist host";
                object = tk_input_blacklist_host;
                object_category = "metric_host";
                object_attrs =
                  "{" + '"metric_host": "' + tk_input_blacklist_host + '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $("#modal_modify_metric_host_blacklist_host").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist

  $("#btn_modal_metric_host_blacklist_host_add_delete").click(function () {
    $("#modal_modify_metric_host_blacklist_host").modal("hide");
    $("#modal_manage_metric_host_blacklist_host").modal();
  });

  function foreachDeleteBlacklistMetricHostHost(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_host/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.metric_host;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "metric_host_blocklist_host_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist host";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_host": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_metric_host_blacklist_host").modal();

              // Refresh the search
              searchBlackListMetricHostHost.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist host";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_host": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_metric_host_blacklist_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeBlacklistMetricHostHost");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteBlacklistMetricHostHost);

    // Hide main modal
    $("#modal_manage_metric_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchMetricHostsMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistMetricHostHost");
  });

  // metric_category blacklist

  $("#btn_modal_metric_host_blacklist_metric_category_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_metric_category = tokens.get(
      "tk_input_metric_host_blacklist_metric_category"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_metric_category";

    // Define the query
    var searchQuery =
      '| inputlookup trackme_metric_host_monitoring_blacklist_metric_category | append [ | makeresults | eval metric_category="' +
      tk_input_blacklist_metric_category +
      '", metric_blacklist_state="true" ] | dedup metric_category | sort limit=0 metric_category | outputlookup trackme_metric_host_monitoring_blacklist_metric_category';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (
      tk_input_blacklist_metric_category &&
      tk_input_blacklist_metric_category.length
    ) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add blocklist metric_category";
          object = tk_input_blacklist_metric_category;
          object_category = "metric_host";
          object_attrs =
            "{" +
            '"metric_category": "' +
            tk_input_blacklist_metric_category +
            '"}';
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListMetricHostMetricCategory.startSearch();
                searchPopulateMetricCategoriesForBlackListMetricHost.startSearch();
                searchMetricHostsMain.startSearch();
                unsetToken(
                  "form.tk_input_metric_host_blacklist_metric_category"
                );

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add blocklist metric_category";
                object = tk_input_blacklist_metric_category;
                object_category = "metric_host";
                object_attrs =
                  "{" +
                  '"metric_category": "' +
                  tk_input_blacklist_metric_category +
                  '"}';
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                $(
                  "#modal_modify_metric_host_blacklist_metric_category"
                ).modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // delete entry from blacklist
  $("#btn_modal_metric_host_blacklist_metric_category_add_delete").click(
    function () {
      $("#modal_modify_metric_host_blacklist_metric_category").modal("hide");
      $("#modal_manage_metric_host_blacklist_metric_category").modal();
    }
  );

  function foreachDeleteBlacklistMetricHostMetricCategory(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_metric_category/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var removedObject = returneddata.metric_category;

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "metric_host_blocklist_metric_category_delete_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete blocklist metric category";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_category": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#modal_modify_metric_host_blacklist_metric_category").modal();

              // Refresh the search
              searchBlackListMetricHostMetricCategory.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete blocklist metric category";
              object = removedObject;
              object_category = "metric_host";
              object_attrs =
                "{" +
                '"metric_category": "' +
                removedObject +
                '", "_key": "' +
                item +
                '"}';
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_delete_metric_host_blacklist_metric_category").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get(
      "removeBlacklistMetricHostMetricCategory"
    );
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(
      foreachDeleteBlacklistMetricHostMetricCategory
    );

    // Hide main modal
    $("#modal_manage_data_host_whitelist").modal("hide");

    // Run the search again to update the table
    searchDataSourcesMain.startSearch();

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeBlacklistMetricHostMetricCategory");
  });

  // data sources monitoring

  $("#btn_modal_modify_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_manage").modal();
  });

  // data hosts monitoring

  $("#btn_modal_modify_host_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_manage_host").modal();
  });

  //
  // Elastic sources
  //

  $(".btn_modify_elastic_sources_main").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_elastic_sources", "true");
      setToken("start_modify_elastic_sources_dedicated", "true");
      // Show input modal
      $("#modify_elastic_sources_main").modal();
    });
  });

  $("#btn_modal_elastic_sources_manage").click(function () {
    // Show input modal
    $("#modify_elastic_sources").modal();

    // Excplicitely refresh the search
    searchElasticSources.startSearch();
  });

  $("#btn_modal_elastic_sources_dedicated_manage").click(function () {
    // Show input modal
    $("#modify_elastic_sources_dedicated").modal();

    // Excplicitely refresh the search
    searchElasticSourcesDedicated.startSearch();
  });

  $("#btn_modal_elastic_sources_add").click(function () {
    // Default disable button add state
    document.getElementById("btn_modal_elastic_source_add_new").disabled = true;
    document.getElementById(
      "btn_modal_elastic_source_dedicated_add_new"
    ).disabled = true;
    // Show input modal
    $("#add_elastic_sources").modal();
  });

  // Back
  $("#btn_modal_elastic_sources_add_back").click(function () {
    // Show input modal
    $("#modify_elastic_sources_main").modal();
  });

  $("#btn_modal_elastic_sources_dedicated_add_back").click(function () {
    // Show input modal
    $("#modify_elastic_sources_main").modal();
  });

  $("#btn_modal_elastic_sources_add_new_back").click(function () {
    // Show input modal
    $("#modify_elastic_sources_main").modal();
  });

  $("#btn_modal_generic_search_error_back").click(function () {
    // Show input modal
    $("#add_elastic_sources").modal();
  });

  function elastic_sources_check_unique(data_name, status) {
    // Define the query
    var searchQuery =
      '| makeresults | eval data_name="' +
      data_name +
      '" | lookup trackme_elastic_sources data_name OUTPUTNEW _key as found | eval is_unique=if(isnull(found), "true", "false") | fields - _time | fields is_unique';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-5m",
      latest_time: "now",
    };

    // Run a oneshot search that returns the job's results
    service.oneshotSearch(searchQuery, searchParams, function (err, results) {
      // Display the results
      var fields = results.fields;
      var rows = results.rows;
      var is_unique;

      for (var i = 0; i < rows.length; i++) {
        var values = rows[i];

        for (var j = 0; j < values.length; j++) {
          var field = fields[j];

          if (fields[j] == "is_unique") {
            is_unique = values[j];
          }
        }
      }

      if (!is_unique) {
        var start_simulation_elastic_sources = "false";
        document.getElementById(
          "btn_modal_elastic_source_add_new"
        ).disabled = true;
        document.getElementById(
          "btn_modal_elastic_source_dedicated_add_new"
        ).disabled = true;
        setToken("start_simulation_elastic_sources", "false");
      }

      if (is_unique == "true" && status == "true") {
        var start_simulation_elastic_sources = "true";
        document.getElementById(
          "btn_modal_elastic_source_add_new"
        ).disabled = false;
        document.getElementById(
          "btn_modal_elastic_dedicated_ource_add_new"
        ).disabled = false;
        setToken("start_simulation_elastic_sources", "true");
      } else if (is_unique == "false") {
        var start_simulation_elastic_sources = "false";
        document.getElementById(
          "btn_modal_elastic_source_add_new"
        ).disabled = true;
        document.getElementById(
          "btn_modal_elastic_source_dedicated_add_new"
        ).disabled = true;
        setToken("start_simulation_elastic_sources", "false");
      }
    });

    return false;
  }

  // Run simulation
  $("#btn_modal_elastic_source_add_simulate").click(function (event) {
    event.stopImmediatePropagation();

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // disabled if enabled
    document.getElementById("btn_modal_elastic_source_add_new").disabled = true;
    document.getElementById(
      "btn_modal_elastic_source_dedicated_add_new"
    ).disabled = true;

    // Get tokens
    var tk_input_elastic_source_search_type = tokens.get(
      "tk_input_elastic_source_search_type"
    );
    var tk_input_elastic_source_data_name = tokens.get(
      "tk_input_elastic_source_data_name"
    );
    var tk_input_elastic_source_elastic_data_index = tokens.get(
      "tk_input_elastic_source_elastic_data_index"
    );
    var tk_input_elastic_source_elastic_data_sourcetype = tokens.get(
      "tk_input_elastic_source_elastic_data_sourcetype"
    );
    var tk_input_elastic_source_earliest = tokens.get(
      "tk_input_elastic_source_earliest"
    );
    var tk_input_elastic_source_latest = tokens.get(
      "tk_input_elastic_source_latest"
    );

    // This is not a Splunk form
    var tk_input_elastic_source_search_constraint = document.getElementById(
      "modal_input_elastic_source_search_constraint"
    ).value;
    // the token used by the search needs to have escaped double quotes, but not the value to be stored in the KV
    var tk_raw_input_elastic_source_search_constraint = document.getElementById(
      "modal_input_elastic_source_search_constraint"
    ).value;
    tk_input_elastic_source_search_constraint = escapeDoubleQuotes(
      tk_input_elastic_source_search_constraint
    );
    setToken(
      "tk_input_elastic_source_search_constraint",
      tk_input_elastic_source_search_constraint
    );

    // Start the search if all tokens are defined
    if (
      tk_input_elastic_source_search_type &&
      tk_input_elastic_source_data_name &&
      tk_input_elastic_source_elastic_data_index &&
      tk_input_elastic_source_elastic_data_sourcetype &&
      tk_input_elastic_source_search_constraint &&
      tk_input_elastic_source_search_constraint !==
        "Enter the Splunk search constraint chain according to the type of search selected"
    ) {
      notification(
        "Elastic source simulation started for data_name: " +
          tk_input_elastic_source_data_name +
          ", if the simulation is successful, click on save new elastic source to include this new source in the collection.",
        6000
      );
      // Free the beast
      var start_simulation_elastic_sources = "true";
      var success_simulation_elastic_sources = "false";
      setToken("start_simulation_elastic_sources", "true");
      searchElasticSourcesTest.startSearch();

      searchElasticSourcesTest.on("search:error", function (properties) {
        var start_simulation_elastic_sources = "false";
        var success_simulation_elastic_sources = "false";
        setToken("start_simulation_elastic_sources", "false");
        document.getElementById(
          "btn_modal_elastic_source_add_new"
        ).disabled = true;
        document.getElementById(
          "btn_modal_elastic_source_dedicated_add_new"
        ).disabled = true;
        $("#add_elastic_sources").modal("hide");
        $("#modal_generic_search_error").modal();
      });

      searchElasticSourcesTest.on("search:fail", function (properties) {
        var start_simulation_elastic_sources = "false";
        var success_simulation_elastic_sources = "false";
        setToken("start_simulation_elastic_sources", "false");
        document.getElementById(
          "btn_modal_elastic_source_add_new"
        ).disabled = true;
        document.getElementById(
          "btn_modal_elastic_source_dedicated_add_new"
        ).disabled = true;
        $("#add_elastic_sources").modal("hide");
        $("#modal_generic_search_error").modal();
      });

      // If the search is processed successfully
      searchElasticSourcesTest.on("search:done", function (properties) {
        var start_simulation_elastic_sources = "true";
        document.getElementById(
          "btn_modal_elastic_source_add_new"
        ).disabled = false;
        document.getElementById(
          "btn_modal_elastic_source_dedicated_add_new"
        ).disabled = false;
        setToken("start_simulation_elastic_sources", "true");
        // to do: this isn't stable enough yet
        // elastic_sources_check_unique(tk_input_elastic_source_data_name, "true");
      });
    } else {
      unsetToken("start_simulation_elastic_sources");
      notification(
        "ERROR: Entries are either incorrect or incomplete, please correct and try again.",
        6000
      );
    }

    // add a new elastic source
    $("#btn_modal_elastic_source_add_new").click(function (event) {
      event.stopImmediatePropagation();

      // Get status
      var success_simulation_elastic_sources = tokens.get(
        "start_simulation_elastic_sources"
      );

      // Get tokens
      var tk_input_elastic_source_search_type = tokens.get(
        "tk_input_elastic_source_search_type"
      );
      var tk_input_elastic_source_data_name = tokens.get(
        "tk_input_elastic_source_data_name"
      );
      var tk_input_elastic_source_elastic_data_index = tokens.get(
        "tk_input_elastic_source_elastic_data_index"
      );
      var tk_input_elastic_source_elastic_data_sourcetype = tokens.get(
        "tk_input_elastic_source_elastic_data_sourcetype"
      );
      var tk_input_elastic_source_earliest = tokens.get(
        "tk_input_elastic_source_earliest"
      );
      var tk_input_elastic_source_latest = tokens.get(
        "tk_input_elastic_source_latest"
      );

      // This is not a Splunk form
      var tk_input_elastic_source_search_constraint = document.getElementById(
        "modal_input_elastic_source_search_constraint"
      ).value;
      // the token used by the search needs to have escaped double quotes, but not the value to be stored in the KV
      var tk_raw_input_elastic_source_search_constraint =
        document.getElementById(
          "modal_input_elastic_source_search_constraint"
        ).value;
      tk_input_elastic_source_search_constraint = escapeDoubleQuotes(
        tk_input_elastic_source_search_constraint
      );
      setToken(
        "tk_input_elastic_source_search_constraint",
        tk_input_elastic_source_search_constraint
      );

      // disable the button once clicked
      document.getElementById(
        "btn_modal_elastic_source_add_new"
      ).disabled = true;

      if (
        start_simulation_elastic_sources &&
        start_simulation_elastic_sources == "true"
      ) {
        var myendpoint_URl =
          "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_elastic_sources/";

        // Create a dictionary to store the field names and values
        var record = {
          data_name: tk_input_elastic_source_data_name,
          search_constraint: tk_raw_input_elastic_source_search_constraint,
          search_mode: tk_input_elastic_source_search_type,
          elastic_data_index: tk_input_elastic_source_elastic_data_index,
          elastic_data_sourcetype:
            tk_input_elastic_source_elastic_data_sourcetype,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Processed modal
            // clean status
            unsetToken("start_simulation_elastic_sources");
            // Show message
            msg =
              "The new elastic source: " +
              tk_input_elastic_source_data_name +
              ' was successfully added to the collection, manually run the tracker report "TrackMe - Elastic sources shared tracker" or wait for its next execution.';
            $("#add_elastic_source_processed")
              .find(".modal-error-message p")
              .text(msg);
            $("#add_elastic_sources").modal("hide");
            $("#add_elastic_source_processed").modal();

            // Audit
            action = "success";
            change_type = "add elastic source";
            object = tk_input_elastic_source_data_name;
            object_category = "elastic_sources";
            object_attrs =
              "search_mode:" +
              tk_input_elastic_source_search_type +
              ", search_constraint:" +
              tk_raw_input_elastic_source_search_constraint +
              ", elastic_data_index:" +
              tk_input_elastic_source_elastic_data_index +
              ", elastic_data_sourcetype:" +
              tk_input_elastic_source_elastic_data_sourcetype;
            result = "N/A";
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            // house cleaning
            myendpoint_URl = undefined;
            delete myendpoint_URl;
          },
          error: function (xhr, textStatus, error) {
            message = "Error Updating!" + xhr + textStatus + error;

            // Audit
            action = "failure";
            change_type = "add elastic source";
            object = tk_input_elastic_source_data_name;
            object_category = "elastic_sources";
            object_attrs =
              "search_mode:" +
              tk_input_elastic_source_search_type +
              ", search_constraint:" +
              tk_raw_input_elastic_source_search_constraint +
              ", elastic_data_index:" +
              tk_input_elastic_source_elastic_data_index +
              ", elastic_data_sourcetype:" +
              tk_input_elastic_source_elastic_data_sourcetype;
            result = "N/A";
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            // back tp main modal
            $("#add_elastic_sources").modal("hide");
            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      } else {
        notification(
          "ERROR: Please successfully run the simulation first.",
          6000
        );
      }
    });

    $("#btn_modal_elastic_source_dedicated_add_new").click(function (event) {
      event.stopImmediatePropagation();

      // Get status
      var success_simulation_elastic_sources = tokens.get(
        "start_simulation_elastic_sources"
      );

      // Get tokens
      var tk_input_elastic_source_search_type = tokens.get(
        "tk_input_elastic_source_search_type"
      );
      var tk_input_elastic_source_data_name = tokens.get(
        "tk_input_elastic_source_data_name"
      );
      var tk_input_elastic_source_elastic_data_index = tokens.get(
        "tk_input_elastic_source_elastic_data_index"
      );
      var tk_input_elastic_source_elastic_data_sourcetype = tokens.get(
        "tk_input_elastic_source_elastic_data_sourcetype"
      );
      var tk_input_elastic_source_earliest = tokens.get(
        "tk_input_elastic_source_earliest"
      );
      var tk_input_elastic_source_latest = tokens.get(
        "tk_input_elastic_source_latest"
      );

      // This is not a Splunk form
      var tk_input_elastic_source_search_constraint = document.getElementById(
        "modal_input_elastic_source_search_constraint"
      ).value;
      // the token used by the search needs to have escaped double quotes, but not the value to be stored in the KV
      var tk_raw_input_elastic_source_search_constraint =
        document.getElementById(
          "modal_input_elastic_source_search_constraint"
        ).value;
      tk_input_elastic_source_search_constraint = escapeDoubleQuotes(
        tk_input_elastic_source_search_constraint
      );
      setToken(
        "tk_input_elastic_source_search_constraint",
        tk_input_elastic_source_search_constraint
      );

      // disable the button once clicked
      document.getElementById(
        "btn_modal_elastic_source_dedicated_add_new"
      ).disabled = true;

      if (
        start_simulation_elastic_sources &&
        start_simulation_elastic_sources == "true"
      ) {
        // Create a unique name for the tracker
        var tracker_name =
          "TrackMe - " +
          tk_input_elastic_source_data_name +
          " tracker " +
          uuid();
        // Splunk limits report names to max 100 chars, and will refuse otherwise
        tracker_name = tracker_name.substring(0, 100);
        setToken("tk_tracker_name", tracker_name);

        // define the alert search
        if (tk_input_elastic_source_search_type == "tstats") {
          tk_elastic_alert_root_search =
            "| `trackme_tstats` max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host where " +
            tk_raw_input_elastic_source_search_constraint +
            ' | eval data_name="' +
            tk_input_elastic_source_data_name +
            '", data_index="' +
            tk_input_elastic_source_elastic_data_index +
            '", data_sourcetype="' +
            tk_input_elastic_source_elastic_data_sourcetype +
            '", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen | `trackme_elastic_dedicated_tracker("' +
            tk_input_elastic_source_data_name +
            '")` | stats c';
        } else if (tk_input_elastic_source_search_type == "raw") {
          tk_elastic_alert_root_search =
            tk_raw_input_elastic_source_search_constraint +
            ' | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name="' +
            tk_input_elastic_source_data_name +
            '", data_index="' +
            tk_input_elastic_source_elastic_data_index +
            '", data_sourcetype="' +
            tk_input_elastic_source_elastic_data_sourcetype +
            '", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen | `trackme_elastic_dedicated_tracker("' +
            tk_input_elastic_source_data_name +
            '")` | stats c';
        } else if (tk_input_elastic_source_search_type == "from") {
          if (
            /datamodel:/i.test(tk_raw_input_elastic_source_search_constraint)
          ) {
            tk_elastic_alert_root_search =
              "| " +
              tk_input_elastic_source_search_type +
              " " +
              tk_raw_input_elastic_source_search_constraint +
              ' | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name="' +
              tk_input_elastic_source_data_name +
              '", data_index="' +
              tk_input_elastic_source_elastic_data_index +
              '", data_sourcetype="' +
              tk_input_elastic_source_elastic_data_sourcetype +
              '" | `trackme_elastic_dedicated_tracker("' +
              tk_input_elastic_source_data_name +
              '")` | stats c';
          } else if (
            /lookup:/i.test(tk_raw_input_elastic_source_search_constraint)
          ) {
            tk_elastic_alert_root_search =
              "| " +
              tk_input_elastic_source_search_type +
              " " +
              tk_raw_input_elastic_source_search_constraint +
              ' | eventstats max(_time) as indextime | eval _indextime=if(isnum(_indextime), _indextime, indextime) | fields - indextime | eval host=if(isnull(host), "none", host) | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name="' +
              tk_input_elastic_source_data_name +
              '", data_index="' +
              tk_input_elastic_source_elastic_data_index +
              '", data_sourcetype="' +
              tk_input_elastic_source_elastic_data_sourcetype +
              '" | `trackme_elastic_dedicated_tracker("' +
              tk_input_elastic_source_data_name +
              '")` | stats c';
          } else {
            notification(
              "ERROR: This from query is not supported, only datamodel and lookup based from queries are accepted.",
              6000
            );
            return;
          }
        } else if (tk_input_elastic_source_search_type == "rest_tstats") {
          // Extract amd replace
          rest_matches = tk_raw_input_elastic_source_search_constraint.match(
            /((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)/
          );
          rest_target = rest_matches[1];
          rest_constraint = rest_matches[2];
          rest_constraint = rest_constraint.replace(/\"/g, '\\"');
          tk_elastic_alert_root_search =
            "| rest " +
            rest_target +
            ' /servicesNS/admin/search/search/jobs/export search="| tstats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host where ' +
            rest_constraint +
            ' | eval data_name=\\"' +
            tk_input_elastic_source_data_name +
            '\\", data_index=\\"' +
            tk_input_elastic_source_elastic_data_index +
            '\\", data_sourcetype=\\"' +
            tk_input_elastic_source_elastic_data_sourcetype +
            '\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"' +
            ' output_mode="csv"' +
            ' earliest_time="' +
            tk_input_elastic_source_earliest +
            '"' +
            ' latest_time="' +
            tk_input_elastic_source_latest +
            '"' +
            " | head 1 | table value | restextract " +
            ' | `trackme_elastic_dedicated_tracker("' +
            tk_input_elastic_source_data_name +
            '")` | stats c';
        } else if (tk_input_elastic_source_search_type == "rest_mstats") {
          // Extract amd replace
          rest_matches = tk_raw_input_elastic_source_search_constraint.match(
            /((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)/
          );
          rest_target = rest_matches[1];
          rest_constraint = rest_matches[2];
          rest_constraint = rest_constraint.replace(/\"/g, '\\"');
          tk_elastic_alert_root_search =
            "| rest " +
            rest_target +
            ' /servicesNS/admin/search/search/jobs/export search="| mstats latest(_value) as value where ' +
            rest_constraint +
            ' by host, metric_name span=1s | stats min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, dc(metric_name) as data_eventcount, dc(host) as dcount_host | eval data_last_ingest=data_last_time_seen | eval data_name=\\"' +
            tk_input_elastic_source_data_name +
            '\\", data_index=\\"' +
            tk_input_elastic_source_elastic_data_index +
            '\\", data_sourcetype=\\"' +
            tk_input_elastic_source_elastic_data_sourcetype +
            '\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"' +
            ' output_mode="csv"' +
            ' earliest_time="' +
            tk_input_elastic_source_earliest +
            '"' +
            ' latest_time="' +
            tk_input_elastic_source_latest +
            '"' +
            " | head 1 | table value | restextract " +
            ' | `trackme_elastic_dedicated_tracker("' +
            tk_input_elastic_source_data_name +
            '")` | stats c';
        } else if (tk_input_elastic_source_search_type == "rest_raw") {
          // Extract amd replace
          rest_matches = tk_raw_input_elastic_source_search_constraint.match(
            /((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)/
          );
          rest_target = rest_matches[1];
          rest_constraint = rest_matches[2];
          rest_constraint = rest_constraint.replace(/\"/g, '\\"');
          tk_elastic_alert_root_search =
            "| rest " +
            rest_target +
            ' /servicesNS/admin/search/search/jobs/export search="search ' +
            rest_constraint +
            " | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host" +
            ' | eval data_name=\\"' +
            tk_input_elastic_source_data_name +
            '\\", data_index=\\"' +
            tk_input_elastic_source_elastic_data_index +
            '\\", data_sourcetype=\\"' +
            tk_input_elastic_source_elastic_data_sourcetype +
            '\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"' +
            ' output_mode="csv"' +
            ' earliest_time="' +
            tk_input_elastic_source_earliest +
            '"' +
            ' latest_time="' +
            tk_input_elastic_source_latest +
            '"' +
            " | head 1 | table value | restextract " +
            ' | `trackme_elastic_dedicated_tracker("' +
            tk_input_elastic_source_data_name +
            '")` | stats c';
        } else if (tk_input_elastic_source_search_type == "rest_from") {
          if (
            /datamodel:/i.test(tk_raw_input_elastic_source_search_constraint)
          ) {
            // Extract amd replace
            rest_matches = tk_raw_input_elastic_source_search_constraint.match(
              /((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)/
            );
            rest_target = rest_matches[1];
            rest_constraint = rest_matches[2];
            rest_constraint = rest_constraint.replace(/\"/g, '\\"');
            tk_elastic_alert_root_search =
              "| rest " +
              rest_target +
              ' /servicesNS/admin/search/search/jobs/export search="| from ' +
              rest_constraint +
              ' | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\\"' +
              tk_input_elastic_source_data_name +
              '\\", data_index=\\"' +
              tk_input_elastic_source_elastic_data_index +
              '\\", data_sourcetype=\\"' +
              tk_input_elastic_source_elastic_data_sourcetype +
              '\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"' +
              ' output_mode="csv" ' +
              ' earliest_time="' +
              tk_input_elastic_source_earliest +
              '"' +
              ' latest_time="' +
              tk_input_elastic_source_latest +
              '"' +
              " | head 1 | table value | restextract " +
              ' | `trackme_elastic_dedicated_tracker("' +
              tk_input_elastic_source_data_name +
              '")` | stats c';
          } else if (
            /lookup:/i.test(tk_raw_input_elastic_source_search_constraint)
          ) {
            // Extract amd replace
            rest_matches = tk_raw_input_elastic_source_search_constraint.match(
              /((?:splunk_server|splunk_server_group)\=[^\|]*)\s{0,}\|\s{0,}(.*)/
            );
            rest_target = rest_matches[1];
            rest_constraint = rest_matches[2];
            rest_constraint = rest_constraint.replace(/\"/g, '\\"');
            tk_elastic_alert_root_search =
              "| rest " +
              rest_target +
              ' /servicesNS/admin/search/search/jobs/export search="| from ' +
              rest_constraint +
              ' | eventstats max(_time) as indextime | eval _indextime=if(isnum(_indextime), _indextime, indextime) | fields - indextime | eval host=if(isnull(host), \\"none\\", host) | stats max(_indextime) as data_last_ingest, min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, count as data_eventcount, dc(host) as dcount_host | eval data_name=\\"' +
              tk_input_elastic_source_data_name +
              '\\", data_index=\\"' +
              tk_input_elastic_source_elastic_data_index +
              '\\", data_sourcetype=\\"' +
              tk_input_elastic_source_elastic_data_sourcetype +
              '\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"' +
              ' output_mode="csv" ' +
              ' earliest_time="' +
              tk_input_elastic_source_earliest +
              '"' +
              ' latest_time="' +
              tk_input_elastic_source_latest +
              '"' +
              " | head 1 | table value | restextract " +
              ' | `trackme_elastic_dedicated_tracker("' +
              tk_input_elastic_source_data_name +
              '")` | stats c';
          } else {
            notification(
              "ERROR: This from query is not supported, only datamodel and lookup based from queries are accepted.",
              6000
            );
            return;
          }
        } else if (tk_input_elastic_source_search_type == "mstats") {
          tk_elastic_alert_root_search =
            "| mstats latest(_value) as value where " +
            tk_raw_input_elastic_source_search_constraint +
            ' by host, metric_name span=1s | stats min(_time) as data_first_time_seen, max(_time) as data_last_time_seen, dc(metric_name) as data_eventcount, dc(host) as dcount_host | eval data_name="' +
            tk_input_elastic_source_data_name +
            '", data_index="' +
            tk_input_elastic_source_elastic_data_index +
            '", data_sourcetype="' +
            tk_input_elastic_source_elastic_data_sourcetype +
            '", data_last_ingest=data_last_time_seen, data_last_ingestion_lag_seen=now()-data_last_time_seen | `trackme_elastic_dedicated_tracker("' +
            tk_input_elastic_source_data_name +
            '")` | stats c';
        }

        function done(err) {
          //error handling logic here
        }

        // Specify properties for the alert.
        var alertOptions = {
          name: tracker_name,
          description: "Dedicated elastic tracker for data source",
          search: tk_elastic_alert_root_search,
          "dispatch.earliest_time": tk_input_elastic_source_earliest,
          "dispatch.latest_time": tk_input_elastic_source_latest,
          is_scheduled: "1",
          cron_schedule: "*/5 * * * *",
        };

        // Create a saved search/report as an alert.
        service.savedSearches().create(alertOptions, function (err, alert) {
          // Error checking.
          if (err && err.status === 409) {
            msg =
              "ERROR: A saved search/report with the name " +
              alertOptions.name +
              " already exists";

            // Audit
            action = "failure";
            change_type = "add elastic source tracker";
            object = tracker_name;
            object_category = "elastic_sources_tracker";
            object_attrs = tk_elastic_alert_root_search;
            result = msg;
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_elastic_source_alert_creation_error")
              .find(".modal-error-message p")
              .text(msg);
            $("#add_elastic_sources").modal("hide");
            $("#modal_elastic_source_alert_creation_error").modal();
            done();
            return;
          } else if (err) {
            msg =
              "There was an error creating the saved search/report: error code " +
              err.status;

            let errorStr = "Unknown Error!";
            if (
              err &&
              err.data &&
              err.data.messages &&
              err.data.messages[0]["text"]
            ) {
              errorStr =
                "error code: " +
                err.status +
                " - " +
                err.data.messages[0]["text"];
            } else if (err && err.data && err.data.messages) {
              errorStr = JSON.stringify(
                "error code: " + err.status + " - " + err.data.messages
              );
            }

            // Audit
            action = "failure";
            change_type = "add elastic source tracker";
            object = tracker_name;
            object_category = "elastic_sources_tracker";
            object_attrs = tk_elastic_alert_root_search;
            result = errorStr;
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_elastic_source_alert_creation_error")
              .find(".modal-error-message p")
              .text(errorStr);
            $("#add_elastic_sources").modal("hide");
            $("#modal_elastic_source_alert_creation_error").modal();
            done(err);
            return;
          } else {
            // clean status
            unsetToken("start_simulation_elastic_sources");

            // Confirmation message.

            // Audit
            action = "success";
            change_type = "add elastic source tracker";
            object = tracker_name;
            object_category = "elastic_sources_tracker";
            object_attrs = tk_elastic_alert_root_search;
            result = "N/A";
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            // Store in the KVstore for mapping purposes
            var myendpoint_URl =
              "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_elastic_sources_dedicated/";

            // Create a dictionary to store the field names and values
            var record = {
              data_name: tk_input_elastic_source_data_name,
              search_constraint: tk_raw_input_elastic_source_search_constraint,
              search_mode: tk_input_elastic_source_search_type,
              elastic_data_index: tk_input_elastic_source_elastic_data_index,
              elastic_data_sourcetype:
                tk_input_elastic_source_elastic_data_sourcetype,
              elastic_report: tracker_name,
            };
            $.ajax({
              url: myendpoint_URl,
              type: "POST",
              async: true,
              contentType: "application/json",
              data: JSON.stringify(record),
              success: function (returneddata) {
                // house cleaning
                myendpoint_URl = undefined;
                delete myendpoint_URl;
              },
              error: function (xhr, textStatus, error) {
                message = "Error Updating!" + xhr + textStatus + error;
              },
            });

            msg = "Created saved search/report as alert: " + alert.name;
            $("#modal_elastic_source_alert_creation_success")
              .find(".modal-error-message p")
              .text(msg);
            $("#add_elastic_sources").modal("hide");
            $("#modal_elastic_source_alert_creation_success").modal();

            done();
          }
        });
      } else {
        notification(
          "ERROR: Please successfully run the simulation first.",
          6000
        );
      }
    });
  });

  // run elastic shared tracker now
  $("#add_elastic_source_processed_run_tracker").click(function () {
    $("#add_elastic_source_processed").modal("hide");

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - Elastic sources shared tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-4h",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the Elastic Shared Tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataSourcesMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // run elastic shared tracker now
  $("#modal_elastic_source_alert_creation_success_run_tracker").click(
    function () {
      $("#modal_elastic_source_alert_creation_success").modal("hide");

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Get the tracker name
      var tk_tracker_name = tokens.get("tk_tracker_name");

      // Define the query
      var searchQuery = '| savedsearch "' + tk_tracker_name + '"';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-4h",
        latest_time: "now",
      };

      // Run a normal search that immediately returns the job's SID
      service.search(searchQuery, searchParams, function (err, job) {
        $("#loadingGray").remove();
        $("body").append(
          '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the dedicated elastic tracker' +
            tk_tracker_name +
            '...</p></div><div id="spinner"></div></div>'
        );

        require([
          "jquery",
          "/static/app/trackme/spin.js",
        ], function ($, Spinner) {
          new Spinner({
            lines: 12,
            length: 18,
            position: "relative",
            color: "#003b59",
          }).spin(document.getElementById("spinner"));
        });

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          $("#loadingGray").remove();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchDataSourcesMain.startSearch();

                $("#loadingGray").remove();
                $("#modal_update_collection_done").modal();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                $("#loadingGray").remove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                $("#loadingGray").remove();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    }
  );

  // delete elastic source

  $("#btn_modal_elastic_sources_add_delete").click(function () {
    $("#modify_elastic_sources").modal("hide");
    $("#delete_elastic_source_main").modal();
    $("#modify_elastic_sources").modal("hide");
  });

  function foreachDeleteSharedElasticSource(item) {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_multi_table_array = tokens.get("removeElasticSourceShared");
    var tk_comment = tokens.get("tk_comment");

    if (item && item.length) {
      // Define the query
      var searchQuery =
        '| trackme url="/services/trackme/v1/elastic_sources/elastic_shared_del" mode="delete" body="{\\"data_name\\": \\"' +
        item +
        '\\", \\"update_comment\\": \\"' +
        tk_comment +
        '\\"}"';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-5m",
        latest_time: "now",
      };

      // Run a normal search that immediately returns the job's SID
      service.search(searchQuery, searchParams, function (err, job) {
        $("#loadingGray").remove();
        $("body").append(
          '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Deleting shared elastic tracker...</p></div><div id="spinner"></div></div>'
        );

        require([
          "jquery",
          "/static/app/trackme/spin.js",
        ], function ($, Spinner) {
          new Spinner({
            lines: 12,
            length: 18,
            position: "relative",
            color: "#003b59",
          }).spin(document.getElementById("spinner"));
        });

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          $("#loadingGray").remove();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchElasticSources.startSearch();
                searchDataSourcesMain.startSearch();

                $("#loadingGray").remove();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                $("#loadingGray").remove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                $("#loadingGray").remove();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    }
  }

  $("#btn_delete_elastic_source_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeElasticSourceShared");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Retrieve update comment if any
    var tk_comment = document.getElementById(
      "elastic_source_shared_delete_comment"
    ).value;

    // if is not defined, give it a value and override text box content
    if (tk_comment == "null") {
      setToken(
        "tk_update_comment",
        TokenUtils.replaceTokenNames(
          "No comments for update.",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      // replace the textarea for modification requests
      document.getElementById("elastic_source_shared_delete_comment").value =
        "update note";
    } else if (tk_comment == "update note") {
      tk_comment = "No comment for update.";
      document.getElementById("elastic_source_shared_delete_comment").value =
        "update note";
    } else {
      // replace the textarea for modification requests
      document.getElementById("elastic_source_shared_delete_comment").value =
        "update note";
    }
    setToken("tk_comment", tk_comment);

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteSharedElasticSource);

    // Hide main modal
    $("#delete_elastic_source_main").modal("hide");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeElasticSourceShared");

    // Go back to modal
    $("#modify_elastic_sources").modal();
  });

  // delete elastic source

  $("#btn_modal_elastic_sources_dedicated_add_delete").click(function () {
    $("#modify_elastic_sources_dedicated").modal("hide");
    $("#delete_elastic_source_main_dedicated").modal();
  });

  function foreachDeleteDedicatedElasticSource(item) {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_multi_table_array = tokens.get("removeElasticSourceDedicated");
    var tk_comment = tokens.get("tk_comment");

    if (item && item.length) {
      // Define the query
      var searchQuery =
        '| trackme url="/services/trackme/v1/elastic_sources/elastic_dedicated_del" mode="delete" body="{\\"data_name\\": \\"' +
        item +
        '\\", \\"update_comment\\": \\"' +
        tk_comment +
        '\\"}"';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-5m",
        latest_time: "now",
      };

      // Run a normal search that immediately returns the job's SID
      service.search(searchQuery, searchParams, function (err, job) {
        $("#loadingGray").remove();
        $("body").append(
          '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Deleting dedicated elastic tracker...</p></div><div id="spinner"></div></div>'
        );

        require([
          "jquery",
          "/static/app/trackme/spin.js",
        ], function ($, Spinner) {
          new Spinner({
            lines: 12,
            length: 18,
            position: "relative",
            color: "#003b59",
          }).spin(document.getElementById("spinner"));
        });

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          $("#loadingGray").remove();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchElasticSourcesDedicated.startSearch();
                searchDataSourcesMain.startSearch();

                $("#loadingGray").remove();
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                $("#loadingGray").remove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                $("#loadingGray").remove();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    }
  }

  $("#btn_delete_elastic_source_dedicated_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeElasticSourceDedicated");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Retrieve update comment if any
    var tk_comment = document.getElementById(
      "elastic_source_dedicated_delete_comment"
    ).value;

    // if is not defined, give it a value and override text box content
    if (tk_comment == "null") {
      setToken(
        "tk_update_comment",
        TokenUtils.replaceTokenNames(
          "No comments for update.",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      // replace the textarea for modification requests
      document.getElementById("elastic_source_dedicated_delete_comment").value =
        "update note";
    } else if (tk_comment == "update note") {
      tk_comment = "No comment for update.";
      document.getElementById("elastic_source_dedicated_delete_comment").value =
        "update note";
    } else {
      // replace the textarea for modification requests
      document.getElementById("elastic_source_dedicated_delete_comment").value =
        "update note";
    }
    setToken("tk_comment", tk_comment);

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachDeleteDedicatedElasticSource);

    // Hide main modal
    $("#delete_elastic_source_main_dedicated").modal("hide");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeElasticSourceDedicated");

    // Go back to modal
    $("#modify_elastic_sources_dedicated").modal();
  });

  //
  // Custom lagging classes
  //

  $(".btn_modify_custom_lagging").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_custom_lagging", "true");
      // Show input modal
      $("#modify_custom_lagging").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_custom_lagging_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modify_custom_lagging").modal();
  });

  //
  // Metrics SLA policies in-modal editor
  //

  $(".btn_modify_metric_sla_policies").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_metric_sla_policies", "true");
      // Show input modal
      $("#modal_metric_sla_policies").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_sla_policy_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_metric_sla_policies").modal();
  });

  //
  // allowlisting data source
  //

  $(".btn_modify_data_source_whitelist").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_source_whitelist", "true");
      // Show input modal
      $("#modal_modify_data_source_whitelist").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_whitelist_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_source_whitelist").modal();
  });

  //
  // allowlisting data host
  //

  $(".btn_modify_data_host_whitelist").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_host_whitelist", "true");
      // Show input modal
      $("#modal_modify_data_host_whitelist").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_whitelist_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_host_whitelist").modal();
  });

  //
  // Metrics hosts Search & Report
  //

  // Show modal
  $("#btn_search_metric_reports").click(function () {
    // Show input modal
    $("#metric_hosts_search_and_reports").modal();
  });

  // back button
  $("#btn_metric_host_search_and_report_back").click(function () {
    // Show input modal
    $("#modal_manage_metric_host").modal();
  });

  //
  // allowlisting metric host
  //

  $(".btn_modify_metric_host_whitelist").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_metric_host_whitelist", "true");
      // Show input modal
      $("#modal_modify_metric_host_whitelist").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_host_whitelist_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_metric_host_whitelist").modal();
  });

  //
  // blacklisting data source
  //

  // host blacklist

  $(".btn_modify_data_source_blacklist_host").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_source_blacklist_host", "true");
      // Show input modal
      $("#modal_modify_data_source_blacklist_host").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_host_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_host").modal();
  });

  // indexe blacklist

  $(".btn_modify_data_source_blacklist_index").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_source_blacklist_index", "true");
      // Show input modal
      $("#modal_modify_data_source_blacklist_index").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_index_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_index").modal();
  });

  // sourcetype blacklist

  $(".btn_modify_data_source_blacklist_sourcetype").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_source_blacklist_sourcetype", "true");
      // Show input modal
      $("#modal_modify_data_source_blacklist_sourcetype").modal();
    });
  });

  // data_name blacklist

  $(".btn_modify_data_source_blacklist_data_name").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_source_blacklist_data_name", "true");
      // Show input modal
      $("#modal_modify_data_source_blacklist_data_name").modal();
    });
  });

  // blacklisting data host

  // host blacklist

  $(".btn_modify_data_host_blacklist_host").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_host_blacklist_host", "true");
      // Show input modal
      $("#modal_modify_data_host_blacklist_host").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_blacklist_host_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_host_blacklist_host").modal();
  });

  // indexe blacklist

  $(".btn_modify_data_host_blacklist_index").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_host_blacklist_index", "true");
      // Show input modal
      $("#modal_modify_data_host_blacklist_index").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_blacklist_index_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_host_blacklist_index").modal();
  });

  // sourcetype blacklist

  $(".btn_modify_data_host_blacklist_sourcetype").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_data_host_blacklist_sourcetype", "true");
      // Show input modal
      $("#modal_modify_data_host_blacklist_sourcetype").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_blacklist_sourcetype_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_host_blacklist_sourcetype").modal();
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_sourcetype_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_sourcetype").modal();
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_data_name_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_data_name").modal();
  });

  // metric_host blacklist

  // host blacklist

  $(".btn_modify_metric_host_blacklist_host").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_metric_host_blacklist_host", "true");
      // Show input modal
      $("#modal_modify_metric_host_blacklist_host").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_host_blacklist_host_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_metric_host_blacklist_host").modal();
  });

  // indexe blacklist

  $(".btn_modify_metric_host_blacklist_index").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_metric_host_blacklist_index", "true");
      // Show input modal
      $("#modal_modify_metric_host_blacklist_index").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_host_blacklist_index_cancel").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_metric_host_blacklist_index").modal();
  });

  // metric category
  $(".btn_modify_metric_host_blacklist_metric_category").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("start_modify_metric_host_blacklist_metric_category", "true");
      // Show input modal
      $("#modal_modify_metric_host_blacklist_metric_category").modal();
    });
  });

  // Ops: Indexer queues
  $(".btn_ops_index_queue").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("tk_start_indexers_queues_searches", "true");

      // Show input modal
      $("#modal_queues").modal();
    });
  });

  // Unset token when bootstrap modal is closed properly
  $("#btn_ops_index_queue_close").click(function () {
    submitTokens();

    unsetToken("tk_start_indexers_queues_searches");
  });

  // Ops: Parsing issues

  $(".btn_ops_parsing_issues").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();
      setToken("tk_start_parsing_issues_searches", "true");
      var tk_hosts = tokens.get("inputHostParsing");

      // Show input modal
      $("#modal_parsing_issues").modal();
    });
  });

  $("#btn_search_parsing_issues_linebreaking").click(function () {
    submitTokens();
    setToken("tk_start_parsing_issues_searches", "true");
    var tk_earliest = tokens.get("inputLinkParsingIssuesTime.earliest");
    var tk_latest = tokens.get("inputLinkParsingIssuesTime.latest");
    var tk_hosts = tokens.get("inputHostParsing");

    // Define the history search
    var search_parsing_issues_linebreaking =
      "search" +
      "?q=search%20" +
      encodeURI(
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=LineBreakingProcessor "
      ) +
      encodeURI(tk_hosts) +
      "&earliest=" +
      encodeURI(tk_earliest) +
      "&latest=" +
      encodeURI(tk_latest);

    // Open
    window.open(search_parsing_issues_linebreaking, "_blank");
  });

  $("#btn_search_parsing_issues_aggregator").click(function () {
    submitTokens();
    setToken("tk_start_parsing_issues_searches", "true");
    var tk_earliest = tokens.get("inputLinkParsingIssuesTime.earliest");
    var tk_latest = tokens.get("inputLinkParsingIssuesTime.latest");
    var tk_hosts = tokens.get("inputHostParsing");

    // Define the history search
    var search_parsing_issues_aggregator =
      "search" +
      "?q=search%20" +
      encodeURI(
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=AggregatorMiningProcessor "
      ) +
      encodeURI(tk_hosts) +
      "&earliest=" +
      encodeURI(tk_earliest) +
      "&latest=" +
      encodeURI(tk_latest);

    // Open
    window.open(search_parsing_issues_aggregator, "_blank");
  });

  $("#btn_search_parsing_issues_dateparser").click(function () {
    submitTokens();
    setToken("tk_start_parsing_issues_searches", "true");
    var tk_earliest = tokens.get("inputLinkParsingIssuesTime.earliest");
    var tk_latest = tokens.get("inputLinkParsingIssuesTime.latest");
    var tk_hosts = tokens.get("inputHostParsing");

    // Define the history search
    var search_parsing_issues_dateparser =
      "search" +
      "?q=search%20" +
      encodeURI(
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=DateParserVerbose "
      ) +
      encodeURI(tk_hosts) +
      encodeURI(" | `trackme_rex_dateparserverbose`") +
      "&earliest=" +
      encodeURI(tk_earliest) +
      "&latest=" +
      encodeURI(tk_latest);

    // Open
    window.open(search_parsing_issues_dateparser, "_blank");
  });

  // Unset token when bootstrap modal is closed properly
  $("#btn_ops_parsing_issues_close").click(function () {
    submitTokens();

    unsetToken("tk_start_parsing_issues_searches");
  });

  //
  // RUN TRACKERS
  //

  $("#btn_run_trackers").click(function () {
    // Show input modal
    $("#modal_run_data_source_trackers").modal();
  });

  $("#btn_run_data_host_trackers").click(function () {
    // Show input modal
    $("#modal_run_data_host_trackers").modal();
  });

  //
  // UPDATE COLLECTION
  //

  // Call this function when the Update collection button is clicked

  $("#btn_run_tracker").click(function () {
    submitTokens();

    $("#modal_run_data_source_trackers").modal("hide");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - Data sources availability short term tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-4h",
      latest_time: "+4h",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the data sources short term tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataSourcesMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  $("#btn_run_tracker_host").click(function () {
    submitTokens();

    $("#modal_run_data_host_trackers").modal("hide");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - hosts availability short term tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-4h",
      latest_time: "+4h",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the host short term tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataHostsMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Call this function when the Update collection button is clicked

  $("#btn_run_tracker_longterm").click(function () {
    submitTokens();

    $("#modal_run_data_source_trackers").modal("hide");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - Data sources availability long term tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-24h",
      latest_time: "-4h",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the data sources long term tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataSourcesMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  $("#btn_run_tracker_host_longterm").click(function () {
    submitTokens();

    $("#modal_run_data_host_trackers").modal("hide");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - hosts availability long term tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-7d",
      latest_time: "+4h",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the host long term tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataHostsMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Elastic shared tracker

  $("#btn_run_tracker_shared_elastic").click(function () {
    submitTokens();

    $("#modal_run_data_source_trackers").modal("hide");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - Elastic sources shared tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-4h",
      latest_time: "+4h",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the Elastic sources Shared tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataSourcesMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Data Sampling tracker

  $("#btn_run_tracker_data_sampling").click(function () {
    submitTokens();

    $("#modal_run_data_source_trackers").modal("hide");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - Data sampling and format detection tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-24h",
      latest_time: "+4h",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the Data sampling & events format recognition tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataSourcesMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // metric host

  $("#btn_run_tracker_metric_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - metric hosts availability tracker"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-5m",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the metric tracker...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchMetricHostsMain.startSearch();

              $("#loadingGray").remove();
              $("#modal_update_collection_done").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Show main

  // for data sources

  $("#btn_modify_data_source_blacklist_main").click(function () {
    // Show input modal
    $("#modal_manage_data_source_blacklists").modal();
  });

  // Cancel buttons

  $("#btn_modal_data_source_whitelist_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_source_blacklists").modal();
  });

  $("#btn_modal_data_source_blacklist_host_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_source_blacklists").modal();
  });

  $("#btn_modal_data_source_blacklist_index_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_source_blacklists").modal();
  });

  $("#btn_modal_data_source_blacklist_sourcetype_add_cancel").click(
    function () {
      // Show input modal
      $("#modal_manage_data_source_blacklists").modal();
    }
  );

  $("#btn_modal_data_source_blacklist_data_name_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_source_blacklists").modal();
  });

  // for data hosts

  // for data sources

  $("#btn_modify_data_host_blacklist_main").click(function () {
    // Show input modal
    $("#modal_manage_data_host_blacklists").modal();
  });

  // for metric indexes
  $("#btn_modify_metric_host_blacklist_main").click(function () {
    // Show input modal
    $("#modal_manage_metric_host_blacklists").modal();
  });

  // Cancel buttons

  $("#btn_modal_data_host_whitelist_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_host_blacklists").modal();
  });

  $("#btn_modal_data_host_blacklist_index_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_host_blacklists").modal();
  });

  $("#btn_modal_metric_host_blacklist_index_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_metric_host_blacklists").modal();
  });

  $("#btn_modal_data_host_blacklist_sourcetype_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_host_blacklists").modal();
  });

  $("#btn_modal_data_host_blacklist_host_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_data_host_blacklists").modal();
  });

  $("#btn_modal_metric_host_blacklist_host_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_metric_host_blacklists").modal();
  });

  $("#btn_modal_metric_host_whitelist_add_cancel").click(function () {
    // Show input modal
    $("#modal_manage_metric_host_blacklists").modal();
  });

  $("#btn_modal_metric_host_blacklist_metric_category_add_cancel").click(
    function () {
      // Show input modal
      $("#modal_manage_metric_host_blacklists").modal();
    }
  );

  //
  // MODIFY BUTTON
  //

  // data source monitoring

  $("#btn_modify_data_source").click(function () {
    submitTokens();

    // Hide main modal
    $("#modal_manage").modal("hide");

    // Show input modal
    $("#modal_modify_data_source_unified").modal();
  });

  // cancel button: returns to selected
  $("#btn_close_data_source_unified").click(function () {
    submitTokens();

    // Show modal
    $("#modal_manage").modal();
  });

  $("#btn_modal_modify_wdays").click(function () {
    submitTokens();

    // Show input modal
    $("#modal_modify_monitoring_wdays").modal();
  });

  $("#btn_modal_modify_monitoring_wdays_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_wdays";

    var tk_origin_data_monitoring_wdays = tokens.get(
      "tk_data_monitoring_wdays"
    );
    var tk_data_monitoring_wdays = tokens.get("tk_input_wdays");

    if (!tk_data_monitoring_wdays || !tk_data_monitoring_wdays.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_name: tk_data_name,
        data_monitoring_wdays: tk_data_monitoring_wdays,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataSourcesMain.startSearch();

          // call update data source
          updateDataSource(tk_keyid);

          // notify
          notification("Modification has been registered successfully.", 2000);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;

          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify week days monitoring";
          object = tk_data_name;
          object_category = "data_source";
          object_attrs =
            "data_monitoring_wdays changed from:" +
            tk_origin_data_monitoring_wdays +
            " to:" +
            tk_data_monitoring_wdays;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // priority
  $("#btn_modal_modify_priority_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_priority = tokens.get("tk_priority");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_priority";

    var tk_origin_priority = tk_priority;
    var tk_new_priority = tokens.get("tk_input_priority");

    if (!tk_new_priority || !tk_new_priority.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        object_category: "data_source",
        data_name: tk_data_name,
        priority: tk_new_priority,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataSourcesMain.startSearch();

          // call update data source
          updateDataSource(tk_keyid);

          // notify
          notification("Modification has been registered successfully.", 2000);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;

          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify priority";
          object = tk_data_name;
          object_category = "data_source";
          object_attrs =
            "priority changed from:" +
            tk_origin_priority +
            " to:" +
            tk_new_priority;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  $("#btn_modal_modify_wdays_no").click(function () {
    // Show input modal
    $("#modal_modify_monitoring_wdays_no").modal();
  });

  $("#btn_modal_modify_monitoring_wdays_no_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_wdays";

    var tk_origin_data_monitoring_wdays = tokens.get(
      "tk_data_monitoring_wdays"
    );
    var tk_data_monitoring_wdays_no = tokens.get("tk_input_wdays_no");

    if (!tk_data_monitoring_wdays_no || !tk_data_monitoring_wdays_no.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_name: tk_data_name,
        data_monitoring_wdays: tk_data_monitoring_wdays_no,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataSourcesMain.startSearch();

          $("#modal_modify_data_source_unified").modal();

          // call update data source
          updateDataSource(tk_keyid);

          // notify
          notification("Modification has been registered successfully.", 2000);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify week days monitoring";
          object = tk_data_name;
          object_category = "data_source";
          object_attrs =
            "data_monitoring_wdays changed from:" +
            tk_origin_data_monitoring_wdays +
            " to:" +
            tk_data_monitoring_wdays_no;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // cancel: returns to unified modal
  $("#btn_modal_modify_monitoring_wdays_no_cancel").click(function () {
    // Show input modal
    $("#modal_modify_data_source_unified").modal();
  });

  //
  // Modify monitoring level
  //

  $("#btn_modal_modify_level").click(function () {
    // Show input modal
    $("#modal_modify_monitoring_level").modal();
  });

  $("#btn_modal_modify_monitoring_level_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_monitoring_level";

    var tk_data_monitoring_level = tokens.get("tk_input_level");
    var tk_origin_data_monitoring_level = tokens.get(
      "tk_data_monitoring_level"
    );

    if (!tk_data_monitoring_level || !tk_data_monitoring_level.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_name: tk_data_name,
        data_monitoring_level: tk_data_monitoring_level,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataSourcesMain.startSearch();

          // call update data source
          updateDataSource(tk_keyid);

          // notify
          notification("Modification has been registered successfully.", 2000);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify monitoring level";
          object = tk_data_name;
          object_category = "data_source";
          object_attrs =
            "data_monitoring_level changed from:" +
            tk_origin_data_monitoring_level +
            " to:" +
            tk_data_monitoring_level;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  //
  // dcount host
  //

  $("#btn_modal_modify_dcount_host_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_min_dcount_host = tokens.get("tk_min_dcount_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_min_dcount_host";

    var tk_input_data_source_dcount_host = tokens.get(
      "tk_input_data_source_dcount_host"
    );
    var tk_origin_dcount_host = tokens.get("tk_min_dcount_host");

    if (
      !tk_input_data_source_dcount_host ||
      !tk_input_data_source_dcount_host.length
    ) {
      // Show an error notification
      notification(
        'ERROR: the minimal distinct host count value needs to be a positive integer, or the string "any" to define any value.',
        6000
      );
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_name: tk_data_name,
        min_dcount_host: tk_input_data_source_dcount_host,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataSourcesMain.startSearch();

          // call update data source
          updateDataSource(tk_keyid);

          // notify
          notification("Modification has been registered successfully.", 2000);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify minimal hosts distinct count number";
          object = tk_data_name;
          object_category = "data_source";
          object_attrs =
            "min_dcount_host changed from:" +
            tk_origin_dcount_host +
            " to:" +
            tk_input_data_source_dcount_host;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  //
  // Modify lag
  //

  $("#btn_modal_modify_lag").click(function () {
    // Show input modal
    $("#modal_modify_lag").modal();
  });

  $("#btn_modal_modify_lag_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_lag_policy";

    // max lag allowed
    var tk_data_max_lag_allowed = tokens.get("tk_input_lag");

    // alert over kpis
    var tk_data_lag_alert_kpis = tokens.get("tk_input_data_lag_alert_kpis");

    // lagging class override
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );

    if (
      !tk_data_max_lag_allowed ||
      !tk_data_max_lag_allowed.length ||
      !isNumeric(tk_data_max_lag_allowed)
    ) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_name: tk_data_name,
        data_max_lag_allowed: tk_data_max_lag_allowed,
        data_lag_alert_kpis: tk_data_lag_alert_kpis,
        data_override_lagging_class: tk_data_override_lagging_class,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataSourcesMain.startSearch();
          // call update data source
          updateDataSource(tk_keyid);
          // notify
          notification("Modification has been registered successfully.", 2000);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify monitoring lag policy";
          object = tk_data_name;
          object_category = "data_source";
          object_attrs =
            '{"data_max_lag_allowed": "' +
            tk_data_max_lag_allowed +
            '", "data_override_lagging_class": "' +
            tk_data_override_lagging_class +
            '", "data_lag_alert_kpis": "' +
            tk_data_lag_alert_kpis +
            '"}';
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // Show main modal
  $("#btn_modal_modify_lag_auto_main").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Free the searches
    setToken("show_data_source_autolagging", "true");

    // Show modal
    $("#modal_modify_data_source_autolag").modal();
  });

  // Show main modal back
  $("#btn_close_data_source_unified_autolag").click(function () {
    $("#modal_modify_data_source_unified").modal();
  });

  $("#btn_modal_modify_lag_auto_perc95").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index="' +
      tk_data_index +
      '" sourcetype="' +
      tk_data_sourcetype +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats perc95(delta) as value | eval data_name="' +
      tk_data_name +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_data_source_monitoring data_name OUTPUT _key as keyid | lookup trackme_data_source_monitoring data_name | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_data_source_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-7d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_source_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_source_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "data_max_lag_allowed") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataSourcesMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag", value);
                        tk_data_max_lag_allowed = value;

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_name;
                        object_category = "data_source";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataSource(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  $("#btn_modal_modify_lag_auto_average").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index="' +
      tk_data_index +
      '" sourcetype="' +
      tk_data_sourcetype +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats avg(delta) as value | eval data_name="' +
      tk_data_name +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_data_source_monitoring data_name OUTPUT _key as keyid | lookup trackme_data_source_monitoring data_name | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_data_source_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-7d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_source_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_source_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "data_max_lag_allowed") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataSourcesMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag", value);
                        tk_data_max_lag_allowed = value;

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_name;
                        object_category = "data_source";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataSource(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  $("#btn_modal_modify_lag_auto_perc95_30d").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index="' +
      tk_data_index +
      '" sourcetype="' +
      tk_data_sourcetype +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats perc95(delta) as value | eval data_name="' +
      tk_data_name +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_data_source_monitoring data_name OUTPUT _key as keyid | lookup trackme_data_source_monitoring data_name | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_data_source_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-30d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_source_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_source_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "data_max_lag_allowed") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataSourcesMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag", value);
                        tk_data_max_lag_allowed = value;

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_name;
                        object_category = "data_source";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataSource(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  $("#btn_modal_modify_lag_auto_average_30d").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index="' +
      tk_data_index +
      '" sourcetype="' +
      tk_data_sourcetype +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats avg(delta) as value | eval data_name="' +
      tk_data_name +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_data_source_monitoring data_name OUTPUT _key as keyid | lookup trackme_data_source_monitoring data_name | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_data_source_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-30d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_source_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_source_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "data_max_lag_allowed") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataSourcesMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag", value);
                        tk_data_max_lag_allowed = value;

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_name;
                        object_category = "data_source";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataSource(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  // metric host monitoring

  $("#btn_modify_metric_host").click(function () {
    // Hide main modal
    $("#modal_manage_metrichost").modal("hide");

    // Show input modal
    $("#modal_modify_metric_host_unified").modal();
  });

  // data host monitoring

  $("#btn_modify_data_host").click(function () {
    // Hide main modal
    $("#modal_manage_host").modal("hide");

    // Show input modal
    $("#modal_modify_data_host_unified").modal();
  });

  // cancel button: returns to selected
  $("#btn_close_data_host_unified").click(function () {
    submitTokens();

    // Show modal
    $("#modal_manage_host").modal();
  });

  //
  // Modify monitoring wdays
  //

  $("#btn_modal_modify_wdays_host").click(function () {
    // Show input modal
    $("#modal_modify_monitoring_wdays_host").modal();
  });

  $("#btn_modal_modify_monitoring_wdays_host_confirm").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_wdays";

    var tk_origin_data_monitoring_wdays = tokens.get(
      "tk_data_monitoring_wdays"
    );
    var tk_data_monitoring_wdays = tokens.get("tk_input_wdays_host");

    if (!tk_data_monitoring_wdays || !tk_data_monitoring_wdays.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_host: tk_data_host,
        data_monitoring_wdays: tk_data_monitoring_wdays,
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataHostsMain.startSearch();

          // notify
          notification("Modification has been registered successfully.", 2000);

          // call update data source
          updateDataHost(tk_keyid);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify week days monitoring";
          object = tk_data_host;
          object_category = "data_host";
          object_attrs =
            "data_monitoring_wdays changed from:" +
            tk_origin_data_monitoring_wdays +
            " to:" +
            tk_data_monitoring_wdays;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // host priority
  $("#btn_modal_modify_priority_host_confirm").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_priority = tokens.get("tk_priority");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_priority";

    var tk_origin_priority = tk_priority;
    var tk_new_priority = tokens.get("tk_input_host_priority");

    if (!tk_new_priority || !tk_new_priority.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_host: tk_data_host,
        priority: tk_new_priority,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataHostsMain.startSearch();

          // notify
          notification("Modification has been registered successfully.", 2000);

          // call update data source
          updateDataHost(tk_keyid);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify priority";
          object = tk_data_host;
          object_category = "data_host";
          object_attrs =
            "priority changed from:" +
            tk_origin_priority +
            " to:" +
            tk_new_priority;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  $("#btn_modal_modify_wdays_host_no").click(function () {
    // Show input modal
    $("#modal_modify_monitoring_wdays_host_no").modal();
  });

  // Week days

  $("#btn_modal_modify_monitoring_wdays_host_no_confirm").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_index = tokens.get("tk_data_index");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
    var tk_data_host_st_summary = tokens.get("tk_data_host_st_summary");
    var tk_data_host_alerting_policy = tokens.get(
      "tk_data_host_alerting_policy"
    );
    var tk_data_last_lag_seen = tokens.get("tk_data_last_lag_seen");
    var tk_data_last_ingestion_lag_seen = tokens.get(
      "tk_data_last_ingestion_lag_seen"
    );
    var tk_data_eventcount = tokens.get("tk_data_eventcount");
    var tk_data_first_time_seen = tokens.get("tk_data_first_time_seen");
    var tk_data_last_time_seen = tokens.get("tk_data_last_time_seen");
    var tk_data_last_ingest = tokens.get("tk_data_last_ingest");
    var tk_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");
    var tk_data_lag_alert_kpis = tokens.get("tk_data_lag_alert_kpis");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");
    var tk_data_monitored_state = tokens.get("tk_data_monitored_state");
    var tk_data_override_lagging_class = tokens.get(
      "tk_data_override_lagging_class"
    );
    var tk_data_host_state = tokens.get("tk_data_host_state");
    var tk_data_tracker_runtime = tokens.get("tk_data_tracker_runtime");
    var tk_data_previous_host_state = tokens.get("tk_data_previous_host_state");
    var tk_data_previous_tracker_runtime = tokens.get(
      "tk_data_previous_tracker_runtime"
    );
    var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
    var tk_outlierlowerthresholdmultiplier = tokens.get(
      "tk_outlierlowerthresholdmultiplier"
    );
    var tk_outlierupperthresholdmultiplier = tokens.get(
      "tk_outlierupperthresholdmultiplier"
    );
    var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
    var tk_outlier_period = tokens.get("tk_outlier_period");
    var tk_outlier_span = tokens.get("tk_outlier_span");
    var tk_isoutlier = tokens.get("tk_isoutlier");
    var tk_enable_behaviour_analytic = tokens.get(
      "tk_enable_behaviour_analytic"
    );
    var tk_latest_flip_state = tokens.get("tk_latest_flip_state");
    var tk_latest_flip_time = tokens.get("tk_latest_flip_time");
    var tk_priority = tokens.get("tk_priority");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_host_monitoring/" +
      tk_keyid;

    var tk_origin_data_monitoring_wdays = tokens.get(
      "tk_data_monitoring_wdays"
    );
    var tk_data_monitoring_wdays_no = tokens.get("tk_input_wdays_host_no");

    if (!tk_data_monitoring_wdays_no || !tk_data_monitoring_wdays_no.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        object_category: "data_host",
        data_host: tk_data_host,
        data_index: tk_data_index,
        data_sourcetype: tk_data_sourcetype,
        data_host_st_summary: tk_data_host_st_summary,
        data_host_alerting_policy: tk_data_host_alerting_policy,
        data_last_lag_seen: tk_data_last_lag_seen,
        data_last_ingestion_lag_seen: tk_data_last_ingestion_lag_seen,
        data_eventcount: tk_data_eventcount,
        data_first_time_seen: tk_data_first_time_seen,
        data_last_time_seen: tk_data_last_time_seen,
        data_last_ingest: tk_data_last_ingest,
        data_max_lag_allowed: tk_data_max_lag_allowed,
        data_lag_alert_kpis: tk_data_lag_alert_kpis,
        data_monitored_state: tk_data_monitored_state,
        data_monitoring_wdays: tk_data_monitoring_wdays_no,
        data_override_lagging_class: tk_data_override_lagging_class,
        data_host_state: tk_data_host_state,
        data_tracker_runtime: tk_data_tracker_runtime,
        data_previous_host_state: tk_data_previous_host_state,
        data_previous_tracker_runtime: tk_data_previous_tracker_runtime,
        OutlierMinEventCount: tk_outliermineventcount,
        OutlierLowerThresholdMultiplier: tk_outlierlowerthresholdmultiplier,
        OutlierUpperThresholdMultiplier: tk_outlierupperthresholdmultiplier,
        OutlierAlertOnUpper: tk_outlieralertonupper,
        OutlierTimePeriod: tk_outlier_period,
        OutlierSpan: tk_outlier_span,
        isOutlier: tk_isoutlier,
        enable_behaviour_analytic: tk_enable_behaviour_analytic,
        latest_flip_state: tk_latest_flip_state,
        latest_flip_time: tk_latest_flip_time,
        priority: tk_priority,
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataHostsMain.startSearch();

          $("#modal_modify_data_host_unified").modal();

          // notify
          notification("Modification has been registered successfully.", 2000);

          // call update data source
          updateDataHost(tk_keyid);

          // Audit
          action = "success";
          change_type = "modify week days monitorin";
          object = tk_data_host;
          object_category = "data_host";
          object_attrs =
            "data_monitoring_wdays changed from:" +
            tk_origin_data_monitoring_wdays +
            " to:" +
            tk_data_monitoring_wdays_no;
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message = "Error Updating!" + xhr + textStatus + error;

          // Audit
          action = "failure";
          change_type = "modify week days monitorin";
          object = tk_data_host;
          object_category = "data_host";
          object_attrs =
            "data_monitoring_wdays changed from:" +
            tk_origin_data_monitoring_wdays +
            " to:" +
            tk_data_monitoring_wdays_no;
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // cancel: returns to unified modal
  $("#btn_modal_modify_monitoring_wdays_host_no_cancel").click(function () {
    // Show input modal
    $("#modal_modify_data_host_unified").modal();
  });

  //
  // data source id
  //

  //
  // Modify lag
  //

  $("#btn_modal_modify_lag_host").click(function () {
    // Show input modal
    $("#modal_modify_lag_host").modal();
  });

  $("#btn_modal_modify_lag_confirm_host").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_lag_policy";

    // max lag allowed
    var tk_data_max_lag_allowed = tokens.get("tk_input_lag_host");

    // alert over kpis
    var tk_data_lag_alert_kpis = tokens.get(
      "tk_input_data_lag_alert_kpis_host"
    );

    // alerting policy
    var tk_data_host_alerting_policy = tokens.get(
      "tk_input_host_alerting_policy"
    );

    // lagging class override
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class_host"
    );

    if (
      !tk_data_max_lag_allowed ||
      !tk_data_max_lag_allowed.length ||
      !isNumeric(tk_data_max_lag_allowed)
    ) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      // Create a dictionary to store the field names and values
      var record = {
        data_host: tk_data_host,
        data_host_alerting_policy: tk_data_host_alerting_policy,
        data_max_lag_allowed: tk_data_max_lag_allowed,
        data_lag_alert_kpis: tk_data_lag_alert_kpis,
        data_override_lagging_class: tk_data_override_lagging_class,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // Run the search again to update the table
          searchDataHostsMain.startSearch();

          // notify
          notification("Modification has been registered successfully.", 2000);

          // call update data source
          updateDataHost(tk_keyid);

          // house cleaning
          myendpoint_URl = undefined;
          delete myendpoint_URl;
          tk_keyid = undefined;
          delete tk_keyid;
          return;
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify monitoring lag policy";
          object = tk_data_host;
          object_category = "data_host";
          object_attrs =
            '{"data_max_lag_allowed": "' +
            tk_data_max_lag_allowed +
            '", "data_override_lagging_class": "' +
            tk_data_override_lagging_class +
            '", "data_lag_alert_kpis": ' +
            tk_data_lag_alert_kpis +
            '"}';
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  // Show main modal
  $("#btn_modal_modify_lag_auto_main_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Free the searches
    setToken("show_data_host_autolagging", "true");

    // Show modal
    $("#modal_modify_data_host_autolag").modal();
  });

  // Show main modal back
  $("#btn_close_data_host_unified_autolag").click(function () {
    $("#modal_modify_data_host_unified").modal();
  });

  $("#btn_modal_modify_lag_auto_perc95_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index=* host="' +
      tk_data_host +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats perc95(delta) as value | eval data_host="' +
      tk_data_host +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_host_monitoring data_host OUTPUT _key as keyid | lookup trackme_host_monitoring data_host | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_host_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-7d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_host_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_host_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "value") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataHostsMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag_host", value);
                        tk_data_max_lag_allowed = value;

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_host;
                        object_category = "data_host";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataHost(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  $("#btn_modal_modify_lag_auto_average_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index=* host="' +
      tk_data_host +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats avg(delta) as value | eval data_host="' +
      tk_data_host +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_host_monitoring data_host OUTPUT _key as keyid | lookup trackme_host_monitoring data_host | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_host_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-7d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_host_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_host_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "value") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataHostsMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag_host", value);

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_host;
                        object_category = "data_host";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataHost(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  $("#btn_modal_modify_lag_auto_perc95_30d_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index=* host="' +
      tk_data_host +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats perc95(delta) as value | eval data_host="' +
      tk_data_host +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_host_monitoring data_host OUTPUT _key as keyid | lookup trackme_host_monitoring data_host | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_host_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-30d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_host_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_host_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "value") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataHostsMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag_host", value);

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_host;
                        object_category = "data_host";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataHost(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  $("#btn_modal_modify_lag_auto_average_30d_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_data_override_lagging_class = tokens.get(
      "modal_input_lag_override_class"
    );
    var tk_origin_data_max_lag_allowed = tokens.get("tk_data_max_lag_allowed");

    // Define the query
    var searchQuery =
      '| `trackme_tstats` count latest(_indextime) as indextime where index=* host="' +
      tk_data_host +
      '"  by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats avg(delta) as value | eval data_host="' +
      tk_data_host +
      '", data_override_lagging_class="' +
      tk_data_override_lagging_class +
      '" | lookup trackme_host_monitoring data_host OUTPUT _key as keyid | lookup trackme_host_monitoring data_host | eval data_max_lag_allowed=if(value>0, round(value, 0), data_max_lag_allowed), value=round(value, 0) | outputlookup trackme_host_monitoring key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-30d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // hide the current modal
      $("#modal_modify_data_host_autolag").modal("hide");

      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Please wait while determining the entity lagging value...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              $("#loadingGray").remove();

              // if the action is very fast, the modal may fail, show up after 1 sec
              setTimeout(function () {
                $("#modal_modify_data_host_unified").modal();
              }, 1000);

              // Get the results and display them
              job.results({}, function (err, results) {
                var fields = results.fields;
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                  var values = rows[i];
                  for (var j = 0; j < values.length; j++) {
                    var field = fields[j];
                    var value = values[j];

                    if (field == "value") {
                      if (value === "0") {
                        notification(
                          "ERROR: No live data available for this entity, automatic lagging calculation cannot be performed for inactive entities.",
                          6000
                        );
                      } else {
                        // Run the search again to update the table
                        searchDataHostsMain.startSearch();

                        // notify
                        notification(
                          "Modification has been registered successfully, max lagging value automatically defined to " +
                            value +
                            " seconds.",
                          6000
                        );

                        setToken("tk_data_max_lag_allowed", value);
                        setToken("form.tk_input_lag_host", value);

                        // Audit success change
                        action = "success";
                        change_type = "apply auto defined monitoring lag";
                        object = tk_data_host;
                        object_category = "data_host";
                        object_attrs =
                          '{"data_max_lag_allowed": "' +
                          value +
                          '", "data_override_lagging_class": "' +
                          tk_data_override_lagging_class +
                          '"}';
                        result = "N/A";
                        comment = "N/A";
                        auditRecord(
                          action,
                          change_type,
                          object,
                          object_category,
                          object_attrs,
                          result,
                          comment
                        );
                      }
                    }
                  }
                }
              });

              // call update data source
              updateDataHost(tk_keyid);
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = errorStr;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();

              // Audit failure change
              action = "failure";
              change_type = "apply auto defined monitoring lag";
              object = tk_data_host;
              object_category = "data_host";
              object_attrs =
                "auto lagging determination search has failed or this operation was not allowed for this user";
              result = err;
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          }
        );
      }
    });
  });

  // Smart Status

  // Smart Status data source
  $("#btn_smart_status_data_source").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Free the search
    setToken("show_smart_status_data_source", "true");

    // get token
    var tk_data_name = tokens.get("tk_data_name");

    // Define the search button target
    var search_data_source_smart_status =
      "search" +
      "?q=search" +
      encodeURI(
        ' `trackme_idx` source="ds_smart_status"' +
          ' raw.data_name="' +
          tk_data_name +
          '" | rename raw.* as "*" | table _time smart_result'
      ) +
      "&earliest=-7d&latest=now";
    document.getElementById("btn_smart_status_data_source_history").href =
      search_data_source_smart_status;

    // Force search run every time the button is clicked
    searchSmartStatusDataSource.startSearch();

    // Show input modal
    $("#smart_status_data_source").modal();
  });

  // back
  $("#btn_smart_status_data_source_back").click(function () {
    // Show modal
    $("#modal_manage").modal();
  });

  // Smart Status data host
  $("#btn_smart_status_data_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Free the search
    setToken("show_smart_status_data_host", "true");

    // get token
    var tk_data_host = tokens.get("tk_data_host");

    // Force search run every time the button is clicked
    searchSmartStatusDataHost.startSearch();

    // Define the search button target
    var search_data_host_smart_status =
      "search" +
      "?q=search" +
      encodeURI(
        ' `trackme_idx` source="dh_smart_status"' +
          ' raw.data_host="' +
          tk_data_host +
          '" | rename raw.* as "*" | table _time smart_result'
      ) +
      "&earliest=-7d&latest=now";
    document.getElementById("btn_smart_status_data_host_history").href =
      search_data_host_smart_status;

    // Show input modal
    $("#smart_status_data_host").modal();
  });

  // back
  $("#btn_smart_status_data_host_back").click(function () {
    // Show modal
    $("#modal_manage_host").modal();
  });

  // Smart Status metric host
  $("#btn_smart_status_metric_host").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Free the search
    setToken("show_smart_status_metric_host", "true");

    // get token
    var tk_metric_host = tokens.get("tk_metric_host");

    // Force search run every time the button is clicked
    searchSmartStatusMetricHost.startSearch();

    // Define the search button target
    var search_metric_host_smart_status =
      "search" +
      "?q=search" +
      encodeURI(
        ' `trackme_idx` source="mh_smart_status"' +
          ' raw.metric_host="' +
          tk_metric_host +
          '" | rename raw.* as "*" | table _time smart_result'
      ) +
      "&earliest=-7d&latest=now";
    document.getElementById("btn_smart_status_metric_host_history").href =
      search_metric_host_smart_status;

    // Show input modal
    $("#smart_status_metric_host").modal();
  });

  // back
  $("#btn_smart_status_metric_host_back").click(function () {
    // Show modal
    $("#modal_manage_metric_host").modal();
  });

  // tags

  // tags policies main
  $(".btn_modify_tags_policies").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Disable the add button for now
      document.getElementById("btn_modal_tags_policies_add").disabled = true;
      // Free the search
      setToken("show_tags_policies", "true");

      // Show input modal
      $("#manage_tags_policies").modal();
    });
  });

  $("#btn_modal_tags_policies_simulate").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve the policy id
    var tk_tags_policies_policy_id = tokens.get("tk_tags_policies_policy_id");

    // Retrieve the regex rule
    var tk_tags_policies_regex = document.getElementById(
      "modal_input_tags_policies_regex"
    ).value;

    // Retrieve the tags list
    var tk_tags_policies_tags = document.getElementById(
      "modal_input_tags_policies_values"
    ).value;

    // if is not defined, give it a value and override text box content
    if (
      !tk_tags_policies_policy_id ||
      !tk_tags_policies_policy_id.length ||
      tk_tags_policies_regex ==
        "Enter a valid regular expression to match data source names." ||
      !tk_tags_policies_regex ||
      !tk_tags_policies_regex.length ||
      tk_tags_policies_tags ==
        'Enter a list of tags to applied separeted by commas to specify multiple tags and click on "Run policy simulation".' ||
      !tk_tags_policies_tags ||
      !tk_tags_policies_tags.length
    ) {
      // Show an error notification
      notification(
        "ERROR: Entries are either incorrect or incomplete, please correct and try again.",
        6000
      );

      // Disable the add button
      document.getElementById("btn_modal_tags_policies_add").disabled = true;
    } else {
      notification("INFO: Starting tags policy simulation...", 6000);

      // Set the tokens
      setToken("tk_tags_policies_regex", tk_tags_policies_regex);
      setToken("tk_tags_policies_tags", tk_tags_policies_tags);

      // Unset the token and set to free the search
      unsetToken("start_simulation_tags_policies");
      setToken("start_simulation_tags_policies", "true");

      // Disable the add button
      document.getElementById("btn_modal_tags_policies_add").disabled = false;
    }
  });

  // add policy
  $("#btn_tags_policies_create").click(function () {
    // Show input modal
    $("#tags_policies_create_policy").modal();
  });

  // back button
  $("#btn_modal_tags_policies_add_back").click(function () {
    // Show input modal
    $("#manage_tags_policies").modal();
  });

  // add button
  $("#btn_modal_tags_policies_add").click(function () {
    // Show input modal
    $("#tags_policies_create_policy_confirm").modal();
  });

  // add policy
  $("#btn_modal_add_tags_policy_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve the policy id
    var tk_tags_policies_policy_id = tokens.get("tk_tags_policies_policy_id");

    // Retrieve the regex rule
    var tk_tags_policies_regex = document.getElementById(
      "modal_input_tags_policies_regex"
    ).value;

    // Retrieve the tags list
    var tk_tags_policies_tags = document.getElementById(
      "modal_input_tags_policies_values"
    ).value;

    // if is not defined, give it a value and override text box content - We should never reach this for the add function
    if (
      !tk_tags_policies_policy_id ||
      !tk_tags_policies_policy_id.length ||
      tk_tags_policies_regex ==
        "Enter a valid regular expression to match data source names." ||
      !tk_tags_policies_regex ||
      !tk_tags_policies_regex.length ||
      tk_tags_policies_tags ==
        'Enter a list of tags to applied separeted by commas to specify multiple tags and click on "Run policy simulation".' ||
      !tk_tags_policies_tags ||
      !tk_tags_policies_tags.length
    ) {
      // Show an error notification
      notification(
        "ERROR: Entries are either incorrect or incomplete, please correct and try again.",
        6000
      );

      // Disable the add button
      document.getElementById("btn_modal_tags_policies_add").disabled = true;
    } else {
      // Retrieve update comment if any
      var tk_comment = document.getElementById(
        "input_add_tags_policy_sampling_comment"
      ).value;

      // if is not defined, give it a value and override text box content
      if (tk_comment == "null") {
        setToken(
          "tk_update_comment",
          TokenUtils.replaceTokenNames(
            "No comments for update.",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textarea for modification requests
        document.getElementById(
          "input_add_tags_policy_sampling_comment"
        ).value = "update note";
      } else if (tk_comment == "update note") {
        tk_comment = "No comment for update.";
        document.getElementById(
          "input_add_tags_policy_sampling_comment"
        ).value = "update note";
      } else {
        // replace the textarea for modification requests
        document.getElementById(
          "input_add_tags_policy_sampling_comment"
        ).value = "update note";
      }

      // Define the query
      var searchQuery =
        '| makeresults | eval tags_policy_id="' +
        tk_tags_policies_policy_id +
        '", tags_policy_value="' +
        tk_tags_policies_tags +
        '", tags_policy_regex="' +
        tk_tags_policies_regex +
        '" | eval mtime=now() | outputlookup append=t trackme_tags_policies';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-60m",
        latest_time: "now",
      };

      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add tags policy";
          object = tk_tags_policies_policy_id;
          object_category = "data_source";
          object_attrs =
            "{\n" +
            '\t"tags_policy_id": "' +
            tk_tags_policies_policy_id +
            '",\n\t"tags_policy_value": "' +
            tk_tags_policies_tags +
            '",\n\t"tags_policy_regex": "' +
            tk_tags_policies_regex +
            '"\n}';
          result = "N/A";
          comment = tk_comment;
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Refresh the search
                setToken("show_tags_policies", "true");
                searchShowTagsPolicies.startSearch();

                // Return to modal
                $("#manage_tags_policies").modal();

                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add tags policy";
                object = tk_tags_policies_policy_id;
                object_category = "data_source";
                object_attrs =
                  "{\n" +
                  '\t"tags_policy_id": "' +
                  tk_tags_policies_policy_id +
                  '",\n\t"tags_policy_value": "' +
                  tk_tags_policies_tags +
                  '",\n\t"tags_policy_regex": "' +
                  tk_tags_policies_regex +
                  '"\n}';
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });
    }
  });

  // delete tags policies
  $("#btn_modal_tags_policies_delete").click(function () {
    // Show input modal
    $("#tags_policies_delete_policy_confirm").modal();
  });

  function foreachRemoveTagsPolicies(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_tags_policies/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var tags_policy_value = returneddata.tags_policy_value;
          var tags_policy_regex = returneddata.tags_policy_regex;
          var tags_policy_id = returneddata.tags_policy_id;
          var mtime = returneddata.mtime;
          var record = {
            tags_policy_value: tags_policy_value,
            tags_policy_regex: tags_policy_regex,
            tags_policy_id: tags_policy_id,
            mtime: mtime,
            _key: item,
          };

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "input_delete_tags_policy_sampling_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete tags policies";
              object = tags_policy_id;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#manage_tags_policies").modal();

              // Refresh the search
              searchShowTagsPolicies.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete tags policies";
              object = tags_policy_id;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  // delete tags policies confirm
  $("#btn_modal_delete_tags_policy_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeTagsPolicy");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachRemoveTagsPolicies);

    // Hide main modal
    $("#tags_policies_delete_policy_confirm").modal("hide");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeTagsPolicy");
  });

  // tags

  // back button
  $("#btn_back_manage_tags").click(function () {
    // Show input modal
    $("#modal_manage").modal();
  });

  // back button
  $("#btn_back_manage_tags").click(function () {
    // Show input modal
    $("#modal_manage").modal();
  });

  // back button
  $("#btn_back_update_tags").click(function () {
    // Show input modal
    $("#manage_tags").modal();
  });

  // update button
  $("#btn_modify_manage_tags").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Refresh the multiselect
    unsetToken("form.modal_input_tags_update");
    unsetToken("modal_input_tags_update");

    // Refresh the main search
    searchShowTags.startSearch();

    // Show input modal
    $("#update_tags").modal();
  });

  // add button
  $("#btn_modal_tags_add").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve input values
    var tk_tags_new = tokens.get("modal_input_tags_new");
    var tk_tags = tokens.get("tk_tags");
    var tk_tags_csv;

    // Combine current and new tag if relevant
    if (
      tk_tags !==
      "No tags defined, click on Update tags to define one or more tags to be associated with this data source."
    ) {
      // form a csv tags list
      tk_tags_csv = tk_tags.replace(/ \/ /g, ",");
      tk_tags_new = tk_tags_csv + "," + tk_tags_new;
    }

    // Get tk mains
    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring where _key="' +
      tk_keyid +
      '" | eval keyid=_key, tags="' +
      tk_tags_new +
      '" | outputlookup trackme_data_source_monitoring append=t key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    // Run a blocking search and get back a job
    service.search(searchQuery, searchParams, function (err, job) {
      function audit_failure() {
        // Audit
        action = "failure";
        change_type = "add tags";
        object = tk_data_name;
        object_category = "data_source";
        object_attrs = tk_tags_new;
        result = "N/A";
        comment = "N/A";
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );
      }

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        audit_failure();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // show notify
              notification("New tag successfully added.", 6000);

              // Update the tags token
              tk_tags_audit = tk_tags_new;
              tk_tags_new = tk_tags_new.replace(/,/g, " / ");
              setToken("tk_tags", tk_tags_new);

              // Refresh the multiselect
              unsetToken("form.modal_input_tags_update");
              unsetToken("modal_input_tags_update");

              // Refresh the main search
              searchShowTags.startSearch();
              searchDataSourcesMain.startSearch();

              var deps = ["splunkjs/ready!"];
              require(deps, function (mvc) {
                var idSelectTags = mvc.Components.get(
                  "modal_input_tags_update"
                );
                allValues = [];
                uniqueNames = [];

                var idSearchSelectTags = mvc.Components.get("searchShowTags");
                var idSearchSelectTags_results =
                  idSearchSelectTags.data("preview");
                idSearchSelectTags_results.on("data", function () {
                  $.each(
                    idSearchSelectTags_results.data().rows,
                    function (index, value) {
                      allValues.push(value[0]);
                    }
                  );
                  $.each(allValues, function (i, el) {
                    if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                  });
                  idSelectTags.settings.set("default", uniqueNames);
                });
              });

              // Make sure the link exposes Show tags
              setToken("tk_tags_link_main", "Show tags");

              // Audit
              action = "success";
              change_type = "add tags";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs = tk_tags_audit;
              result = "N/A";
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              audit_failure();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              audit_failure();
              $("#modal_update_collection_failure_flush").modal();
            },
          }
        );
      }
    });
  });

  // modify button
  $("#btn_modal_tags_save").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve input values

    var tk_tags_list = tokens.get("modal_input_tags_update");

    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring where _key="' +
      tk_keyid +
      '" | eval keyid=_key, tags="' +
      tk_tags_list +
      '" | outputlookup trackme_data_source_monitoring append=t key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    // Run a blocking search and get back a job
    service.search(searchQuery, searchParams, function (err, job) {
      function audit_failure() {
        // Audit
        action = "failure";
        change_type = "update tags";
        object = tk_data_name;
        object_category = "data_source";
        object_attrs = tk_tags_list;
        result = "N/A";
        comment = "N/A";
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );
      }

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        audit_failure();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // show notify
              notification("Tags list updated.", 6000);

              // Audit
              action = "success";
              change_type = "update tags";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs = tk_tags_list;
              result = "N/A";
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // Update the tags token
              tk_tags_list = tk_tags_list.replace(/,/g, " / ");
              setToken("tk_tags", tk_tags_list);

              // Refresh the main search
              searchShowTags.startSearch();
              searchDataSourcesMain.startSearch();

              var deps = ["splunkjs/ready!"];
              require(deps, function (mvc) {
                var idSelectTags = mvc.Components.get(
                  "modal_input_tags_update"
                );
                allValues = [];
                uniqueNames = [];

                var idSearchSelectTags = mvc.Components.get("searchShowTags");
                var idSearchSelectTags_results =
                  idSearchSelectTags.data("preview");
                idSearchSelectTags_results.on("data", function () {
                  $.each(
                    idSearchSelectTags_results.data().rows,
                    function (index, value) {
                      allValues.push(value[0]);
                    }
                  );
                  $.each(allValues, function (i, el) {
                    if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                  });
                  idSelectTags.settings.set("default", uniqueNames);
                });
              });

              // Make sure the link exposes Show tags
              setToken("tk_tags_link_main", "Show tags");
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              audit_failure();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              audit_failure();
              $("#modal_update_collection_failure_flush").modal();
            },
          }
        );
      }
    });
  });

  // clear button
  $("#btn_modal_tags_clear").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve input values

    var tk_tags_list = tokens.get("modal_input_tags_update");

    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_source_monitoring where _key="' +
      tk_keyid +
      '" | eval keyid=_key | fields - tags | outputlookup trackme_data_source_monitoring append=t key_field=keyid';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    // Run a blocking search and get back a job
    service.search(searchQuery, searchParams, function (err, job) {
      function audit_failure() {
        // Audit
        action = "failure";
        change_type = "clear tags";
        object = tk_data_name;
        object_category = "data_source";
        object_attrs = tk_tags_list;
        result = "N/A";
        comment = "N/A";
        auditRecord(
          action,
          change_type,
          object,
          object_category,
          object_attrs,
          result,
          comment
        );
      }

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        audit_failure();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // show notify
              notification("Tags list was cleared successfully.", 6000);

              // Update the tags token
              setToken(
                "tk_tags",
                "No tags defined, click on Update tags to define one or more tags to be associated with this data source."
              );

              // Refresh the multiselect
              unsetToken("form.modal_input_tags_update");
              unsetToken("modal_input_tags_update");
              unsetToken("form.modal_input_tags_new");

              // Refresh the main search
              searchShowTags.startSearch();
              searchDataSourcesMain.startSearch();

              // Make sure the link exposes "Click here to define tags"
              setToken("tk_tags_link_main", "Click here to define tags");

              // Audit
              action = "success";
              change_type = "clear tags";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs = tk_tags_list;
              result = "N/A";
              comment = "N/A";
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              audit_failure();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              audit_failure();
              $("#modal_update_collection_failure_flush").modal();
            },
          }
        );
      }
    });
  });

  // data source identity documentation

  // back button
  $("#btn_back_manage_identity_card").click(function () {
    // Show input modal
    $("#modal_manage").modal();
  });

  $("#btn_close_define_identity_card").click(function () {
    // Show input modal
    $("#modal_manage").modal();
  });

  // update button
  $("#btn_modify_manage_identity_card").click(function () {
    // Show input modal
    $("#define_identity_card").modal();
  });

  // delete button
  $("#btn_delete_manage_identity_card").click(function () {
    // Show deletion modal
    $("#delete_identity_card").modal();
  });

  // identity card

  $(".btn_define_identity_card").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Retrieve input values

      var input_doc_object = tokens.get("tk_data_name");
      var input_doc_note = document.getElementById("input_doc_note").value;

      // replace chars that would lead the operation to fail
      var input_doc_note = input_doc_note.replace(/\"/g, '\\"');
      var input_doc_link = document.getElementById("input_doc_link").value;

      // Define the query
      var searchQuery =
        '| trackme url="/services/trackme/v1/identity_cards/identity_cards_add_card" mode="post" body="{\\"doc_link\\": \\"' +
        input_doc_link +
        '\\", \\"doc_note\\": \\"' +
        input_doc_note +
        '\\", \\"update_comment\\": \\"N/A\\"}" | spath | table key';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-60m",
        latest_time: "now",
      };

      if (
        input_doc_link === "link to documentation" &&
        input_doc_note === "documentation note"
      ) {
        $("#modal_entry_update_invalid").modal();
        return;
      } else if (input_doc_link && input_doc_link.length) {
        // Create or update the card using the API endpoint
        service.search(searchQuery, searchParams, function (err, job) {
          function audit_failure() {
            // Audit
            action = "failure";
            change_type = "create or update identity card";
            object = input_doc_object;
            object_category = "data_source";
            object_attrs =
              "object:" +
              input_doc_object +
              ", doc_link:" +
              input_doc_link +
              ", doc_note:" +
              input_doc_note;
            result = "N/A";
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );
          }

          // Shall the search fail before we can get properties
          if (job == null) {
            let errorStr = "Unknown Error!";
            if (
              err &&
              err.data &&
              err.data.messages &&
              err.data.messages[0]["text"]
            ) {
              errorStr = err.data.messages[0]["text"];
            } else if (err && err.data && err.data.messages) {
              errorStr = JSON.stringify(err.data.messages);
            }
            audit_failure();
            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(errorStr);
            $("#modal_update_collection_failure_return").modal();
          } else {
            // Poll the status of the search job
            job.track(
              {
                period: 200,
              },
              {
                done: function (job) {
                  // Get the results and display them
                  job.results({}, function (err, results) {
                    var fields = results.fields;
                    var rows = results.rows;
                    var cardkey;

                    for (var i = 0; i < rows.length; i++) {
                      var values = rows[i];
                      for (var j = 0; j < values.length; j++) {
                        var field = fields[j];
                        var value = values[j];
                        var cardkey;
                        if (field == "key") {
                          var cardkey = value;
                        }
                      }
                    }

                    // Associate the card using the API endpoint
                    var searchQuery =
                      '| trackme url="/services/trackme/v1/identity_cards/identity_cards_associate_card" mode="post" body="{\\"key\\": \\"' +
                      cardkey +
                      '\\", \\"object\\": \\"' +
                      input_doc_object +
                      '\\", \\"update_comment\\": \\"N/A\\"}"';

                    service.oneshotSearch(
                      searchQuery,
                      searchParams,
                      function (err, results) {}
                    );
                  });

                  // Run the search again to update the table
                  searchDataSourcesMain.startSearch();
                  $("#update_achieved_identity_card").modal();

                  // Audit
                  action = "success";
                  change_type = "create or update identity card";
                  object = input_doc_object;
                  object_category = "data_source";
                  object_attrs =
                    "object:" +
                    input_doc_object +
                    ", doc_link:" +
                    input_doc_link +
                    ", doc_note:" +
                    input_doc_note;
                  result = "N/A";
                  comment = "N/A";
                  auditRecord(
                    action,
                    change_type,
                    object,
                    object_category,
                    object_attrs,
                    result,
                    comment
                  );
                },
                failed: function (properties) {
                  let errorStr = "Unknown Error!";
                  if (
                    properties &&
                    properties._properties &&
                    properties._properties.messages &&
                    properties._properties.messages[0]["text"]
                  ) {
                    errorStr = properties._properties.messages[0]["text"];
                  } else if (
                    properties &&
                    properties._properties &&
                    properties._properties.messages
                  ) {
                    errorStr = JSON.stringify(properties._properties.messages);
                  }
                  audit_failure();
                  $("#modal_update_collection_failure_return")
                    .find(".modal-error-message p")
                    .text(errorStr);
                  $("#modal_update_collection_failure_return").modal();
                },
                error: function (err) {
                  done(err);
                  audit_failure();
                  $("#modal_update_collection_failure_flush").modal();
                },
              }
            );
          }
        });

        // house cleaning
        myendpoint_URl = undefined;
        delete myendpoint_URl;
        return;
      } else {
        $("#modal_entry_update_invalid").modal();
        return;
      }
    });
  });

  // back
  $("#btn_define_identity_card_back").click(function () {
    // Show modal
    $("#modal_manage").modal();
  });

  // delete button
  $("#btn_delete_identity_card_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve input values

    var input_doc_object = tokens.get("tk_data_name");
    var input_doc_note = document.getElementById("input_doc_note").value;
    var input_doc_link = document.getElementById("input_doc_link").value;

    // Define the query
    var searchQuery =
      '| trackme url="/services/trackme/v1/identity_cards/identity_cards_unassociate" mode="post" body="{\\"object\\": \\"' +
      input_doc_object +
      '\\", \\"update_comment\\": \\"N/A\\"}"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (input_doc_link && input_doc_link.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "delete identity card";
          object = input_doc_object;
          object_category = "data_source";
          object_attrs =
            "object:" +
            input_doc_object +
            ", doc_link:" +
            input_doc_link +
            ", doc_note:" +
            input_doc_note;
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Run the search again to update the table
                searchDataSourcesMain.startSearch();
                // show deleted modal
                $("#delete_achieved_identity_card").modal();

                // Audit
                action = "success";
                change_type = "delete identity card";
                object = input_doc_object;
                object_category = "data_source";
                object_attrs =
                  "object:" +
                  input_doc_object +
                  ", doc_link:" +
                  input_doc_link +
                  ", doc_note:" +
                  input_doc_note;
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // back button
  $("#btn_delete_identity_card_back").click(function () {
    // Show modal
    $("#define_identity_card").modal();
  });

  // associate identity card button

  $(".btn_associate_identity_card").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      // create token that will free the search for table populate
      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // if the token exists already, restart the search, otherwise allow the search to start
      var tk_start_associate_identity_card = tokens.get(
        "tk_start_associate_identity_card"
      );

      if (
        tk_start_associate_identity_card &&
        tk_start_associate_identity_card.length
      ) {
        searchIdentityCardTable.startSearch();
      } else {
        setToken("tk_start_associate_identity_card", "true");
      }

      // Show modal
      $("#associate_identity_card").modal();
    });
  });

  // confirm button
  $("#btn_associate_identity_card_confirm_valid").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve input values

    var input_doc_keyid = tokens.get("tk_keyid");
    var input_doc_new_object = tokens.get("tk_data_name");
    var input_doc_origin_object = tokens.get("tk_object");
    var input_doc_link = tokens.get("tk_doc_link");
    var input_doc_note = tokens.get("tk_doc_note");
    var tk_doc_identity_card_is_global = tokens.get(
      "doc_identity_card_is_global"
    );

    // First unassociate using the API endpoint
    var searchQuery =
      '| trackme url="/services/trackme/v1/identity_cards/identity_cards_unassociate" mode="post" body="{\\"object\\": \\"' +
      input_doc_new_object +
      '\\", \\"update_comment\\": \\"N/A\\"}"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-60m",
      latest_time: "now",
    };

    if (input_doc_keyid && input_doc_keyid.length) {
      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "associate identity card";
          object = input_doc_new_object;
          object_category = "data_source";
          object_attrs =
            "object:" +
            input_doc_new_object +
            " was associated with identity card keyid: " +
            input_doc_keyid +
            ", doc_link:" +
            input_doc_link +
            ", doc_note:" +
            input_doc_note;
          result = "N/A";
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Associate using the endpoint
                var searchQuery =
                  '| trackme url="/services/trackme/v1/identity_cards/identity_cards_associate_card" mode="post" body="{\\"key\\": \\"' +
                  input_doc_keyid +
                  '\\", \\"object\\": \\"' +
                  input_doc_new_object +
                  '\\", \\"update_comment\\": \\"N/A\\"}"';

                service.oneshotSearch(
                  searchQuery,
                  searchParams,
                  function (err, results) {}
                );

                // Run the search again to update the table
                searchDataSourcesMain.startSearch();
                // show deleted modal
                $("#associate_achieved_identity_card").modal();

                // Audit
                action = "success";
                change_type = "associate identity card";
                object = input_doc_new_object;
                object_category = "data_source";
                object_attrs =
                  "object:" +
                  input_doc_new_object +
                  " was associated with identity card keyid: " +
                  input_doc_keyid +
                  ", doc_link:" +
                  input_doc_link +
                  ", doc_note:" +
                  input_doc_note;
                result = "N/A";
                comment = "N/A";
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // back button
  $("#btn_associate_identity_card_back").click(function () {
    // Show modal
    $("#define_identity_card").modal();
  });

  // back button
  $("#btn_associate_identity_card_confirm_back").click(function () {
    // Show modal
    $("#associate_identity_card").modal();
  });

  // Acknowledgment

  $(".btn_ack").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      // create token that will free the search for table populate
      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      var tk_data_name = tokens.get("tk_data_name");
      var tk_data_host = tokens.get("tk_data_host");
      var tk_metric_host = tokens.get("tk_metric_host");

      if (tk_data_name !== undefined) {
        setToken("input_object", tk_data_name);
        setToken("input_object_category", "data_source");
      } else if (tk_data_host !== undefined) {
        setToken("input_object", tk_data_host);
        setToken("input_object_category", "data_host");
      } else if (tk_metric_host !== undefined) {
        setToken("input_object", tk_metric_host);
        setToken("input_object_category", "metric_host");
      }

      var input_object = tokens.get("input_object");
      var input_object_category = tokens.get("input_object_category");

      // if the token exists already, restart the search, otherwise allow the search to start
      var tk_start_ack_get = tokens.get("tk_start_ack_get");

      if (tk_start_ack_get && tk_start_ack_get.length) {
        searchAckGet.startSearch();
      } else {
        setToken("tk_start_ack_get", "true");
      }

      // Show modal
      $("#confirm_ack").modal();
    });
  });

  // Add ack

  $(".btn_ack_confirm_valid").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Retrieve input values
      var input_object = tokens.get("input_object");
      var input_object_category = tokens.get("input_object_category");
      var input_ack_duration = tokens.get("input_ack_duration");

      // Retrieve update comment if any
      var tk_comment = document.getElementById("input_ack_comment").value;

      // if is not defined, give it a value and override text box content
      if (tk_comment == "null") {
        setToken(
          "tk_update_comment",
          TokenUtils.replaceTokenNames(
            "No comments for update.",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textarea for modification requests
        document.getElementById("input_ack_comment").value = "update note";
      } else if (tk_comment == "update note") {
        tk_comment = "No comment for update.";
        document.getElementById("input_ack_comment").value = "update note";
      } else {
        // replace the textarea for modification requests
        document.getElementById("input_ack_comment").value = "update note";
      }

      if (
        input_object &&
        input_object.length &&
        input_ack_duration &&
        input_ack_duration.length
      ) {
        // Create the endpoint URL
        var myendpoint_URl =
          "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/ack/ack_enable";

        // Create a dictionary to store the field names and values
        var record = {
          object_category: input_object_category,
          object: input_object,
          ack_period: input_ack_duration,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Refresh the main search
            if (input_object_category == "data_source") {
              searchDataSourcesMain.startSearch();
            } else if (input_object_category == "data_host") {
              searchDataHostsMain.startSearch();
            } else if (input_object_category == "metric_host") {
              searchMetricHostsMain.startSearch();
            }

            // show deleted modal
            $("#ack_achieved").modal();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "ack enable";
            object = input_object;
            object_category = input_object_category;
            object_attrs =
              "object:" +
              input_object +
              " has been acknowledged for a period of " +
              input_ack_duration +
              " seconds, no more alerts will be generated until the acknowledge is expired.";
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });

        // house cleaning
        myendpoint_URl = undefined;
        delete myendpoint_URl;
        return;
      } else {
        $("#modal_entry_update_invalid").modal();
        return;
      }
    });
  });

  // Disable ack

  $(".btn_ack_disable_valid").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Retrieve input values
      var keyid = tokens.get("keyid");
      var input_object = tokens.get("input_object");
      var input_object_category = tokens.get("input_object_category");
      var ack_expiration = tokens.get("ack_expiration");
      var ack_state = tokens.get("ack_state");

      // Retrieve update comment if any
      var tk_comment = document.getElementById("input_ack_comment").value;

      // if is not defined, give it a value and override text box content
      if (tk_comment == "null") {
        setToken(
          "tk_update_comment",
          TokenUtils.replaceTokenNames(
            "No comments for update.",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textarea for modification requests
        document.getElementById("input_ack_comment").value = "update note";
      } else if (tk_comment == "update note") {
        tk_comment = "No comment for update.";
        document.getElementById("input_ack_comment").value = "update note";
      } else {
        // replace the textarea for modification requests
        document.getElementById("input_ack_comment").value = "update note";
      }

      if (ack_state === "inactive") {
        // show modal
        $("#ack_disable_already").modal();
      } else if (input_object && input_object.length) {
        // Create the endpoint URL
        var myendpoint_URl =
          "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/ack/ack_disable";

        // Create a dictionary to store the field names and values
        var record = {
          object_category: input_object_category,
          object: input_object,
          update_comment: tk_comment,
        };

        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // Refresh the main search
            if (input_object_category == "data_source") {
              searchDataSourcesMain.startSearch();
            } else if (input_object_category == "data_host") {
              searchDataHostsMain.startSearch();
            } else if (input_object_category == "metric_host") {
              searchMetricHostsMain.startSearch();
            }

            // show deleted modal
            $("#ack_achieved").modal();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "ack disable";
            object = input_object;
            object_category = input_object_category;
            object_attrs =
              "object:" +
              input_object +
              " acknowledge has been disabled (ack_expiration was: " +
              ack_expiration +
              "), alerts will be generated depending on state and rules. ";
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });

        // house cleaning
        myendpoint_URl = undefined;
        delete myendpoint_URl;
        return;
      } else {
        $("#modal_entry_update_invalid").modal();
        return;
      }
    });
  });

  // Logical group

  // show modal
  $(".btn_logical_group").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      // create token that will free the search for table populate
      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // if the token exists already, restart the search, otherwise allow the search to start
      var tk_start_logical_member_get = tokens.get(
        "tk_start_logical_member_get"
      );

      if (tk_start_logical_member_get && tk_start_logical_member_get.length) {
        searchLogicalGroupTable.startSearch();
      } else {
        setToken("tk_start_logical_member_get", "true");
      }

      var tk_data_name = tokens.get("tk_data_name");
      var tk_data_host = tokens.get("tk_data_host");
      var tk_metric_host = tokens.get("tk_metric_host");

      if (tk_data_name !== undefined) {
        setToken("input_object", tk_data_name);
        setToken("input_object_category", "data_source");
      } else if (tk_data_host !== undefined) {
        setToken("input_object", tk_data_host);
        setToken("input_object_category", "data_host");
      } else if (tk_metric_host !== undefined) {
        setToken("input_object", tk_metric_host);
        setToken("input_object_category", "metric_host");
      }

      // show modal
      $("#logical_group").modal();
    });
  });

  // back
  $("#btn_associate_logical_group_back").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // retrieve token
    var input_object_category = tokens.get("input_object_category");

    // conditional modal target
    if (input_object_category === "data_source") {
      $("#modal_modify_data_source_unified").modal();
    } else if (input_object_category === "data_host") {
      $("#modal_modify_data_host_unified").modal();
    } else if (input_object_category === "metric_host") {
      $("#modal_modify_metric_host_unified").modal();
    }
  });

  // back delete
  $("#confirm_remove_from_logical_group").click(function () {
    $("#logical_group").modal();
  });

  //
  $(".btn_logical_group_valid").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      // create token that will free the search for table populate
      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      var tk_data_name = tokens.get("tk_data_name");
      var tk_data_host = tokens.get("tk_data_host");
      var tk_metric_host = tokens.get("tk_metric_host");

      if (tk_data_name !== undefined) {
        setToken("input_object", tk_data_name);
        setToken("input_object_category", "data_source");
      } else if (tk_data_host !== undefined) {
        setToken("input_object", tk_data_host);
        setToken("input_object_category", "data_host");
      } else if (tk_metric_host !== undefined) {
        setToken("input_object", tk_metric_host);
        setToken("input_object_category", "metric_host");
      }
    });
  });

  // Remove from logical group
  $("#btn_remove_from_logical_group_confirm_valid").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var input_object = tokens.get("input_object");
    var input_object_category = tokens.get("input_object_category");
    var tk_keyid = tokens.get("tk_keyid");

    if (input_object && input_object.length) {
      // Create the endpoint URL
      var myendpoint_URl =
        "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/logical_groups/logical_groups_unassociate";

      // Create a dictionary to store the field names and values
      var record = {
        object: input_object,
        key: tk_keyid,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // show disabled modal
          $("#logical_group_removal_achieved").modal();

          if (input_object_category === "data_source") {
            searchDataSourcesMain.startSearch();
          } else if (input_object_category === "data_host") {
            searchDataHostsMain.startSearch();
          } else if (input_object_category === "metric_host") {
            searchMetricHostsMain.startSearch();
          }
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "Logical group removal";
          object = input_object;
          object_category = input_object_category;
          object_attrs =
            "object:" + input_object + " has been removed from Logical group. ";
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // Add logical group member
  $("#btn_add_logical_group_member").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // if the token exists already, restart the search, otherwise allow the search to start
    var tk_start_logical_member_add = tokens.get("tk_start_logical_member_add");

    if (tk_start_logical_member_add && tk_start_logical_member_add.length) {
      searchLogicalGroupTableAddMember.startSearch();
    } else {
      setToken("tk_start_logical_member_add", "true");
    }

    $("#logical_group_add_member").modal();
  });

  // Add logical group member
  $("#btn_add_logical_group_member_confirm_valid").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var input_object = tokens.get("input_object");
    var input_object_category = tokens.get("input_object_category");

    // keyid is used to add to group
    var tk_keyid = tokens.get("tk_keyid");

    // from click
    var tk_object_group_name = tokens.get("tk_object_group_name");

    if (input_object && input_object.length) {
      // Create the endpoint URL
      var myendpoint_URl =
        "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/logical_groups/logical_groups_associate_group";

      // Create a dictionary to store the field names and values
      var record = {
        object: input_object,
        key: tk_keyid,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // show disabled modal
          $("#logical_group_add_member_achieved").modal();

          if (input_object_category === "data_source") {
            searchDataSourcesMain.startSearch();
          } else if (input_object_category === "data_host") {
            searchDataHostsMain.startSearch();
          } else if (input_object_category === "metric_host") {
            searchMetricHostsMain.startSearch();
          }
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "Logical group add membership";
          object = input_object;
          object_category = input_object_category;
          object_attrs =
            "object:" +
            input_object +
            " has been added to the logical group " +
            tk_object_group_name +
            ".";
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // Add logical group member
  $("#btn_add_logical_group_new").click(function () {
    $("#logical_group_add_group").modal();
  });

  // back
  $("#btn_associate_logical_group_add_member_back").click(function () {
    $("#logical_group").modal();
  });

  // back
  $("#btn_associate_logical_group_add_group_back").click(function () {
    $("#logical_group").modal();
  });

  // back
  $("#btn_add_logical_group_member_confirm_back").click(function () {
    $("#logical_group").modal();
  });

  // Add logical group
  $("#btn_associate_logical_group_add_group").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var input_object = tokens.get("input_object");
    var input_object_category = tokens.get("input_object_category");

    // from input
    var tk_object_group_name = tokens.get("InputLogicalGroupName");
    var tk_object_group_green_percent = tokens.get(
      "InputLogicalGroupNamePercent"
    );

    if (tk_object_group_name && tk_object_group_name.length) {
      // Create the endpoint URL
      var myendpoint_URl =
        "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/logical_groups/logical_groups_add_grp";

      // Create a dictionary to store the field names and values
      var record = {
        object_group_name: tk_object_group_name,
        object_group_members: input_object,
        object_group_min_green_percent: tk_object_group_green_percent,
        update_comment: "N/A",
      };

      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // show disabled modal
          $("#logical_group_add_achieved").modal();

          if (input_object_category === "data_source") {
            searchDataSourcesMain.startSearch();
          } else if (input_object_category === "data_host") {
            searchDataHostsMain.startSearch();
          } else if (input_object_category === "metric_host") {
            searchMetricHostsMain.startSearch();
          }
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "Logical group add";
          object = tk_object_group_name;
          object_category = input_object_category;
          object_attrs =
            "new logical group " +
            tk_object_group_name +
            " has been created for object:" +
            input_object +
            " with a minimal logical group green percentage of " +
            tk_object_group_green_percent +
            ".";
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });

      // house cleaning
      myendpoint_URl = undefined;
      delete myendpoint_URl;
      return;
    } else {
      $("#modal_entry_update_invalid").modal();
      return;
    }
  });

  // object tags

  // return to unified modify when clicking on back
  $("#btn_back_data_host_tags").click(function () {
    $("#modal_manage_host").modal();
  });

  // return to unified modify when clicking on back
  $("#btn_back_metric_host_tags").click(function () {
    $("#modal_manage_metric_host").modal();
  });

  // Outliers simulation

  // data source run simulation
  $("#btn_outlier_config_data_source_simulate").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // get the object name
    var tk_data_name = tokens.get("tk_data_name");

    // set the token the search depends on
    setToken("start_outliers_simulation_data_source", "true");

    // explicitly start the search
    searchOutlierDetectionChartSimulation.startSearch();

    // notify
    notification(
      "Outliers simulation started for data source " + tk_data_name + ".",
      6000
    );
  });

  $("#btn_outlier_config_data_source_save")
    .unbind("click")
    .click(function () {
      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      var tk_keyid = tokens.get("tk_keyid");
      var tk_data_name = tokens.get("tk_data_name");
      var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
      var tk_outlierlowerthresholdmultiplier = tokens.get(
        "tk_outlierlowerthresholdmultiplier"
      );
      var tk_outlierupperthresholdmultiplier = tokens.get(
        "tk_outlierupperthresholdmultiplier"
      );
      var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
      var tk_outlier_period = tokens.get("tk_outlier_period");
      var tk_outlier_span = tokens.get("tk_outlier_span");
      var tk_enable_behaviour_analytic = tokens.get(
        "tk_enable_behaviour_analytic"
      );

      // get inputs tokens

      var tk_input_data_source_enable_outlier = tokens.get(
        "tk_input_data_source_enable_outlier"
      );
      var tk_input_data_source_outlier_min_eventcount_mode = tokens.get(
        "tk_input_data_source_outlier_min_eventcount_mode"
      );
      var tk_input_data_source_outlier_alert_on_upper = tokens.get(
        "tk_input_data_source_outlier_alert_on_upper"
      );
      var tk_input_data_source_outlier_min_eventcount = tokens.get(
        "tk_input_data_source_outlier_min_eventcount"
      );
      var tk_input_data_source_outlier_lower_threshold_multiplier = tokens.get(
        "tk_input_data_source_outlier_lower_threshold_multiplier"
      );
      var tk_input_data_source_outlier_upper_threshold_multiplier = tokens.get(
        "tk_input_data_source_outlier_upper_threshold_multiplier"
      );
      var tk_input_data_source_outlier_span = tokens.get(
        "tk_input_data_source_outlier_span"
      );

      // OutlierTimePeriod equals to the earliest LinkInput
      var tk_input_data_source_outlier_period = tokens.get(
        "tk_input_data_source_outlier_period"
      );

      // Conditionally define record values for Outliers
      if (tk_enable_behaviour_analytic != tk_input_data_source_enable_outlier) {
        tk_enable_behaviour_analytic = tk_input_data_source_enable_outlier;
      }

      if (
        tk_outlieralertonupper != tk_input_data_source_outlier_alert_on_upper
      ) {
        tk_outlieralertonupper = tk_input_data_source_outlier_alert_on_upper;
      }

      tk_source_outlier_period = tk_outlier_period;
      if (tk_outlier_period != tk_input_data_source_outlier_period) {
        tk_outlier_period = tk_input_data_source_outlier_period;
      }

      if (tk_outlier_span != tk_input_data_source_outlier_span) {
        tk_outlier_span = tk_input_data_source_outlier_span;
        // refresh the token for current view usage
        setToken("tk_outlier_span", tk_input_data_source_outlier_span);
      }

      if (
        tk_outlierlowerthresholdmultiplier !=
          tk_input_data_source_outlier_lower_threshold_multiplier &&
        isNumeric(tk_input_data_source_outlier_lower_threshold_multiplier)
      ) {
        tk_outlierlowerthresholdmultiplier =
          tk_input_data_source_outlier_lower_threshold_multiplier;
      }

      if (
        tk_outlierupperthresholdmultiplier !=
          tk_input_data_source_outlier_upper_threshold_multiplier &&
        isNumeric(tk_input_data_source_outlier_upper_threshold_multiplier)
      ) {
        tk_outlierupperthresholdmultiplier =
          tk_input_data_source_outlier_upper_threshold_multiplier;
      }

      if (
        tk_input_data_source_outlier_min_eventcount_mode === "static" &&
        isNumeric(tk_input_data_source_outlier_min_eventcount) &&
        tk_input_data_source_outlier_min_eventcount > 0
      ) {
        tk_outliermineventcount = tk_input_data_source_outlier_min_eventcount;
      } else {
        tk_outliermineventcount = "0";
        tk_input_data_source_outlier_min_eventcount_mode = "dynamic";
      }

      // Create the endpoint URL
      var myendpoint_URl =
        "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_sources/ds_update_outliers";

      // Create a dictionary to store the field names and values
      var record = {
        data_name: tk_data_name,
        OutlierMinEventCount: tk_outliermineventcount,
        OutlierLowerThresholdMultiplier: tk_outlierlowerthresholdmultiplier,
        OutlierUpperThresholdMultiplier: tk_outlierupperthresholdmultiplier,
        OutlierAlertOnUpper: tk_outlieralertonupper,
        OutlierTimePeriod: tk_outlier_period,
        OutlierSpan: tk_outlier_span,
        enable_behaviour_analytic: tk_enable_behaviour_analytic,
        update_comment: "N/A",
      };

      if (!tk_keyid || !tk_keyid.length) {
        // Show an error message
        $("#modal_entry_update_invalid").modal();
        return;
      } else {
        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          contentType: "application/json",
          dataType: "text",
          beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          data: JSON.stringify(record),
          success: function (returneddata) {
            // notify
            var tk_data_name = tokens.get("tk_data_name");
            var tk_data_index = tokens.get("tk_data_index");
            var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
            notification(
              "Outliers configuration updated, please wait a few seconds while statistics are generated, click on refresh in the Outliers tab if statistics are not yet available.",
              6000
            );

            // Generate metrics if outlier period was changed
            if (tk_source_outlier_period != tk_input_data_source_outlier_span) {
              metricOutliersGen(
                "data_source",
                tk_data_name,
                tk_input_data_source_outlier_period
              );
            }

            // call update summary investigator for that entity only
            updateDataSourceEntity(
              tk_data_name,
              tk_data_index,
              tk_data_sourcetype
            );

            searchSingleLag.startSearch();
            searchSingleByMetricsLag.startSearch();
            searchChartLag.startSearch();
            searchSingleSLApct.startSearch();
            searchOutlierDetectionChart.startSearch();
            searchOutlierDetectionTable.startSearch();

            // call update data source
            var tk_keyid = tokens.get("tk_keyid");
            updateDataSource(tk_keyid);

            // Run the search again to update the table
            searchDataSourcesMain.startSearch();
          },
          error: function (xhr, textStatus, error) {
            message =
              "server response: " +
              xhr.responseText +
              "\n - http response: " +
              error;

            // Audit
            action = "failure";
            change_type = "modify outliers";
            object = tk_data_name;
            object_category = "data_source";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = "N/A";
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(message);
            $("#modal_update_collection_failure_return").modal();
          },
        });
      }
    });

  // Data sampling
  $(".btn_data_sampling_manage").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Built the search URI
      var tk_data_name = tokens.get("tk_data_name");
      var tk_data_sourcetype = tokens.get("tk_data_sourcetype");
      var search_latest_sample =
        "search" +
        "?q=" +
        encodeURI(
          '| inputlookup trackme_data_sampling where data_name="' +
            tk_data_name +
            '" | fields raw_sample | mvexpand raw_sample | eval data_sourcetype="' +
            tk_data_sourcetype +
            '" | `trackme_data_sampling_abstract_detect_events_format` | lookup trackme_data_sampling_custom_models model_name as current_detected_format output model_type | eval model_type=if(isnull(model_type) AND isnotnull(current_detected_format), "inclusive", model_type)'
        );

      // Verify the current data sampling obfuscation mode, if enabled we change the search target

      // Define the query
      var searchQuery =
        '| rest /servicesNS/nobody/trackme/admin/macros/trackme_data_sampling_obfuscation_mode splunk_server=local | fields definition | rex field=definition mode=sed "s/`//g" | rename definition as current_mode';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-5m",
        latest_time: "now",
      };

      // Run a oneshot search that returns the job's results
      service.oneshotSearch(searchQuery, searchParams, function (err, results) {
        // Display the results
        var fields = results.fields;
        var rows = results.rows;
        var current_mode;

        for (var i = 0; i < rows.length; i++) {
          var values = rows[i];

          for (var j = 0; j < values.length; j++) {
            var field = fields[j];

            if (fields[j] == "current_mode") {
              current_mode = values[j];
            }
          }
        }

        if (!current_mode) {
          // Define the URL target
          document.getElementById("btn_data_sampling_latest_sample").href =
            search_latest_sample;
          return;
        }

        // Dynamically manage buttons states
        if (current_mode == "trackme_data_sampling_obfuscation_mode_enabled") {
          search_latest_sample =
            "search" +
            "?q=" +
            encodeURI(
              '| inputlookup trackme_data_sampling where data_name="' +
                tk_data_name +
                '" | fields raw_sample'
            );
          // Define the URL target
          document.getElementById("btn_data_sampling_latest_sample").href =
            search_latest_sample;
        } else if (
          current_mode == "trackme_data_sampling_obfuscation_mode_disabled"
        ) {
          // Define the URL target
          document.getElementById("btn_data_sampling_latest_sample").href =
            search_latest_sample;
        } else {
          // Define the URL target
          document.getElementById("btn_data_sampling_latest_sample").href =
            search_latest_sample;
        }
      });

      // Run engine should not be granted when an anomaly was found at first discovery
      var data_sample_anomaly_reason = tokens.get(
        "tk_data_sample_anomaly_reason"
      );
      if (data_sample_anomaly_reason == "multiformat_at_discovery") {
        document.getElementById("btn_run_data_sampling").disabled = true;
      } else {
        document.getElementById("btn_run_data_sampling").disabled = false;
      }

      $("#modal_manage").modal("hide");
      $("#data_sampling_manage").modal();
    });
  });

  // Back button
  $(".btn_data_sampling_back").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);
      $("#modal_manage").modal();
    });
  });

  // Show builtin rules
  $(".btn_data_sampling_builtin_rules").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);
      $("#data_sampling_show_builtin_rules").modal();
    });
  });

  // Back button
  $(".btn_data_sampling_builtin_rules_back").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);
      $("#data_sampling_manage").modal();
    });
  });

  // Show custom rules from data source
  $("#btn_data_sampling_custom_rules_view")
    .unbind("click")
    .click(function () {
      // Hide the back button
      var btn_back = document.getElementById(
        "btn_data_sampling_custom_rules_back"
      );
      btn_back.style.display = "inline-block";

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // free searches
      setToken("show_data_sampling_custom_rules", "true");

      // force re-run the search each time the button is clicked
      searchDataSamplingShowCustomRules.startSearch();

      $("#data_sampling_show_custom_rules").modal();
    });

  // Show custom rules from main
  $("#btn_modify_data_sampling_rules")
    .unbind("click")
    .click(function () {
      // Hide the back button
      var btn_back = document.getElementById(
        "btn_data_sampling_custom_rules_back"
      );
      btn_back.style.display = "none";

      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // free searches
      setToken("show_data_sampling_custom_rules", "true");

      // define a token that will be used to determine where in the UI we came from
      setToken("show_data_sampling_custom_rules_from_home", "true");

      // force re-run the search each time the button is clicked
      searchDataSamplingShowCustomRules.startSearch();

      $("#data_sampling_show_custom_rules").modal();
    });

  // Back button
  $(".btn_data_sampling_custom_rules_back").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      // target
      $("#data_sampling_manage").modal();
    });
  });

  // Remove custom rule
  $("#btn_modal_data_sampling_custom_rule_delete").click(function () {
    $("#data_sampling_show_custom_rules").modal("hide");
    $("#modal_remove_custom_rule_data_sampling").modal();
  });

  function foreachRemoveDataSamplingCustomRule(item) {
    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_sampling_custom_models/" +
      item;

    if (item && item.length) {
      // Get the KV entry content first
      $.ajax({
        url: myendpoint_URl,
        type: "GET",
        async: true,
        contentType: "application/json",
        success: function (returneddata) {
          var model_name = returneddata.model_name;
          var model_id = returneddata.model_id;
          var model_regex = returneddata.model_regex;
          var sourcetype_scope = returneddata.sourcetype_scope;
          var mtime = returneddata.mtime;
          var record = {
            model_name: model_name,
            model_id: model_id,
            model_regex: model_regex,
            sourcetype_scope: sourcetype_scope,
            mtime: mtime,
            _key: item,
          };

          // Retrieve update comment if any
          var tk_comment = document.getElementById(
            "input_remove_custom_rule_data_sampling_comment"
          ).value;

          // if is not defined, give it a value and override text box content
          if (tk_comment == "null") {
            setToken(
              "tk_update_comment",
              TokenUtils.replaceTokenNames(
                "No comments for update.",
                _.extend(submittedTokenModel.toJSON(), e.data)
              )
            );
          } else if (tk_comment == "update note") {
            tk_comment = "No comment for update.";
          }

          // Proceed to delete call
          $.ajax({
            url: myendpoint_URl,
            type: "DELETE",
            async: true,
            contentType: "application/json",
            success: function (returneddata) {
              // Audit
              action = "success";
              change_type = "delete data parsing custom rule";
              object = model_name;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              // house cleaning
              myendpoint_URl = undefined;
              delete myendpoint_URl;
              tk_keyid = undefined;
              delete tk_keyid;

              // Return to modal
              $("#data_sampling_show_custom_rules").modal();

              // Refresh the search
              searchDataSamplingShowCustomRules.startSearch();
            },
            error: function (xhr, textStatus, error) {
              message = "Error Updating!" + xhr + textStatus + error;

              // Audit
              action = "failure";
              change_type = "delete data parsing custom rule";
              object = model_name;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = message;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );
            },
          });
        },
      });
    }
  }

  $("#btn_modal_remove_custom_rule_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the arrays of keys
    var tk_multi_table_array = tokens.get("removeDataSamplingCustomRule");
    tk_multi_table_array = tk_multi_table_array.split(",");

    // Call the function for each value from the array
    tk_multi_table_array.forEach(foreachRemoveDataSamplingCustomRule);

    // Hide main modal
    $("#modal_remove_custom_rule_data_sampling").modal("hide");

    // notify
    notification("Modification has been registered successfully.", 2000);

    // house cleaning
    unsetToken("removeDataSamplingCustomRule");
  });

  // Run data sampling engine
  $("#btn_run_data_sampling").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Built the search URI
    var tk_keyid = tokens.get("tk_keyid");

    // Define the query
    var searchQuery =
      '| savedsearch "TrackMe - Data sampling engine for target" key="' +
      tk_keyid +
      '"';

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-7d",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#loadingGray").remove();
      $("body").append(
        '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Running the data sampling and format recognition engine...</p></div><div id="spinner"></div></div>'
      );

      require(["jquery", "/static/app/trackme/spin.js"], function ($, Spinner) {
        new Spinner({
          lines: 12,
          length: 18,
          position: "relative",
          color: "#003b59",
        }).spin(document.getElementById("spinner"));
      });

      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#loadingGray").remove();
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Once the job is done, update all searches
              searchDataSamplingTable1.startSearch();

              $("#loadingGray").remove();
              $("#data_sampling_manage").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }
              $("#loadingGray").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#loadingGray").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Disable action
  $("#btn_data_sampling_disable").click(function () {
    $("#modal_disable_data_sampling").modal();
  });

  $("#btn_modal_data_sampling_disable_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Built the search URI
    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Endpoint URI
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_sampling/" +
      tk_keyid;

    // Retrieve update comment if any
    var tk_comment = document.getElementById(
      "input_clear_state_data_sampling_comment"
    ).value;

    // if is not defined, give it a value and override text box content
    if (tk_comment == "null") {
      setToken(
        "tk_update_comment",
        TokenUtils.replaceTokenNames(
          "No comments for update.",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      // replace the textarea for modification requests
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    } else if (tk_comment == "update note") {
      tk_comment = "No comment for update.";
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    } else {
      // replace the textarea for modification requests
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    }

    // Get the KV entry content first
    $.ajax({
      url: myendpoint_URl,
      type: "GET",
      async: true,
      contentType: "application/json",
      success: function (returneddata) {
        var removedObject = returneddata;

        var data_sample_mtime = returneddata.data_sample_mtime;
        var data_sample_feature = returneddata.data_sample_feature;
        var data_sample_iteration = returneddata.data_sample_iteration;
        var data_sample_anomaly_reason =
          returneddata.data_sample_anomaly_reason;
        var data_sample_status_colour = returneddata.data_sample_status_colour;
        var data_sample_anomaly_ack_status =
          returneddata.data_sample_anomaly_ack_status;
        var data_sample_anomaly_ack_mtime =
          returneddata.data_sample_anomaly_ack_mtime;
        var data_sample_anomaly_detected =
          returneddata.data_sample_anomaly_detected;
        var data_sample_status_message =
          returneddata.data_sample_status_message;
        var multiformat_detected = returneddata.multiformat_detected;
        var current_detected_format = returneddata.current_detected_format;
        var current_detected_format_id =
          returneddata.current_detected_format_id;
        var current_detected_format_dcount =
          returneddata.current_detected_format_dcount;
        var previous_detected_format = returneddata.previous_detected_format;
        var previous_detected_format_id =
          returneddata.previous_detected_format_id;
        var previous_detected_format_dcount =
          returneddata.previous_detected_format_dcount;

        var record = {
          data_sample_mtime: data_sample_mtime,
          data_sample_feature: data_sample_feature,
          data_sample_iteration: data_sample_iteration,
          data_sample_anomaly_reason: data_sample_anomaly_reason,
          data_sample_status_colour: data_sample_status_colour,
          data_sample_anomaly_ack_status: data_sample_anomaly_ack_status,
          data_sample_anomaly_ack_mtime: data_sample_anomaly_ack_mtime,
          data_sample_anomaly_detected: data_sample_anomaly_detected,
          data_sample_status_message: data_sample_status_message,
          multiformat_detected: multiformat_detected,
          current_detected_format: current_detected_format,
          current_detected_format_id: current_detected_format_id,
          current_detected_format_dcount: current_detected_format_dcount,
          previous_detected_format: previous_detected_format,
          previous_detected_format_id: previous_detected_format_id,
          previous_detected_format_dcount: previous_detected_format_dcount,
        };

        // Define the query
        var searchQuery =
          '| inputlookup trackme_data_sampling where _key="' +
          tk_keyid +
          '" | eval keyid=_key | eval data_sample_feature="disabled", data_sample_mtime=now(), data_sample_status_message="WARNING: The data sample feature was manually disabled, to re-enable the feature, click on the button Manage data sampling then Clear state and run sampling.", data_sample_status_colour="orange" | foreach current_detected_format, current_detected_format_dcount, current_detected_format_id, data_sample_anomaly_ack_mtime, data_sample_anomaly_ack_status, data_sample_anomaly_detected, data_sample_anomaly_reason, data_sample_iteration, multiformat_detected, previous_detected_format, previous_detected_format_dcount, previous_detected_format_id, raw_sample [ eval <<FIELD>> = "N/A" ] | outputlookup append=t key_field=keyid trackme_data_sampling';

        // Set the search parameters--specify a time range
        var searchParams = {
          earliest_time: "-4h",
          latest_time: "now",
        };

        // Run a normal search that immediately returns the job's SID
        service.search(searchQuery, searchParams, function (err, job) {
          $("#loadingGray").remove();
          $("body").append(
            '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Clearing the data source state and disabling the data sampling feature...</p></div><div id="spinner"></div></div>'
          );

          require([
            "jquery",
            "/static/app/trackme/spin.js",
          ], function ($, Spinner) {
            new Spinner({
              lines: 12,
              length: 18,
              position: "relative",
              color: "#003b59",
            }).spin(document.getElementById("spinner"));
          });

          // Shall the search fail before we can get properties
          if (job == null) {
            let errorStr = "Unknown Error!";
            if (
              err &&
              err.data &&
              err.data.messages &&
              err.data.messages[0]["text"]
            ) {
              errorStr = err.data.messages[0]["text"];
            } else if (err && err.data && err.data.messages) {
              errorStr = JSON.stringify(err.data.messages);
            }
            $("#loadingGray").remove();
            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(errorStr);
            $("#modal_update_collection_failure_return").modal();
          } else {
            // Poll the status of the search job
            job.track(
              {
                period: 200,
              },
              {
                done: function (job) {
                  // Once the job is done, update all searches
                  searchDataSamplingTable1.startSearch();

                  $("#loadingGray").remove();
                  $("#data_sampling_manage").modal();
                },
                failed: function (properties) {
                  let errorStr = "Unknown Error!";
                  if (
                    properties &&
                    properties._properties &&
                    properties._properties.messages &&
                    properties._properties.messages[0]["text"]
                  ) {
                    errorStr = properties._properties.messages[0]["text"];
                  } else if (
                    properties &&
                    properties._properties &&
                    properties._properties.messages
                  ) {
                    errorStr = JSON.stringify(properties._properties.messages);
                  }
                  $("#loadingGray").remove();
                  $("#modal_update_collection_failure_return")
                    .find(".modal-error-message p")
                    .text(errorStr);
                  $("#modal_update_collection_failure_return").modal();
                },
                error: function (err) {
                  done(err);
                  $("#loadingGray").remove();
                  $("#modal_update_collection_failure").modal();
                },
              }
            );
          }
        });
      },
    });
  });

  // Update number of records per sample
  $("#btn_data_sampling_edit_records_nr").click(function () {
    $("#modal_update_records_nr_data_sampling").modal();
  });

  $("#btn_update_records_nr_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get tokens
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_sampling_nr = tokens.get("tk_input_data_sampling_records_nr");

    // Define the query
    var searchQuery =
      '| inputlookup trackme_data_sampling where data_name="' +
      tk_data_name +
      '" | eval keyid=_key | eval data_sampling_nr="' +
      tk_data_sampling_nr +
      '" | outputlookup append=t key_field=keyid trackme_data_sampling';

    // record for auditing
    var record = {
      data_name: tk_data_name,
      data_sampling_nr: tk_data_sampling_nr,
    };

    // Retrieve update comment if any
    var tk_comment = document.getElementById(
      "input_update_records_nr_data_sampling_comment"
    ).value;

    // if is not defined, give it a value and override text box content
    if (tk_comment == "null") {
      setToken(
        "tk_update_comment",
        TokenUtils.replaceTokenNames(
          "No comments for update.",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      // replace the textarea for modification requests
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    } else if (tk_comment == "update note") {
      tk_comment = "No comment for update.";
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    } else {
      // replace the textarea for modification requests
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    }

    // Set the search parameters--specify a time range
    var searchParams = {
      earliest_time: "-5m",
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      // Shall the search fail before we can get properties
      if (job == null) {
        let errorStr = "Unknown Error!";
        if (
          err &&
          err.data &&
          err.data.messages &&
          err.data.messages[0]["text"]
        ) {
          errorStr = err.data.messages[0]["text"];
        } else if (err && err.data && err.data.messages) {
          errorStr = JSON.stringify(err.data.messages);
        }
        $("#modal_update_collection_failure_return")
          .find(".modal-error-message p")
          .text(errorStr);
        $("#modal_update_collection_failure_return").modal();
      } else {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Audit
              action = "success";
              change_type = "update data sampling records_nr";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              notification("Update was successful.", 6000);

              // Update search
              searchDataSamplingTable1.startSearch();

              // Return to modal
              $("#data_sampling_manage").modal();
            },
            failed: function (properties) {
              let errorStr = "Unknown Error!";
              if (
                properties &&
                properties._properties &&
                properties._properties.messages &&
                properties._properties.messages[0]["text"]
              ) {
                errorStr = properties._properties.messages[0]["text"];
              } else if (
                properties &&
                properties._properties &&
                properties._properties.messages
              ) {
                errorStr = JSON.stringify(properties._properties.messages);
              }

              // Audit
              action = "failure";
              change_type = "update data sampling records_nr";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = errorStr;
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);

              // Audit
              action = "failure";
              change_type = "update data sampling records_nr";
              object = tk_data_name;
              object_category = "data_source";
              object_attrs = JSON.stringify(record, null, "\t");
              result = "N/A";
              comment = tk_comment;
              auditRecord(
                action,
                change_type,
                object,
                object_category,
                object_attrs,
                result,
                comment
              );

              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  $("#btn_update_records_nr_confirm_back").click(function () {
    // Return to modal
    $("#data_sampling_manage").modal();
  });

  // Clear state action
  $("#btn_data_sampling_clear_now").click(function () {
    $("#modal_clear_state_data_sampling").modal();
  });

  // Back button
  $("#btn_modal_clear_state_confirm_back").click(function () {
    // Return to modal
    $("#data_sampling_manage").modal();
  });

  // Clear state action button is confirmed
  $("#btn_modal_clear_state_confirm").click(function () {
    //var that = $(this);
    //that.off('click'); // remove handler

    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Built the search URI
    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Endpoint URI
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_sampling/" +
      tk_keyid;

    // Retrieve update comment if any
    var tk_comment = document.getElementById(
      "input_clear_state_data_sampling_comment"
    ).value;

    // if is not defined, give it a value and override text box content
    if (tk_comment == "null") {
      setToken(
        "tk_update_comment",
        TokenUtils.replaceTokenNames(
          "No comments for update.",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      // replace the textarea for modification requests
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    } else if (tk_comment == "update note") {
      tk_comment = "No comment for update.";
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    } else {
      // replace the textarea for modification requests
      document.getElementById("input_clear_state_data_sampling_comment").value =
        "update note";
    }

    // Get the KV entry content first
    $.ajax({
      url: myendpoint_URl,
      type: "GET",
      async: true,
      contentType: "application/json",
      success: function (returneddata) {
        var removedObject = returneddata;

        var data_sample_mtime = returneddata.data_sample_mtime;
        var data_sample_feature = returneddata.data_sample_feature;
        var data_sample_iteration = returneddata.data_sample_iteration;
        var data_sample_anomaly_reason =
          returneddata.data_sample_anomaly_reason;
        var data_sample_status_colour = returneddata.data_sample_status_colour;
        var data_sample_anomaly_ack_status =
          returneddata.data_sample_anomaly_ack_status;
        var data_sample_anomaly_ack_mtime =
          returneddata.data_sample_anomaly_ack_mtime;
        var data_sample_anomaly_detected =
          returneddata.data_sample_anomaly_detected;
        var data_sample_status_message =
          returneddata.data_sample_status_message;
        var data_sampling_nr = returneddata.data_sampling_nr;
        var multiformat_detected = returneddata.multiformat_detected;
        var current_detected_format = returneddata.current_detected_format;
        var current_detected_format_id =
          returneddata.current_detected_format_id;
        var current_detected_format_dcount =
          returneddata.current_detected_format_dcount;
        var previous_detected_format = returneddata.previous_detected_format;
        var previous_detected_format_id =
          returneddata.previous_detected_format_id;
        var previous_detected_format_dcount =
          returneddata.previous_detected_format_dcount;

        var record = {
          data_sample_mtime: data_sample_mtime,
          data_sample_feature: data_sample_feature,
          data_sample_iteration: data_sample_iteration,
          data_sample_anomaly_reason: data_sample_anomaly_reason,
          data_sample_status_colour: data_sample_status_colour,
          data_sample_anomaly_ack_status: data_sample_anomaly_ack_status,
          data_sample_anomaly_ack_mtime: data_sample_anomaly_ack_mtime,
          data_sample_anomaly_detected: data_sample_anomaly_detected,
          data_sample_status_message: data_sample_status_message,
          data_sampling_nr: data_sampling_nr,
          multiformat_detected: multiformat_detected,
          current_detected_format: current_detected_format,
          current_detected_format_id: current_detected_format_id,
          current_detected_format_dcount: current_detected_format_dcount,
          previous_detected_format: previous_detected_format,
          previous_detected_format_id: previous_detected_format_id,
          previous_detected_format_dcount: previous_detected_format_dcount,
        };

        // create a new record and preserve information that need to be preserved
        var new_record = {
          data_sampling_nr: data_sampling_nr,
        };

        // Proceed to post call
        $.ajax({
          url: myendpoint_URl,
          type: "POST",
          async: true,
          data: JSON.stringify(new_record),
          contentType: "application/json",
          success: function (returneddata) {
            // Audit
            action = "success";
            change_type = "data sampling clear state";
            object = tk_data_name;
            object_category = "data_source";
            object_attrs = JSON.stringify(record, null, "\t");
            result = "N/A";
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );

            // Define the query
            var searchQuery =
              '| savedsearch "TrackMe - Data sampling engine for target" key="' +
              tk_keyid +
              '"';

            // Set the search parameters--specify a time range
            var searchParams = {
              earliest_time: "-7d",
              latest_time: "now",
            };

            // Run a normal search that immediately returns the job's SID
            service.search(searchQuery, searchParams, function (err, job) {
              $("#loadingGray").remove();
              $("body").append(
                '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Clearing the data source state and running the data sampling and format recognition engine...</p></div><div id="spinner"></div></div>'
              );

              require([
                "jquery",
                "/static/app/trackme/spin.js",
              ], function ($, Spinner) {
                new Spinner({
                  lines: 12,
                  length: 18,
                  position: "relative",
                  color: "#003b59",
                }).spin(document.getElementById("spinner"));
              });

              // Shall the search fail before we can get properties
              if (job == null) {
                let errorStr = "Unknown Error!";
                if (
                  err &&
                  err.data &&
                  err.data.messages &&
                  err.data.messages[0]["text"]
                ) {
                  errorStr = err.data.messages[0]["text"];
                } else if (err && err.data && err.data.messages) {
                  errorStr = JSON.stringify(err.data.messages);
                }
                $("#loadingGray").remove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              } else {
                // Poll the status of the search job
                job.track(
                  {
                    period: 200,
                  },
                  {
                    done: function (job) {
                      // Once the job is done, update all searches
                      searchDataSamplingTable1.startSearch();

                      $("#loadingGray").remove();
                      $("#data_sampling_manage").modal();
                    },
                    failed: function (properties) {
                      let errorStr = "Unknown Error!";
                      if (
                        properties &&
                        properties._properties &&
                        properties._properties.messages &&
                        properties._properties.messages[0]["text"]
                      ) {
                        errorStr = properties._properties.messages[0]["text"];
                      } else if (
                        properties &&
                        properties._properties &&
                        properties._properties.messages
                      ) {
                        errorStr = JSON.stringify(
                          properties._properties.messages
                        );
                      }
                      $("#loadingGray").remove();
                      $("#modal_update_collection_failure_return")
                        .find(".modal-error-message p")
                        .text(errorStr);
                      $("#modal_update_collection_failure_return").modal();
                    },
                    error: function (err) {
                      done(err);
                      $("#loadingGray").remove();
                      $("#modal_update_collection_failure").modal();
                    },
                  }
                );
              }
            });
          },
          error: function (xhr, textStatus, error) {
            message = "Error Updating!" + xhr + textStatus + error;

            // Audit
            action = "failure";
            change_type = "data sampling clear state";
            object = tk_data_name;
            object_category = "data_source";
            object_attrs = JSON.stringify(record, null, "\t");
            result = message;
            comment = tk_comment;
            auditRecord(
              action,
              change_type,
              object,
              object_category,
              object_attrs,
              result,
              comment
            );
          },
        });
      },

      error: function (xhr, textStatus, error) {
        // Define the query
        var searchQuery =
          '| savedsearch "TrackMe - Data sampling engine for target" key="' +
          tk_keyid +
          '"';

        // Set the search parameters--specify a time range
        var searchParams = {
          earliest_time: "-7d",
          latest_time: "now",
        };

        // Run a normal search that immediately returns the job's SID
        service.search(searchQuery, searchParams, function (err, job) {
          $("#loadingGray").remove();
          $("body").append(
            '<div id="loadingGray" style="background: #e9e9e9; display: block; position: fixed; z-index: 100; top: 0; right: 0; bottom: 0; left: 0; height: 100%; opacity: 0.8;"><div style="width: 100%; margin-top: 250px; padding-bottom: 50px; text-align: center;"><p style="font-size: 18pt; font-weight: bolder; color: #003b59;">Clearing the data source state and running the data sampling and format recognition engine...</p></div><div id="spinner"></div></div>'
          );

          require([
            "jquery",
            "/static/app/trackme/spin.js",
          ], function ($, Spinner) {
            new Spinner({
              lines: 12,
              length: 18,
              position: "relative",
              color: "#003b59",
            }).spin(document.getElementById("spinner"));
          });

          // Shall the search fail before we can get properties
          if (job == null) {
            let errorStr = "Unknown Error!";
            if (
              err &&
              err.data &&
              err.data.messages &&
              err.data.messages[0]["text"]
            ) {
              errorStr = err.data.messages[0]["text"];
            } else if (err && err.data && err.data.messages) {
              errorStr = JSON.stringify(err.data.messages);
            }
            $("#loadingGray").remove();
            $("#modal_update_collection_failure_return")
              .find(".modal-error-message p")
              .text(errorStr);
            $("#modal_update_collection_failure_return").modal();
          } else {
            // Poll the status of the search job
            job.track(
              {
                period: 200,
              },
              {
                done: function (job) {
                  // Once the job is done, update all searches
                  searchDataSamplingTable1.startSearch();

                  $("#loadingGray").remove();
                  $("#data_sampling_manage").modal();
                },
                failed: function (properties) {
                  let errorStr = "Unknown Error!";
                  if (
                    properties &&
                    properties._properties &&
                    properties._properties.messages &&
                    properties._properties.messages[0]["text"]
                  ) {
                    errorStr = properties._properties.messages[0]["text"];
                  } else if (
                    properties &&
                    properties._properties &&
                    properties._properties.messages
                  ) {
                    errorStr = JSON.stringify(properties._properties.messages);
                  }
                  $("#loadingGray").remove();
                  $("#modal_update_collection_failure_return")
                    .find(".modal-error-message p")
                    .text(errorStr);
                  $("#modal_update_collection_failure_return").modal();
                },
                error: function (err) {
                  done(err);
                  $("#loadingGray").remove();
                  $("#modal_update_collection_failure").modal();
                },
              }
            );
          }
        });
      },
    });
  });

  // Back button
  $("#btn_modal_data_sampling_disable_confirm_back").click(function () {
    // Return to modal
    $("#data_sampling_manage").modal();
  });

  // Data sampling custom rules
  $("#btn_data_sampling_custom_rules").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Get the current data source
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_sourcetype = tokens.get("tk_data_sourcetype");

    // Apply to the form inputs
    setToken("form.tk_input_data_sampling_dropdown", tk_data_name);
    setToken("form.tk_data_sampling_custom_st_value", tk_data_sourcetype);

    // Unset action tokens
    unsetToken("start_simulation_data_sampling_custom_rule_show_events");
    unsetToken("start_simulation_data_sampling_custom_rule");

    // Disable the button results
    document.getElementById(
      "btn_modal_data_sampling_custom_rule_simulate_show_details"
    ).disabled = true;
    document.getElementById(
      "btn_data_sampling_custom_rule_add"
    ).disabled = true;

    // Free the dropdown populating search
    setToken("start_search_input_data_sampling_dropdown", "true");

    // force re-run the search each time the button is clicked
    searchPopulateDataSampling.startSearch();

    // Open modal
    $("#data_sampling_create_custom_rules").modal();
  });

  // Back button
  $("#btn_modal_data_sampling_custom_rule_add_new_back").click(function () {
    $("#data_sampling_show_custom_rules").modal();
  });

  // Data sampling custom rule simulation
  $("#btn_modal_data_sampling_custom_rule_show_sample").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Unset the token and set to free the search
    unsetToken("start_simulation_data_sampling_custom_rule_show_events");
    setToken("start_simulation_data_sampling_custom_rule_show_events", "true");
  });

  // Data sampling custom rule simulation
  $("#btn_modal_data_sampling_custom_rule_simulate").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve the regex rule
    var tk_data_sampling_custom_rule_regex = document.getElementById(
      "modal_input_data_sampling_custom_rule_regex"
    ).value;

    // Retrieve the rule name
    var tk_data_sampling_custom_rule_name = tokens.get(
      "tk_data_sampling_custom_rule_name"
    );

    // Retriebe the key id
    var tk_keyid = tokens.get("tk_keyid");

    // if is not defined, give it a value and override text box content
    if (
      tk_data_sampling_custom_rule_regex ==
        'Enter a valid regular expression and click on the button "Run model simulation".' ||
      !tk_data_sampling_custom_rule_name ||
      !tk_data_sampling_custom_rule_name.length
    ) {
      // Show an error notification
      notification(
        "ERROR: Entries are either incorrect or incomplete, please correct and try again.",
        6000
      );

      // Disable the add button
      document.getElementById(
        "btn_data_sampling_custom_rule_add"
      ).disabled = true;
    } else {
      // replace the textarea for modification requests
      notification("INFO: running new data sampling model...", 6000);
      unsetToken("tk_data_sampling_custom_rule_regex");
      setToken(
        "tk_data_sampling_custom_rule_regex",
        tk_data_sampling_custom_rule_regex
      );
      // Free the simulation search
      setToken("start_simulation_data_sampling_custom_rule", "true");

      // Define the URL target
      document.getElementById(
        "btn_modal_data_sampling_custom_rule_simulate_show_details"
      ).disabled = false;

      // Enable the button results
      document.getElementById(
        "btn_modal_data_sampling_custom_rule_simulate_show_details"
      ).disabled = false;

      // Disable the add button
      document.getElementById(
        "btn_data_sampling_custom_rule_add"
      ).disabled = false;
    }
  });

  // Data sampling add custom rule
  $("#btn_data_sampling_custom_rule_add").click(function () {
    $("#modal_add_custom_rule_data_sampling").modal();
  });

  // Data sampling add custom rule
  $("#btn_modal_add_custom_rule_confirm").click(function () {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Retrieve the regex rule
    var tk_data_sampling_custom_rule_regex = document.getElementById(
      "modal_input_data_sampling_custom_rule_regex"
    ).value;

    // Retrieve the rule name
    var tk_data_sampling_custom_rule_name = tokens.get(
      "tk_data_sampling_custom_rule_name"
    );

    // Retrieve the rule type
    var tk_data_sampling_custom_rule_type = tokens.get(
      "tk_data_sampling_custom_rule_type"
    );

    // Retrieve the sourcetype scope
    var tk_data_sampling_custom_sourcetype_scope = tokens.get(
      "tk_data_sampling_custom_sourcetype_scope"
    );

    // if is not defined, give it a value and override text box content - We should never reach this for the add function
    if (
      tk_data_sampling_custom_rule_regex ==
        'Enter a valid regular expression and click on the button "Run model simulation".' ||
      !tk_data_sampling_custom_rule_name ||
      !tk_data_sampling_custom_rule_name.length
    ) {
      // Show an error notification
      notification(
        "ERROR: Entries are either incorrect or incomplete, please correct and try again.",
        6000
      );

      // Disable the add button
      document.getElementById(
        "btn_data_sampling_custom_rule_add"
      ).disabled = true;
    } else {
      // Retrieve update comment if any
      var tk_comment = document.getElementById(
        "input_add_custom_rule_data_sampling_comment"
      ).value;

      // if is not defined, give it a value and override text box content
      if (tk_comment == "null") {
        setToken(
          "tk_update_comment",
          TokenUtils.replaceTokenNames(
            "No comments for update.",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textarea for modification requests
        document.getElementById(
          "input_add_custom_rule_data_sampling_comment"
        ).value = "update note";
      } else if (tk_comment == "update note") {
        tk_comment = "No comment for update.";
        document.getElementById(
          "input_add_custom_rule_data_sampling_comment"
        ).value = "update note";
      } else {
        // replace the textarea for modification requests
        document.getElementById(
          "input_add_custom_rule_data_sampling_comment"
        ).value = "update note";
      }

      // Define the query
      var searchQuery =
        '| makeresults | eval model_name="' +
        tk_data_sampling_custom_rule_name +
        '", model_type="' +
        tk_data_sampling_custom_rule_type +
        '", model_regex="' +
        tk_data_sampling_custom_rule_regex +
        '", sourcetype_scope="' +
        tk_data_sampling_custom_sourcetype_scope +
        '" | eval _key=md5(model_name), model_id=md5(model_name), mtime=now() | outputlookup trackme_data_sampling_custom_models append=t key_field=_key';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-60m",
        latest_time: "now",
      };

      // Run a blocking search and get back a job
      service.search(searchQuery, searchParams, function (err, job) {
        function audit_failure() {
          // Audit
          action = "failure";
          change_type = "add data parsing custom rule";
          object = tk_data_sampling_custom_rule_name;
          object_category = "data_source";
          object_attrs =
            "{\n" +
            '\t"model_name": "' +
            tk_data_sampling_custom_rule_name +
            '",\n\t"model_regex": "' +
            tk_data_sampling_custom_rule_regex +
            '",\n\t"sourcetype_scope": "' +
            tk_data_sampling_custom_sourcetype_scope +
            '"\n}';
          result = "N/A";
          comment = tk_comment;
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );
        }

        // Shall the search fail before we can get properties
        if (job == null) {
          let errorStr = "Unknown Error!";
          if (
            err &&
            err.data &&
            err.data.messages &&
            err.data.messages[0]["text"]
          ) {
            errorStr = err.data.messages[0]["text"];
          } else if (err && err.data && err.data.messages) {
            errorStr = JSON.stringify(err.data.messages);
          }
          audit_failure();
          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(errorStr);
          $("#modal_update_collection_failure_return").modal();
        } else {
          // Poll the status of the search job
          job.track(
            {
              period: 200,
            },
            {
              done: function (job) {
                // Once the job is done, update all searches
                searchBlackListDataSourceHost.startSearch();
                searchSingleBlackListDataSourceHost.startSearch();
                searchDataSourcesMain.startSearch();
                searchDataSamplingShowCustomRules.startSearch();
                // notify
                notification(
                  "Modification has been registered successfully.",
                  2000
                );

                // Audit
                action = "success";
                change_type = "add data parsing custom rule";
                object = tk_data_sampling_custom_rule_name;
                object_category = "data_source";
                object_attrs =
                  "{\n" +
                  '\t"model_name": "' +
                  tk_data_sampling_custom_rule_name +
                  '",\n\t"model_regex": "' +
                  tk_data_sampling_custom_rule_regex +
                  '",\n\t"sourcetype_scope": "' +
                  tk_data_sampling_custom_sourcetype_scope +
                  '"\n}';
                result = "N/A";
                comment = tk_comment;
                auditRecord(
                  action,
                  change_type,
                  object,
                  object_category,
                  object_attrs,
                  result,
                  comment
                );

                // Take a decision depending on where we come from
                var tk_data_sampling_custom_rule_name = tokens.get(
                  "show_data_sampling_custom_rules_from_home"
                );

                if (tk_data_sampling_custom_rule_name == "true") {
                  $("#data_sampling_show_custom_rules").modal();
                } else {
                  $("#data_sampling_manage").modal();
                }
              },
              failed: function (properties) {
                let errorStr = "Unknown Error!";
                if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages &&
                  properties._properties.messages[0]["text"]
                ) {
                  errorStr = properties._properties.messages[0]["text"];
                } else if (
                  properties &&
                  properties._properties &&
                  properties._properties.messages
                ) {
                  errorStr = JSON.stringify(properties._properties.messages);
                }
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                audit_failure();
                $("#modal_update_collection_failure_flush").modal();
              },
            }
          );
        }
      });
    }
  });

  $("#btn_modal_data_sampling_custom_rule_simulate_show_details").click(
    function () {
      submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Retrieve the regex rule
      var tk_data_sampling_custom_rule_regex = document.getElementById(
        "modal_input_data_sampling_custom_rule_regex"
      ).value;

      // Retrieve the rule name
      var tk_data_sampling_custom_rule_name = tokens.get(
        "tk_data_sampling_custom_rule_name"
      );

      // Retrieve the sourcetype scope
      var tk_data_sampling_custom_sourcetype_scope = tokens.get(
        "tk_data_sampling_custom_sourcetype_scope"
      );

      // Retrieve the key id
      var tk_keyid = tokens.get("tk_keyid");

      // Retrieve the key id
      var tk_data_sourcetype = tokens.get("tk_data_sourcetype");

      // Built the search URI
      var similation_events_detail =
        "search" +
        "?q=" +
        encodeURIComponent(
          '| `trackme_data_sampling_return_live_sample("' +
            tk_keyid +
            '")` | fields raw_sample | mvexpand raw_sample | eval sourcetype="' +
            tk_data_sourcetype +
            '", sourcetype_scope="' +
            tk_data_sampling_custom_sourcetype_scope +
            '" | eval detected_format = case((sourcetype_scope=="*"), case(match(raw_sample, "' +
            tk_data_sampling_custom_rule_regex +
            '"), "' +
            tk_data_sampling_custom_rule_name +
            '"), in(sourcetype, `trackme_data_sampling_custom_models_simulate_genlist("' +
            tk_data_sampling_custom_sourcetype_scope +
            '")`), case(match(raw_sample, "' +
            tk_data_sampling_custom_rule_regex +
            '"), "' +
            tk_data_sampling_custom_rule_name +
            '")) | eval detected_format_id=md5(detected_format)'
        );

      // Open
      window.open(similation_events_detail, "_blank");
    }
  );

  // Outliers simulation

  // data source run simulation
  $("#btn_outlier_config_data_host_simulate").click(function () {
    // create token that will free the search for table populate
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // get the object name
    var tk_data_host = tokens.get("tk_data_host");

    // set the token the search depends on
    setToken("start_outliers_simulation_data_host", "true");

    // explicitly start the search
    searchOutlierDetectionChartSimulationDataHost.startSearch();

    // notify
    notification(
      "Outliers simulation started for data host " + tk_data_host + ".",
      6000
    );
  });

  $("#btn_outlier_config_data_host_save").click(function (mode) {
    submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");
    var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
    var tk_outlierlowerthresholdmultiplier = tokens.get(
      "tk_outlierlowerthresholdmultiplier"
    );
    var tk_outlierupperthresholdmultiplier = tokens.get(
      "tk_outlierupperthresholdmultiplier"
    );
    var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
    var tk_outlier_period = tokens.get("tk_outlier_period");
    var tk_outlier_span = tokens.get("tk_outlier_span");
    var tk_enable_behaviour_analytic = tokens.get(
      "tk_enable_behaviour_analytic"
    );

    // get inputs tokens

    var tk_input_data_host_enable_outlier = tokens.get(
      "tk_input_data_host_enable_outlier"
    );
    var tk_input_data_host_outlier_min_eventcount_mode = tokens.get(
      "tk_input_data_host_outlier_min_eventcount_mode"
    );
    var tk_input_data_host_outlier_alert_on_upper = tokens.get(
      "tk_input_data_host_outlier_alert_on_upper"
    );
    var tk_input_data_host_outlier_min_eventcount = tokens.get(
      "tk_input_data_host_outlier_min_eventcount"
    );
    var tk_input_data_host_outlier_lower_threshold_multiplier = tokens.get(
      "tk_input_data_host_outlier_lower_threshold_multiplier"
    );
    var tk_input_data_host_outlier_upper_threshold_multiplier = tokens.get(
      "tk_input_data_host_outlier_upper_threshold_multiplier"
    );
    var tk_input_data_host_outlier_period = tokens.get(
      "tk_input_data_host_outlier_period"
    );
    var tk_input_data_host_outlier_span = tokens.get(
      "tk_input_data_host_outlier_span"
    );

    // Conditionally define record values for Outliers
    if (tk_enable_behaviour_analytic != tk_input_data_host_enable_outlier) {
      tk_enable_behaviour_analytic = tk_input_data_host_enable_outlier;
    }

    if (tk_outlieralertonupper != tk_input_data_host_outlier_alert_on_upper) {
      tk_outlieralertonupper = tk_input_data_host_outlier_alert_on_upper;
    }

    tk_source_outlier_period = tk_outlier_period;
    if (tk_outlier_period != tk_input_data_host_outlier_period) {
      tk_outlier_period = tk_input_data_host_outlier_period;
    }

    if (tk_outlier_span != tk_input_data_host_outlier_span) {
      tk_outlier_span = tk_input_data_host_outlier_span;
      // refresh the token for current view usage
      setToken("tk_outlier_span", tk_input_data_host_outlier_span);
    }

    if (
      tk_outlierlowerthresholdmultiplier !=
        tk_input_data_host_outlier_lower_threshold_multiplier &&
      isNumeric(tk_input_data_host_outlier_lower_threshold_multiplier)
    ) {
      tk_outlierlowerthresholdmultiplier =
        tk_input_data_host_outlier_lower_threshold_multiplier;
    }

    if (
      tk_outlierupperthresholdmultiplier !=
        tk_input_data_host_outlier_upper_threshold_multiplier &&
      isNumeric(tk_input_data_host_outlier_upper_threshold_multiplier)
    ) {
      tk_outlierupperthresholdmultiplier =
        tk_input_data_host_outlier_upper_threshold_multiplier;
    }

    if (
      tk_input_data_host_outlier_min_eventcount_mode === "static" &&
      isNumeric(tk_input_data_host_outlier_min_eventcount) &&
      tk_input_data_host_outlier_min_eventcount > 0
    ) {
      tk_outliermineventcount = tk_input_data_host_outlier_min_eventcount;
    } else {
      tk_outliermineventcount = "0";
      tk_input_data_host_outlier_min_eventcount_mode = "dynamic";
    }

    // Create the endpoint URL
    var myendpoint_URl =
      "{{SPLUNKWEB_URL_PREFIX}}/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_outliers";

    // Create a dictionary to store the field names and values
    var record = {
      data_host: tk_data_host,
      OutlierMinEventCount: tk_outliermineventcount,
      OutlierLowerThresholdMultiplier: tk_outlierlowerthresholdmultiplier,
      OutlierUpperThresholdMultiplier: tk_outlierupperthresholdmultiplier,
      OutlierAlertOnUpper: tk_outlieralertonupper,
      OutlierTimePeriod: tk_outlier_period,
      OutlierSpan: tk_outlier_span,
      enable_behaviour_analytic: tk_enable_behaviour_analytic,
      update_comment: "N/A",
    };

    if (!tk_keyid || !tk_keyid.length) {
      // Show an error message
      $("#modal_entry_update_invalid").modal();
      return;
    } else {
      $.ajax({
        url: myendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "text",
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        data: JSON.stringify(record),
        success: function (returneddata) {
          // notify
          var tk_data_host = tokens.get("tk_data_host");
          notification(
            "Outliers configuration updated, please wait a few seconds while statistics are generated, click on refresh in the Outliers tab if statistics are not yet available.",
            6000
          );

          // Generate metrics if outlier period was changed
          if (tk_source_outlier_period != tk_input_data_host_outlier_span) {
            metricOutliersGen(
              "data_host",
              tk_data_host,
              tk_input_data_host_outlier_period
            );
          }

          // call update summary investigator for that entity only
          updateDataHostEntity(
            "trackme_datahost_tracker_shorterm",
            tk_data_host
          );

          searchSingleLagHost.startSearch();
          searchSingleLagByMetricsHost.startSearch();
          searchChartHostBaseSearch.startSearch();
          searchChartLagHostOverTime.startSearch();
          searchSingleSLAHostpct.startSearch();
          searchOutlierDetectionChartDataHost.startSearch();
          searchOutlierDetectionTableDataHost.startSearch();

          // call update data host
          var tk_keyid = tokens.get("tk_keyid");
          updateDataHost(tk_keyid);

          // Run the search again to update the table
          searchDataHostsMain.startSearch();
        },
        error: function (xhr, textStatus, error) {
          message =
            "server response: " +
            xhr.responseText +
            "\n - http response: " +
            error;

          // Audit
          action = "failure";
          change_type = "modify outliers";
          object = tk_data_host;
          object_category = "data_host";
          object_attrs = JSON.stringify(record, null, "\t");
          result = message;
          comment = "N/A";
          auditRecord(
            action,
            change_type,
            object,
            object_category,
            object_attrs,
            result,
            comment
          );

          $("#modal_update_collection_failure_return")
            .find(".modal-error-message p")
            .text(message);
          $("#modal_update_collection_failure_return").modal();
        },
      });
    }
  });

  //
  // Splunk forms
  //

  var link1 = new LinkListInput({
    "id": "link1",
    "choices": [{
            "value": "show_data_source_tracker",
            "label": "DATA SOURCES TRACKING"
        },
        {
            "value": "show_data_host_tracker",
            "label": "DATA HOSTS TRACKING"
        },
        {
            "value": "show_metric_host_tracker",
            "label": "METRIC HOSTS TRACKING"
        },
        {
            "value": "show_audit_flip",
            "label": "INVESTIGATE STATUS FLIPPING"
        },
        {
            "value": "show_audit_changes",
            "label": "INVESTIGATE AUDIT CHANGES"
        },
        {
            "value": "show_alerts",
            "label": "TRACKING ALERTS"
        }                
    ],
    "default": "show_data_source_tracker",
    "selectFirstChoice": false,
    "searchWhenChanged": true,
    "value": "$form.tk_main_link$",
    "el": $('#link1')
}, {
    tokens: true
}).render();

link1.on("change", function(newValue) {
    FormUtils.handleValueChange(link1);
});

link1.on("valueChange", function(e) {
    if (e.value === "show_data_source_tracker") {
        EventHandler.setToken("show_data_source_tracker", "true", {}, e.data);
        EventHandler.unsetToken("show_data_host_tracker");
        EventHandler.unsetToken("show_audit_flip");
        EventHandler.unsetToken("show_audit_changes");
        EventHandler.unsetToken("show_metric_host_tracker");
        EventHandler.unsetToken("show_alerts");                
    } else if (e.value === "show_data_host_tracker") {
        EventHandler.setToken("show_data_host_tracker", "true", {}, e.data);
        EventHandler.unsetToken("show_data_source_tracker");
        EventHandler.unsetToken("show_audit_flip");
        EventHandler.unsetToken("show_audit_changes");
        EventHandler.unsetToken("show_metric_host_tracker");
        EventHandler.unsetToken("show_alerts");                
    } else if (e.value === "show_metric_host_tracker") {
        EventHandler.setToken("show_metric_host_tracker", "true", {}, e.data);
        EventHandler.unsetToken("show_data_source_tracker");
        EventHandler.unsetToken("show_data_host_tracker");
        EventHandler.unsetToken("show_audit_flip");
        EventHandler.unsetToken("show_audit_changes");
        EventHandler.unsetToken("show_alerts");                
    } else if (e.value === "show_audit_flip") {
        EventHandler.setToken("show_audit_flip", "true", {}, e.data);
        EventHandler.unsetToken("show_data_source_tracker");
        EventHandler.unsetToken("show_data_host_tracker");
        EventHandler.unsetToken("show_audit_changes");
        EventHandler.unsetToken("show_metric_host_tracker");
        EventHandler.unsetToken("show_alerts");                
    } else if (e.value === "show_audit_changes") {
        EventHandler.setToken("show_audit_changes", "true", {}, e.data);
        EventHandler.unsetToken("show_data_source_tracker");
        EventHandler.unsetToken("show_data_host_tracker");
        EventHandler.unsetToken("show_audit_flip");
        EventHandler.unsetToken("show_metric_host_tracker");
        EventHandler.unsetToken("show_alerts");
    } else if (e.value === "show_alerts") {
        EventHandler.setToken("show_alerts", "true", {}, e.data);
        EventHandler.unsetToken("show_data_source_tracker");
        EventHandler.unsetToken("show_data_host_tracker");
        EventHandler.unsetToken("show_audit_flip");
        EventHandler.unsetToken("show_metric_host_tracker");
        EventHandler.unsetToken("show_audit_changes");
    }            
});


  // END

  //
  // END
  //
});
