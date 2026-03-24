/* ============================================================
   IMPORT CONFIG SUPABASE
   ============================================================ */

import { supabaseUrl, supabaseAnonKey } from './config.js';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);


/* ============================================================
   1. NAVIGAZIONE — buildTopNav()
   ============================================================ */

function buildTopNav() {
  const nav = document.getElementById('top-nav');
  nav.innerHTML = `
    <a href="#home">Home</a>
    <a href="#admin">Admin</a>
    <a href="#admin-utenti">Utenti</a>
    <a href="#admin-categorie">Categorie</a>
    <a href="#admin-squadre">Squadre</a>
    <a href="#admin-atleti">Atleti</a>
    <a href="#admin-staff">Staff</a>
    <a href="#settings">Impostazioni</a>
    <a href="#profilo">Profilo</a>
    <a href="#logout">Logout</a>
  `;
}


/* ============================================================
   2. BADGE RUOLI — FUNZIONE CENTRALIZZATA
   ============================================================ */

function getRoleBadgeClass(role) {
  const map = {
    admin: 'badge-blue',
    responsabile: 'badge-purple',
    dirigente: 'badge-green',
    allenatore: 'badge-gold',
    professionista: 'badge-teal'
  };
  return map[role] || 'badge-gray';
}


/* ============================================================
   3. STAGIONE ATTIVA — SINGLE SOURCE OF TRUTH
   ============================================================ */

const S = {
  activeSeason: null
};

function getActiveSeason() {
  return { id: "2024-2025" };
}

function ensureActiveSeason() {
  if (!S.activeSeason) {
    const active = getActiveSeason();
    S.activeSeason = active ? active.id : '';
  }
}


/* ============================================================
   4. PERMESSI OTTIMIZZATI
   ============================================================ */

const baseAllowed = [
  "view-dashboard",
  "view-users",
  "view-categories"
];

const presidentAllowed = [...baseAllowed];
const segretarioAllowed = [...baseAllowed, "edit-users", "edit-categories"];


/* ============================================================
   5. VIEW BUILDERS — TUTTE LE SEZIONI
   ============================================================ */

const viewBuilders = {

  "home": () => {
    document.getElementById("content").innerHTML = `
      <h1>Benvenuto</h1>
      <p>Seleziona una sezione dal menu.</p>
    `;
  },

  "admin": () => {
    document.getElementById("content").innerHTML = `
      <h1>Area Amministrativa</h1>
      <ul class="admin-menu">
        <li><a href="#admin-overview">Panoramica</a></li>
        <li><a href="#admin-utenti">Gestione Utenti</a></li>
        <li><a href="#admin-categorie">Gestione Categorie</a></li>
        <li><a href="#admin-squadre">Gestione Squadre</a></li>
        <li><a href="#admin-atleti">Gestione Atleti</a></li>
        <li><a href="#admin-staff">Gestione Staff</a></li>
        <li><a href="#settings">Impostazioni</a></li>
      </ul>
    `;
  },

  "admin-overview": () => {
    const season = S.activeSeason;
    document.getElementById("content").innerHTML = `
      <h1>Admin Overview</h1>
      <p>Stagione attiva: ${season}</p>
      <p>Statistiche, riepiloghi e notifiche.</p>
    `;
  },

  "admin-utenti": () => {
    document.getElementById("content").innerHTML = `
      <h1>Gestione Utenti</h1>
      <p>Elenco utenti, ruoli e permessi.</p>
    `;
  },

  "admin-categorie": () => {
    document.getElementById("content").innerHTML = `
      <h1>Gestione Categorie</h1>
      <p>Creazione e modifica categorie.</p>
    `;
  },

  "admin-squadre": () => {
    document.getElementById("content").innerHTML = `
      <h1>Gestione Squadre</h1>
      <p>Creazione squadre e assegnazione atleti.</p>
    `;
  },

  "admin-atleti": () => {
    document.getElementById("content").innerHTML = `
      <h1>Gestione Atleti</h1>
      <p>Schede atleti, documenti e stato tesseramento.</p>
    `;
  },

  "admin-staff": () => {
    document.getElementById("content").innerHTML = `
      <h1>Gestione Staff</h1>
      <p>Allenatori, dirigenti e ruoli tecnici.</p>
    `;
  },

  "settings": () => {
    document.getElementById("content").innerHTML = `
      <h1>Impostazioni</h1>
      <p>Preferenze e configurazioni.</p>
    `;
  },

  "profilo": () => {
    document.getElementById("content").innerHTML = `
      <h1>Profilo Utente</h1>
      <p>Informazioni personali e password.</p>
    `;
  },

  "logout": () => {
    document.getElementById("content").innerHTML = `
      <h1>Logout</h1>
      <p>Sei stato disconnesso.</p>
    `;
  }

};


/* ============================================================
   6. ROUTER
   ============================================================ */

function showView(view) {
  if (!viewBuilders[view]) {
    document.getElementById("content").innerHTML = `<h1>404</h1><p>Pagina non trovata.</p>`;
    return;
  }
  viewBuilders[view]();
}

window.addEventListener("hashchange", () => {
  const view = location.hash.replace("#", "") || "home";
  showView(view);
});


/* ============================================================
   7. AVVIO APP
   ============================================================ */

ensureActiveSeason();
buildTopNav();
showView("home");
