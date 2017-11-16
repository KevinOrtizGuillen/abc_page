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
//

/*
var row=new modelo.usuarios;
row.nombres="Kevin";
row.apellidos="Ortiz Guillen";
row.email="esdekevin@gmail.com";
row.contraseña="ffb4761cba839470133bee36aeb139f58d7dbaa9";//kevin
row.imagen="";
row.permisos="A";
row.registro=new Date();
row.save(function(err){
  if (err) {
    console.log("err");
  }else{
    console.log(row.nombres +"addeded");
  }
});*/ 
//

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

function IsAuthenticated(req,res,next){
  var path=(req.path==null)?'/':req.path;
  if (req.session.usuario_id) {
    next();
  }else{
    res.redirect('/login?redirect='+path);
  }
}
control.plataforma.setup(modelo);
control.usuarios.setup(modelo);
control.zonas.setup(modelo);

app.get('/', control.plataforma.open);
app.get('/login',control.plataforma.loginGet);
app.post('/login',control.plataforma.loginPost);
app.post('/nUsuarioPost',control.plataforma.nUsuarioPost);
app.get('/infozona',control.zonas.infozonaGET);