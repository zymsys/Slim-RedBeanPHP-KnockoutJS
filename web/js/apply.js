/*global ViewModel, window, $, ko */

$(function () {
    "use strict";
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
    window.viewModel = viewModel; //Export for debugging
});

//From http://stackoverflow.com/questions/14683953/show-twitter-bootstrap-modal-dialog-automatically-with-knockout
ko.bindingHandlers.showModal = {
    update: function (element, valueAccessor) {
        "use strict";
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
            // this is to focus input field inside dialog
            $("input", element).focus();
        } else {
            $(element).modal('hide');
        }
    }
};