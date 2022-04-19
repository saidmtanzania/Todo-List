//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB',{useNewUrlParser:true});
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
  items:"Pop"
  });
app.get("/:customListname",(req,res)=>{
  const customListName = req.params.customListname;
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
  Item.findByIdAndRemove(checkedvalue,(err)=>{
    if(!err){
        res.redirect("/");
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
