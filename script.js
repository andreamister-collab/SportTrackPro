import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CONFIGURAZIONE SUPABASE (Sostituisci con i tuoi dati reali)
const SUPABASE_URL = 'https://jvcplfgozdqirzqfqwox.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Y3BsZmdvemRxaXJ6cWZxd294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTIxMjIsImV4cCI6MjA4OTE2ODEyMn0.-W724h8dTtaAyV1HxydYRddoD1oRxmEm0-zZc_8bxx8';

window.supabase = createClient(SB_URL, SB_KEY);

window.S = {}; // Stato globale

async function loadData() {
    const tables = ['sports','societies','seasons','categories','teams','athletes','sessions','matches','convocati','staff'];
    const results = await Promise.all(tables.map(t => supabase.from(t).select('*')));
    tables.forEach((t, i) => S[t] = results[i].data || []);
    
    S.activeSeason = S.seasons.find(s => s.active) || S.seasons[0];
    renderDashboard();
}

// Funzione universale per salvare/aggiornare (sostituisce il vecchio localStorage)
window.dbSave = async function(table, payload) {
    const { data, error } = await supabase.from(table).upsert(payload).select();
    if (error) {
        console.error("Errore DB:", error.message);
    } else {
        await loadData(); // Rinfresca tutto
    }
};

// Esempio Creazione Partita con Convocati
window.createMatch = async function(teamId, opponent, athleteIds) {
    // 1. Crea la sessione
    const { data: sess } = await supabase.from('sessions').insert([{
        type: 'Partita', team_id: teamId
    }]).select().single();

    // 2. Crea i dettagli partita
    await supabase.from('matches').insert([{ session_id: sess.id, opponent: opponent }]);

    // 3. Inserisci i convocati
    const list = athleteIds.map(id => ({ session_id: sess.id, athlete_id: id }));
    await supabase.from('convocati').insert(list);
    
    await loadData();
};

// Gestione Login
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if(!error) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        await loadData();
    } else { alert(error.message); }
});
