INSERT INTO catering (id, name, description) VALUES
(uuid_generate_v4(), 'Buffet Catering', 'Usado principalmente en eventos corporativos grandes, ofreciendo variedad de platillos fríos, calientes, dulces y salados accesibles para todos los asistentes.'),
(uuid_generate_v4(), 'Cocktail Catering', 'Ideal para eventos informales donde se ofrecen bocados pequeños para animar la interacción entre los invitados. Común en recepciones de bodas.'),
(uuid_generate_v4(), 'Breakfast / Coffee Catering', 'Catering para eventos matutinos con opciones dulces y ligeras, como Welcome coffee y Coffee Breaks.'),
(uuid_generate_v4(), 'Aperitif / Spanish Wine Catering', 'Se ofrece al finalizar reuniones antes del almuerzo o al final de la tarde como detalle para los asistentes.'),
(uuid_generate_v4(), 'Brunch Catering', 'Combinación moderna de platos de desayuno y almuerzo, tanto dulces como salados.'),
(uuid_generate_v4(), 'Banquet Catering', 'Servicio completo de menú con entrada, plato fuerte y postre. Común en bodas o galas formales.'),
(uuid_generate_v4(), 'Mobile Catering Services', 'Servicio móvil para ferias o festivales, usualmente con recetas rápidas y sin elaboración compleja.'),
(uuid_generate_v4(), 'Home Catering Services', 'Entrega de alimentos en formato fácil de almacenar y servir. Varía entre menús simples o elaborados.'),
(uuid_generate_v4(), 'Door-to-door Catering Services', 'Entrega a domicilio con un menú previamente elegido y listo para consumir.'),
(uuid_generate_v4(), 'Catering for Special Events', 'Incluye menú, presentación, decoración y planificación general del evento.'),
(uuid_generate_v4(), 'Corporate Catering', 'Diseñado para eventos empresariales, adaptado al perfil del cliente.'),
(uuid_generate_v4(), 'Industrial Catering', 'Catering de alto volumen y menú estandarizado, común en hospitales, escuelas o aerolíneas.');


-- Buffet Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), 'fabf01fc-232d-4330-9743-6a2a2bc4aa9d', 'Buffet Clásico', 'Variedad de carnes, ensaladas, guarniciones y postres.', 22.50),
(gen_random_uuid(), 'fabf01fc-232d-4330-9743-6a2a2bc4aa9d', 'Buffet Vegetariano', 'Ensaladas, verduras asadas, legumbres y postres sin lácteos.', 20.00);

-- Cocktail Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), '6b75fce4-78f5-4ffc-a46f-e6f38586d04b', 'Cóctel Premium', 'Bocados gourmet, selección de vinos y canapés de autor.', 18.00),
(gen_random_uuid(), '6b75fce4-78f5-4ffc-a46f-e6f38586d04b', 'Cóctel Económico', 'Snacks simples, mini emparedados y bebidas sin alcohol.', 12.00);

-- Breakfast / Coffee Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), 'cc6e7180-1aa9-47d4-8a7c-80bcffe9bb3e', 'Coffee Break Tradicional', 'Café, té, jugos, panes dulces y frutas.', 8.50),
(gen_random_uuid(), 'cc6e7180-1aa9-47d4-8a7c-80bcffe9bb3e', 'Desayuno Ejecutivo', 'Opción completa con huevos, pan, frutas y bebida caliente.', 11.00);

-- Aperitif / Spanish Wine Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), 'b44476d5-dfe1-4fe4-80a6-7fafcc372003', 'Aperitivo Mediterráneo', 'Aceitunas, jamón serrano, quesos y vino tinto.', 15.00),
(gen_random_uuid(), 'b44476d5-dfe1-4fe4-80a6-7fafcc372003', 'Aperitivo Ligero', 'Snacks salados, cava y frutos secos.', 10.00);

