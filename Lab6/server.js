const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const Employee = require("./schema/employee.js");

const app = express();
app.set("view engine", hbs);
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.urlencoded({extended:false}));

mongoose.connect("mongodb://localhost:27017/Empl", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once("open", () => {
    console.log("We're connected!");
});

app.get('/', (req, res) => {
    res.render("index.hbs", {
        button: { text:"Create", class:"btn-success" }
    });
});

app.get('/edit', (req, res) => {
    let id = req.query.id;
    Employee.findOne({_id:id}, (err, data) => {
        res.render("edit.hbs", {
            data: data,
            id: id,
            button: { text:"Update", class:"btn-primary" }
        });
    });
});

app.get('/remove', (req, res) => {
    let id = req.query.id;
    Employee.findOne({_id:id}, (err, data) => {
        res.render("remove.hbs", {
            data: data,
            id: id,
            button: { text:"Delete", class:"btn-danger" }
        });
    });
});

app.all('/view', (req, res) => {
    Employee.find((err, data) => {
        res.render("view.hbs", {
            data: data
        });
    });
});



app.all('/create', (req, res) => {
    let form = req.body;
    let data = {
        first_name: form.firstName,
        last_name: form.lastName,
        department: form.department,
        start_date: `${form.startDate} 00:00:000`,
        job_title: form.jobTitle,
        salary: form.salary
    };
    let newEmp = new Employee(data);
    newEmp.save((err, emp) => {
        if (err) return console.error(err);
        console.log("Saved " + emp);
    });
    res.redirect('/view');
});

app.use('/update', (req, res) => {
    let form = req.body;
    let data = {
        _id: form.id,
        first_name: form.firstName,
        last_name: form.lastName,
        department: form.department,
        start_date: form.startDate,
        job_title: form.jobTitle,
        salary: form.salary
    };
    let updatedEmp = new Employee(data);
    Employee.findOneAndUpdate({_id:form.id}, updatedEmp, (err, emp) => {
        if (err) return console.error(err);
        console.log("Saved " + emp);
    });
    res.redirect('/view');
});

app.use('/delete', (req, res) => {
    let form = req.body;
    Employee.findOneAndDelete({_id:form.id}, (err) => {
        if (err) return console.error(err);
    });
    res.redirect('/view');
});


hbs.registerHelper('table', (req, res) => {
    let data = req.data.root.data;
    let rows = data.length;
    let table = '';
    table += '<table class="table table-stripped">';
    table += '<tr>';
    table += '<th>First Name</th>';
    table += '<th>Last Name</th>';
    table += '<th>Department</th>';
    table += '<th class="text-center">Start Date</th>';
    table += '<th>Job Title</th>';
    table += '<th class="text-center">Salary</th>';
    table += '<th class="text-center">Update</th>';
    table += '<th class="text-center">Delete</th>';
    table += '</tr>';
    for (let i = 0; i < rows; i++) {
        table += '<tr>';
        table += `<td>${data[i].first_name}</td>`;
        table += `<td>${data[i].last_name}</td>`;
        table += `<td>${data[i].department}</td>`;
        table += `<td class="text-center">${DateFormat(data[i].start_date)}</td>`;
        table += `<td>${data[i].job_title}</td>`;
        table += `<td class="text-right">${Money(data[i].salary)}</td>`;
        table += `<td class="text-center"><a href="/edit?id=${data[i]._id}" class="btn btn-primary">Update</a></td>`;
        table += `<td class="text-center"><a href="/remove?id=${data[i]._id}" class="btn btn-danger">Delete</a></td>`;
        table += '</tr>';
    }
    table += '<tr><td><a href="/" class="btn btn-success">Create</a></td></tr>';
    table += '</table>';
    return table;
});


app.listen("3000", () => {
    console.log("The server is up on port 3000");
});


// Functions. ##
function Money(a) {
    a = a + "";
    if (a == "") return "";
    a = "$" + parseFloat(a.replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    a = a.replace("$-", "-$");
    return a;
}
function DateFormat(a) {
    return `${a.getMonth()+1}/${a.getDate()}/${a.getFullYear()}`;
}
