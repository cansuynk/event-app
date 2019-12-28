const {pool} = require("./db.js")
const {SUCCESS, NOT_AUTH} = require("./error_codes.js")

exports.add_contact = function(req, response) {
    const body = req.body;
    if(req.session.username) {
        const owner = req.session.username
        const name = body["name"];
        const email = body["email"];
        const phone = body["phone"];
         //Try to insert
        pool.query("INSERT INTO contacts VALUES ($1, $2, $3, $4)", [owner, name, email, phone], (err, res) => {
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

exports.delete_contact = function(req, response) {
    if(req.session.username) {
        const body = req.body;
        const name = body.name
        pool.query("DELETE FROM contacts WHERE owner = $1 and name = $2", [req.session.username, name], (err, res) => {
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


exports.get_contacts = function(req, response) {
    if(req.session.username) {
        pool.query("SELECT name, email, phone FROM contacts WHERE owner = $1", [req.session.username], (err, res) => { 
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