-- Brunch Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), '944ecbb6-20d2-47ff-b44e-b36fe5a29796', 'Brunch Dulce & Salado', 'Waffles, huevos, panecillos, frutas y jugos.', 14.00),
(gen_random_uuid(), '944ecbb6-20d2-47ff-b44e-b36fe5a29796', 'Brunch Internacional', 'Croissants, queso, jamón, omelettes y yogur.', 16.50);

-- Banquet Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), '5d6407cc-7c91-4dd2-88b6-0901cf4185ea', 'Banquete Formal', 'Entrada, plato fuerte (carne o pescado), postre y vino.', 30.00),
(gen_random_uuid(), '5d6407cc-7c91-4dd2-88b6-0901cf4185ea', 'Banquete Temático', 'Menú completo según la temática del evento (ej. mexicano, italiano).', 27.00);

-- Mobile Catering Services
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), 'f58bbcfc-b875-463b-a9e2-2a50a4dcdb65', 'Food Truck Hamburguesas', 'Hamburguesas artesanales, papas fritas y refrescos.', 10.00),
(gen_random_uuid(), 'f58bbcfc-b875-463b-a9e2-2a50a4dcdb65', 'Comida Rápida Internacional', 'Tacos, hot dogs, arepas y bebidas frías.', 9.50);

-- Home Catering Services
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), '93746098-6a47-46c5-8e46-0f0bf54a6a60', 'Menú Familiar', 'Platos listos para calentar y servir (pasta, arroz, carnes).', 13.00),
(gen_random_uuid(), '93746098-6a47-46c5-8e46-0f0bf54a6a60', 'Menú Saludable', 'Opciones bajas en calorías, con vegetales y proteínas magras.', 14.00);

-- Door-to-door Catering Services
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), '6b330f04-ff82-4c80-ade4-ce0c047bf0bb', 'Entrega Estándar', 'Almuerzo del día con sopa, plato fuerte y bebida.', 8.00),
(gen_random_uuid(), '6b330f04-ff82-4c80-ade4-ce0c047bf0bb', 'Entrega Premium', 'Menú gourmet en empaque térmico individual.', 12.50);

-- Catering for Special Events
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), '66ace921-26f6-4026-a840-257722d23168', 'Evento Temático', 'Menú, decoración y personal enfocados en temática especial.', 35.00),
(gen_random_uuid(), '66ace921-26f6-4026-a840-257722d23168', 'Celebración Formal', 'Menú de 3 tiempos con presentación y servicio incluido.', 40.00);

-- Corporate Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), 'e943ccb7-5ee8-47c1-9515-0b4e1d666606', 'Menú Ejecutivo', 'Entrada, plato fuerte, postre y bebida en porción controlada.', 18.00),
(gen_random_uuid(), 'e943ccb7-5ee8-47c1-9515-0b4e1d666606', 'Snack Corporativo', 'Bocadillos individuales, barras de cereal y jugos.', 10.00);

-- Industrial Catering
INSERT INTO public.catering_menus (id, catering_id, name, description, price) VALUES
(gen_random_uuid(), 'e080c43f-013b-4174-a10f-20d9f530bf9a', 'Menú Escolar', 'Comida balanceada adaptada a niños y adolescentes.', 4.50),
(gen_random_uuid(), 'e080c43f-013b-4174-a10f-20d9f530bf9a', 'Menú Hospitalario', 'Alimentos blandos, bajos en sodio y fáciles de digerir.', 5.00);

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
) VALUES (
  gen_random_uuid(), -- UUID generado para Zamorano
  'Zamorano',
  'Valle del Río Yeguare',
  'Institución educativa líder en agronomía y desarrollo sostenible en Honduras.',
  NOW(),
  'Zamorano',
  'San Antonio de Orientes',
  'Francisco Morazán',
  'Honduras',
  'https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares/zamorano.webp',
  'https://www.zamorano.edu'
);

