var cluster = require('cluster');
var http = require('http');
var numWorkers = 2;

/*
	handlePostRequest -- Process the post request
*/
function handlePostRequest(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

	request.on('data', function(data) {
		// Collect the post data
		queryData += data;
		// Handle too large situation
		if(queryData.length > 1e6) {
			queryData = "";
			response.writeHead(413, {'Content-Type': 'text/plain'}).end();
			request.connection.destroy();
		}
	});

	// Wrap up
	request.on('end', function() {
		response.post = JSON.parse(queryData);
		callback();
	});
}

// Here is where we spin off the worker threads
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
	http.createServer(function(request, response) {
		if(request.method == 'POST') {
			handlePostRequest(request, response, function() {
				// Just log to the console
				console.log(new Date().getTime() + ': POST request');
				//console.log(response.post);
				
				// Return a 200 to the requester
				response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
				response.end();
			});
		} else {
				console.log(new Date().getTime() + ': GET request');
				response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
				response.post = 'Hello!';
				response.end();
		}

	}).listen(8079);
}


