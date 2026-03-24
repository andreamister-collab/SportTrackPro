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
    <nav>
      <a href="#home">Home</a>
      <a href="#admin">Admin</a>
      <a href="#categorie">Categorie</a>
    </nav>
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
  // Recupero simulato — sostituisci con query Supabase se necessario
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

const segretarioAllowed = [
  ...baseAllowed,
  "edit-users",
  "edit-categories"
];


/* ============================================================
   5. VIEW BUILDERS
   ============================================================ */

const viewBuilders = {

  "admin-overview": () => {
    const season = S.activeSeason;
    const html = `
      <h1>Admin Overview</h1>
      <p>Stagione attiva: ${season}</p>
    `;
    document.getElementById("content").innerHTML = html;
  },

  "category-home": () => {
    const season = S.activeSeason;
    document.getElementById("content").innerHTML = `
      <h1>Categorie</h1>
      <p>Stagione attiva: ${season}</p>
    `;
  },

  "home": () => {
    document.getElementById("content").innerHTML = `
      <h1>Benvenuto</h1>
