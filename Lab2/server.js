var express = require("express");
var hbs = require("hbs");
// Express Object
var app = express();
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper('year', () => {
    var date = new Date();
    return date.getFullYear();
});

app.set('view engine', 'hbs');
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

app.use('/', (req, res, next) => {
    //console.log(new Date());
    next();
});

app.get('/', (req, res) => {
    res.render("index.hbs", {
        title: "Assignment 2 - Morgan Wilkos"
    })
});

app.get('/form', (req, res) => {
    res.render("form.hbs", {
        title: "Form Page"
    })
});

app.get('/about', (req, res) => {
    res.render("about.hbs", {
        title: "About Page"
    })
});

app.all('/results', (req, res) => {
    res.render('results.hbs', {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    });
});

app.listen(3000, () => {
    console.log("Server is up at localhost:3000");
});
