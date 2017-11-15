var express = require('express')
, mongoose=require('mongoose')
, stylus=require('stylus')
, nib=require('nib')
, cookieParser=require('cookie-parser')
, session=require('express-session')
, bodyParser=require('body-parser')
, control=require('./control')
, modelo=require('./modelo')
, config=require('./config')
, port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
, ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
, db=mongoose.createConnection(config.mongodb.url)
, AllowCroossDomain=function(req,res,next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Content-type,x-access-token');
  next();
};
 /* morgan  = require('morgan')*/
/*app.use(morgan('combined'))*/
function compile(str,path){
  return stylus(str)
  .set('filename',path)
  .use(nib())
}
var app = express();
app.set('views',__dirname+'/views');
//app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({ secret: '023197422617bce43335cbd3c675aeed' }));
app.use(stylus.middleware({src:__dirname+'/public',compile:compile }));
app.use(express.static(__dirname+'/public'));  
app.use(AllowCroossDomain);
//
/*
app.use(express.bodyParser());
app.use(express.bodyParser({uploadDir:'./uploads'}));
*/
//    
app.engine('html', require('ejs').renderFile);

server=app.listen(port, ip);
console.log('Servidor corriendo en'+ip+':'+port);

control.plataforma.setup(modelo);
//module.exports = app ;
/*app.get('/', function (req, res) {   
    res.render('index.html', { pageCountMessage : null});
});*/
//
function IsAuthenticated(req,res,next){
  var path=(req.path==null)?'/':req.path;
  if (req.session.usuario_id) {
    next();
  }else{
    res.redirect('/login?redirect='+path);
  }
}

app.get('/', control.plataforma.open);
app.get('/login',control.plataforma.loginGet);
//app.post('/login',control.plataforma.loginPost);
/*var fs=require('fs');
app.post('/subir',function(req,res){
   var tmp_path=req.files.miarchivo.path;
   var tipo=req.titles.miarchivo.type;
   if(tipo=='image/png' || tipo=='image/jpg'||tipo=='image/jpeg'){
    var nombrearchivo=req.files.miarchivo.name;
    var target_path='./public/uploads/'+nombrearchivo;
    fs.rename(tmp_path,function(err){
      fs.unlink(tmp_path, function(err){
        res.send('<p>El archivo se subio correctamente<p></br><img src="./uploads/'+nombrearchivo+'"></img>');
      });
    });
   }
})*/
/*app.get('/', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('index.html', {
        drinks: drinks,
        tagline: tagline
    });
});*/
/*app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

*/
