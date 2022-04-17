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
const Item = mongoose.model("Item",itemSchema);

app.get("/", function(req, res) {
  Item.find({},(err,result)=>{
  if(err){
    console.log(err);
  }else{
    res.render("list", {listTitle: "Today", newListItems: result});
  }
});

});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const insert = new Item({
  name:item
  });
  insert.save();
  res.redirect("/");
});

app.post("/delete", (req,res)=>{
  const checkedvalue = req.body.checkbox;
  Item.findByIdAndRemove(checkedvalue,(err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("Successfully deleted");
    }
  });
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
