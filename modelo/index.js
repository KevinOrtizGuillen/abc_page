var mongoose=usuario=require('mongoose');
var config=require('../config');
var db=mongoose.createConnection(config.mongodb.url);
exports.usuarios=require("./musuario").setup(mongoose,db);