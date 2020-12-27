//Required packages 
var express      = require("express"),
    app          = express(),
    bodyParser   =require("body-parser"),
    mongoose     =require("mongoose"),
    flash        = require("connect-flash"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    Campground   =require("./models/campground"),
    Comment      =require("./models/comment"),
    User         =require("./models/user"),
    session = require("express-session");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

    //connecting mongoDB with local server
mongoose.connect("mongodb://localhost:27017/yelp_camp",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => console.log("Connected to database"))
.catch(error => console.log(Error.message));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "hello friends",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(5000,function(){
    console.log("Server started...at port 5000 and hostname 127.0.0.1");
});