var mongoose = require('mongoose');

var thing = mongoose.model('Trash',{
  thing:{
    type: String
  },
  category:{
    type: String
  },
  color:{
    type: String
  }
});

module.exports = {thing};
