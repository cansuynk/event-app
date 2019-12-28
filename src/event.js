const {pool} = require("./db.js")
const {SUCCESS, NOT_AUTH} = require("./error_codes.js")

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
        pool.query("SELECT event_id, title, date, description FROM events WHERE host = $1", [req.session.username], (err, res) => { 
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

