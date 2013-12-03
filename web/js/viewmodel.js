/*global window, $, ko */
function ViewModel() {
    "use strict";

    var viewModel = this;

    //Tabs
    this.tabs = ['Clients', 'Inventory', 'Orders', 'Manufacturing'];
    this.activeTab = ko.observable(viewModel.tabs[0]);
    this.setActiveTab = function (tabName) {
        return function () {
            viewModel.activeTab(tabName);
        };
    };

    //Clients
    this.clients = ko.observableArray([]);
    this.editingClient = ko.observable();
    this.niceCount = ko.computed(function () {
        var count = 0;
        ko.utils.arrayForEach(viewModel.clients(), function (client) {
            if ("1" === client.nice()) {
                count += 1;
            }
        });
        return count;
    });
    this.getClients = function (done) {
        $.ajax('/api/client/list', {
            success: function (data) {
                var mapped = ko.mapping.fromJS(data);
                viewModel.clients(mapped());
                if (typeof done === 'function') {
                    done();
                }
            }
        });
    };
    this.newClient = function () {
        var newClient = ko.mapping.fromJS({id: null, name: '', nice: true});
        viewModel.editingClient(newClient);
    };
    this.editClient = function () {
        var copy = ko.mapping.fromJS(ko.mapping.toJS(this));
        viewModel.editingClient(copy);
    };
    this.saveClient = function (done) {
        var client = viewModel.editingClient(),
            unmapped = ko.mapping.toJS(client),
            url = '/api/client',
            isNew = !client.id();
        if (!isNew) {
            url = url + '/' + client.id();
        }
        $.ajax(url, {
            type: isNew ? 'POST' : 'PUT',
            data: unmapped,
            success: function (data) {
                var index,
                    clients = viewModel.clients();
                if (data.newId) {
                    client.id(data.newId);
                    viewModel.clients.push(client);
                } else {
                    for (index = 0; index < clients.length; index += 1) {
                        if (client.id() === clients[index].id()) {
                            break;
                        }
                    }
                    clients[index] = client;
                    viewModel.clients(clients);
                }
                viewModel.editingClient(undefined);
                if (typeof done === 'function') {
                    done();
                }
            }
        });
    };
    this.deleteClient = function (done) {
        var client = this;
        $.ajax('/api/client/' + client.id(), {
            type: 'DELETE',
            success: function () {
                var originalClient;
                originalClient = ko.utils.arrayFirst(viewModel.clients(), function (item) {
                    return client.id() === item.id();
                });
                viewModel.clients.remove(originalClient);
                viewModel.editingClient(undefined);
                if (typeof done === 'function') {
                    done();
                }
            }
        });
    };
}

