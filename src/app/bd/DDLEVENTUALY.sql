-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  provider_id uuid,
  event_id uuid,
  status text DEFAULT 'pendiente'::text CHECK (status = ANY (ARRAY['pendiente'::text, 'confirmado'::text, 'cancelado'::text])),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  catering_id uuid,
  menu_id uuid,
  number_of_guests integer,
  includes_service_staff boolean DEFAULT false,
  service_mode_id uuid,
  notes text,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.catering_menus(id),
  CONSTRAINT bookings_catering_id_fkey FOREIGN KEY (catering_id) REFERENCES public.catering(id),
  CONSTRAINT bookings_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT bookings_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id),
  CONSTRAINT bookings_service_mode_id_fkey FOREIGN KEY (service_mode_id) REFERENCES public.service_modes(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.catering (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  CONSTRAINT catering_pkey PRIMARY KEY (id)
);
CREATE TABLE public.catering_menus (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  catering_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  price numeric,
  CONSTRAINT catering_menus_pkey PRIMARY KEY (id),
  CONSTRAINT catering_menus_catering_id_fkey FOREIGN KEY (catering_id) REFERENCES public.catering(id)
);
CREATE TABLE public.chatbot_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  mensaje_usuario text NOT NULL,
  respuesta_bot text NOT NULL,
  creado_en timestamp with time zone DEFAULT now(),
  CONSTRAINT chatbot_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event_sesiones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  salon_sesion_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT event_sesiones_pkey PRIMARY KEY (id),
  CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT fk_salon_sesion FOREIGN KEY (salon_sesion_id) REFERENCES public.salon_sesiones(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text,
  user_id uuid,
  contact_phone text,
  contact_email text,
  category_id uuid,
  location_id uuid,
  audiovisual boolean DEFAULT false,
  attendees_estimated integer,
  notes text,
  start_time time without time zone,
  end_time time without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  start_date date NOT NULL,
  end_date date,
  salon_id uuid,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salones(id),
  CONSTRAINT fk_eventos_location FOREIGN KEY (location_id) REFERENCES public.lugares(id),
  CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.faq (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pregunta text NOT NULL,
  respuesta text NOT NULL,
  embedding USER-DEFINED,
  categoria_id integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT faq_pkey PRIMARY KEY (id),
  CONSTRAINT faq_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.faq_categories(id)
);
CREATE TABLE public.faq_categories (
  id integer NOT NULL DEFAULT nextval('faq_categories_id_seq'::regclass),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  CONSTRAINT faq_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lugares (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  direccion text,
  descripcion text,
  created_at timestamp without time zone DEFAULT now(),
  ciudad text,
  municipio text,
  departamento text,
  pais text,
  imagen text,
  sitio_web text,
  CONSTRAINT lugares_pkey PRIMARY KEY (id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid,
  user_id uuid,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type character varying NOT NULL,
  title character varying NOT NULL,
  message text NOT NULL,
  related_id uuid,
  related_type character varying DEFAULT 'event'::character varying,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  content text,
  type text CHECK (type = ANY (ARRAY['anuncio'::text, 'publicacion'::text, 'encuesta'::text])),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.providers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  rating numeric CHECK (rating >= 0::numeric AND rating <= 5::numeric),
  location text,
  user_id uuid,
  email text,
  phones text,
  website text,
  image_url text,
  CONSTRAINT providers_pkey PRIMARY KEY (id),
  CONSTRAINT providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.reservas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid,
  salon_id uuid,
  fecha date NOT NULL,
  hora time without time zone NOT NULL,
  estado text DEFAULT 'pendiente'::text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT reservas_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id),
  CONSTRAINT reservas_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salones(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  provider_id uuid,
  comment text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  user_id uuid,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.reviews_lugares (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lugar_id uuid NOT NULL,
  user_id uuid NOT NULL,
  comment text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone,
  CONSTRAINT reviews_lugares_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_lugares_lugar_id_fkey FOREIGN KEY (lugar_id) REFERENCES public.lugares(id),
  CONSTRAINT reviews_lugares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.salon_sesiones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL,
  hora time without time zone NOT NULL,
  tema text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT salon_sesiones_pkey PRIMARY KEY (id),
  CONSTRAINT salon_sesiones_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salones(id)
);
CREATE TABLE public.salones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  ubicacion text,
  capacidad integer,
  equipamiento ARRAY,
  responsable text,
  descripcion text,
  created_at timestamp without time zone DEFAULT now(),
  url_imagen text,
  lugar_id uuid,
  coordenada_x integer DEFAULT 100,
  coordenada_y integer DEFAULT 100,
  ancho integer DEFAULT 150,
  alto integer DEFAULT 100,
  estado character varying DEFAULT 'disponible'::character varying,
  CONSTRAINT salones_pkey PRIMARY KEY (id),
  CONSTRAINT salones_lugar_id_fkey FOREIGN KEY (lugar_id) REFERENCES public.lugares(id)
);
CREATE TABLE public.service_modes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  CONSTRAINT service_modes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.soporte (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  mensaje text NOT NULL,
  creado_en timestamp with time zone DEFAULT now(),
  CONSTRAINT soporte_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sponsors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  description text,
  user_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT sponsors_pkey PRIMARY KEY (id),
  CONSTRAINT sponsors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['usuario'::text, 'proveedor'::text, 'admin'::text])),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  first_name text,
  last_name text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);