const express = require('express'); 
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const getDate = require('./date');
//const date=require(__dirname,"/date.js");

const app = express();
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",({useNewUrlParser:true}));
const itemsSchema={
    name: String
};

const Item=mongoose.model("Item",itemsSchema);
const items=[];
const item1=new Item({
    name:"welcome to todolist"
});

const item2=new Item({
    name:"hit +"
});

const item3=new Item({
    name:"<-- to delete"
});

const defaultItems=[item1,item2,item3];

//const day="";
app.get("/",function(req,res){
   
   //const day=getDate();
   const day="today";
   Item.find({},function(err,foundItems){
      if(foundItems.length===0){
          Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            } else{
              console.log("success saved default items!!");
            }
          });
          res.redirect("/");
      } else{
        res.render("list",{listTitle: day, newListItems: foundItems});
      }
      
   });
});

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName;
    
    List.findOne({name: customListName},function (err,foundList) {
        if(!err){
            if(!foundList){
            //create new list
            const list=new List({
                name: customListName,
                items: defaultItems
            });
            list.save(); 
            res.redirect("/"+customListName);
            }else{
                //show list
                res.render("List",{listTitle: foundList.name, newListItems: foundList.items});
          }
        } 
    })
    
});

app.post("/",function(req,res){

   let itemName=req.body.newItem;
   let listName=req.body.list;
   const item=new Item({
        name:itemName
    });

    if(listName==="today")
    {
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function (err,foundList) {
            foundList.items.push(item); 
            foundList.save();
            res.redirect("/"+listName);
        });
    } 
});

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("Sucessfully Deleted..");
            res.redirect("/");
        }
    });
});
app.listen(3000,function(){
    console.log("server started");
});