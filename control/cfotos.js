var modelo
, crypto=require('crypto')
, moment=require('moment')
, async=require('async');
moment.locale("es");
exports.setup=function(_modelo) {
	modelo=_modelo;
};
/*
Aqui se debera enviar un dato de la siguiente forma
{
	id_usuario
	foto_zona
}
**/
var fs=require('fs');
//
exports.subirFoto11=function(req, res){
	function out(){
		console.log(req.files);
		fs.readFile(req.files.filesUpload.path,function(err,data){
			var nameImagen=req.files.filesUpload.name;
			console.log(data);
			if (err) {
				console.log('Sucedio un error: '+err);
			}else{
				console.log('Nombre de la Imagen es: '+nameImagen);
				var nuevoDirectory='./public/img-page/'+nameImagen;
				fs.writeFile(nuevoDirectory,data,function(err){
					if (err) {
						console.log(err);
					}else{
						urlImagen='/public/img-page/'+nameImagen;
						console.log(urlImagen);
						//res.render('open.html',{urlimagen:urlImagen});
						res.redirect('/');
					}
				});
			}
		});
	}
	return out();
};
exports.subirFoto=function(req, res){
	function out(){
		nombre="";
		//console.log(req.files);
		dato=req.body;
		USUARIO_T=null;
		ZONAT_T=null;
		FOTO_T=null;
		async.series([
			function(callback){				
				////////////////////////////////////
				modelo.usuarios.findOne({_id:req.session.usuario_id},{},function(err,row){
					var data={};
					if (err) {
						data.msn='plataforma codeErr: -1';
						data.status=-1;
						data.data=null;
						console.log("plataforma codeErr: -1");						
					}else if (row===null) {
						data.msn='plataforma codeErr: 0';
						data.status=0;
						data.data=null;
						console.log("plataforma codeErr: 0");						
					}else{						
						var usuario=row;					
						var zonast={};
						zonast.zonat=dato.zona_in;
						zonast.pais=dato.paisSelect;
						zonast.region=dato.regSelect;
						zonast.provincia=dato.provSelect;
						zonast.distrito=dato.distSelect;
						zonast.descripcion=dato.desc_in;
						console.log('zonast');
						console.log(zonast);
						usuario.zonat.push(zonast);
						ZONAT_T=zonast;
						USUARIO_T=usuario;
						//usuario.save(callback);			
						callback();
					}
				});
			},
			function(callback){
				fs.readFile(req.files.filesUpload.path,function(err,data){
					var nameImagen=req.files.filesUpload.name;
					console.log(data);
					if (err) {
						console.log('Sucedio un error: '+err);
					}else{
						console.log('Nombre de la Imagen es: '+nameImagen);
						var nuevoDirectory='./public/img-page/'+nameImagen;
						fs.writeFile(nuevoDirectory,data,function(err){
							if (err) {
								console.log(err);
							}else{
								urlImagen='img-page/'+nameImagen;
								console.log(urlImagen);
								//res.render('open.html',{urlimagen:urlImagen});
								////
								fotos={};
								fotos.url=urlImagen;
								fotos.valoracion=[{calificacion:"1"}];
								console.log(ZONAT_T);
								ZONAT_T.fotos=fotos;																							
								modelo.usuarios.findOne({_id:req.session.usuario_id},{},function(err,row){
									if (err) {
										data.msn='plataforma codeErr: -1';
										data.status=-1;
										data.data=null;
										console.log("plataforma codeErr: -1");						
									}else if (row===null) {
										data.msn='plataforma codeErr: 0';
										data.status=0;
										data.data=null;
										console.log("plataforma codeErr: 0");						
									}else{
										row.zonat.push(ZONAT_T);
										row.save(callback);
									}
								});
								////								
							}
						});
					}
				});
			}],
			function(err){
				if (err) return next(err);
				res.redirect('/');
			});
	}
	return out();
};