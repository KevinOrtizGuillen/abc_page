var mongoose;
var db;
exports.setup=function(_mongoose,_db){
	mongoose=_mongoose;
	db=_db;
		var coleccion_comentarios= new mongoose.Schema({
			correo: String,
			fecha: Date,
			comentario: String
	    });
		var coleccion_tiempo= new mongoose.Schema({
			temperatura: String,
			humedad: String,
            fecha: Date
        });
		//
		var coleccion_valoracion= new mongoose.Schema({
         	calificacion: String
         });
		//
        var coleccion_fotos=new mongoose.Schema({
           	url: String,
           	valoracion: [coleccion_valoracion]
         });
        var coleccion_ubicacion=new mongoose.Schema({
          	longitud: String,
            latitud: String,
            altitud: String
         });
	    
		var coleccion_zonaturistica= new mongoose.Schema({
			zonat: String,
			pais: String,
			region: String,
			provincia: String,
			distrito: String,
			descripcion: String,
			registro:Date,
			comentarios: [coleccion_comentarios],
			tiempo: [coleccion_tiempo],
			fotos: [coleccion_fotos],
			ubicacion: [coleccion_ubicacion]
		});

		var coleccion_registro=new mongoose.Schema({
                contraseña_antigua: String,
                fecha: Date,
                tiempo: String
		});
    
	var coleccion_usuario= new mongoose.Schema({
			nombres: String,
			apellidos: String,
			email: String,
			contraseña: String,
			imagen: String,
			permisos: String,
			registro:Date,
			zonat: [coleccion_zonaturistica],
			historial: [coleccion_registro]			
	});
	var Usuarios=db.model('Usuarios',coleccion_usuario);
	var Data=db.model('Usuarios');
	return Data;
}