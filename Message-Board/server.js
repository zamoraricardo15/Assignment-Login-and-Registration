var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("express-flash");

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

    cookie: { maxAge: 100000 }

}));


mongoose.connect("mongodb://localhost/message_board");

var CommentSchema = new mongoose.Schema({

    name: {type: String, required: [true, "Name is required!"], minlength: 3},
    comment: {type: String, required: [true, "This field can not be left blank!"], minlength: 3},

    }, {timestamps: true})

var MessageSchema = new mongoose.Schema({

    name: {type: String, required: [true, "Name is required!"], minlength: 3},
    message: {type: String, required: [true, "This field can not be left blank!"], minlength: 3},
    comments: [CommentSchema]

    }, {timestamps: true})

    mongoose.model("Comment", CommentSchema);

    mongoose.model("Message", MessageSchema);

    var Comment = mongoose.model("Comment");

    var Message = mongoose.model("Message");


app.get("/", function(req, res){

    console.log("~Root~");

    Message.find().populate("comments").exec(function(err, messages){

        if(err){

            console.log("~Error matching DB request!~");

        }

        else{

            res.render("index", {posts:messages});

        }

    })

});

app.post("/message", function(req, res){


    console.log("~Message~", req.body);

    var message = new Message({name: req.body.name, message: req.body.message});
    message.save(function(err){

        if(err){
            console.log("~Something went wrong!~", err);
            for(var key in err.errors){

                req.flash("messageform", err.errors[key].message);
            }
            res.redirect("/");
        }
        else{
            console.log("~Successfully added a message!~");

            res.redirect("/");
        }
    })
});

app.post("/comment", function(req, res){



    console.log("~Comment~", req.body);

    Comment.create({name: req.body.name, comment: req.body.comment}, function(err, comment) {

        if(err){
            console.log("~Something went wrong~", err);
            for(var key in err.errors){
                req.flash("commentform", err.errors[key].message);
            }
            res.redirect('/');
        }

        else{
            Message.findOneAndUpdate({_id: req.body.msgId}, {$push: {comments: comment}}, function(err, data) {

                if(err){
                    console.log("~Something went wrong~", err);

                    res.redirect('/');
                }
                else{
                    res.redirect('/');
                }
            })
        }
    })
});



app.listen(8080, function(){

    console.log("Listening on port: 8080");
    
});