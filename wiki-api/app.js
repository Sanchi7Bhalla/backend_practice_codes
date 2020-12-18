const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const app=express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});

const articleSchema={
   title:String,
   content:String
};
const Article=mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        //console.log(foundArticles);
        if(!err){
         res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    });
 })
 .post(function (req,res) {
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle=new Article({
       title: req.body.title,
       content: req.body.content
    });
    newArticle.save(function (err) {
        if(!err)
        res.send("Sucessfully added a new article.");
        elseres.send(err);
    });
})
.delete(function (req,res) {
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted.");
        } else{
            res.send(err);
        }
    });
 });
/////request targetting a specific article///

//localhost:3000/articles/taylor-swift

app.route("/articles/articleTitle")
//req.params.articleTitle="taylor-swift";
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function (err,foundArticle) {
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("no article found with this name");
        }
    });
})

.put(function(req, res){
            Article.update(
                {title: req.params.articleTitle},
                {title: req.body.title, content:req.body.content},
                {overwrite: true},
                function(err){
                    if(!err){
                        res.send("successfully updated article");
                    }
                });
})

.patch(function (res,req) {
   Article.update(
       {title:req.params.articleTitle},
       {$set: req.body},
       function (err) {
           if(!err)
           res.send("succesfully patched");
           else
           res.send(err);
       }); 
});

app.listen(3000,function(){
    console.log("server started on port 3000");
})
.delete(function (req,res) {
   Article.deleteOne(
       {title: req.params.articleTitle},
       function (err) {
           if(!err)
           {
               res.send("Successfully deleted one article");
           } else {
               res.send(err);
           }
       }
   );
});