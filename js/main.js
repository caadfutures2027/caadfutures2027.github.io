document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll effect ──
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── Mobile menu ──
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Phase system ──
  const PHASES = {
    A: { label: 'Now', title: 'Call for Papers Open', desc: 'Submission deadline: September 30, 2026', btn: 'Submit Paper', link: 'papers.html' },
    B: { label: 'Status', title: 'Under Review', desc: 'Notifications by late December 2026', btn: 'View Timeline', link: 'papers.html' },
    C: { label: 'Now', title: 'Registration Open', desc: 'Early-bird deadline: Late March 2027', btn: 'Register Now', link: 'registration.html' },
    D: { label: 'Coming Up', title: 'See You in Calgary', desc: 'June 29 – July 3, 2027', btn: 'View Program', link: '/program' },
    E: { label: 'Live', title: 'Happening Now', desc: 'Check today\'s schedule', btn: 'View Schedule', link: '/program' },
    F: { label: 'Archive', title: 'Thank You, Calgary', desc: 'Proceedings and gallery now available', btn: 'View Proceedings', link: '/post' }
  };

  const currentPhase = document.body.dataset.phase || 'A';
  const phase = PHASES[currentPhase];
  if (phase) {
    const card = document.querySelector('.phase-card');
    if (card) {
      card.querySelector('.phase-label').textContent = phase.label;
      card.querySelector('.phase-title').textContent = phase.title;
      card.querySelector('.phase-desc').textContent = phase.desc;
      const btn = card.querySelector('.phase-btn');
      btn.querySelector('span').textContent = phase.btn;
      btn.href = phase.link;
    }
  }

  // ── Gantt Timeline ──
  buildGantt();
});


