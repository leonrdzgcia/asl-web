-- Migracion PostgreSQL: agregar id numerico como PK en operadores
-- Tabla origen esperada: public.operadores con columna id_operador (texto)
--
-- Resultado:
-- 1) Agrega columna id BIGINT autoincremental
-- 2) Rellena id para registros existentes
-- 3) Cambia PK a columna id
-- 4) Conserva id_operador como UNIQUE (identificador de negocio)

BEGIN;

-- 1) Columna id (si no existe)
ALTER TABLE public.operadores
  ADD COLUMN IF NOT EXISTS id BIGINT;

-- 2) Crear secuencia/default para autoincremento si aun no existe
DO $$
DECLARE
  seq_name TEXT;
BEGIN
  SELECT pg_get_serial_sequence('public.operadores', 'id')
    INTO seq_name;

  IF seq_name IS NULL THEN
    CREATE SEQUENCE IF NOT EXISTS public.operadores_id_seq;
    ALTER TABLE public.operadores
      ALTER COLUMN id SET DEFAULT nextval('public.operadores_id_seq');
    ALTER SEQUENCE public.operadores_id_seq
      OWNED BY public.operadores.id;
  END IF;
END $$;

-- 3) Backfill para filas existentes
UPDATE public.operadores
SET id = DEFAULT
WHERE id IS NULL;

-- 4) id obligatorio
ALTER TABLE public.operadores
  ALTER COLUMN id SET NOT NULL;

-- 5) Quitar PK actual (sea cual sea) y crear PK sobre id
DO $$
DECLARE
  pk_name TEXT;
BEGIN
  SELECT conname
    INTO pk_name
  FROM pg_constraint
  WHERE conrelid = 'public.operadores'::regclass
    AND contype = 'p';

  IF pk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.operadores DROP CONSTRAINT %I', pk_name);
  END IF;
END $$;

ALTER TABLE public.operadores
  ADD CONSTRAINT operadores_pkey PRIMARY KEY (id);

-- 6) Mantener id_operador como clave unica de negocio
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.operadores'::regclass
      AND conname = 'operadores_id_operador_key'
  ) THEN
    ALTER TABLE public.operadores
      ADD CONSTRAINT operadores_id_operador_key UNIQUE (id_operador);
  END IF;
END $$;

COMMIT;
