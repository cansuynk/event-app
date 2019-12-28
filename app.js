const express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
const {sign_in, login, logout, fetch_user} = require("./src/auth.js")
const {add_contact, delete_contact, get_contacts} = require("./src/contact")
const {get_events, create_event, delete_event, remove_participant, add_participant} = require("./src/event")


const app = express()

//port number is to be changed according to deployed platform
const port = 8080

//Middleware for parsing incoming requests
app.use(bodyParser.json()); 

//Middleware for inserting session to incoming  requests
app.use(session({secret: '5813213455karubusnac',saveUninitialized: true,resave: true}));




// AUTH ROUTES
/* Example request payload
    {
        "username": "burak",
        "password": "12345678",
        "email": "mustafaburakgurbuz@gmail.com",
        "phone_number": "+90 538 568 5318"
    }
*/
app.post('/api/auth/sign_in', sign_in); 

/* Example request payload
    {
        "username": "burak",
        "password": "12345678"
    }
*/
app.post('/api/auth/login', login);    
app.get('/api/auth/logout', logout);              
app.get('/api/auth/fetch_user', fetch_user);  



/*
// Invitation ROUTES
app.post('/api/send_email', send_invitation);
app.post('/api/send_sms', send_sms);
*/

// EVENT ROUTES
/*  Example request payload
    {
        "title": "awesome event",
        "date": "5th of November",
        "description": "................."

    }
*/
app.post('/api/create_event', create_event)
/*  Example request payload
    {
        "event_id": "awesome event",
    }
*/
app.post('/api/delete_event', delete_event)
app.get('/api/get_events', get_events)
/* Example request payload
    {
        "event_id": "1",
        "name": "ali2"
    }
*/
app.post('/api/add_participant', add_participant)
/* Example request payload
    {
        "event_id": "1",
        "name": "ali2"
    }
*/
app.post('/api/remove_participant', remove_participant)


// CONTACT ROUTES
/*  Example request payload
    {
        "name": "ali",
        "email": "ali@gmail.com",
        "phone": "+90 532 412 55 12"

    }
*/
app.post('/api/add_contact', add_contact)

/* Example request payload
    {
        "name": ali
    }
*/
app.post('/api/delete_contact', delete_contact)
app.get('/api/get_contacts', get_contacts)

//Start listening requests
app.listen(port, () => console.log(`A listening on port ${port}!`))