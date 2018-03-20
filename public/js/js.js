function probar_pass(){
  if (!($('#password_in').val()===$('#repass_in').val())) {
    $('#mostrarError').modal()
  }else {
    EnviarP('/nUsuarioPost?name_in='+$('#name_in').val()+'&lastname_in='+$('#lastname_in').val()+'&email_in='+$('#email_in').val()+'&password_in='+$('#password_in').val()+'&repass_in='+$('#repass_in').val(),'mostrarError');
    $('#mostrarError').modal();
  }
}

function ajaxFunction() {
  var xmlHttp;
  
  try {
   
    xmlHttp=new XMLHttpRequest();
    return xmlHttp;
  } catch (e) {
    
    try {
      xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
      return xmlHttp;
    } catch (e) {
      
	  try {
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
        return xmlHttp;
      } catch (e) {
        alert("Tu navegador no soporta AJAX!");
        return false;
      }}}
}

function Enviar(_pagina,capa) {
    var ajax;
    ajax = ajaxFunction();
    ajax.open("GET", _pagina, true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    ajax.onreadystatechange = function() {
		if (ajax.readyState==1){
			document.getElementById(capa).innerHTML = " Aguarde por favor...";
			     }
		if (ajax.readyState == 4) {
		   
                document.getElementById(capa).innerHTML=ajax.responseText; 
		     }}
			 
	ajax.send(null);
} 
function EnviarP(_pagina,capa) {
    var ajax;
    ajax = ajaxFunction();
    ajax.open("POST", _pagina, true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    ajax.onreadystatechange = function() {
    if (ajax.readyState==1){
      document.getElementById(capa).innerHTML = " Aguarde por favor...";
           }
    if (ajax.readyState == 4) {
       
                document.getElementById(capa).innerHTML=ajax.responseText; 
         }}
       
  ajax.send(null);
} 