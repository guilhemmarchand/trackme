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
  "splunkjs/mvc/simpleform/input/multiselect",
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
  MultiSelectInput,
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

  var inputDataNameFilterMode = new DropdownView(
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
      value: "$inputDataNameFilterMode$",
      el: $("#inputDataNameFilterMode"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputDataNameFilter = new TextInputView(
    {
      id: "inputDataNameFilter",
      searchWhenChanged: true,
      prefix: 'data_name="*',
      suffix: '*"',
      initialValue: "*",
      value: "$inputDataNameFilter$",
      el: $("#inputDataNameFilter"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputTags = new MultiDropdownView(
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
      value: "$inputTags$",
      managerid: "searchPopulateDataSourcesTags",
      el: $("#inputTags"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputDataName = new MultiDropdownView(
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
      value: "$inputDataName$",
      managerid: "searchPopulateDataSources",
      el: $("#inputDataName"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputDataIndex = new MultiDropdownView(
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
      value: "$inputDataIndex$",
      managerid: "searchPopulateDataSourcesIndexes",
      el: $("#inputDataIndex"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputDataSourcetype = new MultiDropdownView(
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
      value: "$inputDataSourcetype$",
      managerid: "searchPopulateDataSourcesSourcetypes",
      el: $("#inputDataSourcetype"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputDataSourceState = new MultiDropdownView(
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
      value: "$data_source_state$",
      el: $("#inputDataSourceState"),
    },
    { tokens: true }
  ).render();

  var inputDataMonitoredState = new DropdownView(
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
      value: "$data_monitored_state$",
      el: $("#inputDataMonitoredState"),
    },
    {
      tokens: true,
    }
  ).render();

  var inputDataPriority = new MultiDropdownView(
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
      value: "$inputDataPriority$",
      el: $("#inputDataPriority"),
    },
    { tokens: true }
  ).render();

  var refreshForm = new DropdownView(
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

  search_alerts_main_table.on("search:done", function () {
    // function here
    $("#loadingGrayInitial").remove();
  });

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
    // function here
    $("#loadingGrayInitial").remove();
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
    // function here
    $("#loadingGrayInitial").remove();
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
    // function here
    $("#loadingGrayInitial").remove();
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
    // function here
    $("#loadingGrayInitial").remove();
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
    // function here
    $("#loadingGrayInitial").remove();
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
      tokens: true,
      tokenNamespace: "submitted",
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
  // END
  //
});
