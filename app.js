/**
 * ******************************************************************************** 
 * ITE5315 – Assignment 4* 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.*
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.*
 * * Name: _Arun Yadav_ Student ID: _N01550390_ Date: _26-Nov-2023_*
 * *********************************************************************************/
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const database = require('./config/database');
const Employee = require('./models/employee');

const port = process.env.PORT || 8000;
// Create a handlebars instance
const hbs = exphbs.create();

// Define the handlebars engine with the specified configuration
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
 runtimeOptions: { allowProtoPropertiesByDefault: true, allowedProtoMethodsByDefault: true },
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
  }));
  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'views'));
  
  app.use(express.static(path.join(__dirname, 'public')));
// Body Parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(database.url);



// Route to display sortingInvoices.hbs file and sort invoices
app.get('/sortingInvoices', async (req, res) => {
    try {
      const sortBy = req.query.sortBy || 'InvoiceNo'; // Default sorting by InvoiceNo if sortBy parameter not provided
      const invoices = await Employee.find().sort(sortBy); // Fetch and sort invoices based on the selected field
      res.render('sortingInvoices', { invoices }); // Render the 'sortingInvoices.hbs' view with fetched and sorted invoices
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

// Route to display all invoices
const Invoice = require('./models/employee');

app.get('/allInvoices', async (req, res) => {
  try {
    const invoices = await Invoice.find(); // Fetch all invoices from the database using Mongoose
    res.render('allInvoices', {invoices:invoices }); // Render the 'allInvoices.hbs' view with fetched invoices
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Route to insert a new invoice
app.post('/insertInvoice', async (req, res) => {
    try {
      const newInvoice = await Employee.create(req.body);
      res.redirect('/allInvoices'); // Redirect to show all invoices after insertion
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// Get all Invoice-info data from db
app.get('/api/invoices', async function (req, res) {
    try {
        const invoices = await Employee.find({}, { __v: 0 }); // Exclude the __v field
        res.json(invoices);
    } catch (err) {
        res.status(500).send(err.message);
    }
});



// Update Manufacturer and Price_in_thousands of an invoice by ID
app.put('/api/invoices/:invoice_id', async function (req, res) {
    try {
        const id = req.params.invoice_id;
        const { Manufacturer, Price_in_thousands } = req.body;

        const updatedInvoice = await Employee.findOneAndUpdate(
            { InvoiceNo: id },
            { $set: { Manufacturer, Price_in_thousands } },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).send('Invoice not found');
        }

        res.json(updatedInvoice);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Get an employee with ID
app.get('/api/employees/:employee_id', async function (req, res) {
    try {
        const id = req.params.employee_id;
        const employee = await Employee.findById(id);
        res.json(employee);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get an invoice by invoiceID
app.get('/api/invoices/:invoice_id', async function (req, res) {
    try {
        const id = req.params.invoice_id;
        const invoices = await Employee.find({ InvoiceNo: id }, { __v: 0 }); // Exclude the __v field

        if (invoices.length === 0) {
            return res.status(404).send('Invoice not found');
        }

        res.json(invoices);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create an employee
app.post('/api/employees', async function (req, res) {
    try {
        const employee = await Employee.create({
            InvoiceNo: req.body.InvoiceNo,
            image: req.body.image,
            Manufacturer: req.body.Manufacturer,
            class: req.body.class,
            Sales_in_thousands: req.body.Sales_in_thousands,
            __year_resale_value: req.body.__year_resale_value,
            Vehicle_type: req.body.Vehicle_type,
            Price_in_thousands: req.body.Price_in_thousands,
            Engine_size: req.body.Engine_size,
            Horsepower: req.body.Horsepower,
            Wheelbase: req.body.Wheelbase,
            Width: req.body.Width,
            Length: req.body.Length,
            Curb_weight: req.body.Curb_weight,
            Fuel_capacity: req.body.Fuel_capacity,
            Fuel_efficiency: req.body.Fuel_efficiency,
            Latest_Launch: req.body.Latest_Launch,
            Power_perf_factor: req.body.Power_perf_factor
        });

        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update an employee by ID
app.put('/api/employees/:employee_id', async function (req, res) {
    try {
        const id = req.params.employee_id;
        console.log(id)
        const data = {
            name: req.body.name,
            salary: req.body.salary,
            age: req.body.age
        };

        const employee = await Employee.findByIdAndUpdate(id, data);
        res.send(`Successfully! Employee updated - ${employee.name}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete an employee by ID
app.delete('/api/employees/:employee_id', async function(req, res) {
    console.log(req.params.employee_id);
    let id = req.params.employee_id;

    try {
        const deletedEmployee = await Employee.deleteOne({ _id: id });
        if (deletedEmployee.deletedCount > 0) {
            res.send('Successfully! Employee has been Deleted.');
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

