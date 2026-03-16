-- ============================================================
-- SportTrack Pro — Dati di esempio
-- IMPORTANTE: esegui PRIMA il file 01_schema.sql
-- Poi crea gli utenti auth PRIMA di eseguire questo file:
--   1) Vai su Supabase → Authentication → Users
--   2) Crea ogni utente con l'email indicata sotto e la password desiderata
--   3) Copia il UUID generato e sostituisci i placeholder UUID_Uxx
--      oppure usa gli UUID inventati qui se corrispondono a quelli reali
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- NOTA: sostituisci questi UUID con quelli reali generati
-- da Supabase Authentication per ogni utente
-- ────────────────────────────────────────────────────────────
do $$
begin
  -- Questi sono UUID placeholder; devono corrispondere agli
  -- utenti creati in Supabase Auth prima di eseguire questo script.
  -- Esempio: se hai creato admin@olimpia.it e il suo UUID è
  -- '11111111-1111-1111-1111-111111111111', usa quello.
  raise notice 'Assicurati che gli UUID in questo script corrispondano agli utenti Auth di Supabase!';
end;
$$;

-- ============================================================
-- SPORTS
-- ============================================================
insert into public.sports (id, name, icon) values
  ('s1', 'Calcio',    '⚽'),
  ('s2', 'Basket',    '🏀'),
  ('s3', 'Pallavolo', '🏐')
on conflict (id) do update set name = excluded.name, icon = excluded.icon;

-- ============================================================
-- SOCIETIES
-- ============================================================
insert into public.societies (id, name, sport_id, city, email) values
  ('soc1', 'ASD Olimpia Milano',   's1', 'Milano',    'info@olimpia.it'),
  ('soc2', 'US Torino Calcio',      's1', 'Torino',    'segreteria@ustorino.it'),
  ('soc3', 'Basket Club Roma',      's2', 'Roma',      'info@basketroma.it')
on conflict (id) do update set
  name = excluded.name, sport_id = excluded.sport_id,
  city = excluded.city, email = excluded.email;

-- ============================================================
-- SEASONS
-- ============================================================
insert into public.seasons (id, name, start_year, end_year, active, society_id) values
  ('seas1', '2023/2024', 2023, 2024, false, 'soc1'),
  ('seas2', '2024/2025', 2024, 2025, false, 'soc1'),
  ('seas3', '2025/2026', 2025, 2026, true,  'soc1'),
  ('seas4', '2024/2025', 2024, 2025, false, 'soc2'),
  ('seas5', '2025/2026', 2025, 2026, true,  'soc2')
on conflict (id) do update set
  name = excluded.name, start_year = excluded.start_year,
  end_year = excluded.end_year, active = excluded.active;

-- ============================================================
-- TEAMS
-- ============================================================
insert into public.teams (id, name, society_id, sport_id) values
  ('t1',  'Prima Squadra',  'soc1', 's1'),
  ('t2',  'Under 17',       'soc1', 's1'),
  ('t3',  'Under 14',       'soc1', 's1'),
  ('t4',  'Under 12 A',     'soc1', 's1'),
  ('t5',  'Under 12 B',     'soc1', 's1'),
  ('t6',  'Femminile',      'soc1', 's1'),
  ('t7',  'Prima Squadra',  'soc2', 's1'),
  ('t8',  'Juniores',       'soc2', 's1'),
  ('t9',  'Prima Squadra',  'soc3', 's2'),
  ('t10', 'Under 18',       'soc3', 's2')
on conflict (id) do update set
  name = excluded.name, society_id = excluded.society_id;

-- ============================================================
-- CATEGORIES
-- ============================================================
insert into public.categories
  (id, name, sport_id, society_id, team_id, team_ids,
   director_ids, manager_ids, coach_ids, prof_ids)
