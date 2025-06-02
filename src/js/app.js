document.addEventListener('DOMContentLoaded', function () { //hasta que este listo el HTML, CSS, etc
   crearGaleria(); 
   navegacionFija();
   resaltarEnlace();
   scrollNav();
});

function navegacionFija() {
    const header = document.querySelector('.header'); //Seleccionamos el header
    const contenidoFestival = document.querySelector('.contenido_festival'); //Es la clase que queremos pasar y no muestre la nav

    document.addEventListener('scroll', function(){
        //.getBoundingClientRect().bottom, son las coordenadas de la ubicacion de la clase contenido_festival
        
        if (contenidoFestival.getBoundingClientRect().bottom < 1) { //Con esto revisamos si ya pasamos el elemento con scroll
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
   
        }
    })
}

function crearGaleria() {
    const galeria = document.querySelector('.galeria_imagenes');
    const cantidad_imgs = 16

    for (let i = 1; i <= cantidad_imgs; i++) { //Recorremos todas las imagenes
        const imagen = document.createElement('PICTURE'); //Debe ser en un picture
        //Agregamos los tipos de imagenes
        imagen.innerHTML = `
            <source srcset="dist/img/gallery/thumb/${i}.avif" type="image/avif"> 
            <source srcset="dist/img/gallery/thumb/${i}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="dist/img/gallery/thumb/${i}.jpg" alt="imagen galeria">`;

        //Event Handler, es el proceso de detectar y responder a una interaccion del usuario, en este caso un click
        imagen.onclick = function () {
            mostrarImagen(i); 
        }
         
        galeria.appendChild(imagen); //Añadimos cada imagen al HTML
        
    }
};

function mostrarImagen(i) {

    //Mostrar  cada  imagen
    const imagen = document.createElement('PICTURE');
    //Agregamos los tipos de imagenes
    imagen.innerHTML = `
        <source srcset="dist/img/gallery/full/${i}.avif" type="image/avif">
        <source srcset="dist/img/gallery/full/${i}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="dist/img/gallery/full/${i}.jpg" alt="imagen galeria">`;

    //Generar Modal
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    modal.onclick = cerrarModal;
    modal.appendChild(imagen); //Mostrar la imagen en el modal

    //Boton cerrar modal
    const cerrarModalBtn = document.createElement('BUTTON');
    cerrarModalBtn.textContent = 'X';
    cerrarModalBtn.classList.add('btn_cerrar');
    cerrarModalBtn.onclick = cerrarModal;
    modal.appendChild(cerrarModalBtn);

    //Agregar al HTML
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden')
    body.appendChild(modal); //Agregamos el modal al body

    console.log(modal);
}

function cerrarModal(){
    const modal = document.querySelector('.modal');
    const overflow = document.querySelector('.overflow-hidden')

    modal.classList.add('fade-out'); //Clase de la animacion para salir de la imagen

    setTimeout(() => {
        modal?.remove(); //Si existe modal, la elimina
        const body = document.querySelector('body');
        body.classList.remove('overflow-hidden'); //el overflow lo elimina, para habilitar el scroll cuando deje de ver la imagen
    }, 500);
}

function resaltarEnlace() {
    document.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav_principal a'); //Seleccionar todos los enlaces

        let actual = ''; 
        //Para detectar la section actual
        //Tenemos que iterar en las sections y detectar en cual estamos
        sections.forEach(section => {
            const sectionTop = section.offsetTop; //offsetTop, es la distancia con el elemento padre, aca el body
            const sectionHeight = section.clientHeight; //clientHeight, para saber cuanto mide cada section 

            if (window.scrollY >= (sectionTop - sectionHeight / 3)) { //ScrollY, es horizontalmente, la operacion nos permite saber que section esta mas visible en la pantalla
                actual = section.id; //Pag actual  
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); //Para que no deje el color para siempre, si no que lo borre cada vez que es un link diferente
            if (link.getAttribute('href') === '#' + actual) { //Detectamos cual enlace actual tiene el mismmo valor que el id de la pag actual   
                link.classList.add('active')
            }
        });
    })
}

function scrollNav() {
    const navLinks = document.querySelectorAll('.nav_principal a');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()
            const sectionScroll = e.target.getAttribute('href'); //Obtenemos el href de los enlaces al hacer click
            const section = document.querySelector(sectionScroll); //Seleccionamos el section seleccionado del HTML

            section.scrollIntoView({behavior: 'smooth'}); //Efecto, Transicion o salto tipo smooth al oprimir en el enlace
        })
    });
}