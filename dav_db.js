var dav = require("./dav");
console.log("Initialize Dav...");

exports.database = function(settings)
{
  this.db=null;

  this.settings = settings;
  this.settings.cache = 0;
  this.settings.writeInterval = 0;
  this.settings.json = true;
}

exports.database.prototype.init = function(callback)
{
  this.db=dav.nodeRemoteStorage(this.settings);
  callback();
}

exports.database.prototype.get = function(key, callback)
{
  this.db.get(key, callback);
}

exports.database.prototype.set = function(key, value, callback)
{
  console.log("DB SET " + key)
  this.db.set(key, value, callback);
}

exports.database.prototype.remove = function(key, callback)
{
  console.log("REMOVE failed: " + key);
}

exports.database.prototype.doBulk = function (bulk, callback)
{
  var _this = this;
  for(var i in bulk)
  {  
    if(bulk[i].type == "set")
    {
      this.db.set(bulk[i].key, bulk[i].value, null)
    }
    else if(bulk[i].type == "remove")
    {
      this.db.remove(bulk[i].key, null)
    }
  }
}

exports.database.prototype.close = function(callback)
{
  callback(null);
}