function buildGantt() {
  const container = document.getElementById('gantt');
  if (!container) return;

  // ── Non-linear scale: conference period gets expanded ──
  // Pre-conference (May 2026 – Jun 28 2027)  → 0%–52%
  // Conference     (Jun 29 – Jul 3 2027)     → 52%–90%
  // Post           (Jul 4 – Jul 31 2027)     → 90%–100%

  const TL_START   = new Date(2026, 4, 1);   // May 1 2026
  const CONF_START = new Date(2027, 5, 29);  // Jun 29 2027
  const CONF_END   = new Date(2027, 6, 4);   // Jul 4 2027 (exclusive)
  const TL_END     = new Date(2027, 6, 31);  // Jul 31 2027

  const PRE_PCT  = 52;
  const CONF_PCT = 90;

  function toPercent(date) {
    const t = date.getTime();
    if (t <= CONF_START.getTime()) {
      const ratio = (t - TL_START.getTime()) / (CONF_START.getTime() - TL_START.getTime());
      return Math.max(0, ratio * PRE_PCT);
    } else if (t <= CONF_END.getTime()) {
      const ratio = (t - CONF_START.getTime()) / (CONF_END.getTime() - CONF_START.getTime());
      return PRE_PCT + ratio * (CONF_PCT - PRE_PCT);
    } else {
      const ratio = (t - CONF_END.getTime()) / (TL_END.getTime() - CONF_END.getTime());
      return CONF_PCT + Math.min(ratio, 1) * (100 - CONF_PCT);
    }
  }

  function d(y, m, day) { return new Date(y, m - 1, day || 1); }

  // ── Colors (vivid) ──
  const C = {
    papers:     '#23297a',
    review:     '#3b44a8',
    workshops:  '#5c6bc0',
    regEarly:   '#c6443e',
    regRegular: '#d4645f',
    social:     '#7b1fa2',
    keynote:    '#2e7d32',
    banff:      '#c9956a',
  };

  // ── Track data ──
  const TRACKS = [
    {
      name: 'Papers',
      bars: [
        { label: 'Submission',    start: d(2026,7,1),   end: d(2026,10,1),  color: C.papers },
        { label: 'Review',        start: d(2026,10,1),  end: d(2026,12,15), color: C.review },
        { label: 'Acceptance',    start: d(2026,12,15), end: d(2027,1,15),  color: C.papers },
        { label: 'Camera-Ready',  start: d(2027,1,15),  end: d(2027,2,28),  color: C.review },
      ]
    },
    {
      name: 'Workshops',
      bars: [
        { label: 'Proposal',     start: d(2027,1,1),   end: d(2027,2,28),  color: C.workshops },
        { label: 'Review',       start: d(2027,3,1),    end: d(2027,5,15),  color: '#8088d0' },
      ]
    },
    {
      name: 'Registration',
      bars: [
        { label: 'Early Bird',   start: d(2027,3,1),   end: d(2027,4,15),  color: C.regEarly },
        { label: 'Regular',      start: d(2027,4,15),  end: d(2027,6,15),  color: C.regRegular },
      ]
    },
    {
      name: 'Conference',
      bars: [
        { label: 'WS Day 1',       start: d(2027,6,29), end: d(2027,6,30), color: C.workshops },
        { label: 'WS Day 2',       start: d(2027,6,30), end: d(2027,7,1),  color: C.workshops },
        { label: 'Papers Day 1',   start: d(2027,7,1),  end: d(2027,7,2),  color: C.papers },
        { label: 'Papers Day 2',   start: d(2027,7,2),  end: d(2027,7,3),  color: C.papers },
        { label: 'Papers Day 3',   start: d(2027,7,3),  end: d(2027,7,4),  color: C.papers },
      ]
    },
    {
      name: 'Keynotes',
      bars: [
        { label: 'K1/2',  start: d(2027,7,1),  end: d(2027,7,2),  color: C.keynote, marker: true },
        { label: 'K3/4',  start: d(2027,7,2),  end: d(2027,7,3),  color: C.keynote, marker: true },
        { label: 'K5/6',  start: d(2027,7,3),  end: d(2027,7,4),  color: C.keynote, marker: true },
      ]
    },
    {
      name: 'Social',
      bars: [
        { label: 'Mixer',      start: d(2027,6,29,12), end: d(2027,6,30), color: C.social },
        { label: 'Welcome',    start: d(2027,6,30,12), end: d(2027,7,1),  color: C.social },
        { label: 'Banquet',    start: d(2027,7,2,12),  end: d(2027,7,3),  color: C.social },
        { label: 'Banff Trip', start: d(2027,7,4),     end: d(2027,7,5),  color: C.banff },
      ]
    },
  ];

  // ── Build month + day headers ──
  const MNAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();

  // Pre-conference months
  const headerTicks = [];
  let my = 2026, mm = 5;
  while (my < 2027 || (my === 2027 && mm <= 6)) {
    const date = d(my, mm, 1);
    const pct = toPercent(date);
    const isJan = mm === 1;
    const label = isJan ? `Jan '27` : MNAMES[mm - 1];
    if (my === 2027 && mm === 7) break;
    headerTicks.push({ pct, label, isJan, isDay: false });
    mm++;
    if (mm > 12) { mm = 1; my++; }
  }

  // Conference day ticks
  const confDayLabels = ['Jun 29','Jun 30','Jul 1','Jul 2','Jul 3','Jul 4'];
  for (let i = 0; i < 6; i++) {
    const date = i < 2 ? d(2027, 6, 29 + i) : d(2027, 7, i - 1);
    headerTicks.push({ pct: toPercent(date), label: confDayLabels[i], isJan: false, isDay: true });
  }

  // Post label
  headerTicks.push({ pct: toPercent(d(2027, 7, 15)), label: '', isJan: false, isDay: false });

  // ── Render ──
  let html = '<div class="gantt-inner">';

  // Header ticks
  html += '<div class="gantt-header">';
  headerTicks.forEach(tick => {
    const cls = tick.isDay ? ' is-day' : (tick.isJan ? ' is-year' : '');
    html += `<div class="gantt-tick${cls}" style="left:${tick.pct}%">${tick.label}</div>`;
  });
  html += '</div>';

  // Conference zone highlight
  const confLeftPct = toPercent(CONF_START);
  const confRightPct = toPercent(CONF_END);
  html += `<div class="gantt-conf-zone" style="left:calc(${confLeftPct}% + 100px);width:${confRightPct - confLeftPct}%"></div>`;

  // Grid lines
  html += '<div class="gantt-grid-abs">';
  headerTicks.forEach(tick => {
    const cls = tick.isDay ? ' is-day' : (tick.isJan ? ' is-year' : '');
    html += `<div class="gantt-vline${cls}" style="left:${tick.pct}%"></div>`;
  });
  html += '</div>';

  // Tracks
  const CONF_ROWS = ['Conference', 'Keynotes', 'Social'];
  html += '<div class="gantt-tracks">';
  TRACKS.forEach(track => {
    const isConfRow = CONF_ROWS.includes(track.name);
    html += `<div class="gantt-track${isConfRow ? ' conf-row' : ''}">`;
    html += `<div class="gantt-track-label${isConfRow ? ' conf-label' : ''}">${track.name}</div>`;

    track.bars.forEach(bar => {
      const left = toPercent(bar.start);
      const right = toPercent(bar.end);
      const width = right - left;

      const isActive = now >= bar.start && now < bar.end;
      const isPast = now >= bar.end;
      const opacity = isPast ? 0.3 : isActive ? 1 : 0.6;
      const activeCls = isActive ? ' active' : '';

      html += `<div class="gantt-bar${activeCls}" style="left:${left}%;width:${width}%;background:${bar.color};opacity:${opacity};" title="${bar.label}">`;
      html += `<div class="gantt-bar-dot" style="background:${bar.color}"></div>`;
      if (width > 2.5) {
        html += `<span class="gantt-bar-label">${bar.label}</span>`;
      }
      html += '</div>';
    });

    html += '</div>';
  });

  // Today marker
  const todayPct = toPercent(now);
  if (todayPct >= 0 && todayPct <= 100) {
    html += `<div class="gantt-today" style="left:${todayPct}%"></div>`;
  }

  html += '</div>'; // tracks
  html += '</div>'; // inner

  container.innerHTML = html;
}
