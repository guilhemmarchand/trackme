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

  function defineRootUri() {
    var rootUri;
    var splunkVersion = $C.VERSION_LABEL.replace(".", "");
    splunkVersion = splunkVersion.substring(0, 2);
    if (Number(splunkVersion) >= "82") {
      var rootUri = "/en-US/manager/trackme/data/macros/";
    } else {
      var rootUri = "/en-US/manager/trackme/admin/macros/";
    }
    return rootUri;
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
  // SEARCH MANAGERS
  //

  // manage and configure

  var searchGetMacrosDefinitions = new SearchManager(
    {
      id: "searchGetMacrosDefinitions",
      earliest_time: "-15m",
      cancelOnUnload: true,
      sample_ratio: null,
      refreshType: "delay",
      latest_time: "now",
      search:
        '| rest /servicesNS/nobody/trackme/admin/macros count=0 splunk_server=local | rename eai:appName as app | where app="trackme" | table title definition',
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

  var searchGetMacro_trackme_tstats = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_tstats" | eval alternative_definition="tstats include_reduced_buckets=t" | table definition, alternative_definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_tstats",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_idx_filter = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_idx_filter" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_idx_filter",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_identity_card_default_url = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_identity_card_default_url" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_identity_card_default_url",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_identity_card_default_note =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_identity_card_default_note" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_identity_card_default_note",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_idx_summary = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_idx" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_idx_summary",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_metrics_idx = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_metrics_idx" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_metrics_idx",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_default_outlier_threshold_multiplier =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_default_outlier_threshold_multiplier" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_default_outlier_threshold_multiplier",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_default_outlier_period = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_default_outlier_period" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_default_outlier_period",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_default_outlier_alert_on_upper =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_default_outlier_alert_on_upper" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_default_outlier_alert_on_upper",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_default_enable_behaviour_analytic =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_default_enable_behaviour_analytic" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_default_enable_behaviour_analytic",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_date_format = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_date_format(1)" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_date_format",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_tstats_main_filter = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_tstats_main_filter" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_tstats_main_filter",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_default_monitored_state = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_default_monitored_state" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_default_monitored_state",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_default_host_monitored_state =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_default_host_monitored_state" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_default_host_monitored_state",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_default_metric_host_monitored_state =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_default_metric_host_monitored_state" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_default_metric_host_monitored_state",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_default_lag = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_default_lag" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_default_lag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_default_host_lag = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_default_host_lag" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_default_host_lag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_default_metric_host_lag = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_default_metric_host_lag" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_default_metric_host_lag",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_audit_changes_retention = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_audit_changes_retention_days" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_audit_changes_retention",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_alerts_priority = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_alerts_priority" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_alerts_priority",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_ack_default_duration = new PostProcessManager(
    {
      tokenDependencies: {},
      search: 'where title="trackme_ack_default_duration" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_ack_default_duration",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_future_indexing_tolerance = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_future_indexing_tolerance" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_future_indexing_tolerance",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_data_host_rule_filter = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_data_host_rule_filter(1)" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_data_host_rule_filter",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_get_data_host_tags = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_get_data_host_tags" | eval alternative_definition_es="`get_asset(data_host)` | rename \\"data_host_*\\" as \\"*\\" | fields tags", alternative_definition_cmdb="lookup name_of_lookup key_name_field as data_host | fields tags" | table definition, alternative_definition_es, alternative_definition_cmdb',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_get_data_host_tags",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_data_sampling_max_allowed_runtime_sec =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_data_sampling_max_allowed_runtime_sec" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_data_sampling_max_allowed_runtime_sec",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_data_sampling_default_sample_record_at_discovery =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_data_sampling_default_sample_record_at_discovery" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_data_sampling_default_sample_record_at_discovery",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_data_sampling_default_sample_record_at_run =
    new PostProcessManager(
      {
        tokenDependencies: {},
        search:
          'where title="trackme_data_sampling_default_sample_record_at_run" | table definition',
        managerid: "searchGetMacrosDefinitions",
        id: "searchGetMacro_trackme_data_sampling_default_sample_record_at_run",
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    );

  var searchGetMacro_trackme_get_metric_host_tags = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_get_metric_host_tags" | eval alternative_definition_es="`get_asset(metric_host)` | rename \\"metric_host_*\\" as \\"*\\" | fields tags", alternative_definition_cmdb="lookup name_of_lookup key_name_field as metric_host | fields tags" | table definition, alternative_definition_es, alternative_definition_cmdb',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_get_metric_host_tags",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  var searchGetMacro_trackme_auto_disablement_period = new PostProcessManager(
    {
      tokenDependencies: {},
      search:
        'where title="trackme_auto_disablement_period" | table definition',
      managerid: "searchGetMacrosDefinitions",
      id: "searchGetMacro_trackme_auto_disablement_period",
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  );

  //
  // Table objects
  //

  var elementTable_tstats = new TableView(
    {
      id: "elementTable_tstats",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_tstats",
      el: $("#elementTable_tstats"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_tstats.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_tstats?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_idx_filter = new TableView(
    {
      id: "elementTable_trackme_idx_filter",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_idx_filter",
      el: $("#elementTable_trackme_idx_filter"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_idx_filter.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_idx_filter?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_idx_summary = new TableView(
    {
      id: "elementTable_trackme_idx_summary",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_idx_summary",
      el: $("#elementTable_trackme_idx_summary"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_idx_summary.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_idx?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_metrics_idx = new TableView(
    {
      id: "elementTable_trackme_metrics_idx",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_metrics_idx",
      el: $("#elementTable_trackme_metrics_idx"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_metrics_idx.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_metrics_idx?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_outlier_threshold_multiplier = new TableView(
    {
      id: "elementTable_trackme_default_outlier_threshold_multiplier",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_outlier_threshold_multiplier",
      el: $("#elementTable_trackme_default_outlier_threshold_multiplier"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_outlier_threshold_multiplier.on(
    "click",
    function (e) {
      if (e.field !== undefined) {
        e.preventDefault();
        rootUri = defineRootUri();
        var url = TokenUtils.replaceTokenNames(
          rootUri + "trackme_default_outlier_threshold_multiplier?action=edit",
          _.extend(submittedTokenModel.toJSON(), e.data),
          TokenUtils.getEscaper("url"),
          TokenUtils.getFilters(mvc.Components)
        );
        utils.redirect(url, false, "_blank");
      }
    }
  );

  var elementTable_trackme_default_outlier_period = new TableView(
    {
      id: "elementTable_trackme_default_outlier_period",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_outlier_period",
      el: $("#elementTable_trackme_default_outlier_period"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_outlier_period.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_outlier_period?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_outlier_alert_on_upper = new TableView(
    {
      id: "elementTable_trackme_default_outlier_alert_on_upper",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_outlier_alert_on_upper",
      el: $("#elementTable_trackme_default_outlier_alert_on_upper"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_outlier_alert_on_upper.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_outlier_alert_on_upper?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_enable_behaviour_analytic = new TableView(
    {
      id: "elementTable_trackme_default_enable_behaviour_analytic",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_enable_behaviour_analytic",
      el: $("#elementTable_trackme_default_enable_behaviour_analytic"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_enable_behaviour_analytic.on(
    "click",
    function (e) {
      if (e.field !== undefined) {
        e.preventDefault();
        rootUri = defineRootUri();
        var url = TokenUtils.replaceTokenNames(
          rootUri + "trackme_default_enable_behaviour_analytic?action=edit",
          _.extend(submittedTokenModel.toJSON(), e.data),
          TokenUtils.getEscaper("url"),
          TokenUtils.getFilters(mvc.Components)
        );
        utils.redirect(url, false, "_blank");
      }
    }
  );

  var elementTable_trackme_identity_card_default_url = new TableView(
    {
      id: "elementTable_trackme_identity_card_default_url",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_identity_card_default_url",
      el: $("#elementTable_trackme_identity_card_default_url"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_identity_card_default_url.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_identity_card_default_url?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_identity_card_default_note = new TableView(
    {
      id: "elementTable_trackme_identity_card_default_note",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_identity_card_default_note",
      el: $("#elementTable_trackme_identity_card_default_note"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_identity_card_default_note.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_identity_card_default_note?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_tstats_main_filter = new TableView(
    {
      id: "elementTable_trackme_tstats_main_filter",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_tstats_main_filter",
      el: $("#elementTable_trackme_tstats_main_filter"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_tstats_main_filter.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_tstats_main_filter?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_alerts_priority = new TableView(
    {
      id: "elementTable_trackme_alerts_priority",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_alerts_priority",
      el: $("#elementTable_trackme_alerts_priority"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_alerts_priority.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_alerts_priority?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_monitored_state = new TableView(
    {
      id: "elementTable_trackme_default_monitored_state",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_monitored_state",
      el: $("#elementTable_trackme_default_monitored_state"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_monitored_state.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_monitored_state?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_host_monitored_state = new TableView(
    {
      id: "elementTable_trackme_default_host_monitored_state",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_host_monitored_state",
      el: $("#elementTable_trackme_default_host_monitored_state"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_host_monitored_state.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_host_monitored_state?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_metric_host_monitored_state = new TableView(
    {
      id: "elementTable_trackme_default_metric_host_monitored_state",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_metric_host_monitored_state",
      el: $("#elementTable_trackme_default_metric_host_monitored_state"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_metric_host_monitored_state.on(
    "click",
    function (e) {
      if (e.field !== undefined) {
        e.preventDefault();
        rootUri = defineRootUri();
        var url = TokenUtils.replaceTokenNames(
          rootUri + "trackme_default_metric_host_monitored_state?action=edit",
          _.extend(submittedTokenModel.toJSON(), e.data),
          TokenUtils.getEscaper("url"),
          TokenUtils.getFilters(mvc.Components)
        );
        utils.redirect(url, false, "_blank");
      }
    }
  );

  var elementTable_trackme_default_lag = new TableView(
    {
      id: "elementTable_trackme_default_lag",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_lag",
      el: $("#elementTable_trackme_default_lag"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_lag.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_lag?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_host_lag = new TableView(
    {
      id: "elementTable_trackme_default_host_lag",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_host_lag",
      el: $("#elementTable_trackme_default_host_lag"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_host_lag.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_host_lag?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_default_metric_host_lag = new TableView(
    {
      id: "elementTable_trackme_default_metric_host_lag",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_default_metric_host_lag",
      el: $("#elementTable_trackme_default_metric_host_lag"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_default_metric_host_lag.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_default_metric_host_lag?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_audit_changes_retention = new TableView(
    {
      id: "elementTable_trackme_audit_changes_retention",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_audit_changes_retention",
      el: $("#elementTable_trackme_audit_changes_retention"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_audit_changes_retention.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_audit_changes_retention_days?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_ack_default_duration = new TableView(
    {
      id: "elementTable_trackme_ack_default_duration",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_ack_default_duration",
      el: $("#elementTable_trackme_ack_default_duration"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_ack_default_duration.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_ack_default_duration?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_future_indexing_tolerance = new TableView(
    {
      id: "elementTable_trackme_future_indexing_tolerance",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_future_indexing_tolerance",
      el: $("#elementTable_trackme_future_indexing_tolerance"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_future_indexing_tolerance.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_future_indexing_tolerance?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_data_host_rule_filter = new TableView(
    {
      id: "elementTable_trackme_data_host_rule_filter",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_data_host_rule_filter",
      el: $("#elementTable_trackme_data_host_rule_filter"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_data_host_rule_filter.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_data_host_rule_filter(1)?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_get_data_host_tags = new TableView(
    {
      id: "elementTable_trackme_get_data_host_tags",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_get_data_host_tags",
      el: $("#elementTable_trackme_get_data_host_tags"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_get_data_host_tags.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_get_data_host_tags?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_data_sampling_max_allowed_runtime_sec =
    new TableView(
      {
        id: "elementTable_trackme_data_sampling_max_allowed_runtime_sec",
        count: 100,
        drilldown: "row",
        "refresh.display": "none",
        wrap: "false",
        managerid:
          "searchGetMacro_trackme_data_sampling_max_allowed_runtime_sec",
        el: $("#elementTable_trackme_data_sampling_max_allowed_runtime_sec"),
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    ).render();

  elementTable_trackme_data_sampling_max_allowed_runtime_sec.on(
    "click",
    function (e) {
      if (e.field !== undefined) {
        e.preventDefault();
        rootUri = defineRootUri();
        var url = TokenUtils.replaceTokenNames(
          rootUri + "trackme_data_sampling_max_allowed_runtime_sec?action=edit",
          _.extend(submittedTokenModel.toJSON(), e.data),
          TokenUtils.getEscaper("url"),
          TokenUtils.getFilters(mvc.Components)
        );
        utils.redirect(url, false, "_blank");
      }
    }
  );

  var elementTable_trackme_data_sampling_default_sample_record_at_discovery =
    new TableView(
      {
        id: "elementTable_trackme_data_sampling_default_sample_record_at_discovery",
        count: 100,
        drilldown: "row",
        "refresh.display": "none",
        wrap: "false",
        managerid:
          "searchGetMacro_trackme_data_sampling_default_sample_record_at_discovery",
        el: $(
          "#elementTable_trackme_data_sampling_default_sample_record_at_discovery"
        ),
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    ).render();

  elementTable_trackme_data_sampling_default_sample_record_at_discovery.on(
    "click",
    function (e) {
      if (e.field !== undefined) {
        e.preventDefault();
        rootUri = defineRootUri();
        var url = TokenUtils.replaceTokenNames(
          rootUri +
            "trackme_data_sampling_default_sample_record_at_discovery?action=edit",
          _.extend(submittedTokenModel.toJSON(), e.data),
          TokenUtils.getEscaper("url"),
          TokenUtils.getFilters(mvc.Components)
        );
        utils.redirect(url, false, "_blank");
      }
    }
  );

  var elementTable_trackme_data_sampling_default_sample_record_at_run =
    new TableView(
      {
        id: "elementTable_trackme_data_sampling_default_sample_record_at_run",
        count: 100,
        drilldown: "row",
        "refresh.display": "none",
        wrap: "false",
        managerid:
          "searchGetMacro_trackme_data_sampling_default_sample_record_at_run",
        el: $(
          "#elementTable_trackme_data_sampling_default_sample_record_at_run"
        ),
      },
      {
        tokens: true,
        tokenNamespace: "submitted",
      }
    ).render();

  elementTable_trackme_data_sampling_default_sample_record_at_run.on(
    "click",
    function (e) {
      if (e.field !== undefined) {
        e.preventDefault();
        rootUri = defineRootUri();
        var url = TokenUtils.replaceTokenNames(
          rootUri +
            "trackme_data_sampling_default_sample_record_at_run?action=edit",
          _.extend(submittedTokenModel.toJSON(), e.data),
          TokenUtils.getEscaper("url"),
          TokenUtils.getFilters(mvc.Components)
        );
        utils.redirect(url, false, "_blank");
      }
    }
  );

  var elementTable_trackme_get_metric_host_tags = new TableView(
    {
      id: "elementTable_trackme_get_metric_host_tags",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_get_metric_host_tags",
      el: $("#elementTable_trackme_get_metric_host_tags"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_get_metric_host_tags.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_get_metric_host_tags?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
  });

  var elementTable_trackme_auto_disablement_period = new TableView(
    {
      id: "elementTable_trackme_auto_disablement_period",
      count: 100,
      drilldown: "row",
      "refresh.display": "none",
      wrap: "false",
      managerid: "searchGetMacro_trackme_auto_disablement_period",
      el: $("#elementTable_trackme_auto_disablement_period"),
    },
    {
      tokens: true,
      tokenNamespace: "submitted",
    }
  ).render();

  elementTable_trackme_auto_disablement_period.on("click", function (e) {
    if (e.field !== undefined) {
      e.preventDefault();
      rootUri = defineRootUri();
      var url = TokenUtils.replaceTokenNames(
        rootUri + "trackme_auto_disablement_period?action=edit",
        _.extend(submittedTokenModel.toJSON(), e.data),
        TokenUtils.getEscaper("url"),
        TokenUtils.getFilters(mvc.Components)
      );
      utils.redirect(url, false, "_blank");
    }
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

  //
  // BEHAVIOUR ANALYTIC MODE
  //

  function update_behaviour_analytic(value) {
    var query_url =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/configs/conf-macros/trackme_system_enable_behaviour_analytic_mode";
    var value = value;

    if (value == "enabled") {
      change_type = "enable behaviour analytic production mode";
    } else if (value == "training") {
      change_type = "enable behaviour analytic training mode";
    } else if (value == "disabled") {
      change_type = "disabled behaviour analytic training mode";
    } else {
      change_type = "unknown";
    }

    $.ajax({
      url: query_url,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: 'definition="' + value + '"',
      success: function (returneddata) {
        // Update the buttons
        if (value == "enabled") {
          document.getElementById(
            "btn_enable_production_mode_confirm"
          ).disabled = true;
          document.getElementById(
            "btn_enable_training_mode_confirm"
          ).disabled = false;
          document.getElementById("btn_disabled_mode_confirm").disabled = false;
        } else if (value == "training") {
          document.getElementById(
            "btn_enable_production_mode_confirm"
          ).disabled = false;
          document.getElementById(
            "btn_enable_training_mode_confirm"
          ).disabled = true;
          document.getElementById("btn_disabled_mode_confirm").disabled = false;
        } else if (value == "disabled") {
          document.getElementById(
            "btn_enable_production_mode_confirm"
          ).disabled = false;
          document.getElementById(
            "btn_enable_training_mode_confirm"
          ).disabled = false;
          document.getElementById("btn_disabled_mode_confirm").disabled = true;
        } else {
          document.getElementById(
            "btn_enable_production_mode_confirm"
          ).disabled = false;
          document.getElementById(
            "btn_enable_training_mode_confirm"
          ).disabled = false;
          document.getElementById("btn_disabled_mode_confirm").disabled = false;
        }

        // notify
        notify(
          "success",
          "bottom",
          "Behaviour analytic mode has successfully been set to " + value,
          "5"
        );

        // Audit
        action = "success";
        change_type = change_type;
        object = "all";
        object_category = "all";
        object_attrs = 'definition="' + value + '"';
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
      error: function (xhr, textStatus, error) {
        message = "Error Updating!" + xhr + textStatus + error;

        // Audit
        action = "failure";
        change_type = change_type;
        object = "all";
        object_category = "all";
        object_attrs = 'definition="' + value + '"';
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

  function get_data_host_alerting_policy() {
    // Manage buttons states dynamically

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    //
    // Verify the current status
    //

    // Define the query
    var searchQuery =
      "| makeresults | eval data_host_alerting_policy=`trackme_default_data_host_alert_policy` | fields - _time";

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
      var current_data_host_alerting_policy;

      for (var i = 0; i < rows.length; i++) {
        var values = rows[i];

        for (var j = 0; j < values.length; j++) {
          var field = fields[j];

          if (fields[j] == "data_host_alerting_policy") {
            current_data_host_alerting_policy = values[j];
          }
        }
      }

      if (!current_data_host_alerting_policy) {
        document.getElementById(
          "btn_enable_data_host_policy_per_host"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_host_policy_per_sourcetype"
        ).disabled = false;
        return;
      }

      // Dynamically manage buttons states
      if (current_data_host_alerting_policy == "track_per_host") {
        document.getElementById(
          "btn_enable_data_host_policy_per_host"
        ).disabled = true;
        document.getElementById(
          "btn_enable_data_host_policy_per_sourcetype"
        ).disabled = false;
      } else if (current_data_host_alerting_policy == "track_per_sourcetype") {
        document.getElementById(
          "btn_enable_data_host_policy_per_host"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_host_policy_per_sourcetype"
        ).disabled = true;
      } else {
        document.getElementById(
          "btn_enable_data_host_policy_per_host"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_host_policy_per_sourcetype"
        ).disabled = false;
      }
    });
  }

  // get current status
  get_data_host_alerting_policy();

  //
  // data sampling obfuscation mode
  //

  // Get current mode
  function get_data_sampling_obfuscation_mode() {
    // Manage buttons states dynamically

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    //
    // Verify the current status
    //

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
        document.getElementById(
          "btn_data_sampling_obfuscate_enable"
        ).disabled = false;
        document.getElementById(
          "btn_data_sampling_obfuscate_disable"
        ).disabled = false;
        return;
      }

      // Dynamically manage buttons states
      if (current_mode == "trackme_data_sampling_obfuscation_mode_enabled") {
        document.getElementById(
          "btn_data_sampling_obfuscate_enable"
        ).disabled = true;
        document.getElementById(
          "btn_data_sampling_obfuscate_disable"
        ).disabled = false;
      } else if (
        current_mode == "trackme_data_sampling_obfuscation_mode_disabled"
      ) {
        document.getElementById(
          "btn_data_sampling_obfuscate_enable"
        ).disabled = false;
        document.getElementById(
          "btn_data_sampling_obfuscate_disable"
        ).disabled = true;
      } else {
        document.getElementById(
          "btn_data_sampling_obfuscate_enable"
        ).disabled = false;
        document.getElementById(
          "btn_data_sampling_obfuscate_disable"
        ).disabled = false;
      }
    });
  }

  // get current status
  get_data_sampling_obfuscation_mode();

  // Update the data sources mode
  function update_data_sampling_obfuscation_mode(value) {
    var query_url =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/configs/conf-macros/trackme_data_sampling_obfuscation_mode";
    var value = value;

    if (value == "trackme_data_sampling_obfuscation_mode_enabled") {
      change_type = "enable data sampling obfuscation mode";
    } else if (value == "trackme_data_sampling_obfuscation_mode_disabled") {
      change_type = "enable data sampling obfuscation mode";
    } else {
      // default if unset
      change_type = "trackme_data_sampling_obfuscation_mode_disabled";
    }

    $.ajax({
      url: query_url,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: "definition=`" + value + "`",
      success: function (returneddata) {
        // Update the buttons
        if (value == "trackme_data_sampling_obfuscation_mode_enabled") {
          document.getElementById(
            "btn_data_sampling_obfuscate_enable"
          ).disabled = true;
          document.getElementById(
            "btn_data_sampling_obfuscate_disable"
          ).disabled = false;
        } else if (value == "trackme_data_sampling_obfuscation_mode_disabled") {
          document.getElementById(
            "btn_data_sampling_obfuscate_enable"
          ).disabled = false;
          document.getElementById(
            "btn_data_sampling_obfuscate_disable"
          ).disabled = true;
        } else {
          document.getElementById(
            "btn_data_sampling_obfuscate_enable"
          ).disabled = false;
          document.getElementById(
            "btn_data_sampling_obfuscate_disable"
          ).disabled = false;
        }

        // notify
        notify(
          "success",
          "bottom",
          "Data sampling obfuscation mode has been successfully set to: " +
            value,
          "5"
        );

        // Audit
        action = "success";
        change_type = change_type;
        object = "all";
        object_category = "data_source";
        object_attrs = 'definition="' + value + '"';
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
      error: function (xhr, textStatus, error) {
        message = "Error Updating!" + xhr + textStatus + error;

        // Audit
        action = "failure";
        change_type = change_type;
        object = "all";
        object_category = "data_source";
        object_attrs = 'definition="' + value + '"';
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

  // Enable mode
  $("#btn_data_sampling_obfuscate_enable").click(function () {
    update_data_sampling_obfuscation_mode(
      "trackme_data_sampling_obfuscation_mode_enabled"
    );
  });

  // Disable mode
  $("#btn_data_sampling_obfuscate_disable").click(function () {
    update_data_sampling_obfuscation_mode(
      "trackme_data_sampling_obfuscation_mode_disabled"
    );
  });

  //
  // data host splunk monitoring
  //

  // Get current mode
  function get_data_host_splunk_monitoring_mode() {
    // Manage buttons states dynamically

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    //
    // Verify the current status
    //

    // Define the query
    var searchQuery =
      '| rest /servicesNS/nobody/trackme/admin/macros/trackme_tstats_main_filter_for_host splunk_server=local | fields definition | rex field=definition mode=sed "s/`//g" | rename definition as current_mode';

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
        document.getElementById(
          "btn_enable_data_host_splunkd"
        ).disabled = false;
        document.getElementById(
          "btn_disable_data_host_splunkd"
        ).disabled = false;
        return;
      }

      // Dynamically manage buttons states
      if (current_mode == "trackme_tstats_root_include_splunkd") {
        document.getElementById("btn_enable_data_host_splunkd").disabled = true;
        document.getElementById(
          "btn_disable_data_host_splunkd"
        ).disabled = false;
      } else if (current_mode == "trackme_tstats_root_exclude_splunkd") {
        document.getElementById(
          "btn_enable_data_host_splunkd"
        ).disabled = false;
        document.getElementById(
          "btn_disable_data_host_splunkd"
        ).disabled = true;
      } else {
        document.getElementById(
          "btn_enable_data_host_splunkd"
        ).disabled = false;
        document.getElementById(
          "btn_disable_data_host_splunkd"
        ).disabled = false;
      }
    });
  }

  // get current status
  get_data_host_splunk_monitoring_mode();

  // Update the data sources mode
  function update_data_host_splunk_monitoring_mode(value) {
    var query_url =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/configs/conf-macros/trackme_tstats_main_filter_for_host";
    var value = value;

    if (value == "trackme_tstats_root_include_splunkd") {
      change_type = "enable data host Splunk monitoring";
    } else if (value == "trackme_tstats_root_exclude_splunkd") {
      change_type = "disable data host Splunk monitoring";
    } else {
      // default if unset
      change_type = "trackme_tstats_root_include_splunkd";
    }

    $.ajax({
      url: query_url,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: "definition=`" + value + "`",
      success: function (returneddata) {
        // Update the buttons
        if (value == "trackme_tstats_root_include_splunkd") {
          document.getElementById(
            "btn_enable_data_host_splunkd"
          ).disabled = true;
          document.getElementById(
            "btn_disable_data_host_splunkd"
          ).disabled = false;
        } else if (value == "trackme_tstats_root_exclude_splunkd") {
          document.getElementById(
            "btn_enable_data_host_splunkd"
          ).disabled = false;
          document.getElementById(
            "btn_disable_data_host_splunkd"
          ).disabled = true;
        } else {
          document.getElementById(
            "btn_enable_data_host_splunkd"
          ).disabled = false;
          document.getElementById(
            "btn_disable_data_host_splunkd"
          ).disabled = false;
        }

        // notify
        notify(
          "success",
          "bottom",
          "Data host Splunk monitoring mode has been successfully set to: " +
            value,
          "5"
        );

        // Audit
        action = "success";
        change_type = change_type;
        object = "all";
        object_category = "data_source";
        object_attrs = 'definition="' + value + '"';
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
      error: function (xhr, textStatus, error) {
        message = "Error Updating!" + xhr + textStatus + error;

        // Audit
        action = "failure";
        change_type = change_type;
        object = "all";
        object_category = "data_source";
        object_attrs = 'definition="' + value + '"';
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

  // Enable mode
  $("#btn_enable_data_host_splunkd").click(function () {
    update_data_host_splunk_monitoring_mode(
      "trackme_tstats_root_include_splunkd"
    );
  });

  // Disable mode
  $("#btn_disable_data_host_splunkd").click(function () {
    update_data_host_splunk_monitoring_mode(
      "trackme_tstats_root_exclude_splunkd"
    );
  });

  //
  // data source mode
  //

  // Get current data sources mode
  function get_data_source_mode() {
    // Manage buttons states dynamically

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    //
    // Verify the current status
    //

    // Define the query
    var searchQuery =
      '| rest /servicesNS/nobody/trackme/admin/macros/trackme_default_data_source_mode splunk_server=local | fields definition | rex field=definition mode=sed "s/`//g" | rename definition as current_data_source_mode';

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
      var current_data_source_mode;

      for (var i = 0; i < rows.length; i++) {
        var values = rows[i];

        for (var j = 0; j < values.length; j++) {
          var field = fields[j];

          if (fields[j] == "current_data_source_mode") {
            current_data_source_mode = values[j];
          }
        }
      }

      if (!current_data_source_mode) {
        document.getElementById(
          "btn_enable_data_source_split_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_split_by_custom_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_merged_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_cribl_mode"
        ).disabled = false;
        return;
      }

      // Dynamically manage buttons states
      if (current_data_source_mode == "trackme_data_source_split_mode") {
        document.getElementById(
          "btn_enable_data_source_split_mode"
        ).disabled = true;
        document.getElementById(
          "btn_enable_data_source_split_by_custom_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_merged_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_cribl_mode"
        ).disabled = false;
      } else if (
        current_data_source_mode.includes(
          "trackme_data_source_split_bycustom_mode"
        )
      ) {
        document.getElementById(
          "btn_enable_data_source_split_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_split_by_custom_mode"
        ).disabled = true;
        document.getElementById(
          "btn_enable_data_source_merged_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_cribl_mode"
        ).disabled = false;
      } else if (
        current_data_source_mode == "trackme_data_source_merged_mode"
      ) {
        document.getElementById(
          "btn_enable_data_source_split_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_split_by_custom_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_merged_mode"
        ).disabled = true;
        document.getElementById(
          "btn_enable_data_source_cribl_mode"
        ).disabled = false;
      } else if (current_data_source_mode == "trackme_data_source_cribl_mode") {
        document.getElementById(
          "btn_enable_data_source_split_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_split_by_custom_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_merged_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_cribl_mode"
        ).disabled = true;
      } else {
        document.getElementById(
          "btn_enable_data_source_split_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_split_by_custom_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_merged_mode"
        ).disabled = false;
        document.getElementById(
          "btn_enable_data_source_cribl_mode"
        ).disabled = false;
      }
    });
  }

  // get current status
  get_data_source_mode();

  // Update the data sources mode
  function update_data_source_mode(value, field) {
    var query_url =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/configs/conf-macros/trackme_default_data_source_mode";
    var query_url2 =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/configs/conf-macros/trackme_data_source_tstats_root_splitby";
    var main_splitby_value;
    var root_splitby_value;

    // standard
    if (value == "trackme_data_source_split_mode") {
      main_splitby_value = value;
      change_type = "enable data source split mode";
      root_splitby_value = "trackme_data_source_tstats_root_splitby_regular";
      // split by source
    } else if (value == "trackme_data_source_split_bysource_mode") {
      main_splitby_value = value;
      change_type = "enable data source split by source mode";
      root_splitby_value = "trackme_data_source_tstats_root_splitby_source";
      // split by custom indexed field
    } else if (value.includes("trackme_data_source_split_bycustom_mode")) {
      // update the value in this specific case
      main_splitby_value =
        'trackme_data_source_split_bycustom_mode("' + field + '")';
      change_type = "enable data source split by custom mode";
      root_splitby_value =
        'trackme_data_source_tstats_root_splitby_custom("' + field + '")';
      // merged mode
    } else if (value == "trackme_data_source_merged_mode") {
      main_splitby_value = value;
      change_type = "enable data source merged mode";
      root_splitby_value = "trackme_data_source_tstats_root_splitby_regular";
      // cribl mode
    } else if (value == "trackme_data_source_cribl_mode") {
      main_splitby_value = value;
      change_type = "enable data source cribl mode";
      root_splitby_value = "trackme_data_source_tstats_root_splitby_cribl";
    } else {
      // default if unset
      main_splitby_value = value;
      change_type = "trackme_data_source_split_mode";
      root_splitby_value = "trackme_data_source_tstats_root_splitby_regular";
    }

    $.ajax({
      url: query_url,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: "definition=`" + main_splitby_value + "`",
      success: function (returneddata) {
        $.ajax({
          url: query_url2,
          type: "POST",
          async: true,
          contentType: "application/json",
          data: "definition=`" + root_splitby_value + "`",
          success: function (returneddata) {
            // notify
            var msgMode;

            // Update the buttons
            if (value == "trackme_data_source_split_mode") {
              document.getElementById(
                "btn_enable_data_source_split_mode"
              ).disabled = true;
              document.getElementById(
                "btn_enable_data_source_split_by_custom_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_merged_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_cribl_mode"
              ).disabled = false;
              msgMode = "Standard split by mode";
            } else if (
              value.includes("trackme_data_source_split_bycustom_mode")
            ) {
              document.getElementById(
                "btn_enable_data_source_split_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_split_by_custom_mode"
              ).disabled = true;
              document.getElementById(
                "btn_enable_data_source_merged_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_cribl_mode"
              ).disabled = false;
              msgMode = "Split by custom mode";
            } else if (value == "trackme_data_source_merged_mode") {
              document.getElementById(
                "btn_enable_data_source_split_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_split_by_custom_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_merged_mode"
              ).disabled = true;
              document.getElementById(
                "btn_enable_data_source_cribl_mode"
              ).disabled = false;
              msgMode = "merged mode";
            } else if (value == "trackme_data_source_cribl_mode") {
              document.getElementById(
                "btn_enable_data_source_split_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_split_by_custom_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_merged_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_cribl_mode"
              ).disabled = true;
              msgMode = "Cribl mode";
            } else {
              document.getElementById(
                "btn_enable_data_source_split_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_split_by_custom_mode"
              ).disabled = false;
              document.getElementById(
                "btn_enable_data_source_merged_mode"
              ).disabled = false;
              msgMode = "Standard split by mode";
            }

            // notify
            notify(
              "success",
              "bottom",
              "Data source mode has been successfully set to: " + msgMode,
              "5"
            );

            // Audit
            action = "success";
            change_type = change_type;
            object = "all";
            object_category = "data_source";
            object_attrs = 'definition="' + value + '"';
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
          error: function (xhr, textStatus, error) {
            message = "Error Updating!" + xhr + textStatus + error;

            // Audit
            action = "failure";
            change_type = change_type;
            object = "all";
            object_category = "data_source";
            object_attrs = 'definition="' + value + '"';
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
      },
      error: function (xhr, textStatus, error) {
        message = "Error Updating!" + xhr + textStatus + error;

        // Audit
        action = "failure";
        change_type = change_type;
        object = "all";
        object_category = "data_source";
        object_attrs = 'definition="' + value + '"';
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

  // Enable data source split mode
  $("#btn_enable_data_source_split_mode").click(function () {
    update_data_source_mode("trackme_data_source_split_mode", "null");
  });

  // custom field, monitors value for custom field
  $(function () {
    $("#input_split_by_custom_field").keyup(function () {
      if ($(this).val() == "") {
        //Check to see if there is any text entered
        // If there is no text within the input then disable the button
        $("#btn_modal_input_split_by_custom_field").prop("disabled", true);
      } else if (/(\s|\,|\'|\")/i.test($(this).val())) {
        $("#btn_modal_input_split_by_custom_field").prop("disabled", true);
        notify(
          "error",
          "bottom",
          "An invalid input was detected, a single field must be provided with no special characters",
          "5"
        );
      } else {
        //If there is text in the input, then enable the button if other conditions are met
        $("#btn_modal_input_split_by_custom_field").prop("disabled", false);
      }
    });
  });

  // Custom split by modal input
  $("#btn_enable_data_source_split_by_custom_mode").click(function () {
    // open modal
    $("#modal_input_split_by_custom").modal();
  });

  // retrieve the input value if confirmed, and proceed
  $("#btn_modal_input_split_by_custom_field").click(function () {
    $("#modal_input_split_by_custom").modal();

    var customField = document.getElementById(
      "input_split_by_custom_field"
    ).value;
    if (customField != "" && customField != "undefined") {
      update_data_source_mode(
        "trackme_data_source_split_bycustom_mode",
        customField
      );
    }
  });

  // Enable data source merged mode
  $("#btn_enable_data_source_merged_mode").click(function () {
    update_data_source_mode("trackme_data_source_merged_mode", "null");
  });

  // Enable cribl mode
  $("#btn_enable_data_source_cribl_mode").click(function () {
    update_data_source_mode("trackme_data_source_cribl_mode", "null");
  });

  // Outliers Production / Training mode

  // Enable production mode
  $("#btn_enable_data_host_policy_per_host").click(function () {
    update_data_host_alerting_policy("track_per_host");
  });

  // Enable training mode
  $("#btn_enable_data_host_policy_per_sourcetype").click(function () {
    update_data_host_alerting_policy("track_per_sourcetype");
  });

  function update_data_host_alerting_policy(value) {
    var query_url =
      "/en-US/splunkd/__raw/servicesNS/nobody/trackme/configs/conf-macros/trackme_default_data_host_alert_policy";
    var value = value;

    if (value == "track_per_host") {
      change_type = "enable data host policy track per host";
    } else if (value == "track_per_sourcetype") {
      change_type = "enable data host policy track per sourcetype";
    } else {
      // default if unset
      change_type = "track_per_host";
    }

    $.ajax({
      url: query_url,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: 'definition="' + value + '"',
      success: function (returneddata) {
        // Update the buttons
        if (value == "track_per_host") {
          document.getElementById(
            "btn_enable_data_host_policy_per_host"
          ).disabled = true;
          document.getElementById(
            "btn_enable_data_host_policy_per_sourcetype"
          ).disabled = false;
        } else if (value == "track_per_sourcetype") {
          document.getElementById(
            "btn_enable_data_host_policy_per_host"
          ).disabled = false;
          document.getElementById(
            "btn_enable_data_host_policy_per_sourcetype"
          ).disabled = true;
        } else {
          document.getElementById(
            "btn_enable_data_host_policy_per_host"
          ).disabled = false;
          document.getElementById(
            "btn_enable_data_host_policy_per_sourcetype"
          ).disabled = false;
        }

        // notify
        notify(
          "success",
          "bottom",
          "Data host alerting policy has been successfully set to: " + value,
          "5"
        );

        // Audit
        action = "success";
        change_type = change_type;
        object = "all";
        object_category = "data_host";
        object_attrs = 'definition="' + value + '"';
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
      error: function (xhr, textStatus, error) {
        message = "Error Updating!" + xhr + textStatus + error;

        // Audit
        action = "failure";
        change_type = change_type;
        object = "all";
        object_category = "data_host";
        object_attrs = 'definition="' + value + '"';
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

  function get_behaviour_analytic_mode() {
    // Manage buttons states dynamically

    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    //
    // Verify the current status
    //

    // Define the query
    var searchQuery =
      "| makeresults | eval behaviour_analytic_mode=`trackme_system_enable_behaviour_analytic_mode` | fields - _time";

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

          if (fields[j] == "behaviour_analytic_mode") {
            current_behaviour_analytic_mode_mode = values[j];
          }
        }
      }

      if (!current_behaviour_analytic_mode_mode) {
        document.getElementById(
          "btn_enable_production_mode_confirm"
        ).disabled = false;
        document.getElementById(
          "btn_enable_training_mode_confirm"
        ).disabled = false;
        document.getElementById("btn_disabled_mode_confirm").disabled = false;
        return;
      }

      // Dynamically manage buttons states
      if (current_behaviour_analytic_mode_mode == "enabled") {
        document.getElementById(
          "btn_enable_production_mode_confirm"
        ).disabled = true;
        document.getElementById(
          "btn_enable_training_mode_confirm"
        ).disabled = false;
        document.getElementById("btn_disabled_mode_confirm").disabled = false;
      } else if (current_behaviour_analytic_mode_mode == "training") {
        document.getElementById(
          "btn_enable_production_mode_confirm"
        ).disabled = false;
        document.getElementById(
          "btn_enable_training_mode_confirm"
        ).disabled = true;
        document.getElementById("btn_disabled_mode_confirm").disabled = false;
      } else if (current_behaviour_analytic_mode_mode == "disabled") {
        document.getElementById(
          "btn_enable_production_mode_confirm"
        ).disabled = false;
        document.getElementById(
          "btn_enable_training_mode_confirm"
        ).disabled = false;
        document.getElementById("btn_disabled_mode_confirm").disabled = true;
      } else {
        document.getElementById(
          "btn_enable_production_mode_confirm"
        ).disabled = false;
        document.getElementById(
          "btn_enable_training_mode_confirm"
        ).disabled = false;
        document.getElementById("btn_disabled_mode_confirm").disabled = false;
      }
    });
  }

  // get current status
  get_behaviour_analytic_mode();

  // Enable production mode
  $("#btn_enable_production_mode").click(function () {
    update_behaviour_analytic("enabled");
  });

  // Enable training mode
  $("#btn_enable_training_mode").click(function () {
    update_behaviour_analytic("training");
  });

  // Disable
  $("#btn_disabled_mode").click(function () {
    update_behaviour_analytic("disabled");
  });

  //
  // RESET COLLECTIONS
  //

  // data source

  $("#btn_manage_reset_data_source").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    $("#modal_reset_data_source").modal();

    $("#btn_modal_reset_data_source_confirmed").click(function () {
      // Define the query
      var searchQuery = "| outputlookup trackme_data_source_monitoring";

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-5m",
        latest_time: "now",
      };

      // Run a normal search that immediately returns the job's SID
      service.search(searchQuery, searchParams, function (err, job) {
        $("#cssloader").remove();
        $("body").append(
          '<div id="cssloader" class="loader loader-default is-active" data-text="Flushing data source KVstore collection and running short term tracker, please wait..."></div>'
        );

        function audit_failure() {
          // Audit failure change
          var time = new Date().getTime();
          var audit_record = {
            time: time,
            action: "failure",
            user: currentUser,
            change_type: "reset",
            object_category: "data_source",
            object: "full_collection",
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
          $("#cssloader").remove();
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
                    $("#cssloader").remove();
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
                          $("#cssloader").remove();

                          // Audit success change
                          var time = new Date().getTime();
                          var audit_record = {
                            time: time,
                            action: "success",
                            user: currentUser,
                            change_type: "reset",
                            object_category: "data_source",
                            object: "full_collection",
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

                          $("#modal_reset_done").modal();
                        },
                        failed: function (properties) {
                          let errorStr = "Unknown Error!";
                          if (
                            properties &&
                            properties._properties &&
                            properties._properties.messages &&
                            properties._properties.messages[0]["text"]
                          ) {
                            errorStr =
                              properties._properties.messages[0]["text"];
                          } else if (
                            properties &&
                            properties._properties &&
                            properties._properties.messages
                          ) {
                            errorStr = JSON.stringify(
                              properties._properties.messages
                            );
                          }
                          $("#cssloader").remove();
                          audit_failure();
                          $("#modal_update_collection_failure_return")
                            .find(".modal-error-message p")
                            .text(errorStr);
                          $("#modal_update_collection_failure_return").modal();
                        },
                        error: function (err) {
                          done(err);
                          audit_failure();
                          $("#cssloader").remove();
                          $("#modal_update_collection_failure").modal();
                        },
                      }
                    );
                  }
                });
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
                $("#cssloader").remove();
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                $("#cssloader").remove();
                audit_failure();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    });
  });

  // data host

  $("#btn_manage_reset_data_host").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    $("#modal_reset_data_host").modal();

    $("#btn_modal_reset_data_host_confirmed").click(function () {
      // Define the query
      var searchQuery = "| outputlookup trackme_host_monitoring";

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-5m",
        latest_time: "now",
      };

      // Run a normal search that immediately returns the job's SID
      service.search(searchQuery, searchParams, function (err, job) {
        $("#cssloader").remove();
        $("body").append(
          '<div id="cssloader" class="loader loader-default is-active" data-text="Flushing data hosts KVstore collection and running short term tracker, please wait..."></div>'
        );

        function audit_failure() {
          // Audit failure change
          var time = new Date().getTime();
          var audit_record = {
            time: time,
            action: "failure",
            user: currentUser,
            change_type: "reset",
            object_category: "data_host",
            object: "full_collection",
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
          $("#cssloader").remove();
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
                    $("#cssloader").remove();
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
                          // Audit success change
                          var time = new Date().getTime();
                          var audit_record = {
                            time: time,
                            action: "success",
                            user: currentUser,
                            change_type: "reset",
                            object_category: "data_host",
                            object: "full_collection",
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

                          $("#cssloader").remove();
                          $("#modal_reset_done").modal();
                        },
                        failed: function (properties) {
                          let errorStr = "Unknown Error!";
                          if (
                            properties &&
                            properties._properties &&
                            properties._properties.messages &&
                            properties._properties.messages[0]["text"]
                          ) {
                            errorStr =
                              properties._properties.messages[0]["text"];
                          } else if (
                            properties &&
                            properties._properties &&
                            properties._properties.messages
                          ) {
                            errorStr = JSON.stringify(
                              properties._properties.messages
                            );
                          }
                          $("#cssloader").remove();
                          audit_failure();
                          $("#modal_update_collection_failure_return")
                            .find(".modal-error-message p")
                            .text(errorStr);
                          $("#modal_update_collection_failure_return").modal();
                        },
                        error: function (err) {
                          done(err);
                          $("#cssloader").remove();
                          audit_failure();
                          $("#modal_update_collection_failure").modal();
                        },
                      }
                    );
                  }
                });
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
                $("#cssloader").remove();
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                $("#cssloader").remove();
                audit_failure();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    });
  });

  // metric host

  // reset collection
  $("#btn_manage_reset_metric_host").click(function () {
    // When the Submit button is clicked, get all the form fields by accessing token values
    var tokens = mvc.Components.get("default");

    $("#modal_reset_metric_host").modal();

    $("#btn_modal_reset_metric_host_confirmed").click(function () {
      // Define the query
      var searchQuery = "| outputlookup trackme_metric_host_monitoring";

      // Set the search parameters--specify a time range
      var searchParams = {
        earliest_time: "-5m",
        latest_time: "now",
      };

      // Run a normal search that immediately returns the job's SID
      service.search(searchQuery, searchParams, function (err, job) {
        $("#cssloader").remove();
        $("body").append(
          '<div id="cssloader" class="loader loader-default is-active" data-text="Flushing metric hosts KVstore collection and running metric tracker, please wait..."></div>'
        );

        function audit_failure() {
          // Audit failure change
          var time = new Date().getTime();
          var audit_record = {
            time: time,
            action: "failure",
            user: currentUser,
            change_type: "reset",
            object_category: "data_host",
            object: "full_collection",
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
          $("#cssloader").remove();
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
                    $("#cssloader").remove();
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
                          // Audit success change
                          var time = new Date().getTime();
                          var audit_record = {
                            time: time,
                            action: "success",
                            user: currentUser,
                            change_type: "reset",
                            object_category: "metric_host",
                            object: "full_collection",
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

                          $("#cssloader").remove();
                          $("#modal_reset_done").modal();
                        },
                        failed: function (properties) {
                          let errorStr = "Unknown Error!";
                          if (
                            properties &&
                            properties._properties &&
                            properties._properties.messages &&
                            properties._properties.messages[0]["text"]
                          ) {
                            errorStr =
                              properties._properties.messages[0]["text"];
                          } else if (
                            properties &&
                            properties._properties &&
                            properties._properties.messages
                          ) {
                            errorStr = JSON.stringify(
                              properties._properties.messages
                            );
                          }
                          $("#cssloader").remove();
                          audit_failure();
                          $("#modal_update_collection_failure_return")
                            .find(".modal-error-message p")
                            .text(errorStr);
                          $("#modal_update_collection_failure_return").modal();
                        },
                        error: function (err) {
                          done(err);
                          $("#cssloader").remove();
                          audit_failure();
                          $("#modal_update_collection_failure").modal();
                        },
                      }
                    );
                  }
                });
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
                $("#cssloader").remove();
                audit_failure();
                $("#modal_update_collection_failure_return")
                  .find(".modal-error-message p")
                  .text(errorStr);
                $("#modal_update_collection_failure_return").modal();
              },
              error: function (err) {
                done(err);
                $("#cssloader").remove();
                audit_failure();
                $("#modal_update_collection_failure").modal();
              },
            }
          );
        }
      });
    });
  });

  //
  // RUN TRACKERS
  //

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
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#cssloader").remove();
      $("body").append(
        '<div id="cssloader" class="loader loader-default is-active" data-text="Running the data sources short term tracker..."></div>'
      );

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
        $("#cssloader").remove();
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
              $("#cssloader").remove();
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
              $("#cssloader").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#cssloader").remove();
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
      latest_time: "now",
    };

    // Run a normal search that immediately returns the job's SID
    service.search(searchQuery, searchParams, function (err, job) {
      $("#cssloader").remove();
      $("body").append(
        '<div id="cssloader" class="loader loader-default is-active" data-text="Running the host short term tracker..."></div>'
      );

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
        $("#cssloader").remove();
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
              $("#cssloader").remove();
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
              $("#cssloader").remove();
              $("#modal_update_collection_failure_return")
                .find(".modal-error-message p")
                .text(errorStr);
              $("#modal_update_collection_failure_return").modal();
            },
            error: function (err) {
              done(err);
              $("#cssloader").remove();
              $("#modal_update_collection_failure").modal();
            },
          }
        );
      }
    });
  });

  //
  // END
  //
});
