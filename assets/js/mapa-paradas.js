document.addEventListener('DOMContentLoaded', () => {
  const paradas = window.PARADAS_DATA || [];
  const mapElement = document.getElementById('mapa-paradas');

  if (!mapElement || paradas.length === 0) return;

  // Centro: Alicante
  const CENTRO_INICIAL = [38.345392, -0.495378];
  const ZOOM_INICIAL = 13;

  const map = L.map('mapa-paradas').setView(CENTRO_INICIAL, ZOOM_INICIAL);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const markersGroup = L.layerGroup().addTo(map);
  let marcadoresActivos = [];
  let posUsuario = null;
  let usuarioMarker = null;

  // ============================================================
  // NUEVAS VARIABLES PARA BÚSQUEDA MEJORADA
  // ============================================================
  let busquedaExacta = null;
  let modoBusqueda = 'libre'; // 'libre' | 'exacta'
  let modoAutomaticoExacto = false;

  // ============================================================
  // FUNCIONES DE BÚSQUEDA INTELIGENTE
  // ============================================================

  // Lista de stopwords (palabras vacías que se ignoran)
  // AHORA: eliminamos 'plaza', 'avenida', 'calle', 'centro', 'comercial', 'vía'
  const STOPWORDS = [
    'parada', 'estación', 'de', 'la', 'el', 'los', 'las', 'y', 'en', 'por',
    'para', 'con', 'sin', 'sobre', 'entre', 'hasta', 'desde', 'del', 'al',
    'a', 'ante', 'bajo', 'cabe', 'contra', 'durante', 'mediante', 'según',
    'so', 'tras', 'vs', 
    'hospital', 'terminal', 'estacion'
  ];

  // Palabras genéricas con peso reducido (NUEVO)
  const PALABRAS_GENERICAS = ['centro', 'comercial', 'plaza', 'avenida', 'calle', 'paseo', 'ronda', 'glorieta', 'via'];

  // Normaliza texto: minúsculas, sin tildes, sin diacríticos
  function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/ü/g, 'u');
  }

  // NUEVA: Función de peso para palabras genéricas
  function obtenerPesoPalabra(palabra, campo) {
    if (PALABRAS_GENERICAS.includes(palabra)) {
      return campo === 'nombre' ? 1.5 : 0.5;
    }
    return 2;
  }

  // NUEVA: Función de búsqueda mejorada (reemplaza a procesarBusqueda)
  function buscarParadas(paradas, textoBusqueda, municipioSeleccionado, soloPmr, posUsuario, modo = 'libre') {
    const textoNormalizado = normalizarTexto(textoBusqueda.trim());
    const palabrasBusqueda = textoNormalizado.split(/\s+/).filter(p => p.length >= 2);

    // MODO EXACTO FORZADO (selección de sugerencia)
    if (modo === 'exacta' && busquedaExacta) {
      const parada = busquedaExacta;
      let dist = null;
      if (posUsuario) {
        dist = calcularDistancia(posUsuario.lat, posUsuario.lng, parada.lat, parada.lng);
      }
      return [{
        parada: parada,
        puntuacion: 999,
        dist: dist,
        tipoCoincidencia: 'exacta',
        esExacta: true,
        palabrasCoincidentes: palabrasBusqueda
      }];
    }

    // Filtrar por municipio y PMR
    let paradasFiltradas = paradas.filter(p => {
      const coincideMunicipio = municipioSeleccionado === 'todos' || p.municipio === municipioSeleccionado;
      const coincidePmr = !soloPmr || p.pmr === true;
      return coincideMunicipio && coincidePmr;
    });

    // Si no hay palabras de búsqueda, devolver todas
    if (palabrasBusqueda.length === 0) {
      return paradasFiltradas.map(p => {
        let dist = null;
        if (posUsuario) {
          dist = calcularDistancia(posUsuario.lat, posUsuario.lng, p.lat, p.lng);
        }
        return { parada: p, puntuacion: 1, dist: dist, esExacta: false };
      });
    }

    let resultados = [];
    let coincidenciasExactas = [];

    paradasFiltradas.forEach(parada => {
      const nombreNormalizado = normalizarTexto(parada.nombre);
      const zonaNormalizada = normalizarTexto(parada.zona || '');
      const direccionNormalizada = normalizarTexto(parada.direccion);
      const keywordsNormalizadas = (parada.keywords || []).map(k => normalizarTexto(k));

      const camposBusqueda = [
        { texto: nombreNormalizado, peso: 4, nombre: 'nombre' },
        { texto: zonaNormalizada, peso: 3, nombre: 'zona' },
        { texto: direccionNormalizada, peso: 2, nombre: 'direccion' },
        ...keywordsNormalizadas.map(k => ({ texto: k, peso: 2, nombre: 'keyword' }))
      ];

      let puntuacion = 0;
      let coincideTexto = false;
      let tipoCoincidencia = 'ninguna';
      let esExacta = false;

      // ============================================
      // 1. DETECTAR COINCIDENCIA EXACTA (AJUSTADO)
      // ============================================
      
      // EXACTA: El nombre ES exactamente la búsqueda (ej: "pau 5" === "Pau 5")
      if (nombreNormalizado === textoNormalizado) {
        puntuacion = 100;
        coincideTexto = true;
        esExacta = true;
        tipoCoincidencia = 'exacta_nombre';
        coincidenciasExactas.push(parada);
      } 
      // EXACTA PARCIAL: Solo si la búsqueda tiene 2+ palabras y coincide como frase
      // Esto evita que "pau" active exacta para "Pau 5"
      else if (palabrasBusqueda.length >= 2 && 
               (nombreNormalizado.includes(' ' + textoNormalizado + ' ') ||
                nombreNormalizado.startsWith(textoNormalizado + ' ') ||
                nombreNormalizado.endsWith(' ' + textoNormalizado))) {
        // Solo considerar exacta si la búsqueda es un nombre propio conocido
        // o tiene 3+ palabras (ej: "plaza del mar")
        const esNombreCompuesto = esNombrePropio(textoNormalizado);
        if (esNombreCompuesto || palabrasBusqueda.length >= 3) {
          puntuacion = 90;
          coincideTexto = true;
          esExacta = true;
          tipoCoincidencia = 'exacta_frase';
          coincidenciasExactas.push(parada);
        } else {
          // Si no es nombre compuesto, tratarlo como coincidencia parcial
          puntuacion += 40;
          coincideTexto = true;
          tipoCoincidencia = 'frase_parcial';
        }
      }
      // EXACTA en otros campos (zona, keywords) - SOLO si es exactamente igual
      // y la búsqueda tiene 2+ palabras
      else if (palabrasBusqueda.length >= 2 &&
               (zonaNormalizada === textoNormalizado || 
                keywordsNormalizadas.some(k => k === textoNormalizado))) {
        puntuacion = 80;
        coincideTexto = true;
        esExacta = true;
        tipoCoincidencia = 'exacta_otro_campo';
        coincidenciasExactas.push(parada);
      }

      // ============================================
      // 2. BUSCAR COINCIDENCIAS PARCIALES
      // ============================================
      if (!esExacta) {
        if (palabrasBusqueda.length > 1) {
          const fraseCompleta = textoNormalizado;
          camposBusqueda.forEach(campo => {
            if (campo.texto.includes(fraseCompleta)) {
              puntuacion += campo.peso * 2.5;
              coincideTexto = true;
              if (tipoCoincidencia === 'ninguna') tipoCoincidencia = 'frase_parcial';
            }
          });
        }

        if (!coincideTexto || palabrasBusqueda.length <= 2) {
          palabrasBusqueda.forEach(palabra => {
            if (palabra.length < 3) {
              camposBusqueda.forEach(campo => {
                const regex = new RegExp('\\b' + palabra + '\\b');
                if (regex.test(campo.texto)) {
                  const pesoPalabra = obtenerPesoPalabra(palabra, campo.nombre);
                  puntuacion += campo.peso * pesoPalabra;
                  coincideTexto = true;
                  if (tipoCoincidencia === 'ninguna') tipoCoincidencia = 'palabra_corta';
                }
              });
            } else {
              camposBusqueda.forEach(campo => {
                const regex = new RegExp('\\b' + palabra + '\\b');
                if (regex.test(campo.texto)) {
                  const pesoPalabra = obtenerPesoPalabra(palabra, campo.nombre);
                  puntuacion += campo.peso * pesoPalabra;
                  coincideTexto = true;
                  if (tipoCoincidencia === 'ninguna') tipoCoincidencia = 'palabra_exacta';
                } else if (campo.texto.includes(palabra)) {
                  const pesoPalabra = obtenerPesoPalabra(palabra, campo.nombre);
                  puntuacion += campo.peso * (pesoPalabra * 0.15);
                  coincideTexto = true;
                  if (tipoCoincidencia === 'ninguna') tipoCoincidencia = 'palabra_parcial';
                }
              });
            }
          });
        }
      }

      if (!coincideTexto) return;

      let dist = null;
      if (posUsuario) {
        dist = calcularDistancia(posUsuario.lat, posUsuario.lng, parada.lat, parada.lng);
        if (dist < 0.3) puntuacion += 8;
        else if (dist < 0.5) puntuacion += 5;
        else if (dist < 1) puntuacion += 3;
        else if (dist < 2) puntuacion += 1;
      }

      resultados.push({
        parada: parada,
        puntuacion: puntuacion,
        dist: dist,
        tipoCoincidencia: tipoCoincidencia,
        esExacta: esExacta,
        palabrasCoincidentes: palabrasBusqueda.filter(p => {
          const camposTexto = camposBusqueda.map(c => c.texto);
          return camposTexto.some(campo => new RegExp('\\b' + p + '\\b').test(campo));
        })
      });
    });

    // DECISIÓN: Si hay exactas, mostrar SOLO exactas
    if (coincidenciasExactas.length > 0) {
      const resultadosExactos = resultados.filter(r => r.esExacta);
      resultadosExactos.sort((a, b) => b.puntuacion - a.puntuacion);
      modoAutomaticoExacto = true;
      console.log('⭐ Coincidencia exacta encontrada, mostrando solo:', resultadosExactos.map(r => r.parada.nombre));
      return resultadosExactos;
    }

    modoAutomaticoExacto = false;
    resultados.sort((a, b) => b.puntuacion - a.puntuacion);
    if (resultados.length > 50) resultados = resultados.slice(0, 50);
    console.log('🔍 No hay coincidencia exacta, mostrando todas las coincidencias');
    return resultados;
  }

  // Función auxiliar para detectar nombres propios compuestos
  function esNombrePropio(texto) {
    const indicadores = ['gran', 'sant', 'santa', 'san', 'puerta', 'portal', 'muelle', 'rambla', 'paseo', 'ronda', 'glorieta', 'travesía'];
    return indicadores.some(ind => texto.toLowerCase().includes(ind));
  }

  // ============================================================
  // FUNCIÓN CENTRAR EN MUNICIPIO
  // ============================================================
  function centrarEnMunicipio(municipio) {
    const centros = {
      'alicante': [38.345392, -0.495378],
      'el-campello': [38.427729, -0.395572],
      'san-vicente': [38.386957, -0.509508],
      'san-juan': [38.389206, -0.435577],
      'muchamiel': [38.414734, -0.444396]
    };
    
    if (municipio === 'todos') {
      map.setView([38.37, -0.48], 12);
    } else if (centros[municipio]) {
      map.setView(centros[municipio], 14);
    }
  }

  // ============================================================
  // CÁLCULO DE DISTANCIA
  // ============================================================
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ============================================================
  // POPUP (ACTUALIZADO CON BADGE DE EXACTA)
  // ============================================================
  function crearContenidoPopup(parada, distanciaKm = null, esExacta = false) {
    const badgePmr = parada.pmr 
      ? '<span style="color: #2e7d32; font-weight: 600;">♿ Adaptada PMR</span>' 
      : '<span style="color: #666;">Estándar</span>';

    const badgeExacta = esExacta
      ? '<span style="background: #ff6b35; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: 600; margin-left: 6px;">⭐ Exacta</span>'
      : '';

    const notaHtml = parada.nota 
      ? `<p style="margin: 4px 0; color: #d9534f; font-size: 0.85em;">${parada.nota}</p>` 
      : '';

    const distHtml = distanciaKm !== null 
      ? `<p style="margin: 2px 0; font-weight: bold; color: #007bff; font-size: 0.85em;">📍 A ${(distanciaKm * 1000).toFixed(0)} m de ti</p>` 
      : '';

    return `
      <div style="min-width: 200px; font-family: system-ui, sans-serif;">
        <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
          <h3 style="margin: 0 0 4px 0; font-size: 1.05em; font-weight: 700;">${parada.nombre}</h3>
          ${badgeExacta}
        </div>
        <p style="margin: 0 0 4px 0; color: #555; font-size: 0.85em;">${parada.direccion}</p>
        ${distHtml}
        <p style="margin: 2px 0 6px 0; font-size: 0.8em;">${badgePmr}</p>
        ${notaHtml}
        <div style="margin-top: 8px; display: flex; gap: 6px;">
          <a href="tel:${parada.telefono}" style="padding: 5px 8px; background: #2e7d32; color: white; text-decoration: none; border-radius: 4px; font-size: 0.8em; text-align: center; flex: 1;">📞 Pedir</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${parada.lat},${parada.lng}" target="_blank" rel="noopener" style="padding: 5px 8px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 0.8em; text-align: center; flex: 1;">🗺️ Ir</a>
        </div>
      </div>
    `;
  }

  // ============================================================
  // INDICADORES (NUEVO)
  // ============================================================
  function mostrarIndicadorExactaAutomatico(resultados) {
    const indicadorAnterior = document.getElementById('indicador-exacta-automatico');
    if (indicadorAnterior) indicadorAnterior.remove();

    const nombres = resultados.map(r => r.parada.nombre).join(', ');

    const indicador = document.createElement('div');
    indicador.id = 'indicador-exacta-automatico';
    indicador.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff6b35;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: system-ui, sans-serif;
      animation: slideUp 0.3s ease;
      font-size: 0.9em;
    `;
    indicador.innerHTML = `
      <span>⭐ Coincidencia exacta: <strong>${nombres}</strong></span>
      <button onclick="window.mostrarTodasLasCoincidencias()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85em;
      ">Ver todas</button>
    `;
    document.body.appendChild(indicador);
  }

  function mostrarIndicadorSeleccion(parada) {
    const indicadorAnterior = document.getElementById('indicador-seleccion');
    if (indicadorAnterior) indicadorAnterior.remove();

    const indicador = document.createElement('div');
    indicador.id = 'indicador-seleccion';
    indicador.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #2e7d32;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: system-ui, sans-serif;
      animation: slideUp 0.3s ease;
    `;
    indicador.innerHTML = `
      <span>📍 <strong>${parada.nombre}</strong> seleccionada</span>
      <button onclick="window.resetearBusqueda()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
      ">✕ Cerrar</button>
    `;
    document.body.appendChild(indicador);
  }

  // ============================================================
  // FUNCIONES GLOBALES PARA SUGERENCIAS (NUEVO)
  // ============================================================
  window.seleccionarSugerencia = function(parada) {
    busquedaExacta = parada;
    modoBusqueda = 'exacta';
    const inputTexto = document.getElementById('filtro-texto');
    inputTexto.value = parada.nombre;
    ocultarSugerencias();
    renderizarMarcadores();
    mostrarIndicadorSeleccion(parada);
  };

  window.mostrarTodasLasCoincidencias = function() {
    modoBusqueda = 'libre';
    busquedaExacta = null;
    const indicador = document.getElementById('indicador-exacta-automatico');
    if (indicador) indicador.remove();
    renderizarMarcadores();
  };

  window.resetearBusqueda = function() {
    busquedaExacta = null;
    modoBusqueda = 'libre';
    const inputTexto = document.getElementById('filtro-texto');
    inputTexto.value = '';
    const indicador = document.getElementById('indicador-seleccion');
    if (indicador) indicador.remove();
    const indicadorExacta = document.getElementById('indicador-exacta-automatico');
    if (indicadorExacta) indicadorExacta.remove();
    renderizarMarcadores();
  };

  // ============================================================
  // SUGERENCIAS EN TIEMPO REAL (NUEVO)
  // ============================================================
  function mostrarSugerencias(texto) {
    const contenedor = document.getElementById('sugerencias-container');
    if (!contenedor) return;

    if (texto.trim() === '') {
      contenedor.style.display = 'none';
      return;
    }

    const textoNormalizado = normalizarTexto(texto);
    const palabras = textoNormalizado.split(/\s+/).filter(p => p.length >= 2);
    if (palabras.length === 0) {
      contenedor.style.display = 'none';
      return;
    }

    const resultados = [];
    paradas.forEach(parada => {
      const nombreNormalizado = normalizarTexto(parada.nombre);
      const zonaNormalizada = normalizarTexto(parada.zona || '');
      const keywordsNormalizadas = (parada.keywords || []).map(k => normalizarTexto(k));

      const todasCoinciden = palabras.every(p =>
        nombreNormalizado.includes(p) ||
        zonaNormalizada.includes(p) ||
        keywordsNormalizadas.some(k => k.includes(p))
      );

      if (todasCoinciden) {
        resultados.push(parada);
      }
    });

    if (resultados.length === 0) {
      contenedor.style.display = 'none';
      return;
    }

    const sugerenciasHTML = resultados.slice(0, 5).map(parada => `
      <div class="sugerencia-item" onclick="window.seleccionarSugerencia(${JSON.stringify(parada).replace(/"/g, '&quot;')})">
        <div class="sugerencia-nombre">${parada.nombre}</div>
        <div class="sugerencia-direccion">${parada.direccion}</div>
        ${parada.pmr ? '<span class="sugerencia-pmr">♿</span>' : ''}
      </div>
    `).join('');

    contenedor.innerHTML = sugerenciasHTML;
    contenedor.style.display = 'block';
  }

  function ocultarSugerencias() {
    const contenedor = document.getElementById('sugerencias-container');
    if (contenedor) contenedor.style.display = 'none';
  }

  // ============================================================
  // RENDERIZAR MARCADORES (ACTUALIZADO)
  // ============================================================
  function renderizarMarcadores() {
    markersGroup.clearLayers();
    marcadoresActivos = [];

    const municipioSeleccionado = document.getElementById('filtro-municipio').value;
    const soloPmr = document.getElementById('filtro-pmr').checked;
    const textoBusqueda = document.getElementById('filtro-texto').value;

    // Usar la nueva función de búsqueda
    const resultados = buscarParadas(
      paradas,
      textoBusqueda,
      municipioSeleccionado,
      soloPmr,
      posUsuario,
      modoBusqueda
    );

    const resultadosEncontrados = resultados.length;

    // Renderizar marcadores
    resultados.forEach(({ parada, dist, esExacta }) => {
      const marker = L.marker([parada.lat, parada.lng])
        .bindPopup(crearContenidoPopup(parada, dist, esExacta));
      
      markersGroup.addLayer(marker);
      marcadoresActivos.push({ parada, marker, dist, esExacta });
    });

    // Mostrar indicador de exacta automática
    const hayExacta = resultados.some(r => r.esExacta);
    if (hayExacta && modoBusqueda !== 'exacta' && textoBusqueda.trim() !== '') {
      mostrarIndicadorExactaAutomatico(resultados);
    } else {
      const indicador = document.getElementById('indicador-exacta-automatico');
      if (indicador) indicador.remove();
    }

    // Mostrar u ocultar mensaje de "sin resultados"
    const mensaje = document.getElementById('mensaje-sin-resultados');
    if (mensaje) {
      if (textoBusqueda.trim() !== '' && resultadosEncontrados === 0) {
        mensaje.style.display = 'block';
      } else {
        mensaje.style.display = 'none';
      }
    }

    // Centrar el mapa según los resultados de búsqueda
    if (textoBusqueda.trim() !== '' && marcadoresActivos.length === 1) {
      const parada = marcadoresActivos[0].parada;
      map.setView([parada.lat, parada.lng], 16);
      setTimeout(() => {
        if (marcadoresActivos.length === 1) {
          marcadoresActivos[0].marker.openPopup();
        }
      }, 300);
    } else if (textoBusqueda.trim() !== '' && marcadoresActivos.length > 1) {
      const bounds = L.latLngBounds(
        marcadoresActivos.map(item => [item.parada.lat, item.parada.lng])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }

  // ============================================================
  // FILTRADO REACTIVO (ACTUALIZADO)
  // ============================================================
  document.getElementById('filtro-municipio').addEventListener('change', function() {
    centrarEnMunicipio(this.value);
    renderizarMarcadores();
  });

  document.getElementById('filtro-pmr').addEventListener('change', renderizarMarcadores);
  
  // NUEVO: Event listener con sugerencias
  document.getElementById('filtro-texto').addEventListener('input', function(e) {
    const texto = this.value;
    if (modoBusqueda === 'exacta') {
      modoBusqueda = 'libre';
      busquedaExacta = null;
      const indicador = document.getElementById('indicador-seleccion');
      if (indicador) indicador.remove();
    }
    mostrarSugerencias(texto);
    renderizarMarcadores();
  });

  // NUEVO: Enter para buscar
  document.getElementById('filtro-texto').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      ocultarSugerencias();
      renderizarMarcadores();
    }
  });

  // NUEVO: Clic fuera para ocultar sugerencias
  document.addEventListener('click', function(e) {
    const contenedor = document.getElementById('sugerencias-container');
    const input = document.getElementById('filtro-texto');
    if (contenedor && input) {
      if (!contenedor.contains(e.target) && e.target !== input) {
        ocultarSugerencias();
      }
    }
  });

  // ============================================================
  // GEOLOCALIZACIÓN (SIN CAMBIOS)
  // ============================================================
  document.getElementById('btn-mi-ubicacion').addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada por tu navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        posUsuario = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        if (usuarioMarker) map.removeLayer(usuarioMarker);

        usuarioMarker = L.circleMarker([posUsuario.lat, posUsuario.lng], {
          radius: 7,
          fillColor: '#007bff',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map).bindPopup('<b>Tu ubicación</b>');

        document.getElementById('btn-parada-cercana').style.display = 'inline-block';
        
        renderizarMarcadores();
        encontrarParadaMasCercana(true);
      },
      () => alert('No se pudo obtener la ubicación. Comprueba los permisos de tu navegador.'),
      { enableHighAccuracy: true }
    );
  });

  function encontrarParadaMasCercana(abrirPopup = false) {
    if (!posUsuario || marcadoresActivos.length === 0) return;

    let masCercana = marcadoresActivos[0];

    marcadoresActivos.forEach(item => {
      if (item.dist < masCercana.dist) {
        masCercana = item;
      }
    });

    map.setView([masCercana.parada.lat, masCercana.parada.lng], 16);
    if (abrirPopup) {
      masCercana.marker.openPopup();
    }
  }

  document.getElementById('btn-parada-cercana').addEventListener('click', () => {
    encontrarParadaMasCercana(true);
  });

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================
  renderizarMarcadores();
});