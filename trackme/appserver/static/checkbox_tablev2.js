require([
     'underscore',
     'jquery',
     'splunkjs/mvc',
     'splunkjs/mvc/tableview',
     'splunkjs/mvc/simplexml/ready!'
 ], function(_, $, mvc, TableView) {
     // Access the "default" token model
     var tokens = mvc.Components.get("default");
     var selected_values_array = [];
     var selected_values_array2 = [];
     var selected_values_array3 = [];
     var selected_values_array4 = [];
     var selected_values_array5 = [];
     var selected_values_array6 = [];
     var selected_values_array7 = [];
     var selected_values_array8 = [];
     var selected_values_array9 = [];
     var selected_values_array10 = [];
     var selected_values_array11 = [];
     var selected_values_array12 = [];
     var selected_values_array13 = [];
     var selected_values_array14 = [];
     var selected_values_array15 = [];
     var selected_values_array16 = [];
     var submittedTokens = mvc.Components.get('submitted');

     // Table1

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
                 tokens.set("removeWhitelistDataSource", selected_values_array.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableWhiteListDataSource"];
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


     var CustomRangeRenderer2 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
     // Table2
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-allowlist-data-host"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array2.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array2.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array2.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array2);
                 var selected_array = selected_values_array2;
                 tokens.set("removeWhitelistDataHost", selected_values_array2.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableWhiteListDataHost"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer2());
                 tableView.table.render();
             });
         }
     }

     // Table3

     var CustomRangeRenderer3 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-allowlist-metric-host"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array3.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array3.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array3.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array3);
                 tokens.set("removeWhitelistMetricHost", selected_values_array3.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableWhiteListMetricHost"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer3());
                 tableView.table.render();
             });
         }
     }

     // Table4

     var CustomRangeRenderer4 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-data-source-host"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array4.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array4.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array4.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array4);
                 tokens.set("removeBlacklistDataSourceHost", selected_values_array4.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListDataSourceHost"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer4());
                 tableView.table.render();
             });
         }
     }

     // Table5

     var CustomRangeRenderer5 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-data-source-sourcetype"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array5.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array5.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array5.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array5);
                 tokens.set("removeBlacklistDataSourceSourcetype", selected_values_array5.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListDataSourceSourcetype"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer5());
                 tableView.table.render();
             });
         }
     }

     // Table6

     var CustomRangeRenderer6 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-data-source-index"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array6.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array6.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array6.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array6);
                 tokens.set("removeBlacklistDataSourceIndex", selected_values_array6.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListDataSourceIndex"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer6());
                 tableView.table.render();
             });
         }
     }

     // Table7

     var CustomRangeRenderer7 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-data-host-host"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array7.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array7.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array7.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array7);
                 tokens.set("removeBlacklistDataHostHost", selected_values_array7.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListDataHostHost"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer7());
                 tableView.table.render();
             });
         }
     }

     // Table8

     var CustomRangeRenderer8 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-data-host-sourcetype"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array8.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array8.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array8.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array8);
                 tokens.set("removeBlacklistDataHostSourcetype", selected_values_array8.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListDataHostSourcetype"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer8());
                 tableView.table.render();
             });
         }
     }

     // Table9

     var CustomRangeRenderer9 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-data-host-index"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array9.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array9.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array9.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array9);
                 tokens.set("removeBlacklistDataHostIndex", selected_values_array9.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListDataHostIndex"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer9());
                 tableView.table.render();
             });
         }
     }

     // Table10

     var CustomRangeRenderer10 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-metric-host-host"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array10.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array10.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array10.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array10);
                 tokens.set("removeBlacklistMetricHostHost", selected_values_array10.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListMetricHostHost"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer10());
                 tableView.table.render();
             });
         }
     }

     // Table11

     var CustomRangeRenderer11 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-metric-host-index"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array11.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array11.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array11.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array11);
                 tokens.set("removeBlacklistMetricHostIndex", selected_values_array11.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListMetricHostIndex"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer11());
                 tableView.table.render();
             });
         }
     }

     // Table12

     var CustomRangeRenderer12 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-blocklist-metric-category"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array12.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array12.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array12.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array12);
                 tokens.set("removeBlacklistMetricHostMetricCategory", selected_values_array12.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableBlackListMetricHostMetricCategory"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer12());
                 tableView.table.render();
             });
         }
     }

     // Table13

     var CustomRangeRenderer13 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-metric-policy"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array13.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array13.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array13.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array13);
                 tokens.set("removeMetricPolicies", selected_values_array13.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableMetricPolicies"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer13());
                 tableView.table.render();
             });
         }
     }

     // Table14

     var CustomRangeRenderer14 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-lagging-data-source-policy"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array14.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array14.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array14.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array14);
                 tokens.set("removeDataSourceLaggingPolicy", selected_values_array14.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableCustomLagging"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer14());
                 tableView.table.render();
             });
         }
     }

     // Table15

     var CustomRangeRenderer15 = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-elastic-source-shared-policy"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                 //console.log("checked",$(this).attr('class'));
                 //console.log("checked",$(this).attr('value'));
                 if($(this).attr('class')==="checkbox")
                 {
                     selected_values_array15.push($(this).attr('value'));
                     $(this).removeClass();
                     $(this).addClass("checkbox checked");
                 }
                 else {
                     $(this).removeClass();
                     $(this).addClass("checkbox");
                     var i = selected_values_array15.indexOf($(this).attr('value'));
                     if(i != -1) {
                         selected_values_array15.splice(i, 1);
                     }
                 }
                 //console.log(selected_values_array15);
                 tokens.set("removeElasticSourceShared", selected_values_array15.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableElasticSources"];
     for (i=0;i<tableIDs.length;i++) {
         var sh = mvc.Components.get(tableIDs[i]);
         if(typeof(sh)!="undefined") {
             sh.getVisualization(function(tableView) {
                 // Add custom cell renderer and force re-render
                 tableView.table.addCellRenderer(new CustomRangeRenderer15());
                 tableView.table.render();
             });
         }
     }

     // Table16

     var CustomRangeRenderer16 = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return _(['select']).contains(cell.field);
        },
        render: function($td, cell) {
            var a = $('<div>').attr({"id":"chk-elastic-source-dedicated-policy"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
                //console.log("checked",$(this).attr('class'));
                //console.log("checked",$(this).attr('value'));
                if($(this).attr('class')==="checkbox")
                {
                    selected_values_array16.push($(this).attr('value'));
                    $(this).removeClass();
                    $(this).addClass("checkbox checked");
                }
                else {
                    $(this).removeClass();
                    $(this).addClass("checkbox");
                    var i = selected_values_array16.indexOf($(this).attr('value'));
                    if(i != -1) {
                        selected_values_array16.splice(i, 1);
                    }
                }
                //console.log(selected_values_array16);
                tokens.set("removeElasticSourceDedicated", selected_values_array16.join());
                submittedTokens.set(tokens.toJSON());
            }).appendTo($td);
        }
    });

    //List of table IDs
    var tableIDs = ["tableElasticSourcesDedicated"];
    for (i=0;i<tableIDs.length;i++) {
        var sh = mvc.Components.get(tableIDs[i]);
        if(typeof(sh)!="undefined") {
            sh.getVisualization(function(tableView) {
                // Add custom cell renderer and force re-render
                tableView.table.addCellRenderer(new CustomRangeRenderer16());
                tableView.table.render();
            });
        }
    }

 })
