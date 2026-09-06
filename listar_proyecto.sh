#!/bin/bash

# Nombre del archivo de salida
OUTPUT="estructura_proyecto.txt"

echo "=== ESTRUCTURA DEL PROYECTO: INFOTAXIALICANTE ===" > "$OUTPUT"
echo "Generado el: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "--- ÁRBOL DE DIRECTORIOS (Excluyendo _site, .git y node_modules) ---" >> "$OUTPUT"
find . -maxdepth 3 \
  -not -path '*/.*' \
  -not -path './_site*' \
  -not -path './node_modules*' \
  | sort >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "¡Listo! Se ha generado el archivo '$OUTPUT' en la raíz de tu proyecto."
