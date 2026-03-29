# ⚽ SportTrackPro — Gestione Società Calcistica

Piattaforma web/mobile per la gestione completa di una o più società calcistiche.  
Funziona come **Single Page Application** (un solo file HTML) collegata a **Supabase** come backend.

---

## 🚀 Deploy su GitHub Pages

### 1. Crea il repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO-USERNAME/sporttrackpro.git
git push -u origin main
```

### 2. Attiva GitHub Pages

- Vai su **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` → cartella `/root`
- Il sito sarà online su: `https://TUO-USERNAME.github.io/sporttrackpro`

### 3. Struttura consigliata del repository

```
/
├── index.html              ← SportTrackPro_supabase.html rinominato
├── README.md
├── supabase_setup.sql      ← Script SQL da eseguire su Supabase
└── db.js                   ← (opzionale) credenziali separate
```

> **Nota:** Le credenziali Supabase sono già incorporate nel file HTML.  
> Per maggiore sicurezza puoi usare le Supabase Row Level Security (RLS).

---

## 🗄️ Setup Supabase

### 1. Crea il progetto

- Vai su [supabase.com](https://supabase.com) → **New Project**
- Scegli nome e password database

### 2. Esegui il setup SQL

- Dashboard Supabase → **SQL Editor** → **New Query**
- Copia e incolla il contenuto di `supabase_setup.sql`
- Clicca **Run**

Questo crea tutte le tabelle + i dati demo.

### 3. Verifica le tabelle

Vai su **Table Editor** e verifica che esistano:

| Tabella | Contenuto |
|---|---|
| `sports` | Sport (Calcio, Basket...) |
| `societies` | Società sportive |
| `seasons` | Stagioni calcistiche |
| `teams` | Squadre |
| `categories` | Categorie (Under 14, Seniores...) |
| `users` | Utenti e staff |
| `athletes` | Anagrafica atleti |
| `athlete_team_seasons` | Iscrizione atleti per stagione |
| `sessions` | Allenamenti e partite |
| `attendances` | Presenze per sessione |

---

## 🔒 Ruoli e Coni di Visibilità

| Ruolo | Accesso |
|---|---|
| 🔑 **Admin** | Tutto il sistema, configurazione completa |
| 👑 **Presidente** | Tutta la società — vede tutto, gestisce staff e stagioni |
| 📋 **Segretario** | Come Presidente (ruolo operativo primario) |
| ⭐ **Responsabile** | Le sue categorie + dashboard e report società |
| 🏛️ **Dirigente** | Solo le categorie assegnate (completo) |
| ⚽ **Allenatore** | Solo le sue categorie — sessioni, presenze, atleti |
| 🩺 **Professionista** | Solo lettura nelle categorie assegnate |
| 👨‍👦 **Genitore** | Solo dati del proprio figlio/a |
| 🏃 **Atleta** | Solo i propri dati personali |

> Il **Presidente** agisce solo in assenza del **Segretario** (quest'ultimo è il ruolo operativo primario).

---

## 🔑 Credenziali Demo

| Username | Password | Ruolo |
|---|---|---|
| `admin` | `admin123` | Amministratore |
| `presidente` | `pres123` | Presidente |
| `segretario` | `segr123` | Segretario |
| `responsabile` | `resp123` | Responsabile |
| `dirigente` | `dir123` | Dirigente |
| `allenatore` | `all123` | Allenatore |
| `professionista` | `prof123` | Professionista |
| `genitore` | `gen123` | Genitore |
| `atleta` | `atl123` | Atleta |

---

## 🏗️ Architettura

```
Browser (HTML/JS)
    │
    ├── Supabase JS Client (@supabase/supabase-js v2)
    │       │
    │       └── Supabase Cloud (PostgreSQL)
    │               ├── Row Level Security (RLS)
    │               └── Real-time subscriptions (future)
    │
    └── GitHub Pages (hosting statico gratuito)
```

### Flusso dati

1. L'utente apre il sito → carica da localStorage (cache) per velocità
2. Login → autentica su tabella `users` di Supabase
3. Dopo login → carica TUTTI i dati con `Promise.all` (10 tabelle in parallelo)
4. Ogni modifica (salva atleta, sessione, presenza...) → `upsert` su Supabase in tempo reale
5. Cache localStorage aggiornata per offline fallback

---

## 📁 Principio "Reset Logico Stagionale"

Ogni **stagione** è indipendente:
- Gli **utenti** restano nel database permanentemente
- Le **associazioni** (atleta ↔ squadra, staff ↔ categoria) vengono ricreate ogni anno
- La tabella `athlete_team_seasons` gestisce la storicizzazione per stagione
- La tabella `user_category_seasons` (futura) gestirà lo storico staff

---

## 🔧 Manutenzione e Sicurezza

### Per produzione

1. **Password**: attualmente in chiaro — integrare Supabase Auth
2. **RLS**: già abilitata, le policy `anon_all_*` vanno ristrette con `auth.uid()`
3. **Backup**: usare il backup automatico di Supabase (piano Pro) o pg_dump

### Aggiornare le credenziali Supabase

Cerca nel file HTML:
```js
const SUPABASE_URL = 'https://...supabase.co';
const SUPABASE_KEY = 'eyJ...';
```

---

## 📱 Compatibilità

- ✅ Chrome / Edge / Safari / Firefox (desktop)
- ✅ iOS Safari / Chrome Mobile
- ✅ Android Chrome
- ✅ PWA-ready (aggiungibile alla schermata home)

---

## 📄 Licenza

Uso interno — ASD / società sportiva. Non per distribuzione commerciale.
