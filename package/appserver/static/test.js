require([
  "splunkjs/mvc",
  "splunkjs/mvc/utils",
  "splunkjs/mvc/tokenutils",
  "underscore",
  "jquery",
  "splunkjs/mvc/simplexml",
  "splunkjs/mvc/layoutview",
  "splunkjs/mvc/simplexml/dashboardview",
  "splunkjs/mvc/simplexml/dashboard/panelref",
  "splunkjs/mvc/simplexml/element/chart",
  "splunkjs/mvc/simplexml/element/event",
  "splunkjs/mvc/simplexml/element/html",
  "splunkjs/mvc/simplexml/element/list",
  "splunkjs/mvc/simplexml/element/map",
  "splunkjs/mvc/simplexml/element/single",
  "splunkjs/mvc/simplexml/element/table",
  "splunkjs/mvc/simplexml/element/visualization",
  "splunkjs/mvc/simpleform/formutils",
  "splunkjs/mvc/simplexml/eventhandler",
  "splunkjs/mvc/simplexml/searcheventhandler",
  "splunkjs/mvc/simpleform/input/dropdown",
  "splunkjs/mvc/simpleform/input/radiogroup",
  "splunkjs/mvc/simpleform/input/linklist",
  "splunkjs/mvc/simpleform/input/multiselect",
  "splunkjs/mvc/simpleform/input/checkboxgroup",
  "splunkjs/mvc/simpleform/input/text",
  "splunkjs/mvc/simpleform/input/timerange",
  "splunkjs/mvc/simpleform/input/submit",
  "splunkjs/mvc/searchmanager",
  "splunkjs/mvc/savedsearchmanager",
  "splunkjs/mvc/postprocessmanager",
], function (
  mvc,
  utils,
  TokenUtils,
  _,
  $,
  DashboardController,
  LayoutView,
  Dashboard,
  PanelRef,
  ChartElement,
  EventElement,
  HtmlElement,
  ListElement,
  MapElement,
  SingleElement,
  TableElement,
  VisualizationElement,
  FormUtils,
  EventHandler,
  SearchEventHandler,
  DropdownInput,
  RadioGroupInput,
  LinkListInput,
  MultiSelectInput,
  CheckboxGroupInput,
  TextInput,
  TimeRangeInput,
  SubmitButton,
  SearchManager,
  SavedSearchManager,
  PostProcessManager
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

  //inputLinkDataSource.on("change", function (newValue) {
  //  FormUtils.handleValueChange(inputLinkDataSource);
  //});

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

  //console.log("test");
  //setToken("show_data_source_overview", "true");
});
