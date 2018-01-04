var modelo
, crypto=require('crypto')
, moment=require('moment');
moment.locale("es");
exports.setup=function(_modelo){
	modelo=_modelo
};
exports.mostrarComentariosZonas=function(req, res){
	function out(){
		dato=req.query;	
		data={};
		/*
		data.status {-1,0,1}		
		data.data
		*/	
		modelo.usuarios.find({"zonat.comentarios"},{},function(err,row){
			if (err) {
				data.status=-1;
				data.data=null;
			}else if (row.length==0) {
				data.status=-1;
				data.data=null;
			}else	{
				data.status=1;
				listar=[];
				row.forEach(function(e){
					objListar={};
					objListar.correo=row.correo;
					objListar.fecha=moment(row.fecha).fromNow();
					listar.push(objListar);
				})
				data.data=listar;
			}
		});
	}
	return out();
};