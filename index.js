const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Blog = require('./models/model')
const Comment = require('./models/comment')
const Admins = require('./models/admins')
const formidable = require('formidable')
const fs = require('fs')
const session = require('express-session')

const app = express()
const port = 3000

app.use(session({
  key:"admin",
  secret:"any random string"  
}))

mongoose.connect('ENTER_YOUR_MONGODB_URI',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>console.log("database connected"))
    .catch(err=>console.log(err))

app.use("/static",express.static(__dirname+'/static'))
app.set('view engine',"ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())


app.get('/', (req, res) => {
  Blog.find({}, function (err, blogs) {
    if (err){
        console.log(err);
    }
    else{
        res.render('./user/home',{blogs:blogs})
    }
}).sort({ "_id" : -1});
})

app.get('/admin/dashboard',(req,res)=>{
  if(req.session.admin){
    res.render('admin/dashboard')
  }else{
    res.redirect('/admin')
  }
})

app.get("/admin/posts",(req,res)=>{
  if(req.session.admin){
    Blog.find({},function(err,blogs){
      res.render('admin/posts',{"blogs":blogs})
    })
    
  }else{
    res.redirect('/admin')
  }
})


app.get("/posts/edit/:id", (req,res)=>{
   
    Blog.findOne({"_id":req.params.id},(err,blog)=>{
      res.render('admin/edit_post',{blog:blog}) 
    })
  
})

app.put("/do-edit-post/:id", (req,res)=>{
  if(!req.body){
    return res
      .status(400)
      .send({msg:"Data cannot be empty"})
  }
  const id = req.params.id
  Blog.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
    .then(data=>{
      if(!data){
        res.status(404).send({message:`cannot update blog with ${id}. Maybe blog not found`})

      }else{
        res.send(data)
      }
    })
    .catch(err=>{
      res.status(500).send({msg:"Error updating blog"})
    })
})



//INCOMPLETE

app.put('/do-update-image/:id',function(req,res){
  console.log(req.body)
  
})


app.delete('/do-delete/:id',(req,res)=>{
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:`Cannot delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message:"Blog was deleted successfully!"
                })
            }
        })
        .catch(err=>{
            res.status(500).send({
                message:"Could not delete blog with id= "+id
            });
        });

})


app.post("/do-admin-login",(req,res)=>{
  //
  //console.log(req.body.email)
  //console.log(req.body.password)
  Admins.findOne({"email":req.body.email,"password":req.body.password},
  function(error,admin){
    if(admin!=""){
      req.session.admin = admin
    }
    res.send(admin)
  })
})


app.get("/do-logout",(req,res)=>{
  req.session.destroy();
  res.redirect("/admin")
})
app.get("/admin",function (req,res){
   res.render('admin/login')
})

app.post('/do-post',async (req,res)=>{
    if(!req.body){
      res.status(400).send({message: " Content can not be empty!"})
      return; 
    }
    var BlogItems = new Blog({
      title:req.body.title,
      content: req.body.content,
      image:req.body.image

    })

    BlogItems
      .save(BlogItems)
      .then(data=>{
        res.redirect('/admin/posts')
      })
      .catch(err=>{
        res.status(500).send({
          msg:err.message || "Some error occured"
        })
      })
})


app.get('/posts/:id',(req,res)=>{
  Blog.findOne({"_id":req.params.id},(err,blog)=>{
    res.render('user/post',{blog:blog}) 
  })
})

app.post('/do-comment',async (req,res)=>{
  Blog.findById(req.body.post_id, function (err, postComments) {
    if (err) {
      console.log(err);
    } else {
      var comment = new Comment({
        username:req.body.username,
        comments: req.body.comment,
        post_id:req.body.post_id
      }) 
      comment
        .save
        .then(data=>{
          res.redirect('/')
        })
        .catch(err=>{
          res.status(500).send({
            msg:"Error"
          })
        })
    }
}); 
  

})


app.post('/do-upload-image',(req,res)=>{
  
  const formData = new formidable.IncomingForm();
  formData.parse(req,function(error,fields,files){
    const oldPath = files.file.path
    const newPath = "static/images/"+files.file.name;

    fs.rename(oldPath,newPath,function(err){
      res.send("/"+newPath)
    })
    
  })
})


app .listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


///
//Blog.findById(req.body.post_id,{
//  $push:{
 //   "Comments":{username:req.body.username,comment:req.body.comment}
 // }
//},function(err,post){
//  res.send("comment successfull")
//})
