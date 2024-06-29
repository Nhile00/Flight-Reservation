require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 56901;

// Simple host validation middleware
app.use((req, res, next) => {
    const allowedHosts = ['hawkairline.nhile.online', 'www.hawkairline.nhile.online', 'localhost'];
    if (allowedHosts.includes(req.hostname)) {
      next();
    } else {
      res.status(400).send('Invalid Host header');
    }
  });
  

// Set 'trust proxy' to true to trust X-Forwarded-* headers from the proxy
app.set('trust proxy', true);



// In-memory data store (replace this with a real database in production)
let passengers = [
    { id: 1, firstName: 'John', lastName: 'Warner', email: 'johnwarner@email.com', phoneNumber: '123-456-7890' },
    { id: 2, firstName: 'Jane', lastName: 'Hart', email: 'j.hart@email.com', phoneNumber: '987-654-3210' },
    { id: 3, firstName: 'Alex', lastName: 'Anderson', email: 'alex.at@email.com', phoneNumber: '238-521-5200' },
    { id: 4, firstName: 'Joshua', lastName: 'Brown', email: 'joshua.brown@email.com', phoneNumber: '113-888-6565' },
];

// Serve the passengers.html file directly
app.get('/passengers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'passengers.html'));
});

// Get passengers as JSON (for dynamically generating the table)
app.get('/api/passengers', (req, res) => {
    res.json(passengers);
});

// Create a new passenger
app.post('/create-passenger', (req, res) => {
    try {
        const newPassenger = {
            id: passengers.length + 1,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
        };
        passengers.push(newPassenger);
        res.redirect('/passengers');
    } catch (error) {
        console.error('Error creating passenger:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update an existing passenger
app.post('/update-passenger', (req, res) => {
    try {
        const id = parseInt(req.body.selectCustomer);
        const passenger = passengers.find(p => p.id === id);
        if (passenger) {
            passenger.firstName = req.body.updateFirstName;
            passenger.lastName = req.body.updateLastName;
            passenger.email = req.body.updateEmail;
            passenger.phoneNumber = req.body.updatePhoneNumber;
        }
        res.redirect('/passengers');
    } catch (error) {
        console.error('Error updating passenger:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a passenger
app.post('/delete-passenger', (req, res) => {
    try {
        const id = parseInt(req.body.deletePassengerID);
        passengers = passengers.filter(p => p.id !== id);
        res.redirect('/passengers');
    } catch (error) {
        console.error('Error deleting passenger:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


// Start the server
app.listen(port, host, () => {
    console.log(`Server is running on http://hawkairline.nhile.online:${port}`);
});