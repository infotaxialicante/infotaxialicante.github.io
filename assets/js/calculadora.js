// ===================================================================
// LISTA COMPLETA DE DESTINOS
// ===================================================================
const destinos = [
    { nombre: "Absudia", distancia: 94 },
    { nombre: "Agost", distancia: 18 },
    { nombre: "Agres", distancia: 76 },
    { nombre: "Aguas de Busot", distancia: 28 },
    { nombre: "Albatera", distancia: 44 },
    { nombre: "Alcalalí", distancia: 87 },
    { nombre: "Alcocer de Planes", distancia: 73 },
    { nombre: "Alcolecha", distancia: 71 },
    { nombre: "Alcoy", distancia: 60 },
    { nombre: "Alfafara", distancia: 80 },
    { nombre: "Alfaz del Pí", distancia: 53 },
    { nombre: "Algorfa", distancia: 49 },
    { nombre: "Algueña", distancia: 52 },
    { nombre: "Almoradí", distancia: 48 },
    { nombre: "Almudaina", distancia: 76 },
    { nombre: "Alqueria de Aznar", distancia: 68 },
    { nombre: "Altea", distancia: 57 },
    { nombre: "El Altet", distancia: 11 },
    { nombre: "Aspe", distancia: 28 },
    { nombre: "Balones", distancia: 86 },
    { nombre: "Bañeres", distancia: 63 },
    { nombre: "Benejama", distancia: 61 },
    { nombre: "Benasau", distancia: 70 },
    { nombre: "Benejuzar", distancia: 55 },
    { nombre: "Benferri", distancia: 53 },
    { nombre: "Beniarbeig", distancia: 91 },
    { nombre: "Beniardá", distancia: 70 },
    { nombre: "Beniarrés", distancia: 82 },
    { nombre: "Benichembla", distancia: 94 },
    { nombre: "Benidoleig", distancia: 94 },
    { nombre: "Benidorm", distancia: 50 },
    { nombre: "Benifallim", distancia: 62 },
    { nombre: "Benifato", distancia: 67 },
    { nombre: "Benijofar", distancia: 45 },
    { nombre: "Benilloba", distancia: 66 },
    { nombre: "Benillup", distancia: 75 },
    { nombre: "Benimantell", distancia: 65 },
    { nombre: "Benimarfull", distancia: 70 },
    { nombre: "Benimasot", distancia: 82 },
    { nombre: "Benimeli", distancia: 95 },
    { nombre: "Benisa", distancia: 76 },
    { nombre: "Benitachel", distancia: 83 },
    { nombre: "Bigastro", distancia: 64 },
    { nombre: "Biar", distancia: 50 },
    { nombre: "Bolulla", distancia: 66 },
    { nombre: "Busot", distancia: 27 },
    { nombre: "Callosa de Ensarriá", distancia: 61 },
    { nombre: "Callosa de Segura", distancia: 49 },
    { nombre: "Calpe", distancia: 67 },
    { nombre: "Campo de Mirra", distancia: 57 },
    { nombre: "Castalla", distancia: 36 },
    { nombre: "Castell de Castells", distancia: 94 },
    { nombre: "Catral", distancia: 45 },
    { nombre: "Concentaina", distancia: 65 },
    { nombre: "Confrides", distancia: 74 },
    { nombre: "Cox", distancia: 48 },
    { nombre: "Crevillente", distancia: 33 },
    { nombre: "Cuatretondeta", distancia: 78 },
    { nombre: "Daya Nueva", distancia: 44 },
    { nombre: "Daya Vieja", distancia: 42 },
    { nombre: "Denia", distancia: 95 },
    { nombre: "Dolores", distancia: 43 },
    { nombre: "Elche", distancia: 27 },
    { nombre: "Elche - Hosp. Vinolopo", distancia: 30 },
    { nombre: "Elda", distancia: 38 },
    { nombre: "Facheca", distancia: 84 },
    { nombre: "Famorca", distancia: 86 },
    { nombre: "Finestrat", distancia: 45 },
    { nombre: "Fontilles", distancia: 103 },
    { nombre: "Formentera de Segura", distancia: 45 },
    { nombre: "Gallanes", distancia: 79 },
    { nombre: "Gata de Gorgos", distancia: 85 },
    { nombre: "Gorga", distancia: 73 },
    { nombre: "Granja de Rocamora", distancia: 46 },
    { nombre: "Guadalest", distancia: 65 },
    { nombre: "Guardamar", distancia: 39 },
    { nombre: "Hondón de los Frailes", distancia: 45 },
    { nombre: "Hondón de las Nieves", distancia: 41 },
    { nombre: "Ibi", distancia: 43 },
    { nombre: "Jacarilla", distancia: 57 },
    { nombre: "Jalón", distancia: 84 },
    { nombre: "Jávea", distancia: 89 },
    { nombre: "Jijona", distancia: 30 },
    { nombre: "La Marina", distancia: 29 },
    { nombre: "La Marina (urbaniza.)", distancia: 36 },
    { nombre: "La Mata", distancia: 47 },
    { nombre: "Lliber", distancia: 83 },
    { nombre: "Lorcha", distancia: 91 },
    { nombre: "Millena", distancia: 72 },
    { nombre: "Miraflor", distancia: 95 },
    { nombre: "Monforte del Cid", distancia: 25 },
    { nombre: "Monovar", distancia: 41 },
    { nombre: "Los Montesinos", distancia: 50 },
    { nombre: "Moraíra", distancia: 85 },
    { nombre: "Murla", distancia: 91 },
    { nombre: "Muro del Alcoy", distancia: 69 },
    { nombre: "Novelda", distancia: 29 },
    { nombre: "La Nucía", distancia: 53 },
    { nombre: "La Romana", distancia: 41 },
    { nombre: "Ondara", distancia: 88 },
    { nombre: "Onil", distancia: 42 },
    { nombre: "Orba", distancia: 98 },
    { nombre: "Orcheta", distancia: 43 },
    { nombre: "Orihuela", distancia: 56 },
    { nombre: "Orihuela Costa", distancia: 62 },
    { nombre: "Parcent", distancia: 90 },
    { nombre: "Pedreguer", distancia: 90 },
    { nombre: "Pego", distancia: 105 },
    { nombre: "Penáguila", distancia: 67 },
    { nombre: "Petrer", distancia: 39 },
    { nombre: "Pilar de la Horadada", distancia: 68 },
    { nombre: "Pinoso", distancia: 60 },
    { nombre: "Planes", distancia: 76 },
    { nombre: "Polop", distancia: 56 },
    { nombre: "Puebla de Rocamora", distancia: 43 },
    { nombre: "Rafal", distancia: 53 },
    { nombre: "Rafol Alminia", distancia: 96 },
    { nombre: "Redován", distancia: 53 },
    { nombre: "Relleu", distancia: 42 },
    { nombre: "Rojales", distancia: 44 },
    { nombre: "Sagra", distancia: 97 },
    { nombre: "San Fulgencio", distancia: 40 },
    { nombre: "Salinas", distancia: 56 },
    { nombre: "San Miguel de Salinas", distancia: 61 },
    { nombre: "Sanet Negrales", distancia: 94 },
    { nombre: "Santa Pola", distancia: 20 },
    { nombre: "Sax", distancia: 47 },
    { nombre: "Sella", distancia: 50 },
    { nombre: "Senija", distancia: 78 },
    { nombre: "Setla y Miraflor", distancia: 95 },
    { nombre: "Tárbena", distancia: 73 },
    { nombre: "Teulada", distancia: 79 },
    { nombre: "Tibi", distancia: 29 },
    { nombre: "Tollos", distancia: 84 },
    { nombre: "Tormos", distancia: 100 },
    { nombre: "Torremanzanas", distancia: 48 },
    { nombre: "Torrevieja", distancia: 55 },
    { nombre: "Torrevieja (autopista)", distancia: 70 },
    { nombre: "Vall d'Alcalá", distancia: 87 },
    { nombre: "Vall d'Ebo", distancia: 97 },
    { nombre: "Vall de Gallinera", distancia: 96 },
    { nombre: "Vall de L'aguart", distancia: 99 },
    { nombre: "Vergel", distancia: 91 },
    { nombre: "Villajoyosa", distancia: 40 },
    { nombre: "Villamartín", distancia: 61 },
    { nombre: "Villena", distancia: 58 },
    { nombre: "Villena (cárcel)", distancia: 70 },
    { nombre: "Alcázares", distancia: 100 },
    { nombre: "Cabo Roig", distancia: 59 },
    { nombre: "Caravaca", distancia: 148 },
    { nombre: "Gandia", distancia: 115 },
    { nombre: "Lorca", distancia: 141 },
    { nombre: "Mazarrón", distancia: 139 },
    { nombre: "Santomera", distancia: 67 },
    { nombre: "Santiago de la Ribera", distancia: 79 },
    { nombre: "Jumilla", distancia: 90 },
    { nombre: "Albacete", distancia: 167 },
    { nombre: "Almeria", distancia: 290 },
    { nombre: "Ávila", distancia: 528 },
    { nombre: "Badajoz", distancia: 688 },
    { nombre: "Bilbao", distancia: 806 },
    { nombre: "Barcelona", distancia: 537 },
    { nombre: "Burgos", distancia: 655 },
    { nombre: "Cáceres", distancia: 653 },
    { nombre: "Cádiz", distancia: 637 },
    { nombre: "Cartagena", distancia: 108 },
    { nombre: "Cartagena (autopista)", distancia: 129 },
    { nombre: "Castellón", distancia: 248 },
    { nombre: "Ciudad Real", distancia: 391 },
    { nombre: "Córdoba", distancia: 513 },
    { nombre: "Coruña", distancia: 1024 },
    { nombre: "Cuenca", distancia: 308 },
    { nombre: "Gerona", distancia: 617 },
    { nombre: "Granada", distancia: 349 },
    { nombre: "Guadalajara", distancia: 459 },
    { nombre: "Huelva", distancia: 691 },
    { nombre: "Huesca", distancia: 561 },
    { nombre: "Jaén", distancia: 406 },
    { nombre: "León", distancia: 759 },
    { nombre: "Lérida", distancia: 486 },
    { nombre: "Logroño", distancia: 654 },
    { nombre: "Lugo", distancia: 927 },
    { nombre: "Madrid", distancia: 419 },
    { nombre: "Málaga", distancia: 494 },
    { nombre: "Murcia", distancia: 81 },
    { nombre: "Murcia - Aeropuerto", distancia: 105 },
    { nombre: "Orense", distancia: 923 },
    { nombre: "Oviedo", distancia: 881 },
    { nombre: "Palencia", distancia: 657 },
    { nombre: "Pontevedra", distancia: 1031 },
    { nombre: "Pamplona", distancia: 658 },
    { nombre: "Salamanca", distancia: 630 },
    { nombre: "San Sebastián", distancia: 745 },
    { nombre: "Santander", distancia: 863 },
    { nombre: "Segovia", distancia: 518 },
    { nombre: "Sevilla", distancia: 594 },
    { nombre: "Soria", distancia: 554 },
    { nombre: "Tarragona", distancia: 432 },
    { nombre: "Teruel", distancia: 319 },
    { nombre: "Toledo", distancia: 405 },
    { nombre: "Valencia - por Alcoy", distancia: 166 },
    { nombre: "Valencia - por Costa", distancia: 190 },
    { nombre: "Valencia - Aeropuerto", distancia: 173 },
    { nombre: "Valladolid", distancia: 634 },
    { nombre: "Vitoria", distancia: 741 },
    { nombre: "Zamora", distancia: 677 },
    { nombre: "Zaragoza", distancia: 484 },
    { nombre: "Lopagán", distancia: 73 },
    { nombre: "Oliva", distancia: 106 },
    { nombre: "San Pedro del Pinatar", distancia: 71 },
    { nombre: "San Javier", distancia: 78 },
    { nombre: "Yecla", distancia: 81 }
];

