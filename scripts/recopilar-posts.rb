#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"
require "date"
require "time"

# Rutas del proyecto calculadas desde la ubicación del script.
ROOT = File.expand_path("..", __dir__)
POSTS_DIR = File.join(ROOT, "_posts")
OUTPUT_FILE = File.join(ROOT, "_drafts", "recopilacion-posts.txt")

FIELDS = %w[
  title
  date
  last_modified_at
  author
  categories
  tags
  image
  image_alt
  image_caption
  description
  permalink
  search
  lang
  ref
].freeze

LANGUAGES = {
  "es" => "ARTÍCULOS EN ESPAÑOL",
  "en" => "ARTÍCULOS EN INGLÉS"
}.freeze

def read_front_matter(path)
  File.open(path, "r:UTF-8") do |file|
    return [nil, "No empieza con ---"] unless file.gets&.strip == "---"

    yaml_lines = []
    raw_dates = {}
    closed = false

    file.each_line do |line|
      if line.strip == "---"
        closed = true
        break
      end

      # Conserva el texto original de las fechas antes de interpretar el YAML.
      if (match = line.match(/^(date|last_modified_at):\s*(.*?)\s*$/))
        raw_dates[match[1]] = match[2]
      end

      yaml_lines << line
    end

    return [nil, "No se encuentra el cierre del front matter"] unless closed

    data = YAML.safe_load(
      yaml_lines.join,
      permitted_classes: [Date, Time],
      permitted_symbols: [],
      aliases: false
    )

    return [nil, "El front matter no contiene campos YAML"] unless data.is_a?(Hash)

    # Guarda las fechas originales para mostrarlas sin convertirlas a UTC.
    raw_dates.each do |field, value|
      data["__raw_#{field}"] = value
    end

    [data, nil]
  end
rescue Psych::Exception, ArgumentError, EncodingError => e
  [nil, "Error al interpretar YAML: #{e.message.lines.first.strip}"]
rescue SystemCallError => e
  [nil, "Error al leer el archivo: #{e.message}"]
end

def missing_value?(value)
  value.nil? || value == "" || value == []
end

def format_value(value)
  return "—" if missing_value?(value)

  case value
  when Array
    value.map { |item| format_value(item) }.join(" | ")
  when Hash
    value.map { |key, item| "#{key}: #{format_value(item)}" }.join(" | ")
  when Time
    value.iso8601
  when DateTime
    value.iso8601
  when Date
    value.iso8601
  else
    value.to_s.gsub(/\s+/, " ").strip
  end
end

def date_sort_key(value)
  return ["", ""] if missing_value?(value)

  parsed = case value
           when Time, DateTime
             value
           when Date
             value
           else
             begin
               Time.parse(value.to_s)
             rescue ArgumentError
               nil
             end
           end

  # La fecha se normaliza para ordenar cronológicamente.
  # El texto original se conserva en el informe.
  if parsed
    [1, parsed.to_time.utc.iso8601]
  else
    [0, value.to_s]
  end
rescue StandardError
  [0, value.to_s]
end

def main
  unless Dir.exist?(POSTS_DIR)
    warn "Error: no existe la carpeta _posts/."
    exit 1
  end

  unless Dir.exist?(File.dirname(OUTPUT_FILE))
    warn "Error: no existe la carpeta _drafts/."
    exit 1
  end

  # Únicamente busca artículos dentro de _posts/.
  extensions = %w[.md .markdown .html .textile]

  paths = Dir.glob(File.join(POSTS_DIR, "**", "*"))
             .select { |path| File.file?(path) && extensions.include?(File.extname(path).downcase) }
             .sort

  posts = []
  errors = []

  paths.each do |path|
    data, error = read_front_matter(path)

    if error
      errors << [path.delete_prefix("#{ROOT}/"), error]
      next
    end

    posts << {
      path: path.delete_prefix("#{ROOT}/"),
      data: data,
      lang: data["lang"].to_s
    }
  end

  report = []
  report << "INVENTARIO EDITORIAL — INFOTAXI ALICANTE"
  report << "=" * 48
  report << "Archivos de artículos encontrados: #{paths.length}"
  report << "Artículos interpretados correctamente: #{posts.length}"
  report << "Artículos con errores de lectura: #{errors.length}"
  report << "Artículos en español: #{posts.count { |post| post[:lang] == 'es' }}"
  report << "Artículos en inglés: #{posts.count { |post| post[:lang] == 'en' }}"
  report << "Artículos con idioma ausente o inesperado: #{posts.count { |post| !%w[es en].include?(post[:lang]) }}"
  report << ""

  report << "RESUMEN DE CAMPOS AUSENTES"
  report << "=" * 48

  posts_with_missing = 0

  posts.each do |post|
    absent = FIELDS.select { |field| missing_value?(post[:data][field]) }
    next if absent.empty?

    posts_with_missing += 1
    report << post[:path]
    report << "  Sin datos: #{absent.join(', ')}"
  end

  report << "Todos los artículos tienen los campos definidos." if posts_with_missing.zero?
  report << "Artículos con uno o más campos ausentes: #{posts_with_missing}"
  report << ""

  LANGUAGES.each do |lang, heading|
    report << heading
    report << "=" * heading.length

    selected = posts
      .select { |post| post[:lang] == lang }
      .sort_by { |post| [date_sort_key(post[:data]["date"]), post[:path]] }
      .reverse

    if selected.empty?
      report << "No hay artículos."
      report << ""
      next
    end

    selected.each do |post|
      report << ""
      report << "-" * 48
      report << "Archivo: #{post[:path]}"

      FIELDS.each do |field|
        value = post[:data]["__raw_#{field}"] || post[:data][field]
        report << "#{field}: #{format_value(value)}"
      end
    end

    report << ""
  end

  report << "ARTÍCULOS CON IDIOMA AUSENTE O INESPERADO"
  report << "=" * 48

  unknown = posts.reject { |post| %w[es en].include?(post[:lang]) }

  if unknown.empty?
    report << "Ninguno."
  else
    unknown.each do |post|
      report << ""
      report << "Archivo: #{post[:path]}"
      report << "title: #{format_value(post[:data]['title'])}"
      report << "lang: #{format_value(post[:data]['lang'])}"
    end
  end

  report << ""
  report << "ERRORES DE LECTURA"
  report << "=" * 48

  if errors.empty?
    report << "Ninguno."
  else
    errors.each do |path, message|
      report << "#{path}: #{message}"
    end
  end

  report << ""
  report << "Fin del informe."

  # ÚNICA operación de escritura: el informe especificado.
  File.write(OUTPUT_FILE, report.join("\n") + "\n", encoding: "UTF-8")

  puts "Informe generado: _drafts/recopilacion-posts.txt"
  puts "Artículos interpretados: #{posts.length}"
  puts "Errores de lectura: #{errors.length}"
rescue SystemCallError => e
  warn "No se pudo generar el informe: #{e.message}"
  exit 1
end

main if $PROGRAM_NAME == __FILE__