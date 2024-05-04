const mongoose = require('mongoose')
const expressValidator = require('express-validator')


const userschema = new mongoose.Schema({
    name : {
        type : String,
        required :true,
        unique : true
    },
    email : {
        type : String,
        required:true,
        unique : true
    },
    password : {
        type : String,
        required:true,
        minLength : [8, 'Password must be 8 Chars'],
        // match : /^a/,
    },
    phone : {
        type : String,
        required:true,
        minLength : [10, 'Should be 10 no']
        
    },
    gender : {
        type : String,
        required:true,
        enum: {
            values: ['male', 'female', 'other'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    address : {
        type : String,
        maxLength : [255, 'Should not be more than 255 Chars'],
    },
    image : {
        type : String,
        get : getImageName
    }
});

function getImageName(image) {
    return process.env.PRODUCT_URL + image;
}

const userModel = mongoose.model('user_master', userschema);
module.exports = userModel;