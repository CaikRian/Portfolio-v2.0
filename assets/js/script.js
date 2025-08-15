// ===== UTIL =====
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

// Ano rodapé
$('#year').textContent = new Date().getFullYear();

// Menu mobile
const navToggle = $('.nav-toggle');
const menu = $('#menu');
if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
}

// Theme toggle
const themeToggle = $('#themeToggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');
if (storedTheme) root.dataset.theme = storedTheme;
themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next; localStorage.setItem('theme', next);
});

// Header progress bar
const progressBar = $('#progressBar');
const setProgress = () => {
  const scrollTop = window.scrollY;
  const docH = document.body.scrollHeight - window.innerHeight;
  const p = Math.max(0, Math.min(1, scrollTop / docH));
  progressBar.style.transform = `scaleX(${p})`;
};
setProgress(); window.addEventListener('scroll', setProgress);

// Scroll reveal
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = $$('.reveal, .slide-in, .lift, .fade-scan');
if (!prefersReduced && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('show'); obs.unobserve(entry.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealTargets.forEach((el) => obs.observe(el));
} else { revealTargets.forEach((el) => el.classList.add('show')); }

// Scroll spy
const links = $$('.menu a');
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector('.menu a[href="#' + id + '"]');
      if (link && entry.isIntersecting) { links.forEach(l => l.classList.remove('active')); link.classList.add('active'); }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(sec => spy.observe(sec));
}

// Scroll suave (compensa header)
const HEADER_OFFSET = 64;
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href'); if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      menu?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Header show/hide on scroll
let lastScroll = 0; const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) { header.classList.remove('scroll-up'); return; }
  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) { header.classList.remove('scroll-up'); header.classList.add('scroll-down'); }
  else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) { header.classList.remove('scroll-down'); header.classList.add('scroll-up'); }
  lastScroll = currentScroll;
});

// Typewriter
$$('.typed').forEach((typedEl) => {
  const caret = typedEl.parentElement.querySelector('.caret');
  const text = typedEl.dataset.text || '';
  let i = 0; const step = () => { typedEl.textContent = text.slice(0, i++); if (i <= text.length) requestAnimationFrame(step); };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(()=>requestAnimationFrame(step), 300);
  else { typedEl.textContent = text; if (caret) caret.style.display = 'none'; }
});

// Parallax sutil
$$('.parallax').forEach((parallax)=>{
  if (!prefersReduced){
    window.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX - w / 2) / w; const y = (e.clientY - h / 2) / h;
      parallax.style.setProperty('--parx', x.toFixed(3)); parallax.style.setProperty('--pary', y.toFixed(3));
    });
  }
});

// Copy email button
const copyBtn = $('#copyEmail');
copyBtn?.addEventListener('click', async ()=>{
  const v = copyBtn.dataset.copy; try{ await navigator.clipboard.writeText(v); copyBtn.textContent = 'Copiado!'; setTimeout(()=>copyBtn.textContent='Copiar e‑mail', 1200);}catch{ alert('Copie: ' + v); }
});

// Capture origin (lead insight)
const origin = new URLSearchParams(location.search).toString();
const originField = $('#originField'); if (originField) originField.value = origin || document.referrer || 'direct';

