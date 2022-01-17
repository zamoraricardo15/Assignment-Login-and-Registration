var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var session = require("express-session");
var flash = require("express-flash");

var moment = require("moment");

mongoose.Promise = global.Promise;


app.use(flash());

app.use(express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({useNewUrlParser: true}));

app.use(session({

    secret: "quotes",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 100000 }

  }))

app.set("views", __dirname + "/views");

app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost/quoting_dojo");


var QuoteSchema = new mongoose.Schema({

    name: {type: String, required: true, minlength: 3},
    quote: {type: String, required: true, minlength: 3},

    }, {timestamps: true});

    mongoose.model("Quote", QuoteSchema);

    var Quote = mongoose.model("Quote");


app.get("/", function(req, res){

    console.log("~Root~");

    res.render("index");

})

app.get("/quotes", function(req, res){

    console.log("~Get!~");

    Quote.find({}, function(err, quotes) {

        if(err){

            console.log("~Error matching DB request!~");

        }

        else {

            res.render("quotes", {info: quotes, moment: moment});

        }

    }).sort({_id:-1});

})

app.post("/quotes", function(req, res){

    console.log("~Post~", req.body);

    var quote = new Quote({name: req.body.name, quote: req.body.quote});

    quote.save(function(err){

        if(err){

            console.log("~error you got something wrong wrong!~", err);
            for(var key in err.errors){


                req.flash("quoteform", err.errors[key].message);
            }

            res.redirect("/");
        }
        else{

            console.log("~Quote has been added!~");
            res.redirect("/quotes");
        }
    })
})


app.listen(8080, function(){
    console.log("Listening on port: 8080");
})