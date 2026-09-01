// ============================================================
// MENÚ HAMBURGUESA - Toggle, accesibilidad y cierre automático
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!menuToggle || !navMenu) {
    return;
  }

  // Función auxiliar para sincronizar el estado
  function setMenuState(isOpen) {
    menuToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  // 1. Abrir/Cerrar al hacer clic en la hamburguesa
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = !navMenu.classList.contains('open');
    setMenuState(isOpen);
  });
  
  // 2. Cerrar al hacer clic en un enlace del menú
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      setMenuState(false);
    });
  });
  
  // 3. Cerrar al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('open')) {
      const isClickInsideMenu = navMenu.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        setMenuState(false);
      }
    }
  });
  
  // 4. Cerrar al pasar a vista desktop
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth >= 769 && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    }, 250);
  });
});