# ⚽ SportTrack Pro

Piattaforma professionale per la **gestione di società sportive** e **stagioni calcistiche**.
Supporta più società, più categorie, più stagioni — tutto in un unico file HTML connesso a Supabase.

---

## 🚀 Funzionalità principali

| Area | Funzioni |
|------|----------|
| **Multi-società** | Gestisci ASD diverse da un'unica piattaforma |
| **Stagioni** | Storico per stagione, con stagione attiva selezionabile |
| **Categorie & Squadre** | Under 12, Under 14, Prima Squadra, Femminile… |
| **Atleti** | Censimento, profilo, storico stagioni, import Excel |
| **Sessioni** | Allenamento, Partita, Individual, Psicomotricità |
| **Presenze** | Registro presenze con stati P/A/G per ogni sessione |
| **Performance** | Valutazioni 1–5 per parametri configurabili (tecnica, fisico…) |
| **Partite & Convocati** | Gestione gare, risultati, convocazioni |
| **Report & Export** | Dashboard statistiche, export Excel, PDF rosa |
| **Ruoli** | Admin, Responsabile, Dirigente, Allenatore, Professionista |
| **Box sintesi cliccabili** | Ogni card KPI naviga alla sezione corrispondente |

---

## 🗂️ Struttura del progetto

```
sporttrackpro/
├── index.html          ← App completa (single-file)
├── 01_schema.sql       ← Creazione tabelle Supabase
├── 02_seed_data.sql    ← Dati di esempio senza NULL
└── README.md
```

---

## ⚙️ Setup Supabase

### 1. Crea il progetto Supabase
1. Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto
2. Annota **Project URL** e **anon public key** da *Settings → API*

### 2. Crea le tabelle
1. Apri il **SQL Editor** di Supabase
2. Incolla e **esegui** `01_schema.sql`

### 3. Crea gli utenti in Supabase Auth
Per ogni utente dell'applicazione:
1. Vai su **Authentication → Users → Invite user** (oppure *Add user*)
2. Usa email nel formato: `nomeutente@tuodominio.it`  
   Esempi: `admin@olimpia.it`, `mario.rossi@olimpia.it`
3. Imposta una password sicura
4. Copia il **UUID** generato da Supabase

### 4. Inserisci i dati di esempio
1. Apri `02_seed_data.sql`
2. Sostituisci i placeholder UUID nella sezione `USERS` con i UUID reali degli utenti che hai creato
3. Esegui il file nel **SQL Editor**

### 5. Configura `index.html`
Apri `index.html` e sostituisci le due righe all'inizio dello script:

```javascript
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_KEY';
```

Con i tuoi valori reali presi da *Supabase → Settings → API*.

---

## 👤 Ruoli e permessi

| Ruolo | Cosa può fare |
|-------|--------------|
| **Admin** | Tutto: configurazione, utenti, società, reset |
| **Responsabile** | Dashboard società, report, gestione categorie assegnate |
| **Dirigente** | Gestione completa di una categoria (atleti, sessioni, partite) |
| **Allenatore** | Inserimento sessioni e presenze della categoria assegnata |
| **Professionista** | Lettura/visualizzazione dati (es. fisioterapista) |

---

## 🗄️ Schema database

```
sports ──────┬──── societies ──┬──── teams ─────┬──── categories
             │                 │                 │        │
             │                 │    seasons ─────┤        │
             │                 │                 │        │
             │            users (auth)            │    athletes ──── athlete_seasons
             │                                   │        │
             │                              sessions ─────┼──── attendances
             │                                   │        └──── performances
             │                              matches ──────────── convocati
             └──────────────────────────────────────────────────────────────
```

---

## 🔑 Login di default (dati seed)

> **Nota:** le password sono quelle impostate in Supabase Auth quando hai creato gli utenti.
> L'username corrisponde alla parte prima della `@` dell'email.

| Username | Email | Ruolo |
|----------|-------|-------|
| `admin` | admin@olimpia.it | Amministratore |
| `mario.rossi` | mario.rossi@olimpia.it | Dirigente |
| `anna.verdi` | anna.verdi@olimpia.it | Responsabile |
| `carlo.bianchi` | carlo.bianchi@olimpia.it | Allenatore |
| `giulia.neri` | giulia.neri@olimpia.it | Professionista |

---

## 🌐 Deploy su GitHub Pages

1. Crea un repository GitHub (anche privato)
2. Carica i file (o fai push)
3. Vai su **Settings → Pages → Source: main / root**
4. L'app sarà disponibile su `https://tuousername.github.io/nomerepository`

> **⚠️ Sicurezza:** Prima di rendere il repository pubblico, assicurati che `index.html`  
> contenga i **placeholder** `YOUR_PROJECT_ID` / `YOUR_ANON_KEY` e non le credenziali reali.  
> La `anon key` di Supabase è comunque progettata per essere pubblica (la sicurezza è  
> garantita dalle Row Level Security policies), ma è buona pratica usare variabili d'ambiente  
> se usi un build tool (Vite, Netlify, Vercel).

---

## 🛠️ Tecnologie

- **Frontend:** HTML5, CSS3 (custom design system), Vanilla JavaScript ES2022
- **Backend:** [Supabase](https://supabase.com) (PostgreSQL + Auth + Realtime)
- **Librerie:** `@supabase/supabase-js`, `SheetJS (XLSX)`, `jsPDF`
- **Font:** DM Sans, Syne, JetBrains Mono (Google Fonts)

---

## 📝 Note tecniche

- L'app funziona anche **offline/local** (fallback `localStorage`) se Supabase non è raggiungibile
- Il **sync** avviene automaticamente ogni 60 secondi e a ogni modifica (debounced 800ms)
- Le **RLS policies** permettono accesso completo agli utenti autenticati — affina per `society_id` in produzione
- I box KPI della dashboard sono **cliccabili** e navigano alla sezione corrispondente
