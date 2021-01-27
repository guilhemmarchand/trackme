require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function(
    $,
    _,
    mvc
) {
    var multiselects = _(mvc.Components.toJSON()).filter(function(obj) {
        // This seems hacky; there should be a better way to do this
        return obj.settings && obj.settings.get("type") === "multiselect" && obj.$el[0].className.indexOf("input-multiselect") > -1;
    });
    _(multiselects).each(function(multiselect) {
        multiselect.on("change", function() {
            var values = this.val();
            // I assume the default multiselect value will be the first (hardcoded) choice
            // Like <choice value="*">All</choice>
            // If there is no hardcoded choice, then .options.choices[0] won't exist...
            var first_choice_value = this.options.choices[0].value;
            // If the user removed everything then add the first choice "All" back
            if(values.length === 0) {
                this.val([first_choice_value]);
            }
            // If the user choose something else then remove the first choice "All" (if it's there)
            else if(values.indexOf(first_choice_value) >= 0 && values.length > 1) {
                this.val(_.without(values, first_choice_value));
            }
        });
    });
});