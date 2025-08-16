INSERT INTO lugares (
  id,
  nombre,
  direccion,
  descripcion,
  created_at,
  ciudad,
  municipio,
  departamento,
  pais
)
VALUES (
  gen_random_uuid(), -- o usa UUID manual si prefieres
  'Casa Bambú',
  'Aldea Cerro Grande, 3 km antes de Valle de Ángeles, desvío Tres Rosas',
  'Alojamiento turístico rodeado de naturaleza',
  now(),
  'Valle de Ángeles',
  'Valle de Ángeles',
  'Francisco Morazán',
  'Honduras'
);

ALTER TABLE lugares
ADD COLUMN imagen TEXT,
ADD COLUMN sitio_web TEXT;

UPDATE lugares
SET 
  imagen = 'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//casabambu.webp',
  sitio_web = 'https://casabambuhn.com/'
WHERE nombre = 'Casa Bambú';


INSERT INTO lugares (
  id,
  nombre,
  direccion,
  descripcion,
  created_at,
  ciudad,
  municipio,
  departamento,
  pais,
  imagen,
  sitio_web
)
VALUES (
  gen_random_uuid(),
  'Giardini Del Castello',
  'Giardini Del Castello, El Hatillo',
  'Exclusivo centro de eventos ubicado en El Hatillo, ideal para celebraciones y bodas.',
  now(),
  'El Hatillo',
  'Distrito Central',
  'Francisco Morazán',
  'Honduras',
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//giardini.webp',
  'https://giardinidelcastello.com'  -- cámbialo si tienes otro sitio oficial
);


INSERT INTO lugares (
  id,
  nombre,
  direccion,
  descripcion,
  created_at,
  ciudad,
  municipio,
  departamento,
  pais,
  imagen,
  sitio_web
)
VALUES (
  gen_random_uuid(),
  'Hacienda El Trapiche',
  'Tegucigalpa',
  'Centro de eventos en Tegucigalpa rodeado de naturaleza y tradición',
  now(),
  'Tegucigalpa',
  'Distrito Central',
  'Francisco Morazán',
  'Honduras',
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares/haciendatrapiche.webp',
  'https://haciendaeltrapiche.com'  -- puedes ajustar esta URL si tienes otra real
);

INSERT INTO lugares (
  id,
  nombre,
  direccion,
  descripcion,
  created_at,
  ciudad,
  municipio,
  departamento,
  pais,
  imagen,
  sitio_web
)
VALUES (
  gen_random_uuid(),
  'Centro de Eventos Vista Hermosa',
  'Tegucigalpa',
  'Centro de eventos en Tegucigalpa',
  now(),
  'Tegucigalpa',
  'Distrito Central',
  'Francisco Morazán',
  'Honduras',
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//vistahermosa.webp',
  'https://www.facebook.com/Vistahermosahn'
);

INSERT INTO lugares (
  id,
  nombre,
  direccion,
  descripcion,
  created_at,
  ciudad,
  municipio,
  departamento,
  pais,
  imagen,
  sitio_web
)
VALUES (
  gen_random_uuid(),
  'Clast Garden',
  'Tegucigalpa',
  'Salón para eventos en Honduras',
  now(),
  'Tegucigalpa',
  'Distrito Central',
  'Francisco Morazán',
  'Honduras',
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//zamorano.webp',
  'https://www.instagram.com/clastgarden/'
);

-- Primero, generamos manualmente un UUID para usarlo también en la actualización del salón
-- Puedes cambiarlo si deseas usar otro
INSERT INTO lugares (
  id,
  nombre,
  direccion,
  descripcion,
  created_at,
  ciudad,
  municipio,
  departamento,
  pais,
  imagen,
  sitio_web
)
VALUES (
  gen_random_uuid(),
  'John Sloan Academy',
  'El Jicarito',
  'Lugar especializado en eventos sociales y corporativos de alto nivel',
  now(),
  'Jicarito',
  'El Paraíso',
  'El Paraíso',
  'Honduras',
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//JohnSloanAcademy.webp',
  'https://www.instagram.com/johnsloanacademy/'
);
