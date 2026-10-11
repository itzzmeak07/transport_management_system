/* FreshTrack mockups: map renderer + desktop-frame scaling.
   Maps are stylised (not real tiles): lon/lat projected linearly, coastlines approximated. */
(function () {
  var K = 100; // units per degree
  var P = function (lon, lat) { return [(lon - 70) * K, (25 - lat) * K]; };

  var CITY = {
    solapur: [75.91, 17.66, 'Solapur'], hyderabad: [78.47, 17.38, 'Hyderabad'], vijayawada: [80.65, 16.51, 'Vijayawada'],
    vizag: [83.22, 17.69, 'Visakhapatnam'], pune: [73.86, 18.52, 'Pune'], mumbai: [72.88, 19.08, 'Mumbai'],
    nagpur: [79.09, 21.15, 'Nagpur'], bhopal: [77.41, 23.26, 'Bhopal'], ahmedabad: [72.57, 23.02, 'Ahmedabad'],
    bengaluru: [77.59, 12.97, 'Bengaluru'], kurnool: [78.04, 15.83, 'Kurnool'], aurangabad: [75.34, 19.88, 'Aurangabad'],
    guntur: [80.44, 16.3, 'Guntur'], warangal: [79.59, 17.97, 'Warangal'], rajahmundry: [81.8, 17.0, 'Rajahmundry'], nanded: [77.32, 19.15, 'Nanded']
  };
  // Main sample trip route (road-like polyline) and where each stop sits on it
  var TRIP = [[75.91, 17.66], [76.55, 17.8], [77.2, 17.68], [77.85, 17.5], [78.47, 17.38], [79.1, 17.15], [79.6, 16.95], [80.15, 16.7], [80.65, 16.51], [81.2, 16.68], [81.8, 17.0], [82.3, 17.2], [82.75, 17.45], [83.22, 17.69]];
  var TRIP_STOPS = [4, 8, 13];
  var FLEET = [
    { id: 'MH13-AB-1234', pts: TRIP, at: 0.62, st: 'next', main: true },
    { id: 'MH14-CD-5678', pts: [[75.91, 17.66], [76.5, 18.4], [77.32, 19.15], [78.1, 20.1], [79.09, 21.15], [78.6, 22.2], [77.41, 23.26]], at: 0.34, st: 'next' },
    { id: 'MH12-EF-9012', pts: [[75.91, 17.66], [75.0, 18.1], [73.86, 18.52], [73.3, 18.8], [72.88, 19.08]], at: 0.78, st: 'ok' },
    { id: 'MH13-GH-3456', pts: [[75.91, 17.66], [75.34, 19.88], [74.6, 21.0], [73.4, 22.1], [72.57, 23.02]], at: 0.46, st: 'alert' },
    { id: 'MH45-KL-2211', pts: [[75.91, 17.66], [76.3, 16.2], [76.9, 14.6], [77.59, 12.97]], at: 0.55, st: 'next' },
    { id: 'MH13-JK-7781', pts: [[75.91, 17.66], [76.6, 17.1], [77.3, 16.4], [78.04, 15.83]], at: 0.88, st: 'next' }
  ];
  var ARABIAN = [[55, 32], [68.2, 23.6], [69.6, 22.6], [70.6, 21.0], [72.2, 21.2], [72.6, 20.6], [72.75, 19.6], [72.85, 18.9], [73.05, 18.0], [73.3, 17.1], [73.6, 16.2], [73.85, 15.5], [74.15, 14.6], [74.6, 13.6], [74.85, 12.6], [75.4, 11.6], [75.9, 10.6], [76.3, 9.6], [76.7, 8.6], [77.4, 8.0], [77.6, 4], [55, 4]];
  var BAY = [[77.6, 4], [77.6, 8.2], [78.2, 8.9], [78.9, 9.4], [79.3, 10.3], [79.85, 10.9], [79.85, 11.9], [80.25, 13.2], [80.2, 14.4], [80.05, 15.3], [80.35, 15.75], [80.85, 15.9], [81.25, 16.25], [81.75, 16.35], [82.3, 16.6], [82.4, 17.0], [82.95, 17.35], [83.5, 17.95], [84.1, 18.4], [84.8, 19.1], [85.5, 19.8], [86.5, 20.3], [86.9, 21.2], [88, 21.7], [92, 22], [99, 4]];
  var BORDERS = [
    [[74.3, 15.9], [74.9, 16.5], [75.5, 16.6], [76.1, 17.2], [76.9, 17.6], [77.5, 18.3], [77.6, 18.9], [78.3, 19.9], [79.2, 19.6], [79.9, 19.4], [80.5, 18.8], [81.1, 18.4]],
    [[77.5, 18.3], [77.6, 17.2], [77.35, 16.4], [77.7, 15.9], [78.6, 16.05], [79.3, 16.6], [80.1, 17.0], [80.6, 17.3], [81.0, 17.8], [81.6, 17.9], [81.1, 18.4]],
    [[72.9, 20.2], [73.7, 20.9], [74.4, 21.6], [75.4, 21.4], [76.3, 21.2], [77.3, 21.5], [78.4, 21.6], [79.4, 21.6], [80.5, 21.4], [80.6, 20.2], [80.3, 19.5]],
    [[77.35, 16.4], [76.6, 15.2], [77.0, 14.3], [77.9, 13.9], [78.6, 12.8]]
  ];
  var STATES = [['MAHARASHTRA', 76.4, 19.9], ['TELANGANA', 79.0, 18.35], ['ANDHRA PRADESH', 79.7, 15.4], ['KARNATAKA', 76.1, 14.9], ['MADHYA PRADESH', 77.6, 22.6], ['GUJARAT', 71.4, 22.6], ['CHHATTISGARH', 81.9, 21.0], ['ODISHA', 84.5, 20.5]];

  function path(pts, close) { return pts.map(function (p, i) { var q = P(p[0], p[1]); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ') + (close ? ' Z' : ''); }
  function lens(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) { var a = P(pts[i - 1][0], pts[i - 1][1]), b = P(pts[i][0], pts[i][1]); L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } return L; }
  function along(pts, f) { // returns {pt:[x,y], idx, partial pts in lon/lat}
    var L = lens(pts), tot = L[L.length - 1], d = f * tot;
    for (var i = 1; i < pts.length; i++) {
      if (L[i] >= d) {
        var t = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
        var lon = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, lat = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t;
        return { ll: [lon, lat], before: pts.slice(0, i).concat([[lon, lat]]), after: [[lon, lat]].concat(pts.slice(i)) };
      }
    }
    return { ll: pts[pts.length - 1], before: pts, after: [pts[pts.length - 1]] };
  }
  function fracOfIndex(pts, idx) { var L = lens(pts); return L[idx] / L[L.length - 1]; }

  function render(el) {
    var mode = el.getAttribute('data-mode') || 'trip';
    var truckF = parseFloat(el.getAttribute('data-truck') || '0.62');
    var done = parseInt(el.getAttribute('data-done') || '1', 10);
    var labels = el.getAttribute('data-labels') || 'city';
    var etas = (el.getAttribute('data-etas') || '').split('|');
    var sel = el.getAttribute('data-sel');
    var zoom = parseFloat(el.getAttribute('data-zoom') || '1');
    var b;
    if (mode === 'fleet') b = [71.6, 12.4, 84.6, 23.9];
    else if (mode === 'dealer') b = [77.6, 15.6, 84.0, 18.6];
    else b = [75.2, 15.7, 84.0, 18.4];
    if (el.getAttribute('data-bounds')) b = el.getAttribute('data-bounds').split(',').map(parseFloat);
    var tl = P(b[0], b[3]), br = P(b[2], b[1]);
    var vw = br[0] - tl[0], vh = br[1] - tl[1];
    var cw = el.clientWidth || 600, ch = el.clientHeight || 400;
    var s = Math.max(vw / cw, vh / ch) / zoom; // units per css px (meet)
    var o = [];
    o.push('<svg viewBox="' + tl[0] + ' ' + tl[1] + ' ' + vw + ' ' + vh + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">');
    o.push('<rect x="-2000" y="-2000" width="6000" height="6000" fill="#EEF1EA"/>');
    // subtle terrain blotches
    o.push('<g fill="#E4EADF"><ellipse cx="' + P(77, 20.5)[0] + '" cy="' + P(77, 20.5)[1] + '" rx="' + 180 + '" ry="90"/><ellipse cx="' + P(79.5, 16.4)[0] + '" cy="' + P(79.5, 16.4)[1] + '" rx="140" ry="60"/><ellipse cx="' + P(75, 14.5)[0] + '" cy="' + P(75, 14.5)[1] + '" rx="120" ry="80"/></g>');
    o.push('<path d="' + path(ARABIAN, true) + '" fill="#D5E6F2"/><path d="' + path(BAY, true) + '" fill="#D5E6F2"/>');
    BORDERS.forEach(function (bd) { o.push('<path d="' + path(bd) + '" fill="none" stroke="#B9C4B4" stroke-width="' + (1.4 * s) + '" stroke-dasharray="' + (5 * s) + ' ' + (4 * s) + '"/>'); });
    STATES.forEach(function (st) { var q = P(st[1], st[2]); o.push('<text x="' + q[0] + '" y="' + q[1] + '" font-size="' + (10 * s) + '" fill="#9AA79A" font-family="Inter,sans-serif" font-weight="600" letter-spacing="' + (1.5 * s) + '" text-anchor="middle">' + st[0] + '</text>'); });
    // background highways
    var hw = [[CITY.solapur, CITY.pune, CITY.mumbai], [CITY.pune, CITY.aurangabad, CITY.nanded, CITY.hyderabad], [CITY.hyderabad, CITY.nagpur, CITY.bhopal], [CITY.hyderabad, CITY.kurnool, CITY.bengaluru], [CITY.hyderabad, CITY.warangal, CITY.rajahmundry, CITY.vizag], [CITY.vijayawada, CITY.guntur], [CITY.solapur, CITY.kurnool]];
    hw.forEach(function (h) { o.push('<path d="' + path(h) + '" fill="none" stroke="#FFFFFF" stroke-width="' + (3.2 * s) + '" stroke-linecap="round" stroke-linejoin="round"/>'); });
    // faint city dots
    var faint = ['pune', 'mumbai', 'nagpur', 'bhopal', 'ahmedabad', 'bengaluru', 'kurnool', 'aurangabad', 'warangal', 'rajahmundry', 'guntur', 'nanded'];
    faint.forEach(function (k) {
      var c = CITY[k], q = P(c[0], c[1]);
      if (c[0] < b[0] - .5 || c[0] > b[2] + .5 || c[1] < b[1] - .5 || c[1] > b[3] + .5) return;
      o.push('<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (2.6 * s) + '" fill="#A7B2AA"/>');
      if (labels !== 'none') o.push(lbl(q[0] + 5 * s, q[1] + 3.5 * s, c[2], 10, '#8A978E', 'start', 500));
    });

    function lbl(x, y, t, fs, col, anchor, w) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (fs * s) + '" fill="' + (col || '#1E2A35') + '" font-family="Inter,sans-serif" font-weight="' + (w || 600) + '" text-anchor="' + (anchor || 'start') + '" stroke="#FFFFFF" stroke-width="' + (3 * s) + '" paint-order="stroke" stroke-linejoin="round">' + t + '</text>';
    }
    function stopMark(q, n, st, r) {
      r = (r || 13) * s; var g = '';
      if (st === 'next') {
        g += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '" fill="#F2A900" opacity=".35"><animate attributeName="r" values="' + r + ';' + (r * 1.9) + ';' + r + '" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".45;0;.45" dur="1.8s" repeatCount="indefinite"/></circle>';
        g += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '" fill="#F2A900" stroke="#fff" stroke-width="' + (2.5 * s) + '"/>';
        g += '<text x="' + q[0] + '" y="' + (q[1] + r * .36) + '" font-size="' + (r * 1.05) + '" text-anchor="middle" font-weight="800" fill="#2B1E00" font-family="Inter,sans-serif">' + n + '</text>';
      } else if (st === 'done') {
        g += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '" fill="#1B6B4A" stroke="#fff" stroke-width="' + (2.5 * s) + '"/>';
        g += '<text x="' + q[0] + '" y="' + (q[1] + r * .36) + '" font-size="' + (r * 1.05) + '" text-anchor="middle" font-weight="800" fill="#fff" font-family="Inter,sans-serif">' + n + '</text>';
      } else if (st === 'anon') {
        g += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (r * .5) + '" fill="#B8C1C8" stroke="#fff" stroke-width="' + (2 * s) + '"/>';
      } else {
        g += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '" fill="#fff" stroke="#94A0AA" stroke-width="' + (2.5 * s) + '"/>';
        g += '<text x="' + q[0] + '" y="' + (q[1] + r * .36) + '" font-size="' + (r * 1.05) + '" text-anchor="middle" font-weight="800" fill="#66737F" font-family="Inter,sans-serif">' + n + '</text>';
      }
      return g;
    }
    function origin(q) {
      var r = 12 * s;
      return '<rect x="' + (q[0] - r) + '" y="' + (q[1] - r) + '" width="' + (2 * r) + '" height="' + (2 * r) + '" rx="' + (5 * s) + '" fill="#12513A" stroke="#fff" stroke-width="' + (2.5 * s) + '"/>' +
        '<text x="' + q[0] + '" y="' + (q[1] + 6.5 * s) + '" font-size="' + (17 * s) + '" text-anchor="middle" fill="#fff" font-family="Material Symbols Rounded">warehouse</text>';
    }
    function truck(q, st, big, id) {
      var r = (big ? 17 : 13) * s, col = st === 'alert' ? '#D23F3F' : st === 'ok' ? '#1B6B4A' : '#12513A';
      var g = '<circle cx="' + q[0] + '" cy="' + (q[1] + 2 * s) + '" r="' + r + '" fill="rgba(15,27,36,.18)"/>';
      g += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '" fill="' + col + '" stroke="#fff" stroke-width="' + (3 * s) + '"/>';
      g += '<text x="' + q[0] + '" y="' + (q[1] + r * .42) + '" font-size="' + (r * 1.2) + '" text-anchor="middle" fill="#fff" font-family="Material Symbols Rounded">local_shipping</text>';
      if (st === 'alert') g += '<circle cx="' + (q[0] + r * .8) + '" cy="' + (q[1] - r * .8) + '" r="' + (6 * s) + '" fill="#fff"/><text x="' + (q[0] + r * .8) + '" y="' + (q[1] - r * .8 + 4 * s) + '" font-size="' + (11 * s) + '" text-anchor="middle" fill="#D23F3F" font-weight="800" font-family="Inter,sans-serif">!</text>';
      if (id) o2.push(lbl(q[0], q[1] - r - 6 * s, id, 10.5, st === 'alert' ? '#A32626' : '#1E2A35', 'middle', 700));
      return g;
    }
    var o2 = [];

    if (mode === 'fleet') {
      FLEET.forEach(function (t) {
        var a = along(t.pts, t.at), isSel = sel && sel === t.id;
        o.push('<path d="' + path(t.pts) + '" fill="none" stroke="' + (isSel ? '#1B6B4A' : '#7FA894') + '" stroke-width="' + ((isSel ? 4 : 2.6) * s) + '" stroke-dasharray="' + (6 * s) + ' ' + (5 * s) + '" stroke-linecap="round" opacity="' + (isSel ? 1 : .7) + '"/>');
        o.push('<path d="' + path(a.before) + '" fill="none" stroke="' + (isSel ? '#1B6B4A' : '#5E9278') + '" stroke-width="' + ((isSel ? 4.5 : 3) * s) + '" stroke-linecap="round" stroke-linejoin="round"/>');
      });
      var q0 = P(CITY.solapur[0], CITY.solapur[1]);
      o.push(origin(q0)); o2.push(lbl(q0[0] - 16 * s, q0[1] + 4 * s, 'Solapur', 12, '#12513A', 'end', 700));
      if (sel === 'MH13-AB-1234') { TRIP_STOPS.forEach(function (ix, i) { var q = P(TRIP[ix][0], TRIP[ix][1]); o.push(stopMark(q, i + 1, i < done ? 'done' : (i === done ? 'next' : 'up'), 10)); }); }
      FLEET.forEach(function (t) { var a = along(t.pts, t.at); o.push(truck(P(a.ll[0], a.ll[1]), t.st, sel === t.id, labels === 'ids' ? t.id : null)); });
    } else {
      var routeOnly = TRIP;
      var a = along(routeOnly, truckF);
      var showTruck = mode !== 'plan' && el.getAttribute('data-truck') !== 'none';
      if (mode === 'plan' || !showTruck) {
        o.push('<path d="' + path(routeOnly) + '" fill="none" stroke="#1B6B4A" stroke-width="' + (4 * s) + '" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>');
      } else {
        o.push('<path d="' + path(a.after) + '" fill="none" stroke="#1B6B4A" stroke-width="' + (3.4 * s) + '" stroke-dasharray="' + (7 * s) + ' ' + (6 * s) + '" stroke-linecap="round" opacity=".75"/>');
        o.push('<path d="' + path(a.before) + '" fill="none" stroke="#1B6B4A" stroke-width="' + (5 * s) + '" stroke-linecap="round" stroke-linejoin="round"/>');
      }
      var q0 = P(TRIP[0][0], TRIP[0][1]);
      if (mode !== 'dealer') { o.push(origin(q0)); if (labels !== 'none') o2.push(lbl(q0[0], q0[1] + 27 * s, 'Solapur', 12, '#12513A', 'middle', 700)); }
      var names = ['Hyderabad', 'Vijayawada', 'Visakhapatnam'];
      TRIP_STOPS.forEach(function (ix, i) {
        var q = P(TRIP[ix][0], TRIP[ix][1]);
        var st = mode === 'plan' ? 'up' : (i < done ? 'done' : (i === done ? 'next' : 'up'));
        if (mode === 'dealer' && i < 2) { o.push(stopMark(q, '', 'anon', 13)); return; }
        o.push(stopMark(q, i + 1, st, mode === 'dealer' ? 16 : 14));
        if (labels !== 'none') {
          var dy = i === 1 ? 32 : -22, nm = mode === 'dealer' ? 'You · Visakhapatnam' : names[i];
          var anc = i === 2 ? 'end' : 'middle', dx = i === 2 ? 14 : 0;
          o2.push(lbl(q[0] + dx, q[1] + dy * s, nm, 12, '#1E2A35', anc, 700));
          if (etas[i]) o2.push(lbl(q[0] + dx, q[1] + (dy + 14) * s, etas[i], 11, i < done ? '#1B6B4A' : (i === done ? '#8A5D00' : '#4B5A68'), anc, 600));
        }
      });
      if (showTruck) o.push(truck(P(a.ll[0], a.ll[1]), el.getAttribute('data-tst') || 'next', true));
    }
    o.push(o2.join(''));
    o.push('</svg>');
    el.insertAdjacentHTML('afterbegin', o.join(''));
  }

  function scaleDesks() {
    document.querySelectorAll('.desk-wrap').forEach(function (w) {
      var d = w.querySelector('.desk'); if (!d) return;
      var sc = Math.min(1, w.clientWidth / 1440);
      d.style.transform = 'scale(' + sc + ')';
      w.style.height = (d.offsetHeight * sc) + 'px';
    });
  }
  function chrome() {
    // Android status bar
    document.querySelectorAll('.scr').forEach(function (s) {
      if (s.querySelector('.sb')) return;
      var light = s.getAttribute('data-sb') === 'light';
      s.insertAdjacentHTML('afterbegin', '<div class="sb' + (light ? ' light' : '') + '"><span>10:24</span><span><span class="ms fill">signal_cellular_alt</span> <span class="ms fill">wifi</span> <span class="ms fill">battery_5_bar</span></span></div>');
    });
    // Admin sidebar
    var NAV = [['Operations'], ['Dashboard', 'space_dashboard'], ['Trips', 'route'], ['Live Map', 'map'], ['Approvals', 'fact_check', 2], ['POD Review', 'inventory'],
      ['Masters'], ['Dealers', 'storefront'], ['Vehicle Owners', 'badge'], ['Vehicles', 'local_shipping'], ['Drivers', 'person_pin'], ['Products', 'nutrition'],
      ['Business'], ['Reports', 'bar_chart'], ['Finance', 'payments'], ['System'], ['Settings', 'settings'], ['Audit Log', 'history']];
    document.querySelectorAll('aside.side').forEach(function (a) {
      if (a.children.length) return;
      var on = a.getAttribute('data-on');
      var h = '<div class="logo"><div class="leaf"><span class="ms fill" style="font-size:22px">eco</span></div><div><b>FreshTrack</b><small>Perishables. On Time.</small></div></div>';
      NAV.forEach(function (n) {
        if (n.length === 1) { h += '<div class="grp">' + n[0] + '</div>'; return; }
        h += '<div class="nav' + (n[0] === on ? ' on' : '') + '"><span class="ms' + (n[0] === on ? ' fill' : '') + '">' + n[1] + '</span>' + n[0] + (n[2] ? '<span class="badge amber">' + n[2] + '</span>' : '') + '</div>';
      });
      h += '<div class="me"><div class="avatar">SK</div><div><div style="color:#fff;font-weight:600;font-size:13px">Suresh Kulkarni</div><div style="font-size:11px;opacity:.65">Super Admin</div></div></div>';
      a.innerHTML = h;
    });
    document.querySelectorAll('.topbar').forEach(function (t) {
      if (t.children.length) return;
      t.innerHTML = '<div class="search"><span class="ms">search</span>Search trip no., truck no. or dealer…<span style="margin-left:auto;font-size:11px;border:1px solid var(--s300);border-radius:5px;padding:1px 6px">Ctrl K</span></div>' +
        '<div style="margin-left:auto" class="row"><span class="lang dark"><span class="on">English</span><span class="deva">हिंदी</span><span class="deva">मराठी</span></span>' +
        '<span style="position:relative;margin:0 6px 0 10px"><span class="ms" style="font-size:24px;color:var(--s600)">notifications</span><span class="badge" style="position:absolute;top:-6px;right:-8px">5</span></span>' +
        '<div class="avatar" style="width:34px;height:34px">SK</div></div>';
    });
  }
  function init() {
    chrome();
    document.querySelectorAll('.map').forEach(render);
    scaleDesks();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('resize', scaleDesks);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scaleDesks);
})();
