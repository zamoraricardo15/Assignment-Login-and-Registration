var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var session = require("express-session");
var flash = require("express-flash");

var validate = require("mongoose-validator");
var bcrypt = require("bcryptjs");
mongoose.Promise = global.Promise;


app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.use(flash());

app.use(express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({useNewUrlParser: true}));

app.use(session({

    secret: "messages",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }

}));


mongoose.connect("mongodb://localhost/login_registration");

var UserSchema = new mongoose.Schema({
    firstName: {

        type: String,
        required: [true, "Your first name is required!"],

        validate: {
            validator: function(value){
                return /^[A-z]+$/.test(value)
            },
            message: "Please enter a valid first name!"
        }
    },
    lastName: {

        type: String,
        required: [true, "Your last name is required!"],
        validate: {
            validator: function(value){
                return /^[A-z]+$/.test(value)
            },
            message: "Please enter a valid last name!"
        }
    },
    email: {

        type: String,
        required: [true, "Your email is required!"],
        validate: {
            validator: function(value){

				return /@/.test(value)
            },
            message: "Please enter a valid email address!"
        }
    },
    birthday: {

        type: Date,
        required: [true, "Your birthdate is required!"],
        validate: {
            validator: function(value){
                return value instanceof Date;
            },
            message: "Please enter a valid birthday!"
        } 
    },
    password: {

        type: String,
        required: [true, "Your password is required!"],
        validate: {
			validator: function(value){
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,120}/.test(value);
			},
			message: "Password must contain at least 1 number, Uppercase Letter, and special character."
        } 
    }
}, {timestamps: true});





    mongoose.model("User", UserSchema);

    var User = mongoose.model("User");


app.get("/", function(req, res){
    console.log("~Root~");



    res.render("index");
});

app.get("/dashboard", function(req, res){
    console.log("~Dashboard~");
    res.render("dashboard");
})

app.post("/register", function(req, res){


    console.log("~Register~", req.body);
    User.create({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, birthday: req.body.birthday, password: req.body.password}, function(err, user){
        if(err){
            console.log("~Something went wrong!~", err);
            for(var key in err.errors){
                req.flash("regform", err.errors[key].message);
            }
            res.redirect("/");


        }
        else{
            console.log("~Successfully registered!~");
            res.redirect("/dashboard");
        }
    })
});



app.listen(8000, function(){
    console.log("Listening on port: 8000");
});