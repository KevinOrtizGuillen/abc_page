var modelo
, crypto=require('crypto')
, moment=require('moment');
moment.locale("es");

exports.setup=function(_modelo){
	modelo=_modelo
};
exports.infozonaGET=function(req,res){
	function out(){	
		data=req.query;
		console.log('hasta aqui zona');		
		zonatb=data.zonat;
		console.log(zonatb);
		modelo.usuarios.find({"zonat.zonat":"Pampa de Quinua"},{zonat:1},function(err,row){
			var data={};
			if (err) {
				data.status=-1;
				data.data=null;
				console.log("czonas codeErr:-1");
			}else if(row==null){
				data.status=0;
				data.data=null;				
				console.log("czonas codeErr:0");				
			}else{
				console.log("czonas codeErr:1");
				data.status=1;
				listar=[];
				console.log('row: ');
				console.log(row);							
				row.forEach(function(e){					
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
						//
						listComent=[];
						e1.comentarios.forEach(function(ec){
							objCL={};
							objCL.correo=ec.correo;
							objCL.comentario=ec.comentario;
							objCL.fecha=moment(ec.fecha).fromNow();
							listComent.push(objCL);
						});
						//
						objListar.comentarios=listComent;
						listar.push(objListar);
						console.log('aqui en info zona');	
						console.log(e1);
					});					
				});				
				data.data=listar[0];
				res.render('./home/info.html',{data:data.data});
			}
		});
		
	}
	return out( );
};

