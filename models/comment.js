var mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    comments :{
        type :String
    },
    username :{
        type:String
    },
    post_id :{
        type:mongoose.ObjectId
    }
})

module.exports = mongoose.model('comments', CommentSchema,"comments");