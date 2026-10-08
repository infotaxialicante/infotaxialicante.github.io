document.addEventListener('DOMContentLoaded', function () {

  const input = document.getElementById('busqueda-blog');
  const resultadosContainer = document.getElementById('resultados-busqueda-blog');
  const mensajeSinResultados = document.getElementById('mensaje-sin-resultados-blog');

  if (!input || !resultadosContainer) return;

  const idioma = document.documentElement.lang || 'es';

  fetch('/search.json')
    .then(response => response.json())
    .then(data => {

      const indice = data.filter(item => item.lang === idioma);

      const fuse = new Fuse(indice, {
        keys: ['search'],
        includeScore: true,
        threshold: 0.2,
        ignoreLocation: true
      });

      input.addEventListener('input', function () {

        const texto = this.value.trim();

        resultadosContainer.innerHTML = '';
        resultadosContainer.style.display = 'none';

        if (mensajeSinResultados) {
          mensajeSinResultados.style.display = 'none';
        }

        if (texto.length < 2) return;

        const resultados = fuse.search(texto);

        if (resultados.length === 0) {

          if (mensajeSinResultados) {
            mensajeSinResultados.style.display = 'block';
          }

          return;
        }

        resultados.forEach(resultado => {

          const enlace = document.createElement('a');

          enlace.href = resultado.item.permalink;
          enlace.textContent = resultado.item.title;
          enlace.className = 'sugerencia-busqueda-blog';

          resultadosContainer.appendChild(enlace);

        });

        resultadosContainer.style.display = 'block';

      });

      input.addEventListener('keydown', function (e) {

        if (e.key === 'Escape') {
          resultadosContainer.style.display = 'none';
        }

      });

      document.addEventListener('click', function (e) {

        if (
          !resultadosContainer.contains(e.target) &&
          e.target !== input
        ) {
          resultadosContainer.style.display = 'none';
        }

      });

    })
    .catch(error => {
      console.error('Error al cargar el índice de búsqueda:', error);
    });

});