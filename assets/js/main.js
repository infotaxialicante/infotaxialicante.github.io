// ============================================================
// MENÚ HAMBURGUESA - Toggle y cierre automático
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  // Verificar que los elementos existen
  if (!menuToggle || !navMenu) {
    console.warn('Menú hamburguesa no encontrado');
    return;
  }
  console.log('✅ Menú hamburguesa inicializado'); // Para verificar que carga
  // ============================================================
  // 1. ABRIR/CERRAR MENÚ AL HACER CLIC EN LA HAMBURGUESA
  // ============================================================
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita que el click se propague
    this.classList.toggle('active'); // Animación (X)
    navMenu.classList.toggle('open'); // Mostrar/ocultar menú
  });
  
  // ============================================================
  // 2. CERRAR MENÚ AL HACER CLIC EN UN ENLACE
  // ============================================================
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });
  
  // ============================================================
  // 3. CERRAR MENÚ AL HACER CLIC FUERA DE ÉL
  // ============================================================
  document.addEventListener('click', function(e) {
    // Si el menú está abierto y el click NO es dentro del menú ni en la hamburguesa
    if (navMenu.classList.contains('open')) {
      const isClickInsideMenu = navMenu.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    }
  });
  
  // ============================================================
  // 4. OPCIONAL: CERRAR MENÚ AL REDIMENSIONAR LA VENTANA (desktop)
  // ============================================================
  // Si la ventana se agranda a tamaño desktop, cerramos el menú
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth >= 769) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    }, 250);
  });
});