| id                                   | name                    | category                                     | rating | location                                                                                                                                  | user_id                              | email                           | phones                            | website                                                | image_url                                                                                           |
| ------------------------------------ | ----------------------- | -------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------- | --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| 6a800216-07bb-4fde-8a56-704702295ab9 | NPineda Wedding Planner | Decoración y Montaje de Eventos Corporativos | 5      | Oficina Principal, San Pedro Sula, Honduras                                                                                               | 4c915513-50d5-48f3-80f9-eec1b013a0ff | npinedaweddingplanner@gmail.com | +504 8861-0633                    | https://normapineda.com/                               | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//NormaPineda.webp     |
| 125f9c8e-3b50-46c4-a5c6-5227fa4bfffb | JH Eventos              | Decoración y Montaje de Eventos              | 5      | Tegucigalpa, Honduras                                                                                                                     | 4c915513-50d5-48f3-80f9-eec1b013a0ff | javierherreraeventos@gmail.com  | +504 8985-4573                    | https://www.jhceventos.com/                            | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//jhceventos.webp      |
| 6b0b1c3e-b8a7-4cc4-b219-41984af026ce | Grupo Eventus           | Decoración y Montaje de Eventos              | 5      | Calle Gema, Tegucigalpa, Francisco Morazán. Áreas de servicio: Departamento de Francisco Morazán. Horario: Abierto ⋅ Cierra a las 5 p. m. | 4c915513-50d5-48f3-80f9-eec1b013a0ff | null                            | +504 8889-5881                    | null                                                   | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//GrupoEventus.jpg     |
| af47771c-9097-449d-b727-73359a6802ea | Casablanca y Le Decor   | Decoración de eventos                        | 5      | Local en Santa Lucia, Honduras y oficinas en Col. San Carlos contiguo a Novacentro y La Yamaha                                            | 4c915513-50d5-48f3-80f9-eec1b013a0ff | casablanca-ledecor@outlook.es   | +504 3146-6651, +504 3191-6109    | https://www.casablancaledecor.com/                     | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//Casablanca.webp      |
| 75901a3d-30b3-4ac9-9ec5-6ba6d8082c0b | Luna Vela HN            | Decoración y Montaje de Eventos Corporativos | 5      | Oficina en Tegucigalpa, Honduras                                                                                                          | 4c915513-50d5-48f3-80f9-eec1b013a0ff | infolunavelahn@gmail.com        | +504 3311-8270                    | https://normapineda.com/eventos-corporativos/          | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//lunavela.webp        |
| 9af16622-9509-4b21-99f4-bee77460dc57 | Con Clase Eventoss      | Decoración y Montaje de Eventos              | 5      | 3RM9+WFX, Boulevard Suyapa, Tegucigalpa, Francisco Morazán                                                                                | 4c915513-50d5-48f3-80f9-eec1b013a0ff | null                            | +504 2235-7936                    | null                                                   | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//conclaseeventos.webp |
| a0133ac0-b386-420c-83b1-fba83f2cad2b | Servifiesta HN          | Decoración y Montaje de Eventos              | 5      | Colonia América, Avenida Los Angeles, a media cuadra de esquina opuesta de Supermercado Diprova                                           | 4c915513-50d5-48f3-80f9-eec1b013a0ff | servifiestahn1@gmail.com        | +504 9600-6938                    | https://servifiestahn.com/                             | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//servifiestahn.webp   |
| 0ea63936-b7d3-4813-9432-01eff2ec4c59 | SC Eventos              | Decoración y Montaje de Eventos              | 5      | 11101, Tegucigalpa, Francisco Morazán                                                                                                     | 4c915513-50d5-48f3-80f9-eec1b013a0ff | null                            | 9732-5908                         | https://www.facebook.com/p/SC-Eventos-100084018362839/ | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//sceventos.webp       |
| 6d3eca12-467a-49d5-b428-299d60c822ac | SERVIGAMA               | Decoración y Montaje de Eventos              | 5      | Unnamed Road, Tegucigalpa 12101, Tegucigalpa, Honduras 12101                                                                              | 4c915513-50d5-48f3-80f9-eec1b013a0ff | servigamahn@gmail.com           | 9932-3902 / 3192-1071 / 2245-6792 | https://www.instagram.com/servigamahn/                 | https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/proveedores//servigama.webp       |