// ===== PROJECTS =====
function initProjects(){
  const data = [
    {
      id:"CliniVox",
      image:"clinivox-cover.png",
      name:"CliniVox",
      desc:"Um aplicativo Android que utiliza comandos de voz para facilitar a vida de pacientes e médicos, tornando a gestão da saúde mais simples, eficiente e humanizada.",
      url:"https://github.com/CliniVox/CliniVox",
      tags:["Android","Aplicativo", "Vapi.AI", "Java", "Android Studio"],
      thumbClass:"thumb-clinivox",
      logo:"assets/img/clinivox-cover.png",
      //tools:["html","css","js","react"],
      featured:true
    },
    {
      id:"retroglam",
      image:"retroglam-cover.png",
      name:"RetroGlam C.",
      desc:"E‑commerce com estética retrô e toque contemporâneo.",
      url:"https://retro-glam-couture.vercel.app/",
      tags:["Web","React","E‑commerce"],
      thumbClass:"thumb-retroglam",
      logo:"assets/img/retroglam-cover.png",
      //tools:["html","css","js","react"]
      
    },
    {
      id:"help-earth",
      image:"help-earth-cover.png",
      name:"Help Earth",
      desc:"Site de notícias focadas no meio‑ambiente.",
      url:"https://site-help-earth.vercel.app/",
      tags:["Web","Conteúdo"],
      thumbClass:"thumb-help-earth",
      logo:"assets/img/help-earth-cover.png",
      //tools:["html","css","js"]
    },
    {
      id:"minha-pokedex",
      image:"minha-pokedex-cover.png",
      name:"Minha Pokédex",
      desc:"Lista Pokémon via API (foto, nome e tipos).",
      url:"https://minha-pokedex.vercel.app/",
      tags:["React","API"],
      thumbClass:"thumb-pokedex",
      logo:"assets/img/minha-pokedex-cover.png",
      //tools:["html","css","js","react","api"]
    },
    {
      id:"sorriso-prime",
      image:"sorriso-prime-cover.png",
      name:"SorrisoPrime D.",
      desc:"Experiência odontológica com tecnologia e cuidado.",
      url:"https://sorriso-prime-dental.vercel.app/",
      tags:["Web","React"],
      thumbClass:"thumb-sorriso",
      logo:"assets/img/sorriso-prime-cover.png",
      //tools:["html","css","js","react"]
    },
    {
      id:"hospital-flor-da-vida",
      image:"hospital-flor-da-vida-cover.jpeg",
      name:"Hosp. Flor da Vida",
      desc:"Gestão de pacientes, agendamentos e exames.",
      url:"https://github.com/CaikRian/Hospital-Flor-da-vida",
      tags:["PHP","Bootstrap"],
      thumbClass:"thumb-hospital",
      logo:"assets/img/hospital-flor-da-vida-cover.jpeg",
      //tools:["html","css","js","php","bootstrap"],
      code:"https://github.com/CaikRian/Hospital-Flor-da-vida"
    },
    {
      id:"onlyfilms",
      image:"onlyfilms-cover.png",
      name:"OnlyFilms",
      desc:"Catálogo e aluguel de filmes.",
      url:"#",
      tags:["Web"],
      thumbClass:"thumb-onlyfilms",
      logo:"assets/img/onlyfilms-cover.png",
      //tools:["html","css"]
    }/*,
    {
  
      name:"Em Breve",
      desc:"___________",
      url:"#",
      tags:[""],
      thumbClass:"thumb-embreve",
      logo:"",
      tools:[]
    }*/
  ];

  const grid = $('#projectsGrid'); if (!grid) return;

  const icon = (t) => { const map = { html:"html5", css:"css3", js:"javascript", react:"react", api:"api", php:"php", bootstrap:"bootstrap" }; return `<img class="tool" src="assets/icons/${map[t]||t}.svg" alt="${t}" loading="lazy">`; };
  const chips = (arr)=>arr.filter(Boolean).map(t=>`<span class="chip">${t}</span>`).join('');
  const tools = (arr)=>arr.map(icon).join('');

  // build filters from tags
  const allTags = Array.from(new Set(data.flatMap(p=>p.tags))).filter(Boolean);
  const toolbar = $('#projectsToolbar');
  const active = new Set(); // empty = all

  function renderToolbar(){
    toolbar.innerHTML = `<button class="filter ${active.size===0? 'active':''}" data-tag="*">Todos</button>` + allTags.map(t=>`<button class="filter ${active.has(t)?'active':''}" data-tag="${t}">${t}</button>`).join('');
    toolbar.querySelectorAll('.filter').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const tag = btn.dataset.tag;
        if (tag==='*'){ active.clear(); } else { active.has(tag) ? active.delete(tag) : active.add(tag); }
        renderToolbar(); render();
      });
    });
  }

  function visible(p){ if (active.size===0) return true; return p.tags.some(t=>active.has(t)); }

  function render(){
    const featured = data.find(p=>p.featured);
    const others = data.filter(p=>!p.featured && visible(p));
    let html = '';
    if (featured){
      html += `
        <article id="${featured.id}" class="project-feature">
          <a class="thumb ${featured.thumbClass}" href="${featured.url}" target="_blank" rel="noopener" aria-label="Abrir ${featured.name}">
            <img class="feature-photo" src="assets/img/${featured.image}" alt="${featured.name} — capa">
          </a>
          <div class="project-content">
            <h3 class="glow">${featured.name}</h3>
            <p class="desc">${featured.desc}</p>
            <div class="meta chips">${chips(featured.tags)}</div>
            <div class="tools-row">${tools(featured.tools||[])}</div>
            <div class="actions">
              <a class="btn" href="${featured.url}" target="_blank" rel="noopener">Abrir</a>
              ${featured.code ? `<a class="btn ghost" href="${featured.code}" target="_blank" rel="noopener">Código</a>` : ''}
            </div>
          </div>
        </article>`;
    }
    html += `<div class="projects-grid">` + data.filter(p=>!p.featured).filter(visible).map(p=>`
      <article id="${p.id}" class="project-tile">
        <a class="tile-media ${p.thumbClass}" href="${p.url}" target="_blank" rel="noopener" aria-label="Abrir ${p.name}">
          ${p.image ? `<img class="tile-photo" src="assets/img/${p.image}" alt="${p.name} — capa" loading="lazy">` : ""}
          ${p.logo ? `<img class="tile-logo" src="${p.logo}" alt="Logo ${p.name}" loading="lazy">` : ""}
        </a>
        <div class="tile-info">
          <h4 class="glow" style="margin:0">${p.name}</h4>
          <div class="meta chips">${chips(p.tags)}</div>
          <div class="tools-row">${tools(p.tools||[])}</div>
          <div class="actions">
            <a class="btn small" href="${p.url}" target="_blank" rel="noopener" ${p.url==="#" ? 'aria-disabled="true"' : ''}>Abrir</a>
            ${p.code ? `<a class="btn small ghost" href="${p.code}" target="_blank" rel="noopener">Código</a>` : ''}
          </div>
        </div>
      </article>`).join('') + `</div>`;

    grid.innerHTML = html;
    grid.querySelectorAll('.project-feature, .project-tile').forEach(el=>el.classList.add('show'));

    // clickable card
    grid.querySelectorAll('.project-feature, .project-tile').forEach(card=>{
      const link = card.querySelector('a.thumb, a.tile-media');
      if (!link || link.getAttribute('href')==='#') return;
      card.addEventListener('click', (e)=>{ if (e.target.closest('a,button')) return; link.click(); });
    });

    // deep-link highlight
    const byHash = () => { const id = (location.hash||"").slice(1); const el = id ? document.getElementById(id) : null; if (!el) return; el.scrollIntoView({behavior:'smooth', block:'start'}); el.classList.add('highlight'); setTimeout(()=>el.classList.remove('highlight'), 1500); };
    byHash(); window.addEventListener('hashchange', byHash);
  }

  renderToolbar(); render();
}

