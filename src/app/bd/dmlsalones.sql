-- Lugares emblemáticos de Honduras
INSERT INTO lugares (nombre, direccion, descripcion, ciudad, municipio, departamento, pais) VALUES
('Ruinas de Copán', 'Copán Ruinas', 'Sitio arqueológico maya Patrimonio de la Humanidad, famoso por sus estelas y jeroglíficos', 'Copán Ruinas', 'Copán Ruinas', 'Copán', 'Honduras'),

('Catedral de Tegucigalpa', 'Plaza Morazán, Centro Histórico', 'Catedral Metropolitana de estilo colonial, símbolo religioso de la capital', 'Tegucigalpa', 'Distrito Central', 'Francisco Morazán', 'Honduras'),

('Fortaleza de San Fernando de Omoa', 'Puerto de Omoa', 'Fortaleza colonial española del siglo XVIII, importante sitio histórico', 'Omoa', 'Omoa', 'Cortés', 'Honduras'),

('Parque Nacional Pico Bonito', 'La Ceiba', 'Área protegida con gran biodiversidad, ideal para ecoturismo y aventura', 'La Ceiba', 'La Ceiba', 'Atlántida', 'Honduras'),

('Islas de la Bahía - Roatán', 'West Bay Beach', 'Destino turístico caribeño famoso por sus arrecifes de coral y buceo', 'Coxen Hole', 'Roatán', 'Islas de la Bahía', 'Honduras'),

('Parque Central de San Pedro Sula', 'Centro de San Pedro Sula', 'Plaza principal de la ciudad industrial, punto de encuentro social', 'San Pedro Sula', 'San Pedro Sula', 'Cortés', 'Honduras'),

('Lago de Yojoa', 'Entre Comayagua y Cortés', 'El lago natural más grande de Honduras, ideal para pesca y observación de aves', 'Santa Cruz de Yojoa', 'Santa Cruz de Yojoa', 'Comayagua', 'Honduras'),

('Mercado Los Dolores', 'Barrio Los Dolores', 'Mercado tradicional con artesanías, comida típica y productos locales', 'Tegucigalpa', 'Distrito Central', 'Francisco Morazán', 'Honduras'),

('Jardín Botánico Lancetilla', 'Tela', 'Uno de los jardines botánicos tropicales más grandes del mundo', 'Tela', 'Tela', 'Atlántida', 'Honduras'),

('Comayagua Centro Histórico', 'Centro de Comayagua', 'Primera capital de Honduras, rica en arquitectura colonial', 'Comayagua', 'Comayagua', 'Comayagua', 'Honduras'),

('Refugio de Vida Silvestre Cuero y Salado', 'Cuero y Salado', 'Área protegida de humedales con gran diversidad de fauna', 'La Ceiba', 'La Ceiba', 'Atlántida', 'Honduras'),

('Museo para la Identidad Nacional', 'Villa Roy, Tegucigalpa', 'Museo que preserva y exhibe la historia y cultura hondureña', 'Tegucigalpa', 'Distrito Central', 'Francisco Morazán', 'Honduras'),

('Cayos Cochinos', 'Archipiélago de Cayos Cochinos', 'Reserva biológica marina con arrecifes de coral prístinos', 'Nueva Armenia', 'Nueva Armenia', 'Atlántida', 'Honduras'),

('Parque Nacional Montaña de Celaque', 'Gracias', 'Hogar del punto más alto de Honduras, Cerro Las Minas', 'Gracias', 'Gracias', 'Lempira', 'Honduras'),

('Mercado Guamilito', 'San Pedro Sula', 'Mercado de artesanías y productos típicos hondureños', 'San Pedro Sula', 'San Pedro Sula', 'Cortés', 'Honduras');