// ===================================================================
// CONFIGURACIÓN DE TARIFAS OFICIALES
// ===================================================================
const T3_INT_BAJADA = 2.20;
const T3_INT_KM = 1.46;
const T4_INT_BAJADA = 2.25;
const T4_INT_KM = 1.68;
const SUPLEMENTO_ESPECIAL = 3.00;
const MAXIMO_RECOGIDA = 7.35;

// Diccionario de textos según el idioma de la página
const isEnglish = document.documentElement.lang === 'en' || window.location.pathname.startsWith('/en/');

const i18n = {
    es: {
        destinoOk: (nombre, km) => `✅ Destino: ${nombre} (${km} km)`,
        coincidencias: (n) => `🔍 ${n} coincidencia(s) encontrada(s). Selecciona una opción.`,
        noEncontrado: '✏️ Destino no encontrado en la lista oficial. Introduce los km manualmente.',
        errorDistancia: '⚠️ Por favor, selecciona o introduce una distancia válida.',
        tarifa3: 'Tarifa 3 (diurna laborable)',
        tarifa4: 'Tarifa 4 (nocturna / festiva)',
        bajada: 'Bajada de bandera',
        bajadaRecogida: 'Bajada de bandera + recogida',
        distanciaLabel: 'Distancia',
        suplementoTexto: '➕ Suplemento especial (+3 €) aplicado',
        calculadaLog: '✅ Calculadora interurbana cargada correctamente (ES).'
    },
    en: {
        destinoOk: (nombre, km) => `✅ Destination: ${nombre} (${km} km)`,
        coincidencias: (n) => `🔍 ${n} match(es) found. Please select an option.`,
        noEncontrado: '✏️ Destination not found in the official list. Please enter km manually.',
        errorDistancia: '⚠️ Please select or enter a valid distance.',
        tarifa3: 'Rate 3 (daytime weekday)',
        tarifa4: 'Rate 4 (night / holiday)',
        bajada: 'Flag drop',
        bajadaRecogida: 'Flag drop + pickup',
        distanciaLabel: 'Distance',
        suplementoTexto: '➕ Special surcharge (+€3) applied',
        calculadaLog: '✅ Intercity calculator loaded successfully (EN).'
    }
};

