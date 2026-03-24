import { supabaseUrl, supabaseAnonKey } from './config.js';

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const S = {
  user: null,
  systemRole: null,
  rolesSportivi: [],
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

/* RUOLI SPORTIVI */

async function loadRuoliSportivi() {
  if (!S.user || !S.activeSeason) return;

  const { data, error } = await supabase
    .from('user_category_seasons')
    .select('id, role, categories(name), societies(name)')
    .eq('user_id', S.user.id)
    .eq('season_id', S.activeSeason.id);

  if (error) {
    console.error(error);
    showToast('Errore nel recupero ruoli');
    return;
  }

  S.rolesSportivi = data || [];
}

/* LOGIN */

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errBox = document.getElementById('login-error');
  errBox.textContent = '';

  if (!username || !password) {
    errBox.textContent = 'Inserisci username e password';
    return;
  }

  const emailForAuth = `${username}@mail.com`;

  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: emailForAuth,
    password
  });

  if (authErr) {
    errBox.textContent = 'Credenziali non valide';
    return;
  }

  const { data: userRow, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (userErr || !userRow) {
    errBox.textContent = 'Profilo utente non trovato';
    return;
  }

  S.user = userRow;
  S.systemRole = userRow.profession?.toLowerCase() === 'admin' ? 'admin' : null;

  document.getElementById('user-info').textContent =
    `${userRow.name || ''} (${userRow.username})`;

  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('main-layout').classList.remove('hidden');

  await ensureActiveSeason();
  await loadRuoliSportivi();
  buildSidebar();
  navigate('dashboard');
}

async function handleLogout() {
  await supabase.auth.signOut();
  S.user = null;
  S.systemRole = null;
  S.rolesSportivi = [];

  document.getElementById('main-layout').classList.add('hidden');
  document.getElementById('login-view').classList.remove('hidden');
}

/* SIDEBAR DINAMICA */

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const items = [];

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

    if (S.user.profession?.toLowerCase() === 'genitore') {
      items.push({ id: 'my-athletes', label: 'I miei figli' });
    }

    items.push(
      { id: 'profile', label: 'Profilo' },
      { id: 'logout', label: 'Logout' }
    );
  }

  nav.innerHTML = items
    .map(i => `<a href="#${i.id}" data-view="${i.id}">${i.label}</a>`)
    .join('');

  nav.onclick = ev => {
    const a = ev.target.closest('a');
    if (!a) return;
    navigate(a.dataset.view);
  };
}

/* VIEW BUILDERS */

