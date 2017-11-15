//////////////////////////////////////////////////////////////
var mongoose;
var db;
exports.setup=function(_mongoose,_db){
	mongoose=_mongoose;
	db=_db;
    var coleccion_valoracion_sistema=new mongoose.coleccion({
	       calificacion: String,
           comentarios: String,
           correo: String
    });
    var Valoraciones=db.model('Valoraciones',coleccion_valoracion);
		var Data=db.model('Valoraciones');
		return Data;	
}