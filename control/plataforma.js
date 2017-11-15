var modelo
, crypto=require('crypto')
, moment=require('moment');
moment.locale("es");
exports.setup=function(_modelo){
	moment=_modelo;
}
exports.open=function(req, res){
	function out( ){
		
		res.render('index.html',{redirect:req.query.redirect});
	}
	return out();
};
exports.loginGet=function(req, res){
	function out(){


	}
};
exports.loginpost=function(req, res){
	function out( ){
		var dato=req.body;
		console.log(dato.email);
		res.render('open1.html',{title:"hola a todos"});
	}
	return out( );
};