const t = isEnglish ? i18n.en : i18n.es;

// ===================================================================
// CALENDARIO DE FESTIVOS
// ===================================================================
function comprobarFestivoOAsimilado(fecha) {
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();

    if (mes === 1 && dia === 1) return true;
    if (mes === 1 && dia === 6) return true;
    if (mes === 5 && dia === 1) return true;
    if (mes === 8 && dia === 15) return true;
    if (mes === 10 && dia === 12) return true;
    if (mes === 11 && dia === 1) return true;
    if (mes === 12 && dia === 8) return true;
    if (mes === 12 && dia === 25) return true;
    if (mes === 6 && (dia === 22 || dia === 23 || dia === 24)) return true;
    if (mes === 12 && (dia === 24 || dia === 31)) return true;
    if (mes === 3 && dia === 19) return true;
    if (mes === 4 && dia === 6) return true;
    if (mes === 4 && dia === 16) return true;
    if (mes === 6 && dia === 24) return true;
    if (mes === 10 && dia === 9) return true;
    if (mes === 4 && dia === 3) return true;
    return false;
}

function comprobarSuplementoEspecial(fecha) {
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    const hora = fecha.getHours();

    if (mes === 6) {
        if (dia === 21 && hora >= 21) return true;
        if (dia > 21 && dia < 25) return true;
        if (dia === 25 && hora < 8) return true;
    }
    if ((mes === 12 && (dia === 24 || dia === 31)) || (mes === 1 && dia === 5)) {
        if (hora >= 21 || hora < 7) return true;
    }
    if (mes === 2 && dia === 14 && hora >= 21) return true;
    if (mes === 2 && dia === 15 && hora < 8) return true;
    return false;
}

