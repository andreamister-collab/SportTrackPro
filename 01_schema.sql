-- ============================================================
-- SportTrack Pro — Schema Supabase 
-- Esegui questo file nel SQL Editor di Supabase
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. SPORTS  (globale, non legata a società)
-- ============================================================
create table if not exists public.sports (
  id          text primary key,
  name        text not null,
  icon        text not null default '⚽'
);

-- ============================================================
-- 2. SOCIETIES
-- ============================================================
create table if not exists public.societies (
  id          text primary key,
  name        text not null,
  sport_id    text references public.sports(id) on delete set null,
  city        text not null default '',
  email       text not null default '',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 3. TEAMS
-- ============================================================
create table if not exists public.teams (
  id          text primary key,
  name        text not null,
  society_id  text references public.societies(id) on delete cascade,
  sport_id    text references public.sports(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 4. SEASONS
-- ============================================================
create table if not exists public.seasons (
  id          text primary key,
  name        text not null,
  start_year  int  not null,
  end_year    int  not null,
  active      boolean not null default false,
  society_id  text references public.societies(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 5. USERS  (profili applicativi — specchiato da auth.users)
-- ============================================================
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  username    text not null default '',
  email       text not null default '',
  role        text not null default 'allenatore'
                check (role in ('admin','responsabile','dirigente','allenatore','professionista')),
  profession  text not null default '',
  phone       text not null default '',
  society_id  text references public.societies(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 6. CATEGORIES  (categorie / gruppi squadra)
-- ============================================================
create table if not exists public.categories (
  id              text primary key,
  name            text not null,
  sport_id        text references public.sports(id) on delete set null,
  society_id      text references public.societies(id) on delete cascade,
  team_id         text references public.teams(id) on delete set null,
  team_ids        text[]   not null default '{}',
  director_ids    text[]   not null default '{}',   -- dirigenti
  manager_ids     text[]   not null default '{}',   -- responsabili
  coach_ids       text[]   not null default '{}',   -- allenatori
  prof_ids        text[]   not null default '{}',   -- professionisti
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 7. ATHLETES
-- ============================================================
create table if not exists public.athletes (
  id          text primary key,
  first_name  text not null,
  last_name   text not null,
  dob         date,
  nickname    text not null default '',
  category_id text references public.categories(id) on delete set null,
  team_id     text references public.teams(id)      on delete set null,
  number      int,
  role        text not null default '',
  notes       text not null default '',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 8. ATHLETE_SEASONS  (iscrizione atleta per stagione)
-- ============================================================
create table if not exists public.athlete_seasons (
  id           text primary key,
  athlete_id   text not null references public.athletes(id) on delete cascade,
  category_id  text not null references public.categories(id) on delete cascade,
  season_id    text not null references public.seasons(id)    on delete cascade,
  team_id      text references public.teams(id) on delete set null,
  role         text not null default '',
  shirt_number int,
  join_date    date,
  notes        text not null default '',
  created_at   timestamptz not null default now(),
  unique (athlete_id, category_id, season_id)
);

-- ============================================================
-- 9. SESSIONS  (allenamenti / partite / sessioni individuali)
-- ============================================================
create table if not exists public.sessions (
  id           text primary key,
  category_id  text not null references public.categories(id) on delete cascade,
  date         date not null,
  type         text not null default 'A',   -- A=Allenamento, P=Partita, I=Individual, PS=Psicomotricità
  notes        text not null default '',
  match_id     text,                         -- collegamento partita (se type=P)
  created_by   uuid references public.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 10. ATTENDANCES  (presenze per sessione)
-- ============================================================
create table if not exists public.attendances (
  id          text primary key,
  session_id  text not null references public.sessions(id) on delete cascade,
  athlete_id  text not null references public.athletes(id) on delete cascade,
  status      text not null default 'P'
                check (status in ('P','A','G','C','NC')),  -- Presente/Assente/Giustificato/Convocato/Non Conv.
  created_at  timestamptz not null default now(),
  unique (session_id, athlete_id)
);

-- ============================================================
-- 11. PERFORMANCES  (valutazioni per atleta per sessione)
-- ============================================================
create table if not exists public.performances (
  id          text primary key,
  session_id  text not null references public.sessions(id) on delete cascade,
  athlete_id  text not null references public.athletes(id) on delete cascade,
  params      jsonb not null default '{}',  -- {tecnica:4, fisico:3, tattica:3, mentale:4, comunicazione:5}
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  unique (session_id, athlete_id)
);

-- ============================================================
-- 12. MATCHES  (partite con dettagli)
-- ============================================================
create table if not exists public.matches (
  id           text primary key,
  category_id  text not null references public.categories(id) on delete cascade,
  date         date not null,
  time         time,
  meet_time    time,
  meet_place   text not null default '',
  opponent     text not null,
  home_away    text not null default 'home' check (home_away in ('home','away')),
  result       text not null default 'TBD' check (result in ('W','D','L','TBD')),
  scored       int  not null default 0,
  conceded     int  not null default 0,
  notes        text not null default '',
  bg_color     text not null default '#1A3A5C',
  created_by   uuid references public.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 13. CONVOCATI  (convocazioni per partita)
-- ============================================================
create table if not exists public.convocati (
  id          text primary key,
  match_id    text not null references public.matches(id) on delete cascade,
  athlete_id  text not null references public.athletes(id) on delete cascade,
  status      text not null default 'convocato'
                check (status in ('convocato','riserva','non_convocato')),
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  unique (match_id, athlete_id)
);

-- ============================================================
-- INDEXES  (migliorano le query più comuni)
-- ============================================================
create index if not exists idx_athletes_category    on public.athletes(category_id);
create index if not exists idx_sessions_category    on public.sessions(category_id);
create index if not exists idx_sessions_date        on public.sessions(date);
create index if not exists idx_attendances_session  on public.attendances(session_id);
create index if not exists idx_attendances_athlete  on public.attendances(athlete_id);
create index if not exists idx_performances_session on public.performances(session_id);
create index if not exists idx_performances_athlete on public.performances(athlete_id);
create index if not exists idx_matches_category     on public.matches(category_id);
create index if not exists idx_convocati_match      on public.convocati(match_id);
create index if not exists idx_athlete_seasons_seas on public.athlete_seasons(season_id);
create index if not exists idx_categories_society   on public.categories(society_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Abilita RLS su tutte le tabelle
alter table public.sports           enable row level security;
alter table public.societies        enable row level security;
alter table public.teams            enable row level security;
alter table public.seasons          enable row level security;
alter table public.users            enable row level security;
alter table public.categories       enable row level security;
alter table public.athletes         enable row level security;
alter table public.athlete_seasons  enable row level security;
alter table public.sessions         enable row level security;
alter table public.attendances      enable row level security;
alter table public.performances     enable row level security;
alter table public.matches          enable row level security;
alter table public.convocati        enable row level security;

-- Policy: utenti autenticati possono leggere/scrivere tutto (semplificato per MVP)
-- In produzione, affina per society_id o ruolo specifico.

create policy "authenticated full access" on public.sports
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.societies
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.teams
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.seasons
  for all to authenticated using (true) with check (true);

create policy "users read own" on public.users
  for select to authenticated using (true);

create policy "users update own" on public.users
  for update to authenticated using (id = auth.uid());

create policy "users insert" on public.users
  for insert to authenticated with check (true);

create policy "authenticated full access" on public.categories
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.athletes
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.athlete_seasons
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.sessions
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.attendances
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.performances
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.matches
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on public.convocati
  for all to authenticated using (true) with check (true);

-- ============================================================
-- RPC: get_my_profile  (SECURITY DEFINER — bypassa RLS per login)
-- ============================================================
create or replace function public.get_my_profile()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile json;
begin
  select row_to_json(u) into v_profile
  from public.users u
  where u.id = auth.uid();
  return v_profile;
end;
$$;

-- ============================================================
-- 14. CONFIG  (configurazioni locali: activityTypes, perfParams…)
-- ============================================================
create table if not exists public.config (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz not null default now()
);

alter table public.config enable row level security;

create policy "authenticated full access" on public.config
  for all to authenticated using (true) with check (true);

-- Dati di default per config
insert into public.config (key, value) values
  ('activityTypes', '{"A":{"label":"Allenamento","emoji":"🏃","color":"blue","cls":"act-A"},"P":{"label":"Partita","emoji":"⚽","color":"gold","cls":"act-P"},"I":{"label":"Individual","emoji":"🎯","color":"green","cls":"act-I"},"PS":{"label":"Psicomotricità","emoji":"🧠","color":"purple","cls":"act-PS"}}'),
  ('perfParams',    '[{"key":"tecnica","label":"Tecnica"},{"key":"fisico","label":"Fisico"},{"key":"tattica","label":"Tattica"},{"key":"mentale","label":"Mentale"},{"key":"comunicazione","label":"Comunicaz."}]'),
  ('sessionTypePerfParams', '{"A":["tecnica","fisico","tattica","mentale","comunicazione"],"P":["tecnica","fisico","tattica","mentale","comunicazione"],"I":["tecnica","fisico"],"PS":["mentale","comunicazione"]}')
on conflict (key) do nothing;