-- Insertar salones de ejemplo (ajusta el lugar_id con UUIDs reales de tu tabla lugares)
INSERT INTO salones (
    nombre,
    ubicacion,
    capacidad,
    equipamiento,
    responsable,
    descripcion,
    sesiones,
    url_imagen,
    lugar_id
) VALUES
(
    'Auditorio Principal',
    'Planta Baja - Ala Este',
    200,
    ARRAY['Proyector 4K', 'Sistema de sonido profesional', 'Microfonos inalámbricos', 'Aire acondicionado', 'Iluminación LED'],
    'María González - Tel: 555-0123',
    'Amplio auditorio ideal para conferencias, seminarios y presentaciones corporativas. Cuenta con butacas ergonómicas y excelente acústica.',
    '[
        {"hora": "09:00", "tema": "Conferencia de Ciberseguridad"},
        {"hora": "14:00", "tema": "Workshop de Desarrollo Web"},
        {"hora": "16:30", "tema": "Presentación de Proyectos"}
    ]'::jsonb,
    'https://example.com/auditorio-principal.jpg',
    (SELECT id FROM lugares WHERE nombre = 'Edificio Central' LIMIT 1)
),
(
    'Sala de Juntas Ejecutiva',
    'Piso 3 - Oficina 301',
    25,
    ARRAY['Pantalla táctil 65"', 'Sistema de videoconferencia', 'Mesa de reuniones', 'WiFi de alta velocidad', 'Cafetera'],
    'Carlos Rodríguez - Tel: 555-0456',
    'Sala perfecta para reuniones ejecutivas, entrevistas y pequeñas presentaciones. Ambiente profesional y cómodo.',
    '[
        {"hora": "10:00", "tema": "Reunión de Directorio"},
        {"hora": "15:00", "tema": "Entrevistas de Personal"}
    ]'::jsonb,
    'https://example.com/sala-juntas.jpg',
    (SELECT id FROM lugares WHERE nombre = 'Edificio Central' LIMIT 1)
),
(
    'Laboratorio de Innovación',
    'Planta Baja - Ala Oeste',
    50,
    ARRAY['Computadoras iMac', 'Pizarras inteligentes', 'Impresora 3D', 'Kit de robótica', 'Proyector interactivo'],
    'Ana López - Tel: 555-0789',
    'Espacio diseñado para talleres prácticos, hackathons y sesiones de innovación tecnológica.',
    '[
        {"hora": "08:00", "tema": "Taller de Programación Python"},
        {"hora": "13:00", "tema": "Sesión de Brainstorming"},
        {"hora": "17:00", "tema": "Hackathon Estudiantil"}
    ]'::jsonb,
    'https://example.com/laboratorio.jpg',
    (SELECT id FROM lugares WHERE nombre = 'Centro de Convenciones Norte' LIMIT 1)
),
(
    'Salón Multiusos Verde',
    'Piso 2 - Sector Norte',
    80,
    ARRAY['Sistema de audio portátil', 'Mesas modulares', 'Sillas apilables', 'Proyector móvil', 'Extensiones eléctricas'],
    'Pedro Martínez - Tel: 555-0321',
    'Espacio versátil que se adapta a diferentes tipos de eventos: capacitaciones, workshops, dinámicas grupales.',
    '[
        {"hora": "09:30", "tema": "Capacitación en Liderazgo"},
        {"hora": "14:30", "tema": "Taller de Trabajo en Equipo"}
    ]'::jsonb,
    'https://example.com/salon-verde.jpg',
    (SELECT id FROM lugares WHERE nombre = 'Campus Sur' LIMIT 1)
),
(
    'Aula Magna',
    'Edificio Principal - Piso 1',
    300,
    ARRAY['Proyector de gran formato', 'Sistema de sonido envolvente', 'Micrófonos de solapa', 'Streaming profesional', 'Iluminación escénica'],
    'Laura Fernández - Tel: 555-0654',
    'El espacio más grande disponible, ideal para eventos masivos, graduaciones, conferencias magistrales y espectáculos.',
    '[
        {"hora": "11:00", "tema": "Ceremonia de Graduación"},
        {"hora": "19:00", "tema": "Conferencia Magistral Dr. Smith"}
    ]'::jsonb,
    'https://example.com/aula-magna.jpg',
    (SELECT id FROM lugares WHERE nombre = 'Campus Sur' LIMIT 1)
);

-- Crear vista para consultas más fáciles
CREATE OR REPLACE VIEW vista_salones_completa AS
SELECT 
    s.id,
    s.nombre,
    s.ubicacion,
    s.capacidad,
    s.equipamiento,
    s.responsable,
    s.descripcion,
    s.sesiones,
    s.url_imagen,
    l.nombre AS lugar_nombre,
    l.direccion AS lugar_direccion,
    l.ciudad AS lugar_ciudad,
    s.created_at
FROM salones s
LEFT JOIN lugares l ON s.lugar_id = l.id
ORDER BY s.nombre;


UPDATE salones
SET url_imagen = 'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/salones//salon-de-fiestas.webp'
WHERE id = '8f817b1e-cf96-4822-9577-ff33a3af6f17';

UPDATE salones
SET url_imagen = 'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/salones//zamorano.webp'
WHERE id = '11685004-860b-473e-b31b-bbc11c367eee';

INSERT INTO salones (
  id,
  nombre,
  ubicacion,
  capacidad,
  equipamiento,
  responsable,
  descripcion,
  sesiones,
  created_at,
  url_imagen,
  lugar_id
)
VALUES (
  gen_random_uuid(),
  'Salons de eventos John Sloan Academy',
  'El Jicarito',
  100,
  ARRAY['Proyector de gran formato', 'Sistema de sonido envolvente', 'Micrófonos de solapa', 'Streaming profesional', 'Iluminación escénica'],
  'John Sloan Academy - Tel: 555-0321',
  'Sala de banquetes en El Jicarito',
  NULL,
  now(),
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/salones//JohnSloanAcademy.webp',
  NULL
);


UPDATE salones
SET lugar_id = '0e4cf04c-caac-40e0-bb1f-51e7f2783218'
WHERE id = 'e84322c1-e987-4bec-aa93-c1ff59392c61';