values
  ('cat1','Under 14',    's1','soc1','t3', array['t3'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[]),
  ('cat2','Under 17',    's1','soc1','t2', array['t2'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[]),
  ('cat3','Prima Squadra','s1','soc1','t1', array['t1'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[]),
  ('cat4','Under 12',    's1','soc1','t4', array['t4','t5'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[]),
  ('cat5','Femminile',   's1','soc1','t6', array['t6'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[]),
  ('cat6','Prima Squadra','s1','soc2','t7', array['t7'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[]),
  ('cat7','Juniores',    's1','soc2','t8', array['t8'],
   array[]::text[], array[]::text[], array[]::text[], array[]::text[])
on conflict (id) do update set
  name = excluded.name, sport_id = excluded.sport_id,
  society_id = excluded.society_id, team_id = excluded.team_id,
  team_ids = excluded.team_ids;

-- ============================================================
-- USERS  (profili — UUID devono corrispondere ad auth.users)
-- Sostituisci gli UUID con quelli reali da Supabase Auth!
-- ============================================================
-- Esempio con UUID inventati:
-- Crea in Auth: admin@olimpia.it, mario.rossi@olimpia.it,
--   anna.verdi@olimpia.it, carlo.bianchi@olimpia.it,
--   giulia.neri@olimpia.it, responsabile@olimpia.it
--
-- Poi aggiorna questo script con i veri UUID prima di eseguirlo.

-- insert into public.users (id, name, username, email, role, profession, phone, society_id) values
-- ('UUID_DA_SUPABASE_AUTH_1', 'Amministratore',  'admin',         'admin@olimpia.it',           'admin',          '',                    '',             'soc1'),
-- ('UUID_DA_SUPABASE_AUTH_2', 'Mario Rossi',     'mario.rossi',   'mario.rossi@olimpia.it',     'dirigente',      'Dirigente Sportivo',  '333-1234567',  'soc1'),
-- ('UUID_DA_SUPABASE_AUTH_3', 'Anna Verdi',      'anna.verdi',    'anna.verdi@olimpia.it',      'responsabile',   'Resp. Tecnico Area',  '333-7654321',  'soc1'),
-- ('UUID_DA_SUPABASE_AUTH_4', 'Carlo Bianchi',   'carlo.bianchi', 'carlo.bianchi@olimpia.it',   'allenatore',     'Allenatore UEFA B',   '347-9988776',  'soc1'),
-- ('UUID_DA_SUPABASE_AUTH_5', 'Dr. Giulia Neri', 'giulia.neri',   'giulia.neri@olimpia.it',     'professionista', 'Fisioterapista',      '348-5544332',  'soc1')
-- on conflict (id) do update set
--   name = excluded.name, role = excluded.role,
--   profession = excluded.profession, phone = excluded.phone;

-- ============================================================
-- ATHLETES — ASD Olimpia Milano (cat1 = Under 14)
-- ============================================================
insert into public.athletes
  (id, first_name, last_name, dob, nickname, category_id, team_id, number, role, notes)
values
  ('a1',  'Luca',      'Bianchi',    '2011-05-14', 'Lucone',    'cat1', 't3',  7,  'Attaccante',         'Ottimo scattista'),
  ('a2',  'Marco',     'Ferrari',    '2011-09-22', 'Ferro',     'cat1', 't3',  10, 'Centrocampista',     'Buona visione di gioco'),
  ('a3',  'Paolo',     'Conti',      '2011-03-01', 'Pantalone', 'cat1', 't3',  1,  'Portiere',           'Riflessi eccellenti'),
  ('a4',  'Giulio',    'Romano',     '2011-11-18', 'Giulione',  'cat1', 't3',  4,  'Difensore Centrale', 'Bravo nel gioco aereo'),
  ('a5',  'Davide',    'Sala',       '2011-07-30', 'Dada',      'cat1', 't3',  9,  'Prima Punta',        'Finalizzatore naturale'),
  ('a6',  'Riccardo',  'Mancini',    '2011-02-17', 'Ricco',     'cat1', 't3',  5,  'Mediano',            'Geometrie precise'),
  ('a7',  'Filippo',   'Galli',      '2011-08-05', 'Filo',      'cat1', 't3',  11, 'Ala DX',             ''),
  ('a8',  'Simone',    'Moretti',    '2011-06-23', 'Simo',      'cat1', 't3',  8,  'Ala SX',             ''),
  -- Under 17 (cat2)
  ('a9',  'Andrea',    'Russo',      '2009-04-10', 'Russi',     'cat2', 't2',  7,  'Attaccante',         ''),
  ('a10', 'Matteo',    'Esposito',   '2009-12-03', 'Matte',     'cat2', 't2',  10, 'Trequartista',       'Fantasista di qualità'),
  ('a11', 'Lorenzo',   'Ricci',      '2009-07-19', 'Ricky',     'cat2', 't2',  1,  'Portiere',           ''),
  ('a12', 'Alessandro','Marino',     '2009-01-28', 'Alex',      'cat2', 't2',  4,  'Terzino DX',         ''),
  ('a13', 'Giacomo',   'Greco',      '2009-10-15', 'Jack',      'cat2', 't2',  5,  'Difensore Centrale', ''),
  -- Prima Squadra (cat3)
  ('a14', 'Stefano',   'Ferretti',   '2000-03-22', 'Steve',     'cat3', 't1',  9,  'Prima Punta',        'Capitano'),
  ('a15', 'Roberto',   'Caruso',     '1999-08-11', 'Bobby',     'cat3', 't1',  1,  'Portiere',           ''),
  ('a16', 'Nicola',    'De Luca',    '2001-05-07', 'Nico',      'cat3', 't1',  6,  'Mediano',            ''),
  ('a17', 'Massimo',   'Lombardi',   '2000-11-30', 'Max',       'cat3', 't1',  3,  'Terzino SX',         '')
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name,
  dob = excluded.dob, category_id = excluded.category_id,
  team_id = excluded.team_id, number = excluded.number,
  role = excluded.role;

-- ============================================================
-- ATHLETE_SEASONS
-- ============================================================
insert into public.athlete_seasons
  (id, athlete_id, category_id, season_id, team_id, role, shirt_number, join_date, notes)
values
  ('as1',  'a1',  'cat1', 'seas3', 't3',  'Attaccante',         7,  '2025-09-01', ''),
  ('as2',  'a2',  'cat1', 'seas3', 't3',  'Centrocampista',     10, '2025-09-01', ''),
  ('as3',  'a3',  'cat1', 'seas3', 't3',  'Portiere',           1,  '2025-09-01', ''),
  ('as4',  'a4',  'cat1', 'seas3', 't3',  'Difensore Centrale', 4,  '2025-09-01', ''),
  ('as5',  'a5',  'cat1', 'seas3', 't3',  'Prima Punta',        9,  '2025-09-01', ''),
  ('as6',  'a6',  'cat1', 'seas3', 't3',  'Mediano',            5,  '2025-09-01', ''),
  ('as7',  'a7',  'cat1', 'seas3', 't3',  'Ala DX',             11, '2025-09-01', ''),
  ('as8',  'a8',  'cat1', 'seas3', 't3',  'Ala SX',             8,  '2025-09-01', ''),
  ('as9',  'a9',  'cat2', 'seas3', 't2',  'Attaccante',         7,  '2025-09-01', ''),
  ('as10', 'a10', 'cat2', 'seas3', 't2',  'Trequartista',       10, '2025-09-01', ''),
  ('as11', 'a11', 'cat2', 'seas3', 't2',  'Portiere',           1,  '2025-09-01', ''),
  ('as12', 'a12', 'cat2', 'seas3', 't2',  'Terzino DX',         2,  '2025-09-01', ''),
  ('as13', 'a13', 'cat2', 'seas3', 't2',  'Difensore Centrale', 5,  '2025-09-01', ''),
  ('as14', 'a14', 'cat3', 'seas3', 't1',  'Prima Punta',        9,  '2025-09-01', 'Capitano'),
  ('as15', 'a15', 'cat3', 'seas3', 't1',  'Portiere',           1,  '2025-09-01', ''),
  ('as16', 'a16', 'cat3', 'seas3', 't1',  'Mediano',            6,  '2025-09-01', ''),
  ('as17', 'a17', 'cat3', 'seas3', 't1',  'Terzino SX',         3,  '2025-09-01', ''),
  -- Stagione precedente per alcuni atleti
  ('as18', 'a1',  'cat1', 'seas2', 't3',  'Ala DX',             11, '2024-09-01', 'Prima stagione'),
  ('as19', 'a2',  'cat1', 'seas2', 't3',  'Centrocampista',     10, '2024-09-01', ''),
  ('as20', 'a3',  'cat1', 'seas2', 't3',  'Portiere',           1,  '2024-09-01', '')
on conflict (athlete_id, category_id, season_id) do update set
  role = excluded.role, shirt_number = excluded.shirt_number;

-- ============================================================
-- SESSIONS  (sessioni di allenamento e partite)
-- ============================================================
insert into public.sessions
  (id, category_id, date, type, notes, match_id, created_by)
values
  -- cat1 Under 14
  ('sess1',  'cat1', '2025-10-06', 'A', 'Prima seduta di preparazione stagionale', null, null),
  ('sess2',  'cat1', '2025-10-08', 'A', 'Lavoro tattico: pressing alto', null, null),
  ('sess3',  'cat1', '2025-10-11', 'P', 'Partita vs FC Milano Academy', 'm1', null),
  ('sess4',  'cat1', '2025-10-13', 'A', 'Recupero post-partita', null, null),
  ('sess5',  'cat1', '2025-10-15', 'I', 'Lavoro individuale portieri', null, null),
  ('sess6',  'cat1', '2025-10-20', 'A', 'Calci piazzati e corner', null, null),
  ('sess7',  'cat1', '2025-10-22', 'A', 'Partitella interna 6vs6', null, null),
  ('sess8',  'cat1', '2025-10-25', 'P', 'Partita vs Juventus Academy', 'm2', null),
  ('sess9',  'cat1', '2025-10-27', 'A', 'Defaticante post-partita', null, null),
  ('sess10', 'cat1', '2025-11-03', 'A', 'Lavoro fisico intensivo', null, null),
  -- cat2 Under 17
  ('sess11', 'cat2', '2025-10-07', 'A', 'Preseason riatletizzazione', null, null),
  ('sess12', 'cat2', '2025-10-09', 'A', 'Schemi offensivi', null, null),
  ('sess13', 'cat2', '2025-10-12', 'P', 'Amichevole vs Inter Under 17', 'm3', null),
  ('sess14', 'cat2', '2025-10-14', 'I', 'Individuale attaccanti', null, null),
  ('sess15', 'cat2', '2025-10-19', 'A', 'Difesa a zona e uomo', null, null),
  -- cat3 Prima Squadra
  ('sess16', 'cat3', '2025-10-06', 'A', 'Allenamento fisico e tecnico', null, null),
  ('sess17', 'cat3', '2025-10-08', 'A', 'Tattica: transizioni veloci', null, null),
  ('sess18', 'cat3', '2025-10-11', 'P', 'Partita campionato vs Pro Sesto', 'm4', null),
  ('sess19', 'cat3', '2025-10-15', 'A', 'Recupero e stretching', null, null),
  ('sess20', 'cat3', '2025-10-20', 'A', 'Allenamento a ranghi ridotti', null, null)
on conflict (id) do update set
  category_id = excluded.category_id, date = excluded.date,
  type = excluded.type, notes = excluded.notes;

-- ============================================================
-- MATCHES
-- ============================================================
insert into public.matches
  (id, category_id, date, time, meet_time, meet_place, opponent,
   home_away, result, scored, conceded, notes, bg_color, created_by)
values
  ('m1', 'cat1', '2025-10-11', '15:00', '13:30',
   'Campo Sportivo Via Roma 12, Milano',
   'FC Milano Academy', 'home', 'W', 3, 1,
   'Ottima prestazione corale. Tripletta di Sala.', '#1A3A5C', null),

  ('m2', 'cat1', '2025-10-25', '14:30', '13:00',
   'Juventus Training Center, Torino',
   'Juventus Academy', 'away', 'D', 2, 2,
   'Buon risultato in trasferta. Mancini autore dei due gol.', '#2D3748', null),

  ('m3', 'cat2', '2025-10-12', '16:00', '14:30',
   'Centro Sportivo Olimpia, Milano',
   'Inter Under 17', 'home', 'W', 4, 0,
   'Prestazione dominante. Esposito in grande forma.', '#1A3A5C', null),

  ('m4', 'cat3', '2025-10-11', '20:30', '19:00',
   'Stadio Comunale Via Europa 5, Milano',
   'Pro Sesto', 'home', 'W', 2, 0,
   'Clean sheet. Ferretti decisivo nel secondo tempo.', '#0D1117', null)
on conflict (id) do update set
  category_id = excluded.category_id, date = excluded.date,
  opponent = excluded.opponent, result = excluded.result,
  scored = excluded.scored, conceded = excluded.conceded;

-- ============================================================
-- CONVOCATI (per m1 — Under 14 vs FC Milano Academy)
-- ============================================================
insert into public.convocati (id, match_id, athlete_id, status, notes) values
  ('cv1', 'm1', 'a1', 'convocato',     ''),
  ('cv2', 'm1', 'a2', 'convocato',     ''),
  ('cv3', 'm1', 'a3', 'convocato',     ''),
  ('cv4', 'm1', 'a4', 'convocato',     ''),
  ('cv5', 'm1', 'a5', 'convocato',     'Autore della tripletta'),
  ('cv6', 'm1', 'a6', 'convocato',     ''),
  ('cv7', 'm1', 'a7', 'riserva',       ''),
  ('cv8', 'm1', 'a8', 'non_convocato', 'Infortunio caviglia')
on conflict (match_id, athlete_id) do update set status = excluded.status;

-- CONVOCATI per m2 — Under 14 vs Juventus Academy
insert into public.convocati (id, match_id, athlete_id, status, notes) values
  ('cv9',  'm2', 'a1', 'convocato', ''),
  ('cv10', 'm2', 'a2', 'convocato', ''),
  ('cv11', 'm2', 'a3', 'convocato', ''),
  ('cv12', 'm2', 'a4', 'convocato', ''),
  ('cv13', 'm2', 'a5', 'convocato', ''),
  ('cv14', 'm2', 'a6', 'convocato', 'Autore dei 2 gol'),
  ('cv15', 'm2', 'a7', 'convocato', ''),
  ('cv16', 'm2', 'a8', 'riserva',   '')
on conflict (match_id, athlete_id) do update set status = excluded.status;

-- ============================================================
-- ATTENDANCES  (presenze — cat1 sessioni 1-10)
-- ============================================================
insert into public.attendances (id, session_id, athlete_id, status) values
  -- sess1
  ('att1',  'sess1', 'a1', 'P'), ('att2',  'sess1', 'a2', 'P'),
  ('att3',  'sess1', 'a3', 'A'), ('att4',  'sess1', 'a4', 'P'),
  ('att5',  'sess1', 'a5', 'G'), ('att6',  'sess1', 'a6', 'P'),
  ('att7',  'sess1', 'a7', 'P'), ('att8',  'sess1', 'a8', 'P'),
  -- sess2
  ('att9',  'sess2', 'a1', 'P'), ('att10', 'sess2', 'a2', 'P'),
  ('att11', 'sess2', 'a3', 'P'), ('att12', 'sess2', 'a4', 'P'),
  ('att13', 'sess2', 'a5', 'P'), ('att14', 'sess2', 'a6', 'P'),
  ('att15', 'sess2', 'a7', 'A'), ('att16', 'sess2', 'a8', 'P'),
  -- sess3 (partita)
  ('att17', 'sess3', 'a1', 'P'), ('att18', 'sess3', 'a2', 'P'),
  ('att19', 'sess3', 'a3', 'P'), ('att20', 'sess3', 'a4', 'P'),
  ('att21', 'sess3', 'a5', 'P'), ('att22', 'sess3', 'a6', 'P'),
  ('att23', 'sess3', 'a7', 'P'), ('att24', 'sess3', 'a8', 'A'),
  -- sess4
  ('att25', 'sess4', 'a1', 'P'), ('att26', 'sess4', 'a2', 'G'),
  ('att27', 'sess4', 'a3', 'P'), ('att28', 'sess4', 'a4', 'P'),
  ('att29', 'sess4', 'a5', 'P'), ('att30', 'sess4', 'a6', 'P'),
  ('att31', 'sess4', 'a7', 'P'), ('att32', 'sess4', 'a8', 'P'),
  -- sess5
  ('att33', 'sess5', 'a1', 'P'), ('att34', 'sess5', 'a2', 'P'),
  ('att35', 'sess5', 'a3', 'P'), ('att36', 'sess5', 'a4', 'P'),
  ('att37', 'sess5', 'a5', 'A'), ('att38', 'sess5', 'a6', 'P'),
  ('att39', 'sess5', 'a7', 'P'), ('att40', 'sess5', 'a8', 'G'),
  -- sess11-15 (cat2 Under 17)
  ('att41', 'sess11', 'a9',  'P'), ('att42', 'sess11', 'a10', 'P'),
  ('att43', 'sess11', 'a11', 'P'), ('att44', 'sess11', 'a12', 'P'),
  ('att45', 'sess11', 'a13', 'G'),
  ('att46', 'sess12', 'a9',  'P'), ('att47', 'sess12', 'a10', 'P'),
  ('att48', 'sess12', 'a11', 'A'), ('att49', 'sess12', 'a12', 'P'),
  ('att50', 'sess12', 'a13', 'P'),
  ('att51', 'sess13', 'a9',  'P'), ('att52', 'sess13', 'a10', 'P'),
  ('att53', 'sess13', 'a11', 'P'), ('att54', 'sess13', 'a12', 'P'),
  ('att55', 'sess13', 'a13', 'P'),
  -- sess16-20 (cat3 Prima Squadra)
  ('att56', 'sess16', 'a14', 'P'), ('att57', 'sess16', 'a15', 'P'),
  ('att58', 'sess16', 'a16', 'P'), ('att59', 'sess16', 'a17', 'A'),
  ('att60', 'sess17', 'a14', 'P'), ('att61', 'sess17', 'a15', 'P'),
  ('att62', 'sess17', 'a16', 'G'), ('att63', 'sess17', 'a17', 'P'),
  ('att64', 'sess18', 'a14', 'P'), ('att65', 'sess18', 'a15', 'P'),
  ('att66', 'sess18', 'a16', 'P'), ('att67', 'sess18', 'a17', 'P')
on conflict (session_id, athlete_id) do update set status = excluded.status;

-- ============================================================
-- PERFORMANCES  (valutazioni 1-5 per parametro)
-- ============================================================
insert into public.performances (id, session_id, athlete_id, params, notes) values
  -- sess1 (Allenamento Under 14)
  ('pf1',  'sess1', 'a1', '{"tecnica":4,"fisico":3,"tattica":3,"mentale":4,"comunicazione":5}', ''),
  ('pf2',  'sess1', 'a2', '{"tecnica":5,"fisico":4,"tattica":5,"mentale":4,"comunicazione":3}', 'Ottima visione'),
  ('pf3',  'sess1', 'a4', '{"tecnica":3,"fisico":4,"tattica":3,"mentale":3,"comunicazione":3}', ''),
  ('pf4',  'sess1', 'a6', '{"tecnica":4,"fisico":4,"tattica":4,"mentale":4,"comunicazione":4}', ''),
  ('pf5',  'sess1', 'a7', '{"tecnica":3,"fisico":5,"tattica":2,"mentale":3,"comunicazione":3}', ''),
  ('pf6',  'sess1', 'a8', '{"tecnica":4,"fisico":3,"tattica":4,"mentale":5,"comunicazione":4}', ''),
  -- sess2
  ('pf7',  'sess2', 'a1', '{"tecnica":4,"fisico":5,"tattica":4,"mentale":3,"comunicazione":4}', ''),
  ('pf8',  'sess2', 'a2', '{"tecnica":4,"fisico":4,"tattica":4,"mentale":5,"comunicazione":4}', ''),
  ('pf9',  'sess2', 'a3', '{"tecnica":3,"fisico":3,"tattica":2,"mentale":3,"comunicazione":2}', ''),
  ('pf10', 'sess2', 'a4', '{"tecnica":4,"fisico":3,"tattica":4,"mentale":4,"comunicazione":3}', ''),
  ('pf11', 'sess2', 'a5', '{"tecnica":5,"fisico":5,"tattica":4,"mentale":4,"comunicazione":4}', ''),
  -- sess3 (partita W 3-1)
  ('pf12', 'sess3', 'a1', '{"tecnica":4,"fisico":4,"tattica":5,"mentale":5,"comunicazione":4}', 'Assist decisivo'),
  ('pf13', 'sess3', 'a2', '{"tecnica":3,"fisico":4,"tattica":4,"mentale":3,"comunicazione":4}', ''),
  ('pf14', 'sess3', 'a3', '{"tecnica":5,"fisico":4,"tattica":4,"mentale":4,"comunicazione":3}', 'Super parate nel primo tempo'),
  ('pf15', 'sess3', 'a5', '{"tecnica":5,"fisico":5,"tattica":5,"mentale":5,"comunicazione":5}', 'MVP — tripletta'),
  ('pf16', 'sess3', 'a6', '{"tecnica":4,"fisico":4,"tattica":4,"mentale":4,"comunicazione":3}', ''),
  -- Under 17 sess11
  ('pf17', 'sess11', 'a9',  '{"tecnica":4,"fisico":5,"tattica":3,"mentale":4,"comunicazione":3}', ''),
  ('pf18', 'sess11', 'a10', '{"tecnica":5,"fisico":4,"tattica":5,"mentale":5,"comunicazione":4}', 'Fantasista eccellente'),
  ('pf19', 'sess11', 'a11', '{"tecnica":4,"fisico":4,"tattica":4,"mentale":4,"comunicazione":4}', ''),
  ('pf20', 'sess11', 'a12', '{"tecnica":3,"fisico":4,"tattica":3,"mentale":3,"comunicazione":3}', ''),
  -- Prima Squadra sess16
  ('pf21', 'sess16', 'a14', '{"tecnica":5,"fisico":5,"tattica":4,"mentale":5,"comunicazione":4}', 'Leadership in campo'),
  ('pf22', 'sess16', 'a15', '{"tecnica":4,"fisico":4,"tattica":5,"mentale":4,"comunicazione":3}', ''),
  ('pf23', 'sess16', 'a16', '{"tecnica":4,"fisico":4,"tattica":4,"mentale":4,"comunicazione":5}', 'Regia impeccabile')
on conflict (session_id, athlete_id) do update set params = excluded.params, notes = excluded.notes;
