var https = require('https');

// Fetch issues from service endpoint
exports.fetch = function(service, callback) {
  var cashboard = this,
      out = {id: service.id, name: service.name};

  var auth = 'Basic ' + new Buffer(service.user + ':' + service.token).toString('base64');
  var options = {
    host: service.url || 'api.cashboardapp.com',
    port: 443,
    path: '/projects/' + service.identifier + '.json',
    headers: {
      'Accept': 'application/json',
      'Authorization': auth
    }
  };

  var req = https.get(options, function(res) {
    if (res.statusCode == 200) {
      var data = "";
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function(){
        try {
        var resData = JSON.parse(data);
        out.results = cashboard.translate(resData);
        } catch (err) {
          console.log("Got a parsing error: " + err.message);
          out.error = err.message;
        }
        callback(out);
      });
    }
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    out.error = e.message;
    callback(out);
  });
};

// Translate fetched response to db store format
exports.translate = function(data) {
  return {
    invoice: data.uninvoiced_item_cost,
    expenses: data.uninvoiced_expense_cost
  };
};

// Write fetched results to db
exports.write = function() {
};
