var translateInvoices = require('../invoices/model').translate;
var translatePayments = require('../payments/model').translate;
var ioutils = require ('../ioutils');

exports.fetch = function(service, callback, settings) {
  var widget = this;
  var fetchAPI = ioutils.createFetchAPI('https', options(service));
  var io = ioutils.updates(service.id, callback);

  if (settings.clientId) {
    getInvoicesPayments(settings.clientId);
  } else {
    getClients();
  }

  function getInvoicesPayments(clientId) {
    var invoiceData = {},
      projectData = {};
    utils.when(
      function(done) {
        var path = '/invoices.json?client_type=Company&client_id=' + clientId;
        fetchAPI('invoices', path, invoiceData, done);
      },
      function(done) {
        var path = '/projects.json?client_type=Company&client_id=' + clientId;
        fetchAPI('projects', path, projectData, done);
      }
    ).then(function() {
      if (invoiceData.error) {
        io.updateError(invoiceData.error);
      } else if (projectData.error) {
        io.updateError(projectData.error);
      } else {
        var data = translateInvoices(invoiceData.data);
        var uninvoiced = widget.translateUninvoicedProjectTime(projectData.data);
        data.data.unshift(uninvoiced);
        io.updateData(data);
      }
    });
    var paymentData = {};
    utils.when(
      function(done) {
        var path = '/payments.json?client_type=Company&client_id=' + clientId;
        fetchAPI('payments', path, paymentData, done);
      }
    ).then(function() {
      if (paymentData.error) {
        io.updateError(paymentData.error);
      } else {
        io.updateData(translatePayments(paymentData.data));
      }
    });
  }

  function getClients() {
    var clientData = {};
    utils.when(
      function(done) {
        io.updateStatus('Looking up client list');
        var path = '/client_companies';
        fetchAPI('client list', path, clientData, done);
      }
    ).then(function() {
      if (clientData.error) {
        io.updateError('Client list could not be retrieved, callback')
      } else {
        io.updateData(widget.translate(clientData.data));
      }
    })
  }
};

// Translate fetched response to db store format
exports.translate = function(data) {
  data = data.map(function(client) {
    return {
      id: JSON.stringify(client.id),
      attributes: {
        name: client.name
      }
    }
  });
  return {
    type: 'client',
    data
  }
};

exports.translateUninvoicedProjectTime = function(data) {
  var uninvoicedAmount = 0;
  var date = new Date().toISOString().slice(0, 10);
  for (var i in data) {
    uninvoicedAmount += data[i].uninvoiced_item_cost;
  }
  return {
    id: 'UNINVOICED',
    attributes: {
      amount: uninvoicedAmount,
      date,
      due: date,
      id: 'Uninvoiced',
      status: 'Uninvoiced'
    }
  }
};

function options(service) {
  var auth = 'Basic ' + new Buffer(service.user + ':' + service.token).toString('base64');
  return {
    host: service.url || 'api.cashboardapp.com',
    port: 443,
    headers: {
      'Accept': 'application/json',
      'Authorization': auth
    }
  };
}
