const userModel = require('../models/user')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var bearerToken = require('bearer-token')
const fs = require('fs');


const AddUser = async (req,res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            let formData = req.body;
            if (req.file != null) {
                formData.image = req.file.filename;
            }

            const saltRounds = parseInt(process.env.SALTROUND) || 10;
            await bcrypt.hash(formData.password, saltRounds , function(err, hash) {
                // Store hash in your password DB.
                if (err) throw err;
                formData.password = hash;
                const userRegister = new userModel(formData);
                userRegister.save().then((data) => {
                    res.send(data);
                }).catch((error) => {
                    res.send(error.message)
                })
            });

        } catch(err) {
            res.send(err);
        }
    } else {
        res.send({ errors: result.array() })
    }
}

const loginUser = async (req,res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            let {username, password} = req.body;
            await userModel.findOne({name : username}).then((data) => {
                if (data) {
                    bcrypt.compare(password, data.password).then(function(result) {
                        if (result) {
                            var token = jwt.sign({ name : username }, process.env.JWT_TOKEN);
                            res.json({
                                'token' : token
                            })
                        } else {
                            res.json("Please Enter proper password");
                        }
                    });
                } else {
                    res.json("No records Found");
                }
            }).catch((err) => {
                console.log(err);
            })
        } catch(err) {

        }
    } else {
        res.send({ errors: result.array() })
    }

}

const getCustomer = async (req,res) => {
    await bearerToken(req, function(err, token) {
        if (err) {
            res.send(err)
        }
        if (token) {
            try {
                var decoded = jwt.verify(token, process.env.JWT_TOKEN);
                if (decoded) {
                    var id = req.params.id;
                    var search = (id != null) ? {_id : id} : {}
                    const {name, email} = req.query;
                    if (typeof name != 'undefined' && typeof email != 'undefined' ) {
                        var search = {name, email}
                    }
                    userModel.find(search).then((data) => {
                        data.forEach(element => {
                            console.log(element.image);
                        });
                        res.send(data);
                    }).catch((error) => {
                        res.json(error)
                    })
                } else {
                    res.json({
                        error:"Invalid Token"
                    })
                }
            } catch(err) {
                res.send(err)
            }
        } else {
            res.sendStatus(401)
        }
    })
}

const addCustomer = async (req,res) => {
    await bearerToken(req, function(err, token) {
        if (err) {
            res.send(err)
        }
        if (token) {
            try {
                var decoded = jwt.verify(token, process.env.JWT_TOKEN);
                if (decoded) {
                    const result = validationResult(req);
                    if (result.isEmpty()) {
                        try {
                            let formData = req.body;
                            if (req.file != null) {
                                formData.image = req.file.filename;
                            }

                            const saltRounds = parseInt(process.env.SALTROUND) || 10;
                            bcrypt.hash(formData.password, saltRounds , function(err, hash) {
                                // Store hash in your password DB.
                                if (err) throw err;
                                formData.password = hash;
                                const userRegister = new userModel(formData);
                                userRegister.save().then((data) => {
                                    res.send(data);
                                }).catch((error) => {
                                    res.send(error.message)
                                })
                            });

                        } catch(err) {
                            res.send(err);
                        }
                    }
                } else {
                    res.json({
                        error:"Invalid Token"
                    })
                }
            } catch(err) {
                res.send(err)
            }
        } else {
            res.sendStatus(401)
        }
    })
}

const editCustomer = async (req,res) => {
    await bearerToken(req, function(err, token) {
        if (err) {
            res.send(err)
        }
        if (token) {
            try {
                var decoded = jwt.verify(token, process.env.JWT_TOKEN);
                if (decoded) {
                    const result = validationResult(req);
                    if (result.isEmpty()) {
                        try {
                            const id = req.params.id
                            if (id != null) {
                                let formData = req.body;
                                if (req.file != null) {
                                    formData.image = req.file.filename;
                                }
                                userModel.find({_id : id}).then(async (data) => {
                                    if (req.file != null)  {
                                        if (req.file.filename != data[0].image) {
                                            if (fs.existsSync(process.env.PRODUCT_FILE + '/' +data[0].image)) {
                                                fs.unlinkSync(process.env.PRODUCT_FILE + '/' +data[0].image, (err) => {
                                                    res.json(err)
                                                })
                                            }
                                        }
                                    }
                                    const saltRounds = parseInt(process.env.SALTROUND) || 10;
                                    bcrypt.hash(formData.password, saltRounds , async function(err, hash) {
                                        if (err) throw err;
                                        formData.password = hash;
                                        const userupdate = await userModel.findByIdAndUpdate({_id : id}, formData);
                                        if (userupdate) {
                                            await userupdate.save().then((saveddata) => {
                                                res.send(saveddata);
                                            }).catch((error) => {
                                                res.send(error.message)
                                            })
                                        }
                                    });
                                }).catch((error) => {
                                    res.json(error)
                                })
                            }
                        } catch(err) {
                            res.send(err);
                        }
                    }
                } else {
                    res.json({
                        error:"Invalid Token"
                    })
                }
            } catch(err) {
                res.send(err)
            }
        } else {
            res.sendStatus(401)
        }
    })
}

const deleteCustomer = async(req,res) => {
    await bearerToken(req, async function(err, token) {
        if (err) {
            res.send(err)
        }
        if (token) {
            var decoded = jwt.verify(token, process.env.JWT_TOKEN);
                if (decoded) {
                    try {
                        const id = req.params.id

                        if (id != null) {
                            await userModel.findByIdAndDelete({_id : id})
                            .then(async deleteUser => {
                                if (deleteUser) {
                                    if (fs.existsSync(process.env.PRODUCT_FILE + '/' + deleteUser.image)) {
                                        await fs.unlinkSync(process.env.PRODUCT_FILE + '/' + deleteUser.image, (err) => {
                                            res.json(err)
                                        })
                                    }
                                    res.send(deleteUser)

                                } else {
                                    res.json({
                                        error:"No records found"
                                    })
                                }
                                
                            })
                            .catch(err => {
                                res.send(err)
                            });
                        }
                    } catch (error) {
                        res.send(error);
                    }
                } else {
                    res.json({
                        error:"Invalid Token"
                    })
                }
        } else {
            res.sendStatus(401)
        }
    });
}

module.exports = {
    AddUser,
    loginUser,
    getCustomer,
    addCustomer,
    editCustomer,
    deleteCustomer
}