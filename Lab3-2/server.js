var express = require("express");
var hbs = require("hbs");
// Express Object
var app = express();
hbs.registerPartials(__dirname + "/views/partials");

app.set('view engine', 'hbs');
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

app.use('/', (req, res, next) => {
    next();
});

app.get('/', (req, res)=> {
    res.render("index.hbs", {
        title: "Assignment 3-2 - Morgan Wilkos"
    });
});

hbs.registerHelper('error', ()=> {
    var divs = '';
    var divType = '';

    var randomNum = RandomNumber({"low":20, "high":50, "dataType":"INT"});

    for (let i = 0; i < randomNum; i++) {
        var divNum = RandomNumber({"low":1, "high":3, "dataType":"INT"});
        if (divNum == 1) {
            divType = 'shrink';
        } else if (divNum == 2) {
            divType = 'rotate';
        } else {
            divType = 'still';
        }
        divs += `<div class="${divType}">404</div>`;
    }
    return divs;
});

// catch 404 and forward to error handler
app.use((req, res, next)=> {
    next(createError(404));
});

// error handler
app.use((err, req, res, next)=> {
    // set locals, only providing error in development
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, ()=> {
    console.log("Server is up at localhost:3000");
});



function RandomNumber(o) {
    var num = Math.random() * (o.high - o.low) + o.low;
    if (o.dataType == "INT")
        return Math.round(num);
    return num;
}