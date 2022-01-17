//Imports
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("express-flash");

mongoose.Promise = global.Promise;



app.use(flash());


app.use(express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({useNewUrlParser: true}));

app.use(session({

    secret: "mongoose",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 100000}

}))

app.set("views", __dirname + "/views");
app.set("view engine", "ejs")


mongoose.connect("mongodb://localhost/mongoose_dashboard");


var mongooseSchema = new mongoose.Schema({

    name: {type: String, required: [true, "mongoose name required!"], minlength: 3},

    age: {type: Number, required: [true, "mongoose age required!"], min: 1, max: 15},

    color: {type: String, required: [true, "mongoose color required!"], minlength: 3}

    }, {timestamps: true});

    mongoose.model("mongoose", mongooseSchema);
    var mongoose = mongoose.model("mongoose");

    
app.get("/", function(req, res){

    console.log("Listening port 8080");

    mongoose.find({}, function(err, mongooses){



        if(err){
            console.log("~Error matching DB request!~", err);
        }
        else{

            res.render("index", {info: mongooses});


        }
    })
});

app.get("/mongooses/new", function(req, res){



    console.log("~New Form~");


    res.render("new");
});

app.get("/mongooses/:_id", function(req, res){



    console.log("~Find~")
    mongoose.findOne({_id:req.params._id}, function(err, mongoose){


        if(err){
            console.log("~Error matching DB request!~", err);


        }
        else{
            res.render("details", {mongoose:mongoose});
        }
    })


});

app.get("/mongooses/edit/:_id", function(req, res){


    console.log("~Edit Page~");


    mongoose.findOne({_id:req.params._id}, function(err, mongoose){


        if(err){
            console.log("Error mactching DB request!~", err);


        }
        else{
            res.render("edit", {mongoose:mongoose});
        }
    })
});



app.post("/mongooses", function(req, res){



    console.log("~Post~", req.body);
    var mongoose = new mongoose({name: req.body.name, age: req.body.age, color: req.body.color});




    mongoose.save(function(err){
        if(err){



            console.log("~Something added a mongoose!~", err);
            for(var key in err.errors){
                req.flash("mongooseform", err.errors[key].message);



            }
            res.redirect("/mongooses/new");
        }
        else{



            console.log("~Successfully added a mongoose!~");
            res.redirect("/");
        }
    })
});

app.post("/mongooses/:_id", function(req, res){
    console.log("~Edit~");
    mongoose.findOne({_id:req.params._id}, function(err, mongoose){


        if(err){
            console.log("~Error matching DB request!~", err);
        }
        else{


            mongoose.update({_id: mongoose._id}, {$set: {name: req.body.name, age: req.body.age, color: req.body.color}}, function(err){
                if(err){
                    console.log("~Error updating~", err);



                }
                else{
                    res.redirect("/");
                }
            })
        }
    })
});

app.post("/mongooses/destroy/:_id", function(req, res){
    console.log("~Destroy~");



    mongoose.findOne({_id:req.params._id}, function(err, mongoose){
        if(err){
            console.log("~Error matching DB request!~", err);
        }
        else{



            mongoose.remove({_id:mongoose._id}, function(err){
                if(err){
					console.log("~Error on delete!~", err);



				}
				else{
					res.redirect("/");
				}
            })
        }
    })


});


app.listen(8080, function(){
    console.log("Listening on port: 8080");
})