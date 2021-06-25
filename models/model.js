const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    id:{
        type:mongoose.ObjectId
    },
    title:{
        type: String, required: true
    },
    content:{
        type: String, required: true
    },
    image:{
        type:String, required:true
    }

})

module.exports = mongoose.model('blogapp',BlogSchema,"blogapps")