const viewBuilders = {
  dashboard: async () => {
    setViewTitle('Dashboard');
    document.getElementById('content').innerHTML = `
      <h2>Panoramica</h2>
      <p>Stagione attiva: <strong>${S.activeSeason?.name || '-'}</strong></p>
      <p>Ruoli stagionali:</p>
      <ul>
        ${
          S.rolesSportivi.length
            ? S.rolesSportivi
                .map(
                  r => `
          <li>
            <span class="${getRoleBadgeClass(r.role)}">${r.role}</span>
            — ${r.categories?.name || ''} ${r.societies ? '(' + r.societies.name + ')' : ''}
          </li>`
                )
                .join('')
            : '<li>Nessun ruolo assegnato per questa stagione.</li>'
        }
      </ul>
    `;
  },

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
        <thead><tr><th>Nome</th><th>Città</th><th>Email</th><th>Azioni</th></tr></thead>
        <tbody id="soc-tbody"></tbody>
      </table>
    `;

    document.getElementById('btn-add-soc').onclick = async () => {
      const name = document.getElementById('new-soc-name').value.trim();
      const city = document.getElementById('new-soc-city').value.trim();
      const email = document.getElementById('new-soc-email').value.trim();

      if (!name) return;

      const { error } = await supabase.from('societies').insert({
        id: crypto.randomUUID(),
        name,
        city,
        email,
        season_id: S.activeSeason.id
      });

      if (error) {
        showToast('Errore creazione società');
        return;
      }

      showToast('Società creata');
      viewBuilders.societies();
    };

    const { data, error } = await supabase
      .from('societies')
      .select('*')
      .eq('season_id', S.activeSeason.id)
      .order('name');

    if (error) {
      showToast('Errore caricamento società');
      return;
    }

    const tbody = document.getElementById('soc-tbody');
    tbody.innerHTML = data
      .map(
        s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.city}</td>
        <td>${s.email}</td>
        <td><button class="btn btn-danger" data-id="${s.id}" data-action="del">Elimina</button></td>
      </tr>`
      )
      .join('');

    tbody.onclick = async ev => {
      const btn = ev.target.closest('button');
      if (!btn) return;

      const id = btn.dataset.id;

      const { error } = await supabase.from('societies').delete().eq('id', id);

      if (error) {
        showToast('Errore eliminazione società');
        return;
      }

      showToast('Società eliminata');
      viewBuilders.societies();
    };
  },

  categories: async () => {
    setViewTitle('Categorie');
    const el = document.getElementById('content');

    el.innerHTML = `
      <div class="form-inline">
        <input type="text" id="new-cat-name" placeholder="Nome categoria">
        <button class="btn btn-primary" id="btn-add-cat">Aggiungi</button>
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Azioni</th></tr></thead>
        <tbody id="cat-tbody"></tbody>
      </table>
    `;

    document.getElementById('btn-add-cat').onclick = async () => {
      const name = document.getElementById('new-cat-name').value.trim();
      if (!name) return;

      const { error } = await supabase.from('categories').insert({
        id: crypto.randomUUID(),
        name,
        season_id: S.activeSeason.id
      });

      if (error) {
        showToast('Errore creazione categoria');
        return;
      }

      showToast('Categoria creata');
      viewBuilders.categories();
    };

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('season_id', S.activeSeason.id)
      .order('name');

    if (error) {
      showToast('Errore caricamento categorie');
      return;
    }

    const tbody = document.getElementById('cat-tbody');
    tbody.innerHTML = data
      .map(
        c => `
      <tr>
        <td>${c.name}</td>
        <td><button class="btn btn-danger" data-id="${c.id}" data-action="del">Elimina</button></td>
      </tr>`
      )
      .join('');

    tbody.onclick = async ev => {
      const btn = ev.target.closest('button');
      if (!btn) return;

      const id = btn.dataset.id;

      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) {
        showToast('Errore eliminazione categoria');
        return;
      }

      showToast('Categoria eliminata');
      viewBuilders.categories();
    };
  },

  teams: async () => {
    setViewTitle('Squadre');
    const el = document.getElementById('content');

    el.innerHTML = `
      <div class="form-inline">
        <input type="text" id="new-team-name" placeholder="Nome squadra">
        <button class="btn btn-primary" id="btn-add-team">Aggiungi</button>
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Azioni</th></tr></thead>
        <tbody id="team-tbody"></tbody>
      </table>
    `;

    document.getElementById('btn-add-team').onclick = async () => {
      const name = document.getElementById('new-team-name').value.trim();
      if (!name) return;

      const { error } = await supabase.from('teams').insert({
        id: crypto.randomUUID(),
        name
      });

      if (error) {
        showToast('Errore creazione squadra');
        return;
      }

      showToast('Squadra creata');
      viewBuilders.teams();
    };

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) {
      showToast('Errore caricamento squadre');
      return;
    }

    const tbody = document.getElementById('team-tbody');
    tbody.innerHTML = data
      .map(
        t => `
      <tr>
        <td>${t.name}</td>
        <td><button class="btn btn-danger" data-id="${t.id}" data-action="del">Elimina</button></td>
      </tr>`
      )
      .join('');

    tbody.onclick = async ev => {
      const btn = ev.target.closest('button');
      if (!btn) return;

      const id = btn.dataset.id;

      const { error } = await supabase.from('teams').delete().eq('id', id);

      if (error) {
        showToast('Errore eliminazione squadra');
        return;
      }

      showToast('Squadra eliminata');
      viewBuilders.teams();
    };
  },

  athletes: async () => {
    setViewTitle('Atleti');
    const el = document.getElementById('content');

    el.innerHTML = `
      <div class="form-inline">
        <input type="text" id="new-ath-first" placeholder="Nome">
        <input type="text" id="new-ath-last" placeholder="Cognome">
        <button class="btn btn-primary" id="btn-add-ath">Aggiungi</button>
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Cognome</th><th>Azioni</th></tr></thead>
        <tbody id="ath-tbody"></tbody>
      </table>
    `;

    document.getElementById('btn-add-ath').onclick = async () => {
      const first = document.getElementById('new-ath-first').value.trim();
      const last = document.getElementById('new-ath-last').value.trim();

      if (!first || !last) return;

      const { error } = await supabase.from('athletes').insert({
        id: crypto.randomUUID(),
        first_name: first,
        last_name: last,
        parent_ids: []
      });

      if (error) {
        showToast('Errore creazione atleta');
        return;
      }

      showToast('Atleta creato');
      viewBuilders.athletes();
    };

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .order('last_name');

    if (error) {
      showToast('Errore caricamento atleti');
      return;
    }

    const tbody = document.getElementById('ath-tbody');
    tbody.innerHTML = data
      .map(
        a => `
      <tr>
        <td>${a.first_name}</td>
        <td>${a.last_name}</td>
        <td><button class="btn btn-danger" data-id="${a.id}" data-action="del">Elimina</button></td>
      </tr>`
      )
      .join('');

    tbody.onclick = async ev => {
      const btn = ev.target.closest('button');
      if (!btn) return;

      const id = btn.dataset.id;

      const { error } = await supabase.from('athletes').delete().eq('id', id);

      if (error) {
        showToast('Errore eliminazione atleta');
        return;
      }

      showToast('Atleta eliminato');
      viewBuilders.athletes();
    };
  },

  staff: async () => {
    setViewTitle('Staff');
    const el = document.getElementById('content');

    el.innerHTML = `
      <table>
        <thead><tr><th>Utente</th><th>Ruolo</th><th>Categoria</th><th>Società</th><th>Azioni</th></tr></thead>
        <tbody id="staff-tbody"></tbody>
      </table>
    `;

    const { data, error } = await supabase
      .from('user_category_seasons')
      .select('id, role, users(name,username,email), categories(name), societies(name)')
      .eq('season_id', S.activeSeason.id);

    if (error) {
      showToast('Errore caricamento staff');
      return;
    }

    const tbody = document.getElementById('staff-tbody');
    tbody.innerHTML = data
      .map(
        r => `
      <tr>
        <td>${