//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-saidmtanzania:<password></password>@cluster0.2uzik.mongodb.net/todolistDB',{useNewUrlParser:true});
const itemSchema ={
  name:String
};
const listSchema = {
  name:String,
  items:[itemSchema]
};
const List = mongoose.model("List",listSchema);
const Item = mongoose.model("Item",itemSchema);

app.get("/", function(req, res) {
  Item.find({},(err,result)=>{
  if(!err){
    res.render("list", {listTitle: "Today", newListItems: result});}
});
});
 const newItem = new Item({
  name:"default",
  items:"unknown"
  });
app.get("/:customListname",(req,res)=>{
  const customListName = _.capitalize(req.params.customListname);
  List.findOne({name:customListName},(err,result)=>{
    if(!err){
      if(!result){
        const list = new List({
          name:customListName,
          items:newItem
        });
        list.save();
        res.redirect("/"+customListName);
      }else{
        res.render("list",{listTitle: result.name, newListItems: result.items});
      }
    }
  });
});

app.post("/", function(req, res){
  const item = req.body.newItem;
  const listName = req.body.list;

  const insert = new Item({
  name:item
  });

  if(listName === "Today"){
    insert.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},(err,foundList)=>{
      foundList.items.push(insert);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req,res)=>{
  const checkedvalue = req.body.checkbox;
  const lname = req.body.listName;

  if( lname === "Today"){
    Item.findByIdAndRemove(checkedvalue,(err)=>{
    if(!err){
        res.redirect("/");
    }
  });  
  }else{
    List.findOneAndUpdate({name: lname},{$pull:{items:{_id:checkedvalue}}}, (err,foundList)=>{
      if(!err){
        res.redirect("/"+ lname);
      }
    });
  }
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started Successfully");
});
