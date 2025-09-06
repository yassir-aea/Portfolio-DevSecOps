/* Pipeline Replays (GitHub Actions) */
function initPipelineReplays() {
  const container = document.getElementById('pipeline-replays');
  if (!container) return;
  const repos = [
    { owner: 'yassir-aea', repo: 'CRM-Marocaine' },
    { owner: 'yassir-aea', repo: 'kubeSmartService' },
  ];
  const headers = { 'Accept': 'application/vnd.github+json' };

  Promise.all(repos.map(async ({ owner, repo }) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`, { headers });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const run = data.workflow_runs?.[0];
      if (run) return { owner, repo, run, commit: null };
      // Fallback to last commit when no actions run
      const cres = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
      const cdata = cres.ok ? await cres.json() : [];
      const commit = Array.isArray(cdata) ? cdata[0] : null;
      return { owner, repo, run: null, commit };
    } catch (e) {
      try {
        const cres = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
        const cdata = cres.ok ? await cres.json() : [];
        const commit = Array.isArray(cdata) ? cdata[0] : null;
        return { owner, repo, run: null, commit };
      } catch (_) {
        return { owner, repo, run: null, commit: null };
      }
    }
  })).then((results) => {
    const frag = document.createDocumentFragment();
    results.forEach(({ owner, repo, run, commit }) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      const isRun = !!run;
      const status = isRun ? (run.conclusion || run.status) : (commit ? 'dernier commit' : 'inconnu');
      const time = isRun
        ? (run.run_started_at ? new Date(run.run_started_at).toLocaleString() : '—')
        : (commit?.commit?.author?.date ? new Date(commit.commit.author.date).toLocaleString() : '—');
      const duration = isRun && run.run_started_at && run.updated_at
        ? Math.round((new Date(run.updated_at) - new Date(run.run_started_at)) / 1000) + 's'
        : '—';
      const url = isRun ? (run.html_url) : (commit ? commit.html_url : `https://github.com/${owner}/${repo}`);
      card.innerHTML = `
        <div class="project-header">
          <div class="project-title">${owner}/${repo}</div>
          <a class="btn-cta" href="${url}" target="_blank" rel="noopener">Ouvrir ↗</a>
        </div>
        <div class="project-body">
          <div>Statut : <strong>${status}</strong></div>
          <div>${isRun ? 'Début' : 'Date'} : ${time}</div>
          <div>Durée : ${duration}</div>
        </div>
      `;
      frag.appendChild(card);
    });
    container.innerHTML = '';
    container.appendChild(frag);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initHamburger();
  animateStats();
  initPipelineModal();
  initTypingLogs();
  initProgressObserver();
  initPodTilt();
  initCLI();
  initProjectToggles();
  initPipelineReplays();
  injectMetricsFromData();
  initSkillsJournal();
});

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function initHamburger() {
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function animateStats() {
  const values = document.querySelectorAll('.stat-value[data-count]');
  values.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count') || '0', 10);
    const durationMs = 1000;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / durationMs);
      el.textContent = Math.floor(target * p).toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* Pipelines Modal */
function initPipelineModal() {
  const steps = document.querySelectorAll('.pipeline-step');
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const desc = document.getElementById('modal-desc');
  const link = document.getElementById('modal-link');
  const closers = modal?.querySelectorAll('[data-close], .modal-close');

  steps.forEach((s) => {
    s.addEventListener('click', () => {
      const step = s.getAttribute('data-step') || '';
      const d = s.getAttribute('data-desc') || '';
      const href = s.getAttribute('data-link') || '#';
      if (!modal || !title || !desc || !link) return;
      title.textContent = step;
      desc.textContent = d;
      link.setAttribute('href', href);
      modal.classList.remove('hidden');
    });
  });

  closers?.forEach((c) => c.addEventListener('click', () => modal?.classList.add('hidden')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal?.classList.add('hidden');
  });
}

/* Logs Typing Effect */
function initTypingLogs() {
  const el = document.getElementById('logs-output');
  const showAll = document.getElementById('logs-show-all');
  if (!el) return;
  const lines = [
    ts() + ' [INFO] Chargement de l’expérience…',
    ts() + ' [OK]  2023 → Présent · Ingénieur DevSecOps Senior · Inwi',
    '       • Migration de 50+ microservices vers Kubernetes (−80% temps de déploiement).',
    '       • CI/CD GitLab pour 200+ dépôts, 99,9% de disponibilité.',
    '       • Stack de supervision : Prometheus, Grafana, ELK pour 1000+ serveurs.',
    '       • Automatisation Terraform, −90% de configuration manuelle.',
    ts() + ' [OK]  2022 → 2023 · Développeur DevOps · Orange Business (Télétravail, Rabat)',
    '       • Installation et administration de clusters Kubernetes.',
    '       • Développement CI/CD ; supervision Zabbix & Prometheus.',
    '       • Charts Helm pour Kubernetes ; développement Python 3.',
    '       • IaC avec Ansible & Terraform ; images Docker (Java/Python).',
    '       • Administration Linux, scripting Bash ; administration Systèmes & BD.',
    ts() + ' [OK]  2020 → 2022 · Ingénieur DevOps · Ketos (Casablanca, Sur site)',
    '       • Mise en place et administration de clusters Kubernetes ; CI/CD en VM et conteneurs.',
    '       • Supervision Zabbix & Prometheus ; scraping/crawling Python.',
    '       • Infrastructure Proxmox ; IaC Ansible & Terraform.',
    '       • Conteneurs Docker (Java/Python) ; pipelines Jenkins.',
    '       • Administration systèmes & bases de données.',
    ts() + ' [OK]  2018 → 2020 · Ingénieur systèmes · SisPay S.A (Casablanca, Sur site)',
    '       • Installation et administration de sites web ; préparation de serveurs Linux/Windows.',
    '       • Supervision Zabbix & Prometheus ; back‑end Python Django.',
    '       • Conteneurs Docker (Java/Python) ; pipelines GitLab CI/CD.',
    '       • Support systèmes & bases de données.',
    ts() + ' [OK]  2015 → 2018 · Administrateur réseau & systèmes · salams ysteme (Berrechid, Sur site)',
    '       • Mise en place et administration de sites web ; administration Linux/Windows.',
    '       • Supervision Zabbix/Prometheus ; back‑end Python Django.',
    '       • Administration systèmes Windows ; CCNA switching/routing.',
    '       • Support systèmes & bases de données.',
    ts() + ' [INFO] Flux terminé.'
  ];

  let cancelTyping = false;
  showAll?.addEventListener('click', (e) => {
    e.preventDefault();
    cancelTyping = true;
    el.innerHTML = '';
    lines.forEach((text) => {
      const div = document.createElement('div');
      div.textContent = text;
      el.appendChild(div);
    });
    el.parentElement?.scrollTo({ top: el.parentElement.scrollHeight, behavior: 'instant' });
  });

  typeLines(el, lines, 12, 14, () => cancelTyping);
}

function typeLines(container, lines, cps = 12, lineDelay = 10, isCancelled = () => false) {
  let lineIndex = 0;
  const writeLine = () => {
    if (lineIndex >= lines.length || isCancelled()) return;
    const text = lines[lineIndex];
    const line = document.createElement('div');
    container.appendChild(line);

    let charIndex = 0;
    const typeChar = () => {
      if (isCancelled()) return;
      if (charIndex <= text.length) {
        line.textContent = text.slice(0, charIndex);
        charIndex += 1;
        setTimeout(typeChar, 1000 / cps);
      } else {
        lineIndex += 1;
        container.scrollTop = container.scrollHeight;
        setTimeout(writeLine, lineDelay * 10);
      }
    };
    typeChar();
  };
  writeLine();
}

function ts() {
  const d = new Date();
  return d.toISOString().replace('T', ' ').split('.')[0];
}

/* Metrics Progress Animation */
function initProgressObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const bar = e.target.querySelector('.progress-bar');
        const level = parseInt(e.target.getAttribute('data-level') || '0', 10);
        if (bar) {
          requestAnimationFrame(() => {
            bar.style.width = level + '%';
          });
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.progress').forEach((p) => io.observe(p));
}

/* Subtle 3D tilt for pods */
function initPodTilt() {
  const pods = document.querySelectorAll('.pod[data-tilt]');
  pods.forEach((pod) => {
    pod.addEventListener('mousemove', (e) => {
      const rect = pod.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = (dy * -6).toFixed(2);
      const ry = (dx * 6).toFixed(2);
      pod.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    pod.addEventListener('mouseleave', () => {
      pod.style.transform = '';
    });
  });
}

/* CLI Contact */
function initCLI() {
  const input = document.getElementById('cli-input');
  const output = document.getElementById('cli-output');
  if (!input || !output) return;

  const commands = {
    help: () => (
      `<div class="cli-help">` +
      `  <div class="cli-help-title">Commandes disponibles</div>` +
      `  <ul class="cli-list">` +
      `    <li class="cli-item"><span class="cli-cmd">help</span><span class="cli-desc">Afficher cette aide</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">email</span><span class="cli-desc">Afficher mon adresse email</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">linkedin</span><span class="cli-desc">Ouvrir mon profil LinkedIn</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">github</span><span class="cli-desc">Ouvrir mon profil GitHub</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">cv</span><span class="cli-desc">Télécharger mon CV</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">availability</span><span class="cli-desc">Voir ma disponibilité</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">rates</span><span class="cli-desc">Tarifs (TJM)</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">phone</span><span class="cli-desc">Afficher mon numéro de téléphone</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">schedule</span><span class="cli-desc">Planifier un appel (Google Meet)</span></li>` +
      `    <li class="cli-item"><span class="cli-cmd">clear</span><span class="cli-desc">Nettoyer le terminal</span></li>` +
      `  </ul>` +
      `</div>`
    ),
    email: () => `Email : <a href="mailto:Yassir.aitelaizzi@gmail.com">Yassir.aitelaizzi@gmail.com</a>`,
    linkedin: () => openLink(`https://www.linkedin.com/in/yassiraitelaizzi/`, 'LinkedIn ouvert.'),
    github: () => openLink(`https://github.com/yassir-aea`, 'GitHub ouvert.'),
    cv: () => `CV : <a href="cvdown/Yassir_devops.pdf" download>Télécharger le PDF</a>`,
    availability: () => `Disponibilité : Ouvert aux opportunités · Délai de démarrage flexible`,
    rates: () => `Tarifs : sur demande (TJM selon mission et périmètre)`,
    phone: () => `Téléphone : <a href="tel:+212661352488">+212661352488</a>`,
    schedule: () => openLink(
      `https://calendar.google.com/calendar/u/0/r/eventedit?add=yassir.aitelaizzi%40gmail.com&text=Entretien%20Google%20Meet%20avec%20Yassir&details=Merci%20d%27indiquer%20votre%20soci%C3%A9t%C3%A9%20et%20le%20sujet.&location=Google%20Meet`,
      'Google Calendar ouvert.'
    ),
    clear: () => {
      output.innerHTML = '';
      return '';
    },
  };

  printLine(output, `Tapez 'help' pour afficher les commandes disponibles.`);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (!cmd) return;
      printLine(output, `<span class="prompt">visitor@devops:~$</span> ${escapeHtml(cmd)}`);
      const fn = commands[cmd.toLowerCase()];
      if (fn) {
        const res = fn();
        if (typeof res === 'string' && res) printLine(output, res);
      } else {
        printLine(output, `Commande introuvable : ${escapeHtml(cmd)}. Essayez 'help'.`);
      }
      input.value = '';
      output.parentElement?.scrollTo({ top: output.parentElement.scrollHeight, behavior: 'smooth' });
    }
  });

  function printLine(container, html) {
    const div = document.createElement('div');
    div.className = 'mono';
    div.innerHTML = html;
    container.appendChild(div);
  }

  function openLink(url, msg) {
    window.open(url, '_blank', 'noopener');
    return msg;
  }
}