if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initProjects); } else { initProjects(); }


(function () {
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');
  const originField = document.getElementById('originField');
  const toastStack = document.getElementById('toastStack');

  // origem (URL + referrer)
  if (originField) {
    originField.value = window.location.href + (document.referrer ? ' | referrer: ' + document.referrer : '');
  }

  // util: criar toast
  function showToast({ title = 'Aviso', message = '', type = 'success', timeout = 4200 } = {}) {
    const el = document.createElement('div');
    el.className = `toast-glass ${type}`;
    el.innerHTML = `
      <div class="toast-head">
        <span>${type === 'success' ? '✅' : '⚠️'}</span>
        <span>${title}</span>
      </div>
      <div class="toast-body">${message}</div>
    `;
    toastStack.appendChild(el);

    // remover após timeout
    setTimeout(() => {
      el.style.animation = 'toastOut 220ms ease forwards';
      setTimeout(() => el.remove(), 220);
    }, timeout);
  }

  // serializa dados do form em objeto
  function formToJSON(formEl) {
    const data = {};
    new FormData(formEl).forEach((value, key) => {
      // ignora honeypot se preenchido (spam)
      if (key === '_honey' && value) data.__spam = true;
      else data[key] = value;
    });
    return data;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // bloqueia envio se honeypot foi preenchido
    const hp = document.getElementById('hp');
    if (hp && hp.value) return;

    const email = form.getAttribute('data-formsubmit-email');
    if (!email) {
      showToast({ title: 'Configuração ausente', message: 'Defina data-formsubmit-email no formulário.', type: 'error' });
      return;
    }

    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
    const payload = formToJSON(form);

    // estado de loading no botão
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'Enviando...';
    sendBtn.disabled = true;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // FormSubmit retorna JSON { success: "..." } quando ok
      const isJSON = res.headers.get('content-type')?.includes('application/json');
      const data = isJSON ? await res.json() : null;

      if (res.ok) {
        form.reset();
        showToast({
          title: 'Mensagem enviada!',
          message: 'Obrigado pelo contato. Vou responder em breve.',
          type: 'success'
        });
      } else {
        // primeiro envio pode exigir confirmação do seu e-mail
        let msg = 'Não foi possível enviar sua mensagem. Tente novamente.';
        if (data?.message) msg = data.message;
        showToast({ title: 'Erro ao enviar', message: msg, type: 'error' });
      }
    } catch (err) {
      showToast({
        title: 'Erro de conexão',
        message: 'Verifique sua internet e tente novamente.',
        type: 'error'
      });
    } finally {
      sendBtn.textContent = originalText;
      sendBtn.disabled = false;
    }
  });
})();
(function(){
const section = document.getElementById('github');
if (!section) return;

const GH_USER = (section.dataset.ghUser || '').trim() || 'octocat';
const API = 'https://api.github.com';
const headers = {}; // sem token

const els = {
  avatar: section.querySelector('.gh-avatar'),
  name: section.querySelector('.gh-name'),
  bio: section.querySelector('.gh-bio'),
  followers: section.querySelector('.gh-followers'),
  reposCount: section.querySelector('.gh-repos'),
  viewBtn: section.querySelector('.gh-view'),
  grid: document.getElementById('gh-grid'),
  search: document.getElementById('gh-search'),
  langSel: document.getElementById('gh-language'),
  sortSel: document.getElementById('gh-sort'),
  donut: document.getElementById('gh-donut'),
  legend: document.getElementById('gh-legend')
};

let repos = [];
let filtered = [];

// Cache (10 min)
const TTL = 10 * 60 * 1000;
const now = Date.now();
const K_USER = `gh:user:${GH_USER}`;
const K_REPOS = `gh:repos:${GH_USER}`;
const getCache = (k) => { try { const raw = sessionStorage.getItem(k); if (!raw) return null; const o = JSON.parse(raw); return (now - o.t) > TTL ? null : o.v; } catch { return null; } };
const setCache = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), v })); } catch {}
};

