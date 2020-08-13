require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {

    var CustomTooltipRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return cell.field === 'raw_sample';
        },
        render: function($td, cell) {

            var message = cell.value;
            var tip = cell.value;

            if(message.length > 180) { message = message.substring(0,179) + "..." }

            $td.html(_.template('<a href="#" data-toggle="tooltip" data-container="body" data-placement="top" title="<%- tip%>"><%- message%></a>', {
                tip: tip,
                message: message
            }));

            // This line wires up the Bootstrap tooltip to the cell markup
            $td.children('[data-toggle="tooltip"]').tooltip();
        }
    });

    mvc.Components.get('tableDataSamplingSimulateCustomRuleLatestEvent').getVisualization(function(tableView) {

        // Register custom cell renderer
        tableView.table.addCellRenderer(new CustomTooltipRenderer());

        // Force the table to re-render
        tableView.table.render();
    });

});