/* Util */
function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/* Projects toggles */
function initProjectToggles() {
  document.querySelectorAll('.project-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-target');
      if (!sel) return;
      const panel = document.querySelector(sel);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      // Only close others within projects page
      const parentSection = panel.closest('.projects-grid') || document;
      parentSection.querySelectorAll('.project-details.open').forEach((p) => p.classList.remove('open'));
      if (!isOpen) panel.classList.add('open');
      btn.textContent = panel.classList.contains('open') ? 'Voir moins' : 'Voir plus';
    });
  });
}

/* Inject metrics matching data.html skills */
function injectMetricsFromData() {
  const grid = document.getElementById('metrics-grid');
  if (!grid) return;
  const metrics = [
    { name: 'Kubernetes & Docker', level: 95 },
    { name: 'Helm & Kustomize', level: 90 },
    { name: 'Service Mesh (Istio)', level: 85 },
    { name: 'GitLab CI/CD', level: 95 },
    { name: 'Jenkins & GitHub Actions', level: 90 },
    { name: 'ArgoCD & GitOps', level: 85 },
    { name: 'Terraform', level: 95 },
    { name: 'Ansible & Puppet', level: 90 },
    { name: 'CloudFormation', level: 85 },
    { name: 'Python', level: 95 },
    { name: 'Bash & Shell', level: 95 },
    { name: 'Go & JavaScript', level: 80 },
  ];
  const frag = document.createDocumentFragment();
  metrics.forEach(({ name, level }) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
      <div class="metric-header">${name}</div>
      <div class="progress" data-level="${level}">
        <div class="progress-bar"></div>
      </div>
      <div class="progress-label">${level}%</div>
    `;
    frag.appendChild(card);
  });
  grid.appendChild(frag);
  initProgressObserver();
}

/* Skills Journal for recruiters (tools & scores, no cloud providers) */
function initSkillsJournal() {
  const out = document.getElementById('skills-logs');
  const btn = document.getElementById('skills-show');
  const showAll = document.getElementById('skills-show-all');
  if (!out) return;
  const entries = [
    ['Kubernetes', 95],
    ['Docker', 95],
    ['Helm & Kustomize', 90],
    ['GitLab CI/CD', 95],
    ['Jenkins & GitHub Actions', 90],
    ['ArgoCD & GitOps', 85],
    ['Terraform', 95],
    ['Ansible & Puppet', 90],
    ['CloudFormation', 85],
    ['Python (Django, Flask)', 95],
    ['Bash & Shell', 95],
    ['Go & JavaScript', 80],
    ['Observabilité (Prometheus, Grafana, ELK)', 90],
    ['Sécurité (SAST/DAST, SBOM, secrets)', 85],
  ];
  out.textContent = '';
  const lines = entries.map(([name, score]) => `${pad(name, 36)} | Score: ${score}%`);
  function startTyping() {
    out.textContent = '';
    typeLines(out, lines, 24, 6, () => false);
  }
  if (btn) {
    btn.addEventListener('click', startTyping);
  } else {
    startTyping();
  }
  showAll?.addEventListener('click', (e) => {
    e.preventDefault();
    out.textContent = '';
    lines.forEach((l) => {
      out.textContent += l + '\n';
    });
    out.parentElement?.scrollTo({ top: out.parentElement.scrollHeight });
  });
}

function pad(str, len) {
  if (str.length >= len) return str;
  return str + ' '.repeat(len - str.length);
}


