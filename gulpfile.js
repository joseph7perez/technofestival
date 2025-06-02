import { src, dest, watch, series } from "gulp";//"src" para acceder a los archivos fuente, y "dest" donde se van a almacenar los archivos 
import * as dartSass from 'sass';
import gulpSass from "gulp-sass";
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';


import terser from "gulp-terser";
import sharp from "sharp";

const sass = gulpSass(dartSass); //Con esto el gulpSass utiliza la funciones de sass, 
//compilamos sass utilizando la dependencia de gulpSass y le pasamos la dependencia de sass que es "dartSass"



export function css(done) {
    src('src/scss/app.scss', {sourcemaps: true}) //Ubicar el archivo, {sourcemaps: true} es para visualizar el archivo SCSS donde esta el codigo
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError)) //Para compilarlo, ejecuta la funcion, la funcion sass de la linea 5
                                                //El .on('error', sass.logError) es para que nos muestre el error que hay, en la terminal
        .pipe(dest('dist/css', {sourcemaps: true}))//destino donde queremos almacenar el archivo, {sourcemaps: true} es para visualizar el archivo SCSS donde esta el codigo

    done();
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full' //Busca la galeria
    const outputFolder = 'src/img/gallery/thumb'; //Genera una carpeta con imagenes mas pequeñas
    //Ajustamos ancho y alto
    const width = 250;
    const height = 180;
    //Si no esta creada la carpeta la crea
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file)); //Revisa las imagenes
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}

//Se encarga de buscar las imagenes y manda a llamar procesarImagenes
export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './dist/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`) //Salida para webp
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`) //Salida para avif

    const options = { quality: 80 } //Calidad de la imagen
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp) //Genera las versiones webp 
    sharp(file).avif().toFile(outputFileAvif) //Genera las versiones avif 
}

export function dev() {
    watch('src/scss/**/*.scss', css); //Busca todas las carpetas dentro de scss y todos los archivos con la extension .scss 
                                    //y despues va la funcion que queremos que se ejecute
    watch('src/js/**/*.js', js); //Para que lea los cambios realizados en js
    watch('src/img/**/*.{png,jpg}', imagenes); //Para que procese las imagenes
}

export function hola(done) { //Con el export la funcion esta visible en el package.json
    console.log('Hola, ejemplo de usar gulp');

    done(); //Se le coloca este "done" para que finalice la tarea
}

export function js(done) {
    src('src/js/app.js')//Tomar el archivo
        .pipe(terser())
        .pipe(dest('dist/js')) //Llevarlo a esa direccion

    done();
}

export default series(crop, js, css, imagenes, dev) 
//el series toma las diferentes funciones que tengamos en el gulpfile, dev siempre debe ir  al final