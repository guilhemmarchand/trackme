require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function($, mvc, TableView) {
    var CustomIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            if (typeof cell.value === "string") {
                return cell.value && cell.value.substr(0,5) === "icon|";
            }
        },
        render: function($td, cell) {
            var parts = cell.value.split("|");
            $td.css({'text-align':'center'}).html('<div class="' + parts[1] + '"><i class="' + parts[2] + '"></i></div>');
            if (parts.length > 3) {
                $td.attr("title", parts[3]);
            }
        }
    });
    // Hook into all tables on the page
    $("div.dashboard-element.table").each(function(){
        mvc.Components.get($(this).attr("id")).getVisualization(function(tableView){
            tableView.addCellRenderer(new CustomIconRenderer());
        });
    });
});