// ===================================================================
// INICIALIZACIÓN - EJECUTAR CUANDO EL DOM ESTÉ LISTO
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {

    const $ = (id) => document.getElementById(id);
    const timeModeRadios = document.querySelectorAll('input[name="timeMode"]');
    const customTimeContainer = $('customTimeContainer');
    const customDateTime = $('customDateTime');
    const isRemoteRequest = $('isRemoteRequest');
    const destinoInput = $('destinoInput');
    const mensajeDestino = $('mensajeDestino');
    const customKmContainer = $('customKmContainer');
    const distanceManual = $('distanceManual');
    const distanciaSeleccionada = $('distanciaSeleccionada');
    const calcularBtn = $('calcularBtn');
    const statusBox = $('statusBox');

    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function buscarDestino(nombre) {
        const norm = normalizarTexto(nombre);
        return destinos.find(d => normalizarTexto(d.nombre) === norm);
    }

    function buscarCoincidenciasParciales(texto) {
        const norm = normalizarTexto(texto);
        return destinos.filter(d => normalizarTexto(d.nombre).includes(norm));
    }

    const sugerenciasContainer = document.createElement('div');
    sugerenciasContainer.id = 'sugerenciasContainer';
    sugerenciasContainer.className = 'sugerencias-lista';
    sugerenciasContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-top: none;
        max-height: 250px;
        overflow-y: auto;
        z-index: 1000;
        border-radius: 0 0 0.5rem 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: none;
    `;

    const autocompleteContainer = destinoInput.parentNode;
    autocompleteContainer.style.position = 'relative';
    autocompleteContainer.appendChild(sugerenciasContainer);

    function mostrarSugerencias(sugerencias) {
        if (sugerencias.length === 0) {
            sugerenciasContainer.style.display = 'none';
            sugerenciasContainer.innerHTML = '';
            return;
        }
        
        sugerenciasContainer.innerHTML = '';
        const itemsToShow = sugerencias.slice(0, 8);
        
        itemsToShow.forEach(item => {
            const div = document.createElement('div');
            div.className = 'sugerencia-item';
            div.style.cssText = `
                padding: 0.75rem 1rem;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.15s;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 44px;
            `;
            
            div.innerHTML = `
                <span>${item.nombre}</span>
                <span style="color: #6c757d; font-size: 0.85rem;">${item.distancia} km</span>
            `;
            
            div.addEventListener('click', function(e) {
                e.stopPropagation();
                seleccionarDestino(item);
            });
            
            div.addEventListener('touchstart', function(e) {
                e.preventDefault();
                seleccionarDestino(item);
            }, { passive: false });
            
            sugerenciasContainer.appendChild(div);
        });
        
        sugerenciasContainer.style.display = 'block';
    }

    function ocultarSugerencias() {
        sugerenciasContainer.style.display = 'none';
        sugerenciasContainer.innerHTML = '';
    }

    function seleccionarDestino(destino) {
        destinoInput.value = destino.nombre;
        distanciaSeleccionada.value = destino.distancia;
        distanceManual.value = destino.distancia;
        customKmContainer.classList.add('campo-oculto');
        mensajeDestino.className = 'mensaje-ayuda mensaje-ok';
        mensajeDestino.textContent = t.destinoOk(destino.nombre, destino.distancia);
        ocultarSugerencias();
    }

    let timeoutId = null;

    destinoInput.addEventListener('input', function() {
        clearTimeout(timeoutId);
        const valor = this.value.trim();

        if (valor.length < 2) {
            mensajeDestino.textContent = '';
            customKmContainer.classList.add('campo-oculto');
            distanciaSeleccionada.value = '';
            ocultarSugerencias();
            return;
        }

        timeoutId = setTimeout(() => {
            const coincidenciaExacta = buscarDestino(valor);
            if (coincidenciaExacta) {
                seleccionarDestino(coincidenciaExacta);
                return;
            }

            const parciales = buscarCoincidenciasParciales(valor);

            if (parciales.length > 0) {
                mensajeDestino.className = 'mensaje-ayuda mensaje-info';
                mensajeDestino.textContent = t.coincidencias(parciales.length);
                customKmContainer.classList.add('campo-oculto');
                mostrarSugerencias(parciales);
            } else {
                mensajeDestino.className = 'mensaje-ayuda mensaje-error';
                mensajeDestino.textContent = t.noEncontrado;
                customKmContainer.classList.remove('campo-oculto');
                distanceManual.value = '';
                distanceManual.focus();
                distanciaSeleccionada.value = '';
                ocultarSugerencias();
            }
        }, 300);
    });

    document.addEventListener('click', function(e) {
        if (e.target !== destinoInput && !sugerenciasContainer.contains(e.target)) {
            ocultarSugerencias();
        }
    });

    timeModeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'custom') {
                customTimeContainer.classList.remove('campo-oculto');
                if (!customDateTime.value) {
                    const ahora = new Date();
                    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
                    customDateTime.value = ahora.toISOString().slice(0, 16);
                }
            } else {
                customTimeContainer.classList.add('campo-oculto');
            }
        });
    });

    function calcularTarifa() {
        ocultarResultado();
        mostrarStatus('');

        let fecha = new Date();
        const timeMode = document.querySelector('input[name="timeMode"]:checked').value;
        if (timeMode === 'custom') {
            const val = customDateTime.value;
            if (val) fecha = new Date(val);
        }

        let km = parseFloat(distanciaSeleccionada.value) || parseFloat(distanceManual.value) || 0;

        if (!km || km <= 0) {
            mostrarStatus(t.errorDistancia, 'error');
            return;
        }

        const esRemoto = isRemoteRequest.checked;
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const tiempoEnMinutos = hora * 60 + minutos;
        const diaSemana = fecha.getDay();
        const esFestivo = comprobarFestivoOAsimilado(fecha);
        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esNocturno = (tiempoEnMinutos >= 1260 || tiempoEnMinutos < 420);

        const esTarifa4 = esNocturno || esFestivo || esFinDeSemana;

        let bajadaBandera = esTarifa4 ? T4_INT_BAJADA : T3_INT_BAJADA;
        let precioKm = esTarifa4 ? T4_INT_KM : T3_INT_KM;

        let baseBajada = esRemoto ? MAXIMO_RECOGIDA : bajadaBandera;
        let total = baseBajada + (km * precioKm);

        const tieneSuplemento = comprobarSuplementoEspecial(fecha);
        if (tieneSuplemento) {
            total += SUPLEMENTO_ESPECIAL;
        }

        mostrarResultado(total);

        let tarifaTexto = esTarifa4 ? t.tarifa4 : t.tarifa3;
        let statusHTML = `<span class="etiqueta-tarifa">${tarifaTexto}</span><br>`;
        let textoBajada = esRemoto ? t.bajadaRecogida : t.bajada;
        statusHTML += `${textoBajada}: ${baseBajada.toFixed(2)} €<br>`;
        statusHTML += `${t.distanciaLabel}: ${km} km → ${(km * precioKm).toFixed(2)} €<br>`;
        if (tieneSuplemento) {
            statusHTML += `<span class="status-suplemento">${t.suplementoTexto}</span><br>`;
        }
        statusHTML += `<strong>💰 TOTAL: ${total.toFixed(2)} €</strong>`;

        statusBox.innerHTML = statusHTML;
        statusBox.classList.add('status-visible');
    }

    calcularBtn.addEventListener('click', calcularTarifa);

    (function setDefaultDateTime() {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        customDateTime.value = ahora.toISOString().slice(0, 16);
    })();

    function mostrarResultado(precio) {
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = `${parseFloat(precio).toFixed(2)} €`;
        resultadoDiv.classList.add('resultado-visible');
    }

    function ocultarResultado() {
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = '';
        resultadoDiv.classList.remove('resultado-visible');
    }

    function mostrarStatus(mensaje, tipo = 'info') {
        const statusBox = document.getElementById('statusBox');
        if (!mensaje) {
            statusBox.textContent = '';
            statusBox.className = '';
            statusBox.classList.remove('status-visible');
            return;
        }
        statusBox.textContent = mensaje;
        statusBox.className = `mensaje-${tipo}`;
        statusBox.classList.add('status-visible');
    }

    destinoInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            ocultarResultado();
            mostrarStatus('');
        }
    });

    distanceManual.addEventListener('input', function() {
        if (this.value.trim() === '') {
            ocultarResultado();
            mostrarStatus('');
        }
    });

    console.log(t.calculadaLog);
});