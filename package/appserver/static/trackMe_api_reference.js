require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {

    // Access the "default" token model
    var tokens = mvc.Components.get("default");

    // Search bar
    var SearchBarView = require("splunkjs/mvc/searchbarview");
    new SearchBarView({
        id: "example-search-bar",
        managerid: "example-bar-search",
        el: $("#divSearchBar1")
    }).render();
    
    // Event viewer
    var EventsViewer = require("splunkjs/mvc/eventsviewerview");
    new EventsViewer({
        id: "example-event",
        managerid: "example-bar-search",
        rowNumbers: false,
        el: $("#divSearchBar2") // seperate div
    }).render();
    
    // Search Manager
    var SearchManager = require("splunkjs/mvc/searchmanager");
    new SearchManager({
        id: "example-bar-search",
        search: "| trackme url=\"/services/trackme/v1/smart_status/ds_smart_status\" mode=\"get\" body=\"{'describe': 'true'}\"",            
    });

    // Hooking up events 
    var manager = splunkjs.mvc.Components.getInstance("example-bar-search");
    var searchbar = splunkjs.mvc.Components.getInstance("example-search-bar");
    var timerange = searchbar.timerange;    

    searchbar.on("change", function() {
        manager.set("search", searchbar.val()); 
    });
    
    timerange.on("change", function() {
        manager.search.set(timerange.val()); 
    });        

});
