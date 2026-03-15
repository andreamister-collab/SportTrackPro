import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// DEFINIZIONE COSTANTI (Assicurati che siano in cima al file)
const SUPABASE_URL = 'https://jvcplfgozdqirzqfqwox.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Y3BsZmdvemRxaXJ6cWZxd294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTIxMjIsImV4cCI6MjA4OTE2ODEyMn0.-W724h8dTtaAyV1HxydYRddoD1oRxmEm0-zZc_8bxx8';

// 2. INIZIALIZZAZIONE (window.supabase permette l'uso globale)
window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Stato Locale
window.S = {
    sports: [], societies: [], seasons: [], categories: [], 
    teams: [], athletes: [], staff: [], sessions: []
};

// 3. CARICAMENTO DATI DAL FRONT-END
async function loadAllData() {
    const tables = ['sports', 'societies', 'seasons', 'categories', 'teams', 'athletes', 'staff', 'sessions'];
    for (const table of tables) {
        const { data } = await supabase.from(table).select('*');
        window.S[table] = data || [];
    }
    renderActiveView();
}

// 4. FUNZIONE UNIVERSALE DI CENSIMENTO
window.addItem = async function(table, payload) {
    // Rimuove campi vuoti
    Object.keys(payload).forEach(key => (payload[key] == null || payload[key] == "") && delete payload[key]);
    
    const { error } = await supabase.from(table).insert([payload]);
    if (error) {
        alert("Errore DB: " + error.message);
    } else {
        await loadAllData();
    }
};

// 5. GESTIONE VISTE
let currentView = 'setup';
window.showView = (v) => { currentView = v; renderActiveView(); };

function renderActiveView() {
    const main = document.getElementById('main-content');
    
    if (currentView === 'setup') {
        main.innerHTML = `
            <h2>Configurazione Iniziale</h2>
            <div class="grid">
                <div class="form-box">
                    <h3>1. Sport</h3>
                    <input type="text" id="f-sport" placeholder="Nome Sport">
                    <button class="btn-add" onclick="addItem('sports', {name: document.getElementById('f-sport').value})">Aggiungi Sport</button>
                    <ul>${S.sports.map(s => `<li>${s.name}</li>`).join('')}</ul>
                </div>

                <div class="form-box">
                    <h3>2. Società</h3>
                    <select id="f-soc-sport">${S.sports.map(s => `<option value="${s.id}">${s.name}</option>`)}</select>
                    <input type="text" id="f-soc-name" placeholder="Nome Società">
                    <button class="btn-add" onclick="addItem('societies', {name: document.getElementById('f-soc-name').value, sport_id: document.getElementById('f-soc-sport').value})">Aggiungi Società</button>
                </div>

                <div class="form-box">
                    <h3>3. Stagioni</h3>
                    <input type="text" id="f-season" placeholder="Es: 2025/2026">
                    <button class="btn-add" onclick="addItem('seasons', {name: document.getElementById('f-season').value, active: true})">Crea Stagione</button>
                </div>
            </div>
        `;
    }

    if (currentView === 'athletes') {
        main.innerHTML = `
            <h2>Anagrafica Atleti</h2>
            <div class="form-box">
                <input type="text" id="a-nome" placeholder="Nome">
                <input type="text" id="a-cogn" placeholder="Cognome">
                <button class="btn-add" onclick="addItem('athletes', {first_name: document.getElementById('a-nome').value, last_name: document.getElementById('a-cogn').value})">Censisci Atleta</button>
            </div>
            <div class="grid">
                ${S.athletes.map(a => `<div class="card"><b>${a.last_name}</b> ${a.first_name}</div>`).join('')}
            </div>
        `;
    }
}

// Avvio
loadAllData();
