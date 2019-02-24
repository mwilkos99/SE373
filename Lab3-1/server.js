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

app.use('/', (req, res, next)=> {
    //console.log(new Date());
    next();
});

app.get('/', (req, res) => {
    res.render("index.hbs", {
        title: "Assignment 3-1 - Morgan Wilkos"
    })
});

hbs.registerHelper('select', ()=> {
    var select = '';

    var options = [3, 4, 5, 10, 20];
    var name = 'gridSize';

    select += `<select name="${name}">`;
    for (let i = 0; i < options.length; i++) {
        select += `<option value="${options[i]}">${options[i]}</option>`;
    }
    select += '</select>';

    return select;
});

app.all('/results', (req, res)=> {
    res.render('results.hbs', {
        size: req.body.gridSize
    });
});

hbs.registerHelper('table', (req, res)=> {
    var table = '';
    var size = req.data.root.size;

    table += '<table>';
    for (let i = 0; i < size; i++) {
        table += '<tr>';
        for (let i = 0; i < size; i++) {
            var color = ((1<<24)*Math.random()|0).toString(16);
            for (let i = color.length; i < 6; i++)
                color = '0' + color;
            
            table += `<td style="background-color: #${color};">`;
            table += `<span style="color:#000000">${color}</span><br /><span style="color:#ffffff">${color}</span>`;
            table += '</td>';
        }
        table += '</tr>';
    }
    table += '</table>';

    return table;
});

app.listen(3000, ()=> {
    console.log("Server is up at localhost:3000");
});