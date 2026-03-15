// Supabase Client (usa env vars su deploy)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
window.supabase = createClient(
  import.meta.env?.SUPABASE_URL || 'https://demo.supabase.co',
  import.meta.env?.SUPABASE_ANON_KEY || 'demo-key'
)

// Carica TUTTI i dati
async function loadData() {
  const [{data:users}, {data:sports}, {data:societies}, {data:teams}, {data:categories}, 
         {data:athletes}, {data:sessions}, {data:attendances}, {data:matches}, {data:convocati}] = 
    await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('sports').select('*'),
      supabase.from('societies').select('*'),
      supabase.from('teams').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('athletes').select('*'),
      supabase.from('sessions').select('*'),
      supabase.from('attendances').select('*'),
      supabase.from('matches').select('*'),
      supabase.from('convocati').select('*')
    ]);
  window.S = { users, sports, societies, teams, categories, athletes, sessions, attendances, matches, convocati };
  window.currentUser = users.find(u => u.id === supabase.auth.getUser().data.user?.id);
  // Ricostruisci menu e mostra home
  buildTopnavMenu();
  showView(currentUser?.role === 'admin' ? 'admin-overview' : 'category-home');
}

// Auth + Login (sostituisci doLogin originale)
async function doLogin() {
  const email = document.getElementById('login-user').value + '@olimpia.it'; // hack username
  const pass = document.getElementById('login-pass').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) return toast('Errore: ' + error.message, 'error');
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  loadData();
}

// **TUTTE le viewBuilders ORIGINALI** (copia dal tuo <script>)
const viewBuilders = {
  'admin-overview': (el) => { /* codice completo dashboard da HTML */ el.innerHTML = `...`; },
  'admin-config': (el) => { /* tabs config */ },
  'athletes': (el) => { /* roster + censimento */ },
  'sessions': (el) => { /* lista + matrix presenze */ },
  'matches': (el) => { /* partite + convocati */ },
  'cat-dashboard': (el) => { /* dashboard categoria */ },
  'admin-athletes': (el) => { /* censimento globale */ },
  // ... INSERISCI TUTTE le altre da file originale (cerca "viewBuilders")
};

// Save functions → Supabase upsert
async function saveAthlete(ath) { await supabase.from('athletes').upsert(ath); loadData(); }
// Analogamente per tutte (sessions, categories, etc.)

// Init
supabase.auth.onAuthStateChange((_, session) => { if (session) loadData(); });
