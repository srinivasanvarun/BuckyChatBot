var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {thing} = require('./models/trash_model');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
// Getting trash details
app.post('/getcategory', (req, res) => {
  var jsondata = JSON.parse(JSON.stringify(req.body));
  console.log(jsondata);
  var obj = jsondata.result.parameters['object'];
  console.log(obj);
  var query = thing.find({thing:{"$regex":obj}});
  query.exec((err,doc) => {
    if(!err){
      var len = Object.keys(doc).length;
      if(len == 1){
        console.log(doc[0].thing);
        var string = 'You can put '+doc[0].thing+' in the '+doc[0].color+' colored '+doc[0].category+' bins.';
        res.json({'fulfillmentText': string});
      } else if(len > 1){
        var string = 'You can put ';
        for(var i=0;i<len;i++){
          string += doc[i].thing;
          if(i != len-2 && i != len-1){
            string += ', '
          } if(i == len-2) {
            string += ' or '
          }
        }
        string += ' in the '+doc[0].color+' colored '+doc[0].category+' bins.'
      }
      res.json({'fulfillmentText': string});
    }else{
      res.json({fulfillmentText: 'Sorry. I\'m not sure what you are talking about. Try a different keyword.'});
    }
  });
});

// Creating new user
app.post('/addtrashitem/:item/:category/:color', (req, res) => {
  var newthing =  new thing({
    thing: req.params.item,
    category: req.params.category,
    color: req.params.color
  });
  newthing.save().then(()=>{
    res.status(200).send({"message": "Added Successfully!"});
  },(err)=>{
    res.status(400).send({"message": "Unable to save data"});
  });
});

app.listen(port,()=>{
  console.log(`Express listening on ${port} port`);
});

module.exports={app};
