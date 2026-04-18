(function () {
  'use strict';

  var container = document.getElementById('venue-map');
  if (!container) return;

  var NS = 'http://www.w3.org/2000/svg';
  var S = 600;
  var SAPL = { x: 210, y: 325 };

  var C = {
    street:   'rgba(255,255,255,0.16)',
    ctrain:   'rgba(255,255,255,0.42)',
    station:  '#fff',
    zone:     'rgba(255,255,255,0.25)',
    zoneLbl:  'rgba(255,255,255,0.72)',
    hotelDot: 'rgba(255,255,255,0.50)',
    hotelLbl: 'rgba(255,255,255,0.82)',
    sapl:     '#e91e78',
    labelBg:  'rgba(25,30,95,0.55)',
    labelBdr: 'rgba(255,255,255,0.14)',
    font:     "'Segoe UI', system-ui, sans-serif",
  };

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, str, attrs) {
    var t = el('text', attrs, parent);
    t.textContent = str;
    return t;
  }

  var svg = el('svg', {
    viewBox: '0 0 ' + S + ' ' + S,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': 'Interactive map of hotels near SAPL campus',
  });
  svg.style.display = 'block';
  svg.style.overflow = 'visible';

  /* ── layer groups ── */
  var gRiver    = el('g', { id: 'layer-river' }, svg);
  var gStreets  = el('g', { id: 'layer-streets' }, svg);
  var gCtrain   = el('g', { id: 'layer-ctrain' }, svg);
  var gZones    = el('g', { id: 'layer-zones' }, svg);
  var gAirport  = el('g', { id: 'layer-airport' }, svg);
  var gLandmarks = el('g', { id: 'layer-landmarks' }, svg);
  var gSapl     = el('g', { id: 'layer-sapl' }, svg);
  var gHotels   = el('g', { id: 'layer-hotels' }, svg);

  /* ── Bow River ── */
  var riverPts = '5,200 210,100 400,150 600,180';
  el('polyline', {
    points: riverPts,
    fill: 'none',
    stroke: 'rgba(120,180,220,0.18)',
    'stroke-width': 28,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
  }, gRiver);
  el('polyline', {
    points: riverPts,
    fill: 'none',
    stroke: 'rgba(120,180,220,0.10)',
    'stroke-width': 42,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
  }, gRiver);
  txt(gRiver, 'Bow River', {
    x: 370, y: 145,
    fill: 'rgba(120,180,220,0.30)', 'font-size': '9',
    'font-family': C.font, 'font-style': 'italic', 'font-weight': '400',
    'text-anchor': 'middle',
  });

  /* ── streets grid ── */
  var vX = [240, 280, 305, 480];
  var hY = [240, 275, 345];

  var vThick = [0, 1, 3];
  var hThick = [0, 2];
  vX.forEach(function (x, i) {
    var w = vThick.indexOf(i) >= 0 ? 4.5 : 1.5;
    el('line', { x1: x, y1: 40, x2: x, y2: S - 45, stroke: C.street, 'stroke-width': w }, gStreets);
  });
  hY.forEach(function (y, i) {
    var w = hThick.indexOf(i) >= 0 ? 4.5 : 1.5;
    el('line', { x1: 35, y1: y, x2: S - 25, y2: y, stroke: C.street, 'stroke-width': w }, gStreets);
  }); 

  /* ── C-Train (double line) ── */
  var ctrainX1 = 15, ctrainX2 = S - 10, ctrainY = 310;
  var ctrainGap = 3.5;
  var ctrainLen = ctrainX2 - ctrainX1;

  /* two parallel lines */
  var ctrainTop = el('line', {
    x1: ctrainX1, y1: ctrainY - ctrainGap, x2: ctrainX2, y2: ctrainY - ctrainGap,
    stroke: C.ctrain, 'stroke-width': 1.5,
  }, gCtrain);
  var ctrainBot = el('line', {
    x1: ctrainX1, y1: ctrainY + ctrainGap, x2: ctrainX2, y2: ctrainY + ctrainGap,
    stroke: C.ctrain, 'stroke-width': 1.5,
  }, gCtrain);

  var ctrainStations = [195, 310, 435, 520];
  ctrainStations.forEach(function (sx) {
    el('rect', {
      x: sx - 4, y: ctrainY - 4, width: 8, height: 8,
      fill: 'none', stroke: C.station, 'stroke-width': 1.2,
    }, gCtrain);
  });

  /* animation: top line draws left→right, bottom line draws right→left */
  ctrainTop.style.strokeDasharray = ctrainLen;
  ctrainTop.style.strokeDashoffset = ctrainLen;
  ctrainBot.style.strokeDasharray = ctrainLen;
  ctrainBot.style.strokeDashoffset = '-' + ctrainLen;

  function animateCtrain(delay) {
    ctrainTop.style.transition = 'none';
    ctrainBot.style.transition = 'none';
    ctrainTop.style.strokeDashoffset = ctrainLen;
    ctrainBot.style.strokeDashoffset = '-' + ctrainLen;
    setTimeout(function () {
      void ctrainTop.offsetWidth;
      ctrainTop.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
      ctrainBot.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
      ctrainTop.style.strokeDashoffset = '0';
      ctrainBot.style.strokeDashoffset = '0';
    }, delay || 0);
  }

  /* initial animations deferred to scroll observer if scrollytelling is present */
  var hasScrolly = !!document.querySelector('.vms-panel');
  if (!hasScrolly) animateCtrain(300);

  /* ── distance zones (1:1 circles) ── */
  var zones = [
    { r: 65,  lbl: 'Immediate Vicinity', lx: SAPL.x - 45, ly: SAPL.y - 65 },
    { r: 135, lbl: 'Short Walking',       lx: SAPL.x - 5, ly: SAPL.y - 130 },
    { r: 345, lbl: 'Broader downtown',    lx: SAPL.x - 5, ly: SAPL.y - 340 },
  ];

  zones.forEach(function (z) {
    el('circle', {
      cx: SAPL.x, cy: SAPL.y, r: z.r,
      fill: 'none', stroke: C.zone, 'stroke-width': 1, 'stroke-dasharray': '3 5',
    }, gZones);
    txt(gZones, z.lbl, {
      x: z.lx, y: z.ly,
      fill: C.zoneLbl, 'font-size': '10',
      'font-family': C.font,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      class: 'zone-label',
    });
  });

  /* ── SAPL marker (clickable) ── */
  var saplLink = el('a', { href: 'https://maps.app.goo.gl/qzV6ds3Z21fmfNh3A', target: '_blank' }, gSapl);
  saplLink.style.cursor = 'pointer';
  el('circle', { cx: SAPL.x, cy: SAPL.y, r: 6, fill: C.sapl }, saplLink);
  txt(saplLink, 'SAPL', {
    x: SAPL.x, y: SAPL.y + 18,
    fill: C.sapl, 'font-size': '12',
    'font-family': C.font, 'font-weight': '700',
    'text-anchor': 'middle', 'letter-spacing': '1',
  });

  /* ── Airport (own layer) ── */
  var AX = 580, AY = 18;

  /* abstracted route: airport → SAPL (drawn airport-first so animation goes airport→SAPL) */
  var routePts = [
    AX + ',' + (AY + 24),
    AX + ',' + (SAPL.y - 80),
    SAPL.x + ',' + (SAPL.y - 80),
    SAPL.x + ',' + SAPL.y,
  ].join(' ');

  /* background: solid line that gets "revealed" by animation */
  var routeBg = el('polyline', {
    points: routePts,
    fill: 'none',
    stroke: 'rgba(255,255,255,0.4)',
    'stroke-width': 5,
    'stroke-linejoin': 'round',
    'stroke-dasharray': '6 4',
  }, gAirport);

  /* overlay: solid mask used for the draw-in animation, then hidden */
  var route = el('polyline', {
    points: routePts,
    fill: 'none',
    stroke: '#23297a',
    'stroke-width': 7,
    'stroke-linejoin': 'round',
  }, gAirport);

  /* distance label along the route */
  txt(gAirport, '~10 km · 15–20 min by car', {
    x: SAPL.x + 430, y: SAPL.y - 170,
    fill: 'rgba(255,255,255,0.35)', 'font-size': '8',
    'font-family': C.font, 'font-weight': '400',
    'text-anchor': 'middle',
  });

  /* icon + label */
  txt(gAirport, '✈', {
    x: AX, y: AY + 2,
    fill: 'rgba(255,255,255,0.7)', 'font-size': '14',
    'text-anchor': 'middle', 'dominant-baseline': 'middle',
  });
  txt(gAirport, 'YYC Airport', {
    x: AX, y: AY + 18,
    fill: 'rgba(255,255,255,0.55)', 'font-size': '9',
    'font-family': C.font, 'font-weight': '500',
    'text-anchor': 'middle',
  });

  /* ── landmarks ── */
  var LM_DOT  = 'rgba(255,190,100,0.6)';
  var LM_LBL  = 'rgba(255,190,100,0.75)';
  var LM_LINE = 'rgba(255,190,100,0.35)';

  var landmarks = [
    { n: 'Calgary Central Library', type: 'dot', x: 530, y: 330, dx: 12, a: 'start' },
    { n: 'Studio Bell',             type: 'dot', x: 540, y: 340, dx: 12, a: 'start' },
    { n: 'Peace Bridge',            type: 'dot', x: SAPL.x,  y: 100, dx: 12, a: 'start' },
    { n: 'Calgary Tower',           type: 'dot', x: 455, y: 365, dx: 12, a: 'start' },
    { n: 'Stephen Avenue Walk', type: 'line', x1: 350, y1: 330, x2: 450, y2: 330 },
    { n: 'Kensington',          type: 'line', x1: 80,  y1: 30, x2: 150, y2: 30 },
    { n: 'Waterfront Park',     type: 'polyline', pts: '210,120 400,170 600,200' },
  ];

  landmarks.forEach(function (lm) {
    var g = el('g', { class: 'map-landmark', 'data-landmark': lm.n }, gLandmarks);
    g.style.cursor = 'default';

    if (lm.type === 'dot') {
      el('rect', {
        x: lm.x - 3.5, y: lm.y - 3.5, width: 7, height: 7,
        fill: LM_DOT, rx: 1,
      }, g);
      txt(g, lm.n, {
        x: lm.x + lm.dx, y: lm.y + 4,
        fill: LM_LBL, 'font-size': '9',
        'font-family': C.font, 'font-style': 'italic',
        'text-anchor': lm.a, 'dominant-baseline': 'middle',
      });
    } else if (lm.type === 'line') {
      el('line', {
        x1: lm.x1, y1: lm.y1, x2: lm.x2, y2: lm.y2,
        stroke: LM_LINE, 'stroke-width': 3, 'stroke-linecap': 'round',
      }, g);
      var mx = (lm.x1 + lm.x2) / 2, my = lm.y1 - 5;
      txt(g, lm.n, {
        x: mx, y: my,
        fill: LM_LBL, 'font-size': '9',
        'font-family': C.font, 'font-style': 'italic',
        'text-anchor': 'middle',
      });
    } else if (lm.type === 'polyline') {
      el('polyline', {
        points: lm.pts,
        fill: 'none',
        stroke: LM_LINE, 'stroke-width': 3,
        'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      }, g);
      var coords = lm.pts.split(' ').map(function (p) { var s = p.split(','); return [+s[0], +s[1]]; });
      var mid = coords[Math.floor(coords.length / 2)];
      txt(g, lm.n, {
        x: mid[0], y: mid[1] - 8,
        fill: LM_LBL, 'font-size': '9',
        'font-family': C.font, 'font-style': 'italic',
        'text-anchor': 'middle',
      });
    }
  });

  /* ── hotels ── */
  var hotels = [
    { n: 'Sandman Signature',      x: 165, y: 297, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/2ZBHfogCVB1Q9DYEA' },
    { n: 'Ramada Plaza',           x: 265, y: 335, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/vjWXH2kHc49Beujn9' },
    { n: 'Element Calgary',        x: 140, y: 220, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/qUB1m5kpZKST1dDC8' },
    { n: 'Hampton Inn',            x: 292, y: 285, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/R6GXHJ5cdmaFyhbX8' },
    { n: 'Courtyard Calgary',      x: 320, y: 262, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/en3uHRionCpdT5xi9' },
    { n: 'The Westin Calgary',     x: 380, y: 230, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/AqHpQbbZmYSc58A69' },
    { n: 'Delta Calgary',          x: 500, y: 248, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/AW4MeGm2FrN3zHYC7' },
    { n: 'Hilton Garden',          x: 540, y: 315, dx: 6,  a: 'start', link: 'https://maps.app.goo.gl/53KTeLMxCzjaEVC98' },
    { n: 'Residence Inn Marriott', x: 292, y: 370, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/uLGxaEkoBWJkVovi7' },
    { n: 'Hyatt Regency',          x: 455, y: 320, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/7yhPjma6idiZzHL77' },
    { n: 'Calgary Marriott',       x: 455, y: 340, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/f44m8BpK8FNnQi537' },
    { n: 'Fairmont Palliser',      x: 420, y: 350, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/ZWYmEMy4X6BQMa6F7' },
    { n: 'The Westley',      x: 292, y: 230, dx: 12,  a: 'start', link: 'https://maps.app.goo.gl/5Ujqf5kG5LB6o4TF7' },
  ];

  hotels.forEach(function (h) {
    var g = el('g', { class: 'map-hotel', 'data-hotel': h.n }, gHotels);
    g.style.cursor = 'pointer';

    var dot = el('circle', { cx: h.x, cy: h.y, r: 4, fill: C.hotelDot }, g);
    var lbl = txt(g, h.n, {
      x: h.x + h.dx, y: h.y + 4,
      fill: C.hotelLbl, 'font-size': '10',
      'font-family': C.font, 'text-anchor': h.a,
      'dominant-baseline': 'middle',
    });

    g.addEventListener('mouseenter', function () {
      dot.setAttribute('r', '6.5');
      dot.setAttribute('fill', '#fff');
      lbl.setAttribute('fill', '#fff');
      lbl.setAttribute('font-weight', '600');
    });
    g.addEventListener('mouseleave', function () {
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', C.hotelDot);
      lbl.setAttribute('fill', C.hotelLbl);
      lbl.removeAttribute('font-weight');
    });
    g.addEventListener('click', function () {
      if (h.link) window.open(h.link, '_blank');
    });
  });

  /* ── mount (wrapper keeps legend aligned to SVG) ── */
  var wrap = document.createElement('div');
  wrap.className = 'map-wrap';
  wrap.appendChild(svg);
  container.appendChild(wrap);

  /* ── floating legend (HTML overlay) ── */
  var layers = [
    { id: 'streets', icon: '<line x1="0" y1="1" x2="20" y2="1" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>', label: 'Streets',  g: gStreets },
    { id: 'ctrain',  icon: '<line x1="0" y1="2" x2="20" y2="2" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><line x1="0" y1="7" x2="20" y2="7" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>', label: 'C-Train / Stations', g: gCtrain },
    { id: 'zones',   icon: '<circle cx="10" cy="5" r="8" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="2 3"/>', label: 'Distance Zones', g: gZones },
    { id: 'airport', icon: '<text x="10" y="8" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="11">✈</text>', label: 'Airport Route', g: gAirport },
    { id: 'landmarks', icon: '<rect x="6" y="1" width="7" height="7" rx="1" fill="rgba(255,190,100,0.6)"/>', label: 'Landmarks', g: gLandmarks },
    { id: 'sapl',    icon: '<circle cx="10" cy="5" r="4" fill="#e91e78"/>', label: 'SAPL',    g: gSapl },
    { id: 'hotels',  icon: '<circle cx="10" cy="5" r="4" fill="rgba(255,255,255,0.5)"/>', label: 'Hotels',  g: gHotels },
  ];

  var legend = document.createElement('div');
  legend.className = 'map-legend-float';
  var html = '';
  layers.forEach(function (l) {
    html +=
      '<label class="ml-row ml-toggle">' +
        '<input type="checkbox" data-layer="' + l.id + '" checked>' +
        '<svg width="20" height="10" style="flex-shrink:0">' + l.icon + '</svg>' +
        '<span>' + l.label + '</span>' +
      '</label>';
  });
  legend.innerHTML = html;
  wrap.appendChild(legend);

  var layerMap = {};
  layers.forEach(function (l) { layerMap[l.id] = l.g; });

  /* route draw animation: mask retracts to reveal dashed line underneath */
  var routeLen = route.getTotalLength();
  route.style.strokeDasharray = routeLen;
  route.style.strokeDashoffset = '0';

  function resetRoute() {
    route.style.transition = 'none';
    route.style.strokeDashoffset = '0';
  }

  function animateRoute(delay) {
    resetRoute();
    setTimeout(function () {
      void route.offsetWidth;
      route.style.transition = 'stroke-dashoffset 1.4s ease-in-out';
      route.style.strokeDashoffset = '-' + routeLen;
    }, delay || 0);
  }

  if (!hasScrolly) animateRoute(400);

  legend.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb.dataset.layer) return;
    var g = layerMap[cb.dataset.layer];
    if (!g) return;
    if (cb.checked) {
      g.style.display = '';
      if (cb.dataset.layer === 'airport') {
        resetRoute();
        animateRoute(300);
      }
      if (cb.dataset.layer === 'ctrain') {
        animateCtrain(200);
      }
    } else {
      g.style.display = 'none';
    }
  });

  /* post-render: zone label background pills */
  var labels = svg.querySelectorAll('.zone-label');
  for (var i = 0; i < labels.length; i++) {
    var t = labels[i];
    var bbox = t.getBBox();
    var px = 7, py = 3;
    var bg = el('rect', {
      x: bbox.x - px, y: bbox.y - py,
      width: bbox.width + px * 2, height: bbox.height + py * 2,
      rx: 3, fill: C.labelBg, stroke: C.labelBdr, 'stroke-width': 1,
    });
    t.parentNode.insertBefore(bg, t);
  }

  /* ── zoom & pan ── */
  var vb = { x: 0, y: 0, w: S, h: S };
  var MIN_VB = S / 3;   // max zoom-in: 3x
  var MAX_VB = S * 1.2;  // max zoom-out: 1.2x (barely wider than default)
  var isPanning = false, panStart = { x: 0, y: 0 }, vbStart = { x: 0, y: 0 };

  function setViewBox() {
    svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
  }

  function svgPoint(clientX, clientY) {
    var rect = svg.getBoundingClientRect();
    return {
      x: vb.x + (clientX - rect.left) / rect.width * vb.w,
      y: vb.y + (clientY - rect.top) / rect.height * vb.h,
    };
  }

  function zoom(delta, cx, cy) {
    var factor = delta > 0 ? 0.97 : 1.03;
    var nw = vb.w * factor, nh = vb.h * factor;
    if (nw < MIN_VB || nw > MAX_VB) return;
    var pt = svgPoint(cx, cy);
    vb.x = pt.x - (pt.x - vb.x) * factor;
    vb.y = pt.y - (pt.y - vb.y) * factor;
    vb.w = nw;
    vb.h = nh;
    setViewBox();
  }

  svg.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoom(e.deltaY > 0 ? -1 : 1, e.clientX, e.clientY);
  }, { passive: false });

  /* mouse pan */
  svg.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    isPanning = true;
    panStart.x = e.clientX; panStart.y = e.clientY;
    vbStart.x = vb.x; vbStart.y = vb.y;
    svg.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', function (e) {
    if (!isPanning) return;
    var rect = svg.getBoundingClientRect();
    var dx = (e.clientX - panStart.x) / rect.width * vb.w;
    var dy = (e.clientY - panStart.y) / rect.height * vb.h;
    vb.x = vbStart.x - dx;
    vb.y = vbStart.y - dy;
    setViewBox();
  });
  window.addEventListener('mouseup', function () {
    isPanning = false;
    svg.style.cursor = '';
  });

  /* touch pinch-zoom & pan */
  var touches0 = null, pinchDist0 = 0, vbPinch0 = null;

  function touchDist(t) {
    var dx = t[0].clientX - t[1].clientX;
    var dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function touchCenter(t) {
    return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
  }

  svg.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      isPanning = true;
      panStart.x = e.touches[0].clientX;
      panStart.y = e.touches[0].clientY;
      vbStart.x = vb.x; vbStart.y = vb.y;
    } else if (e.touches.length === 2) {
      isPanning = false;
      pinchDist0 = touchDist(e.touches);
      vbPinch0 = { x: vb.x, y: vb.y, w: vb.w, h: vb.h };
      touches0 = touchCenter(e.touches);
    }
  }, { passive: true });

  svg.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning) {
      var rect = svg.getBoundingClientRect();
      var dx = (e.touches[0].clientX - panStart.x) / rect.width * vb.w;
      var dy = (e.touches[0].clientY - panStart.y) / rect.height * vb.h;
      vb.x = vbStart.x - dx;
      vb.y = vbStart.y - dy;
      setViewBox();
    } else if (e.touches.length === 2 && vbPinch0) {
      var dist = touchDist(e.touches);
      var scale = pinchDist0 / dist;
      var nw = vbPinch0.w * scale, nh = vbPinch0.h * scale;
      if (nw < MIN_VB || nw > MAX_VB) return;
      var center = touchCenter(e.touches);
      var pt0 = svgPoint(touches0.x, touches0.y);
      var pt1 = svgPoint(center.x, center.y);
      vb.w = nw; vb.h = nh;
      vb.x = vbPinch0.x + (pt0.x - pt1.x);
      vb.y = vbPinch0.y + (pt0.y - pt1.y);
      setViewBox();
    }
  }, { passive: false });

  svg.addEventListener('touchend', function (e) {
    if (e.touches.length < 2) { vbPinch0 = null; touches0 = null; }
    if (e.touches.length === 0) isPanning = false;
  }, { passive: true });

  /* double-click / double-tap to reset */
  svg.addEventListener('dblclick', function (e) {
    e.preventDefault();
    vb.x = 0; vb.y = 0; vb.w = S; vb.h = S;
    setViewBox();
  });

  /* ── scroll-driven layer toggling ── */
  if (hasScrolly) {
    var sectionLayers = {
      'getting-here':  { on: ['streets','zones','sapl','airport','ctrain','river'], off: ['hotels','landmarks'] },
      'accommodation': { on: ['streets','zones','sapl','airport','ctrain','hotels','river'], off: ['landmarks'] },
      'calgary':       { on: ['streets','zones','sapl','airport','ctrain','hotels','landmarks','river'], off: [] },
    };

    var currentSection = null;

    function setLayers(sectionId) {
      if (sectionId === currentSection) return;
      currentSection = sectionId;
      var cfg = sectionLayers[sectionId];
      if (!cfg) return;

      cfg.on.forEach(function (id) {
        if (layerMap[id]) layerMap[id].style.display = '';
        var cb = legend.querySelector('[data-layer="' + id + '"]');
        if (cb) cb.checked = true;
      });
      cfg.off.forEach(function (id) {
        if (layerMap[id]) layerMap[id].style.display = 'none';
        var cb = legend.querySelector('[data-layer="' + id + '"]');
        if (cb) cb.checked = false;
      });

      if (sectionId === 'getting-here') {
        resetRoute();
        animateRoute(200);
        animateCtrain(100);
      }
      if (sectionId === 'accommodation') {
        animateCtrain(0);
      }
    }

    /* start with getting-here state (hotels/landmarks hidden) */
    setLayers('getting-here');

    var panels = document.querySelectorAll('.vms-panel');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setLayers(entry.target.dataset.mapSection);
        }
      });
    }, { threshold: 0.4 });

    panels.forEach(function (p) { observer.observe(p); });
  }

})();
