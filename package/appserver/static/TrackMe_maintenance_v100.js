const { Callbacks } = require("jquery");

require([
  "jquery",
  "underscore",
  "splunkjs/mvc",
  "splunkjs/mvc/utils",
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
  FormUtils,
  SearchControlsView,
  SearchManager,
  PostProcessManager,
  DropdownView,
  MultiDropdownView,
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
  // Functions
  //

  // Audit record
  function auditRecord(
    action,
    change_type,
    object,
    object_category,
    object_attrs,
    result,
    comment
  ) {
    // Audit changes
    var tokens = mvc.Components.get("default");
    var currentUser = Splunk.util.getConfigValue("USERNAME");
    tokens.set("currentUser", currentUser);
    var auditendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_audit_changes/";

    var time = new Date().getTime();
    var audit_record = {
      time: time,
      action: action,
      user: currentUser,
      change_type: change_type,
      object: object,
      object_category: object_category,
      object_attrs: object_attrs,
      result: result,
      comment: comment,
    };
    $.ajax({
      url: auditendpoint_URl,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: JSON.stringify(audit_record),
      success: function (returneddata) {
        // Run the search again to update the table
      },
    });
  }

  // Notify

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

  //
  // MAINTENANCE MODE
  //

  var search_maintenance_mode_mainsearch = new SearchManager(
    {
      id: "search_maintenance_mode_mainsearch",
      sample_ratio: 1,
      search:
        '| inputlookup trackme_maintenance_mode | eval maintenance_mode=if(now()<maintenance_mode_start AND maintenance_mode_end>now(), "scheduled", maintenance_mode)',
      status_buckets: 0,
      earliest_time: "-24h@h",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      refresh: "30s",
      refreshType: "delay",
      preview: true,
      tokenDependencies: {},
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "search_maintenance_mode_mainsearch",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'result.maintenance_mode'==\"enabled\"",
        actions: [
          {
            type: "set",
            token: "maintenance_enabled",
            value: "true",
          },
          {
            type: "unset",
            token: "maintenance_scheduled",
          },
        ],
      },
      {
        attr: "match",
        value: "'result.maintenance_mode'==\"scheduled\"",
        actions: [
          {
            type: "set",
            token: "maintenance_scheduled",
            value: "true",
          },
          {
            type: "unset",
            token: "maintenance_enabled",
          },
        ],
      },
      {
        attr: "match",
        value: "'result.maintenance_mode'==\"disabled\"",
        actions: [
          {
            type: "unset",
            token: "maintenance_scheduled",
          },
          {
            type: "unset",
            token: "maintenance_enabled",
          },
        ],
      },
    ],
  });

  var search_maintenance_state = new PostProcessManager(
    {
      managerid: "search_maintenance_mode_mainsearch",
      id: "search_maintenance_state",
      search:
        'fields maintenance_mode | eval maintenance=case(match(maintenance_mode, "enabled"), 1, match(maintenance_mode, "disabled"), 0, match(maintenance_mode, "scheduled"), 2), maintenance_mode=upper(maintenance_mode) | rangemap field=maintenance low=0-0 severe=1-1 high=2-2 default=severe',
      tokenDependencies: {},
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var search_maintenance_state_reactivation = new PostProcessManager(
    {
      managerid: "search_maintenance_mode_mainsearch",
      id: "search_maintenance_state_reactivation",
      search:
        'eval maintenance_mode_end=strftime(maintenance_mode_end, "%d %b %H:%M") | eval maintenance = "Ends on: " . maintenance_mode_end | fields maintenance',
      tokenDependencies: {},
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var search_maintenance_state_scheduled = new PostProcessManager(
    {
      managerid: "search_maintenance_mode_mainsearch",
      id: "search_maintenance_state_scheduled",
      search:
        'eval maintenance_mode_start=strftime(maintenance_mode_start, "%d %b %H:%M"), maintenance_mode_end=strftime(maintenance_mode_end, "%d %b %H:%M") | eval maintenance = "Starts on: " . maintenance_mode_start . " / " . "Ends on: " . maintenance_mode_end | fields maintenance',
      tokenDependencies: {},
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // views

  var element_maintenance_state = new SingleView(
    {
      id: "element_maintenance_state",
      drilldown: "none",
      colorMode: "block",
      "link.visible": "false",
      numberPrecision: "0",
      useColors: "0",
      underLabel: "MAINTENANCE MODE STATUS",
      colorBy: "value",
      height: "100",
      managerid: "search_maintenance_state",
      el: $("#element_maintenance_state"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  var element_maintenance_state_reactivation = new SingleView(
    {
      id: "element_maintenance_state_reactivation",
      drilldown: "none",
      colorMode: "block",
      "link.visible": "false",
      numberPrecision: "0",
      useColors: "0",
      underLabel:
        "ESTIMATED DATE FOR AUTO-DEACTIVATION OF THE MAINTENANCE MODE",
      colorBy: "value",
      height: "60",
      managerid: "search_maintenance_state_reactivation",
      el: $("#element_maintenance_state_reactivation"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  var element_maintenance_state_scheduled = new SingleView(
    {
      id: "element_maintenance_state_scheduled",
      drilldown: "none",
      colorMode: "block",
      "link.visible": "false",
      numberPrecision: "0",
      useColors: "0",
      underLabel: "MAINTENANCE MODE HAS BEEN SCHEDULED",
      colorBy: "value",
      height: "60",
      managerid: "search_maintenance_state_scheduled",
      el: $("#element_maintenance_state_scheduled"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  //
  // inputs
  //

  // start time maintenance mode
  var inputStartMaintenanceTime = new DropdownView(
    {
      id: "inputStartMaintenanceTime",
      choices: [
        {
          value: "now",
          label: "now",
        },
        {
          value: "00:00",
          label: "12:00am",
        },
        {
          value: "00:30",
          label: "12:30am",
        },
        {
          value: "01:00",
          label: "01:00am",
        },
        {
          value: "01:30",
          label: "01:30am",
        },
        {
          value: "02:00",
          label: "02:00am",
        },
        {
          value: "02:30",
          label: "02:30am",
        },
        {
          value: "03:00",
          label: "03:00am",
        },
        {
          value: "03:30",
          label: "03:30am",
        },
        {
          value: "04:00",
          label: "04:00am",
        },
        {
          value: "04:30",
          label: "04:30am",
        },
        {
          value: "05:00",
          label: "05:00am",
        },
        {
          value: "05:30",
          label: "05:30am",
        },
        {
          value: "06:00",
          label: "06:00am",
        },
        {
          value: "06:30",
          label: "06:30am",
        },
        {
          value: "07:00",
          label: "07:00am",
        },
        {
          value: "07:30",
          label: "07:30am",
        },
        {
          value: "08:00",
          label: "08:00am",
        },
        {
          value: "08:30",
          label: "08:30am",
        },
        {
          value: "09:00",
          label: "09:00am",
        },
        {
          value: "09:30",
          label: "09:30am",
        },
        {
          value: "10:00",
          label: "10:00am",
        },
        {
          value: "10:30",
          label: "10:30am",
        },
        {
          value: "11:00",
          label: "11:00am",
        },
        {
          value: "11:30",
          label: "11:30am",
        },
        {
          value: "12:00",
          label: "12:00pm",
        },
        {
          value: "12:30",
          label: "12:30pm",
        },
        {
          value: "13:00",
          label: "01:00pm",
        },
        {
          value: "13:30",
          label: "01:30pm",
        },
        {
          value: "14:00",
          label: "02:00pm",
        },
        {
          value: "14:30",
          label: "02:30pm",
        },
        {
          value: "15:00",
          label: "03:00pm",
        },
        {
          value: "15:30",
          label: "03:30pm",
        },
        {
          value: "16:00",
          label: "04:00pm",
        },
        {
          value: "16:30",
          label: "04:30pm",
        },
        {
          value: "17:00",
          label: "05:00pm",
        },
        {
          value: "17:30",
          label: "05:30pm",
        },
        {
          value: "18:00",
          label: "06:00pm",
        },
        {
          value: "18:30",
          label: "06:30pm",
        },
        {
          value: "19:00",
          label: "07:00pm",
        },
        {
          value: "19:30",
          label: "07:30pm",
        },
        {
          value: "20:00",
          label: "08:00pm",
        },
        {
          value: "20:30",
          label: "08:30pm",
        },
        {
          value: "21:00",
          label: "09:00pm",
        },
        {
          value: "21:30",
          label: "09:30pm",
        },
        {
          value: "22:00",
          label: "10:00pm",
        },
        {
          value: "22:30",
          label: "10:30pm",
        },
        {
          value: "23:00",
          label: "11:00pm",
        },
        {
          value: "23:30",
          label: "11:30pm",
        },
      ],
      searchWhenChanged: true,
      selectFirstChoice: false,
      initialValue: "now",
      showClearButton: true,
      value: "$time_start_maintenance$",
      el: $("#inputStartMaintenanceTime"),
    },
    {
      tokens: true,
    }
  ).render();

  // end time maintenance mode
  var inputEndMaintenanceTime = new DropdownView(
    {
      id: "inputEndMaintenanceTime",
      choices: [
        {
          value: "00:00",
          label: "12:00am",
        },
        {
          value: "00:30",
          label: "12:30am",
        },
        {
          value: "01:00",
          label: "01:00am",
        },
        {
          value: "01:30",
          label: "01:30am",
        },
        {
          value: "02:00",
          label: "02:00am",
        },
        {
          value: "02:30",
          label: "02:30am",
        },
        {
          value: "03:00",
          label: "03:00am",
        },
        {
          value: "03:30",
          label: "03:30am",
        },
        {
          value: "04:00",
          label: "04:00am",
        },
        {
          value: "04:30",
          label: "04:30am",
        },
        {
          value: "05:00",
          label: "05:00am",
        },
        {
          value: "05:30",
          label: "05:30am",
        },
        {
          value: "06:00",
          label: "06:00am",
        },
        {
          value: "06:30",
          label: "06:30am",
        },
        {
          value: "07:00",
          label: "07:00am",
        },
        {
          value: "07:30",
          label: "07:30am",
        },
        {
          value: "08:00",
          label: "08:00am",
        },
        {
          value: "08:30",
          label: "08:30am",
        },
        {
          value: "09:00",
          label: "09:00am",
        },
        {
          value: "09:30",
          label: "09:30am",
        },
        {
          value: "10:00",
          label: "10:00am",
        },
        {
          value: "10:30",
          label: "10:30am",
        },
        {
          value: "11:00",
          label: "11:00am",
        },
        {
          value: "11:30",
          label: "11:30am",
        },
        {
          value: "12:00",
          label: "12:00pm",
        },
        {
          value: "12:30",
          label: "12:30pm",
        },
        {
          value: "13:00",
          label: "01:00pm",
        },
        {
          value: "13:30",
          label: "01:30pm",
        },
        {
          value: "14:00",
          label: "02:00pm",
        },
        {
          value: "14:30",
          label: "02:30pm",
        },
        {
          value: "15:00",
          label: "03:00pm",
        },
        {
          value: "15:30",
          label: "03:30pm",
        },
        {
          value: "16:00",
          label: "04:00pm",
        },
        {
          value: "16:30",
          label: "04:30pm",
        },
        {
          value: "17:00",
          label: "05:00pm",
        },
        {
          value: "17:30",
          label: "05:30pm",
        },
        {
          value: "18:00",
          label: "06:00pm",
        },
        {
          value: "18:30",
          label: "06:30pm",
        },
        {
          value: "19:00",
          label: "07:00pm",
        },
        {
          value: "19:30",
          label: "07:30pm",
        },
        {
          value: "20:00",
          label: "08:00pm",
        },
        {
          value: "20:30",
          label: "08:30pm",
        },
        {
          value: "21:00",
          label: "09:00pm",
        },
        {
          value: "21:30",
          label: "09:30pm",
        },
        {
          value: "22:00",
          label: "10:00pm",
        },
        {
          value: "22:30",
          label: "10:30pm",
        },
        {
          value: "23:00",
          label: "11:00pm",
        },
        {
          value: "23:30",
          label: "11:30pm",
        },
      ],
      searchWhenChanged: true,
      selectFirstChoice: false,
      initialValue: "00:00",
      showClearButton: true,
      value: "$time_end_maintenance$",
      el: $("#inputEndMaintenanceTime"),
    },
    {
      tokens: true,
    }
  ).render();

  //
  // START LOGIC
  //

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

  //
  // Handle html textarea
  //

  $(".custom-textarea").each(function () {
    var $text_group = $(this);
    $text_group.find("textarea").on("click", function () {
      var $text = $(this);
      if (this.value == this.defaultValue) this.value = "";
      $(this).blur(function () {
        if (this.value == "") this.value = this.defaultValue;
      });
    });
  });

  function get_maintenance_mode() {
    // Manage buttons states dynamically

    //
    // Verify the current status
    //

    // Define the query
    var searchQuery =
      '| savedsearch "Verify trackMe alerting maintenance status" | eval maintenance_mode=if(now()<maintenance_mode_start AND maintenance_mode_end>now(), "scheduled", maintenance_mode)';

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
      var current_maintenance_mode;
      var current_time_updated;

      for (var i = 0; i < rows.length; i++) {
        var values = rows[i];

        for (var j = 0; j < values.length; j++) {
          var field = fields[j];

          if (fields[j] == "maintenance_mode") {
            current_maintenance_mode = values[j];
          }
          if (fields[j] == "time_updated") {
            current_time_updated = values[j];
          }
        }
      }

      if (!current_maintenance_mode) {
        $("#modal_loading_maintenance_mode_failure").modal();
        document.getElementById("btn_press_enable_maintenance").disabled = true;
        document.getElementById(
          "btn_press_disable_maintenance"
        ).disabled = true;
        return;
      }

      // Dynamically manage buttons states
      if (current_maintenance_mode == "disabled") {
        document.getElementById(
          "btn_press_disable_maintenance"
        ).disabled = true;
        document.getElementById(
          "btn_press_enable_maintenance"
        ).disabled = false;
      } else if (current_maintenance_mode == "scheduled") {
        document.getElementById(
          "btn_press_disable_maintenance"
        ).disabled = false;
        document.getElementById("btn_press_enable_maintenance").disabled = true;
      } else {
        document.getElementById(
          "btn_press_disable_maintenance"
        ).disabled = false;
        //document.getElementById('btn_press_enable_maintenance').disabled = true;
        $("#btn_press_enable_maintenance").html("Extend maintenance mode");
      }
    });
  }

  // get current status
  get_maintenance_mode();

  //
  // ENABLE MAINTENANCE MODE BUTTON
  //

  $("#btn_enable_maintenance").click(function () {
    var tokens = mvc.Components.get("default");

    // open modal
    $("#enable_maintenance_endtime").modal();

    // Disabled past selection
    $(function () {
      var dtToday = new Date();

      var month = dtToday.getMonth() + 1;
      var day = dtToday.getDate();
      var year = dtToday.getFullYear();
      if (month < 10) month = "0" + month.toString();
      if (day < 10) day = "0" + day.toString();

      var maxDate = year + "-" + month + "-" + day;

      // preset today's date
      document.getElementById("inputStartMaintenance").valueAsDate = new Date();

      // define minimal date that can be selected
      $("#inputEndMaintenance").attr("min", maxDate);
    });

    $("#btn_enable_maintenance_endtime").click(function () {
      var that = $(this);
      that.off("click"); // remove handler

      console.log("maintenance button clicked!");

      // Retrieve start date
      var inputStartMaintenance = document.getElementById(
        "inputStartMaintenance"
      ).value;

      // Retrieve start time
      var inputStartMaintenanceTime = tokens.get("time_start_maintenance");

      // Retrieve end date
      var inputEndMaintenance = document.getElementById(
        "inputEndMaintenance"
      ).value;

      // Retrieve end time
      var inputEndMaintenanceTime = tokens.get("time_end_maintenance");

      console.log("checking entries");
      console.log("inputStartMaintenance is: " + inputStartMaintenance);
      console.log("inputStartMaintenanceTime is: " + inputStartMaintenanceTime);
      console.log("inputEndMaintenance is: " + inputEndMaintenance);
      console.log("inputEndMaintenanceTime is: " + inputEndMaintenanceTime);

      // Validation submitted with no date entry
      if (
        !inputStartMaintenance ||
        inputStartMaintenance == "YYYY-MM-DD" ||
        !inputStartMaintenanceTime ||
        !inputEndMaintenance ||
        inputEndMaintenance == "YYYY-MM-DD" ||
        !inputEndMaintenanceTime
      ) {
        $("#maintenance_mode_data_is_invalid").modal();
        return;
      }

      console.log("entries check ended");

      if (inputStartMaintenance && inputEndMaintenance) {
        // Retrieve update comment if any
        var tk_comment = document.getElementById("input_enable_comment").value;

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
          document.getElementById("input_enable_comment").value = "update note";
        } else if (tk_comment == "update note") {
          tk_comment = "No comment for update.";
          document.getElementById("input_enable_comment").value = "update note";
        } else {
          // replace the textarea for modification requests
          document.getElementById("input_enable_comment").value = "update note";
        }

        //
        // Verify that the end date selection is not in the past time
        //

        // Define the query
        var searchQuery =
          '| makeresults | eval start_date="' +
          inputStartMaintenance +
          '", start_time="' +
          inputStartMaintenanceTime +
          '", end_date="' +
          inputEndMaintenance +
          '", end_time="' +
          inputEndMaintenanceTime +
          '" | eval maintenance_mode_start=start_date . " " . start_time, maintenance_mode_end=end_date . " " . end_time | eval maintenance_mode_start=round(strptime(maintenance_mode_start, "%Y-%m-%d %H:%M"), 0), maintenance_mode_end=round(strptime(maintenance_mode_end, "%Y-%m-%d %H:%M"), 0), now=now() | eval is_invalid=case(now>=maintenance_mode_end, "true", maintenance_mode_start>maintenance_mode_end, "true", maintenance_mode_end>now, "false") | fields - _time | fields is_invalid';

        // Set the search parameters--specify a time range
        var searchParams = {
          earliest_time: "-60m",
          latest_time: "now",
        };

        // Run a oneshot search that returns the job's results

        service.oneshotSearch(
          searchQuery,
          searchParams,
          function (err, results) {
            // Display the results
            var fields = results.fields;
            var rows = results.rows;
            var is_in_the_past;

            for (var i = 0; i < rows.length; i++) {
              var values = rows[i];

              for (var j = 0; j < values.length; j++) {
                var field = fields[j];

                if (fields[j] == "is_invalid") {
                  is_invalid = values[j];
                }
              }
            }

            if (is_invalid === "true") {
              $("#maintenance_mode_date_is_invalid").modal();
              return;
            } else {
              if (inputStartMaintenanceTime == "now") {
                var searchQuery =
                  '| makeresults | eval maintenance_mode="enabled", time_updated=now(), end_date="' +
                  inputEndMaintenance +
                  '", end_time="' +
                  inputEndMaintenanceTime +
                  '" | eval maintenance_mode_end=end_date . " " . end_time | eval maintenance_mode_end=round(strptime(maintenance_mode_end, "%Y-%m-%d %H:%M"), 0) | fields - _time | fields maintenance_mode, time_updated, maintenance_mode_end | outputlookup trackme_maintenance_mode';
              } else {
                var searchQuery =
                  '| makeresults | eval maintenance_mode="disabled", time_updated=now(), start_date="' +
                  inputStartMaintenance +
                  '", start_time="' +
                  inputStartMaintenanceTime +
                  '", end_date="' +
                  inputEndMaintenance +
                  '", end_time="' +
                  inputEndMaintenanceTime +
                  '" | eval maintenance_mode_start=start_date . " " . start_time, maintenance_mode_end=end_date . " " . end_time | eval maintenance_mode_start=round(strptime(maintenance_mode_start, "%Y-%m-%d %H:%M"), 0), maintenance_mode_end=round(strptime(maintenance_mode_end, "%Y-%m-%d %H:%M"), 0) | fields - _time | fields maintenance_mode, time_updated, maintenance_mode_start, maintenance_mode_end | eval maintenance_mode=if(now()>=maintenance_mode_start AND maintenance_mode_end>now(), "enabled", maintenance_mode) | outputlookup trackme_maintenance_mode';
              }

              // Set the search parameters--specify a time range
              var searchParams = {
                earliest_time: "-60m",
                latest_time: "now",
              };

              console.log("searchQuery is: " + searchQuery);

              // Update the collection
              service.search(searchQuery, searchParams, function (err, job) {
                // Poll the status of the search job
                job.track(
                  {
                    period: 200,
                  },
                  {
                    done: function (job) {
                      // Update single
                      search_maintenance_mode_mainsearch.startSearch();
                      search_maintenance_state.startSearch();

                      // Audit
                      action = "success";
                      change_type = "enable";
                      object = "maintenance_mode";
                      object_category = "all";
                      object_attrs =
                        "The maintenance mode has been enabled or extended starting " +
                        inputStartMaintenance +
                        " " +
                        inputStartMaintenanceTime +
                        " until " +
                        inputEndMaintenance +
                        " " +
                        inputEndMaintenanceTime +
                        ". No more alerts will trigger as long as the maintenance mode is enabled";
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

                      //
                      // Verify the current status and update buttons state
                      //

                      // Define the query
                      var searchQuery =
                        '| inputlookup trackme_maintenance_mode | eval maintenance_mode=if(now()<maintenance_mode_start AND maintenance_mode_end>now(), "scheduled", maintenance_mode)';

                      // Set the search parameters--specify a time range
                      var searchParams = {
                        earliest_time: "-60m",
                        latest_time: "now",
                      };

                      // Run a oneshot search that returns the job's results
                      service.oneshotSearch(
                        searchQuery,
                        searchParams,
                        function (err, results) {
                          // Display the results
                          var fields = results.fields;
                          var rows = results.rows;
                          var current_maintenance_mode;
                          var current_time_updated;

                          for (var i = 0; i < rows.length; i++) {
                            var values = rows[i];

                            for (var j = 0; j < values.length; j++) {
                              var field = fields[j];

                              if (fields[j] == "maintenance_mode") {
                                current_maintenance_mode = values[j];
                              }
                              if (fields[j] == "time_updated") {
                                current_time_updated = values[j];
                              }
                            }
                          }

                          if (!current_maintenance_mode) {
                            $(
                              "#modal_loading_maintenance_mode_failure"
                            ).modal();
                            document.getElementById(
                              "btn_press_enable_maintenance"
                            ).disabled = true;
                            document.getElementById(
                              "btn_press_disable_maintenance"
                            ).disabled = true;
                            return;
                          }

                          // Dynamically manage buttons states
                          if (current_maintenance_mode == "disabled") {
                            document.getElementById(
                              "btn_press_disable_maintenance"
                            ).disabled = true;
                            document.getElementById(
                              "btn_press_enable_maintenance"
                            ).disabled = false;
                          } else if (current_maintenance_mode == "scheduled") {
                            document.getElementById(
                              "btn_press_disable_maintenance"
                            ).disabled = false;
                            document.getElementById(
                              "btn_press_enable_maintenance"
                            ).disabled = true;
                          } else {
                            document.getElementById(
                              "btn_press_disable_maintenance"
                            ).disabled = false;
                            //document.getElementById('btn_press_enable_maintenance').disabled = true;
                            $("#btn_press_enable_maintenance").html(
                              "Extend maintenance mode"
                            );
                          }
                        }
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
                        errorStr = JSON.stringify(
                          properties._properties.messages
                        );
                      }

                      // Audit
                      action = "failure";
                      change_type = "enable";
                      object = "maintenance_mode";
                      object_category = "all";
                      object_attrs =
                        "The maintenance mode has been enabled or extended starting " +
                        inputStartMaintenance +
                        " " +
                        inputStartMaintenanceTime +
                        " until " +
                        inputEndMaintenance +
                        " " +
                        inputEndMaintenanceTime +
                        ". No more alerts will trigger as long as the maintenance mode is enabled";
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
                        .text(errorStr);
                      $("#modal_update_collection_failure_return").modal();
                    },
                    error: function (err) {
                      done(err);

                      // Audit
                      action = "failure";
                      change_type = "enable";
                      object = "maintenance_mode";
                      object_category = "all";
                      object_attrs =
                        "The maintenance mode has been enabled or extended starting " +
                        inputStartMaintenance +
                        " " +
                        inputStartMaintenanceTime +
                        " until " +
                        inputEndMaintenance +
                        " " +
                        inputEndMaintenanceTime +
                        ". No more alerts will trigger as long as the maintenance mode is enabled";
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

                      $("#modal_maintenance_mode_failure").modal();
                    },
                  }
                );
              });

              // Clear date inputs
              $("input[type=date]").val("");

              // Show confirmed modal

              if (inputStartMaintenanceTime == "now") {
                $("#modal_maintenance_mode_confirmed").modal();
              } else {
                $("#modal_maintenance_mode_scheduled").modal();
              }
            }
          }
        );
      }

      // end modal calendar selection
    });
  });

  //
  // DISABLE MAINTENANCE MODE BUTTON
  //

  $("#btn_disable_maintenance").click(function () {
    var tokens = mvc.Components.get("default");
    // open modal
    $("#disabled_maintenance_confirmation").modal();

    $("#btn_disable_maintenance_confirmation").click(function () {
      var that = $(this);
      that.off("click"); // remove handler

      // Retrieve update comment if any
      var tk_comment = document.getElementById("input_disable_comment").value;

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
        document.getElementById("input_enable_comment").value = "update note";
      } else if (tk_comment == "update note") {
        tk_comment = "No comment for update.";
        document.getElementById("input_enable_comment").value = "update note";
      } else {
        // replace the textarea for modification requests
        document.getElementById("input_enable_comment").value = "update note";
      }

      var searchQuery =
        '| makeresults | eval maintenance_mode="disabled", time_updated=now(), maintenance_mode_end="" | fields - _time | outputlookup trackme_maintenance_mode';

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-60m",
        latest_time: "now",
      };

      // Update the collection
      service.search(searchQuery, searchParams, function (err, job) {
        // Poll the status of the search job
        job.track(
          {
            period: 200,
          },
          {
            done: function (job) {
              // Update single
              search_maintenance_mode_mainsearch.startSearch();
              search_maintenance_state.startSearch();

              // Audit
              action = "success";
              change_type = "disable";
              object = "maintenance_mode";
              object_category = "all";
              object_attrs =
                "Maintenance mode was disabled. Any active alert will now fire as usual.";
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

              // buttons states
              document.getElementById(
                "btn_press_disable_maintenance"
              ).disabled = true;
              document.getElementById(
                "btn_press_enable_maintenance"
              ).disabled = false;
              $("#btn_press_enable_maintenance").html(
                "Enable maintenance mode"
              );

              // Show final modal
              $("#modal_maintenance_mode_disabled").modal();
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
              change_type = "disable";
              object = "maintenance_mode";
              object_category = "all";
              object_attrs =
                "Maintenance mode was disabled. Any active alert will now fire as usual.";
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
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);

              // Audit
              action = "failure";
              change_type = "disable";
              object = "maintenance_mode";
              object_category = "all";
              object_attrs =
                "Maintenance mode was disabled. Any active alert will now fire as usual.";
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

              $("#modal_maintenance_mode_failure").modal();
            },
          }
        );
      });
    });
  });

  //
  // END
  //
});
