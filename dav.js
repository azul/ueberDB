http = require('http')

nodeRemoteStorage = function( params ){
  var dav = params
  function keyToUrl( userAddress, key ) {
    var userAddressParts = userAddress.split('@')
    var resource = dav.dataScope
    var url = dav.davUrl
            +'webdav/'+ userAddressParts[1]
            +'/'+ userAddressParts[0]
            +'/'+ resource
            +'/'+ key
    return url
  }

  dav.getUserAddress = function() {
    return dav.userAddress
  }

  dav.get = function( key, cb ){
    console.log('GET ' + key);
    var options = {
      host: 'yourremotestorage.com',
      port: 80,
      path: keyToUrl( dav.userAddress, key),
      method: 'GET'
    };

    var req = http.request(options, function(res) {
      console.log('GET STATUS: ' + res.statusCode);
      if(res.statusCode == 404) {
        cb(false, null)
      } else {
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          cb(false, chunk)
        });
      }
    });

    req.on('error', function(e) {
      // I have no idea if this works. Could not find info about the
      // error in the API
      if(e.status == 404) {
        cb(false, null)
      } else {
        cb(e, null)
      }
    });

    req.end();
  }
  
  dav.set = function( key, value, cb ){
    var auth = "Basic " + dav.davToken;
    var headers = {
      Authorization: auth
    }
    var options = {
      host: 'yourremotestorage.com',
      port: 80,
      headers: headers,
      path: keyToUrl( dav.userAddress, key), // + "?withCredentials=true",
      method: 'PUT'
    };

    var req = http.request(options, function(res) {
      console.log('PUT STATUS: ' + res.statusCode);
      res.on('data', function (text) {
          console.log('Put received DATA: ' + text);
      });
      cb(false, null)
    });

    req.write(value);

    req.on('error', function(e) {
      console.log('SET Error: ' + text);
      cb(e, null)
    });
    req.end();

  }
  return dav
}

exports.nodeRemoteStorage = nodeRemoteStorage;
