/*global test, asyncTest, ok, equal, notEqual, start, ViewModel, $, ko */
function seed(viewModel) {
    "use strict";
    var clients = ko.mapping.fromJS([
        {"id": "1", "name": "George Bailey", "nice": true},
        {"id": "2", "name": "Mary Hatch", "nice": true},
        {"id": "3", "name": "Henry F. Potter", "nice": false}
    ]);
    viewModel.clients(clients());
    return viewModel;
}

test("View Model", function () {
    "use strict";
    var viewModel = new ViewModel();
    ok(viewModel, "View Model exists");
    equal(typeof viewModel, 'object', "View Model is an object");
});

test("Tabs", function () {
    "use strict";
    var viewModel = new ViewModel(),
        defaultTabName = 'Clients',
        otherTabName = 'Orders';
    equal(viewModel.activeTab(), defaultTabName, "Clients is the default tab");
    viewModel.setActiveTab(otherTabName)();
    equal(viewModel.activeTab(), otherTabName, "Can change tabs");
    viewModel.setActiveTab(defaultTabName)();
});

asyncTest("Get Clients", function () {
    "use strict";
    var viewModel = new ViewModel(),
        server = this.sandbox.useFakeServer();

    server.respondWith("get", "/api/client/list",
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify([
                {"id": "1", "name": "George Bailey", "nice": true},
                {"id": "2", "name": "Mary Hatch", "nice": true},
                {"id": "3", "name": "Henry F. Potter", "nice": false}
            ])
        ]);

    viewModel.getClients(function () {
        equal(viewModel.clients().length, 3, "Have three clients");
        equal(viewModel.clients()[1].name(), 'Mary Hatch', "The 2nd is Mary");
        equal(viewModel.clients()[2].nice(), false, "The 3rd is naughty");
        start();
    });
    server.respond();
});

test("New Client", function () {
    "use strict";
    var viewModel = new ViewModel(),
        editing = viewModel.editingClient();
    equal(typeof editing, "undefined", "We're not already editing anything");
    viewModel.newClient();
    editing = viewModel.editingClient();
    equal(editing.id(), null, "New Client's don't have an ID yet");
});

asyncTest("Save New Client", function () {
    "use strict";
    var viewModel = new ViewModel(),
        server = this.sandbox.useFakeServer(),
        clientCount = viewModel.clients().length;

    viewModel.newClient();
    viewModel.editingClient().name('Billy Bailey');

    server.respondWith("post", "/api/client",
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify({ result: 'ok', newId: clientCount + 1 })
        ]);

    viewModel.saveClient(function () {
        var editing = viewModel.editingClient();
        equal(typeof editing, "undefined", "We're not still editing anything");
        equal(viewModel.clients().length, clientCount + 1, "Have another client");
        start();
    });
    server.respond();
});

asyncTest("Edit Client", function () {
    "use strict";
    var viewModel = seed(new ViewModel()),
        server = this.sandbox.useFakeServer(),
        clientCount = viewModel.clients().length,
        first = viewModel.clients()[0],
        newName = 'Billy Bailey',
        oldName = first.name();

    viewModel.editClient.apply(first);
    ok(viewModel.editingClient());
    viewModel.editingClient().name(newName);
    equal(first.name(), oldName, "Editing a copy, not the original");

    server.respondWith("put", "/api/client/" + first.id(),
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify({ result: 'ok' })
        ]);

    viewModel.saveClient(function () {
        var editing = viewModel.editingClient();
        equal(typeof editing, "undefined", "We're not still editing anything");
        equal(viewModel.clients().length, clientCount, "Have same client count");
        equal(viewModel.clients()[0].name(), newName, "Changed value");
        start();
    });
    server.respond();
});

asyncTest("Delete Client", function () {
    "use strict";
    var viewModel = seed(new ViewModel()),
        server = this.sandbox.useFakeServer(),
        clientCount = viewModel.clients().length,
        first = viewModel.clients()[0],
        name = first.name();

    viewModel.editingClient(first); //Delete is done from edit dialog
    viewModel.deleteClient.apply(first);

    server.respondWith("delete", "/api/client/" + first.id(),
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify({ result: 'ok' })
        ]);

    viewModel.deleteClient.call(first, function () {
        var editing = viewModel.editingClient();
        equal(typeof editing, "undefined", "We're not still editing anything");
        equal(viewModel.clients().length, clientCount - 1, "One less client");
        notEqual(viewModel.clients()[0].name(), name, "Different client in first position");
        start();
    });
    server.respond();
});