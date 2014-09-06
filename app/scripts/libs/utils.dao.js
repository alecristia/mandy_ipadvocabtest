/* The Data Access Object (DAO) ----------------------------------------------------
This class functions as an access point to the database.  In the constructor, it accept a function returned from persistence.define which define a schema and how to access the table created from the schema. In our case, it is stuff notes. The Backbone.sync function that we override called the DAO object to create, read, update and delete record in the table associate with our Backbone.Models. */

var DAO = function() {
  this.db = persistence;
};

_.extend(DAO.prototype, {

  // Fetches all the records in our table and returns the results to the callback function
  findAll: function(model) {
    console.log("DAO findAll models");
    var deferred = $.Deferred();

    var all = model.persistableEntity.all();

    all.list(function(results){
      deferred.resolve(results);
    });

    return deferred;
  },

  // Count all the records in our table and returns the number to the callback function
  count: function(model) {
    console.log("DAO count models");
    var deferred = $.Deferred();

    var all = model.persistableEntity.all();

    all.count(function(results){
      deferred.resolve(results);
    });

    return deferred;
  },

  //Gets a record based on the id, returns the results to the callback function
  findById: function(id, callback) {
    console.log("getting a model information by the id passed");
    if (id != 0)
    {
      this.db.load(id, callback(results));
    } else {
      alert("Transaction Error: " + error);
    }

    // TODO
  },

  // Gets a record based on a field, returns the results to the callback function
  findBy: function(property, value, callback) {
    console.log("getting a model information by the property '"+property+"' with value "+value);
    if (typeof property === 'undefined') return;
    if (typeof value === 'undefined') return;

    this.db.findBy(property, value, callback(results));

    // TODO
  },

  // Creates a new record in the table based on the passed Model
  create: function(models) {
    console.log("DAO create models");
    var globalDeferred = $.Deferred();
    var deferreds = [];

    if (!(models instanceof Array)) {
      models = [models];
    }

    _.each(models, _.bind(function(model){

      var deferred = $.Deferred();

      this.db.add(model.persistable());

      this.db.flush(function(){
        deferred.resolve();
      });

      deferreds.push(deferred);

    }, this));

    $.when.apply($, deferreds).then(function(){
      globalDeferred.resolve();
    });

    return globalDeferred;
  },

  // Update a record in the table identified by the model's id
  update: function (models) {
    console.log("DAO update models");
    var globalDeferred = $.Deferred();
    var deferreds = [];

    if (!(models instanceof Array)) {
      models = [models];
    }

    _.each(models, function(model){

      var deferred = $.Deferred();

      var id = model.id;
      model.persistableEntity.load(id, _.bind(function(persisted_model) {
        _.each(model.persistable_attributes(), function(e, i){
          persisted_model[i] = model.get(i);
        });
      }, this));

      this.db.flush(function(){
        deferred.resolve();
      });

      deferreds.push(deferred);

    }, this);

    $.when.apply($, deferreds).then(function(){
      globalDeferred.resolve();
    });

    return globalDeferred;
  },

  //Removes a record from the table identified by the model's id
//  delete: function (model, callback)
//  {
//    console.log("dao delete model");
//    var id = model.id;
//    this.db.load(id, function(results)
//    {
//      this.db.remove(results);
//      this.db.flush();
//    });
//    callback();
//
//    // TODO
//
//  }

});