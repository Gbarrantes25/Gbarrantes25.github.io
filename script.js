
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
        // Llamamos a la alerta error.
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
        // Llamamos a la alerta error.
        alertaError();
        
    }

}


// Creamos una función que nos permita copiar el texto del textarea desencriptado y lo vinculamos añ botón copiar en el HTML con el método "onclick".
function copiar () {

    // Obtenemos la referencia del área de texto de salida y lo almacenamos en una variable
    textoCopiar = document.getElementById("texto-salida");

    // Seleccionamos todo el texto del área de salida
    textoCopiar.select();

    // Copiamos el contenido al portapapeles
    document.execCommand("copy");

    // Llamamos a la función alerta copiar
    alertaCopiar();
}


// Creamos una función que nos permitirá limpiar y/o reiniciar las áreas de texto del encriptador.
function limpiar () {

    // Obtenemos el valor del área de texto de entrada en letras minúsuclas y lo almacenamos en una variable.
    var textocaja = document.getElementById("texto-entrada").value.toLowerCase();

    // Si texto de entrada no está vació o lleno...
    if(textocaja != "" || textocaja === ""){

        // Entonces reemplaza con un "" la caja de texto entrada.
        document.getElementById("texto-entrada").value = "";
        
    }

    // Ejecutamos a la función ocultar para que aparezca la imagen y sus párrafos del inicio.
    ocultar();
}



// Creamos una función que muestre el textarea desencriptado y oculte la imagen y textos.
function mostrar () {

    // Obtenemos la referencia del texto de salida y le cambioamos el css display a visible
    document.getElementById("texto-salida").style.display = "show";
    // Obtenemos la referencia del texto de salida y le cambioamos el css display a inherit
    document.getElementById("texto-salida").style.display = "inherit";
    // Obtenemos la referencia del texto de salida y le cambioamos el css tamaño mínimo a 40vh.
    document.getElementById("texto-salida").style.minHeight = "40vh";
    // Obtenemos la referencia del texto de salida y le cambioamos el css margin a 2rem arriba y auto abajo.
    document.getElementById("texto-salida").style.margin = "2rem 0 auto 0";
    // Ocultamos por css todo el div ocultar donde está la imagen y textos
    document.getElementById("ocultar").style.display = "none";
    // Hacemos visible el botón copiar
    document.getElementById("btn-copiar").style.display = "show";
    // Hacemos que el bot+on copiar tome el valor de pantalla del elemento padre
    document.getElementById("btn-copiar").style.display = "inherit";
    // Alineamos el texto del botón copiar al centro.
    document.getElementById("btn-copiar").style.justifyContent = "center";
}

// Creamos una función que oculte el textarea desencriptado y muestre la imagen y textos.
function ocultar () {

    // Ocultamos el área de texto de salida
    document.getElementById("texto-salida").style.display = "none";
    // Mostramos el div que contiene la imagen y textos
    document.getElementById("ocultar").style.display = "show";
    // Hacemos que la pantalla del div herede el atributo del padre
    document.getElementById("ocultar").style.display = "inherit";
    // Ocultamos el botón copiar
    document.getElementById("btn-copiar").style.display = "none";
}

// Creamos una función para la alerta error
// Notar que la alerta está con opacidad "0" y visibilidad "hidden"
function alertaError() {

    // En la caja alerta error, le cambiamos la propiedad CSS opacity a 1
    document.getElementById("alerta-error").style.opacity = "1";
    // En la caja alerta error, le cambiamos la propiedad CSS visibility a visible
    document.getElementById("alerta-error").style.visibility = "visible";

    // Establecemos un temporizador de 1 segundo para que la alerta desaparezca
    setTimeout( function() {

        // Obtenemos la referencia de la caja alerta error y lo ocultamos.
        document.getElementById("alerta-error").style.opacity = "0";
        document.getElementById("alerta-error").style.visibility = "hidden";
    }, 1000);
}

// Creamos una función para la alerta copiar
// Notar que la alerta está con opacidad "0" y visibilidad "hidden"
function alertaCopiar() {

    // En la caja alerta copiar, le cambiamos la propiedad CSS opacity a 1
    document.getElementById("alerta-copiar").style.opacity = "1";

    // En la caja alerta copiar, le cambiamos la propiedad CSS visibility a visible
    document.getElementById("alerta-copiar").style.visibility = "visible";

    // Establecemos un temporizador de 1 segundo para que la alerta desaparezca
    setTimeout( function() {

        // Obtenemos la referencia de la caja alerta copiar y lo ocultamos.
        document.getElementById("alerta-copiar").style.opacity = "0";
        document.getElementById("alerta-copiar").style.visibility = "hidden";
    }, 1000);
}


