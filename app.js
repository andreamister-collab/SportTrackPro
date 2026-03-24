import { supabaseUrl, supabaseAnonKey } from './config.js';

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const S = {
  user: null,              // riga di users
  systemRole: null,        // 'admin' o null (per ora dedotto da profession)
  rolesSportivi: [],       // righe user_category_seasons per stagione attiva
  activeSeason: null
};

/* UTIL */

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
}

function setViewTitle(title) {
  document.getElementById('view-title').textContent = title;
}

function setActiveSeasonLabel() {
  document.getElementById('active-season-label').textContent =
    S.activeSeason ? S.activeSeason.name : '-';
}

/* BADGE RUOLI */

function getRoleBadgeClass(role) {
  const map = {
    admin: 'badge-blue',
    presidente: 'badge-purple',
    responsabile: 'badge-green',
    dirigente: 'badge-gold',
    professionista: 'badge-teal',
    allenatore: 'badge-blue',
    genitore: 'badge-gray'
  };
  return map[role] || 'badge-gray';
}

/* STAGIONE ATTIVA */

async function ensureActiveSeason() {
  if (S.activeSeason) return;
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('active', true)
    .maybeSingle();
  if (error) {
    console.error(error);
    showToast('Errore nel recupero stagione attiva');
    return;
  }
  S.activeSeason = data;
  setActiveSeasonLabel();
}

/* LOGIN (username da tabella users) */

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const errBox = document.getElementById('login-error');
  errBox.textContent = '';

  if (!username) {
    errBox.textContent = 'Inserisci uno username';
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error || !data) {
    errBox.textContent = 'Utente non trovato';
    return;
  }

  S.user = data;
  // per ora: admin di sistema se profession = 'admin'
  S.systemRole = (data.profession && data.profession.toLowerCase() === 'admin') ? 'admin' : null;

  document.getElementById('user-info').textContent = `${data.name || ''} (${data.username})`;

  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('main-layout').classList.remove('hidden');

  await ensureActiveSeason();
  await loadRuoliSportivi();
  buildSidebar();
  navigate('dashboard');
}

async function handleLogout() {
  S.user = null;
  S.systemRole = null;
  S.rolesSportivi = [];
  document.getElementById('main-layout').classList.add('hidden');
  document.getElementById('login-view').classList.remove('hidden');
}

/* RUOLI SPORTIVI (user_category_seasons) */

async function loadRuoliSportivi() {
  if (!S.user || !S.activeSeason) return;
  const { data, error } = await supabase
    .from('user_category_seasons')
    .select('*, categories(name), societies(name)')
    .eq('user_id', S.user.id)
    .eq('season_id', S.activeSeason.id);

  if (error) {
    console.error(error);
    showToast('Errore nel recupero ruoli');
    return;
  }
  S.rolesSportivi = data || [];
}

/* SIDEBAR DINAMICA */

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const items = [];

  // tutti vedono dashboard
  items.push({ id: 'dashboard', label: 'Dashboard' });

  if (S.systemRole === 'admin') {
    items.push(
      { id: 'societies', label: 'Società' },
      { id: 'categories', label: 'Categorie' },
      { id: 'teams', label: 'Squadre' },
      { id: 'athletes', label: 'Atleti' },
      { id: 'staff', label: 'Staff' },
      { id: 'matches', label: 'Partite' },
      { id: 'sessions', label: 'Sessioni' },
      { id: 'config', label: 'Config' },
      { id: 'profile', label: 'Profilo' },
      { id: 'logout', label: 'Logout' }
    );
  } else {
    const ruoli = S.rolesSportivi.map(r => r.role);

    if (ruoli.includes('presidente')) {
      items.push(
        { id: 'societies', label: 'Società' },
        { id: 'staff', label: 'Staff' }
      );
    }
    if (ruoli.includes('responsabile')) {
      items.push(
        { id: 'categories', label: 'Categorie' },
        { id: 'teams', label: 'Squadre' }
      );
    }
    if (ruoli.includes('allenatore') || ruoli.includes('dirigente')) {
      items.push(
        { id: 'athletes', label: 'Atleti' },
        { id: 'matches', label: 'Partite' },
        { id: 'sessions', label: 'Sessioni' }
      );
    }
    // genitore: deducibile da contesto, per ora se profession = 'genitore'
    if (S.user.profession && S.user.profession.toLowerCase() === 'genitore') {
      items.push({ id: 'my-athletes', label: 'I miei figli' });
    }

    items.push(
      { id: 'profile', label: 'Profilo' },
      { id: 'logout', label: 'Logout' }
    );
  }

  nav.innerHTML = items.map(i => `<a href="#${i.id}" data-view="${i.id}">${i.label}</a>`).join('');

  nav.onclick = (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    const view = a.dataset.view;
    navigate(view);
  };
}

/* VIEW BUILDERS */

const viewBuilders = {

  dashboard: async () => {
    setViewTitle('Dashboard');
    const el = document.getElementById('content');
    el.innerHTML = `
      <h2>Panoramica</h2>
      <p>Stagione attiva: <strong>${S.activeSeason ? S.activeSeason.name : '-'}</strong></p>
      <p>Ruoli stagionali:</p>
      <ul>
        ${S.rolesSportivi.map(r => `
          <li>
            <span class="${getRoleBadgeClass(r.role)}">${r.role}</span>
            — ${r.categories ? r.categories.name : ''} ${r.societies ? '(' + r.societies.name + ')' : ''}
          </li>
        `).join('') || '<li>Nessun ruolo assegnato per questa stagione.</li>'}
      </ul>
    `;
  },

  /* SOCIETÀ (societies, legate opzionalmente a season_id) */

  societies: async () => {
    setViewTitle('Società');
    const el = document.getElementById('content');
    el.innerHTML = `
      <div class="form-inline">
        <input type="text" id="new-soc-name" placeholder="Nome società">
        <input type="text" id="new-soc-city" placeholder="Città">
        <input type="email" id="new-soc-email" placeholder="Email">
        <button class="btn btn-primary" id="btn-add-soc">Aggiungi</button>
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Città</th><th>Email</th><th>Stagione</th><th>Azioni</th></tr></thead>
        <tbody id="soc-tbody"></tbody>
      </table>
    `;

    document.getElementById('btn-add-soc').onclick = async () => {
      const name = document.getElementById('new-soc-name').value.trim();
      const city = document.getElementById('new-soc-city').value.trim();
      const email = document.getElementById('new-soc-email').value.trim();
      if (!name || !S.activeSeason) return;
      const { error } = await supabase.from('societies').insert({
        id: crypto.randomUUID(),
        name,
        city,
        email,
        season_id: S.activeSeason.id
      });
      if (error) { showToast('Errore creazione società'); return; }
      showToast('Società creata');
      viewBuilders.societies();
    };

    const { data, error } = await supabase
      .from('societies')
      .select('*')
      .eq('season_id', S.activeSeason