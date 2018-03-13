// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/daply");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/daply");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });



// var lunches = [
//   {
//     lunch: "Beet & Goat Cheese Salad with minestrone soup."
//   }, {
//     lunch: "Pizza, two double veggie burgers, fries with a Big Gulp"
//   }
// ];
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/daply", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/blog.html"));
  // res.render("index", lunches[0]);

  });

  app.get("/ams", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  app.get("/contributors", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });  

};
