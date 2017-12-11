var modelo
, crypto=require('crypto')
, moment=require('moment');
moment.locale("es");
exports.setup=function(_modelo) {
	modelo=_modelo;
}
/*
Aqui se debera enviar un dato de la siguiente forma
{
	id_usuario
	foto_zona
}
**/
exports.subirfoto=function(req, res){
	function out(){
		data=req.query();
		modelo.usuario.find({})
	}
	return out();
};