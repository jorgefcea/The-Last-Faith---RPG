class Jugador {
    constructor() {
        this.nombre = "";
        this.puntos_salud = 20;
        this.puntos_ataque = 3;
        this.dinero = 2;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(value) {
        this.nombre = value;
    }

    getPuntosSalud() {
        return this.puntos_salud;
    }

    setPuntosSalud(value) {
        this.puntos_salud = value;
    }

    getPuntosAtaque() {
        return this.puntos_ataque;
    }

    setPuntosAtaque(value) {
        this.puntos_ataque = value;
    }

    getDinero() {
        return this.dinero;
    }

    setDinero(value) {
        this.dinero = value;
    }

    // Métodos para cargar y guardar datos del jugador desde localStorage
    cargarDesdeLocalStorage() {
        this.nombre = localStorage.getItem("nombreUsuario") || "";
        this.puntos_salud = parseInt(localStorage.getItem("puntosSalud")) || 20;
        this.puntos_ataque = parseInt(localStorage.getItem("puntosAtaque")) || 3;
        this.dinero = parseInt(localStorage.getItem("dinero")) || 2;
    }

    guardarEnLocalStorage() {
        localStorage.setItem("nombreUsuario", this.nombre);
        localStorage.setItem("puntosSalud", this.puntos_salud);
        localStorage.setItem("puntosAtaque", this.puntos_ataque);
        localStorage.setItem("dinero", this.dinero);
    }
}

class Enemigo {
    constructor(nombre) {
        this.nombre = nombre;
        this.puntos_salud = 20;
        this.puntos_ataque = 0;
        this.dinero = 7;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(value) {
        this.nombre = value;
    }

    getPuntosSalud() {
        return this.puntos_salud;
    }

    setPuntosSalud(value) {
        this.puntos_salud = value;
    }

    getPuntosAtaque() {
        return this.puntos_ataque;
    }

    setPuntosAtaque(value) {
        this.puntos_ataque = value;
    }

    getDinero() {
        return this.dinero;
    }

    setDinero(value) {
        this.dinero = value;
    }

    calcularFuerzaEnemigo() {
        this.puntos_ataque = Math.floor(Math.random() * 5) + 1;
    }

    // Métodos para cargar y guardar datos del enemigo en localStorage
    cargarDesdeLocalStorage() {
        this.puntos_salud = parseInt(localStorage.getItem(`enemigo_${this.nombre}_puntosSalud`)) || 20;
        this.puntos_ataque = parseInt(localStorage.getItem(`enemigo_${this.nombre}_puntosAtaque`)) || 0;
        this.dinero = parseInt(localStorage.getItem(`enemigo_${this.nombre}_dinero`)) || 7;
    }

    guardarEnLocalStorage() {
        localStorage.setItem(`enemigo_${this.nombre}_puntosSalud`, this.puntos_salud);
        localStorage.setItem(`enemigo_${this.nombre}_puntosAtaque`, this.puntos_ataque);
        localStorage.setItem(`enemigo_${this.nombre}_dinero`, this.dinero);
    }
}

var nombreUsuario = localStorage.getItem("nombreUsuario");
const jugador = new Jugador();
const nombresEnemigos = ["\"El viejo Wymond\"", "\"Nyxaroth, el espectro sobrenatural\"", "\"Sir Patryk Laddak\"", 
    "\"Annabella y Caterina\"", "\"Medeya, la Voz Cósmica\""];
const enemigosVivos = nombresEnemigos.map(nombre => {
    const enemigo = new Enemigo(nombre);
    enemigo.cargarDesdeLocalStorage();
    return enemigo;
});
const tienda = [
    { nombre: "ESPADA", puntosAtaque: 3, precio: 15 },
    { nombre: "ARCO", puntosAtaque: 2, precio: 10 },
    { nombre: "POCIÓN DE CURACIÓN", puntosSalud: 3, precio: 8 }
  ];

function actualizarEstadisticasEnInterfaz() {
    jugador.cargarDesdeLocalStorage(); // Cargar datos del jugador antes de actualizar la interfaz
    const estadisticasElement = document.getElementById('estadisticas');
    estadisticasElement.innerHTML = `<p>◻️ Nombre: ${nombreUsuario}</p>
                                    <p>◻️ Puntos de Salud: ${jugador.getPuntosSalud()}</p>
                                    <p>◻️ Puntos de Ataque: ${jugador.getPuntosAtaque()}</p>
                                    <p>◻️ Dinero: ${jugador.getDinero()}</p>`;
    jugador.guardarEnLocalStorage(); // Guardar datos del jugador después de actualizar la interfaz
}

actualizarEstadisticasEnInterfaz();

function lucharConEnemigo() {
    const botonLuchar = document.getElementById('luchar');
    const botonAtrasArena = document.getElementById('atrasArena');
    const arenaDiv = document.getElementById('arena');

    arenaDiv.innerHTML = '';

    if (enemigosVivos.length === 0) {
        arenaDiv.innerHTML += '¡Has derrotado a todos los enemigos! Has ganado el juego. <br><br>En breves, serás redirigido al inicio del juego.';
        botonLuchar.disabled = true;
        botonAtrasArena.disabled = true;
        reiniciarJuego();
        return;
    }

    const enemigoIndex = Math.floor(Math.random() * enemigosVivos.length);
    const enemigo = enemigosVivos[enemigoIndex];

    arenaDiv.innerHTML += `¡Te encuentras en una batalla contra ${enemigo.getNombre()}!<br>`;
    enemigo.calcularFuerzaEnemigo();

    arenaDiv.innerHTML += `Fuerza del enemigo: ${enemigo.getPuntosAtaque()}<br>`;

    const diferenciaAtaque = jugador.getPuntosAtaque() - enemigo.getPuntosAtaque();

    if (diferenciaAtaque > 0) {
        if (enemigo.getDinero() > 0) {
            const oroPerdido = Math.min(enemigo.getDinero(), diferenciaAtaque);
            arenaDiv.innerHTML += `${enemigo.getNombre()} perdió ${oroPerdido} de oro.<br>`;
            enemigo.setDinero(enemigo.getDinero() - oroPerdido);

            const oroGanado = oroPerdido;
            arenaDiv.innerHTML += `¡Ganaste la batalla y ganaste ${oroGanado} de oro!<br>`;
            jugador.setDinero(jugador.getDinero() + oroGanado);
        } else {
            arenaDiv.innerHTML += `${enemigo.getNombre()} no tiene oro para perder.<br>`;
        }

        enemigo.setPuntosSalud(enemigo.getPuntosSalud() - diferenciaAtaque);
        arenaDiv.innerHTML += `${enemigo.getNombre()} perdió ${diferenciaAtaque} puntos de salud.<br>`;

        if (enemigo.getPuntosSalud() <= 0) {
            arenaDiv.innerHTML += `${enemigo.getNombre()} ha sido derrotado. Está muerto.<br>`;
            enemigosVivos.splice(enemigoIndex, 1);
        }
    } else if (diferenciaAtaque < 0) {
        const puntosDanio = -diferenciaAtaque;
        jugador.setPuntosSalud(jugador.getPuntosSalud() - puntosDanio);

        arenaDiv.innerHTML += `Perdiste la batalla y perdiste ${puntosDanio} puntos de salud.<br>`;
        arenaDiv.innerHTML += `${enemigo.getNombre()} te ha infligido ${puntosDanio} puntos de daño.<br>`;

        if (jugador.getPuntosSalud() <= 0) {
            arenaDiv.innerHTML = '';
            arenaDiv.innerHTML += '¡Tu vida ha llegado a 0! Has perdido el juego. <br><br>En breves, serás redirigido al inicio del juego.<br>';
            botonLuchar.disabled = true;
            botonAtrasArena.disabled = true;
            jugador.setPuntosSalud(0);
            reiniciarJuego();
            return;
        }
    } else {
        arenaDiv.innerHTML += '¡Es un empate! Ninguno gana ni pierde oro.<br>';
    }

    arenaDiv.innerHTML += `${enemigo.getNombre()} tiene ${enemigo.getDinero()} de oro y ${enemigo.getPuntosSalud()} puntos de vida restantes.<br>`;
    enemigo.guardarEnLocalStorage(); // Guardar datos del enemigo después de la batalla
    jugador.guardarEnLocalStorage(); // Guardar datos del jugador después de la batalla
}

lucharConEnemigo();

function reiniciarJuego() {
    // Restablecer estadísticas del jugador a valores iniciales
    jugador.setPuntosSalud(20);
    jugador.setPuntosAtaque(3);
    jugador.setDinero(2);

    // Restablecer estadísticas de los enemigos a valores iniciales
    for (const nombreEnemigo of nombresEnemigos) {
        const enemigo = new Enemigo(nombreEnemigo);
        enemigo.setPuntosSalud(20);
        enemigo.setPuntosAtaque(0);
        enemigo.setDinero(7);
        enemigosVivos.push(enemigo);
    }

    // Eliminar datos del localStorage
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("puntosSalud");
    localStorage.removeItem("puntosAtaque");
    localStorage.removeItem("dinero");

    // Resetear los datos de los enemigos
    for (const enemigo of enemigosVivos) {
        localStorage.removeItem(`enemigo_${enemigo.getNombre()}_puntosSalud`);
        localStorage.removeItem(`enemigo_${enemigo.getNombre()}_puntosAtaque`);
        localStorage.removeItem(`enemigo_${enemigo.getNombre()}_dinero`);
    }

    // Redirigir al usuario a la página de inicio con un timeout de 3 segundos
    setTimeout(function () {
        window.location.href = "../index.html";
    }, 3000);
}
  
function comprar() {
    const opcionCompraInput = document.getElementById('opcionCompra');
    const opcionCompra = parseInt(opcionCompraInput.value);
  
    // Verifica si la opción de compra es válida
    if (isNaN(opcionCompra) || opcionCompra < 1 || opcionCompra > tienda.length) {
      alert('Ingrese una opción válida de la tienda.');
      return;
    }
  
    const objetoComprado = tienda[opcionCompra - 1];
  
    // Verifica si el jugador tiene suficiente dinero para comprar el objeto
    if (jugador.getDinero() >= objetoComprado.precio) {
      // Realiza la compra
      jugador.setDinero(jugador.getDinero() - objetoComprado.precio);
  
      // Actualiza las estadísticas del jugador según el objeto comprado
      if (objetoComprado.puntosAtaque) {
        jugador.setPuntosAtaque(jugador.getPuntosAtaque() + objetoComprado.puntosAtaque);
      } else if (objetoComprado.puntosSalud) {
        jugador.setPuntosSalud(jugador.getPuntosSalud() + objetoComprado.puntosSalud);
      }
  
      jugador.guardarEnLocalStorage();
  
      alert(`¡Has comprado ${objetoComprado.nombre} por ${objetoComprado.precio} de oro!`);
  
      actualizarEstadisticasEnInterfaz();
    } else {
      alert('No tienes suficiente oro para comprar este objeto.');
    }
}
  