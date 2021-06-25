const mongoose = require('mongoose')


const AdminSchema = new mongoose.Schema({
    id:{
        type:mongoose.ObjectId
    },
    email:{
        type: String, required: true
    },
    password:{
        type: String, required: true
    }

})

module.exports = mongoose.model('admins',AdminSchema,"admins")