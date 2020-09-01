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
     var submittedTokens = mvc.Components.get('submitted');

     // Table1

     var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
         canRender: function(cell) {
             return _(['select']).contains(cell.field);
         },
         render: function($td, cell) {
             var a = $('<div>').attr({"id":"chk-data-sampling-custom-rule"+cell.value,"value":cell.value}).addClass('checkbox').click(function() {
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
                 tokens.set("removeDataSamplingCustomRule", selected_values_array.join());
                 submittedTokens.set(tokens.toJSON());
             }).appendTo($td);
         }
     });

     //List of table IDs
     var tableIDs = ["tableDataSamplingShowCustomRules"];
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

 })
