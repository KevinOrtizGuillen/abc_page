var express = require('express')
, mongoose=require('mongoose')
, stylus=require('stylus')
, nib=require('nib')
, cookieParser=require('cookie-parser')
, session=require('express-session')
, bodyParser=require('body-parser')
, async=require('async')
//
, path=require('path')
, multipart=require('connect-multiparty')
, fs=require('fs')
//
, control=require('./control')
, modelo=require('./modelo')
, config=require('./config')
, port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
, ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
//, db=mongoose.createConnection(config.mongodb.url)
, db=mongoose.connect(config.mongodb.url, { useNewUrlParser: true })
, AllowCroossDomain=function(req,res,next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Content-type,x-access-token');
  next();
};
//cargarData();//////////////////////////////////////////////////////////////////esta linea
function compile(str,path){
  return stylus(str)
  .set('filename',path)
  .use(nib())
}
multipartMiddleware=multipart();
var urlImagen='';
var app = express();
app.set('views',__dirname+'/views');
//app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
//app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(session({ secret: '023197422617bce43335cbd3c675aeed' }));
app.use(session({
  secret:'023197422617bce43335cbd3c675aeed',
  name: '023197422617bce43335cbd3c675aeed',
  proxy: true,
  saveUninitialized: true
}));
app.use(stylus.middleware({src:__dirname+'/public',compile:compile }));
app.use(express.static(__dirname+'/public'));  
app.use(AllowCroossDomain);
app.engine('html', require('ejs').renderFile);

server=app.listen(port, ip);
console.log('Servidor corriendo en'+ip+':'+port);

function IsAuthenticated(req,res,next){
  var path=(req.path==null)?'/':req.path;
  if (req.session.usuario_id) {
    next();
  }else{
    res.status(301).redirect('open');//res.redirect('/login?redirect='+path);
  }
}
control.plataforma.setup(modelo);
control.usuarios.setup(modelo);
control.zonas.setup(modelo);
control.fotos.setup(modelo);

app.get('/', IsAuthenticated,control.plataforma.adminPage);
app.get('/open', control.plataforma.open);
app.get('/login',control.plataforma.loginGet);
app.post('/login',control.plataforma.loginPost);
app.get('/logout',IsAuthenticated,control.plataforma.logoutGET)
app.post('/nUsuarioPost',control.plataforma.nUsuarioPost);
app.get('/infozona',control.zonas.infozonaGET);
app.get('/adminLog',IsAuthenticated,control.plataforma.adminPage);
app.post('/subirFoto',IsAuthenticated,multipartMiddleware,control.fotos.subirFoto);
//app.post('/subirFoto',IsAuthenticated,control.fotos.subirFoto);


//cargar datos al sistema
function cargarData(){
  console.log("Iniciando carga");
  //
    var coment={};
    coment.correo="esdekevin@gmail.com";
    coment.fecha=new Date();
    coment.comentario="QUe lindo lugar, para poder recordar la historia del Perú";
  //
    var tiemp={};
    tiemp.temperatura="15°C";
    tiemp.humedad="clima frigido";
    tiemp.fecha=new Date();
  //
    var val={};
    val.calificacion=4;
  //
    var foto={};
    foto.url="img-page/img1.jpg";
    foto.valoracion=[val];
  //
    var ubic={};
    ubic.longitud="-13.33333";
    ubic.latitud="-17.111245";
    ubic.altitud="14.222";
  //
    var zonas={};
    zonas.zonat="Pampa de Quinua";
    zonas.pais="Republica de Ayacucho";
    zonas.region="Ayacucho";
    zonas.provincia="Huamanga";
    zonas.distrito="Huamanga";
    zonas.descripcion="Santuario Histórico de la Pampa de Ayacucho se estableció el 14 de julio de 1980,. Su objetivo principal es proteger el patrimonio natural e histórico del escenario donde se realizó el 9 de diciembre de 1824 la Batalla de Ayacucho,último gran enfrentamiento dentro de las campañas terrestres de las guerras de independencia hispanoamericanas, así como conservar las manifestaciones culturales y artesanales de las poblaciones aledañas. Es escenario, cada 9 de diciembre, de la escenificación de dicha batalla, con presencia de más de 10 mil.actores entre profesionales y voluntarios. Asimismo, su presencia busca mejorar y ampliar el circuito turístico Ayacucho - Wari - Quinua - Pampas de Ayacucho, y brindar facilidades para que el público utilice el área para su recreación y cultura.1​ Tiene un área de 300 hectáreas.";
    zonas.registro=new Date();
    zonas.comentarios=[coment];
    zonas.tiempo=[tiemp];
    zonas.fotos=[foto];
    zonas.ubicacion=[ubic];    
  //
    var row=new modelo.usuarios;
      row.nombres="saul";
      row.apellidos="Ortiz Guillen";
      row.email="saul@gmail.com";
      row.contrasena="ffb4761cba839470133bee36aeb139f58d7dbaa9";//kevin
      row.imagen="";
      row.permisos="A";
      row.registro=new Date(); 
      row.zonat=[zonas];         
      row.save(function(err){
        if (err) {
          console.log("err");
        }else{
          console.log(row.nombres +"addeded 1");          
        }
      });     
}
//change data
//cargarData();