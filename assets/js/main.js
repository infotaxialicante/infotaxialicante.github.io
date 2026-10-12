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

//===================================
// FUNCIONALIDAD BOTÓN BACK-TO-TOP
//===================================

const backToTop = document.getElementById('backToTop');

if (backToTop) {
  const scrollThreshold = 400;

  function toggleBackToTop() {
    if (window.scrollY > scrollThreshold) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Comprobar el estado inicial
  toggleBackToTop();
}

// ============================================================
// TABLAS RESPONSIVE - Desplazamiento horizontal y formato
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.post-content table').forEach(function(table) {

    // 1. Mantener unidos los importes, porcentajes y sus símbolos
    function fixEuroSpacing(table) {
      const walker = document.createTreeWalker(
        table,
        NodeFilter.SHOW_TEXT
      );

      const textNodes = [];
      let node;

      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach(function(textNode) {
        textNode.textContent = textNode.textContent.replace(
          /(\d[\d.,]*)(?:\s|\u00a0)+([€%])/g,
          '$1\u00a0$2'
        );
      });
    }

    fixEuroSpacing(table);

    // 2. Envolver cada tabla para permitir desplazamiento horizontal
    // sin desplazar el resto de la página
    if (table.parentElement.classList.contains('table-responsive')) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';

    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
});