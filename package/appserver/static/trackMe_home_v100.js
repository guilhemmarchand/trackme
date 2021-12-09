const { Callbacks } = require("jquery");

require([
  "jquery",
  "underscore",
  "splunkjs/mvc",
  "splunkjs/mvc/utils",
  "splunkjs/mvc/tokenutils",
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
  "splunkjs/mvc/simpleform/input/linklist",
  "splunkjs/mvc/simpleform/input/text",
  "splunkjs/mvc/simpleform/input/timerange",
  "splunkjs/mvc/simpleform/input/multiselect",
  "splunkjs/mvc/simpleform/input/dropdown",
  "splunkjs/mvc/simplexml/element/table",
  "splunkjs/mvc/simplexml/element/single",
  "splunkjs/mvc/simpleform/formutils",
  "splunkjs/mvc/simplexml/eventhandler",
  "splunkjs/mvc/simplexml/searcheventhandler",
  "splunkjs/mvc/simplexml/urltokenmodel",
  "splunkjs/mvc/simplexml/ready!",
], function (
  $,
  _,
  mvc,
  utils,
  TokenUtils,
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
  VisualizationRegistry,
  LinkListInput,
  TextInput,
  TimeRangeInput,
  MultiSelectInput,
  DropdownInput,
  TableElement,
  SingleElement,
  FormUtils,
  EventHandler,
  SearchEventHandler,
  UrlTokenModel
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
  // cssloader
  //

  function cssloader(msg) {
    $("#cssloader").remove();
    $("body").append(
      '<div id="cssloader" class="loader loader-default is-active" data-text="' +
        msg +
        '"></div>'
    );
  }

  function cssloaderremove() {
    $("#cssloader").remove();
  }

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

  //
  // Notification
  //

  function notification(s, time) {

    $("<p>" + s + "</p>").appendTo('#boxnotify-data-source').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-data-host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-metric-host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-unified-data-source').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-unified-data-source-autolag').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-unified-data-host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-unified-data-host-autolag').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-unified-metric-host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_source_whitelist').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_host_whitelist').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_metric_host_whitelist').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_source_blacklist_host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_source_blacklist_index').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_source_blacklist_sourcetype').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_source_blacklist_data_name').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_host_blacklist_host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_host_blacklist_index').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_metric_host_blacklist_host').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_metric_host_blacklist_index').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_data_host_blacklist_sourcetype').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modal_modify_metric_host_blacklist_metric_category').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modify_custom_lagging').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-data-source-outliers-update').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-data-host-outliers-update').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-add_elastic_source').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-add_data_sampling_custom_rule').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });  
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-view_data_sampling_custom_rule').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-manage_data_sampling').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-manage_tags').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-add_tags_policies').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modify_elastic_sources').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
    $("<p>" + s + "</p>").appendTo('#boxnotify-modify_elastic_sources_dedicated').fadeTo(time, 1, function() {
      $(this).fadeTo(1000, 0, function() {
        $(this).remove()
      });
    });
  
  }  

  // Returns true if numeric
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n > 0;
  }

  // Escape double quotes
  function escapeDoubleQuotes(str) {
    return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
  }

  // generate a unique ID
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Audit record
  function auditRecord(action, change_type, object, object_category, object_attrs, result, comment) {

    // Audit changes
    var tokens = mvc.Components.get("default");
    var currentUser = Splunk.util.getConfigValue("USERNAME");
    tokens.set("currentUser", currentUser);
    var auditendpoint_URl = "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_audit_changes/"

    var time = (new Date).getTime();
    var audit_record = {
        "time": time,
        "action": action,
        "user": currentUser,
        "change_type": change_type,
        "object": object,
        "object_category": object_category,
        "object_attrs": object_attrs,
        "result": result,
        "comment": comment
    };
    $.ajax({
        url: auditendpoint_URl,
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(audit_record),
        success: function(returneddata) {
            // Run the search again to update the table
        }
    });

  }

  // render custom table emoji icons
  function renderTableIcon(element) {
    var CustomIconRenderer = TableView.BaseCellRenderer.extend({
      canRender: function (cell) {
        if (typeof cell.value === "string") {
          return cell.value && cell.value.substr(0, 5) === "icon|";
        }
      },
      render: function ($td, cell) {
        var parts = cell.value.split("|");

        // green
        if (parts[1] === "ico_good ico_small") {
          $td.css({ "text-align": "center" }).html("<div>🟢</div>");
        }
        // red
        else if (parts[1] === "ico_error ico_small") {
          $td.css({ "text-align": "center" }).html("<div>🔴</div>");
        }
        // orange
        else if (parts[1] === "ico_warn ico_small") {
          $td.css({ "text-align": "center" }).html("<div>🟠</div>");
        }
        // blue
        else if (parts[1] === "ico_unknown ico_small") {
          $td.css({ "text-align": "center" }).html("<div>🔵</div>");
        }
        // Ack
        else if (parts[1] === "ico_ack ico_small") {
          $td.css({ "text-align": "center" }).html("<div>👀 🔴</div>");
        }
        if (parts.length > 3) {
          $td.attr("title", parts[3]);
        }
      },
    });

    element.addCellRenderer(new CustomIconRenderer());
  }

  // render custom table checkbox
  function renderTableCheckBox(element, tokenName) {

    selected_values_array = [];

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
      canRender: function(cell) {
          return _(['select']).contains(cell.field);
      },
      render: function($td, cell) {
          var a = $('<div>').attr({"id":"chk-allowlist-data-source"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
              //console.log("checked",$(this).attr('class'));
              //console.log("checked",$(this).attr('value'));
              if($(this).attr('class')==="checkbox")
              {
                  selected_values_array.push($(this).attr('value'));
                  $(this).removeClass();
                  $(this).addClass("checkbox checked");
              }
              else {
                  $(this).removeClass();
                  $(this).addClass("checkbox");
                  var i = selected_values_array.indexOf($(this).attr('value'));
                  if(i != -1) {
                      selected_values_array.splice(i, 1);
                  }
              }
              //console.log(selected_values_array);
              tokens.set(tokenName, selected_values_array.join());
              //submittedTokens.set(tokens.toJSON());
          }).appendTo($td);
        }
    });

    //List of table IDs
    var tableIDs = [element];
    for (i=0;i<tableIDs.length;i++) {
        var sh = mvc.Components.get(tableIDs[i]);
        if(typeof(sh)!="undefined") {
            sh.getVisualization(function(tableView) {
                // Add custom cell renderer and force re-render
                tableView.table.addCellRenderer(new CustomRangeRenderer());
                tableView.table.render();
            });
        }
    }

  }

  // handle multiselect all selection in a enhanced way
  function multiselectAll(element) {
    var values = element.val();
    // I assume the default multiselect value will be the first (hardcoded) choice
    // Like <choice value="*">All</choice>
    // If there is no hardcoded choice, then .options.choices[0] won't exist...
    var first_choice_value = element.options.choices[0].value;
    // If the user removed everything then add the first choice "All" back
    if (values.length === 0) {
      element.val([first_choice_value]);
    }
    // If the user choose something else then remove the first choice "All" (if it's there)
    else if (values.indexOf(first_choice_value) >= 0 && values.length > 1) {
      element.val(_.without(values, first_choice_value));
    }
  }

  //
  // Various
  //

  //
  // Handle search elements
  //

  $(".view-elements").hover(
    function () {
      var divid = "#" + this.id;
      var childdiv = "#resultsLink" + this.id;
      $(childdiv).attr("style", "display:block !important");
    },
    function () {
      var childdiv = "#resultsLink" + this.id;

      $(childdiv).hover(
        function () {
          $(childdiv).attr("style", "display:block !important");
        },
        function () {
          $(childdiv).attr("style", "display:block !none");
        }
      );

      $(childdiv).attr("style", "display:block !none");
    }
  );

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

  //
  // SERVICE OBJECT
  //

  // Create a service object using the Splunk SDK for JavaScript
  // to send REST requests
  var service = mvc.createService({
    owner: "nobody",
  });

  //
  // VIZ
  //

  // semicircle donut custom viz
  var semiCircleDonut = VisualizationRegistry.getVisualizer(
    "semicircle_donut",
    "semicircle_donut"
  );

  //
  // SPLUNK INPUTS
  //

  var inputDataNameFilterMode = new DropdownInput(
    {
      id: "inputDataNameFilterMode",
      choices: [
        {
          label: "Includes",
          value: "",
        },
        {
          label: "Excludes",
          value: "NOT",
        },
      ],
      searchWhenChanged: true,
      default: "",
      showClearButton: true,
      initialValue: "",
      selectFirstChoice: false,
      value: "$form.inputDataNameFilterMode$",
      el: $("#inputDataNameFilterMode"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataNameFilterMode.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataNameFilterMode);
  });

  var inputDataNameFilter = new TextInput(
    {
      id: "inputDataNameFilter",
      searchWhenChanged: true,
      prefix: 'data_name="*',
      suffix: '*"',
      initialValue: "*",
      value: "$form.inputDataNameFilter$",
      el: $("#inputDataNameFilter"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataNameFilter.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataNameFilter);
  });

  var inputTags = new MultiSelectInput(
    {
      id: "inputTags",
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "tags",
      valuePrefix: 'tags="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "tags",
      value: "$form.inputTags$",
      managerid: "searchPopulateDataSourcesTags",
      el: $("#inputTags"),
    },
    {
      tokens: true,
    }
  ).render();

  inputTags.on("change", function (newValue) {
    FormUtils.handleValueChange(inputTags);
    multiselectAll(inputTags);
  });

  var inputDataName = new MultiSelectInput(
    {
      id: "inputDataName",
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "data_name",
      valuePrefix: 'data_name="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "data_name",
      value: "$form.inputDataName$",
      managerid: "searchPopulateDataSources",
      el: $("#inputDataName"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataName.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataName);
    multiselectAll(inputDataName);
  });

  var inputDataIndex = new MultiSelectInput(
    {
      id: "inputDataIndex",
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "data_index",
      valuePrefix: 'data_index="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "data_index",
      value: "$form.inputDataIndex$",
      managerid: "searchPopulateDataSourcesIndexes",
      el: $("#inputDataIndex"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataIndex.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataIndex);
    multiselectAll(inputDataIndex);
  });

  var inputDataSourcetype = new MultiSelectInput(
    {
      id: "inputDataSourcetype",
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "data_sourcetype",
      valuePrefix: 'data_sourcetype="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "data_sourcetype",
      value: "$form.inputDataSourcetype$",
      managerid: "searchPopulateDataSourcesSourcetypes",
      el: $("#inputDataSourcetype"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataSourcetype.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataSourcetype);
    multiselectAll(inputDataSourcetype);
  });

  var inputDataSourceState = new MultiSelectInput(
    {
      id: "inputDataSourceState",
      choices: [
        { label: "ALL", value: "*" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
        { label: "Orange", value: "orange" },
        { label: "Red", value: "red" },
      ],
      valuePrefix: 'data_source_state="',
      valueSuffix: '"',
      delimiter: " OR ",
      searchWhenChanged: true,
      initialValue: ["*"],
      value: "$form.data_source_state$",
      el: $("#inputDataSourceState"),
    },
    { tokens: true }
  ).render();

  inputDataSourceState.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataSourceState);
    multiselectAll(inputDataSourceState);
  });

  var inputDataMonitoredState = new DropdownInput(
    {
      id: "inputDataMonitoredState",
      choices: [
        {
          label: "ALL",
          value: "*",
        },
        {
          label: "Enabled",
          value: "enabled",
        },
        {
          label: "Disabled",
          value: "disabled",
        },
      ],
      searchWhenChanged: true,
      default: "enabled",
      showClearButton: true,
      prefix: 'data_monitored_state="',
      suffix: '"',
      initialValue: "enabled",
      selectFirstChoice: false,
      value: "$form.data_monitored_state$",
      el: $("#inputDataMonitoredState"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataMonitoredState.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataMonitoredState);
  });

  var inputDataPriority = new MultiSelectInput(
    {
      id: "inputDataPriority",
      choices: [
        { label: "ALL", value: "*" },
        { label: "low", value: "low" },
        { label: "medium", value: "medium" },
        { label: "high", value: "high" },
      ],
      valuePrefix: 'priority="',
      valueSuffix: '"',
      delimiter: " OR ",
      searchWhenChanged: true,
      initialValue: ["*"],
      value: "$form.inputDataPriority$",
      el: $("#inputDataPriority"),
    },
    { tokens: true }
  ).render();

  inputDataPriority.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataPriority);
    multiselectAll(inputDataPriority);
  });

  var refreshForm = new DropdownInput(
    {
      id: "refreshForm",
      choices: [
        {
          value: "60",
          label: "1 min",
        },
        {
          value: "120",
          label: "2 min",
        },
        {
          value: "300",
          label: "5 min",
        },
        {
          value: "3600",
          label: "none",
        },
      ],
      selectFirstChoice: false,
      default: "300",
      showClearButton: true,
      initialValue: "300",
      searchWhenChanged: true,
      value: "$refresh$",
      el: $("#refreshForm"),
    },
    {
      tokens: true,
    }
  ).render();

  refreshForm.on("change", function (newValue) {
    FormUtils.handleValueChange(refreshForm);
  });

  //
  // SPLUNK SEARCHES
  //

  //
  // SEARCH MANAGERS
  //

  //
  // ALERT SUMMARY
  //

  var search_alerts_main_table = new SearchManager(
    {
      id: "search_alerts_main_table",
      sample_ratio: 1,
      earliest_time: "-15m",
      cancelOnUnload: true,
      search:
        '| rest splunk_server=local /servicesNS/nobody/trackme/saved/searches | search eai:acl.app="trackme" alert.track=1 title!="TrackMe - Audit change notification tracker" | fields title, cron_schedule, schedule_window, alert.suppress.fields, alert.suppress.period, disabled, next_scheduled_time, id, actions | rex field=id "saved/searches/(?<id>.*)" | sort limit=0 title | eval " " = "icon|" + if(disabled=="0","ico_good ico_small|icon-check|Up", "ico_error ico_small|icon-close|Down")',
      latest_time: "now",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  //search_alerts_main_table.on("search:done", function () {
  // function here
  //  $("#cssloader").remove();
  //});

  var searchPopulateAlertActionsAck = new SearchManager(
    {
      id: "searchPopulateAlertActionsAck",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '(index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_auto_ack" search_name="$tk_alert_title$" response_data=* | rex "\\"object\\":\\s\\"(?<object>[^\\"]*)" | stats count by object | sort limit=10000 object',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts_auto_ack$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateAlertActionsSmartStatus = new SearchManager(
    {
      id: "searchPopulateAlertActionsSmartStatus",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '(index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_smart_status" search_name="$tk_alert_title$" object_name=* | rex "object_name=(?<object>[^\\"]*)" | stats count by object | sort limit=10000 object',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts_smart_status$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateAlertActionsFreeStyle = new SearchManager(
    {
      id: "searchPopulateAlertActionsFreeStyle",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '(index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_free_style_rest_call" search_name="$tk_alert_title$" | rex "\\"(?:data_name|data_host|metric_host)\\":\\s\\"(?<object>[^\\"]*)" | stats count by object | sort limit=10000 object',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts_free_style$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleEnabledAlerts = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "where disabled=0 | stats c",
      managerid: "search_alerts_main_table",
      id: "searchSingleEnabledAlerts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDonutAlertsTriggered = new SearchManager(
    {
      id: "searchDonutAlertsTriggered",
      sample_ratio: 1,
      earliest_time: "-24h",
      cancelOnUnload: true,
      search:
        'index=_audit action="alert_fired" ss_app="trackme" ss_name!="TrackMe - Audit change notification tracker" | stats count by ss_name',
      latest_time: "now",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchDonutAlertsTriggered",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "set",
            token: "show_no_alerts",
            value: "True",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "unset",
            token: "show_no_alerts",
          },
        ],
      },
    ],
  });

  var searchAlertTriggeredOverTime = new SearchManager(
    {
      id: "searchAlertTriggeredOverTime",
      sample_ratio: 1,
      earliest_time: "-24h",
      cancelOnUnload: true,
      search:
        'index=_audit action="alert_fired" ss_app="trackme" ss_name!="TrackMe - Audit change notification tracker" | timechart minspan=5m bins=1000 count by ss_name',
      latest_time: "now",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAlertTriggeredOverTimePerAlert = new SearchManager(
    {
      id: "searchAlertTriggeredOverTimePerAlert",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        'index=_audit action="alert_fired" ss_app="trackme" ss_name="$tk_alert_title$" | timechart span=$showAlertsTime.span$ count by ss_name',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
        depends: "$show_alerts_activity$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAlertActionsTriggeredOverTimePerAlert = new SearchManager(
    {
      id: "searchAlertActionsTriggeredOverTimePerAlert",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '( (index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_auto_ack" search_name="$tk_alert_title$" response_data ) OR ( (index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_free_style_rest_call" search_name="$tk_alert_title$" "TrackMe REST call was successfull" ) OR ( (index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_smart_status" search_name="$tk_alert_title$" "Smart Status result successfully" ) | timechart span=$showAlertsTime.span$ count by sourcetype',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
        depends: "$show_alerts_activity$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAlertActionsAckEventsOverTimePerAlert = new SearchManager(
    {
      id: "searchAlertActionsAckEventsOverTimePerAlert",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '(index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_auto_ack" search_name="$tk_alert_title$" response_data=* | rex "response_data=(?<json>\\{[^\\}]*\\})" | rename json as _raw | spath | search $tk_input_alert_actions_ack$',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
        depends: "$show_alerts_auto_ack$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAlertActionsSmartStatusdEventsOverTimePerAlert = new SearchManager(
    {
      id: "searchAlertActionsSmartStatusdEventsOverTimePerAlert",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '`trackme_idx` (sourcetype=trackme_smart_status) | rex "\\"_raw\\":\\s(?<json>{[^\\}]*})" | rename json as _raw | eval object=coalesce(\'raw.data_name\', \'raw.data_host\', \'raw.metric_host\') | search $tk_input_alert_actions_smart_status$ | search [ search (index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_smart_status" search_name="$tk_alert_title$" object_name=* | rex "object_name=(?<object>[^\\"]*)" | search $tk_input_alert_actions_smart_status$ | stats count by object | sort limit=10000 object | fields object ] | `trackme_smart_status_emoji`',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
        depends: "$show_alerts_smart_status$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAlertActionsFreeStyleEventsOverTimePerAlert = new SearchManager(
    {
      id: "searchAlertActionsFreeStyleEventsOverTimePerAlert",
      sample_ratio: 1,
      earliest_time: "$showAlertsTime.earliest$",
      cancelOnUnload: true,
      search:
        '`trackme_idx` (sourcetype=trackme_alert_action) | rex "\\"(?:data_name|data_host|metric_host)\\":\\s\\"(?<object>[^\\"]*)" | search $tk_input_alert_actions_free_style$ | search [ search (index="_internal" OR index="cim_modactions") sourcetype="modular_alerts:trackme_free_style_rest_call" search_name="$tk_alert_title$" | rex "\\"(?:data_name|data_host|metric_host)\\":\\s\\"(?<object>[^\\"]*)" | search $tk_input_alert_actions_free_style$ | stats count by object | sort limit=10000 object | fields object ]',
      latest_time: "$showAlertsTime.latest$",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
        depends: "$show_alerts_free_style$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var search_alerts_triggered_history = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "stats sum(count) as count | append [ | makeresults | eval count=0 | fields - _time ] | head 1",
      managerid: "searchDonutAlertsTriggered",
      id: "search_alerts_triggered_history",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var search_alerts_get_tags = new SearchManager(
    {
      id: "search_alerts_get_tags",
      sample_ratio: 1,
      earliest_time: "-15m",
      cancelOnUnload: true,
      search:
        '| inputlookup trackme_data_source_monitoring | eval tags=if(match(tags, "click on Update tags"), "", tags) | makemv delim="," tags | mvexpand tags | where tags!="" | stats values(tags) as tags | mvexpand tags | dedup tags | sort limit=1000 tags',
      latest_time: "now",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_alerts$",
        depends: "$start_get_tags_for_custom_alert$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // data sampling dropdown
  var searchPopulateDataSampling = new SearchManager(
    {
      id: "searchPopulateDataSampling",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| inputlookup trackme_data_sampling | eval key=_key | fields key, data_name | sort 0 data_name",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$start_search_input_data_sampling_dropdown$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // whitelist

  // whitelist data_source

  var searchPopulateIndexesForWhiteListDataSource = new SearchManager(
    {
      id: "searchPopulateIndexesForWhiteListDataSource",
      earliest_time: "$modalTimeWhiteListDataSource.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeWhiteListDataSource.latest$",
      search:
        "| `trackme_tstats` count where index=* by index | lookup trackme_data_source_monitoring_whitelist_index data_index as index OUTPUT data_index as FOUND | where isnull(FOUND) | sort limit=0 index | fields index",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$start_modify_data_source_whitelist$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist metric_category

  var searchPopulateMetricCategoriesForBlackListMetricHost = new SearchManager(
    {
      id: "searchPopulateMetricCategoriesForBlackListMetricHost",
      earliest_time: "$modalTimeBlackListMetricHost.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeBlackListMetricHost.latest$",
      search:
        '| mcatalog values(metric_name) as metrics where index=* `trackme_mstats_main_filter` | rename metrics as metric_name | mvexpand metric_name | rex field=metric_name "(?<metric_category>[^.]*).{0,1}"  | stats count by metric_category | fields metric_category | lookup trackme_metric_host_monitoring_blacklist_metric_category metric_category | where isnull(metric_blacklist_state) | sort limit=0 metric_category',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
        depends: "$start_modify_metric_host_blacklist_metric_category$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // whitelist data_host

  var searchPopulateIndexesForWhiteListDataHost = new SearchManager(
    {
      id: "searchPopulateIndexesForWhiteListDataHost",
      earliest_time: "$modalTimeWhiteListDataHost.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeWhiteListDataHost.latest$",
      search:
        "| `trackme_tstats` count where (index=* OR index=_internal) by index | lookup trackme_data_host_monitoring_whitelist_index data_index as index OUTPUT data_index as FOUND | where isnull(FOUND) | sort limit=0 index | fields index",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
        depends: "$start_modify_data_host_whitelist$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // whitelist metric_host

  var searchPopulateIndexesForWhiteListMetricHost = new SearchManager(
    {
      id: "searchPopulateIndexesForWhiteListMetricHost",
      earliest_time: "$modalTimeWhiteListMetricHost.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeWhiteListMetricHost.latest$",
      search:
        "| mcatalog values(metric_name) as metrics where (index=* OR index=_*) by index | rename metrics as metric_name | stats values(index) as index | mvexpand index | lookup trackme_metric_host_monitoring_whitelist_index metric_index as index OUTPUT metric_index as FOUND | where isnull(FOUND) | sort limit=0 index | fields index",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
        depends: "$start_modify_metric_host_whitelist$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // data sources monitoring

  var searchDataSourcesMain = new SearchManager(
    {
      id: "searchDataSourcesMain",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      refresh: "$refresh$",
      latest_time: "+5m",
      search:
        '| inputlookup trackme_data_source_monitoring\n| eval keyid=_key\n| `apply_data_source_blacklists`\n| search `trackme_get_idx_whitelist_searchtime(trackme_data_source_monitoring_whitelist_index, data_index)`\n| `trackme_eval_data_source_state`\n| `trackme_default_priority`\n| `trackme_date_format(data_last_time_seen)`\n| `trackme_date_format(data_last_time_seen_idx)`\n| `trackme_date_format(data_last_ingest)`\n| fillnull value="red" data_source_state\n| sort 0 data_source\n| `trackme_eval_icons`\n| search $inputDataNameFilterMode$ ($inputDataNameFilter$)\n| search `trackme_get_idx_whitelist_searchtime(trackme_data_source_monitoring_whitelist_index, data_index)`\n| `apply_data_source_blacklists`\n| rex field=tags mode=sed "s/,/ \\/ /g"\n| fillnull value="No tags defined, click on Update tags to define one or more tags to be associated with this data source." tags',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  searchDataSourcesMain.on("search:done", function () {
    // stop the cssloader
    $("#cssloader").remove();
  });

  var searchDataSourcesPostTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'makemv delim=" / " tags | search $inputDataName$ $inputDataIndex$ $inputDataSourcetype$ $inputTags$ $data_source_state$ $data_monitored_state$ $inputDataPriority$\n| fillnull data_last_lag_seen, data_last_ingestion_lag_seen\n| eval data_last_lag_seen=round(data_last_lag_seen, 0) | eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0) | fillnull value="N/A" data_last_lag_seen, data_last_ingestion_lag_seen\n| eval "lag (event / ingestion)" = if(data_last_lag_seen>60, tostring(data_last_lag_seen, "duration"), data_last_lag_seen . " sec") . " / " . if(data_last_ingestion_lag_seen>60, tostring(data_last_ingestion_lag_seen, "duration"), data_last_ingestion_lag_seen . " sec")\n| rename "data_last_time_seen (translated)" as "last time", "data_last_ingest (translated)" as "last ingest", "data_last_time_seen_idx (translated)" as "last time idx"\n| eval data_tracker_runtime=now()\n| `trackme_date_format("latest_flip_time")`\n| fillnull value="N/A" latest_flip_state, latest_flip_time, "latest_flip_time (translated)"\n| `trackme_get_identity_card(data_name)`\n| `trackme_lookup_elastic_sources`\n| `trackme_ack_lookup_main(data_name)`\n| `trackme_lookup_data_sampling`\n| nomv tags\n| sort limit=10000 data_name',
      managerid: "searchDataSourcesMain",
      id: "searchDataSourcesPostTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDataSourcesMainStats = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'search $inputDataName$ $inputDataIndex$ $inputDataSourcetype$ | stats count as total, count(eval(data_monitored_state="disabled")) as total_disabled, count(eval(data_source_state!="green" AND data_source_state!="info" AND data_monitored_state="enabled")) as total_in_alert, count(eval(data_source_state="red" AND priority="high" AND data_monitored_state="enabled")) as total_high_priority_red, count(eval(data_monitored_state="enabled" AND priority="low")) as low_enabled, count(eval(data_monitored_state="enabled" AND priority="medium")) as medium_enabled, count(eval(data_monitored_state="enabled" AND priority="high")) as high_enabled, count(eval(data_source_state="blue" AND data_monitored_state="enabled")) as "blue", count(eval(data_source_state="orange" AND data_monitored_state="enabled")) as "orange", count(eval(data_source_state="green" AND data_monitored_state="enabled")) as "green", count(eval(data_source_state="red" AND data_monitored_state="enabled" AND priority="high")) as "red - high priority", count(eval(data_source_state="red" AND data_monitored_state="enabled" AND priority!="high")) as "red - other priority"',
      managerid: "searchDataSourcesMain",
      id: "searchDataSourcesMainStats",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataSources = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputDataIndex$ $inputDataSourcetype$ | stats values(data_name) as data_name | mvexpand data_name | dedup data_name | sort limit=1000 data_name",
      managerid: "searchDataSourcesMain",
      id: "searchPopulateDataSources",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataSourcesTags = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'eval tags=if(match(tags, "click on Update tags"), "", tags) | makemv delim=" / " tags | search $inputDataIndex$ $inputDataSourcetype$ | mvexpand tags | stats values(tags) as tags | mvexpand tags | dedup tags | sort limit=1000 tags',
      managerid: "searchDataSourcesMain",
      id: "searchPopulateDataSourcesTags",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataSourcesIndexes = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputDataName$ $inputDataSourcetype$ | stats values(data_index) as data_index | mvexpand data_index | dedup data_index | sort limit=1000 data_index",
      managerid: "searchDataSourcesMain",
      id: "searchPopulateDataSourcesIndexes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataSourcesSourcetypes = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputDataName$ $inputDataIndex$ | stats values(data_sourcetype) as data_sourcetype | mvexpand data_sourcetype | dedup data_sourcetype | sort limit=1000 data_sourcetype",
      managerid: "searchDataSourcesMain",
      id: "searchPopulateDataSourcesSourcetypes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // tags
  var searchShowTags = new SearchManager(
    {
      id: "searchShowTags",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_source_monitoring where data_name="$tk_data_name$" | fields tags | makemv delim="," tags | mvexpand tags | dedup tags | sort tags',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchShowTags",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_tags_multiselect",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_tags_multiselect",
            value: "True",
          },
        ],
      },
    ],
  });

  // Smart Status

  var searchSmartStatusDataSource = new SearchManager(
    {
      id: "searchSmartStatusDataSource",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| trackme url=/services/trackme/v1/smart_status/ds_smart_status mode=get body=\"{'data_name': '$tk_data_name$'}\" | `trackme_smart_status_emoji`",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_smart_status_data_source$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSmartStatusDataHost = new SearchManager(
    {
      id: "searchSmartStatusDataHost",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| trackme url=/services/trackme/v1/smart_status/dh_smart_status mode=get body=\"{'data_host': '$tk_data_host$'}\" | `trackme_smart_status_emoji`",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_smart_status_data_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSmartStatusMetricHost = new SearchManager(
    {
      id: "searchSmartStatusMetricHost",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| trackme url=/services/trackme/v1/smart_status/mh_smart_status mode=get body=\"{'metric_host': '$tk_metric_host$'}\" | `trackme_smart_status_emoji`",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_smart_status_metric_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchShowTagsPolicies = new SearchManager(
    {
      id: "searchShowTagsPolicies",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_tags_policies | eval keyid=_key | eval select=keyid, mtime=strftime(mtime, "%c") | fields tags_policy_id, tags_policy_regex, tags_policy_value, mtime, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_tags_policies$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchShowTagsPolicies",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_tags_policies",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_tags_policies",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchTagsPoliciesSimulate = new SearchManager(
    {
      id: "searchTagsPoliciesSimulate",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| `trackme_tags_policies_run_simulation("$tk_tags_policies_policy_id$", "$tk_tags_policies_tags$", "$tk_tags_policies_regex$")`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_simulation_tags_policies$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Audit Flip
  var searchMainAuditFlip = new SearchManager(
    {
      id: "searchMainAuditFlip",
      earliest_time: "$timerange_audit_flip.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$timerange_audit_flip.latest$",
      search:
        '`trackme_idx` source="flip_state_change_tracking" $audit_flip_object_category$ $audit_flip_object$ $inputAuditFlipObjectFilter$ | eval separator = "-->" | dedup _time object object_category object_previous_state object_state | table _time object object_category object_previous_state separator object_state result | rename separator as " " | `trackme_eval_icons_flip`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_audit_flip$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  searchMainAuditFlip.on("search:done", function () {
    // stop the css loader
    $("#cssloader").remove();
  });

  var searchMainAuditFlipTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "sort limit=10000 - _time",
      managerid: "searchMainAuditFlip",
      id: "searchMainAuditFlipTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchMainAuditFlipPopulate = new SearchManager(
    {
      id: "searchMainAuditFlipPopulate",
      earliest_time: "$timerange_audit_flip.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$timerange_audit_flip.latest$",
      search:
        '`trackme_idx` source="flip_state_change_tracking" | stats count by object_category, object',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_audit_flip$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditFlipObjectCategory = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "stats count by object_category | sort limit=0 object_category",
      managerid: "searchMainAuditFlipPopulate",
      id: "searchAuditFlipObjectCategory",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditFlipObject = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $audit_flip_object_category$ $inputAuditFlipObjectFilter$ | stats count by object | sort limit=1000 object",
      managerid: "searchMainAuditFlipPopulate",
      id: "searchAuditFlipObject",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditFlipTopObject = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "top object",
      managerid: "searchMainAuditFlip",
      id: "searchAuditFlipTopObject",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditFlipOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by object",
      managerid: "searchMainAuditFlip",
      id: "searchAuditFlipOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Audit Changes Data Source
  var searchDataSourceMainAuditChanges = new SearchManager(
    {
      id: "searchDataSourceMainAuditChanges",
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTime.latest$",
      search:
        '| inputlookup trackme_audit_changes where (object="$tk_data_name$" AND object_category="data_source") | sort limit=0 - time | eval _time=time/1000 | fields - time | addinfo | where _time>=info_min_time AND (_time<=info_max_time OR info_max_time="+Infinity") | `trackme_eval_icons_audit_changes` | rename action_icon as " " | fields _time user action " " change_type comment',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_audit_changes$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchDataSourceMainAuditChanges",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_data_source_audit_changes_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_data_source_audit_changes_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchMainDataSourceAuditChangesTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "sort - limit=10000 _time",
      managerid: "searchDataSourceMainAuditChanges",
      id: "searchMainDataSourceAuditChangesTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditDataSourceAuditChangesOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by action",
      managerid: "searchDataSourceMainAuditChanges",
      id: "searchAuditDataSourceAuditChangesOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Lagging performance metrics
  var searchLaggingMetricDataSource = new SearchManager(
    {
      id: "searchLaggingMetricDataSource",
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTime.latest$",
      search:
        '| mstats max(trackme.eventcount_4h) as eventcount_4h, max(trackme.hostcount_4h) as hostcount_4h, max(trackme.lag_event_sec) as lag_event_sec, max(trackme.lag_ingestion_sec) as lag_ingestion_sec where `trackme_metrics_idx` object_category="data_source" object="$tk_data_name$" by object span=5m | timechart span=$modalTime.span$ avg(eventcount_4h) as eventcount_4h, avg(hostcount_4h) as hostcount_4h, avg(lag_event_sec) as lag_event_sec, avg(lag_ingestion_sec) as lag_ingestion_sec | fields _time, $tk_input_data_source_overview_metrics_chart_series$',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_lagging_metrics$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchLaggingMetricDataHost = new SearchManager(
    {
      id: "searchLaggingMetricDataHost",
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeHost.latest$",
      search:
        '| mstats max(trackme.eventcount_4h) as eventcount_4h, max(trackme.lag_event_sec) as lag_event_sec, max(trackme.lag_ingestion_sec) as lag_ingestion_sec where `trackme_metrics_idx` object_category="data_host" object="$tk_data_host$" by object span=5m | timechart span=$modalTimeHost.span$ avg(eventcount_4h) as eventcount_4h, avg(lag_event_sec) as lag_event_sec, avg(lag_ingestion_sec) as lag_ingestion_sec',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_lagging_metrics$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Audit Changes Data Host
  var searchDataHostMainAuditChanges = new SearchManager(
    {
      id: "searchDataHostMainAuditChanges",
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTime.latest$",
      search:
        '| inputlookup trackme_audit_changes where (object="$tk_data_host$" AND object_category="data_host") | sort limit=0 - time | eval _time=time/1000 | fields - time | addinfo | where _time>=info_min_time AND (_time<=info_max_time OR info_max_time="+Infinity") | `trackme_eval_icons_audit_changes` | rename action_icon as " " | fields _time user action " " change_type comment',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_audit_changes$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchDataHostMainAuditChanges",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_data_host_audit_changes_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_data_host_audit_changes_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchMainDataHostAuditChangesTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "sort - limit=10000 _time",
      managerid: "searchDataHostMainAuditChanges",
      id: "searchMainDataHostAuditChangesTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditDataHostAuditChangesOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by action",
      managerid: "searchDataHostMainAuditChanges",
      id: "searchAuditDataHostAuditChangesOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Audit Changes Metric Host
  var searchMetricHostMainAuditChanges = new SearchManager(
    {
      id: "searchMetricHostMainAuditChanges",
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTime.latest$",
      search:
        '| inputlookup trackme_audit_changes where (object="$tk_metric_host$" AND object_category="metric_host") | sort limit=0 - time | eval _time=time/1000 | fields - time | addinfo | where _time>=info_min_time AND (_time<=info_max_time OR info_max_time="+Infinity") | `trackme_eval_icons_audit_changes` | rename action_icon as " " | fields _time user action " " change_type comment',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_audit_changes$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchMetricHostMainAuditChanges",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_metric_host_audit_changes_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_metric_host_audit_changes_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchMainMetricHostAuditChangesTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "sort - limit=10000 _time",
      managerid: "searchMetricHostMainAuditChanges",
      id: "searchMainMetricHostAuditChangesTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditMetricHostAuditChangesOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by action",
      managerid: "searchMetricHostMainAuditChanges",
      id: "searchAuditMetricHostAuditChangesOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Audit Flip
  var searchDataSourceMainAuditFlip = new SearchManager(
    {
      id: "searchDataSourceMainAuditFlip",
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTime.latest$",
      search:
        '`trackme_idx` source="flip_state_change_tracking" object_category="data_source" object="$tk_data_name$" | eval separator = "-->" | dedup _time object object_category object_previous_state object_state | table _time object object_category object_previous_state separator object_state result',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_flipping_status$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchDataSourceMainAuditFlip",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_flipping_status_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_flipping_status_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchMainDataSourceAuditFlipTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'rename separator as " " | `trackme_eval_icons_flip` | fields _time	object object_category object_previous_state " " object_state | sort - limit=10000 _time',
      managerid: "searchDataSourceMainAuditFlip",
      id: "searchMainDataSourceAuditFlipTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditDataSourceFlipOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by object_state",
      managerid: "searchDataSourceMainAuditFlip",
      id: "searchAuditDataSourceFlipOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDataSourceTimeline = new SearchManager(
    {
      id: "searchDataSourceTimeline",
      earliest_time: "-7d@d",
      latest_time: "now",
      sample_ratio: null,
      search:
        '`trackme_idx` object_category="data_source" object="$tk_data_name$" source="current_state_tracking:data_source" | sort limit=0 _time | table _time, object, current_state | streamstats first(_time) as previous_time current=f by object | eventstats count as total | streamstats count as record_count | eval duration=_time-previous_time | eval previous_time=strftime(previous_time, "%c") | search current_state=* | fields _time, object, current_state, duration',
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_status_message$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchDataHostTimeline = new SearchManager(
    {
      id: "searchDataHostTimeline",
      earliest_time: "-7d@d",
      latest_time: "now",
      sample_ratio: null,
      search:
        '`trackme_idx` object_category="data_host" object="$tk_data_host$" source="current_state_tracking:data_host" | sort limit=0 _time | table _time, object, current_state | streamstats first(_time) as previous_time current=f by object | eventstats count as total | streamstats count as record_count | eval duration=_time-previous_time | eval previous_time=strftime(previous_time, "%c") | search current_state=* | fields _time, object, current_state, duration',
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_status_message$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchMetricHostTimeline = new SearchManager(
    {
      id: "searchMetricHostTimeline",
      earliest_time: "-7d@d",
      latest_time: "now",
      sample_ratio: null,
      search:
        '`trackme_idx` object_category="metric_host" object="$tk_metric_host$" source="current_state_tracking:metric_host" | sort limit=0 _time | table _time, object, current_state | streamstats first(_time) as previous_time current=f by object | eventstats count as total | streamstats count as record_count | eval duration=_time-previous_time | eval previous_time=strftime(previous_time, "%c") | search current_state=* | fields _time, object, current_state, duration',
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_status_message$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchDataHostMainAuditFlip = new SearchManager(
    {
      id: "searchDataHostMainAuditFlip",
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeHost.latest$",
      search:
        '`trackme_idx` source="flip_state_change_tracking" object_category="data_host" object="$tk_data_host$" | eval separator = "-->" | dedup _time object object_category object_previous_state object_state | table _time object object_category object_previous_state separator object_state result',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_flipping_status$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchDataHostMainAuditFlip",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_data_host_flipping_status_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_data_host_flipping_status_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchMainDataHostAuditFlipTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'rename separator as " " | `trackme_eval_icons_flip` | fields _time	object object_category object_previous_state " " object_state | sort - limit=10000 _time',
      managerid: "searchDataHostMainAuditFlip",
      id: "searchMainDataHostAuditFlipTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditDataHostFlipOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by object_state",
      managerid: "searchDataHostMainAuditFlip",
      id: "searchAuditDataHostFlipOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchMetricHostMainAuditFlip = new SearchManager(
    {
      id: "searchMetricHostMainAuditFlip",
      earliest_time: "$modalTimeMetricHost.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$modalTimeMetricHost.latest$",
      search:
        '`trackme_idx` source="flip_state_change_tracking" object_category="metric_host" object="$tk_metric_host$" | eval separator = "-->" | dedup _time object object_category object_previous_state object_state | table _time object object_category object_previous_state separator object_state result',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_flipping_status$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchMetricHostMainAuditFlip",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_metric_host_flipping_status_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_metric_host_flipping_status_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchMainMetricHostAuditFlipTable = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'rename separator as " " | `trackme_eval_icons_flip` | fields _time	object object_category object_previous_state " " object_state | sort - limit=10000 _time',
      managerid: "searchMetricHostMainAuditFlip",
      id: "searchMainMetricHostAuditFlipTable",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditmetricHostFlipOverTime = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "timechart limit=40 useother=t minspan=1h bins=1000 count by object_state",
      managerid: "searchMetricHostMainAuditFlip",
      id: "searchAuditmetricHostFlipOverTime",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Audit Changes
  var searchMainAuditChanges = new SearchManager(
    {
      id: "searchMainAuditChanges",
      earliest_time: "$timerange_audit_changes.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$timerange_audit_changes.latest$",
      search:
        '| inputlookup trackme_audit_changes | sort limit=0 - time | eval _time=time/1000 | fields - time | addinfo | where _time>=info_min_time AND (_time<=info_max_time OR info_max_time="+Infinity") | search $audit_changes_action$ $audit_changes_object_category$ $audit_changes_change_type$ $audit_changes_user$ $audit_changes_object$ | `trackme_eval_icons_audit_changes` | rename action_icon as " " | fields _time user action " " change_type object_category object object_attrs comment',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  searchMainAuditChanges.on("search:done", function () {
    // stop the css loader
    $("#cssloader").remove();
  });

  var searchMainAuditChangesPopulate = new SearchManager(
    {
      id: "searchMainAuditChangesPopulate",
      earliest_time: "$timerange_audit_changes.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$timerange_audit_changes.latest$",
      search:
        '| inputlookup trackme_audit_changes | sort limit=0 - time | eval _time=time/1000 | addinfo | where _time>=info_min_time AND (_time<=info_max_time OR info_max_time="+Infinity")',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesAction = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "stats count by action | sort limit=0 action",
      managerid: "searchMainAuditChangesPopulate",
      id: "searchAuditChangesAction",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesUser = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $audit_changes_action$ | stats count by user | sort limit=0 user",
      managerid: "searchMainAuditChangesPopulate",
      id: "searchAuditChangesUser",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesObjectCategory = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $audit_changes_action$ $audit_changes_user$ | stats count by object_category | sort limit=0 object_category",
      managerid: "searchMainAuditChangesPopulate",
      id: "searchAuditChangesObjectCategory",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesChangeType = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $audit_changes_action$ $audit_changes_user$ $audit_changes_object_category$ | stats count by change_type | sort limit=0 change_type",
      managerid: "searchMainAuditChangesPopulate",
      id: "searchAuditChangesChangeType",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesObject = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $audit_changes_action$ $audit_changes_user$ $audit_changes_object_category$ $audit_changes_change_type$ | stats count by object | sort limit=0 object",
      managerid: "searchMainAuditChangesPopulate",
      id: "searchAuditChangesObject",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesTopAction = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "top action",
      managerid: "searchMainAuditChanges",
      id: "searchAuditChangesTopAction",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesTopUser = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "top user",
      managerid: "searchMainAuditChanges",
      id: "searchAuditChangesTopUser",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAuditChangesTopChangeType = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "top change_type",
      managerid: "searchMainAuditChanges",
      id: "searchAuditChangesTopChangeType",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // metric hosts monitoring
  var searchMetricHostsMain = new SearchManager(
    {
      id: "searchMetricHostsMain",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      refresh: "$refresh$",
      latest_time: "now",
      search:
        '| savedsearch "TrackMe - metric hosts collection based table report"\n| `trackme_date_format("metric_last_time_seen")`\n| rename "metric_last_time_seen (translated)" as "last time"\n| `trackme_eval_metric_host_state`\n| `trackme_metric_host_group_lookup`\n|`trackme_eval_icons_metric_host`\n|`trackme_date_format("latest_flip_time")`\n| fillnull value="N/A" latest_flip_state, latest_flip_time, "latest_flip_time (translated)"\n| search $inputMetricHostFilterMode$ (metric_host=$inputMetricHostFilter$ OR object_group_name=$inputMetricHostFilter$)\n|`trackme_ack_lookup_main(metric_host)`\n|`trackme_metric_host_extract_mvstsummary`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  searchMetricHostsMain.on("search:done", function () {
    // stop the css loader
    $("#cssloader").remove();
  });

  var searchMainTableMetricHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputMetricHostIndexes$ $inputMetricHostCategories$ $inputMetricHost$ $inputMetricHostPriority$ $metric_host_state$ $metric_monitored_state$ | sort limit=10000 metric_host",
      managerid: "searchMetricHostsMain",
      id: "searchMainTableMetricHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchMetricHostsMainStats = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'search $inputMetricHostIndexes$ $inputMetricHostCategories$ $inputMetricHost$ | stats count as total, count(eval(metric_monitored_state="disabled")) as total_disabled, count(eval(metric_host_state!="green" AND metric_host_state!="blue" AND metric_monitored_state="enabled")) as total_in_alert, count(eval(metric_host_state="red" AND priority="high" AND metric_monitored_state="enabled")) as total_high_priority_red, count(eval(metric_monitored_state="enabled" AND priority="low")) as low_enabled, count(eval(metric_monitored_state="enabled" AND priority="medium")) as medium_enabled, count(eval(metric_monitored_state="enabled" AND priority="high")) as high_enabled, count(eval(metric_host_state="blue" AND metric_monitored_state="enabled")) as "blue", count(eval(metric_host_state="orange" AND metric_monitored_state="enabled")) as "orange", count(eval(metric_host_state="green" AND metric_monitored_state="enabled")) as "green", count(eval(metric_host_state="red" AND metric_monitored_state="enabled" AND priority="high")) as "red - high priority", count(eval(metric_host_state="red" AND metric_monitored_state="enabled" AND priority!="high")) as "red - other priority"',
      managerid: "searchMetricHostsMain",
      id: "searchMetricHostsMainStats",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateMetricHostsIndexes = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputMetricHostCategories$ $inputMetricHost$ | stats values(metric_index) as metric_index | mvexpand metric_index | dedup metric_index | sort limit=0 metric_index",
      managerid: "searchMetricHostsMain",
      id: "searchPopulateMetricHostsIndexes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateMetricHosts = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputMetricHostIndexes$ $inputMetricHostCategories$ | stats count by metric_host | sort limit=1000 metric_host",
      managerid: "searchMetricHostsMain",
      id: "searchPopulateMetricHosts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateMetricHostsCategories = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        "search $inputMetricHostIndexes$ $inputMetricHost$ | stats values(metric_category) as metric_category | mvexpand metric_category | dedup metric_category | search NOT [ | inputlookup trackme_metric_lagging_definition | table metric_category ] | sort limit=1000 metric_category",
      managerid: "searchMetricHostsMain",
      id: "searchPopulateMetricHostsCategories",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchHostTableMetricHost = new SearchManager(
    {
      id: "searchHostTableMetricHost",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      refresh: "$refresh$",
      latest_time: "now",
      search:
        '| savedsearch "trackMe - metric per host table report" host="$tk_metric_host$"',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
        depends: "$tk_metric_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchHostChartMetricHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "top metric_host_state",
      managerid: "searchHostTableMetricHost",
      id: "searchHostChartMetricHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleSLAMetricHostpct = new SearchManager(
    {
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
      },
      search: "`trackme_get_sla_pct_per_entity(metric_host,$tk_metric_host$)`",
      id: "searchSingleSLAMetricHostpct",
      sample_ratio: 1,
      status_buckets: 0,
      earliest_time: "-90d@d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // hosts monitoring

  var searchDataHostsMain = new SearchManager(
    {
      id: "searchDataHostsMain",
      earliest_time: "-5m",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      refresh: "$refresh$",
      latest_time: "+5m",
      search:
        '| inputlookup trackme_host_monitoring\n| eval keyid=_key\n| sort limit=0 - data_last_time_seen\n| dedup data_host\n| eval data_index_raw=data_index, data_sourcetype_raw=data_sourcetype, data_host_st_summary_raw=data_host_st_summary\n| makemv delim="," data_index\n| makemv delim="," data_sourcetype\n| makemv delim="," data_host_st_summary\n| `apply_data_host_blacklists`\n| search `trackme_get_idx_whitelist_searchtime(trackme_data_host_monitoring_whitelist_index, data_index)`\n| `trackme_eval_data_host_state`\n| `trackme_default_priority`\n| `trackme_default_data_host_alert_global_policy`\n| `trackme_data_host_group_lookup`\n| `trackme_date_format(data_last_time_seen)`\n| `trackme_date_format(data_last_time_seen_idx)`\n| `trackme_date_format(data_last_ingest)`\n| `trackme_eval_icons_host`\n| rename "data_last_ingest (translated)" as "last ingest", "data_last_time_seen (translated)" as "last time"\n| `trackme_date_format("latest_flip_time")`\n| fillnull value="N/A" latest_flip_state, latest_flip_time, "latest_flip_time (translated)"\n| `trackme_data_host_extract_mvstsummary`\n| sort limit=0 data_host\n| search $inputDataHostFilterMode$ (data_host=$inputDataHostFilter$ OR object_group_name=$inputDataHostFilter$)\n|`trackme_ack_lookup_main(data_host)`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  searchDataHostsMain.on("search:done", function () {
    // stop the css loader
    $("#cssloader").remove();
  });

  var searchMainTableHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'search $inputDataHostFilterMode$ (data_host=$inputDataHostFilter$ OR object_group_name= $inputDataHostFilter$) | search $inputDataHost$ $inputDataHostIndexes$ $inputDataHostSourcetypes$ $data_host_state$ $data_monitored_state$ $inputDataHostPriority$ | fillnull data_last_lag_seen, data_last_ingestion_lag_seen | eval data_last_lag_seen=round(data_last_lag_seen, 0) | eval data_last_ingestion_lag_seen=round(data_last_ingestion_lag_seen, 0) | fillnull value="N/A" data_last_lag_seen, data_last_ingestion_lag_seen\n| eval "lag (event / ingestion)" = if(data_last_lag_seen>60, tostring(data_last_lag_seen, "duration"), data_last_lag_seen . " sec") . " / " . if(data_last_ingestion_lag_seen>60, tostring(data_last_ingestion_lag_seen, "duration"), data_last_ingestion_lag_seen . " sec") | sort limit=10000 data_host',
      managerid: "searchDataHostsMain",
      id: "searchMainTableHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDataHostsMainStats = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'search $inputDataHostFilterMode$ (data_host=$inputDataHostFilter$ OR object_group_name= $inputDataHostFilter$) | search $inputDataHostIndexes$ $inputDataHostSourcetypes$ | stats count as total, count(eval(data_monitored_state="disabled")) as total_disabled, count(eval(data_host_state!="green" AND data_host_state!="blue" AND data_monitored_state="enabled")) as total_in_alert, count(eval(data_host_state="red" AND priority="high" AND data_monitored_state="enabled")) as total_high_priority_red, count(eval(data_monitored_state="enabled" AND priority="low")) as low_enabled, count(eval(data_monitored_state="enabled" AND priority="medium")) as medium_enabled, count(eval(data_monitored_state="enabled" AND priority="high")) as high_enabled, count(eval(data_host_state="blue" AND data_monitored_state="enabled")) as "blue", count(eval(data_host_state="orange" AND data_monitored_state="enabled")) as "orange", count(eval(data_host_state="green" AND data_monitored_state="enabled")) as "green", count(eval(data_host_state="red" AND data_monitored_state="enabled" AND priority="high")) as "red - high priority", count(eval(data_host_state="red" AND data_monitored_state="enabled" AND priority!="high")) as "red - other priority"',
      managerid: "searchDataHostsMain",
      id: "searchDataHostsMainStats",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataHostsIndexes = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'makemv data_index delim="," | search $inputDataHostFilterMode$ (data_host=$inputDataHostFilter$ OR object_group_name= $inputDataHostFilter$) | search $inputDataHostSourcetypes$ | stats values(data_index) as data_index | mvexpand data_index | dedup data_index | sort limit=1000 data_index',
      managerid: "searchDataHostsMain",
      id: "searchPopulateDataHostsIndexes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataHostsSourcetypes = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'makemv data_index delim="," | makemv data_sourcetype delim="," | search $inputDataHostFilterMode$ (data_host=$inputDataHostFilter$ OR object_group_name= $inputDataHostFilter$) | search $inputDataHostIndexes$ | stats values(data_sourcetype) as data_sourcetype | mvexpand data_sourcetype | dedup data_sourcetype | sort limit=1000 data_sourcetype',
      managerid: "searchDataHostsMain",
      id: "searchPopulateDataHostsSourcetypes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchPopulateDataHosts = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'makemv data_index delim="," | makemv data_sourcetype delim="," | search $inputDataHostIndexes$ $inputDataHostSourcetypes$ | stats values(data_host) as data_host | mvexpand data_host | dedup data_host | sort limit=1000 data_host',
      managerid: "searchDataHostsMain",
      id: "searchPopulateDataHosts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleNoDataSources = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "stats count by data_name | sort limit=0 data_name",
      managerid: "searchDataSourcesMain",
      id: "searchSingleNoDataSources",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleNoDataIndexes = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "stats count by data_index | sort limit=0 data_index",
      managerid: "searchDataSourcesMain",
      id: "searchSingleNoDataIndexes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleNoDataSourcetypes = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "stats count by data_sourcetype | sort limit=0 data_sourcetype",
      managerid: "searchDataSourcesMain",
      id: "searchSingleNoDataSourcetypes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleNoDataHosts = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "stats count by data_host | sort limit=0 data_host",
      managerid: "searchDataHostsMain",
      id: "searchSingleNoDataHosts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataSourceDonutAlerts = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'fields blue, orange, green, "red - high priority", "red - other priority"\n| transpose | rename column as state, "row 1" as count | `trackme_donut_alert_by_type(state)`',
      managerid: "searchDataSourcesMainStats",
      id: "searchSingleDataSourceDonutAlerts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataSourceDonutPriorities = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'fields low_enabled, medium_enabled, high_enabled | rename low_enabled as low, medium_enabled as medium, high_enabled as high | transpose | rename column as priority, "row 1" as count | `trackme_donut_alert_by_priority`',
      managerid: "searchDataSourcesMainStats",
      id: "searchSingleDataSourceDonutPriorities",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataSource1 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total",
      managerid: "searchDataSourcesMainStats",
      id: "searchSingleDataSource1",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataSourceInAlert = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_in_alert",
      managerid: "searchDataSourcesMainStats",
      id: "searchSingleDataSourceInAlert",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataSourceHighPriority = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_high_priority_red",
      managerid: "searchDataSourcesMainStats",
      id: "searchSingleDataSourceHighPriority",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataSourceNotMonitored = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_disabled",
      managerid: "searchDataSourcesMainStats",
      id: "searchSingleDataSourceNotMonitored",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataHostDonutAlerts = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'fields blue, orange, green, "red - high priority", "red - other priority"\n| transpose | rename column as state, "row 1" as count | `trackme_donut_alert_by_type(state)`',
      managerid: "searchDataHostsMainStats",
      id: "searchSingleDataHostDonutAlerts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataHostDonutPriorities = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'fields low_enabled, medium_enabled, high_enabled | rename low_enabled as low, medium_enabled as medium, high_enabled as high | transpose | rename column as priority, "row 1" as count | `trackme_donut_alert_by_priority`',
      managerid: "searchDataHostsMainStats",
      id: "searchSingleDataHostDonutPriorities",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataHost1 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total",
      managerid: "searchDataHostsMainStats",
      id: "searchSingleDataHost1",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataHostInAlert = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_in_alert",
      managerid: "searchDataHostsMainStats",
      id: "searchSingleDataHostInAlert",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataHostNotMonitored = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_disabled",
      managerid: "searchDataHostsMainStats",
      id: "searchSingleDataHostNotMonitored",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleDataHostHighPriority = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_high_priority_red",
      managerid: "searchDataHostsMainStats",
      id: "searchSingleDataHostHighPriority",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetDataHostTags = new SearchManager(
    {
      id: "searchGetDataHostTags",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| makeresults | eval data_host="$tk_data_host$" | fields - _time | `trackme_get_data_host_tags` | fields - data_host',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // metric_host

  var searchSingleMetricHostDonutAlerts = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'fields blue, orange, green, "red - high priority", "red - other priority"\n| transpose | rename column as state, "row 1" as count | `trackme_donut_alert_by_type(state)`',
      managerid: "searchMetricHostsMainStats",
      id: "searchSingleMetricHostDonutAlerts",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleMetricHostDonutPriorities = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'fields low_enabled, medium_enabled, high_enabled | rename low_enabled as low, medium_enabled as medium, high_enabled as high | transpose | rename column as priority, "row 1" as count | `trackme_donut_alert_by_priority`',
      managerid: "searchMetricHostsMainStats",
      id: "searchSingleMetricHostDonutPriorities",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleMetricHost1 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total",
      managerid: "searchMetricHostsMainStats",
      id: "searchSingleMetricHost1",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleMetricHostInAlert = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_in_alert",
      managerid: "searchMetricHostsMainStats",
      id: "searchSingleMetricHostInAlert",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleMetricHostHighPriority = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_high_priority_red",
      managerid: "searchMetricHostsMainStats",
      id: "searchSingleMetricHostHighPriority",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleMetricHostNotMonitored = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "fields total_disabled",
      managerid: "searchMetricHostsMainStats",
      id: "searchSingleMetricHostNotMonitored",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMetricHostTags = new SearchManager(
    {
      id: "searchGetMetricHostTags",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| makeresults | eval metric_host="$tk_metric_host$" | fields - _time | `trackme_get_metric_host_tags` | fields - metric_host',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchGetMetricHostTags",
    event: "progress",
    conditions: [
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "tk_metric_host_tags",
            value: "$result.metric_host_tags$",
          },
        ],
      },
    ],
  });

  var searchChartLag = new SearchManager(
    {
      id: "searchChartLag",
      sample_ratio: 1,
      search:
        "$tk_data_source_overview_root_search$ | timechart span=$modalTime.span$ $tk_data_source_timechart_count_aggreg$(count) as events_count, avg(delta) as avg_lag_sec, max(dcount_host) as dcount_host | fields _time, $tk_input_data_source_overview_chart_series$",
      status_buckets: 0,
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTime.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // data source monitoring

  // Data parsing quality
  var SearchDataSourceParsingQualityMain = new SearchManager(
    {
      id: "SearchDataSourceParsingQualityMain",
      tokenDependencies: {
        depends: "$show_data_quality$",
      },
      sample_ratio: 1,
      earliest_time: "$modalTime.earliest$",
      search:
        'index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` (component=LineBreakingProcessor OR component=AggregatorMiningProcessor OR component=DateParserVerbose) | `trackme_data_quality_parse` | search data_sourcetype="$tk_data_sourcetype$"',
      latest_time: "$modalTime.latest$",
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "SearchDataSourceParsingQualityMain",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_data_quality_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_data_quality_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var SearchDataSourceParsingQualityChart = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "timechart span=$modalTime.span$ count by component",
      managerid: "SearchDataSourceParsingQualityMain",
      id: "SearchDataSourceParsingQualityChart",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var SearchDataSourceParsingQualitySingle = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'top limit=0 component | eval percent=round(percent, 2) | eval summary=component . ": " . percent . " %" | fields summary | stats values(summary) as summary | append [ | makeresults | eval summary="No parsing issues detected (bravo!?), review the trackme_idx_filter macro to target indexing instances." | fields - _time ] | head 1',
      managerid: "SearchDataSourceParsingQualityMain",
      id: "SearchDataSourceParsingQualitySingle",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Outlier detection
  var searchOutlierDetectionChart = new SearchManager(
    {
      id: "searchOutlierDetectionChart",
      sample_ratio: 1,
      search:
        '| `trackme_outlier_chart(data_source, "$tk_data_name$", data_name, $tk_outlier_span$)`',
      status_buckets: 0,
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTime.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$show_data_source_outlier$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchOutlierDetectionChartSimulation = new SearchManager(
    {
      id: "searchOutlierDetectionChartSimulation",
      sample_ratio: 1,
      search:
        '| `trackme_outlier_chart_simulate(data_source, "$tk_data_name$", data_name, $tk_input_data_source_outlier_lower_threshold_multiplier$, $tk_input_data_source_outlier_upper_threshold_multiplier$, $tk_input_data_source_outlier_min_eventcount$, $tk_input_data_source_outlier_span$)`',
      status_buckets: 0,
      earliest_time: "$tk_input_data_source_outlier_period$",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$show_data_source_outlier_configuration$",
        depends: "$start_outliers_simulation_data_source$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchOutlierDetectionTable = new SearchManager(
    {
      id: "searchOutlierDetectionTable",
      sample_ratio: 1,
      search:
        "| `trackme_outlier_table(trackme_data_source_monitoring, data_name, $tk_data_name$)`",
      status_buckets: 0,
      earliest_time: "-24h",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$show_data_source_outlier$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagAutoLaggingDataSource7d = new SearchManager(
    {
      id: "searchSingleLagAutoLaggingDataSource7d",
      sample_ratio: 1,
      search:
        "$tk_data_source_overview_root_search$ | stats perc95(delta) as perc95_lag, avg(delta) as avg_lag | eval perc95_lag=round(perc95_lag, 0), avg_lag=round(avg_lag, 0)",
      status_buckets: 0,
      earliest_time: "-7d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_autolagging$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagAutoLaggingDataSource7dSingleLagPerc95 =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields perc95_lag | eval perc95_lag = round(perc95_lag, 0) . " sec (" . tostring(perc95_lag, "duration") . ")"',
        managerid: "searchSingleLagAutoLaggingDataSource7d",
        id: "searchSingleLagAutoLaggingDataSource7dSingleLagPerc95",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLagAutoLaggingDataSource7dSingleLagAvg =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields avg_lag | eval avg_lag = round(avg_lag, 0) . " sec (" . tostring(avg_lag, "duration") . ")"',
        managerid: "searchSingleLagAutoLaggingDataSource7d",
        id: "searchSingleLagAutoLaggingDataSource7dSingleLagAvg",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLag30dAutoLagging = new SearchManager(
    {
      id: "searchSingleLag30dAutoLagging",
      sample_ratio: 1,
      search:
        "$tk_data_source_overview_root_search$ | stats perc95(delta) as perc95_lag, avg(delta) as avg_lag | eval perc95_lag=round(perc95_lag, 0), avg_lag=round(avg_lag, 0)",
      status_buckets: 0,
      earliest_time: "-30d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_autolagging$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagAutoLaggingDataSource30dSingleLagPerc95 =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields perc95_lag | eval perc95_lag = round(perc95_lag, 0) . " sec (" . tostring(perc95_lag, "duration") . ")"',
        managerid: "searchSingleLag30dAutoLagging",
        id: "searchSingleLagAutoLaggingDataSource30dSingleLagPerc95",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLagAutoLaggingDataSource30dSingleLagAvg =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields avg_lag | eval avg_lag = round(avg_lag, 0) . " sec (" . tostring(avg_lag, "duration") . ")"',
        managerid: "searchSingleLag30dAutoLagging",
        id: "searchSingleLagAutoLaggingDataSource30dSingleLagAvg",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLagAutoLaggingDataHost7d = new SearchManager(
    {
      id: "searchSingleLagAutoLaggingDataHost7d",
      sample_ratio: 1,
      search:
        '| tstats count latest(_indextime) as indextime where [ | inputlookup trackme_host_monitoring where data_host="$tk_data_host$" | fields data_index | makemv delim="," data_index | mvexpand data_index | rename data_index as index | table index ] host="$tk_data_host$" `trackme_tstats_main_filter` ( ( `trackme_get_idx_whitelist(trackme_data_host_monitoring_whitelist_index, data_index)` `apply_data_host_blacklists_data_retrieve` ) OR `trackme_tstats_main_filter_for_host` ) by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats perc95(delta) as perc95_lag, avg(delta) as avg_lag | eval perc95_lag=round(perc95_lag, 0), avg_lag=round(avg_lag, 0)',
      status_buckets: 0,
      earliest_time: "-7d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_autolagging$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagAutoLaggingDataHost7dSingleLagPerc95 =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields perc95_lag | eval perc95_lag = round(perc95_lag, 0) . " sec (" . tostring(perc95_lag, "duration") . ")"',
        managerid: "searchSingleLagAutoLaggingDataHost7d",
        id: "searchSingleLagAutoLaggingDataHost7dSingleLagPerc95",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLagAutoLaggingDataHost7dSingleLagAvg = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        '| fields avg_lag | eval avg_lag = round(avg_lag, 0) . " sec (" . tostring(avg_lag, "duration") . ")"',
      managerid: "searchSingleLagAutoLaggingDataHost7d",
      id: "searchSingleLagAutoLaggingDataHost7dSingleLagAvg",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLag30dAutoLaggingDataHost = new SearchManager(
    {
      id: "searchSingleLag30dAutoLaggingDataHost",
      sample_ratio: 1,
      search:
        '| tstats count latest(_indextime) as indextime where [ | inputlookup trackme_host_monitoring where data_host="$tk_data_host$" | fields data_index | makemv delim="," data_index | mvexpand data_index | rename data_index as index | table index ] host="$tk_data_host$" `trackme_tstats_main_filter` ( ( `trackme_get_idx_whitelist(trackme_data_host_monitoring_whitelist_index, data_index)` `apply_data_host_blacklists_data_retrieve` ) OR `trackme_tstats_main_filter_for_host` ) by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | stats perc95(delta) as perc95_lag, avg(delta) as avg_lag | eval perc95_lag=round(perc95_lag, 0), avg_lag=round(avg_lag, 0)',
      status_buckets: 0,
      earliest_time: "-30d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_autolagging$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagAutoLaggingDataHost30dSingleLagPerc95 =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields perc95_lag | eval perc95_lag = round(perc95_lag, 0) . " sec (" . tostring(perc95_lag, "duration") . ")"',
        managerid: "searchSingleLag30dAutoLaggingDataHost",
        id: "searchSingleLagAutoLaggingDataHost30dSingleLagPerc95",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLagAutoLaggingDataHost30dSingleLagAvg =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          '| fields avg_lag | eval avg_lag = round(avg_lag, 0) . " sec (" . tostring(avg_lag, "duration") . ")"',
        managerid: "searchSingleLag30dAutoLaggingDataHost",
        id: "searchSingleLagAutoLaggingDataHost30dSingleLagAvg",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchSingleLag = new SearchManager(
    {
      id: "searchSingleLag",
      sample_ratio: 1,
      search:
        "$tk_data_source_overview_root_search$ | stats perc95(delta) as perc95_lag, avg(delta) as avg_lag, latest(event_lag) as event_lag",
      status_buckets: 0,
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTime.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagPerc95 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields perc95_lag | `trackme_parse_duration(perc95_lag, 60)`",
      managerid: "searchSingleLag",
      id: "searchSingleLagPerc95",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagAvg = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields avg_lag | `trackme_parse_duration(avg_lag, 60)`",
      managerid: "searchSingleLag",
      id: "searchSingleLagAvg",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleEventLag = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields event_lag | `trackme_parse_duration(event_lag, 60)`",
      managerid: "searchSingleLag",
      id: "searchSingleEventLag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleSLApct = new SearchManager(
    {
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
      },
      search: "`trackme_get_sla_pct_per_entity(data_source,$tk_data_name$)`",
      id: "searchSingleSLApct",
      sample_ratio: 1,
      status_buckets: 0,
      earliest_time: "-90d@d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleByMetricsLag = new SearchManager(
    {
      id: "searchSingleByMetricsLag",
      sample_ratio: 1,
      search:
        '| mstats perc95(trackme.lag_ingestion_sec) as perc95_lag, avg(trackme.lag_ingestion_sec) as avg_lag, latest(trackme.lag_event_sec) as event_lag where `trackme_metrics_idx` object_category="data_source" object="$tk_data_name$"',
      status_buckets: 0,
      earliest_time: "$modalTime.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTime.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_lagging_metrics$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagByMetricsPerc95 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields perc95_lag | `trackme_parse_duration(perc95_lag, 60)`",
      managerid: "searchSingleByMetricsLag",
      id: "searchSingleLagByMetricsPerc95",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagByMetricsAvg = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields avg_lag | `trackme_parse_duration(avg_lag, 60)`",
      managerid: "searchSingleByMetricsLag",
      id: "searchSingleLagByMetricsAvg",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleEventByMetricsLag = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields event_lag | `trackme_parse_duration(event_lag, 60)`",
      managerid: "searchSingleByMetricsLag",
      id: "searchSingleEventByMetricsLag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // data host monitoring

  // Data parsing quality
  var SearchDataHostParsingQualityMain = new SearchManager(
    {
      id: "SearchDataHostParsingQualityMain",
      tokenDependencies: {
        depends: "$show_data_host_quality$",
      },
      sample_ratio: 1,
      earliest_time: "$modalTimeHost.earliest$",
      search:
        'index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=LineBreakingProcessor OR component=AggregatorMiningProcessor OR component=DateParserVerbose | `trackme_data_quality_parse` | search data_host="$tk_data_host$"',
      latest_time: "$modalTimeHost.latest$",
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "SearchDataHostParsingQualityMain",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_data_host_quality_no_results",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_data_host_quality_no_results",
            value: "True",
          },
        ],
      },
    ],
  });

  var SearchDataHostParsingQualityChart = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "timechart span=$modalTimeHost.span$ count by component",
      managerid: "SearchDataHostParsingQualityMain",
      id: "SearchDataHostParsingQualityChart",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var SearchDataHostParsingQualitySingle = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'top limit=0 component | eval percent=round(percent, 2) | eval summary=component . ": " . percent . " %" | fields summary | stats values(summary) as summary',
      managerid: "SearchDataHostParsingQualityMain",
      id: "SearchDataHostParsingQualitySingle",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Outlier detection
  var searchOutlierDetectionChartDataHost = new SearchManager(
    {
      id: "searchOutlierDetectionChartDataHost",
      sample_ratio: 1,
      search:
        '| `trackme_outlier_chart(data_host, "$tk_data_host$", data_host, $tk_outlier_span$)`',
      status_buckets: 0,
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTimeHost.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
        depends: "$show_data_host_outlier$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchOutlierDetectionChartSimulationDataHost = new SearchManager(
    {
      id: "searchOutlierDetectionChartSimulationDataHost",
      sample_ratio: 1,
      search:
        '| `trackme_outlier_chart_simulate(data_host, "$tk_data_host$", data_host, $tk_input_data_host_outlier_lower_threshold_multiplier$, $tk_input_data_host_outlier_upper_threshold_multiplier$, $tk_input_data_host_outlier_min_eventcount$, $tk_input_data_host_outlier_span$)`',
      status_buckets: 0,
      earliest_time: "$tk_input_data_host_outlier_period$",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
        depends: "$show_data_host_outlier_configuration$",
        depends: "$start_outliers_simulation_data_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchOutlierDetectionTableDataHost = new SearchManager(
    {
      id: "searchOutlierDetectionTableDataHost",
      sample_ratio: 1,
      search:
        "| `trackme_outlier_table(trackme_host_monitoring, data_host, $tk_data_host$)`",
      status_buckets: 0,
      earliest_time: "-5m",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
        depends: "$show_data_host_outlier$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagHost = new SearchManager(
    {
      id: "searchSingleLagHost",
      sample_ratio: 1,
      search:
        '| tstats count latest(_indextime) as indextime max(_time) as maxtime where [ | inputlookup trackme_host_monitoring where data_host="$tk_data_host$" | fields data_index | makemv delim="," data_index | mvexpand data_index | rename data_index as index | table index ] host="$tk_data_host$" `trackme_tstats_main_filter` ( ( `trackme_get_idx_whitelist(trackme_data_host_monitoring_whitelist_index, data_index)` `apply_data_host_blacklists_data_retrieve` ) OR `trackme_tstats_main_filter_for_host` ) by _time, index, sourcetype span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime) | stats perc95(delta) as perc95_lag, avg(delta) as avg_lag, latest(event_lag) as event_lag',
      status_buckets: 0,
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTimeHost.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagHostPerc95 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields perc95_lag | `trackme_parse_duration(perc95_lag, 60)`",
      managerid: "searchSingleLagHost",
      id: "searchSingleLagHostPerc95",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagHostAvg = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields avg_lag | `trackme_parse_duration(avg_lag, 60)`",
      managerid: "searchSingleLagHost",
      id: "searchSingleLagHostAvg",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagHostEventLag = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields event_lag | `trackme_parse_duration(event_lag, 60)`",
      managerid: "searchSingleLagHost",
      id: "searchSingleLagHostEventLag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagByMetricsHost = new SearchManager(
    {
      id: "searchSingleLagByMetricsHost",
      sample_ratio: 1,
      search:
        '| mstats perc95(trackme.lag_ingestion_sec) as perc95_lag, avg(trackme.lag_ingestion_sec) as avg_lag, latest(trackme.lag_event_sec) as event_lag where `trackme_metrics_idx` object_category="data_host" object="$tk_data_host$"',
      status_buckets: 0,
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTimeHost.latest$",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_lagging_metrics$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagByMetricsHostPerc95 = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields perc95_lag | `trackme_parse_duration(perc95_lag, 60)`",
      managerid: "searchSingleLagByMetricsHost",
      id: "searchSingleLagByMetricsHostPerc95",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagByMetricsHostAvg = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields avg_lag | `trackme_parse_duration(avg_lag, 60)`",
      managerid: "searchSingleLagByMetricsHost",
      id: "searchSingleLagByMetricsHostAvg",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleLagByMetricsHostEventLag = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| fields event_lag | `trackme_parse_duration(event_lag, 60)`",
      managerid: "searchSingleLagByMetricsHost",
      id: "searchSingleLagByMetricsHostEventLag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleSLAHostpct = new SearchManager(
    {
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      search: "`trackme_get_sla_pct_per_entity(data_host,$tk_data_host$)`",
      id: "searchSingleSLAHostpct",
      sample_ratio: 1,
      status_buckets: 0,
      earliest_time: "-90d@d",
      cancelOnUnload: true,
      latest_time: "now",
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchChartHostBaseSearch = new SearchManager(
    {
      id: "searchChartHostBaseSearch",
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTimeHost.latest$",
      sample_ratio: 1,
      search:
        '| tstats count where [ | inputlookup trackme_host_monitoring where data_host="$tk_data_host$" | fields data_index | makemv delim="," data_index | mvexpand data_index | rename data_index as index | table index ] host="$tk_data_host$" `trackme_tstats_main_filter` ( ( `trackme_get_idx_whitelist(trackme_data_host_monitoring_whitelist_index, data_index)` `apply_data_host_blacklists_data_retrieve` ) OR `trackme_tstats_main_filter_for_host` ) by index, sourcetype',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchChartHostIndexes = new PostProcessManager(
    {
      tokenDependencies: {},
      managerid: "searchChartHostBaseSearch",
      search: "stats sum(count) as count by index | sort - count",
      id: "searchChartHostIndexes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchChartHostSourcetypes = new PostProcessManager(
    {
      tokenDependencies: {},
      managerid: "searchChartHostBaseSearch",
      search: "stats sum(count) as count by sourcetype | sort - count",
      id: "searchChartHostSourcetypes",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchChartLagHostOverTime = new SearchManager(
    {
      id: "searchChartLagHostOverTime",
      earliest_time: "$modalTimeHost.earliest$",
      cancelOnUnload: true,
      latest_time: "$modalTimeHost.latest$",
      sample_ratio: 1,
      search:
        '| tstats count, max(_indextime) as indextime where [ | inputlookup trackme_host_monitoring where data_host="$tk_data_host$" | fields data_index | makemv delim="," data_index | mvexpand data_index | rename data_index as index | table index ] host="$tk_data_host$" `trackme_tstats_main_filter` ( ( `trackme_get_idx_whitelist(trackme_data_host_monitoring_whitelist_index, data_index)` `apply_data_host_blacklists_data_retrieve` ) OR `trackme_tstats_main_filter_for_host` ) by _time, index, sourcetype span=1s | eval delta=(indextime-_time) | timechart span=$modalTimeHost.span$ sum(count) as events_count, avg(delta) as avg_lag_sec',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Metric SLA policies

  var searchMetricPolicies = new SearchManager(
    {
      id: "searchMetricPolicies",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| inputlookup trackme_metric_lagging_definition | eval keyid=_key, select=keyid",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_metric_sla_policies$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchMetricPolicies",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_metric_policies",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_metric_policies",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleMetricPolicies = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchMetricPolicies",
      id: "searchSingleMetricPolicies",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Data sampling

  var searchDataSamplingTable1 = new SearchManager(
    {
      id: "searchDataSamplingTable1",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_sampling where data_name="$tk_data_name$" | eval " " = "<--" | fields data_sample_status_colour, data_sample_status_message, data_sample_feature, data_sampling_nr, current_detected_format, " ", previous_detected_format, data_sample_anomaly_detected, data_sample_anomaly_reason, multiformat_detected, data_sample_mtime | eval mtime=strftime(data_sample_mtime, "%c") | `trackme_eval_icons_data_sampling_enablement` | `trackme_eval_icons_data_sampling_summary` | rename data_sample_anomaly_reason as anomaly_reason, multiformat_detected as multiformat | eval previous_detected_format=if(isnull(previous_detected_format), "N/A", previous_detected_format) | append [ | makeresults | eval data_sample_feature="N/A", current_detected_format="N/A", previous_detected_format="N/A", state="N/A", anomaly_reason="N/A", multiformat="N/A", mtime="N/A" ] | eval data_sampling_nr=if(isnum(data_sampling_nr), data_sampling_nr, `trackme_data_sampling_default_sample_record_at_run`) | fields - data_name | rename data_sample_feature as feature | head 1',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_sampling$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDataSamplingShowCustomRules = new SearchManager(
    {
      id: "searchDataSamplingShowCustomRules",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| `trackme_show_custom_model_rules` | fillnull value="ANY" sourcetype_scope',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_sampling_custom_rules$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchDataSamplingShowCustomRules",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_sampling_custom_rules",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_sampling_custom_rules",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchDataSamplingShowBuiltinRules = new SearchManager(
    {
      id: "searchDataSamplingShowBuiltinRules",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search: "| `trackme_show_builtin_model_rules`",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_sampling$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDataSamplingSimulateCustomRule = new SearchManager(
    {
      id: "searchDataSamplingSimulateCustomRule",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| `trackme_data_sampling_return_live_sample("$tk_input_data_sampling_dropdown$")` | mvexpand raw_sample | eval sourcetype="$tk_data_sampling_custom_st_value$", sourcetype_scope="$tk_data_sampling_custom_sourcetype_scope$", model_type="$tk_data_sampling_custom_rule_type$" | eval detected_format = case((sourcetype_scope=="*"), case(match(raw_sample, "$tk_data_sampling_custom_rule_regex$"), "$tk_data_sampling_custom_rule_name$"), in(sourcetype, `trackme_data_sampling_custom_models_simulate_genlist("$tk_data_sampling_custom_sourcetype_scope$")`), case(match(raw_sample, "$tk_data_sampling_custom_rule_regex$"), "$tk_data_sampling_custom_rule_name$")) | `trackme_data_sampling_simulate_custom_rule`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_simulation_data_sampling_custom_rule$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchDataSamplingSimulateCustomRuleLatestEvent = new SearchManager(
    {
      id: "searchDataSamplingSimulateCustomRuleLatestEvent",
      earliest_time: "-24h",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| `trackme_data_sampling_return_live_sample("$tk_input_data_sampling_dropdown$")`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_simulation_data_sampling_custom_rule_show_events$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Custom lagging

  var searchCustomLagging = new SearchManager(
    {
      id: "searchCustomLagging",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_custom_lagging_definition | eval keyid=_key | search name=$tk_input_custom_lagging_search$ | eval select=keyid, object=if(isnull(object), "all", object) | fields keyid, level, name, object, value, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_custom_lagging$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchCustomLagging",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_custom_lagging",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_custom_lagging",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleCustomLagging = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchCustomLagging",
      id: "searchSingleCustomLagging",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Elastic Sources Shared

  var searchElasticSources = new SearchManager(
    {
      id: "searchElasticSources",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| inputlookup trackme_elastic_sources | eval keyid=_key | search data_name=$tk_input_elastic_sources_search$ | eval select=data_name | fields keyid, data_name, search_mode, search_constraint, elastic_data_index, elastic_data_sourcetype, select",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_elastic_sources$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchElasticSources",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_elastic_sources",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_elastic_sources",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleElasticSources = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchElasticSources",
      id: "searchSingleElasticSources",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Elastic Sources Shared

  var searchElasticSourcesDedicated = new SearchManager(
    {
      id: "searchElasticSourcesDedicated",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        "| inputlookup trackme_elastic_sources_dedicated | eval keyid=_key | search data_name=$tk_input_elastic_sources_dedicated_search$ | eval select=data_name | fields keyid, data_name, search_mode, search_constraint, elastic_data_index, elastic_data_sourcetype, select",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_elastic_sources_dedicated$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchElasticSourcesDedicated",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_elastic_sources_dedicated",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_elastic_sources_dedicated",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleElasticSourcesDedicated = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchElasticSourcesDedicated",
      id: "searchSingleElasticSourcesDedicated",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchElasticSourcesTest = new SearchManager(
    {
      id: "searchElasticSourcesTest",
      earliest_time: "$tk_input_elastic_source_earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "$tk_input_elastic_source_latest$",
      search:
        '| savedsearch runSPL [ | makeresults | eval data_name="$tk_input_elastic_source_data_name$", search_mode="$form.tk_input_elastic_source_search_type$", search_constraint="$tk_input_elastic_source_search_constraint$", elastic_data_index="$tk_input_elastic_source_elastic_data_index$", elastic_data_sourcetype="$tk_input_elastic_source_elastic_data_sourcetype$" | `trackme_elastic_sources_simulate("$tk_input_elastic_source_data_name$", "$tk_input_elastic_source_earliest$", "$tk_input_elastic_source_latest$")`',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_simulation_elastic_sources$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true
    }
  );

  // whitelist

  // whitelist data_source

  var searchWhiteListDataSource = new SearchManager(
    {
      id: "searchWhiteListDataSource",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_source_monitoring_whitelist_index | eval keyid=_key | search data_index="$form.tk_input_data_source_whitelist_search$" | sort limit=0 data_index | eval select=keyid | fields data_index, keyid, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$start_modify_data_source_whitelist$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchWhiteListDataSource",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_source_whitelist",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_source_whitelist",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleWhiteListDataSource = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchWhiteListDataSource",
      id: "searchSingleWhiteListDataSource",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // whitelist metric_host

  var searchWhiteListMetricHost = new SearchManager(
    {
      id: "searchWhiteListMetricHost",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_metric_host_monitoring_whitelist_index | eval keyid=_key | search metric_index="$form.tk_input_metric_host_whitelist_search$" | eval select=keyid | sort limit=0 metric_index | fields metric_index, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
        depends: "$start_modify_metric_host_whitelist$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchWhiteListMetricHost",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_metric_host_whitelist",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_metric_host_whitelist",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleWhiteListMetricHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchWhiteListMetricHost",
      id: "searchSingleWhiteListMetricHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // whitelist data_host

  var searchWhiteListDataHost = new SearchManager(
    {
      id: "searchWhiteListDataHost",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_host_monitoring_whitelist_index | eval keyid=_key | search data_index="$form.tk_input_data_host_whitelist_search$" | eval select=keyid | sort limit=0 data_index',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
        depends: "$start_modify_data_host_whitelist$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchWhiteListDataHost",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_host_whitelist",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_host_whitelist",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleWhiteListDataHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchWhiteListDataHost",
      id: "searchSingleWhiteListDataHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist

  // blacklist host

  var searchBlackListDataSourceHost = new SearchManager(
    {
      id: "searchBlackListDataSourceHost",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_source_monitoring_blacklist_host | eval keyid=_key | `detect_rex(data_host)` | search data_host="$form.tk_input_data_source_blacklist_host_search$" | eval select=keyid | fields data_host, data_blacklist_state, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$show_data_source_tracker$",
        depends: "$start_modify_data_source_blacklist_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataSourceHost",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_source_blacklist_host",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_source_blacklist_host",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListDataSourceHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataSourceHost",
      id: "searchSingleBlackListDataSourceHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist index

  var searchBlackListDataSourceIndex = new SearchManager(
    {
      id: "searchBlackListDataSourceIndex",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_source_monitoring_blacklist_index | eval keyid=_key | `detect_rex(data_index)` | eval select=keyid | search data_index="$form.tk_input_data_source_blacklist_index_search$" | fields keyid, data_index, data_blacklist_state, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_data_source_blacklist_index$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataSourceIndex",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_source_blacklist_index",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_source_blacklist_index",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListDataSourceIndex = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataSourceIndex",
      id: "searchSingleBlackListDataSourceIndex",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist sourcetype

  var searchBlackListDataSourceSourcetype = new SearchManager(
    {
      id: "searchBlackListDataSourceSourcetype",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_source_monitoring_blacklist_sourcetype | eval keyid=_key | `detect_rex(data_sourcetype)` | eval select=keyid | search data_sourcetype="$form.tk_input_data_source_blacklist_sourcetype_search$" | fields keyid, data_sourcetype, data_blacklist_state, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_data_source_blacklist_sourcetype$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataSourceSourcetype",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_source_blacklist_sourcetype",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_source_blacklist_sourcetype",
            value: "True",
          },
        ],
      },
    ],
  });

  // blacklist data_name

  var searchBlackListDataSourceDataName = new SearchManager(
    {
      id: "searchBlackListDataSourceDataName",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_source_monitoring_blacklist_data_name | eval keyid=_key | `detect_rex(data_name)` | eval select=keyid | search data_name="$form.tk_input_data_source_blacklist_data_name_search$" | fields keyid, data_name, data_blacklist_state, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_data_source_blacklist_data_name$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataSourceDataName",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_source_blacklist_data_name",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_source_blacklist_data_name",
            value: "True",
          },
        ],
      },
    ],
  });

  // blacklist host

  var searchBlackListDataHostHost = new SearchManager(
    {
      id: "searchBlackListDataHostHost",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_host_monitoring_blacklist_host | eval keyid=_key | `detect_rex(data_host)` | eval select=keyid | search data_host="$form.tk_input_data_host_blacklist_host_search$" | fields data_host, data_blacklist_state, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_data_host_blacklist_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataHostHost",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_host_blacklist_host",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_host_blacklist_host",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListDataHostHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataHostHost",
      id: "searchSingleBlackListDataHostHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist host

  var searchBlackListMetricHostHost = new SearchManager(
    {
      id: "searchBlackListMetricHostHost",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_metric_host_monitoring_blacklist_host | eval keyid=_key | `detect_rex(metric_host)` | search metric_host="$form.tk_input_metric_host_blacklist_host_search$" | eval select=keyid | fields keyid, metric_host, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_metric_host_blacklist_host$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListMetricHostHost",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_metric_host_blacklist_host",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_metric_host_blacklist_host",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListMetricHostHost = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListMetricHostHost",
      id: "searchSingleBlackListMetricHostHost",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist index

  var searchBlackListDataHostIndex = new SearchManager(
    {
      id: "searchBlackListDataHostIndex",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_host_monitoring_blacklist_index | eval keyid=_key | `detect_rex(data_index)` | search data_index="$form.tk_input_data_host_blacklist_index_search$" | eval select = keyid | fields keyid, data_index, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_data_host_blacklist_index$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataHostIndex",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_host_blacklist_index",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_host_blacklist_index",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListDataHostIndex = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataHostIndex",
      id: "searchSingleBlackListDataHostIndex",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist metric index
  var searchBlackListMetricHostIndex = new SearchManager(
    {
      id: "searchBlackListMetricHostIndex",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_metric_host_monitoring_blacklist_index | eval keyid=_key | `detect_rex(metric_index)` | search metric_index="$form.tk_input_metric_host_blacklist_index_search$" | eval select = keyid | fields keyid, metric_index, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_metric_host_blacklist_index$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListMetricHostIndex",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_metric_host_blacklist_index",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_metric_host_blacklist_index",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListMetricHostIndex = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListMetricHostIndex",
      id: "searchSingleBlackListMetricHostIndex",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // blacklist sourcetype

  var searchBlackListDataHostSourcetype = new SearchManager(
    {
      id: "searchBlackListDataHostSourcetype",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_data_host_monitoring_blacklist_sourcetype | eval keyid=_key | `detect_rex(data_sourcetype)` | search data_sourcetype="$form.tk_input_data_host_blacklist_sourcetype_search$" | eval select = keyid | fields keyid, data_sourcetype, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_data_host_blacklist_sourcetype$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListDataHostSourcetype",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_data_host_blacklist_sourcetype",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_data_host_blacklist_sourcetype",
            value: "True",
          },
        ],
      },
    ],
  });

  // blacklist metric_category

  var searchBlackListMetricHostMetricCategory = new SearchManager(
    {
      id: "searchBlackListMetricHostMetricCategory",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      latest_time: "now",
      search:
        '| inputlookup trackme_metric_host_monitoring_blacklist_metric_category | eval keyid=_key | `detect_rex(metric_category)` | search metric_category="$form.tk_input_metric_host_blacklist_metric_category_search$" | eval select = keyid | fields keyid, metric_category, is_rex, select',
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$start_modify_metric_host_blacklist_metric_category$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchBlackListMetricHostMetricCategory",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "unset",
            token: "show_table_metric_host_blacklist_metric_category",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_metric_host_blacklist_metric_category",
            value: "True",
          },
        ],
      },
    ],
  });

  var searchSingleBlackListDataSourceSourcetype = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataSourceSourcetype",
      id: "searchSingleBlackListDataSourceSourcetype",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleBlackListDataSourceDataName = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataSourceDataName",
      id: "searchSingleBlackListDataSourceDataName",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleBlackListDataHostSourcetype = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListDataHostSourcetype",
      id: "searchSingleBlackListDataHostSourcetype",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchSingleBlackListMetricHostMetricCategory = new PostProcessManager(
    {
      tokenDependencies: {},
      search: "| stats count",
      managerid: "searchBlackListMetricHostMetricCategory",
      id: "searchSingleBlackListMetricHostMetricCategory",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Indexer queues

  var searchPopulateHostQueues = new SearchManager(
    {
      id: "searchPopulateHostQueues",
      earliest_time: "$inputLinkQueuesTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      latest_time: "$inputLinkQueuesTime.latest$",
      search:
        "| tstats count where (index=_internal `trackme_idx_filter` source=*metrics.log sourcetype=splunkd) by host | sort 0 host | fields host",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_indexers_queues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchQueueAll = new SearchManager(
    {
      id: "searchQueueAll",
      tokenDependencies: {
        depends: "$tk_start_indexers_queues_searches$",
      },
      sample_ratio: 1,
      earliest_time: "$inputLinkQueuesTime.earliest$",
      search:
        '(index=_internal `trackme_idx_filter` source=*metrics.log sourcetype=splunkd $inputHostQueues$ group=queue) | eval max=if(isnotnull(max_size_kb),max_size_kb,max_size) | eval curr=if(isnotnull(current_size_kb),current_size_kb,current_size) | eval fill_perc=round((curr/max)*100,2) | bucket _time span=1m | stats Median(fill_perc) AS "fill_percentage" by host, _time, name | timechart limit=0 useother=f span=2m avg(fill_percentage) as "pct_fill_indexqueue" by name',
      latest_time: "$inputLinkQueuesTime.latest$",
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchQueueTreillis = new SearchManager(
    {
      id: "searchQueueTreillis",
      earliest_time: "$inputLinkQueuesTime.earliest$",
      latest_time: "$inputLinkQueuesTime.latest$",
      sample_ratio: 1,
      search:
        '(index=_internal `trackme_idx_filter` source=*metrics.log sourcetype=splunkd $inputHostQueues$ group=queue) | eval max=if(isnotnull(max_size_kb),max_size_kb,max_size) | eval curr=if(isnotnull(current_size_kb),current_size_kb,current_size) | eval fill_perc=round((curr/max)*100,2) | bucket _time span=1m | eval ingest_pipe=if(isnull(ingest_pipe), 0, ingest_pipe) | eval key = $inputHostQueuesBreak$ | stats Median(fill_perc) AS "fill_percentage" by key, _time | timechart limit=0 useother=f span=2m avg(fill_percentage) as "pct_fill_indexqueue" by key',
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_indexers_queues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  // Parsing issues

  var searchPopulateHostParsing = new SearchManager(
    {
      id: "searchPopulateHostParsing",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      search:
        "| tstats count where (index=_internal `trackme_idx_filter` source=*metrics.log sourcetype=splunkd) by host | sort 0 host | fields host",
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchParsingIssuesChart = new SearchManager(
    {
      id: "searchParsingIssuesChart",
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      sample_ratio: 1,
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` $inputHostParsing$ component=LineBreakingProcessor OR component=AggregatorMiningProcessor OR component=DateParserVerbose | timechart span=$inputLinkParsingIssuesTime.span$ count by component",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchParsingIssuesSingle = new SearchManager(
    {
      id: "searchParsingIssuesSingle",
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      sample_ratio: 1,
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      search:
        'index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` $inputHostParsing$ component=LineBreakingProcessor OR component=AggregatorMiningProcessor OR component=DateParserVerbose | top limit=0 component | eval percent=round(percent, 2) | eval summary=component . ": " . percent . " %" | fields summary | stats values(summary) as summary | append [ | makeresults | eval summary="No parsing issues detected (bravo!?), review the trackme_idx_filter macro to target indexing instances." | fields - _time ] | head 1',
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchLineBreakingProcessorTopSource = new SearchManager(
    {
      id: "searchLineBreakingProcessorTopSource",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=LineBreakingProcessor | top limit=50 data_source | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchLineBreakingProcessorTopHost = new SearchManager(
    {
      id: "searchLineBreakingProcessorTopHost",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=LineBreakingProcessor | top limit=50 data_host | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchLineBreakingProcessorTopSourcetype = new SearchManager(
    {
      id: "searchLineBreakingProcessorTopSourcetype",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=LineBreakingProcessor | top limit=50 data_sourcetype | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchAggregatorMiningProcessorTopSource = new SearchManager(
    {
      id: "searchAggregatorMiningProcessorTopSource",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=AggregatorMiningProcessor | top limit=50 data_source | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchAggregatorMiningProcessorTopHost = new SearchManager(
    {
      id: "searchAggregatorMiningProcessorTopHost",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=AggregatorMiningProcessor | top limit=50 data_host | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchAggregatorMiningProcessorTopSourcetype = new SearchManager(
    {
      id: "searchAggregatorMiningProcessorTopSourcetype",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=AggregatorMiningProcessor | top limit=50 data_sourcetype | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchDateParserVerboseTopSource = new SearchManager(
    {
      id: "searchDateParserVerboseTopSource",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=DateParserVerbose | `trackme_rex_dateparserverbose` | top limit=50 data_source | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchDateParserVerboseTopHost = new SearchManager(
    {
      id: "searchDateParserVerboseTopHost",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=DateParserVerbose | `trackme_rex_dateparserverbose` | top limit=50 data_host | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchDateParserVerboseTopSourcetype = new SearchManager(
    {
      id: "searchDateParserVerboseTopSourcetype",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: 1,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=DateParserVerbose | `trackme_rex_dateparserverbose` | top limit=50 data_sourcetype | eval percent=round(percent, 2)",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchLineBreakingProcessorEvent = new SearchManager(
    {
      id: "searchLineBreakingProcessorEvent",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: null,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=LineBreakingProcessor | head 100",
      status_buckets: 300,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchAggregatorMiningProcessorEvent = new SearchManager(
    {
      id: "searchAggregatorMiningProcessorEvent",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: null,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=aggregatorMiningProcessor | head 100",
      status_buckets: 300,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  var searchDateParserVerboseEvent = new SearchManager(
    {
      id: "searchDateParserVerboseEvent",
      earliest_time: "$inputLinkParsingIssuesTime.earliest$",
      latest_time: "$inputLinkParsingIssuesTime.latest$",
      sample_ratio: null,
      search:
        "index=_internal sourcetype=splunkd error OR warn `trackme_idx_filter` component=DateParserVerbose | head 100",
      status_buckets: 300,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      tokenDependencies: {
        depends: "$tk_start_parsing_issues_searches$",
      },
      runWhenTimeIsUndefined: false,
    },
    { tokens: true, tokenNamespace: "submitted" }
  );

  // Identity card

  var searchIdentityCardTable = new SearchManager(
    {
      id: "searchIdentityCardTable",
      tokenDependencies: {
        depends: "$tk_start_associate_identity_card$",
      },
      sample_ratio: 1,
      search:
        "| inputlookup trackme_sources_knowledge | eval keyid=_key | search object=*$FilterIdentityCardTable$* OR doc_link=*$FilterIdentityCardTable$ OR doc_note=*$FilterIdentityCardTable$* | table keyid, object, doc_link, doc_note",
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Logical group

  var searchLogicalGroupTable = new SearchManager(
    {
      id: "searchLogicalGroupTable",
      tokenDependencies: {
        depends: "$tk_start_logical_member_get$",
      },
      sample_ratio: 1,
      search:
        '| inputlookup trackme_logical_group | eval keyid=_key | search object_group_members="$input_object$" | eval object_group_mtime=strftime(object_group_mtime, "%c") | table keyid, object_group_name, object_group_members, object_group_min_green_percent, object_group_mtime',
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  new SearchEventHandler({
    managerid: "searchLogicalGroupTable",
    event: "progress",
    conditions: [
      {
        attr: "match",
        value: "'job.resultCount' == 0",
        actions: [
          {
            type: "set",
            token: "show_add_logical_group",
            value: "True",
          },
          {
            type: "unset",
            token: "show_table_logical_group",
          },
        ],
      },
      {
        attr: "any",
        value: "*",
        actions: [
          {
            type: "set",
            token: "show_table_logical_group",
            value: "True",
          },
          {
            type: "unset",
            token: "show_add_logical_group",
          },
        ],
      },
    ],
  });

  // Logical group add member

  var searchLogicalGroupTableAddMember = new SearchManager(
    {
      id: "searchLogicalGroupTableAddMember",
      tokenDependencies: {
        depends: "$tk_start_logical_member_add$",
      },
      sample_ratio: 1,
      search:
        '| inputlookup trackme_logical_group | eval keyid=_key | search object_group_name=*$FilterLogicalGroupTable$* OR object_group_members=*$FilterLogicalGroupTable$* | eval object_group_mtime=strftime(object_group_mtime, "%c") | table keyid, object_group_name, object_group_members, object_group_min_green_percent, object_group_mtime',
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  // Ack

  var searchAckGet = new SearchManager(
    {
      id: "searchAckGet",
      tokenDependencies: {
        depends: "$tk_start_ack_get$",
      },
      sample_ratio: 1,
      search:
        '| `trackme_ack_get("$input_object$", "$input_object_category$")` | `trackme_ack_join_comment("$input_object$", "$input_object_category$")`',
      cancelOnUnload: true,
      status_buckets: 0,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchAckDuration = new SearchManager(
    {
      id: "searchAckDuration",
      tokenDependencies: {
        depends: "$tk_start_ack_get$",
      },
      earliest_time: "-5m",
      latest_time: "now",
      sample_ratio: null,
      search: "| `trackme_ack_populate_dropdown`",
      status_buckets: 0,
      cancelOnUnload: true,
      app: utils.getCurrentApp(),
      auto_cancel: 90,
      preview: true,
      runWhenTimeIsUndefined: false,
    },
    { tokens: true }
  );

  //
  // DATA SOURCES TRACKING
  //

  var DonutDataSourceCountByPriority = new semiCircleDonut(
    {
      id: "DonutDataSourceCountByPriority",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "all",
      height: "170",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchSingleDataSourceDonutPriorities",
      el: $("#DonutDataSourceCountByPriority"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  DonutDataSourceCountByPriority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.inputDataPriority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_source_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var DonutDataSourceCountByStateAndPriority = new semiCircleDonut(
    {
      id: "DonutDataSourceCountByStateAndPriority",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "none",
      height: "170",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchSingleDataSourceDonutAlerts",
      el: $("#DonutDataSourceCountByStateAndPriority"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  //
  // list input
  //

  // main
  var link1 = new LinkListInput(
    {
      id: "link1",
      choices: [
        {
          value: "show_data_source_tracker",
          label: "DATA SOURCES TRACKING",
        },
        {
          value: "show_data_host_tracker",
          label: "DATA HOSTS TRACKING",
        },
        {
          value: "show_metric_host_tracker",
          label: "METRIC HOSTS TRACKING",
        },
        {
          value: "show_audit_flip",
          label: "INVESTIGATE STATUS FLIPPING",
        },
        {
          value: "show_audit_changes",
          label: "INVESTIGATE AUDIT CHANGES",
        },
        {
          value: "show_alerts",
          label: "TRACKING ALERTS",
        },
      ],
      default: "show_data_source_tracker",
      selectFirstChoice: false,
      searchWhenChanged: true,
      value: "$form.tk_main_link$",
      el: $("#link1"),
    },
    {
      tokens: true,
    }
  ).render();

  link1.on("change", function (newValue) {
    FormUtils.handleValueChange(link1);
  });

  link1.on("valueChange", function (e) {
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

  // main data_source link input for modal window
  var inputLinkDataSource = new LinkListInput(
    {
      id: "inputLinkDataSource",
      choices: [
        {
          value: "overview",
          label: "Overview data source",
        },
        {
          value: "outlier",
          label: "Outlier detection overview",
        },
        {
          value: "outlier_configuration",
          label: "Outlier detection configuration",
        },
        {
          value: "data_sampling",
          label: "Data sampling",
        },
        {
          value: "data_quality",
          label: "Data parsing quality",
        },
        {
          value: "lagging_metrics",
          label: "Lagging performances",
        },
        {
          value: "flipping_status",
          label: "Status flipping",
        },
        {
          value: "status_message",
          label: "Status message",
        },
        {
          value: "data_source_audit_changes",
          label: "Audit changes",
        },
      ],
      default: "overview",
      searchWhenChanged: true,
      selectFirstChoice: false,
      initialValue: "overview",
      value: "$form.inputLinkDataSource$",
      el: $("#inputLinkDataSource"),
    },
    {
      tokens: true,
    }
  ).render();

  inputLinkDataSource.on("change", function (newValue) {
    FormUtils.handleValueChange(inputLinkDataSource);
  });

  inputLinkDataSource.on("valueChange", function (e) {
    if (e.value === "overview") {
      EventHandler.setToken("show_data_source_overview", "true", {}, e.data);
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "outlier") {
      EventHandler.setToken("show_data_source_outlier", "true", {}, e.data);
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "outlier_configuration") {
      EventHandler.setToken(
        "show_data_source_outlier_configuration",
        "true",
        {},
        e.data
      );
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "data_sampling") {
      EventHandler.setToken("show_data_sampling", "true", {}, e.data);
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_quality");
    } else if (e.value === "data_quality") {
      EventHandler.setToken("show_data_quality", "true", {}, e.data);
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "lagging_metrics") {
      EventHandler.setToken(
        "show_data_source_lagging_metrics",
        "true",
        {},
        e.data
      );
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "flipping_status") {
      EventHandler.setToken("show_flipping_status", "true", {}, e.data);
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "status_message") {
      EventHandler.setToken(
        "show_data_source_status_message",
        "true",
        {},
        e.data
      );
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_audit_changes");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    } else if (e.value === "data_source_audit_changes") {
      EventHandler.setToken(
        "show_data_source_audit_changes",
        "true",
        {},
        e.data
      );
      EventHandler.unsetToken("show_data_source_overview");
      EventHandler.unsetToken("show_data_source_outlier_configuration");
      EventHandler.unsetToken("show_data_source_outlier");
      EventHandler.unsetToken("show_data_quality");
      EventHandler.unsetToken("show_flipping_status");
      EventHandler.unsetToken("show_data_source_status_message");
      EventHandler.unsetToken("show_data_source_lagging_metrics");
      EventHandler.unsetToken("show_data_sampling");
    }
  });

  //
  // Data source main table element
  //

  var elementMainTable = new TableView(
    {
      id: "elementMainTable",
      count: 20,
      drilldown: "row",
      fields:
        'data_name, "last time", "last ingest", priority, state, "lag (event / ingestion)", "last time idx", data_last_lag_seen_idx, data_max_lag_allowed, monitoring, data_monitoring_level, data_monitoring_wdays',
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchDataSourcesPostTable",
      el: $("#elementMainTable"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  // render icons
  renderTableIcon(elementMainTable);

  elementMainTable.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();

      // clean any previously set main token, used for variable purposes
      unsetToken("tk_data_host");
      unsetToken("tk_metric_host");

      setToken(
        "tk_keyid",
        TokenUtils.replaceTokenNames(
          "$row.keyid$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_name",
        TokenUtils.replaceTokenNames(
          "$row.data_name$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_index",
        TokenUtils.replaceTokenNames(
          "$row.data_index$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_sourcetype",
        TokenUtils.replaceTokenNames(
          "$row.data_sourcetype$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_lag_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_last_lag_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_ingestion_lag_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_last_ingestion_lag_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_lag_summary",
        TokenUtils.replaceTokenNames(
          "$row.lag (event / ingestion)$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_lag_seen_idx",
        TokenUtils.replaceTokenNames(
          "$row.data_last_lag_seen_idx$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_eventcount",
        TokenUtils.replaceTokenNames(
          "$row.data_eventcount$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_first_time_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_first_time_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_time_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_last_time_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_time_seen_human",
        TokenUtils.replaceTokenNames(
          "$row.last time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_ingest",
        TokenUtils.replaceTokenNames(
          "$row.data_last_ingest$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_ingest_human",
        TokenUtils.replaceTokenNames(
          "$row.last ingest$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_time_seen_idx",
        TokenUtils.replaceTokenNames(
          "$row.data_last_time_seen_idx$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_time_seen_idx_human",
        TokenUtils.replaceTokenNames(
          "$row.data_last_time_seen_idx (translated)$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_max_lag_allowed",
        TokenUtils.replaceTokenNames(
          "$row.data_max_lag_allowed$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_lag_alert_kpis",
        TokenUtils.replaceTokenNames(
          "$row.data_lag_alert_kpis$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_monitored_state",
        TokenUtils.replaceTokenNames(
          "$row.data_monitored_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_monitoring_level",
        TokenUtils.replaceTokenNames(
          "$row.data_monitoring_level$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_monitoring_wdays",
        TokenUtils.replaceTokenNames(
          "$row.data_monitoring_wdays$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_override_lagging_class",
        TokenUtils.replaceTokenNames(
          "$row.data_override_lagging_class$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_source_state",
        TokenUtils.replaceTokenNames(
          "$row.data_source_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_tracker_runtime",
        TokenUtils.replaceTokenNames(
          "$row.data_tracker_runtime$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_previous_source_state",
        TokenUtils.replaceTokenNames(
          "$row.data_previous_source_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_previous_tracker_runtime",
        TokenUtils.replaceTokenNames(
          "$row.data_previous_tracker_runtime$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_state",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_time",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_time_human",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_time (translated)$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_priority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // dcount hosts
      setToken(
        "tk_dcount_host",
        TokenUtils.replaceTokenNames(
          "$row.dcount_host$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_min_dcount_host",
        TokenUtils.replaceTokenNames(
          "$row.min_dcount_host$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.tk_input_data_source_dcount_host",
        TokenUtils.replaceTokenNames(
          "$row.min_dcount_host$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // outlier
      setToken(
        "tk_outlierenabledstatus",
        TokenUtils.replaceTokenNames(
          "$row.enable_behaviour_analytic$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outliermineventcount",
        TokenUtils.replaceTokenNames(
          "$row.OutlierMinEventCount$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlierlowerthresholdmultiplier",
        TokenUtils.replaceTokenNames(
          "$row.OutlierLowerThresholdMultiplier$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlierupperthresholdmultiplier",
        TokenUtils.replaceTokenNames(
          "$row.OutlierUpperThresholdMultiplier$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlieralertonupper",
        TokenUtils.replaceTokenNames(
          "$row.OutlierAlertOnUpper$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlier_period",
        TokenUtils.replaceTokenNames(
          "$row.OutlierTimePeriod$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlier_span",
        TokenUtils.replaceTokenNames(
          "$row.OutlierSpan$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_isoutlier",
        TokenUtils.replaceTokenNames(
          "$row.isOutlier$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_enable_behaviour_analytic",
        TokenUtils.replaceTokenNames(
          "$row.enable_behaviour_analytic$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // elastic sources
      setToken(
        "tk_elastic_source_search_mode",
        TokenUtils.replaceTokenNames(
          "$row.elastic_source_search_mode$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_elastic_source_search_constraint",
        TokenUtils.replaceTokenNames(
          "$row.elastic_source_search_constraint$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_elastic_source_from_part1",
        TokenUtils.replaceTokenNames(
          "$row.elastic_source_from_part1$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_elastic_source_from_part2",
        TokenUtils.replaceTokenNames(
          "$row.elastic_source_from_part2$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_elastic_mstats_idx",
        TokenUtils.replaceTokenNames(
          "$row.elastic_mstats_idx$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_elastic_mstats_filters",
        TokenUtils.replaceTokenNames(
          "$row.elastic_mstats_filters$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // data sampling
      setToken(
        "tk_data_sampling_status_message",
        TokenUtils.replaceTokenNames(
          "$row.data_sample_status_message$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_sampling_status_colour",
        TokenUtils.replaceTokenNames(
          "$row.data_sample_status_colour$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_sample_anomaly_reason",
        TokenUtils.replaceTokenNames(
          "$row.data_sample_anomaly_reason$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_isanomaly",
        TokenUtils.replaceTokenNames(
          "$row.isAnomaly$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_sample_lastrun",
        TokenUtils.replaceTokenNames(
          "$row.data_sample_lastrun$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // status message
      setToken(
        "tk_status_message",
        TokenUtils.replaceTokenNames(
          "$row.status_message$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // doc href
      setToken(
        "tk_doc_link",
        TokenUtils.replaceTokenNames(
          "$row.doc_link$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_doc_note",
        TokenUtils.replaceTokenNames(
          "$row.doc_note$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_doc_identity_card_is_global",
        TokenUtils.replaceTokenNames(
          "$row.doc_identity_card_is_global$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_doc_key_match",
        TokenUtils.replaceTokenNames(
          "$row.doc_key_match$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // tags
      setToken(
        "tk_tags",
        TokenUtils.replaceTokenNames(
          "$row.tags$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pref-fill current lagging input
      setToken(
        "form.tk_input_lag",
        TokenUtils.replaceTokenNames(
          "$row.data_max_lag_allowed$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pref-fill current wdays input
      setToken(
        "form.tk_input_wdays",
        TokenUtils.replaceTokenNames(
          "$row.data_monitoring_wdays$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill current monitoring level
      setToken(
        "form.tk_input_level",
        TokenUtils.replaceTokenNames(
          "$row.data_monitoring_level$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill current priority
      setToken(
        "form.tk_input_priority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill lagging class override
      setToken(
        "form.modal_input_lag_override_class",
        TokenUtils.replaceTokenNames(
          "$row.data_override_lagging_class$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill alert over kpis
      setToken(
        "form.tk_input_data_lag_alert_kpis",
        TokenUtils.replaceTokenNames(
          "$row.data_lag_alert_kpis$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      ////submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      var tk_data_name = tokens.get("tk_data_name");
      var tk_data_monitored_state = tokens.get("tk_data_monitored_state");
      var tk_data_index = tokens.get("tk_data_index");
      var tk_data_sourcetype = tokens.get("tk_data_sourcetype");

      // Get earliest / latest to be recycled in some use cases
      var tk_earliest = tokens.get("modalTime.earliest");
      var tk_latest = tokens.get("modalTime.latest");

      // Manage Outliers
      var tk_outlierenabledstatus = tokens.get("tk_outlierenabledstatus");
      var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
      var tk_outlierlowerthresholdmultiplier = tokens.get(
        "tk_outlierlowerthresholdmultiplier"
      );
      var tk_outlierupperthresholdmultiplier = tokens.get(
        "tk_outlierupperthresholdmultiplier"
      );
      var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
      var tk_isoutlier = tokens.get("tk_isoutlier");
      var tk_outlier_span = tokens.get("tk_outlier_span");
      var tk_outlier_period = tokens.get("tk_outlier_period");

      // Outliers configuration

      // prefill the current status
      if (tk_outlierenabledstatus && tk_outlierenabledstatus == "true") {
        setToken(
          "form.tk_input_data_source_enable_outlier",
          TokenUtils.replaceTokenNames(
            "true",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        setToken(
          "form.tk_input_data_source_enable_outlier",
          TokenUtils.replaceTokenNames(
            "false",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the current lower multiplier
      if (
        tk_outlierlowerthresholdmultiplier &&
        isNumeric(tk_outlierlowerthresholdmultiplier)
      ) {
        setToken(
          "form.tk_input_data_source_outlier_lower_threshold_multiplier",
          TokenUtils.replaceTokenNames(
            tk_outlierlowerthresholdmultiplier,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the current upper multiplier
      if (
        tk_outlierupperthresholdmultiplier &&
        isNumeric(tk_outlierupperthresholdmultiplier)
      ) {
        setToken(
          "form.tk_input_data_source_outlier_upper_threshold_multiplier",
          TokenUtils.replaceTokenNames(
            tk_outlierupperthresholdmultiplier,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Define the Outliers lowerbound mode
      if (
        tk_outliermineventcount &&
        isNumeric(tk_outliermineventcount) &&
        tk_outliermineventcount > 0
      ) {
        setToken(
          "form.tk_input_data_source_outlier_min_eventcount_mode",
          TokenUtils.replaceTokenNames(
            "static",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "form.tk_input_data_source_outlier_min_eventcount",
          TokenUtils.replaceTokenNames(
            tk_outliermineventcount,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        setToken(
          "form.tk_input_data_source_outlier_min_eventcount_mode",
          TokenUtils.replaceTokenNames(
            "dynamic",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "form.tk_input_data_source_outlier_min_eventcount",
          TokenUtils.replaceTokenNames(
            "disabled",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the current status
      if (tk_outlieralertonupper && tk_outlieralertonupper != "null") {
        setToken(
          "form.tk_input_data_source_outlier_alert_on_upper",
          TokenUtils.replaceTokenNames(
            tk_outlieralertonupper,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the outlier span
      if (tk_outlier_span && tk_outlier_span != "null") {
        setToken(
          "form.TimeOutlierConfigurationDataSourceSpan",
          TokenUtils.replaceTokenNames(
            tk_outlier_span,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the outlier period
      if (tk_outlier_period && tk_outlier_period != "null") {
        setToken(
          "form.TimeOutlierConfigurationDataSource",
          TokenUtils.replaceTokenNames(
            tk_outlier_period,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // href docs
      var tk_doc_link = tokens.get("tk_doc_link");
      var tk_doc_note = tokens.get("tk_doc_note");
      var tk_doc_identity_card_is_global = tokens.get(
        "tk_doc_identity_card_is_global"
      );
      var tk_doc_key_match = tokens.get("tk_doc_key_match");

      // If the documentation reference has not been set, define the href format
      if (tk_doc_link == "null") {
        setToken(
          "tk_doc_link_main",
          TokenUtils.replaceTokenNames(
            "Click here to define a documentation reference",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_doc_modal_target",
          TokenUtils.replaceTokenNames(
            "define_identity_card",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textinput for modification requests
        document.getElementById("input_doc_link").value =
          "link to documentation";
      } else {
        setToken(
          "tk_doc_link_main",
          TokenUtils.replaceTokenNames(
            "Show data source identity card",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_doc_modal_target",
          TokenUtils.replaceTokenNames(
            "manage_identity_card",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textinput for modification requests
        document.getElementById("input_doc_link").value = tk_doc_link;
      }

      if (tk_doc_note == "null") {
        setToken(
          "tk_doc_link",
          TokenUtils.replaceTokenNames(
            "No documentation defined.",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        // replace the textarea for modification requests
        document.getElementById("input_doc_note").value = "documentation note";
      } else {
        // replace the textarea for modification requests
        document.getElementById("input_doc_note").value = tk_doc_note;
      }

      // If the identity card info is global, disable the delete card
      if (tk_doc_identity_card_is_global == "true") {
        document.getElementById(
          "btn_delete_manage_identity_card"
        ).disabled = true;
        document.getElementById(
          "btn_modify_manage_identity_card"
        ).disabled = false;
        setToken(
          "tk_msg_doc_identity_card_is_global",
          TokenUtils.replaceTokenNames(
            "TrackMe info: this is a default identity card configured at the system level, you cannot delete this card but you can create a new card linked to this specific data source, consult: ",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_doc_key_match == "wildcard") {
        document.getElementById(
          "btn_delete_manage_identity_card"
        ).disabled = true;
        document.getElementById(
          "btn_modify_manage_identity_card"
        ).disabled = true;
        setToken(
          "tk_msg_doc_identity_card_is_global",
          TokenUtils.replaceTokenNames(
            "TrackMe info: this is a wildcard matching identity card, this card has to be managed via the API endpoints, consult: ",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        document.getElementById(
          "btn_delete_manage_identity_card"
        ).disabled = false;
        document.getElementById(
          "btn_modify_manage_identity_card"
        ).disabled = false;
        setToken(
          "tk_msg_doc_identity_card_is_global",
          TokenUtils.replaceTokenNames(
            "TrackMe info: this identity card was associated to this data source, you can update or delete this card, consult: ",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // tags
      var tk_tags = tokens.get("tk_tags");

      // define the href depending on the tags
      if (
        tk_tags ==
        "No tags defined, click on Update tags to define one or more tags to be associated with this data source."
      ) {
        setToken(
          "tk_tags_link_main",
          TokenUtils.replaceTokenNames(
            "Click here to define tags",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_tags_modal_target",
          TokenUtils.replaceTokenNames(
            "manage_tags",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        setToken(
          "tk_tags_link_main",
          TokenUtils.replaceTokenNames(
            "Show tags",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_tags_modal_target",
          TokenUtils.replaceTokenNames(
            "manage_tags",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Manage root search for overview, conditionally define the query depending on the search
      var tk_elastic_source_search_mode = tokens.get(
        "tk_elastic_source_search_mode"
      );
      var tk_elastic_source_search_constraint = tokens.get(
        "tk_elastic_source_search_constraint"
      );
      var tk_elastic_source_from_part1 = tokens.get(
        "tk_elastic_source_from_part1"
      );
      var tk_elastic_source_from_part2 = tokens.get(
        "tk_elastic_source_from_part2"
      );
      var tk_elastic_mstats_idx = tokens.get("tk_elastic_mstats_idx");
      var tk_elastic_mstats_filters = tokens.get("tk_elastic_mstats_filters");

      // Handle regular data sources and additional integration modes
      if (tk_elastic_source_search_mode == "null") {
        // cribl integration
        if (/\|cribl:/i.test(tk_data_name)) {
          // Extract the cribl_pipe value
          cribl_pipe_matches = tk_data_name.match(/\|cribl:(.*)/);
          cribl_pipe = cribl_pipe_matches[1];

          // create a token for the cribl_pipe
          setToken(
            "tk_cribl_pipe",
            TokenUtils.replaceTokenNames(
              cribl_pipe,
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );

          // define the root search
          tk_data_source_overview_root_search =
            '| `trackme_tstats` dc(host) as dcount_host count latest(_indextime) as indextime max(_time) as maxtime where index="' +
            tk_data_index +
            '" sourcetype="' +
            tk_data_sourcetype +
            '" cribl_pipe::' +
            cribl_pipe +
            " `trackme_tstats_main_filter` by _time, index, sourcetype span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime)";
          tk_data_source_raw_search = "null";
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "sum",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        }

        // split by custom mode
        else if (/\|key:/i.test(tk_data_name)) {
          regex_matches = tk_data_name.match(/\|key:([^\|]+)\|(.*)/);
          keyName = regex_matches[1];
          keyValue = regex_matches[2];
          tk_data_source_overview_root_search =
            '| `trackme_tstats` dc(host) as dcount_host count latest(_indextime) as indextime max(_time) as maxtime where index="' +
            tk_data_index +
            '" sourcetype="' +
            tk_data_sourcetype +
            '" ' +
            keyName +
            '="' +
            keyValue +
            '" `trackme_tstats_main_filter` by _time, index, sourcetype, source span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime)';
          tk_data_source_raw_search = "null";
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "sum",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        }

        // standard mode
        else {
          tk_data_source_overview_root_search =
            '| `trackme_tstats` dc(host) as dcount_host count latest(_indextime) as indextime max(_time) as maxtime where index="' +
            tk_data_index +
            '" sourcetype="' +
            tk_data_sourcetype +
            '" `trackme_tstats_main_filter` by _time, index, sourcetype span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime)';
          tk_data_source_raw_search = "null";
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "sum",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        }
      } else if (tk_elastic_source_search_mode == "tstats") {
        tk_data_source_overview_root_search =
          "| `trackme_tstats` dc(host) as dcount_host count latest(_indextime) as indextime max(_time) as maxtime where " +
          tk_elastic_source_search_constraint +
          " by _time, index, sourcetype span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime)";
        tk_data_source_raw_search =
          "?q=search%20" + encodeURI(tk_elastic_source_search_constraint);
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "sum",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_elastic_source_search_mode == "raw") {
        tk_data_source_overview_root_search =
          tk_elastic_source_search_constraint +
          " | eval delta=(_indextime-_time), event_lag=(now() - _time) | bucket _time span=1s | stats count, avg(delta) as delta, latest(event_lag) as event_lag, dc(host) as dcount_host by _time";
        tk_data_source_raw_search =
          "?q=search%20" + encodeURI(tk_elastic_source_search_constraint);
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "sum",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (
        tk_elastic_source_search_mode == "from" &&
        tk_elastic_source_from_part1 != "null" &&
        tk_elastic_source_from_part2 != "null"
      ) {
        if (/datamodel:/i.test(tk_elastic_source_search_constraint)) {
          // rest search needs special handling
          tk_data_source_overview_root_search =
            "| " +
            tk_elastic_source_search_mode +
            " " +
            tk_elastic_source_from_part1 +
            " | " +
            tk_elastic_source_from_part2 +
            " | eventstats max(_time) as maxtime | eval delta=(_indextime-_time), event_lag=(now() - maxtime) | bucket _time span=1s | stats count, avg(delta) as delta, latest(event_lag) as event_lag, dc(host) as dcount_host by _time";
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "sum",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        } else if (/lookup:/i.test(tk_elastic_source_search_constraint)) {
          // rest search needs special handling
          tk_data_source_overview_root_search =
            '| mstats latest(_value) as value where `trackme_metrics_idx` (metric_name=trackme.eventcount_4h OR metric_name=trackme.lag_event_sec OR metric_name=trackme.hostcount_4h) object_category="data_source" object="' +
            tk_data_name +
            '" by metric_name span=5m | eval {metric_name}=value | stats first(trackme.eventcount_4h) as count, first(trackme.lag_event_sec) as delta, max(trackme.hostcount_4h) as dcount_host by _time | eval event_lag=delta';
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "latest",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        }

        tk_data_source_raw_search =
          "?q=" +
          encodeURI("| ") +
          encodeURI(tk_elastic_source_search_mode) +
          " " +
          encodeURI(tk_elastic_source_from_part1) +
          encodeURI(" | ") +
          encodeURI(tk_elastic_source_from_part2);
      } else if (
        tk_elastic_source_search_mode == "rest_from" &&
        tk_elastic_source_from_part1 != "null" &&
        tk_elastic_source_from_part2 != "null"
      ) {
        // rest seach requires escaping
        tk_elastic_source_from_part2 = tk_elastic_source_from_part2.replace(
          /\"/g,
          '\\"'
        );

        if (/datamodel:/i.test(tk_elastic_source_search_constraint)) {
          // rest search needs special handling
          tk_data_source_overview_root_search =
            "| rest " +
            tk_elastic_source_from_part1 +
            ' /servicesNS/admin/search/search/jobs/export search="' +
            "| from " +
            tk_elastic_source_from_part2 +
            "| eventstats max(_time) as maxtime | eval delta=(_indextime-_time), event_lag=(now() - maxtime) | bucket _time span=1s | stats count, avg(delta) as delta, latest(event_lag) as event_lag, dc(host) as dcount_host by _time" +
            ' | eval data_name=\\"' +
            tk_data_name +
            '\\", data_index=\\"' +
            tk_data_index +
            '\\", data_sourcetype=\\"' +
            tk_data_sourcetype +
            '\\", data_last_ingestion_lag_seen=data_last_ingest-data_last_time_seen"' +
            ' output_mode="csv"' +
            ' earliest_time="' +
            tk_earliest +
            '"' +
            ' latest_time="' +
            tk_latest +
            '"' +
            "| head 1 | table value | restextractforstats" +
            ' | eval _time=strptime(_time, "%Y-%m-%d %H:%M:%S.%3N %Z")';
          tk_data_source_raw_search =
            "?q=" +
            encodeURI(
              "| rest " +
                tk_elastic_source_from_part1 +
                ' /servicesNS/admin/search/search/jobs/export search="' +
                "| from " +
                tk_elastic_source_from_part2 +
                '| head 100 | fields _time _raw"' +
                ' output_mode="csv"' +
                ' earliest_time="' +
                tk_earliest +
                '"' +
                ' latest_time="' +
                tk_latest +
                '"' +
                " | head 1 | table value | restextractraw" +
                ' | eval _time=strptime(_time, "%Y-%m-%d %H:%M:%S.%3N %Z")'
            );
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "sum",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        } else if (/lookup:/i.test(tk_elastic_source_search_constraint)) {
          // rest search needs special handling
          tk_data_source_overview_root_search =
            '| mstats latest(_value) as value where `trackme_metrics_idx` (metric_name=trackme.eventcount_4h OR metric_name=trackme.lag_event_sec OR metric_name=trackme.hostcount_4h) object_category="data_source" object="' +
            tk_data_name +
            '" by metric_name span=5m | eval {metric_name}=value | stats first(trackme.eventcount_4h) as count, first(trackme.lag_event_sec) as delta, max(trackme.hostcount_4h) as dcount_host by _time | eval event_lag=delta';
          tk_data_source_raw_search =
            "?q=" +
            encodeURI(
              "| rest " +
                tk_elastic_source_from_part1 +
                ' /servicesNS/admin/search/search/jobs/export search="' +
                "| from " +
                tk_elastic_source_from_part2 +
                "| head 100" +
                '" output_mode="csv"' +
                "| head 1"
            );
          setToken(
            "tk_data_source_timechart_count_aggreg",
            TokenUtils.replaceTokenNames(
              "latest",
              _.extend(submittedTokenModel.toJSON(), e.data)
            )
          );
        }
      } else if (
        tk_elastic_source_search_mode == "mstats" &&
        tk_elastic_mstats_filters != "null"
      ) {
        tk_data_source_overview_root_search =
          '| mstats latest(_value) as value where `trackme_metrics_idx` (metric_name=trackme.eventcount_4h OR metric_name=trackme.lag_event_sec OR metric_name=trackme.hostcount_4h) object_category="data_source" object="' +
          tk_data_name +
          '" by metric_name span=5m | eval {metric_name}=value | stats first(trackme.eventcount_4h) as count, first(trackme.lag_event_sec) as delta, max(trackme.hostcount_4h) as dcount_host by _time | eval event_lag=delta';
        if (tk_elastic_mstats_idx == "null") {
          tk_data_source_raw_search =
            "?q=" +
            encodeURI("| msearch ") +
            encodeURI("index=*") +
            " " +
            encodeURI('filter="' + tk_elastic_mstats_filters + '"') +
            encodeURI(' earliest="-5m" latest=now');
        } else {
          tk_data_source_raw_search =
            "?q=" +
            encodeURI("| msearch ") +
            encodeURI(tk_elastic_mstats_idx) +
            " " +
            encodeURI('filter="' + tk_elastic_mstats_filters + '"') +
            encodeURI(' earliest="-5m" latest=now');
        }
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "latest",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // tstats over rest
      else if (
        tk_elastic_source_search_mode == "rest_tstats" &&
        tk_elastic_source_from_part1 != "null" &&
        tk_elastic_source_from_part2 != "null"
      ) {
        // rest seach requires escaping
        tk_elastic_source_from_part2 = tk_elastic_source_from_part2.replace(
          /\"/g,
          '\\"'
        );
        // rest search needs special handling
        tk_data_source_overview_root_search =
          "| rest count=0 " +
          tk_elastic_source_from_part1 +
          ' /servicesNS/admin/search/search/jobs/export search="' +
          "| tstats dc(host) as dcount_host count latest(_indextime) as indextime max(_time) as maxtime where " +
          tk_elastic_source_from_part2 +
          ' by _time, index, sourcetype span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime) | fields _time count delta event_lag dcount_host"' +
          ' output_mode="csv"' +
          ' earliest_time="' +
          tk_earliest +
          '"' +
          ' latest_time="' +
          tk_latest +
          '"' +
          " | table value | restextractforstats" +
          ' | eval _time=strptime(_time, "%Y-%m-%d %H:%M:%S.%3N %Z")';
        tk_data_source_raw_search =
          "?q=" +
          encodeURI(
            "| rest count=0 " +
              tk_elastic_source_from_part1 +
              ' /servicesNS/admin/search/search/jobs/export search="' +
              "search " +
              tk_elastic_source_from_part2 +
              ' | head 100 | fields _time _raw"' +
              ' output_mode="csv"' +
              ' earliest_time="' +
              tk_earliest +
              '"' +
              ' latest_time="' +
              tk_latest +
              '"' +
              " | head 1 | table value | restextractraw" +
              ' | eval _time=strptime(_time, "%Y-%m-%d %H:%M:%S.%3N %Z")'
          );
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "sum",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // raw over rest
      else if (
        tk_elastic_source_search_mode == "rest_raw" &&
        tk_elastic_source_from_part1 != "null" &&
        tk_elastic_source_from_part2 != "null"
      ) {
        // rest seach requires escaping
        tk_elastic_source_from_part2 = tk_elastic_source_from_part2.replace(
          /\"/g,
          '\\"'
        );
        // rest search needs special handling
        tk_data_source_overview_root_search =
          "| rest count=0 " +
          tk_elastic_source_from_part1 +
          ' /servicesNS/admin/search/search/jobs/export search="' +
          "search " +
          tk_elastic_source_from_part2 +
          ' | eval delta=(_indextime-_time), event_lag=(now() - _time) | bucket _time span=1s | stats count, avg(delta) as delta, latest(event_lag) as event_lag, dc(host) as dcount_host by _time"' +
          ' output_mode="csv"' +
          ' earliest_time="' +
          tk_earliest +
          '"' +
          ' latest_time="' +
          tk_latest +
          '"' +
          " | table value | restextractforstats" +
          ' | eval _time=strptime(_time, "%Y-%m-%d %H:%M:%S.%3N %Z")';
        tk_data_source_raw_search =
          "?q=" +
          encodeURI(
            "| rest count=0 " +
              tk_elastic_source_from_part1 +
              ' /servicesNS/admin/search/search/jobs/export search="' +
              "search " +
              tk_elastic_source_from_part2 +
              ' | head 100 | fields _time _raw"' +
              ' output_mode="csv"' +
              ' earliest_time="' +
              tk_earliest +
              '"' +
              ' latest_time="' +
              tk_latest +
              '"' +
              " | head 1 | table value | restextractraw" +
              ' | eval _time=strptime(_time, "%Y-%m-%d %H:%M:%S.%3N %Z")'
          );
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "sum",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // mstats over rest (uses summary data)
      else if (
        tk_elastic_source_search_mode == "rest_mstats" &&
        tk_elastic_mstats_filters != "null"
      ) {
        tk_data_source_overview_root_search =
          '| mstats latest(_value) as value where `trackme_metrics_idx` (metric_name=trackme.eventcount_4h OR metric_name=trackme.lag_event_sec OR metric_name=trackme.hostcount_4h) object_category="data_source" object="' +
          tk_data_name +
          '" by metric_name span=5m | eval {metric_name}=value | stats first(trackme.eventcount_4h) as count, first(trackme.lag_event_sec) as delta, max(trackme.hostcount_4h) as dcount_host by _time | eval event_lag=delta';
        if (tk_elastic_mstats_idx == "null") {
          tk_data_source_raw_search =
            "?q=" +
            encodeURI("| msearch ") +
            encodeURI("index=*") +
            " " +
            encodeURI('filter="' + tk_elastic_mstats_filters + '"') +
            encodeURI(' earliest="-5m" latest=now');
        } else {
          tk_data_source_raw_search =
            "?q=" +
            encodeURI("| msearch ") +
            encodeURI(tk_elastic_mstats_idx) +
            " " +
            encodeURI('filter="' + tk_elastic_mstats_filters + '"') +
            encodeURI(' earliest="-5m" latest=now');
        }
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "latest",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        tk_data_source_overview_root_search =
          '| `trackme_tstats` dc(host) as dcount_host count latest(_indextime) as indextime max(_time) as maxtime where index="' +
          tk_data_index +
          '" sourcetype="' +
          tk_data_sourcetype +
          '" `trackme_tstats_main_filter` by _time, index, sourcetype span=1s | eval delta=(indextime-_time), event_lag=(now() - maxtime)';
        setToken(
          "tk_data_source_timechart_count_aggreg",
          TokenUtils.replaceTokenNames(
            "sum",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      setToken(
        "tk_data_source_overview_root_search",
        TokenUtils.replaceTokenNames(
          tk_data_source_overview_root_search,
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // Define the history search

      // Honour elastic sources

      if (tk_elastic_source_search_mode == "null") {
        // cribl integration
        if (/\|cribl:/i.test(tk_data_name)) {
          var search_data_source =
            "search" +
            '?q=search%20index%3D"' +
            encodeURI(tk_data_index) +
            '"' +
            ' sourcetype%3D"' +
            encodeURI(tk_data_sourcetype) +
            '"' +
            " cribl_pipe::" +
            encodeURI(cribl_pipe);
        }

        // split by custom
        else if (/\|key:/i.test(tk_data_name)) {
          regex_matches = tk_data_name.match(/\|key:([^\|]+)\|(.*)/);
          keyName = regex_matches[1];
          keyValue = regex_matches[2];
          var search_data_source =
            "search" +
            '?q=search%20index%3D"' +
            encodeURI(tk_data_index) +
            '"' +
            ' sourcetype%3D"' +
            encodeURI(tk_data_sourcetype) +
            '" ' +
            keyName +
            '%3D"' +
            encodeURI(keyValue) +
            '"';
        }

        // standard split
        else {
          var search_data_source =
            "search" +
            '?q=search%20index%3D"' +
            encodeURI(tk_data_index) +
            '"' +
            ' sourcetype%3D"' +
            encodeURI(tk_data_sourcetype) +
            '"';
        }
      } else {
        var search_data_source = "search" + tk_data_source_raw_search;
      }

      // state
      var tk_data_source_state = tokens.get("tk_data_source_state");

      // priority
      var tk_priority = tokens.get("tk_priority");

      // Define the URL target
      document.getElementById("btn_search_data_source").href =
        search_data_source;

      // Dynamically manage buttons states
      if (tk_data_monitored_state == "enabled") {
        document.getElementById("btn_enable_monitoring").disabled = true;
        document.getElementById("btn_disable_monitoring").disabled = false;
        setToken(
          "tk_data_monitored_state_class",
          TokenUtils.replaceTokenNames(
            "title_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        document.getElementById("btn_enable_monitoring").disabled = false;
        document.getElementById("btn_disable_monitoring").disabled = true;
        setToken(
          "tk_data_monitored_state_class",
          TokenUtils.replaceTokenNames(
            "title_grey",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Dynamically manage Ack button
      if (tk_data_source_state == "red") {
        document.getElementById("btn_ack_data_source").disabled = false;
      } else {
        document.getElementById("btn_ack_data_source").disabled = true;
      }

      // Dynamically manage state color
      if (tk_data_source_state == "green") {
        setToken(
          "tk_data_source_state_class",
          TokenUtils.replaceTokenNames(
            "title_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_source_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_source_state == "orange") {
        setToken(
          "tk_data_source_state_class",
          TokenUtils.replaceTokenNames(
            "title_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_source_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_source_state == "blue") {
        setToken(
          "tk_data_source_state_class",
          TokenUtils.replaceTokenNames(
            "title_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_source_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_source_state == "red") {
        setToken(
          "tk_data_source_state_class",
          TokenUtils.replaceTokenNames(
            "title_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_source_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Dynamically manage priority color
      if (tk_priority == "low") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_low_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_priority == "medium") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_medium_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_priority == "high") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_high_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Data sampling

      var tk_data_sampling_status_colour = tokens.get(
        "tk_data_sampling_status_colour"
      );

      if (tk_data_sampling_status_colour == "green") {
        setToken(
          "tk_data_sampling_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_sampling_status_colour == "orange") {
        setToken(
          "tk_data_sampling_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_sampling_status_colour == "blue") {
        setToken(
          "tk_data_sampling_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_sampling_status_colour == "red") {
        setToken(
          "tk_data_sampling_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Enable modal context
      $("#modal_manage").modal();
    }
  });

  var resultsLinkelementMainTable = new ResultsLinkView({
    id: "resultsLinkelementMainTable",
    managerid: "searchDataSourcesPostTable",
    "link.exportResults.visible": false,
    el: $("#resultsLinkelementMainTable"),
  });

  resultsLinkelementMainTable
    .render()
    .$el.appendTo($("resultsLinkelementMainTable"));

  var singleFormTotalDataSource = new SingleView(
    {
      id: "singleFormTotalDataSource",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "DATA SOURCES",
      managerid: "searchSingleDataSource1",
      el: $("#singleFormTotalDataSource"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataSource.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_source_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalDataSourceAlerts = new SingleView(
    {
      id: "singleFormTotalDataSourceAlerts",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xffb347"]',
      underLabel: "ANY PRIORITY DATA SOURCES IN ALERT",
      managerid: "searchSingleDataSourceInAlert",
      el: $("#singleFormTotalDataSourceAlerts"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataSourceAlerts.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.inputDataPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_source_state",
        TokenUtils.replaceTokenNames(
          "red",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalDataSourceAlertsHighPriority = new SingleView(
    {
      id: "singleFormTotalDataSourceAlertsHighPriority",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xff6961"]',
      underLabel: "HIGH PRIORITY DATA SOURCES IN ALERT",
      managerid: "searchSingleDataSourceHighPriority",
      el: $("#singleFormTotalDataSourceAlertsHighPriority"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataSourceAlertsHighPriority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_source_state",
        TokenUtils.replaceTokenNames(
          "red",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataPriority",
        TokenUtils.replaceTokenNames(
          "high",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalDataSourceDisabled = new SingleView(
    {
      id: "singleFormTotalDataSourceDisabled",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "DATA SOURCES NOT MONITORED",
      managerid: "searchSingleDataSourceNotMonitored",
      el: $("#singleFormTotalDataSourceDisabled"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataSourceDisabled.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "disabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_source_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  //
  // Data host tracking
  //

  var DonutDataHostCountByStateAndPriority = new semiCircleDonut(
    {
      id: "DonutDataHostCountByStateAndPriority",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "all",
      height: "170",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchSingleDataHostDonutPriorities",
      el: $("#DonutDataHostCountByStateAndPriority"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  DonutDataHostCountByStateAndPriority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_host_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataHostPriority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var DonutDataHostCountByPriority = new semiCircleDonut(
    {
      id: "DonutDataHostCountByPriority",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "none",
      height: "170",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchSingleDataHostDonutAlerts",
      el: $("#DonutDataHostCountByPriority"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  var singleFormTotalDataHost = new SingleView(
    {
      id: "singleFormTotalDataHost",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "DATA HOSTS",
      managerid: "searchSingleDataHost1",
      el: $("#singleFormTotalDataHost"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataHost.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_host_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataHostPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalDataHostAlerts = new SingleView(
    {
      id: "singleFormTotalDataHostAlerts",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xffb347"]',
      underLabel: "ANY PRIORITY DATA HOSTS IN ALERT",
      managerid: "searchSingleDataHostInAlert",
      el: $("#singleFormTotalDataHostAlerts"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataHostAlerts.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.inputDataHostPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_host_state",
        TokenUtils.replaceTokenNames(
          "red",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalDataHostAlertsHighPriority = new SingleView(
    {
      id: "singleFormTotalDataHostAlertsHighPriority",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xff6961"]',
      underLabel: "HIGH PRIORITY DATA HOSTS IN ALERT",
      managerid: "searchSingleDataHostHighPriority",
      el: $("#singleFormTotalDataHostAlertsHighPriority"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataHostAlertsHighPriority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_host_state",
        TokenUtils.replaceTokenNames(
          "red",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataHostPriority",
        TokenUtils.replaceTokenNames(
          "high",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalDataHostDisabled = new SingleView(
    {
      id: "singleFormTotalDataHostDisabled",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "DATA HOSTS NOT MONITORED",
      managerid: "searchSingleDataHostNotMonitored",
      el: $("#singleFormTotalDataHostDisabled"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalDataHostDisabled.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.data_monitored_state",
        TokenUtils.replaceTokenNames(
          "disabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.data_host_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputDataHostPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var inputDataHostIndexes = new MultiSelectInput(
    {
      id: "inputDataHostIndexes",
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "data_index",
      valuePrefix: 'data_index="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "data_index",
      value: "$form.inputDataHostIndexes$",
      managerid: "searchPopulateDataHostsIndexes",
      el: $("#inputDataHostIndexes"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataHostIndexes.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostIndexes);
    multiselectAll(inputDataHostIndexes);
  });

  var inputDataHostSourcetypes = new MultiSelectInput(
    {
      id: "inputDataHostSourcetypes",
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "data_sourcetype",
      valuePrefix: 'data_sourcetype="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "data_sourcetype",
      value: "$form.inputDataHostSourcetypes$",
      managerid: "searchPopulateDataHostsSourcetypes",
      el: $("#inputDataHostSourcetypes"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataHostSourcetypes.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostSourcetypes);
    multiselectAll(inputDataHostSourcetypes);
  });

  var inputDataHostFilterMode = new DropdownInput(
    {
      id: "inputDataHostFilterMode",
      choices: [
        {
          label: "Includes",
          value: "",
        },
        {
          label: "Excludes",
          value: "NOT",
        },
      ],
      searchWhenChanged: true,
      default: "",
      showClearButton: true,
      initialValue: "",
      selectFirstChoice: false,
      value: "$form.inputDataHostFilterMode$",
      el: $("#inputDataHostFilterMode"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataHostFilterMode.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostFilterMode);
  });

  inputDataHostFilterMode.on("valueChange", function (e) {
    if (e.value === "NOT") {
      EventHandler.unsetToken("form.inputDataHostFilter");
    }
  });

  var inputDataHostFilter = new TextInput(
    {
      id: "inputDataHostFilter",
      searchWhenChanged: true,
      prefix: '"*',
      suffix: '*"',
      initialValue: "*",
      default: "*",
      value: "$form.inputDataHostFilter$",
      el: $("#inputDataHostFilter"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataHostFilter.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostFilter);
  });

  var inputDataHost = new MultiSelectInput(
    {
      id: "inputDataHost",
      tokenDependencies: {
        depends: "$show_data_host_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "data_host",
      valuePrefix: 'data_host="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "data_host",
      value: "$form.inputDataHost$",
      managerid: "searchPopulateDataHosts",
      el: $("#inputDataHost"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataHost.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHost);
    multiselectAll(inputDataHost);
  });

  var inputDataHostState = new MultiSelectInput(
    {
      id: "inputDataHostState",
      choices: [
        { label: "ALL", value: "*" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
        { label: "Orange", value: "orange" },
        { label: "Red", value: "red" },
      ],
      valuePrefix: 'data_host_state="',
      valueSuffix: '"',
      delimiter: " OR ",
      searchWhenChanged: true,
      initialValue: ["*"],
      value: "$form.data_host_state$",
      el: $("#inputDataHostState"),
    },
    { tokens: true }
  ).render();

  inputDataHostState.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostState);
    multiselectAll(inputDataHostState);
  });

  var inputDataHostMonitoredState = new DropdownInput(
    {
      id: "inputDataHostMonitoredState",
      choices: [
        {
          label: "ALL",
          value: "*",
        },
        {
          label: "Enabled",
          value: "enabled",
        },
        {
          label: "Disabled",
          value: "disabled",
        },
      ],
      searchWhenChanged: true,
      default: "enabled",
      showClearButton: true,
      prefix: 'data_monitored_state="',
      suffix: '"',
      initialValue: "enabled",
      selectFirstChoice: false,
      value: "$form.data_monitored_state$",
      el: $("#inputDataHostMonitoredState"),
    },
    {
      tokens: true,
    }
  ).render();

  inputDataHostMonitoredState.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostMonitoredState);
  });

  var inputDataHostPriority = new MultiSelectInput(
    {
      id: "inputDataHostPriority",
      choices: [
        { label: "ALL", value: "*" },
        { label: "low", value: "low" },
        { label: "medium", value: "medium" },
        { label: "high", value: "high" },
      ],
      valuePrefix: 'priority="',
      valueSuffix: '"',
      delimiter: " OR ",
      searchWhenChanged: true,
      initialValue: ["*"],
      value: "$form.inputDataHostPriority$",
      el: $("#inputDataHostPriority"),
    },
    { tokens: true }
  ).render();

  inputDataHostPriority.on("change", function (newValue) {
    FormUtils.handleValueChange(inputDataHostPriority);
    multiselectAll(inputDataHostPriority);
  });

  var refreshHostForm = new DropdownInput(
    {
      id: "refreshHostForm",
      choices: [
        {
          value: "60",
          label: "1 min",
        },
        {
          value: "120",
          label: "2 min",
        },
        {
          value: "300",
          label: "5 min",
        },
        {
          value: "3600",
          label: "none",
        },
      ],
      selectFirstChoice: false,
      default: "300",
      showClearButton: true,
      initialValue: "300",
      searchWhenChanged: true,
      value: "$refresh$",
      el: $("#refreshHostForm"),
    },
    {
      tokens: true,
    }
  ).render();

  refreshForm.on("change", function (newValue) {
    FormUtils.handleValueChange(refreshForm);
  });

  var elementMainTableHost = new TableView(
    {
      id: "elementMainTableHost",
      count: 20,
      drilldown: "row",
      fields:
        'data_host, sourcetype_summary, "last time", "last ingest", priority, state, "lag (event / ingestion)", data_max_lag_allowed, monitoring, data_monitoring_wdays',
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchMainTableHost",
      el: $("#elementMainTableHost"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  // render icons
  renderTableIcon(elementMainTableHost);

  elementMainTableHost.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();

      // clean any previously set main token, used for variable purposes
      unsetToken("tk_data_name");
      unsetToken("tk_metric_host");

      setToken(
        "tk_keyid",
        TokenUtils.replaceTokenNames(
          "$row.keyid$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_host",
        TokenUtils.replaceTokenNames(
          "$row.data_host$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_index",
        TokenUtils.replaceTokenNames(
          "$row.data_index_raw$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_sourcetype",
        TokenUtils.replaceTokenNames(
          "$row.data_sourcetype_raw$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_host_st_summary",
        TokenUtils.replaceTokenNames(
          "$row.data_host_st_summary_raw$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_host_alerting_policy",
        TokenUtils.replaceTokenNames(
          "$row.data_host_alerting_policy$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_lag_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_last_lag_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_ingestion_lag_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_last_ingestion_lag_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_lag_summary",
        TokenUtils.replaceTokenNames(
          "$row.lag (event / ingestion)$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_eventcount",
        TokenUtils.replaceTokenNames(
          "$row.data_eventcount$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_first_time_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_first_time_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_time_seen",
        TokenUtils.replaceTokenNames(
          "$row.data_last_time_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_time_seen_human",
        TokenUtils.replaceTokenNames(
          "$row.last time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_ingest",
        TokenUtils.replaceTokenNames(
          "$row.data_last_ingest$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_last_ingest_human",
        TokenUtils.replaceTokenNames(
          "$row.last ingest$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_max_lag_allowed",
        TokenUtils.replaceTokenNames(
          "$row.data_max_lag_allowed$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_lag_alert_kpis",
        TokenUtils.replaceTokenNames(
          "$row.data_lag_alert_kpis$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_monitored_state",
        TokenUtils.replaceTokenNames(
          "$row.data_monitored_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_monitoring_wdays",
        TokenUtils.replaceTokenNames(
          "$row.data_monitoring_wdays$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_override_lagging_class",
        TokenUtils.replaceTokenNames(
          "$row.data_override_lagging_class$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_host_state",
        TokenUtils.replaceTokenNames(
          "$row.data_host_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_tracker_runtime",
        TokenUtils.replaceTokenNames(
          "$row.data_tracker_runtime$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_previous_host_state",
        TokenUtils.replaceTokenNames(
          "$row.data_previous_host_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_data_previous_tracker_runtime",
        TokenUtils.replaceTokenNames(
          "$row.data_previous_tracker_runtime$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_state",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_time",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_time_human",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_time (translated)$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_priority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // outlier
      setToken(
        "tk_outlierenabledstatus",
        TokenUtils.replaceTokenNames(
          "$row.enable_behaviour_analytic$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outliermineventcount",
        TokenUtils.replaceTokenNames(
          "$row.OutlierMinEventCount$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlierlowerthresholdmultiplier",
        TokenUtils.replaceTokenNames(
          "$row.OutlierLowerThresholdMultiplier$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlierupperthresholdmultiplier",
        TokenUtils.replaceTokenNames(
          "$row.OutlierUpperThresholdMultiplier$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlieralertonupper",
        TokenUtils.replaceTokenNames(
          "$row.OutlierAlertOnUpper$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlier_period",
        TokenUtils.replaceTokenNames(
          "$row.OutlierTimePeriod$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_outlier_span",
        TokenUtils.replaceTokenNames(
          "$row.OutlierSpan$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_isoutlier",
        TokenUtils.replaceTokenNames(
          "$row.isOutlier$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // status message
      setToken(
        "tk_status_message",
        TokenUtils.replaceTokenNames(
          "$row.status_message$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // tags
      setToken(
        "tk_data_host_tags",
        TokenUtils.replaceTokenNames(
          "$row.data_host_tags$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pref-fill current lagging input
      setToken(
        "form.tk_input_lag_host",
        TokenUtils.replaceTokenNames(
          "$row.data_max_lag_allowed$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pref-fill current wdays input
      setToken(
        "form.tk_input_wdays_host",
        TokenUtils.replaceTokenNames(
          "$row.data_monitoring_wdays$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill current priority
      setToken(
        "form.tk_input_host_priority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill lagging class override
      setToken(
        "form.modal_input_lag_override_class_host",
        TokenUtils.replaceTokenNames(
          "$row.data_override_lagging_class$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill alert over kpis
      setToken(
        "form.tk_input_data_lag_alert_kpis_host",
        TokenUtils.replaceTokenNames(
          "$row.data_lag_alert_kpis$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill alerting policy
      setToken(
        "form.tk_input_host_alerting_policy",
        TokenUtils.replaceTokenNames(
          "$row.data_host_alerting_policy$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      ////submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      var tk_data_monitored_state = tokens.get("tk_data_monitored_state");
      var tk_data_host = tokens.get("tk_data_host");

      // state
      var tk_data_host_state = tokens.get("tk_data_host_state");

      // priority
      var tk_priority = tokens.get("tk_priority");

      // Define the history search
      var search_data_host =
        "search" +
        '?q=search%20index%3D"*" ' +
        'host="' +
        encodeURI(tk_data_host) +
        '"';

      // Define the URL target
      document.getElementById("btn_search_data_host").href = search_data_host;

      // Dynamically manage buttons states
      if (tk_data_monitored_state == "enabled") {
        document.getElementById("btn_enable_monitoring_host").disabled = true;
        document.getElementById("btn_disable_monitoring_host").disabled = false;
        setToken(
          "tk_data_monitored_state_class",
          TokenUtils.replaceTokenNames(
            "title_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        document.getElementById("btn_enable_monitoring_host").disabled = false;
        document.getElementById("btn_disable_monitoring_host").disabled = true;
        setToken(
          "tk_data_monitored_state_class",
          TokenUtils.replaceTokenNames(
            "title_grey",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Dynamically manage Ack button
      if (tk_data_host_state == "red") {
        document.getElementById("btn_ack_data_host").disabled = false;
      } else {
        document.getElementById("btn_ack_data_host").disabled = true;
      }

      // Dynamically manage state color
      if (tk_data_host_state == "green") {
        setToken(
          "tk_data_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_host_state == "orange") {
        setToken(
          "tk_data_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_host_state == "blue") {
        setToken(
          "tk_data_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_data_host_state == "red") {
        setToken(
          "tk_data_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_data_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Dynamically manage priority color
      if (tk_priority == "low") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_low_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_priority == "medium") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_medium_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_priority == "high") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_high_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Manage Outliers
      var tk_outlierenabledstatus = tokens.get("tk_outlierenabledstatus");
      var tk_outliermineventcount = tokens.get("tk_outliermineventcount");
      var tk_outlierlowerthresholdmultiplier = tokens.get(
        "tk_outlierlowerthresholdmultiplier"
      );
      var tk_outlierupperthresholdmultiplier = tokens.get(
        "tk_outlierupperthresholdmultiplier"
      );
      var tk_outlieralertonupper = tokens.get("tk_outlieralertonupper");
      var tk_isoutlier = tokens.get("tk_isoutlier");
      var tk_outlier_span = tokens.get("tk_outlier_span");
      var tk_outlier_period = tokens.get("tk_outlier_period");

      // Outliers configuration

      // prefill the current status
      if (tk_outlierenabledstatus && tk_outlierenabledstatus == "true") {
        setToken(
          "form.tk_input_data_host_enable_outlier",
          TokenUtils.replaceTokenNames(
            "true",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        setToken(
          "form.tk_input_data_host_enable_outlier",
          TokenUtils.replaceTokenNames(
            "false",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the current lower multiplier
      if (
        tk_outlierlowerthresholdmultiplier &&
        isNumeric(tk_outlierlowerthresholdmultiplier)
      ) {
        setToken(
          "form.tk_input_data_host_outlier_lower_threshold_multiplier",
          TokenUtils.replaceTokenNames(
            tk_outlierlowerthresholdmultiplier,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the current upper multiplier
      if (
        tk_outlierupperthresholdmultiplier &&
        isNumeric(tk_outlierupperthresholdmultiplier)
      ) {
        setToken(
          "form.tk_input_data_host_outlier_upper_threshold_multiplier",
          TokenUtils.replaceTokenNames(
            tk_outlierupperthresholdmultiplier,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Define the Outliers lowerbound mode
      if (
        tk_outliermineventcount &&
        isNumeric(tk_outliermineventcount) &&
        tk_outliermineventcount > 0
      ) {
        setToken(
          "form.tk_input_data_host_outlier_min_eventcount_mode",
          TokenUtils.replaceTokenNames(
            "static",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "form.tk_input_data_host_outlier_min_eventcount",
          TokenUtils.replaceTokenNames(
            tk_outliermineventcount,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        setToken(
          "form.tk_input_data_host_outlier_min_eventcount_mode",
          TokenUtils.replaceTokenNames(
            "dynamic",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "form.tk_input_data_host_outlier_min_eventcount",
          TokenUtils.replaceTokenNames(
            "disabled",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the current status
      if (tk_outlieralertonupper && tk_outlieralertonupper != "null") {
        setToken(
          "form.tk_input_data_host_outlier_alert_on_upper",
          TokenUtils.replaceTokenNames(
            tk_outlieralertonupper,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the outlier span
      if (tk_outlier_span && tk_outlier_span != "null") {
        setToken(
          "form.TimeOutlierConfigurationDataHostSpan",
          TokenUtils.replaceTokenNames(
            tk_outlier_span,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // prefill the outlier period
      if (tk_outlier_period && tk_outlier_period != "null") {
        setToken(
          "form.TimeOutlierConfigurationDataHost",
          TokenUtils.replaceTokenNames(
            tk_outlier_period,
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Explicitly refresh the get tags search
      searchGetDataHostTags.startSearch();

      // Enable modal context
      $("#modal_manage_host").modal();
    }
  });

  var resultsLinkelementMainTableHost = new ResultsLinkView({
    id: "resultsLinkelementMainTableHost",
    managerid: "searchMainTableHost",
    "link.exportResults.visible": false,
    el: $("#resultsLinkelementMainTableHost"),
  });

  resultsLinkelementMainTableHost
    .render()
    .$el.appendTo($("resultsLinkelementMainTableHost"));

  //
  // Metric host tracking
  //

  var DonutMetricHostCountByStateAndPriority = new semiCircleDonut(
    {
      id: "DonutMetricHostCountByStateAndPriority",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "all",
      height: "170",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchSingleMetricHostDonutPriorities",
      el: $("#DonutMetricHostCountByStateAndPriority"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  DonutMetricHostCountByStateAndPriority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.metric_host_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputMetricHostPriority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.metric_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var DonutMetricHostCountByPriority = new semiCircleDonut(
    {
      id: "DonutMetricHostCountByPriority",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "none",
      height: "170",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchSingleMetricHostDonutAlerts",
      el: $("#DonutMetricHostCountByPriority"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  var singleFormTotalMetricHost = new SingleView(
    {
      id: "singleFormTotalMetricHost",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "METRIC HOSTS",
      managerid: "searchSingleMetricHost1",
      el: $("#singleFormTotalMetricHost"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalMetricHost.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.metric_host_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputMetricHostPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.metric_monitored_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalMetricHostAlerts = new SingleView(
    {
      id: "singleFormTotalMetricHostAlerts",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xffb347"]',
      underLabel: "ANY PRIORITY METRIC HOSTS IN ALERT",
      managerid: "searchSingleMetricHostInAlert",
      el: $("#singleFormTotalMetricHostAlerts"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalMetricHostAlerts.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.inputMetricHostPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.metric_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.metric_host_state",
        TokenUtils.replaceTokenNames(
          "red",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalMetricHostAlertsHighPriority = new SingleView(
    {
      id: "singleFormTotalMetricHostAlertsHighPriority",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xff6961"]',
      underLabel: "HIGH PRIORITY METRIC HOSTS IN ALERT",
      managerid: "searchSingleMetricHostHighPriority",
      el: $("#singleFormTotalMetricHostAlertsHighPriority"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalMetricHostAlertsHighPriority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.metric_host_state",
        TokenUtils.replaceTokenNames(
          "red",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.metric_monitored_state",
        TokenUtils.replaceTokenNames(
          "enabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputMetricHostPriority",
        TokenUtils.replaceTokenNames(
          "high",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var singleFormTotalMetricHostDisabled = new SingleView(
    {
      id: "singleFormTotalMetricHostDisabled",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "METRIC HOSTS NOT MONITORED",
      managerid: "searchSingleMetricHostNotMonitored",
      el: $("#singleFormTotalMetricHostDisabled"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  singleFormTotalMetricHostDisabled.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      setToken(
        "form.metric_monitored_state",
        TokenUtils.replaceTokenNames(
          "disabled",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.metric_host_state",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "form.inputMetricHostPriority",
        TokenUtils.replaceTokenNames(
          "*",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
    }
  });

  var inputMetricHostIndexes = new MultiSelectInput(
    {
      id: "inputMetricHostIndexes",
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "metric_index",
      valuePrefix: 'metric_index="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "metric_index",
      value: "$form.inputMetricHostIndexes$",
      managerid: "searchPopulateMetricHostsIndexes",
      el: $("#inputMetricHostIndexes"),
    },
    {
      tokens: true,
    }
  ).render();

  inputMetricHostIndexes.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostIndexes);
    multiselectAll(inputMetricHostIndexes);
  });

  var inputMetricHostCategories = new MultiSelectInput(
    {
      id: "inputMetricHostCategories",
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "metric_category",
      valuePrefix: 'metric_category="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "metric_category",
      value: "$form.inputMetricHostCategories$",
      managerid: "searchPopulateMetricHostsCategories",
      el: $("#inputMetricHostCategories"),
    },
    {
      tokens: true,
    }
  ).render();

  inputMetricHostCategories.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostCategories);
    multiselectAll(inputMetricHostCategories);
  });

  var inputMetricHostFilterMode = new DropdownInput(
    {
      id: "inputMetricHostFilterMode",
      choices: [
        {
          label: "Includes",
          value: "",
        },
        {
          label: "Excludes",
          value: "NOT",
        },
      ],
      searchWhenChanged: true,
      default: "",
      showClearButton: true,
      initialValue: "",
      selectFirstChoice: false,
      value: "$form.inputMetricHostFilterMode$",
      el: $("#inputMetricHostFilterMode"),
    },
    {
      tokens: true,
    }
  ).render();

  inputMetricHostFilterMode.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostFilterMode);
  });

  var inputMetricHostFilter = new TextInput(
    {
      id: "inputMetricHostFilter",
      searchWhenChanged: true,
      prefix: '"*',
      suffix: '*"',
      initialValue: "*",
      value: "$form.inputMetricHostFilter$",
      el: $("#inputMetricHostFilter"),
    },
    {
      tokens: true,
    }
  ).render();

  inputMetricHostFilter.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostFilter);
  });

  var inputMetricHost = new MultiSelectInput(
    {
      id: "inputMetricHost",
      tokenDependencies: {
        depends: "$show_metric_host_tracker$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      showClearButton: true,
      labelField: "metric_host",
      valuePrefix: 'metric_host="',
      valueSuffix: '"',
      delimiter: " OR ",
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "metric_host",
      value: "$form.inputMetricHost$",
      managerid: "searchPopulateMetricHosts",
      el: $("#inputMetricHost"),
    },
    {
      tokens: true,
    }
  ).render();

  inputMetricHost.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHost);
    multiselectAll(inputMetricHost);
  });

  var inputMetricHostState = new MultiSelectInput(
    {
      id: "inputMetricHostState",
      choices: [
        { label: "ALL", value: "*" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
        { label: "Orange", value: "orange" },
        { label: "Red", value: "red" },
      ],
      valuePrefix: 'metric_host_state="',
      valueSuffix: '"',
      delimiter: " OR ",
      searchWhenChanged: true,
      initialValue: ["*"],
      value: "$form.metric_host_state$",
      el: $("#inputMetricHostState"),
    },
    { tokens: true }
  ).render();

  inputMetricHostState.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostState);
    multiselectAll(inputMetricHostState);
  });

  var inputMetricHostMonitoredState = new DropdownInput(
    {
      id: "inputMetricHostMonitoredState",
      choices: [
        {
          label: "ALL",
          value: "*",
        },
        {
          label: "Enabled",
          value: "enabled",
        },
        {
          label: "Disabled",
          value: "disabled",
        },
      ],
      searchWhenChanged: true,
      default: "enabled",
      showClearButton: true,
      prefix: 'metric_monitored_state="',
      suffix: '"',
      initialValue: "enabled",
      selectFirstChoice: false,
      value: "$form.metric_monitored_state$",
      el: $("#inputMetricHostMonitoredState"),
    },
    {
      tokens: true,
    }
  ).render();

  inputMetricHostMonitoredState.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostMonitoredState);
  });

  var inputMetricHostPriority = new MultiSelectInput(
    {
      id: "inputMetricHostPriority",
      choices: [
        { label: "ALL", value: "*" },
        { label: "low", value: "low" },
        { label: "medium", value: "medium" },
        { label: "high", value: "high" },
      ],
      valuePrefix: 'priority="',
      valueSuffix: '"',
      delimiter: " OR ",
      searchWhenChanged: true,
      initialValue: ["*"],
      value: "$form.inputMetricHostPriority$",
      el: $("#inputMetricHostPriority"),
    },
    { tokens: true }
  ).render();

  inputMetricHostPriority.on("change", function (newValue) {
    FormUtils.handleValueChange(inputMetricHostPriority);
    multiselectAll(inputMetricHostPriority);
  });

  var refreshMetricHostForm = new DropdownInput(
    {
      id: "refreshMetricHostForm",
      choices: [
        {
          value: "60",
          label: "1 min",
        },
        {
          value: "120",
          label: "2 min",
        },
        {
          value: "300",
          label: "5 min",
        },
        {
          value: "none",
          label: "none",
        },
      ],
      selectFirstChoice: false,
      default: "300",
      showClearButton: true,
      initialValue: "300",
      searchWhenChanged: true,
      value: "$refresh$",
      el: $("#refreshMetricHostForm"),
    },
    {
      tokens: true,
    }
  ).render();

  refreshMetricHostForm.on("change", function (newValue) {
    FormUtils.handleValueChange(refreshMetricHostForm);
  });

  var elementMainTableMetricHost = new TableView(
    {
      id: "elementMainTableMetricHost",
      count: 20,
      drilldown: "row",
      fields:
        'metric_host, metric_index, metric_category, metric_details_human, "last time", priority, state, monitoring',
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchMainTableMetricHost",
      el: $("#elementMainTableMetricHost"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  // render icons
  renderTableIcon(elementMainTableMetricHost);

  elementMainTableMetricHost.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();

      // clean any previously set main token, used for variable purposes
      unsetToken("tk_data_name");
      unsetToken("tk_data_host");

      setToken(
        "tk_keyid",
        TokenUtils.replaceTokenNames(
          "$row.keyid$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_host",
        TokenUtils.replaceTokenNames(
          "$row.metric_host$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_index",
        TokenUtils.replaceTokenNames(
          "$row.metric_index_raw$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_category",
        TokenUtils.replaceTokenNames(
          "$row.metric_category_raw$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_first_time_seen",
        TokenUtils.replaceTokenNames(
          "$row.metric_first_time_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_last_time_seen",
        TokenUtils.replaceTokenNames(
          "$row.metric_last_time_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_last_time_seen_human",
        TokenUtils.replaceTokenNames(
          "$row.last time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_last_lag_seen",
        TokenUtils.replaceTokenNames(
          "$row.metric_last_lag_seen$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_details",
        TokenUtils.replaceTokenNames(
          "$row.metric_details_raw$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_monitored_state",
        TokenUtils.replaceTokenNames(
          "$row.metric_monitored_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_host_state",
        TokenUtils.replaceTokenNames(
          "$row.metric_host_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_tracker_runtime",
        TokenUtils.replaceTokenNames(
          "$row.metric_tracker_runtime$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_previous_host_state",
        TokenUtils.replaceTokenNames(
          "$row.metric_previous_host_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_metric_previous_tracker_runtime",
        TokenUtils.replaceTokenNames(
          "$row.metric_previous_tracker_runtime$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_state",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_time",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_latest_flip_time_human",
        TokenUtils.replaceTokenNames(
          "$row.latest_flip_time (translated)$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_priority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // pre-fill current priority
      setToken(
        "form.tk_input_metric_host_priority",
        TokenUtils.replaceTokenNames(
          "$row.priority$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // logical group
      setToken(
        "tk_object_group_name",
        TokenUtils.replaceTokenNames(
          "$row.object_group_name$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_object_group_state",
        TokenUtils.replaceTokenNames(
          "$row.object_group_state$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_object_group_green_percent",
        TokenUtils.replaceTokenNames(
          "$row.object_group_green_percent$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_object_group_min_green_percent",
        TokenUtils.replaceTokenNames(
          "$row.object_group_min_green_percent$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // status message
      setToken(
        "tk_status_message",
        TokenUtils.replaceTokenNames(
          "$row.status_message$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      ////submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      var tk_metric_monitored_state = tokens.get("tk_metric_monitored_state");
      var tk_metric_host = tokens.get("tk_metric_host");

      // state
      var tk_metric_host_state = tokens.get("tk_metric_host_state");

      // priority
      var tk_priority = tokens.get("tk_priority");

      // Define the history search
      var search_metric_host =
        '| mcatalog values(metric_name), values(_dims) where index=* host="' +
        tk_metric_host +
        '" by host';
      search_metric_host =
        "search" +
        "?q=" +
        encodeURI(search_metric_host) +
        "&earliest=-15m&latest=now";

      // Define the history msearch
      var msearch_metric_host =
        '| msearch index=* filter="host="' + tk_metric_host + '""';
      msearch_metric_host =
        "search" +
        "?q=" +
        encodeURI(msearch_metric_host) +
        "&earliest=-15m&latest=now";

      // Define the history msearch
      var mpreview_metric_host =
        '| mpreview index=* filter="host="' + tk_metric_host + '""';
      mpreview_metric_host =
        "search" +
        "?q=" +
        encodeURI(mpreview_metric_host) +
        "&earliest=-15m&latest=now";

      // Define the URL target
      document.getElementById("btn_search_metric_host").href =
        search_metric_host;
      document.getElementById("btn_msearch_metric_host").href =
        msearch_metric_host;
      document.getElementById("btn_mpreview_metric_host").href =
        mpreview_metric_host;

      var search_metric_host_live_report =
        '| savedsearch "trackMe - metric host live report" host="' +
        tk_metric_host +
        '"';
      search_metric_host_live_report =
        "search" +
        "?q=" +
        encodeURI(search_metric_host_live_report) +
        "&earliest=-15m&latest=now";

      // Define the URL target
      document.getElementById("btn_search_metric_host_live_report").href =
        search_metric_host_live_report;

      // Dynamically manage buttons states
      if (tk_metric_monitored_state == "enabled") {
        document.getElementById(
          "btn_enable_monitoring_metric_host"
        ).disabled = true;
        document.getElementById(
          "btn_disable_monitoring_metric_host"
        ).disabled = false;
        setToken(
          "tk_metric_monitored_state_class",
          TokenUtils.replaceTokenNames(
            "title_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else {
        document.getElementById(
          "btn_enable_monitoring_metric_host"
        ).disabled = false;
        document.getElementById(
          "btn_disable_monitoring_metric_host"
        ).disabled = true;
        setToken(
          "tk_metric_monitored_state_class",
          TokenUtils.replaceTokenNames(
            "title_grey",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Dynamically manage Ack button
      if (tk_metric_host_state == "red") {
        document.getElementById("btn_ack_metric_host").disabled = false;
      } else {
        document.getElementById("btn_ack_metric_host").disabled = true;
      }

      // Dynamically manage state color
      if (tk_metric_host_state == "green") {
        setToken(
          "tk_metric_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_metric_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_green",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_metric_host_state == "orange") {
        setToken(
          "tk_metric_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_metric_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_orange",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_metric_host_state == "blue") {
        setToken(
          "tk_metric_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_metric_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_blue",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_metric_host_state == "red") {
        setToken(
          "tk_metric_host_state_class",
          TokenUtils.replaceTokenNames(
            "title_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
        setToken(
          "tk_metric_host_status_message_class",
          TokenUtils.replaceTokenNames(
            "status_message_red",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Dynamically manage priority color
      if (tk_priority == "low") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_low_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_priority == "medium") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_medium_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      } else if (tk_priority == "high") {
        setToken(
          "tk_priority_class",
          TokenUtils.replaceTokenNames(
            "title_high_priority",
            _.extend(submittedTokenModel.toJSON(), e.data)
          )
        );
      }

      // Explicitly refresh the get tags search
      searchGetMetricHostTags.startSearch();

      // Enable modal context
      $("#modal_manage_metric_host").modal();
    }
  });

  var resultsLinkelementMainTableMetricHost = new ResultsLinkView({
    id: "resultsLinkelementMainTableMetricHost",
    managerid: "searchMainTableMetricHost",
    "link.exportResults.visible": false,
    el: $("#resultsLinkelementMainTableMetricHost"),
  });

  resultsLinkelementMainTableMetricHost
    .render()
    .$el.appendTo($("resultsLinkelementMainTableMetricHost"));

  //
  // Flipping statuses
  //

  var input_timerange_audit_flip = new TimeRangeInput(
    {
      id: "input_timerange_audit_flip",
      searchWhenChanged: true,
      default: { latest_time: "now", earliest_time: "-24h" },
      earliest_time: "$form.timerange_audit_flip.earliest$",
      latest_time: "$form.timerange_audit_flip.latest$",
      el: $("#input_timerange_audit_flip"),
    },
    { tokens: true }
  ).render();

  input_timerange_audit_flip.on("change", function (newValue) {
    FormUtils.handleValueChange(input_timerange_audit_flip);
  });

  var inputAuditFlipObjectFilter = new TextInput(
    {
      id: "inputAuditFlipObjectFilter",
      searchWhenChanged: true,
      default: "*",
      prefix: 'object="*',
      suffix: '*"',
      initialValue: "*",
      value: "$form.inputAuditFlipObjectFilter$",
      el: $("#inputAuditFlipObjectFilter"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditFlipObjectFilter.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditFlipObjectFilter);
  });

  var inputAuditFlipObjectCategory = new DropdownInput(
    {
      id: "inputAuditFlipObjectCategory",
      tokenDependencies: {
        depends: "$show_audit_flip$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "object_category",
      prefix: 'object_category="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "object_category",
      value: "$form.audit_flip_object_category$",
      managerid: "searchAuditFlipObjectCategory",
      el: $("#inputAuditFlipObjectCategory"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditFlipObjectCategory.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditFlipObjectCategory);
  });

  var inputAuditFlipObject = new DropdownInput(
    {
      id: "inputAuditFlipObject",
      tokenDependencies: {
        depends: "$show_audit_flip$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "object",
      prefix: 'object="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "object",
      value: "$form.audit_flip_object$",
      managerid: "searchAuditFlipObject",
      el: $("#inputAuditFlipObject"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditFlipObject.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditFlipObject);
  });

  var elementMainTableAuditFlip = new TableView(
    {
      id: "elementMainTableAuditFlip",
      count: 100,
      drilldown: "none",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchMainAuditFlipTable",
      el: $("#elementMainTableAuditFlip"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  // render icons
  renderTableIcon(elementMainTableAuditFlip);

  var resultsLinkelementMainTableAuditFlip = new ResultsLinkView({
    id: "resultsLinkelementMainTableAuditFlip",
    managerid: "searchMainAuditFlipTable",
    "link.exportResults.visible": false,
    el: $("#resultsLinkelementMainTableAuditFlip"),
  });

  resultsLinkelementMainTableAuditFlip
    .render()
    .$el.appendTo($("resultsLinkelementMainTableAuditFlip"));

  //
  // Audit changes
  //

  var input_timerange_audit_changes = new TimeRangeInput(
    {
      id: "input_timerange_audit_changes",
      searchWhenChanged: true,
      default: { latest_time: "now", earliest_time: "-24h" },
      earliest_time: "$form.timerange_audit_changes.earliest$",
      latest_time: "$form.timerange_audit_changes.latest$",
      el: $("#input_timerange_audit_changes"),
    },
    { tokens: true }
  ).render();

  input_timerange_audit_changes.on("change", function (newValue) {
    FormUtils.handleValueChange(input_timerange_audit_changes);
  });

  var inputAuditChangesAction = new DropdownInput(
    {
      id: "inputAuditChangesAction",
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "action",
      prefix: 'action="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "action",
      value: "$form.audit_changes_action$",
      managerid: "searchAuditChangesAction",
      el: $("#inputAuditChangesAction"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditChangesAction.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditChangesAction);
  });

  var inputAuditChangesUser = new DropdownInput(
    {
      id: "inputAuditChangesUser",
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "user",
      prefix: 'user="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "user",
      value: "$form.audit_changes_user$",
      managerid: "searchAuditChangesUser",
      el: $("#inputAuditChangesUser"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditChangesUser.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditChangesUser);
  });

  var inputAuditChangesObjectCategory = new DropdownInput(
    {
      id: "inputAuditChangesObjectCategory",
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "object_category",
      prefix: 'object_category="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "object_category",
      value: "$form.audit_changes_object_category$",
      managerid: "searchAuditChangesObjectCategory",
      el: $("#inputAuditChangesObjectCategory"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditChangesObjectCategory.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditChangesObjectCategory);
  });

  var inputAuditChangesChangeType = new DropdownInput(
    {
      id: "inputAuditChangesChangeType",
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "change_type",
      prefix: 'change_type="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "change_type",
      value: "$form.audit_changes_change_type$",
      managerid: "searchAuditChangesChangeType",
      el: $("#inputAuditChangesChangeType"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditChangesChangeType.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditChangesChangeType);
  });

  var inputAuditChangesObject = new DropdownInput(
    {
      id: "inputAuditChangesObject",
      tokenDependencies: {
        depends: "$show_audit_changes$",
      },
      choices: [
        {
          label: "ALL",
          value: "*",
        },
      ],
      searchWhenChanged: true,
      default: "*",
      showClearButton: true,
      labelField: "object",
      prefix: 'object="',
      suffix: '"',
      initialValue: "*",
      selectFirstChoice: false,
      valueField: "object",
      value: "$form.audit_changes_object$",
      managerid: "searchAuditChangesObject",
      el: $("#inputAuditChangesObject"),
    },
    {
      tokens: true,
    }
  ).render();

  inputAuditChangesObject.on("change", function (newValue) {
    FormUtils.handleValueChange(inputAuditChangesObject);
  });

  var elementMainTableAuditChanges = new TableView(
    {
      id: "elementMainTableAuditChanges",
      count: 100,
      drilldown: "none",
      "refresh.display": "none",
      wrap: "true",
      managerid: "searchMainAuditChanges",
      el: $("#elementMainTableAuditChanges"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  // render icons
  renderTableIcon(elementMainTableAuditChanges);

  var resultsLinkelementMainTableAuditChanges = new ResultsLinkView({
    id: "resultsLinkelementMainTableAuditChanges",
    managerid: "searchMainAuditChanges",
    "link.exportResults.visible": false,
    el: $("#resultsLinkelementMainTableAuditChanges"),
  });

  resultsLinkelementMainTableAuditChanges
    .render()
    .$el.appendTo($("resultsLinkelementMainTableAuditChanges"));

  //
  // Tracking UI alerts
  //

  var singleFormEnabledAlerts = new SingleView(
    {
      id: "singleFormEnabledAlerts",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0x7fbfff"]',
      underLabel: "ENABLED ALERTS",
      managerid: "searchSingleEnabledAlerts",
      el: $("#singleFormEnabledAlerts"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  var singleFormTriggeredAlerts = new SingleView(
    {
      id: "singleFormTriggeredAlerts",
      showTrendIndicator: "1",
      unitPosition: "after",
      useThousandSeparators: "1",
      numberPrecision: "0",
      colorBy: "value",
      colorMode: "block",
      drilldown: "all",
      height: "95",
      showSparkline: "1",
      "trellis.scales.shared": "1",
      useColors: "1",
      trendDisplayMode: "absolute",
      "trellis.enabled": "0",
      trendColorInterpretation: "standard",
      "trellis.size": "medium",
      rangeValues: "[0]",
      rangeColors: '["0x7fbfff","0xffb347"]',
      underLabel: "TRIGGERED ALERTS IN THE PAST 24h",
      managerid: "search_alerts_triggered_history",
      el: $("#singleFormTriggeredAlerts"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  var DonutAlertTriggered = new semiCircleDonut(
    {
      id: "DonutAlertTriggered",
      type: "semicircle_donut.semicircle_donut",
      resizable: true,
      drilldown: "none",
      height: "200",
      "refresh.display": "progressbar",
      "semicircle_donut.semicircle_donut.colorField": "color",
      "semicircle_donut.semicircle_donut.cutoutPercentage": "50",
      "semicircle_donut.semicircle_donut.legendPosition": "top",
      "semicircle_donut.semicircle_donut.type": "half",
      "trellis.enabled": "0",
      "trellis.scales.shared": "1",
      "trellis.size": "medium",
      managerid: "searchDonutAlertsTriggered",
      el: $("#DonutAlertTriggered"),
    },
    { tokens: true, tokenNamespace: "submitted" }
  ).render();

  var element_alerts_main_table = new TableView(
    {
      id: "element_alerts_main_table",
      count: 100,
      dataOverlayMode: "none",
      drilldown: "row",
      fields:
        'title, cron_schedule, schedule_window, alert.suppress.fields, alert.suppress.period, disabled, next_scheduled_time, " "',
      percentagesRow: "false",
      rowNumbers: "false",
      totalsRow: "false",
      wrap: "true",
      managerid: "search_alerts_main_table",
      el: $("#element_alerts_main_table"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  element_alerts_main_table.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();

      setToken(
        "tk_alert_title",
        TokenUtils.replaceTokenNames(
          "$row.title$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_cron_schedule",
        TokenUtils.replaceTokenNames(
          "$row.cron_schedule$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_schedule_window",
        TokenUtils.replaceTokenNames(
          "$row.schedule_window$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_suppress_fields",
        TokenUtils.replaceTokenNames(
          "$row.alert.suppress.fields$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_suppress_period",
        TokenUtils.replaceTokenNames(
          "$row.alert.suppress.period$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_disabled",
        TokenUtils.replaceTokenNames(
          "$row.disabled$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_next_scheduled_time",
        TokenUtils.replaceTokenNames(
          "$row.next_scheduled_time$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );
      setToken(
        "tk_alert_actions",
        TokenUtils.replaceTokenNames(
          "$row.actions$",
          _.extend(submittedTokenModel.toJSON(), e.data)
        )
      );

      // Define the alert URL
      var url = TokenUtils.replaceTokenNames(
        "{{SPLUNKWEB_URL_PREFIX}}/app/trackme/alert?s=%2FservicesNS%2Fnobody%2Ftrackme%2Fsaved%2Fsearches%2F$row.id$",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      var alert_url =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        url;

      // Define the URL target
      document.getElementById("btn_url_modal_manage_alert").href = alert_url;

      ////submitTokens();

      // When the Submit button is clicked, get all the form fields by accessing token values
      var tokens = mvc.Components.get("default");

      // Retrieve alert title token
      var tk_alert_title = tokens.get("tk_alert_title");

      // Define the history search
      var alert_search_history =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        "//app/trackme/search" +
        '?q=search%20index%3D_audit%20action%3D"alert_fired"%20ss_app%3D"trackme"%20ss_name%3D"' +
        encodeURI(tk_alert_title) +
        '"';

      // Define the URL target
      document.getElementById("btn_url_modal_history_alert").href =
        alert_search_history;

      // Enable modal context
      $("#modal_manage_alerts").modal();
    }
  });

  // render icons
  renderTableIcon(element_alerts_main_table);

  var resultsLinkelement_alerts_main_table = new ResultsLinkView({
    id: "resultsLinkelement_alerts_main_table",
    managerid: "search_alerts_main_table",
    "link.exportResults.visible": false,
    el: $("#resultsLinkelement_alerts_main_table"),
  });

  resultsLinkelement_alerts_main_table
    .render()
    .$el.appendTo($("resultsLinkelement_alerts_main_table"));

  // Elastic Sources Shared
  var SingleElasticSources = new SingleView({
      "id": "SingleElasticSources",
      "trendDisplayMode": "absolute",
      "drilldown": "none",
      "trendColorInterpretation": "standard",
      "useColors": "0",
      "colorBy": "value",
      "showTrendIndicator": "1",
      "showSparkline": "1",
      "trellis.enabled": "0",
      "numberPrecision": "0",
      "rangeColors": "[\"0x77dd77\",\"0x0877a6\",\"0xf8be34\",\"0xf1813f\",\"0xdc4e41\"]",
      "trellis.size": "medium",
      "colorMode": "none",
      "rangeValues": "[0,30,70,100]",
      "unitPosition": "after",
      "trellis.scales.shared": "1",
      "useThousandSeparators": "1",
      "underLabel": "current elastic source(s)",
      "managerid": "searchSingleElasticSources",
      "el": $('#SingleElasticSources')
  }, {
      tokens: true,
      tokenNamespace: "submitted"
  }).render();

  // Elastic Sources Dedicated
  var SingleElasticSourcesDedicated = new SingleView({
      "id": "SingleElasticSourcesDedicated",
      "trendDisplayMode": "absolute",
      "drilldown": "none",
      "trendColorInterpretation": "standard",
      "useColors": "0",
      "colorBy": "value",
      "showTrendIndicator": "1",
      "showSparkline": "1",
      "trellis.enabled": "0",
      "numberPrecision": "0",
      "rangeColors": "[\"0x77dd77\",\"0x0877a6\",\"0xf8be34\",\"0xf1813f\",\"0xdc4e41\"]",
      "trellis.size": "medium",
      "colorMode": "none",
      "rangeValues": "[0,30,70,100]",
      "unitPosition": "after",
      "trellis.scales.shared": "1",
      "useThousandSeparators": "1",
      "underLabel": "current elastic source(s)",
      "managerid": "searchSingleElasticSourcesDedicated",
      "el": $('#SingleElasticSourcesDedicated')
  }, {
      tokens: true,
      tokenNamespace: "submitted"
  }).render();

  // Elastic Sources Shared

  var modal_input_elastic_sources_search = new TextInput({
      "id": "modal_input_elastic_sources_search",
      "default": "*",
      "searchWhenChanged": true,
      "value": "$form.tk_input_elastic_sources_search$",
      "el": $('#modal_input_elastic_sources_search')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_sources_search.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_sources_search);
  });

  // Elastic Sources Dedicated

  var modal_input_elastic_sources_dedicated_search = new TextInput({
      "id": "modal_input_elastic_sources_dedicated_search",
      "default": "*",
      "searchWhenChanged": true,
      "value": "$form.tk_input_elastic_sources_dedicated_search$",
      "el": $('#modal_input_elastic_sources_dedicated_search')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_sources_dedicated_search.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_sources_dedicated_search);
  });

  // Elastic Sources Shared

  var tableElasticSources = new TableElement({
    "id": "tableElasticSources",
    "tokenDependencies": {
        "depends": "$show_table_elastic_sources$"
    },
    "count": 8,
    "drilldown": "none",
    "fields": "data_name, search_mode, search_constraint, elastic_data_index, elastic_data_sourcetype, select",
    "refresh.display": "none",
    "wrap": "false",
    "managerid": "searchElasticSources",
    "el": $('#tableElasticSources')
    }, {
    tokens: true,
    tokenNamespace: "submitted"
  }).render();

  renderTableCheckBox("tableElasticSources", "removeElasticSourceShared");

  // Elastic Sources Dedicated

  var tableElasticSourcesDedicated = new TableElement({
      "id": "tableElasticSourcesDedicated",
      "tokenDependencies": {
          "depends": "$show_table_elastic_sources_dedicated$"
      },
      "count": 8,
      "drilldown": "none",
      "fields": "data_name, search_mode, search_constraint, elastic_data_index, elastic_data_sourcetype, select",
      "refresh.display": "none",
      "wrap": "false",
      "managerid": "searchElasticSourcesDedicated",
      "el": $('#tableElasticSourcesDedicated')
  }, {
      tokens: true,
      tokenNamespace: "submitted"
  }).render();

  renderTableCheckBox("tableElasticSourcesDedicated", "removeElasticSourceDedicated");

  // Simulation
  var tableElasticSourcesTest = new TableView({
      "id": "tableElasticSourcesTest",
      "tokenDependencies": {
          "depends": "$start_simulation_elastic_sources$"
      },
      "count": 1,
      "drilldown": "row",
      "refresh.display": "none",
      "wrap": "false",
      "managerid": "searchElasticSourcesTest",
      "el": $('#tableElasticSourcesTest')
  }, {
      tokens: true,
      tokenNamespace: "submitted"
  }).render();

  // render icons
  renderTableIcon(tableElasticSourcesTest);

  var resultsLinktableElasticSourcesTest = new ResultsLinkView({
    id: "resultsLinktableElasticSourcesTest",
    managerid: "searchDataSourcesPostTable",
    "link.exportResults.visible": false,
    el: $("#resultsLinktableElasticSourcesTest"),
  });

  resultsLinktableElasticSourcesTest
    .render()
    .$el.appendTo($("resultsLinktableElasticSourcesTest"));

  // elastic sources

  var modal_input_elastic_source_search_type = new DropdownInput({
      "id": "modal_input_elastic_source_search_type",
      "choices": [{
              "label": "tstats",
              "value": "tstats"
          },
          {
              "label": "raw",
              "value": "raw"
          },
          {
              "label": "from",
              "value": "from"
          },
          {
              "label": "mstats",
              "value": "mstats"
          },
          {
              "label": "rest (tstats)",
              "value": "rest_tstats"
          },
          {
              "label": "rest (raw)",
              "value": "rest_raw"
          },
          {
              "label": "rest (from)",
              "value": "rest_from"
          },
          {
              "label": "rest (mstats)",
              "value": "rest_mstats"
          },
      ],
      "searchWhenChanged": false,
      "default": "tstats",
      "showClearButton": true,
      "initialValue": "tstats",
      "selectFirstChoice": false,
      "value": "$form.tk_input_elastic_source_search_type$",
      "el": $('#modal_input_elastic_source_search_type')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_source_search_type.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_source_search_type);
  });

  var modal_input_elastic_source_data_name = new TextInput({
      "id": "modal_input_elastic_source_data_name",
      "searchWhenChanged": false,
      "value": "$form.tk_input_elastic_source_data_name$",
      "el": $('#modal_input_elastic_source_data_name')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_source_data_name.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_source_data_name);
  });

  var modal_input_elastic_source_elastic_data_index = new TextInput({
      "id": "modal_input_elastic_source_elastic_data_index",
      "searchWhenChanged": false,
      "default": "none",
      "initialValue": "none",
      "value": "$form.tk_input_elastic_source_elastic_data_index$",
      "el": $('#modal_input_elastic_source_elastic_data_index')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_source_elastic_data_index.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_source_elastic_data_index);
  });

  var modal_input_elastic_source_elastic_data_sourcetype = new TextInput({
      "id": "modal_input_elastic_source_elastic_data_sourcetype",
      "searchWhenChanged": false,
      "default": "none",
      "initialValue": "none",
      "value": "$form.tk_input_elastic_source_elastic_data_sourcetype$",
      "el": $('#modal_input_elastic_source_elastic_data_sourcetype')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_source_elastic_data_sourcetype.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_source_elastic_data_sourcetype);
  });

  var modal_input_elastic_source_earliest = new TextInput({
      "id": "modal_input_elastic_source_earliest",
      "searchWhenChanged": false,
      "default": "-4h",
      "initialValue": "-4h",
      "value": "$form.tk_input_elastic_source_earliest$",
      "el": $('#modal_input_elastic_source_earliest')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_source_earliest.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_source_earliest);
  });

  var modal_input_elastic_source_latest = new TextInput({
      "id": "modal_input_elastic_source_latest",
      "searchWhenChanged": false,
      "default": "+4h",
      "initialValue": "+4h",
      "value": "$form.tk_input_elastic_source_latest$",
      "el": $('#modal_input_elastic_source_latest')
  }, {
      tokens: true
  }).render();

  modal_input_elastic_source_latest.on("change", function(newValue) {
      FormUtils.handleValueChange(modal_input_elastic_source_latest);
  });


  //
  // BEGIN OPERATIONS
  //

  // Audit changes
  var tokens = mvc.Components.get("default");
  var currentUser = Splunk.util.getConfigValue("USERNAME");
  tokens.set("currentUser", currentUser);
  var auditendpoint_URl =
    "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_audit_changes/";

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
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_reset";

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
      "/en-US/splunkd/__raw/services/trackme/v1/metric_hosts/mh_reset";

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
    //submitTokens();
    search_alerts_main_table.startSearch();
    searchDonutAlertsTriggered.startSearch();
    searchAlertTriggeredOverTime.startSearch();
  });

  $("#btn_refresh_alert_tracking").click(function () {
    //submitTokens();
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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // fire up some searches
    setToken("start_get_tags_for_custom_alert", "true");

    $("#add_custom_alert").modal();
  });

  $("#btn_modal_custom_alert_add_new").click(function () {
    //submitTokens();

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_enable_monitoring";

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_enable_monitoring";

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/metric_hosts/mh_enable_monitoring";

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
    //submitTokens();

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
      "/en-US/splunkd/__raw/services/trackme/v1/metric_hosts/mh_update_priority";

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_disable_monitoring";

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_host = tokens.get("tk_data_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_disable_monitoring";

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_metric_host = tokens.get("tk_metric_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/metric_hosts/mh_disable_monitoring";

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
    //submitTokens();

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

    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring/" +
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

    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring/" +
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
    //submitTokens();

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

    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_host_monitoring/" +
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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_lagging_definition/" +
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
    //submitTokens();

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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_custom_lagging_definition";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_custom_lagging_definition/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_keyid = tokens.get("tk_keyid");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_custom_lagging_definition/" +
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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_whitelist_index";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_whitelist_index/" +
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
    //submitTokens();

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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_whitelist_index";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_whitelist_index/" +
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
    //submitTokens();

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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_whitelist_index";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_whitelist_index/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_host = tokens.get(
      "tk_input_data_source_blacklist_host"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_host";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_host/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_host = tokens.get(
      "tk_input_data_host_blacklist_host"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_host";

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_index = tokens.get("tk_input_blacklist_index");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_index";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_index/" +
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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_index/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_index = tokens.get(
      "tk_input_data_host_blacklist_index"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_index";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_host/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_index = tokens.get(
      "tk_input_metric_host_blacklist_index"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_index";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_index/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_sourcetype = tokens.get(
      "tk_input_data_source_blacklist_sourcetype"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_sourcetype";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_sourcetype/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_data_name = tokens.get(
      "tk_input_data_source_blacklist_data_name"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_data_name";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_source_monitoring_blacklist_data_name/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_sourcetype = tokens.get(
      "tk_input_data_host_blacklist_sourcetype"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_sourcetype";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_host_monitoring_blacklist_sourcetype/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_host = tokens.get(
      "tk_input_metric_host_blacklist_host"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_host";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_host/" +
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tk_input_blacklist_metric_category = tokens.get(
      "tk_input_metric_host_blacklist_metric_category"
    );

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_metric_category";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_metric_host_monitoring_blacklist_metric_category/" +
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
    //submitTokens();

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
    //submitTokens();

    // Show input modal
    $("#modal_manage").modal();
  });

  // data hosts monitoring

  $("#btn_modal_modify_host_cancel").click(function () {
    //submitTokens();

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

      //submitTokens();
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
    // hide the table view
    $("#divElasticSourcesTest").css("display", "none");
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

      // notify
      notify(
        "info",
        "bottom",
        "Elastic source simulation started for data_name: " +
          tk_input_elastic_source_data_name +
          ", if the simulation is successful, click on save new elastic source to include this new source in the collection.",
        "5"
      );

      // Free the beast
      var start_simulation_elastic_sources = "true";
      var success_simulation_elastic_sources = "false";
      setToken("start_simulation_elastic_sources", "true");

      // free the table view
      $("#divElasticSourcesTest").css("display", "inherit");
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

        // notify
        notify(
          "error",
          "bottom",
          "The search has failed, verify the syntax and try again.",
          "5"
        );

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

        // notify
        notify(
          "error",
          "bottom",
          "The search has failed, verify the syntax and try again.",
          "5"
        );

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

      // notify
      notify(
        "error",
        "bottom",
        "Entries are either incorrect or incomplete, please correct and try again.",
        "5"
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
          "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_elastic_sources/";

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
        notify(
          "error",
          "bottom",
          "ERROR: Please successfully run the simulation first.",
          "5"
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
            notify(
              "error",
              "bottom",
              "This from query is not supported, only datamodel and lookup based from queries are accepted.",
              "5"
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
            notify(
              "error",
              "bottom",
              "This from query is not supported, only datamodel and lookup based from queries are accepted.",
              "5"
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
              "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_elastic_sources_dedicated/";

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
        // notify
        notify(
          "error",
          "bottom",
          "ERROR: Please successfully run the simulation first.",
          "5"
        );
      }
    });
  });

  // run elastic shared tracker now
  $("#add_elastic_source_processed_run_tracker").click(function () {
    $("#add_elastic_source_processed").modal("hide");

    //submitTokens();

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

      // run loader
      cssloader("Running the Elastic Shared Tracker...");

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
        cssloaderremove();
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

              cssloaderremove();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
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

      console.log("Clicked button");

      $("#modal_elastic_source_alert_creation_success").modal("hide");

      //submitTokens();

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

        cssloader("Running the dedicated elastic tracker");

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
          cssloaderremove();
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

                cssloaderremove();
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
                cssloaderremove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                cssloaderremove();
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
    //submitTokens();

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

        cssloader("Deleting shared elastic tracker...");

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
          cssloaderremove();
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

                cssloaderremove();
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
                cssloaderremove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                cssloaderremove();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    }
  }

  $("#btn_delete_elastic_source_confirm").click(function () {
    //submitTokens();

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

    // notify
    notify(
      "info",
      "bottom",
      "Modification has been registered successfully.",
      "5"
    );

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
    //submitTokens();

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

        cssloader("Deleting dedicated elastic tracker...");

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
          cssloaderremove();
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

                cssloaderremove();
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
                cssloaderremove();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                cssloaderremove();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    }
  }

  $("#btn_delete_elastic_source_dedicated_confirm").click(function () {
    //submitTokens();

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
    notify(
      "info",
      "bottom",
      "Modification has been registered successfully.",
      "5"
    );

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

      //submitTokens();
      setToken("start_modify_custom_lagging", "true");
      // Show input modal
      $("#modify_custom_lagging").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_custom_lagging_cancel").click(function () {
    //submitTokens();

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

      //submitTokens();
      setToken("start_modify_metric_sla_policies", "true");
      // Show input modal
      $("#modal_metric_sla_policies").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_sla_policy_cancel").click(function () {
    //submitTokens();

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

      //submitTokens();
      setToken("start_modify_data_source_whitelist", "true");
      // Show input modal
      $("#modal_modify_data_source_whitelist").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_whitelist_cancel").click(function () {
    //submitTokens();

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

      //submitTokens();
      setToken("start_modify_data_host_whitelist", "true");
      // Show input modal
      $("#modal_modify_data_host_whitelist").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_whitelist_cancel").click(function () {
    //submitTokens();

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

      //submitTokens();
      setToken("start_modify_metric_host_whitelist", "true");
      // Show input modal
      $("#modal_modify_metric_host_whitelist").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_host_whitelist_cancel").click(function () {
    //submitTokens();

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

      //submitTokens();
      setToken("start_modify_data_source_blacklist_host", "true");
      // Show input modal
      $("#modal_modify_data_source_blacklist_host").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_host_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_host").modal();
  });

  // indexe blacklist

  $(".btn_modify_data_source_blacklist_index").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
      setToken("start_modify_data_source_blacklist_index", "true");
      // Show input modal
      $("#modal_modify_data_source_blacklist_index").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_index_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_index").modal();
  });

  // sourcetype blacklist

  $(".btn_modify_data_source_blacklist_sourcetype").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
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

      //submitTokens();
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

      //submitTokens();
      setToken("start_modify_data_host_blacklist_host", "true");
      // Show input modal
      $("#modal_modify_data_host_blacklist_host").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_blacklist_host_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_host_blacklist_host").modal();
  });

  // indexe blacklist

  $(".btn_modify_data_host_blacklist_index").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
      setToken("start_modify_data_host_blacklist_index", "true");
      // Show input modal
      $("#modal_modify_data_host_blacklist_index").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_blacklist_index_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_host_blacklist_index").modal();
  });

  // sourcetype blacklist

  $(".btn_modify_data_host_blacklist_sourcetype").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
      setToken("start_modify_data_host_blacklist_sourcetype", "true");
      // Show input modal
      $("#modal_modify_data_host_blacklist_sourcetype").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_host_blacklist_sourcetype_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_host_blacklist_sourcetype").modal();
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_sourcetype_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_sourcetype").modal();
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_data_source_blacklist_data_name_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_data_source_blacklist_data_name").modal();
  });

  // metric_host blacklist

  // host blacklist

  $(".btn_modify_metric_host_blacklist_host").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
      setToken("start_modify_metric_host_blacklist_host", "true");
      // Show input modal
      $("#modal_modify_metric_host_blacklist_host").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_host_blacklist_host_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_metric_host_blacklist_host").modal();
  });

  // indexe blacklist

  $(".btn_modify_metric_host_blacklist_index").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
      setToken("start_modify_metric_host_blacklist_index", "true");
      // Show input modal
      $("#modal_modify_metric_host_blacklist_index").modal();
    });
  });

  // Return to bootstrap modal when clicking on cancel
  $("#btn_delete_metric_host_blacklist_index_cancel").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_metric_host_blacklist_index").modal();
  });

  // metric category
  $(".btn_modify_metric_host_blacklist_metric_category").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
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

      //submitTokens();
      setToken("tk_start_indexers_queues_searches", "true");

      // Show input modal
      $("#modal_queues").modal();
    });
  });

  // Unset token when bootstrap modal is closed properly
  $("#btn_ops_index_queue_close").click(function () {
    //submitTokens();

    unsetToken("tk_start_indexers_queues_searches");
  });

  // Ops: Parsing issues

  $(".btn_ops_parsing_issues").each(function () {
    var $btn_group = $(this);
    $btn_group.find("button").on("click", function () {
      var $btn = $(this);

      //submitTokens();
      setToken("tk_start_parsing_issues_searches", "true");
      var tk_hosts = tokens.get("inputHostParsing");

      // Show input modal
      $("#modal_parsing_issues").modal();
    });
  });

  $("#btn_search_parsing_issues_linebreaking").click(function () {
    //submitTokens();
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
    //submitTokens();
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
    //submitTokens();
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
    //submitTokens();

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

      cssloader("Please wait while running the data sources short term tracker...");

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
        cssloaderremove();
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
              cssloaderremove();
              $("#modal_run_data_source_trackers").modal();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  $("#btn_run_tracker_host").click(function () {

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

      cssloader("Please wait while running the data hosts short term tracker...")

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
        cssloaderremove();
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

              cssloaderremove();
              $("#modal_run_data_host_trackers").modal();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Call this function when the Update collection button is clicked

  $("#btn_run_tracker_longterm").click(function () {

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
      cssloader("Please wait while running the data sources long term tracker...");

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
        cssloaderremove();
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
              cssloaderremove();
              $("#modal_run_data_source_trackers").modal();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  $("#btn_run_tracker_host_longterm").click(function () {

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
      cssloader("Please wait while running the data hosts long term trakcer");

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
        cssloaderremove();
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

              cssloaderremove();
              $("#modal_run_data_host_trackers").modal();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Elastic shared tracker

  $("#btn_run_tracker_shared_elastic").click(function () {

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
      cssloader("Please wait while running the Elastic Sources shared tracker");

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
        cssloaderremove();
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

              cssloaderremove();
              $("#modal_run_data_source_trackers").modal();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // Data Sampling tracker

  $("#btn_run_tracker_data_sampling").click(function () {

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
      cssloader("Please wait while running the data sampling engine tracker...");

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
        cssloaderremove();
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
              cssloaderremove();
              $("#modal_run_data_source_trackers").modal();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  // metric host

  $("#btn_run_tracker_metric_host").click(function () {

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
      cssloader("Please wait while running the metric hosts tracker...");
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
        cssloaderremove();
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
              cssloaderremove();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
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
    //submitTokens();

    // Hide main modal
    $("#modal_manage").modal("hide");

    // Show input modal
    $("#modal_modify_data_source_unified").modal();
  });

  // cancel button: returns to selected
  $("#btn_close_data_source_unified").click(function () {
    //submitTokens();

    // Show modal
    $("#modal_manage").modal();
  });

  $("#btn_modal_modify_wdays").click(function () {
    //submitTokens();

    // Show input modal
    $("#modal_modify_monitoring_wdays").modal();
  });

  $("#btn_modal_modify_monitoring_wdays_confirm").click(function () {
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_wdays";

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_priority = tokens.get("tk_priority");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_priority";

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_data_monitoring_wdays = tokens.get("tk_data_monitoring_wdays");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_wdays";

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_monitoring_level";

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");
    var tk_min_dcount_host = tokens.get("tk_min_dcount_host");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_min_dcount_host";

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var tk_keyid = tokens.get("tk_keyid");
    var tk_data_name = tokens.get("tk_data_name");

    // Create the endpoint URL
    var myendpoint_URl =
      "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_lag_policy";

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
    //submitTokens();

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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_wdays";

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
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_priority";

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_host_monitoring/" +
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
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_lag_policy";

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
    //submitTokens();

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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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

      cssloaderremove();
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
        cssloaderremove();
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
              cssloaderremove();

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
              cssloaderremove();
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
              cssloaderremove();
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
    //submitTokens();

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
    //submitTokens();

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
    //submitTokens();

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

      //submitTokens();

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
    //submitTokens();

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
    //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_tags_policies/" +
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
    //submitTokens();

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
    //submitTokens();

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
    //submitTokens();

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
    //submitTokens();

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
    //submitTokens();

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

      //submitTokens();

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
    //submitTokens();

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
      //submitTokens();

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
    //submitTokens();

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
      //submitTokens();

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

      //submitTokens();

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
          "/en-US/splunkd/__raw/services/trackme/v1/ack/ack_enable";

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

      //submitTokens();

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
          "/en-US/splunkd/__raw/services/trackme/v1/ack/ack_disable";

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
      //submitTokens();

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
    //submitTokens();

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
      //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    var input_object = tokens.get("input_object");
    var input_object_category = tokens.get("input_object_category");
    var tk_keyid = tokens.get("tk_keyid");

    if (input_object && input_object.length) {
      // Create the endpoint URL
      var myendpoint_URl =
        "/en-US/splunkd/__raw/services/trackme/v1/logical_groups/logical_groups_unassociate";

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
    //submitTokens();

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
    //submitTokens();

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
        "/en-US/splunkd/__raw/services/trackme/v1/logical_groups/logical_groups_associate_group";

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
    //submitTokens();

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
        "/en-US/splunkd/__raw/services/trackme/v1/logical_groups/logical_groups_add_grp";

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
    //submitTokens();

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
      //submitTokens();

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
        "/en-US/splunkd/__raw/services/trackme/v1/data_sources/ds_update_outliers";

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

      //submitTokens();

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

      //submitTokens();

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

      //submitTokens();

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
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_sampling_custom_models/" +
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
    //submitTokens();

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
    //submitTokens();

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
      cssloaderremove();
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
        cssloaderremove();
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

              cssloaderremove();
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
              cssloaderremove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              cssloaderremove();
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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Built the search URI
    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Endpoint URI
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_sampling/" +
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
          cssloaderremove();
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
            cssloaderremove();
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

                  cssloaderremove();
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
                  cssloaderremove();
                  $("#modal_update_collection_failure_return")
                    .find(".modal-error-message p")
                    .text(errorStr);
                  $("#modal_update_collection_failure_return").modal();
                },
                error: function (err) {
                  done(err);
                  cssloaderremove();
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
    //submitTokens();

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

    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Built the search URI
    var tk_data_name = tokens.get("tk_data_name");
    var tk_keyid = tokens.get("tk_keyid");

    // Endpoint URI
    var myendpoint_URl =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/storage/collections/data/kv_trackme_data_sampling/" +
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
              cssloaderremove();
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
                cssloaderremove();
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

                      cssloaderremove();
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
                      cssloaderremove();
                      $("#modal_update_collection_failure_return")
                        .find(".modal-error-message p")
                        .text(errorStr);
                      $("#modal_update_collection_failure_return").modal();
                    },
                    error: function (err) {
                      done(err);
                      cssloaderremove();
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
          cssloaderremove();
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
            cssloaderremove();
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

                  cssloaderremove();
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
                  cssloaderremove();
                  $("#modal_update_collection_failure_return")
                    .find(".modal-error-message p")
                    .text(errorStr);
                  $("#modal_update_collection_failure_return").modal();
                },
                error: function (err) {
                  done(err);
                  cssloaderremove();
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
    //submitTokens();

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
    //submitTokens();

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    // Unset the token and set to free the search
    unsetToken("start_simulation_data_sampling_custom_rule_show_events");
    setToken("start_simulation_data_sampling_custom_rule_show_events", "true");
  });

  // Data sampling custom rule simulation
  $("#btn_modal_data_sampling_custom_rule_simulate").click(function () {
    //submitTokens();

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
    //submitTokens();

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
      //submitTokens();

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
    //submitTokens();

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
    //submitTokens();

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
      "/en-US/splunkd/__raw/services/trackme/v1/data_hosts/dh_update_outliers";

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
  // END
  //
});
