# Scripts de InfoTaxi Alicante

Scripts auxiliares utilizados para generar y mantener determinados elementos del proyecto InfoTaxi Alicante.

## Uso

Todos los scripts deben ejecutarse desde la **raíz del proyecto**.

```bash
./scripts/generar-paginacion.rb
./scripts/generar-tags.rb
./scripts/listar_proyecto.sh
```

Si algún script no tiene permisos de ejecución, pueden concederse con:

```bash
chmod +x scripts/nombre-del-script
```

Los scripts utilizan rutas relativas a la raíz del proyecto. Por este motivo, no deben ejecutarse desde la carpeta `scripts/`.

---

## `generar-paginacion.rb`

Genera las páginas de paginación necesarias para el blog y para el contenido actualizado de InfoTaxi Alicante, tanto en español como en inglés.

### Funcionamiento

El script:

* busca todos los posts de `_posts`;
* identifica el idioma mediante el campo `lang` del front matter;
* cuenta todos los posts de cada idioma para la paginación del blog;
* considera como contenido actualizado únicamente los posts que tienen definido `last_modified_at`;
* utiliza **6 artículos por página**;
* genera las páginas necesarias para:

  * `/blog/`
  * `/actualizados/`
  * `/en/blog/`
  * `/en/updated/`;
* utiliza `/pagina2/`, `/pagina3/`, etc. para las páginas posteriores.

### Número de páginas

El cálculo utiliza una página adicional cuando el número de artículos es múltiplo de 6.

```text
0 artículos       → 0 páginas
1–5 artículos     → 1 página
6–11 artículos    → 2 páginas
12–17 artículos   → 3 páginas
18–23 artículos   → 4 páginas
```

La primera página utiliza la ruta principal:

```text
/blog/
/actualizados/
/en/blog/
/en/updated/
```

Las siguientes utilizan:

```text
/blog/pagina2/
/blog/pagina3/
/blog/pagina4/
...
```

y sus correspondientes rutas en inglés y para contenido actualizado.

### Seguridad del proceso

Este script **solo crea archivos nuevos**.

Nunca:

* elimina archivos;
* modifica archivos existentes;
* sobrescribe archivos;
* renombra archivos.

Si una página ya existe, la detecta y la deja intacta.

Por tanto, puede ejecutarse de nuevo después de publicar nuevos artículos sin modificar las páginas que ya existen.

### Ejecución

Desde la raíz del proyecto:

```bash
./scripts/generar-paginacion.rb
```

---

## `generar-tags.rb`

Busca las etiquetas utilizadas en los posts y crea las páginas de etiquetas que todavía no existen.

### Funcionamiento

El script:

* busca los posts de `_posts`;
* lee el front matter de cada post;
* identifica el idioma mediante el campo `lang`;
* procesa únicamente los idiomas configurados: español (`es`) e inglés (`en`);
* obtiene las etiquetas del campo `tags`;
* genera un `slug` para cada etiqueta;
* elimina acentos y caracteres no válidos del slug;
* evita crear duplicados de una misma etiqueta;
* crea las páginas de etiquetas que todavía no existen.

Las páginas se generan en:

```text
etiquetas/
```

para español, y:

```text
en/tags/
```

para inglés.

Por ejemplo:

```text
etiquetas/taxi/index.html
etiquetas/alicante/index.html
en/tags/taxi/index.html
```

### Seguridad del proceso

Si una página de etiqueta ya existe, el script la detecta y **no la modifica ni sobrescribe**.

Solo crea las páginas que todavía no existen.

### Ejecución

Desde la raíz del proyecto:

```bash
./scripts/generar-tags.rb
```

---

## `listar_proyecto.sh`

Genera el archivo `estructura_proyecto.txt` en la raíz del proyecto con la estructura de archivos y directorios de InfoTaxi Alicante.

### Funcionamiento

El script:

* genera un encabezado con el nombre del proyecto;
* incluye la fecha y hora de generación;
* muestra la estructura de archivos y directorios;
* muestra un máximo de **3 niveles de profundidad**;
* excluye archivos y directorios ocultos;
* excluye `_site`;
* excluye `node_modules`;
* ordena el resultado alfabéticamente.

Los archivos y directorios ocultos también incluyen `.git`, por lo que el repositorio Git queda excluido del listado.

El archivo generado es:

```text
estructura_proyecto.txt
```

y se crea en la raíz del proyecto.

### Ejecución

Desde la raíz del proyecto:

```bash
./scripts/listar_proyecto.sh
```

---

## Ubicación de los scripts

Los scripts se mantienen agrupados en la carpeta `scripts/`:

```text
scripts/
├── README.md
├── generar-paginacion.rb
├── generar-tags.rb
└── listar_proyecto.sh
```

Todos ellos deben ejecutarse desde la raíz del proyecto, por ejemplo:

```bash
./scripts/generar-paginacion.rb
./scripts/generar-tags.rb
./scripts/listar_proyecto.sh
```
