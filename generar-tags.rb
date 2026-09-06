#!/usr/bin/env ruby

require "yaml"

# Configuración de idiomas y rutas
TAG_CONFIG = {
  "es" => "etiquetas",
  "en" => "en/tags"
}

tags_found = {
  "es" => {},
  "en" => {}
}

# Buscar todos los posts
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
  tags = front_matter["tags"]

  # Solo procesamos idiomas configurados
  next unless TAG_CONFIG.key?(lang)
  next unless tags.is_a?(Array)

  tags.each do |tag|
    tag_name = tag.to_s.strip
    next if tag_name.empty?

    slug = tag_name.downcase
                    .strip
                    .gsub(/[áàäâ]/, "a")
                    .gsub(/[éèëê]/, "e")
                    .gsub(/[íìïî]/, "i")
                    .gsub(/[óòöô]/, "o")
                    .gsub(/[úùüû]/, "u")
                    .gsub(/ñ/, "n")
                    .gsub(/[^a-z0-9\s-]/, "")
                    .gsub(/\s+/, "-")
                    .gsub(/-+/, "-")

    next if slug.empty?

    tags_found[lang][slug] ||= tag_name
  end
end

created = 0
existing = 0

# Crear las páginas que falten
tags_found.each do |lang, tags|

  base_path = TAG_CONFIG[lang]

  tags.each do |slug, tag_name|

    directory = File.join(base_path, slug)
    file_path = File.join(directory, "index.html")

    if File.exist?(file_path)
      puts "✓ Existe: #{file_path}"
      existing += 1
      next
    end

    FileUtils.mkdir_p(directory)

    content = <<~YAML
      ---
      layout: tag
      title: "#{tag_name.gsub('"', '\"')}"
      tag_name: "#{tag_name.gsub('"', '\"')}"
      lang: #{lang}
      show_in_nav: false
      ---
    YAML

    File.write(file_path, content, encoding: "UTF-8")

    puts "＋ Creada: #{file_path}"
    created += 1
  end
end

puts
puts "----------------------------------------"
puts "Etiquetas existentes: #{existing}"
puts "Etiquetas creadas:    #{created}"
puts "----------------------------------------"