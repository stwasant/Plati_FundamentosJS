const verde = document.getElementById('verde');
const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const btnEmpezar = document.getElementById('btnEmpezar');

class Juego {
  constructor() {
    this.inicializar();
    this.generarSecuencia();
    setTimeout(() => {
      this.siguienteNivel();
    }, 500);
  }
  inicializar() {
    // Se esconde el boton
    // El toogle lo que hace es que si se encuentra el atributo hide, lo quita,
    // si no lo encuentra lo agrega
    btnEmpezar.classList.toggle('hide');
    // Se define el maximo de niveles
    this.nivelMaximo = 5;
    // Contador de nivel
    this.contadorDeNivel = 1;
    // Siempre se comenzara a revisar por el color que se encuentre en la posicion 0 del array
    this.arrayPosValidaIni = 0;
    // Se definen los colores en un objeto
    this.colores = {
      // celeste : celeste, como tiene los mismos nombres JS
      // lo interpreta automaticamente de que se trata del Scope Global
      // En caso de usar nombres distintos, colorCeleste : celest
      celeste,
      verde,
      violeta,
      naranja,
    };
    // Con esto nos evitamos de colocarlo por cada color.
    // Ya queda vinculado de esta forma al this del constructor
    this.elegirColor = this.elegirColor.bind(this);
  }

  // Generar de forma aleatoria la secuencia en un array
  generarSecuencia() {
    // Se crea el array segun el nivel, con el fill(se inicializa en 0)
    // con el map se modifica los valores del array
    // Y se obtiene un numero aleatorio entre el 0 y 3
    this.secuencia = new Array(this.contadorDeNivel).fill(0).map((n) => Math.floor(Math.random() * 4));
    console.log(this.secuencia);
  }

  //   Metodo que se encargara de activar
  //   la iluminacion de los colores
  siguienteNivel() {
    this.iluminarSecuencia();

    // Agregamos metodo que activa el evento Click sobre los colores
    this.agregarEventoClick();
  }

  obteneterColor(numero) {
    switch (numero) {
      case 0:
        return 'celeste';
      case 1:
        return 'verde';
      case 2:
        return 'violeta';
      case 3:
        return 'naranja';
    }
  }
  iluminarSecuencia() {
    // se arma un curso que se encargara de
    // de iluminar los colores segun el nivel
    // es decir, si el nivel 1, entonces solo se
    // recorrera una sola vez y solo encedera un color, si es nivel 2
    // seran 2 colores los que se encenderan.
    for (let index = 0; index < this.contadorDeNivel; index++) {
      // Se le pasa al metodo el valor del index(nivel)
      // para que vaya recuperando a que color corresponde
      // en la posicion del array de colores de secuencia
      const color = this.obteneterColor(this.secuencia[index]);
      // Ahora llamamos metodo que se encargara de setear la propieda
      // al color que corresponda
      setTimeout(() => {
        this.iluminarColor(color);
      }, 1000 * index);
    }
  }

  iluminarColor(color) {
    this.colores[color].classList.add('light');
    setTimeout(() => {
      this.apagarColor(color);
    }, 350);
  }
  apagarColor(color) {
    this.colores[color].classList.remove('light');
  }

  agregarEventoClick() {
    // Agregando el bind(this) es para no perder la referencia del this del constructor
    // var _this = this
    this.colores.celeste.addEventListener('click', this.elegirColor);
    this.colores.violeta.addEventListener('click', this.elegirColor);
    this.colores.naranja.addEventListener('click', this.elegirColor);
    this.colores.verde.addEventListener('click', this.elegirColor);
  }

  eliminarEventoClick() {
    // Agregando el bind(this) es para no perder la referencia del this del constructor
    // var _this = this
    this.colores.celeste.removeEventListener('click', this.elegirColor);
    this.colores.violeta.removeEventListener('click', this.elegirColor);
    this.colores.naranja.removeEventListener('click', this.elegirColor);
    this.colores.verde.removeEventListener('click', this.elegirColor);
  }

  perdioElJuego() {
    this.eliminarEventoClick();
    swal('Platzi', 'Lo lamentamos perdió Juego :/', 'error').then(() => {
      this.inicializar();

    });
    console.log('Vuelva a iniciar');
  }

  ganoElJuego() {
    this.eliminarEventoClick();
    swal('Platzi', 'Felicitaciones ganaste el Juego', 'success').then(() => {
      this.inicializar();

    });
  }
  elegirColor(ev) {
    //console.log(ev);
    //console.log(this);
    //console.log(this.secuencia[1]);

    // Aqui obtenemos el color eligio el usuario
    // el target.dataset.color lo que hace es traer el valor
    // que se encuentra en el data del xml, para este caso
    // existe div que tiene data-color="violeta", si fuese data-hola="hola"
    // entonces seria target.dataset.hola
    const nombreColorEvBtnClick = ev.target.dataset.color;
    console.log(`Color evento click ${nombreColorEvBtnClick}`);
    // En vez de crear otro metodo que traide de string el id, la logica
    // del juego es que siempre validaremos que el usuario acierte los colores
    // segun el orden presentado, por lo que ese orden ya lo tenemos asi que lo que
    // haremos es obtener el nombre de la secuencia y compararlo con el presionado
    // por el jugador y si es igual, aunmentar de nivel y resetear
    const colorNombreSecuencia = this.obteneterColor(this.secuencia[this.arrayPosValidaIni]);
    console.log(`Color segun nivel en el array ${colorNombreSecuencia}`);

    // Validamos si el color presionado es igual al primer color de la secuencia
    if (colorNombreSecuencia === nombreColorEvBtnClick) {
      console.log('Color OK');

      console.log('contadorDeNivel ' + this.contadorDeNivel);
      console.log('arrayPosValidaIni ' + this.arrayPosValidaIni);
      console.log('nivelMaximo ' + this.nivelMaximo);

      if (this.arrayPosValidaIni === this.contadorDeNivel - 1) {
        // Gano el juego
        if (this.contadorDeNivel === this.nivelMaximo) {
          console.log('Ganó el Juego');
          this.ganoElJuego();
        } else {
          this.contadorDeNivel += 1;
          this.arrayPosValidaIni = 0;
          this.generarSecuencia();
          this.siguienteNivel();
          console.log(`Siguiente nivel ${this.contadorDeNivel}`);
        }
      } else {
        // Se incrementa la posicion del array para conocer cual fue el color generado
        // aleatoriamente y contra que se validara si el usuario presiona el mismo color
        this.arrayPosValidaIni += 1;
      }
    } else {
      console.log('Color NOK');
      this.perdioElJuego();
    }
  }
}

function empezarJuego() {
  var juego = new Juego();
}
