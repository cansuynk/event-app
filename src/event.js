const {pool} = require("./db.js")
const Gmail = require('gmail-send');
const Nexmo = require('nexmo');
const {SUCCESS, NOT_AUTH} = require("./error_codes.js")

function send_sms(to, text) {
    const nexmo = new Nexmo({
        apiKey: '49fdffdf',
        apiSecret: 'UNTiF8vnoZAkV0no',
    });
    from = "Event App"
    console.log(text)
    nexmo.message.sendSms(from, to, text);
}

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
send_email = function(subject, to, content) {
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
}

exports.create_event = function(req, response) {
    const body = req.body;
    if(req.session.username) {
        const host = req.session.username
        const title = body["title"];
        const date = body["date"];
        const description = body["description"];
        pool.query("INSERT INTO events (host, title, date, description) VALUES ($1, $2, $3, $4) RETURNING event_id", [host, title, date, description], (err, res) => {
            if (err) {
                console.log(err)
                //Error response, due to uniqueness violation
                response.send({
                    code: err.code,
                    detail: err.detail,
                    data: null
                })
            } else {
                //Success Response
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: res.rows[0].event_id
                })
            }
        })
    } else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

exports.delete_event = function(req, response) {
    const body = req.body;
    if(req.session.username) {
        pool.query("DELETE FROM events WHERE host = $1 and event_id = $2", [req.session.username, body["event_id"]], (err, res) => {
            if (err) {
                //Database related error occured, it is unexpected
                console.log(err)
                response.send({
                    code: err.code,
                    detail: err.detail,
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
    }  else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

exports.get_events = function(req, response) {
    if(req.session.username) {
        pool.query("SELECT event_id , title as eventTitle, date as eventDate, description as eventDescription FROM events WHERE host = $1", [req.session.username], (err, res) => { 
            if (err) {
                //Error due to database, e.g. connection failure
                console.log(err)
                response.send({
                    code: err.code,
                    detail: err.detail,
                    data: null
                })
            }
            else {
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: res.rows
                })
            }
        })
    }
    else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

exports.add_participant = function(req, response) {
    if(req.session.username) {
        pool.query("INSERT INTO participants  VALUES ($1, $2)", [req.body["event_id"], req.body["name"]], (err, res) => {
            if (err) {
                //Error due to database, e.g. connection failure
                console.log(err)
                response.send({
                    code: err.code,
                    detail: err.detail,
                    data: null
                })
            }
            else {
                send_email("Invitation from " + req.session.username, req.body["email"], req.body["message"])
                send_sms(req.body["phone"], req.body["message"])
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })
            }
        })

    } else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}


exports.remove_participant = function(req, response) {
    if(req.session.username) {
        pool.query("DELETE FROM participants WHERE guest = $1 and event_id = $2", [req.body["name"], req.body["event_id"]], (err, res) => {
            if (err) {
                //Database related error occured, it is unexpected
                console.log(err)
                response.send({
                    code: err.code,
                    detail: err.detail,
                    data: null
                })
            } else {
                //Success response
                send_email(req.session.username + " removed you from an event", req.body["email"], req.body["message"])
                send_sms(req.body["phone"], req.body["message"])
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })
            }
        })

    } else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

