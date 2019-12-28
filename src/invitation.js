// Step 1: Include required modules
var Imap = require('imap'),
inspect = require('util').inspect; 
const Gmail = require('gmail-send');
const simpleParser = require('mailparser').simpleParser;
const {SUCCESS, NOT_AUTH, UNEXPECTED} = require("./error_codes.js");


//Local function used by send_email
function write_email(options, content, callback) {
    const send = Gmail(options)
    send({text: content, }, (error, result, fullResult) => {
        if (error) {
            callback(error, null);
        } 
        else {
            callback(null, result);
        }
    })
}

//Send email using gmail-send package
exports.send_invitation = function(req, response) {
    if (req.session.address) {
        //Extract necessary information from request body
        const body = req.body;
        const subject = body["subject"];
        const to = body["to"];
        const content = body["content"]
        write_email({
            user: "event.app.invitation.system@gmail.com",
            pass: "eventapp",
            to:   to,
            subject: subject
        }, content, (err, res) => {
            if (err) {
                //Fails if user supplied wrong password on sign in
                response.send({
                    code: UNEXPECTED,
                    detail: err,
                    data: null
                })
            } else {
                //Success response
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })

            }
        })

    } else {
        //Session is null so user is not authenticated yet
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}