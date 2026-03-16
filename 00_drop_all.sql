-- ============================================================
-- SportTrack Pro — DROP COMPLETO 
-- Esegui questo script nel SQL Editor di Supabase
-- per eliminare tutte le tabelle, policy, funzioni e tipi
-- ATTENZIONE: operazione irreversibile, tutti i dati verranno persi
-- ============================================================

-- Disabilita temporaneamente i vincoli di foreign key
SET session_replication_role = replica;

-- ── TABELLE (in ordine inverso rispetto alle dipendenze) ─────
DROP TABLE IF EXISTS public.convocati         CASCADE;
DROP TABLE IF EXISTS public.performances      CASCADE;
DROP TABLE IF EXISTS public.attendances       CASCADE;
DROP TABLE IF EXISTS public.sessions          CASCADE;
DROP TABLE IF EXISTS public.matches           CASCADE;
DROP TABLE IF EXISTS public.athlete_seasons   CASCADE;
DROP TABLE IF EXISTS public.athletes          CASCADE;
DROP TABLE IF EXISTS public.categories        CASCADE;
DROP TABLE IF EXISTS public.users             CASCADE;
DROP TABLE IF EXISTS public.seasons           CASCADE;
DROP TABLE IF EXISTS public.teams             CASCADE;
DROP TABLE IF EXISTS public.societies         CASCADE;
DROP TABLE IF EXISTS public.sports            CASCADE;
DROP TABLE IF EXISTS public.config            CASCADE;

-- Ripristina i vincoli
SET session_replication_role = DEFAULT;

-- ── FUNZIONI RPC ─────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.get_my_profile();

-- ── CONFERMA ─────────────────────────────────────────────────
SELECT 'DROP completato — tutte le tabelle SportTrack Pro sono state eliminate.' AS risultato;
