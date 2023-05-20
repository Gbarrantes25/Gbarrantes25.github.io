
// Creamos una función que nos permitá encriptar una cadena de texto y lo vincularemos al botón encriptar en el HTML con el método "onclick".
function encriptar() {

    // Capturamos el valor del textarea y convertimos la cadena a minúsculas. Luego lo asignamos a una variable "texto".
    var texto = document.getElementById("texto-entrada").value.toLowerCase();

    // Creamos una variable para el texto encriptado y lo inicializamos como vacío.
    var textoEncriptado = "";

    // Comprobamos si el texto ingresado algún valor y si contiene solo letras de la a-z, ñ y espacios.
    if(texto != "" && /^[ a-zA-ZñÑ]+$/igm.test(texto)){

        // Bucle para recorrer el texto como si fuera un arreglo
        for ( let i = 0; i < texto.length ; i++) {

            // Si la posición de texto ingresado es igual a "u" entonces reemplázalo por una palabra
            //y concatena a la variable textoEncriptado
            if (texto[i] === "u"){
                textoEncriptado = textoEncriptado + texto[i].replace("u", "ufat");

            // Sino si la posición de texto ingresado es igual a "i" entonces reemplázalo por una palabra
            //y concatena a la variable textoEncriptado
            } else if (texto[i] === "i"){
                textoEncriptado = textoEncriptado + texto[i].replace("i", "imes");
            
            // Sino si la posición de texto ingresado es igual a "o" entonces reemplázalo por una palabra
            // y concatena a la variable textoEncriptado
            } else if (texto[i] === "o"){
                textoEncriptado = textoEncriptado + texto[i].replace("o", "ober");
            
             // Sino si la posición de texto ingresado es igual a "e" entonces reemplázalo por una palabra
             // y concatena a la variable textoEncriptado
            } else if (texto[i] === "e"){
                textoEncriptado = textoEncriptado + texto[i].replace("e", "enter");
            
             // Sino si la posición de texto ingresado es igual a "a" entonces reemplázalo por una palabra
             // y concatena a la variable textoEncriptado
            } else if (texto[i] === "a"){
                textoEncriptado = textoEncriptado + texto[i].replace("a", "ai");
            
            // Sino no es vocal entonces no hagas reemplazo y concatena a la variable textoEncriptado
            } else {
                textoEncriptado = textoEncriptado + texto[i];
                
            }
        }

        // Creamos una variable texto final la que tomará el valor final del texto encriptado.
        var textoFinal = textoEncriptado;

        // Reemplazamos el contenido del textarea desencriptado por el valor del texto final
        document.getElementById("texto-salida").innerHTML = textoFinal;

        // Llamamos a la función mostrar que permitirá mostrar el textarea con la cadena desencriptada y ocultar la imagen y textos anteriores.
        mostrar();

    } else {
        alertaError();
    }
    
}

// Creamos una función que nos permitá desencriptar una cadena de texto y lo vincularemos al botón deencriptar en el HTML con el método "onclick".
function desencriptar() {

    // Capturamos el valor del textarea y convertimos la cadena a minúsculas. Luego lo asignamos a una variable "texto2".
    var texto2 = document.getElementById("texto-entrada").value.toLowerCase();

    if(texto2 != "" && /^[ a-zA-ZñÑ]+$/igm.test(texto2)){
        // Como no puedo recorrer la variable tetxo final índice por índice, ya que son palabras a reemplazar, 
        // aplicado la función reemplazar todo para buscar el texto y reemplazarlo por la vocal.

        var textoDesencriptado = texto2.replaceAll("ober","o").replaceAll("enter","e").replaceAll("ai","a").replaceAll("imes","i").replaceAll("ufat","u");

        // Reemplazamos el contenido del textarea desencriptado por el valor del texto desencriptado
        document.getElementById("texto-salida").innerHTML = textoDesencriptado;

        // Llamamos a la función mostrar que permitirá mostrar el textarea con la cadena desencriptada y ocultar la imagen y textos anteriores.
        mostrar();

    } else {
        
        alertaError();
        
    }

}


// Creamos una función que nos permita copiar el texto del textarea desencriptado y lo vinculamos añ botón copiar en el HTML con el método "onclick".
function copiar () {
    textoCopiar = document.getElementById("texto-salida");
    textoCopiar.select();
    document.execCommand("copy");
    alertaCopiar();
}


//
function limpiar () {
    var textocaja = document.getElementById("texto-entrada").value.toLowerCase();

    if(textocaja != "" || textocaja === ""){
        document.getElementById("texto-entrada").value = "";
        
    }
    ocultar();
}



// Creamos una función que muestre el textarea desencriptado y oculte la imagen y textos.
function mostrar () {
    document.getElementById("texto-salida").style.display = "show";
    document.getElementById("texto-salida").style.display = "inherit";
    document.getElementById("texto-salida").style.minHeight = "40vh";
    document.getElementById("texto-salida").style.margin = "2rem 0 auto 0";
    document.getElementById("ocultar").style.display = "none";
    document.getElementById("btn-copiar").style.display = "show";
    document.getElementById("btn-copiar").style.display = "inherit";
    document.getElementById("btn-copiar").style.justifyContent = "center";
}

// Creamos una función que oculte el textarea desencriptado y muestre la imagen y textos.
function ocultar () {
    document.getElementById("texto-salida").style.display = "none";
    document.getElementById("ocultar").style.display = "show";
    document.getElementById("ocultar").style.display = "inherit";
    document.getElementById("btn-copiar").style.display = "none";
}

//
function alertaError() {

    document.getElementById("alerta-error").style.opacity = "1";
    document.getElementById("alerta-error").style.visibility = "visible";
    setTimeout( function() {
        document.getElementById("alerta-error").style.opacity = "0";
        document.getElementById("alerta-error").style.visibility = "hidden";
    }, 1000);
}


function alertaCopiar() {

    document.getElementById("alerta-copiar").style.opacity = "1";
    document.getElementById("alerta-copiar").style.visibility = "visible";
    setTimeout( function() {
        document.getElementById("alerta-copiar").style.opacity = "0";
        document.getElementById("alerta-copiar").style.visibility = "hidden";
    }, 1000);
}


