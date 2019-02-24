const mongoose = require("mongoose");

let employeeSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    department: String,
    start_date: Date,
    job_title: String,
    salary: Number
});

module.exports = mongoose.model("employee" , employeeSchema);
