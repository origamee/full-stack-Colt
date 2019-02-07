//V10
//User can only edit his/her campgrounds
//User can only delete his/her campgrounds
//Hide /Show edit and delete buttons
//Basically add full CRUD ability for campgrounds
//Update ad destroy

//Precisely
// Add mehod-override package
// Add Edit route for campgrounds
// Add link to edit page
// Add Update route
// Fix $set problem

// Based no RESTful rules
// Edit   = /dogs/:id/edit as GET
// Update = /dogs/:id as PUT

var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    Campground            = require("./models/campgrounds"), //in express the current directory is referred to as ./
    Comment               = require("./models/comments"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user"),
    methodOverride        = require("method-override"), //for EDIT and UPDATE
    //passportLocalMongoose = require("passport-local-mongoose"),
    seedDB                = require("./seed");
    //express.session requirement is done inline, in the passport config jsut cauz
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");  //index and auth routes combined

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));  //Definition to include the CSS directory, __dirname is the current working directory, and is a precautionary method
                                                 //The actuall CSS file i.e. main.css gets included the headers.ejs template
app.use(methodOverride("_method")); //conventional argument

app.set("view engine", "ejs");

////+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//We will not seed the database here, cauz the user/comment associations mentioned in seed.js are now different. We will just remove everything at the very beginning

//seedDB(); //you should be doing module.exports in your seed.js file for this to work
////+++++++++++++++++++++++++++++++++++++++++++++++++++++++


//PASSPORT CONFIGURATION (the session config needs to go before the actual passport config)
// This is another way you can use REQUIRE, by doing an inline statement
app.use(require("express-session")( {
   secret           : " Teri maan ki",
   resave           : false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //this is not something we wrote, it comes with passportLocalMongoose from the user.js file
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is the middleware for all routes could have access to the req.user variable. We have to specify next() as this is how the program will know what to do next
//next() will most probably be the route handler in our case
//whatever you put in res.locals, is made available to all templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//This app.use is for allowing app.use to use the other routes that we "required" earlier
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes); //we can also shorten the repeatable routes by doing app.use("/campgrounds", campgroundRoutes), and change /campgrounds to /in campgrounds.js

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server has started....."); 
});