const fmt = new Intl.NumberFormat('pt-BR');
function timeAgo(iso){
  const d = new Date(iso); const s = (Date.now() - d.getTime())/1000;
  const map = [['ano',31536000],['mês',2592000],['dia',86400],['hora',3600],['min',60]];
  for (const [label, sec] of map){ if (s >= sec){ const v = Math.floor(s/sec); return `há ${v} ${label}${v>1 && label!=='mês'?'s':''}`; } }
  return 'agora';
}
const langColors = {
  'JavaScript':'#f1e05a','TypeScript':'#3178c6','Python':'#3572A5','Java':'#b07219','Kotlin':'#A97BFF','C':'#555555','C++':'#f34b7d','C#':'#178600','Go':'#00ADD8','PHP':'#4F5D95','Ruby':'#701516','Swift':'#F05138','HTML':'#e34c26','CSS':'#563d7c','Shell':'#89e051','Dart':'#00B4AB','Scala':'#c22d40','Rust':'#dea584','Objective-C':'#438eff'
};
const colorFor = l => langColors[l] || '#9aa0a6';

function renderProfile(user){
  els.avatar.src = user.avatar_url || '';
  els.name.textContent = user.name || user.login || GH_USER;
  els.bio.textContent = user.bio || '';
  els.followers.textContent = fmt.format(user.followers || 0);
  els.reposCount.textContent = fmt.format(user.public_repos || 0);
  els.viewBtn.href = user.html_url || `https://github.com/${GH_USER}`;
}

function renderLangOptions(list){
  const set = new Set(list.map(r => r.language).filter(Boolean));
  els.langSel.innerHTML = '<option value="__all">Todas</option>' + Array.from(set).sort().map(l => `<option value="${l}">${l}</option>`).join('');
}

function card(r){
  const topics = (r.topics||[]).slice(0,6).map(t=>`<span class="gh-tag">${t}</span>`).join('');
  const lang = r.language || '';
  const langHtml = lang ? `<span class="gh-lang"><span class="gh-dot" style="background:${colorFor(lang)}"></span>${lang}</span>` : '';
  return `
    <article class="gh-card">
      <a class="gh-title" href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
      <p class="gh-desc">${r.description || ''}</p>
      <div class="gh-tags">${topics}</div>
      <div class="gh-meta">
        <span>★ ${fmt.format(r.stargazers_count || 0)}</span>
        ${langHtml}
        <span>Atualizado ${timeAgo(r.pushed_at)}</span>
      </div>
    </article>`;
}

