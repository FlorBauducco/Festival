const { src, dest, watch, parallel} = require("gulp");  //requier -> es una forma de extrar el ''gulp'' de el package.json. "src" -> sirve para identificar el paquete . "dest" -> sirve para guardarlo.

// dependecias de css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');  
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// dependencias de imagenes
const cache = require('gulp-cache');
const imagemin =require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// dependencias de JavaScript
const terser = require('gulp-terser-js');

function css(done) {
    //1. Identificar el arciho de SASS

    // src('src/scss/app.scss')

    //2. Compilarlo -> Gulp tiene una API llamada 'pipe' ->una accion que se realiza despues de otra, puede haber multiples 'pipe()' y se van ejecutando en cadena, no todos a la vez, una vez que finalice uno comienza otro.

    // src('src/scss/app.scss').pipe(sass())

    // Almacenarlo en el disco duro -> con este ultimo pipe, le indicamos donde alamcenar las ejecuciones.

    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe( plumber() )
        .pipe( sass() )
        .pipe( postcss([autoprefixer(), cssnano() ] ) )
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') );

    done(); // Callback que avisa a Gulp que llegamos al final de la ejecucion
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))

    done();
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')  // como va a buscar mas de 1 formato, va entre {}
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done();
}


function versionAvif(done) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')  // como va a buscar mas de 1 formato, va entre {}
        .pipe(avif(opciones))
        .pipe(dest('build/img'))

    done();
}

function javaScript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javaScript);

    done();
}

exports.css = css;
exports.javaScript = javaScript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javaScript, dev);




