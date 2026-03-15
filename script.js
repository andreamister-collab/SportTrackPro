import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// DEFINIZIONE COSTANTI (Assicurati che siano in cima al file)
const SB_URL = 'https://tuo-id.supabase.co';
const SB_KEY = 'tua-chiave-anon';

// Inizializzazione
window.supabase = createClient(SB_URL, SB_KEY);

// Stato globale accessibile ovunque
window.S = {
    sports: [], societies: [], seasons: [], categories: [], 
    teams: [], athletes: [], sessions: []
};

// Caricamento dati
async function loadAll() {
    const tables = ['sports', 'societies', 'seasons', 'categories', 'teams', 'athletes', 'sessions'];
    for (const t of tables) {
        const { data } = await supabase.from(t).select('*');
        window.S[t] = data || [];
    }
    renderActiveView();
}

// Funzione universale per aggiungere dati da Front-End
window.addItem = async function(table, payload) {
    if (!payload) return;
    const { error } = await supabase.from(table).insert([payload]);
    if (error) {
        alert("Errore durante il salvataggio: " + error.message);
    } else {
        console.log(`${table} salvato con successo`);
        await loadAll();
    }
};

// Gestore Viste
let currentView = 'setup';
window.showView = (v) => { 
    currentView = v; 
    renderActiveView(); 
};

function renderActiveView() {
    const container = document.getElementById('main-content');
    if (!container) return;

    if (currentView === 'setup') {
        container.innerHTML = `
            <div class="form-box">
                <h3>1. Censimento Sport</h3>
                <input type="text" id="in-sport" placeholder="Nome Sport (es. Calcio)">
                <button onclick="addItem('sports', {name: document.getElementById('in-sport').value})">Crea Sport</button>
                <div class="mini-list">${S.sports.map(s => `<span>${s.name}</span>`).join(', ')}</div>
            </div>

            <div class="form-box">
                <h3>2. Censimento Società</h3>
                <select id="sel-sport">${S.sports.map(s => `<option value="${s.id}">${s.name}</option>`)}</select>
                <input type="text" id="in-soc" placeholder="Nome Società">
                <button onclick="addItem('societies', {name: document.getElementById('in-soc').value, sport_id: document.getElementById('sel-sport').value})">Crea Società</button>
            </div>

            <div class="form-box">
                <h3>3. Censimento Stagione</h3>
                <input type="text" id="in-sea" placeholder="Es. 2025/26">
                <button onclick="addItem('seasons', {name: document.getElementById('in-sea').value, active: true})">Crea Stagione</button>
            </div>
        `;
    }
    // Aggiungi qui le altre viste (athletes, sessions, etc.)
}

// Avvio iniziale
loadAll();
