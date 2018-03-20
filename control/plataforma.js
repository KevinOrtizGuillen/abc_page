var modelo
, crypto=require('crypto')
, moment=require('moment');
moment.locale("es");
exports.setup=function(_modelo){
	modelo=_modelo;
}
exports.open=function(req, res){
	function out( ){
		data=req.query;
		if (data.status==null) {
			estado=1;
		}else{
			estado=data.status;
		}
		console.log(data);
		console.log(estado);
		modelo.usuarios.find({},{zonat:1},function(err,row){
			var data={};
			if (err) {
				data.status=-1;
				data.data=null;
				data.log=estado;
				console.log("czonas codeErr:-1");
			}else if(row.length==0){
				data.status=0;
				data.data=null;
				data.log=estado;
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
						if (e1.comentarios!=null && e1.comentarios!='') {
							objListar.comentarios=e1.comentarios[0].comentario;
						}else{
							comentarios=[];
							registro=new Date();							
							comentarios.push({correo:"tu@gmail.com",fecha:moment(registro).fromNow(),comentario:"Aun no ha comentado nadie se el primero en comentar esto"});
							objListar.comentarios=comentarios[0].comentario;
						}						
						objListar.fotos=e1.fotos;
						objListar.tiempo=e1.tiempo;
						objListar.ubicacion=e1.ubicacion;
						listar.push(objListar);						
					});					
				});				
				data.data=listar;
				data.log=estado;
				res.render('index.html',{redirect:req.query.redirect,data:data.data,data_log:data.log});
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
		console.log(req.query);
	var dato=req.query;
		console.log(dato.correo_log);
		modelo.usuarios.findOne({email: dato.correo_log,contrasena:crypto.createHash('sha1').update(dato.password_log).digest("hex")},{},function(err,row){
			var data={};
			if (err) {
				data.msn='plataforma codeErr: -1';
				data.status=-1;
				data.data=null;
				console.log("plataforma codeErr: -1");
				res.redirect('/open?status=-1');	
			}else if (row===null) {
				data.msn='plataforma codeErr: 0';
				data.status=0;
				data.data=null;
				console.log("plataforma codeErr: 0");
				//res.redirect('/open?status=0');	
				res.render('./res/login_fail_1.html');
			}else{
				req.session.usuario_id=row._id;
				req.session.usuario_email=row.email;
				req.session.usuario_permiso=row.permisos;
				req.session.nombre_usuario=row.nombres;
				var usuario={};					
					usuario.nombre=row.nombres;
					usuario.apellidos=row.apellidos;
					usuario.email=row.email;
					usuario.contrasena=row.contrasena;
					usuario.imagen=row.imagen;
					usuario.permisos=row.permisos;
					usuario.registro=moment(row.registro).fromNow();
				  data.data=usuario;
				  data.msn='Succesfull';
				  data.status=1;
			    console.log("plataforma codeErr: 1");
				//res.render('open.html',{title:"hola a todos",data:data});
				//res.redirect('/',{title:"hola a todos",data:data});
				res.render('./res/login_ok_1.html');
				//res.redirect('/');
			}
			//res.redirect('/');				
		});			
	}
	return out( );
};
exports.nUsuarioPost=function(req,res){
	function out( ){
		var dato=req.query;
		console.log('aqui dato');
		console.log(dato);
		//
		modelo.usuarios.findOne({email: dato.email_in},{},function(err,row){		
			var data={};
			if (err) {
				data.msn='plataforma codeErr: -1';
				data.status=-1;
				data.data=null;
				console.log("plataforma codeErr: -1");
				res.redirect('/');	
			}else if (row===null) {
				data.msn='plataforma codeErr: 0';
				data.status=0;
				data.data=null;
				console.log("plataforma codeErr: 0");
					var nUsuario=new modelo.usuarios;
					nUsuario.nombres=dato.name_in;
					nUsuario.apellidos=dato.lastname_in;
					nUsuario.email=dato.email_in;
					nUsuario.contrasena=crypto.createHash('sha1').update(dato.password_in).digest("hex");
					nUsuario.imagen=dato.imagen;
					nUsuario.permisos='B';
					nUsuario.registro=new Date();					
					nUsuario.save(function(err,row){
						var data={}
						if (err) {
							data.msn='codeErr: -1';
							data.status=-1;
							console.log('plataforma-nusuario codeErr: -1');
						}else{
							//creamos session
								req.session.usuario_id=row._id;
								req.session.usuario_email=row.email;
								req.session.usuario_permiso=row.permisos;
								req.session.nombre_usuario=row.nombres;
							//
							data.msn='codeErr: 1';
							data.status=0;
							console.log('plataforma-nusuario codeErr: 1');
						}
					res.render('./res/registro_ok_1.html',{});
					 //res.render('./home/pageAdmin.html',{data:data});
					});
				//	
			}else{
				
				  data.msn='Error';
				  data.status=1;
			      console.log("plataforma codeErr: 1");
				  //res.redirect('/open');
				  res.render("./res/registro_fail_1.html",{});
			}
			//res.redirect('/');				
		});
		//

		
	}
	return out( );
}
exports.logoutGET=function(req, res){
	function out(){
		req.session.destroy(function(){});
		res.redirect('/');
	}
	return out();
};
exports.adminPage=function(req, res){
	function out(){
		//console.log(res);
		var dato=req.body;
		console.log(dato.correo_log);
		modelo.usuarios.findOne({_id: req.session.usuario_id,email:req.session.usuario_email},{},function(err,row){
			var data={};
			if (err) {
				data.msn='plataforma codeErr: -1';
				data.status=-1;
				data.data=null;
				console.log("plataforma codeErr: -1");	
				res.render('./home/pageAdmin.html',{data:data});				
			}else if (row===null) {
				data.msn='plataforma codeErr: 0';
				data.status=0;
				data.data=null;
				console.log("plataforma codeErr: 0");	
				res.render('./home/pageAdmin.html',{data:data});				
			}else{
					listar=[];						
					e=row;
					recorre=e.zonat;
					recorre.forEach(function(e1){
						objListar={};
						objListar.zonat=e1.zonat;
						objListar.pais=e1.pais;
						objListar.region=e1.region;
						objListar.provincia=e1.provincia;
						objListar.distrito=e1.distrito;
						objListar.descripcion=e1.descripcion;
						objListar.registro=moment(e1.registro).fromNow();
						objListar.comentarios=e1.comentarios;
						objListar.fotos=e1.fotos;
						objListar.tiempo=e1.tiempo;
						objListar.ubicacion=e1.ubicacion;						
						listar.push(objListar);							
					});										
				  data.data=listar;
				  data.msn='Succesfull';
				  data.status=1;
			    console.log("plataforma codeErr: 1");
				res.render('./home/pageAdmin.html',{data:data});
			}						
		});

		
	}
	return out();
};