var modelo
, crypto=require('crypto')
, moment=require('moment');
moment.locale("es");
exports.setup=function(_modelo){
	modelo=_modelo;
}
exports.open=function(req, res){
	function out( ){
		modelo.usuarios.find({},{zonat:1},function(err,row){
			var data={};
			if (err) {
				data.status=-1;
				data.data=null;
				console.log("czonas codeErr:-1");
			}else if(row.length==0){
				data.status=0;
				data.data=null;
			}else{
				data.status=1;
				listar=[];						
				row.forEach(function(e){
					recorre=e.zonat;
					recorre.forEach(function(e1){
						objListar={};
						objListar.zonat=e1.zonat;
						objListar.pais=e1.pais;
						objListar.region=e1.region;
						objListar.provincia=e1.provincia;
						objListar.distrito=e1.distrito;
						objListar.registro=moment(e1.registro).fromNow();
						objListar.comentarios=e1.comentarios[0].comentario;
						listar.push(objListar);							
					});					
				});				
				data.data=listar;
				res.render('index.html',{redirect:req.query.redirect,data:data.data});
			}
		});
	}
	return out();
};
exports.loginGet=function(req, res){
	function out(){
		res.render('index.html',{redirect:req.query.redirect});
	}
};
exports.loginPost=function(req, res){
	function out( ){
	var dato=req.body;
		console.log(dato.correo_log);
		modelo.usuarios.findOne({email: dato.correo_log,contraseña:crypto.createHash('sha1').update(dato.password_log).digest("hex")},{},function(err,row){
			var data={};
			if (err) {
				data.msn='plataforma codeErr: -1';
				data.status=-1;
				data.data=null;
				console.log("plataforma codeErr: -1");
			}else{	
				if (row.length===0) {
					data.msn='plataforma codeErr: 0';
					data.status=0;
					data.data=null;
					console.log("plataforma codeErr: 0")
				}else{
					var usuario={};					
						usuario.nombre=row.nombres;
						usuario.apellidos=row.apellidos;
						usuario.email=row.email;
						usuario.contraseña=row.contraseña;
						usuario.imagen=row.imagen;
						usuario.permisos=row.permisos;
						usuario.registro=moment(row.registro).fromNow();
					  data.data=usuario;
					  data.msn='Succesfull';
					  data.status=1;
				    console.log("plataforma codeErr: 1");
				}
			}
			res.render('open.html',{title:"hola a todos",data:data});
		});		
	}
	return out( );
};
exports.nUsuarioPost=function(req,res){
	function out( ){
		var dato=req.body;
		console.log(dato);
		var nUsuario=new modelo.usuarios;
		nUsuario.nombres=dato.name_in;
		nUsuario.apellidos=dato.lastname_in;
		nUsuario.email=dato.email_in;
		nUsuario.contraseña=crypto.createHash('sha1').update(dato.password_in).digest("hex");
		nUsuario.imagen=dato.imagen;
		nUsuario.permisos='B';
		nUsuario.registro=new Date();
		nUsuario.save(function(err){
			var data={}
			if (err) {
				data.msn='codeErr: -1';
				data.status=-1;
				console.log('plataforma codeErr: -1');
			}else{
				data.msn='codeErr: 1';
				data.status=1;
				console.log('plataforma codeErr: 1');
			}
		//res.redirect('index.html',{redirect:req.query.redirect});
		 res.status(301).redirect('/?#resterForm')
		});
	}
	return out( );
}