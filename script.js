import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CONFIGURAZIONE SUPABASE (Sostituisci con i tuoi dati reali)
const SUPABASE_URL = 'https://jvcplfgozdqirzqfqwox.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Y3BsZmdvemRxaXJ6cWZxd294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTIxMjIsImV4cCI6MjA4OTE2ODEyMn0.-W724h8dTtaAyV1HxydYRddoD1oRxmEm0-zZc_8bxx8';

window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Stato dell'applicazione
window.S = {
    athletes: [],
    sessions: [],
    categories: [],
    users: []
};

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-login').addEventListener('click', handleLogin);
});

async function handleLogin() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    // Nota: Ho usato un hack semplice per il login come nel tuo originale
    // Per un login reale usa: await supabase.auth.signInWithPassword(...)
    if (user && pass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').classList.add('visible');
        await loadData();
        showView('dashboard');
    }
}

// --- CARICAMENTO DATI DAL DB ---
async function loadData() {
    console.log("Sincronizzazione con Supabase...");
    
    // Carichiamo le tabelle principali
    const [ath, sess, cats] = await Promise.all([
        supabase.from('athletes').select('*'),
        supabase.from('sessions').select('*'),
        supabase.from('categories').select('*')
    ]);

    window.S.athletes = ath.data || [];
    window.S.sessions = sess.data || [];
    window.S.categories = cats.data || [];
}

// --- GESTIONE VISTE (Rendering) ---
window.showView = function(viewName) {
    const container = document.getElementById('main-content');
    
    if (viewName === 'dashboard') {
        container.innerHTML = `
            <h2>Bentornato</h2>
            <div class="stat-grid">
                <div class="stat-card"><h3>${S.athletes.length}</h3><p>Atleti Totali</p></div>
                <div class="stat-card"><h3>${S.sessions.length}</h3><p>Allenamenti</p></div>
            </div>
        `;
    } else if (viewName === 'athletes') {
        renderAthletes(container);
    }
};

function renderAthletes(el) {
    let html = `<h2>Anagrafica Atleti</h2><ul style="list-style:none; padding:0;">`;
    S.athletes.forEach(a => {
        html += `<li style="background:var(--ink-2); margin-bottom:0.5rem; padding:1rem; border-radius:0.5rem;">
            ${a.first_name} ${a.last_name} 
        </li>`;
    });
    html += `</ul><button class="btn-primary" onclick="addAthletePrompt()">+ Aggiungi Atleta</button>`;
    el.innerHTML = html;
}

// --- SALVATAGGIO (Scrive direttamente su Supabase) ---
window.addAthletePrompt = async function() {
    const name = prompt("Nome:");
    const surname = prompt("Cognome:");
    
    if (name && surname) {
        const { data, error } = await supabase
            .from('athletes')
            .insert([{ first_name: name, last_name: surname }])
            .select();

        if (!error) {
            await loadData(); // Ricarica lo stato locale
            showView('athletes'); // Aggiorna la vista
        } else {
            alert("Errore salvataggio: " + error.message);
        }
    }
};
