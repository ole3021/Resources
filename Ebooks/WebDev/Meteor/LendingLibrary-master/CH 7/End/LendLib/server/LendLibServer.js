  Meteor.startup(function () {
    Meteor.publish("Categories", function() {
      return lists.find({owner:this.userId},{fields:{Category:1}});
    });
    Meteor.publish("listdetails", function(category_id){
      return lists.find({_id:category_id});
    });
  });

/*checks to see if the current user making the request to update is
the admin user */
function adminUser(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && userId === adminUser._id);
}
lists.allow({
  insert: function(userId, doc){
    return (adminUser(userId) || (userId && doc.owner === userId));
  },
  update: function(userId, docs, fields, modifier){
    return (adminUser(userId) || (userId && docs.owner === userId));
  },
  remove: function (userId, docs){
    return (adminUser(userId) || (userId && docs.owner === userId));
  }
});