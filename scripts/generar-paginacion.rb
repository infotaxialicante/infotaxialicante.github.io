#!/usr/bin/env ruby

require "yaml"
require "date"
require "fileutils"

# ============================================================
# Configuración
# ============================================================

POSTS_PER_PAGE = 6

PAGINATION_CONFIG = {
  "es" => {
    "blog" => "blog",
    "updated" => "actualizados"
  },
  "en" => {
    "blog" => "en/blog",
    "updated" => "en/updated"
  }
}

# Contadores de artículos
post_counts = {
  "es" => {
    "blog" => 0,
    "updated" => 0
  },
  "en" => {
    "blog" => 0,
    "updated" => 0
  }
}

# ============================================================
# Buscar todos los posts
# ============================================================

Dir.glob("_posts/*.{md,markdown}").each do |file|

  content = File.read(file, encoding: "UTF-8")

  # Extraer front matter
  next unless content.start_with?("---")

  parts = content.split(/^---\s*$\n?/, 3)
  next unless parts.length >= 3

  begin
    front_matter = YAML.safe_load(
      parts[1],
      permitted_classes: [Date, Time],
      aliases: true
    )
  rescue => e
    puts "⚠️  Error leyendo #{file}: #{e.message}"
    next
  end

  next unless front_matter.is_a?(Hash)

  lang = front_matter["lang"].to_s.strip

  # Solo procesamos idiomas configurados
  next unless PAGINATION_CONFIG.key?(lang)

  # Todo post cuenta para el blog de su idioma
  post_counts[lang]["blog"] += 1

  # Solo cuentan como actualizados los posts
  # que tienen last_modified_at
  if front_matter.key?("last_modified_at") &&
     !front_matter["last_modified_at"].nil? &&
     !front_matter["last_modified_at"].to_s.strip.empty?

    post_counts[lang]["updated"] += 1
  end

end

# ============================================================
# Calcular páginas necesarias
#
# 0  artículos → 0 páginas
# 1–5           → 1 página
# 6             → 2 páginas
# 7–11          → 2 páginas
# 12            → 3 páginas
# 18            → 4 páginas
# etc.
#
# En los múltiplos de 6 se prepara también la página siguiente.
# ============================================================

def pages_needed(count)
  return 0 if count == 0

  (count / POSTS_PER_PAGE) + 1
end

# ============================================================
# Crear las páginas que falten
#
# IMPORTANTE:
# Este script SOLO CREA.
#
# Nunca:
# - borra
# - modifica
# - sobrescribe
# - renombra
# ============================================================

created = 0
existing = 0

PAGINATION_CONFIG.each do |lang, sections|

  sections.each do |section, base_path|

    count = post_counts[lang][section]
    pages = pages_needed(count)

    puts
    puts "#{lang.upcase} — #{section}"
    puts "  Artículos: #{count}"
    puts "  Páginas necesarias: #{pages}"

    # Si no hay artículos, no se crea absolutamente nada
    next if pages == 0

    (1..pages).each do |page_number|

      # Primera página: /blog/
      # Siguientes: /blog/pagina2/, /blog/pagina3/, etc.
      if page_number == 1
        directory = base_path
      else
        directory = File.join(
          base_path,
          "pagina#{page_number}"
        )
      end

      file_path = File.join(directory, "index.html")

      # Si existe, NO TOCAR
      if File.exist?(file_path)
        puts "  ✓ Existe: #{file_path}"
        existing += 1
        next
      end

      # Solo aquí se crea algo
      FileUtils.mkdir_p(directory)

      content = <<~YAML
        ---
        layout: archive
        lang: #{lang}
        pagination_section: #{section}
        pagination_page: #{page_number}
        pagination_offset: #{(page_number - 1) * POSTS_PER_PAGE}
        ---
      YAML

      File.write(
        file_path,
        content,
        encoding: "UTF-8"
      )

      puts "  ＋ Creada: #{file_path}"
      created += 1
    end
  end
end

# ============================================================
# Resumen
# ============================================================

puts
puts "----------------------------------------"
puts "Páginas existentes: #{existing}"
puts "Páginas creadas:    #{created}"
puts "----------------------------------------"
puts "Solo se han creado archivos nuevos."
puts "No se ha eliminado ni modificado ningún archivo."
puts "----------------------------------------"