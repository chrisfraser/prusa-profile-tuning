/* ============================================================================
   Dialled In — shared widget behaviour
   Auto-wires any markup that follows the conventions below. Load with `defer`.
   Pairs with the .quiz / .faultfinder / .checklist styles in assets/styles.css.
   The API is identical in every course in this workspace, so lessons and
   widgets stay interchangeable between them.
   ============================================================================ */
(function () {
  'use strict';

  /* ---- Storage ----------------------------------------------------------
     Everything persisted is progress, never content. All access is wrapped:
     Chrome refuses localStorage on some file:// origins, and the widgets must
     still work — they just stop remembering.
  ------------------------------------------------------------------------- */
  var store = {
    ok: (function () {
      try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; }
      catch (e) { return false; }
    })(),
    get: function (k, fallback) {
      try { var s = localStorage.getItem(k); return s === null ? fallback : JSON.parse(s); }
      catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
    },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  var PROGRESS_KEY = 'dialledIn.progress.v1';
  var CHECKLIST_KEY = 'dialledIn.checklist.v1';

  /* One-time remap: 2026-08 inserted L9 (import the starter profiles), shifting
     the old lessons 9–18 to 10–19. Saved progress and checklist ticks are keyed
     by lesson number, so stored marks from before the insert must shift with
     them or they light up the wrong lessons. */
  function migrateL9Insert() {
    if (!store.ok) return;
    var FLAG = 'dialledIn.migrated.2026-08-l9insert';
    try {
      if (localStorage.getItem(FLAG)) return;
      var pad = function (n) { return ('000' + n).slice(-4); };
      var p = store.get(PROGRESS_KEY, {}) || {};
      var np = {};
      Object.keys(p).forEach(function (id) {
        var n = parseInt(id, 10);
        np[n >= 9 && n <= 18 ? pad(n + 1) : id] = p[id];
      });
      if (Object.keys(np).length) store.set(PROGRESS_KEY, np);
      var moves = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(CHECKLIST_KEY + '.') !== 0) continue;
        var m = k.match(/^(.*\.)(\d{4})(-[a-z0-9-]+\.html#\d+)$/);
        if (m) {
          var n = parseInt(m[2], 10);
          if (n >= 9 && n <= 18) moves.push({ key: k, n: n, pre: m[1], post: m[3] });
        }
      }
      moves.sort(function (a, b) { return b.n - a.n; });
      moves.forEach(function (mv) {
        var v = localStorage.getItem(mv.key);
        localStorage.removeItem(mv.key);
        if (v !== null) localStorage.setItem(mv.pre + pad(mv.n + 1) + mv.post, v);
      });
      localStorage.setItem(FLAG, '1');
    } catch (e) {}
  }

  function pageName() {
    var p = location.pathname.split('/').pop();
    return p || 'index.html';
  }
  /* "0003-what-the-slicer-decides.html" -> "0003"; anything else -> null */
  function lessonId(path) {
    var m = String(path).match(/(\d{4})-[a-z0-9-]+\.html/);
    return m ? m[1] : null;
  }

  /* ---- Quizzes ----------------------------------------------------------
     <div class="quiz" data-explain-right="..." data-explain-wrong="...">
       <div class="q-kicker">Question 1 of 3</div>
       <div class="q-text">Question?</div>
       <div class="q-options">
         <button class="opt" data-correct>Right answer</button>
         <button class="opt">Distractor</button>
       </div>
       <div class="q-feedback"></div>
     </div>
     Per-option override: add data-feedback="..." to a button.
     Keep every option the SAME length so layout gives no clue to the answer.
  ------------------------------------------------------------------------- */
  function wireQuiz(quiz) {
    var options = Array.prototype.slice.call(quiz.querySelectorAll('button.opt'));
    var feedback = quiz.querySelector('.q-feedback');
    var answered = false;

    options.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var isRight = btn.hasAttribute('data-correct');

        options.forEach(function (o) {
          o.disabled = true;
          if (o.hasAttribute('data-correct')) o.classList.add('correct');
        });
        if (!isRight) btn.classList.add('wrong');

        if (feedback) {
          var msg = btn.getAttribute('data-feedback');
          if (!msg) {
            msg = isRight
              ? (quiz.getAttribute('data-explain-right') || 'Correct.')
              : (quiz.getAttribute('data-explain-wrong') || 'Not quite — see the highlighted answer.');
          }
          feedback.innerHTML = (isRight ? '✓ ' : '✗ ') + msg;
          feedback.classList.add('show', isRight ? 'right' : 'nope');
        }
      });
    });
  }

  /* ---- Range helper -----------------------------------------------------
     <input type="range" data-output="#myOutput" data-suffix=" kg">
     Mirrors the live value into the element matched by data-output.
  ------------------------------------------------------------------------- */
  function wireRange(input) {
    var sel = input.getAttribute('data-output');
    if (!sel) return;
    var out = document.querySelector(sel);
    if (!out) return;
    var suffix = input.getAttribute('data-suffix') || '';
    var sync = function () { out.textContent = input.value + suffix; };
    input.addEventListener('input', sync);
    sync();
  }

  /* ---- Checklist with live progress tally --------------------------------
     <div class="checklist-widget">
       <ul class="checklist">
         <li data-check>First thing to do</li>
         <li data-check>Second thing to do</li>
       </ul>
       <div class="checklist-bar"><span data-checklist-progress></span></div>
     </div>
     Click (or Enter/Space) an item to tick it. Progress shows done/total.
     Ticks survive a reload: they are stored per page, per widget, by item
     index, so a long sign-off checklist can be worked through over an evening
     with the printer rather than in one sitting at the desk.
  ------------------------------------------------------------------------- */
  function wireChecklist(widget, index) {
    var items = Array.prototype.slice.call(widget.querySelectorAll('[data-check]'));
    var progressEl = widget.querySelector('[data-checklist-progress]');
    var bar = widget.querySelector('.checklist-bar');
    var key = CHECKLIST_KEY + '.' + pageName() + '#' + (index || 0);

    function save() {
      var done = [];
      items.forEach(function (it, i) { if (it.classList.contains('done')) done.push(i); });
      if (done.length) store.set(key, done); else store.del(key);
    }
    function update() {
      var done = 0, total = items.length;
      items.forEach(function (it) { if (it.classList.contains('done')) done++; });
      if (progressEl) progressEl.textContent = done + ' / ' + total + ' ticked';
      if (reset) reset.hidden = done === 0;
    }

    var reset = null;
    if (bar && store.ok) {
      reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'cl-reset';
      reset.textContent = 'Clear ticks';
      reset.hidden = true;
      reset.addEventListener('click', function () {
        items.forEach(function (it) { it.classList.remove('done'); });
        save(); update();
      });
      bar.appendChild(reset);
    }

    (store.get(key, []) || []).forEach(function (i) {
      if (items[i]) items[i].classList.add('done');
    });

    items.forEach(function (it) {
      it.setAttribute('role', 'button');
      it.setAttribute('tabindex', '0');
      var toggle = function () { it.classList.toggle('done'); save(); update(); };
      it.addEventListener('click', toggle);
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
    update();
  }

  /* ---- Fault-finder (symptom → why it hurts → the fix) -------------------
     <div class="faultfinder">
       <div class="ff-q">Which rule does each break?</div>
       <ul class="ff-list">
         <li class="ff-item" data-cause="..." data-fix="...">Symptom <span class="ff-tag">Rule 1</span></li>
       </ul>
       <div class="ff-panel"><div class="ff-cause"></div><div class="ff-fix"></div></div>
     </div>
     Click a symptom → its cause and fix appear. One active at a time.
  ------------------------------------------------------------------------- */
  function wireFaultFinder(ff) {
    var items = Array.prototype.slice.call(ff.querySelectorAll('.ff-item'));
    var causeEl = ff.querySelector('.ff-cause');
    var fixEl = ff.querySelector('.ff-fix');
    items.forEach(function (it) {
      it.addEventListener('click', function () {
        items.forEach(function (x) { x.classList.remove('active'); });
        it.classList.add('active');
        ff.classList.add('answered');
        if (causeEl) causeEl.innerHTML = '<span class="lab">Why it hurts</span>' + (it.getAttribute('data-cause') || '');
        if (fixEl) fixEl.innerHTML = '<span class="lab">The fix</span>' + (it.getAttribute('data-fix') || '');
      });
    });
  }

  /* ---- Live calculator ---------------------------------------------------
     A declarative arithmetic surface: the reader types their own measurements
     and the lesson's formula runs in front of them. Nothing is stored.

     <div class="calc">
       <div class="calc-grid">
         <label class="calc-field">Layer height
           <input type="number" data-var="h" value="0.20" step="0.01"><span class="u">mm</span></label>
       </div>
       <div class="calc-out"><span class="lab">Flow</span>
         <span class="val" data-out="h*w*s" data-dp="2" data-suffix=" mm³/s"></span></div>
       <div class="calc-flag bad" data-when="h*w*s > ceil">Over the ceiling.</div>
       <div class="calc-tpl" data-tpl="EM ${round(em,3)}"></div>
     </div>

     · Repeat a data-var name across several inputs and it arrives as an array,
       for avg() / spread() — that is how the twelve caliper readings work.
     · data-var on a text/date input or a <select> arrives as a string.
     · data-out renders a number (data-dp decimal places, data-prefix/suffix)
       or a string; an unfinished calculation shows data-empty, default "—".
     · data-when shows a block only while its expression is true.
     · data-tpl fills ${...} holes — use it with a data-copy button.
     Expressions are plain JS over those names, evaluated in a scope that also
     holds the helpers below. They come from the page, never from the user.
  ------------------------------------------------------------------------- */
  var HELPERS = (function () {
    function nums(a) {
      return (Array.isArray(a) ? a : [a]).filter(function (x) {
        return typeof x === 'number' && isFinite(x);
      });
    }
    return {
      nums: nums,
      count: function (a) { return nums(a).length; },
      sum: function (a) { return nums(a).reduce(function (p, c) { return p + c; }, 0); },
      avg: function (a) { var n = nums(a); return n.length ? n.reduce(function (p, c) { return p + c; }, 0) / n.length : NaN; },
      min: function (a) { var n = nums(a); return n.length ? Math.min.apply(null, n) : NaN; },
      max: function (a) { var n = nums(a); return n.length ? Math.max.apply(null, n) : NaN; },
      spread: function (a) { var n = nums(a); return n.length ? Math.max.apply(null, n) - Math.min.apply(null, n) : NaN; },
      round: function (x, d) { var m = Math.pow(10, d || 0); return isFinite(x) ? Math.round(x * m) / m : NaN; },
      fixed: function (x, d) { return isFinite(x) ? Number(x).toFixed(d == null ? 2 : d) : '…'; },
      clamp: function (x, a, b) { return Math.min(Math.max(x, a), b); },
      abs: Math.abs, floor: Math.floor, ceiling: Math.ceil, pow: Math.pow, sqrt: Math.sqrt,
      /* Tower-block builder for the after-layer-change G-code lessons (L10, L12,
         L15): `lines` conditional lines, one per band change — line i fires at
         layer layerStep*i and sets first + step*(i-1), printed to dp decimals so
         0.10 stays "0.10". The bottom band is never in the block; it prints at
         whatever the profile set. Returns '' (renders as …) until inputs are sane. */
      gtower: function (layerStep, lines, cmd, letter, first, step, dp) {
        var per = Math.round(layerStep), n = Math.round(lines);
        if (!isFinite(per) || per < 1 || !isFinite(n) || n < 1 || n > 40 ||
            !isFinite(first) || !isFinite(step)) return '';
        var out = [];
        for (var i = 1; i <= n; i++) {
          out.push('{if layer_num == ' + (per * i) + '}' + cmd + ' ' + letter +
                   (first + step * (i - 1)).toFixed(dp || 0) + '{endif}');
        }
        return out.join('\n');
      }
    };
  })();

  function wireCalc(root) {
    var fields = Array.prototype.slice.call(root.querySelectorAll('[data-var]'));
    var outs   = Array.prototype.slice.call(root.querySelectorAll('[data-out]'));
    var conds  = Array.prototype.slice.call(root.querySelectorAll('[data-when]'));
    var tpls   = Array.prototype.slice.call(root.querySelectorAll('[data-tpl]'));
    var cache  = {};

    function compile(expr) {
      if (!cache[expr]) {
        try {
          /* jshint evil:true */
          cache[expr] = new Function('v', 'h', 'with (h) { with (v) { return (' + expr + '); } }');
        } catch (e) {
          cache[expr] = function () { return NaN; };
        }
      }
      return cache[expr];
    }
    function evaluate(expr, vars) {
      try { return compile(expr)(vars, HELPERS); } catch (e) { return NaN; }
    }
    function isText(el) {
      if (el.getAttribute('data-type') === 'number') return false;
      return el.getAttribute('data-type') === 'text' ||
             el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' ||
             el.type === 'text' || el.type === 'date';
    }
    function readVars() {
      var v = {};
      fields.forEach(function (el) {
        var name = el.getAttribute('data-var');
        var val;
        if (isText(el)) val = el.value;
        else val = el.value === '' ? NaN : parseFloat(el.value);
        if (Object.prototype.hasOwnProperty.call(v, name)) {
          if (!Array.isArray(v[name])) v[name] = [v[name]];
          v[name].push(val);
        } else {
          v[name] = val;
        }
      });
      return v;
    }

    function render() {
      var v = readVars();

      outs.forEach(function (el) {
        var val = evaluate(el.getAttribute('data-out'), v);
        var good = typeof val === 'string' || (typeof val === 'number' && isFinite(val));
        var txt;
        if (!good) {
          txt = el.getAttribute('data-empty') || '—';
        } else if (typeof val === 'string') {
          txt = val;
        } else {
          var dp = el.getAttribute('data-dp');
          txt = dp === null ? String(Math.round(val * 1e6) / 1e6) : val.toFixed(parseInt(dp, 10));
        }
        el.textContent = good
          ? (el.getAttribute('data-prefix') || '') + txt + (el.getAttribute('data-suffix') || '')
          : txt;
        el.classList.toggle('pending', !good);
      });

      conds.forEach(function (el) {
        el.hidden = !evaluate(el.getAttribute('data-when'), v);
      });

      tpls.forEach(function (el) {
        el.textContent = el.getAttribute('data-tpl').replace(/\$\{([^}]*)\}/g, function (_, ex) {
          var r = evaluate(ex, v);
          if (r === undefined || r === null) return '…';
          if (typeof r === 'number' && !isFinite(r)) return '…';
          if (typeof r === 'string' && r === '') return '…';
          return String(r);
        });
      });
    }

    root.addEventListener('input', render);
    root.addEventListener('change', render);

    var resetBtn = root.querySelector('[data-calc-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        fields.forEach(function (el) {
          if (el.tagName === 'SELECT') el.selectedIndex = 0;
          else el.value = el.getAttribute('value') || '';
        });
        render();
      });
    }
    render();
  }

  /* ---- Copy-to-clipboard button ------------------------------------------
     <button class="copy-btn" data-copy="#selector">Copy</button>
  ------------------------------------------------------------------------- */
  function wireCopy(btn) {
    var target = document.querySelector(btn.getAttribute('data-copy'));
    if (!target) return;
    btn.addEventListener('click', function () {
      var text = target.textContent;
      var said = function (msg) {
        var was = btn.textContent;
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = was; }, 1600);
      };
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          said(ok ? '✓ Copied' : 'Select and copy');
        } catch (e) { said('Select and copy'); }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { said('✓ Copied'); }, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ---- Course progress ---------------------------------------------------
     Self-paced course, worked in evenings: the reader needs to know where they
     stopped. A lesson page grows a "mark complete" control above its footer
     nav; the index grows a resume bar, a per-phase progress bar, and a tick on
     every finished card. Injected rather than authored, so no lesson has to
     carry the markup — and a browser that refuses localStorage simply shows
     the control working for the session and says so.
  ------------------------------------------------------------------------- */
  function readProgress() { return store.get(PROGRESS_KEY, {}) || {}; }

  function wireLessonProgress() {
    var nav = document.querySelector('nav.lesson-nav');
    var id = lessonId(pageName());
    if (!nav || !id) return;

    var label = 'L' + parseInt(id, 10);
    var box = document.createElement('div');
    box.className = 'lesson-done';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ld-btn';
    var note = document.createElement('span');
    note.className = 'ld-note';

    function paint() {
      var done = !!readProgress()[id];
      box.classList.toggle('is-done', done);
      btn.textContent = done ? '✓ ' + label + ' complete — undo' : 'Mark ' + label + ' complete';
      note.textContent = done
        ? 'Shows as done on the course home.'
        : (store.ok ? 'Tracked in this browser only — nothing leaves the page.'
                    : 'This browser is blocking storage, so it won\'t be remembered.');
    }
    btn.addEventListener('click', function () {
      var p = readProgress();
      if (p[id]) delete p[id]; else p[id] = true;
      store.set(PROGRESS_KEY, p);
      paint();
    });

    box.appendChild(btn);
    box.appendChild(note);
    nav.parentNode.insertBefore(box, nav);
    paint();
  }

  function wireIndexProgress() {
    var main = document.querySelector('main.wrap-wide');
    if (!main || !document.querySelector('.lesson-list')) return;

    var done = readProgress();
    var all = [], firstOpen = null, doneCount = 0;

    Array.prototype.slice.call(document.querySelectorAll('.phase')).forEach(function (phase) {
      var cards = Array.prototype.slice.call(phase.querySelectorAll('a.lesson-card[href]'));
      if (!cards.length) return;
      var n = 0;
      cards.forEach(function (card) {
        var id = lessonId(card.getAttribute('href'));
        if (!id) return;
        all.push(card);
        if (done[id]) {
          n++; doneCount++;
          card.classList.add('done');
          if (!card.querySelector('.done-tick')) {
            var tick = document.createElement('span');
            tick.className = 'done-tick';
            tick.textContent = '✓';
            tick.title = 'Marked complete';
            card.appendChild(tick);
          }
        } else if (!firstOpen) {
          firstOpen = card;
        }
      });

      var pp = document.createElement('div');
      pp.className = 'phase-progress' + (n === cards.length ? ' all-done' : '');
      pp.innerHTML = '<div class="pp-bar"><span></span></div><span class="pp-count"></span>';
      pp.querySelector('.pp-bar span').style.width = Math.round((n / cards.length) * 100) + '%';
      pp.querySelector('.pp-count').textContent = n + ' / ' + cards.length + ' done';
      var intro = phase.querySelector('.phase-intro');
      if (intro) intro.parentNode.insertBefore(pp, intro.nextSibling);
      else phase.insertBefore(pp, phase.querySelector('.lesson-list'));
    });

    if (!all.length) return;

    var bar = document.createElement('div');
    bar.className = 'resume';
    var target = firstOpen || all[all.length - 1];
    var title = target.querySelector('.t') ? target.querySelector('.t').textContent : 'the course';
    var code = target.querySelector('.code') ? target.querySelector('.code').textContent : '';

    bar.innerHTML =
      '<span class="rz-lab">Your progress</span>' +
      '<strong class="rz-count"></strong>' +
      '<a class="rz-cta" href="' + target.getAttribute('href') + '"></a>';
    bar.querySelector('.rz-count').textContent = doneCount + ' of ' + all.length + ' lessons complete';
    bar.querySelector('.rz-cta').textContent = firstOpen
      ? (doneCount ? 'Continue · ' : 'Start · ') + code + ' ' + title + ' →'
      : 'All nineteen done — revisit ' + code + ' →';

    if (doneCount && store.ok) {
      var reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'rz-reset';
      reset.textContent = 'Reset';
      var armed = false;
      reset.addEventListener('click', function () {
        if (!armed) { armed = true; reset.textContent = 'Sure? Click again'; reset.classList.add('armed'); return; }
        store.del(PROGRESS_KEY);
        location.reload();
      });
      bar.appendChild(reset);
    }
    main.insertBefore(bar, main.firstElementChild);
  }

  /* ---- init -------------------------------------------------------------- */
  function init() {
    migrateL9Insert();
    document.querySelectorAll('.quiz').forEach(wireQuiz);
    document.querySelectorAll('input[type=range][data-output]').forEach(wireRange);
    document.querySelectorAll('.checklist-widget').forEach(wireChecklist);
    document.querySelectorAll('.faultfinder').forEach(wireFaultFinder);
    document.querySelectorAll('.calc').forEach(wireCalc);
    document.querySelectorAll('[data-copy]').forEach(wireCopy);
    wireLessonProgress();
    wireIndexProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Course = {
    wireQuiz: wireQuiz, wireRange: wireRange, wireChecklist: wireChecklist,
    wireFaultFinder: wireFaultFinder, wireCalc: wireCalc, wireCopy: wireCopy,
    progress: readProgress
  };
})();