function renderGrid(list){
  if (!list.length){
    els.grid.innerHTML = '<div class="gh-card"><strong>Nenhum repositório encontrado.</strong></div>';
    return;
  }
  els.grid.innerHTML = list.map(card).join('');
}

function computeLangTotalsFromRepos(list){
  const totals = {};
  list.forEach(r => { if (r.language) totals[r.language] = (totals[r.language] || 0) + 1; });
  return totals;
}

function renderDonutTotals(totals){
  const entries = Object.entries(totals || {})
    .filter(([,v]) => typeof v === 'number' && isFinite(v) && v > 0)
    .sort((a,b) => b[1] - a[1])
    .slice(0,8);

  const sum = entries.reduce((acc, [,v]) => acc + v, 0);

  els.legend.innerHTML = entries.length
    ? entries.map(([lang,val]) => `<li><span class="gh-dot" style="background:${colorFor(lang)}"></span>${lang} — ${Math.round(val*100/(sum||1))}%</li>`).join('')
    : '<li style="color:var(--muted)">Sem dados suficientes de linguagens.</li>';

  const R = 28, C = 2*Math.PI*R; let off = 0; els.donut.innerHTML = '';
  els.donut.innerHTML += `<circle cx="32" cy="32" r="${R}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"/>`;
  if (!entries.length || !sum) return;

  entries.forEach(([lang,val]) => {
    const len = C * (val/sum);
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx','32'); c.setAttribute('cy','32'); c.setAttribute('r', R);
    c.setAttribute('fill','none'); c.setAttribute('stroke', colorFor(lang)); c.setAttribute('stroke-width','12');
    c.setAttribute('stroke-dasharray', `${len} ${C-len}`);
    c.setAttribute('stroke-dashoffset', String(-off));
    c.setAttribute('pathLength', String(C));
    els.donut.appendChild(c); off += len;
  });
}

function applyFilters(){
  const q = (els.search.value || '').toLowerCase();
  const lang = els.langSel.value;
  const sort = els.sortSel.value;

  filtered = repos.filter(r => {
    const hit = !q || (r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    const okL = lang === '__all' || r.language === lang;
    return hit && okL;
  });

  if (sort === 'updated') filtered.sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at));
  if (sort === 'stars')   filtered.sort((a,b) => (b.stargazers_count||0) - (a.stargazers_count||0));
  if (sort === 'name')    filtered.sort((a,b) => a.name.localeCompare(b.name));

  renderGrid(filtered);
}

async function init(){
  // skeletons
  els.grid.innerHTML = Array.from({length: 6}).map(() => '<div class="skeleton"></div>').join('');

  try {
    // Perfil
    let user = getCache(K_USER);
    if (!user){
      const ru = await fetch(`${API}/users/${GH_USER}`, { headers });
      if (!ru.ok) throw new Error('Falha ao carregar usuário');
      user = await ru.json(); setCache(K_USER, user);
    }
    renderProfile(user);

    // Repositórios
    let list = getCache(K_REPOS);
    if (!list){
      const rr = await fetch(`${API}/users/${GH_USER}/repos?per_page=100&sort=updated`, { headers });
      if (!rr.ok){
        if (rr.status === 403) throw new Error('Limite da API do GitHub atingido. Tente novamente em alguns minutos.');
        throw new Error('Falha ao carregar repositórios');
      }
      list = await rr.json(); setCache(K_REPOS, list);
    }

    repos = list.filter(r => !r.fork && !r.archived);
    renderLangOptions(repos);

    els.search.addEventListener('input', applyFilters);
    els.langSel.addEventListener('change', applyFilters);
    els.sortSel.addEventListener('change', applyFilters);
    applyFilters();

    // Donut baseado apenas em repo.language (sem chamadas extras)
    renderDonutTotals(computeLangTotalsFromRepos(repos));
  } catch (err){
    els.grid.innerHTML = `<div class="gh-card"><strong>Erro:</strong> ${err.message || err}</div>`;
  }
}

init();
})();
