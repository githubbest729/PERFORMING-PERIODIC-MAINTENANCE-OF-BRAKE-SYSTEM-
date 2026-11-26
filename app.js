/* Automotive Brake System Maintenance: A Complete Beginner's Study Guide
   Independent educational PWA. Content lives in /data/*.json. */
(() => {
'use strict';

const TITLE = "Automotive Brake System Maintenance: A Complete Beginner's Study Guide";
const CHAPTERS = [
  { n: 1,  t: 'Introduction to Automotive Brake Systems', f: 'ch01.json', m: '45 min' },
  { n: 2,  t: 'Brake System Components',                  f: 'ch02.json', m: '60 min' },
  { n: 3,  t: 'Types of Brake Systems',                   f: 'ch03.json', m: '45 min' },
  { n: 4,  t: 'Automotive Tools and Equipment',           f: 'ch04.json', m: '60 min' },
  { n: 5,  t: 'Workshop Safety',                          f: 'ch05.json', m: '45 min' },
  { n: 6,  t: 'Brake System Inspection',                  f: 'ch06.json', m: '75 min' },
  { n: 7,  t: 'Periodic Brake Maintenance',               f: 'ch07.json', m: '75 min' },
  { n: 8,  t: 'Brake System Troubleshooting',             f: 'ch08.json', m: '60 min' },
  { n: 9,  t: 'Brake Maintenance Checklists',             f: 'ch09.json', m: '30 min' },
  { n: 10, t: 'Practical Learning Activities',            f: 'ch10.json', m: '90 min' },
  { n: 11, t: 'Knowledge Assessment',                     f: 'quiz.json', m: '90 min' },
  { n: 12, t: 'Glossary of Automotive Brake Terms',       f: 'glossary.json', m: '20 min' }
];
const STAGES = [
  ['learn', 'Learn'], ['understand', 'Understand'], ['observe', 'Observe'],
  ['practice', 'Practice'], ['review', 'Review'], ['assess', 'Assess']
];

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
};
const getP = () => { const p = LS.get('bsg.progress', null) || {}; p.done = p.done || {}; p.scores = p.scores || {}; p.checks = p.checks || {}; return p; };
const saveP = p => LS.set('bsg.progress', p);

const cache = {};
async function load(file) {
  if (cache[file]) return cache[file];
  const r = await fetch('data/' + file);
  if (!r.ok) throw new Error('Could not load ' + file);
  return (cache[file] = await r.json());
}

/* ---------- diagrams ---------- */
const SVG = {
hydraulic: `<svg viewBox="0 0 640 250" role="img" aria-label="Hydraulic brake circuit">
<rect class="svg-fill" x="10" y="95" width="26" height="90" rx="4"/><text class="svg-txt" x="6" y="205">Pedal</text>
<rect class="svg-fill" x="62" y="75" width="100" height="110" rx="8"/><text class="svg-txt" x="78" y="135">Booster</text>
<rect class="svg-fill" x="190" y="105" width="100" height="50" rx="6"/><text class="svg-txt" x="196" y="135">Master cyl.</text>
<rect class="svg-fill" x="215" y="68" width="50" height="34" rx="4"/><text class="svg-small" x="214" y="62">Reservoir</text>
<path class="svg-line" d="M36 140H62M162 130H190"/>
<path class="svg-line" stroke-width="4" d="M290 130H390M390 130V60H470M390 130V200H470"/>
<text class="svg-small" x="300" y="122">Brake lines</text>
<rect class="svg-fill" x="470" y="30" width="150" height="62" rx="8"/><text class="svg-txt" x="486" y="56">Disc brake</text><text class="svg-small" x="486" y="74">caliper + pads</text>
<rect class="svg-fill" x="470" y="170" width="150" height="62" rx="8"/><text class="svg-txt" x="486" y="196">Drum brake</text><text class="svg-small" x="486" y="214">wheel cylinder + shoes</text>
<path class="svg-acc" d="M52 120l-14 5 14 5z"/>
</svg>`,
disc: `<svg viewBox="0 0 480 270" role="img" aria-label="Disc brake">
<rect class="svg-fill" x="215" y="20" width="50" height="230" rx="3"/><text class="svg-txt" x="206" y="268">Rotor (disc)</text>
<rect class="svg-acc" x="190" y="90" width="25" height="90"/><rect class="svg-acc" x="265" y="90" width="25" height="90"/>
<text class="svg-small" x="120" y="88">Brake pads</text>
<rect class="svg-fill" x="150" y="50" width="170" height="22" rx="4"/>
<rect class="svg-fill" x="150" y="50" width="40" height="160" rx="4"/><rect class="svg-fill" x="290" y="50" width="30" height="160" rx="4"/>
<rect class="svg-fluid" x="156" y="100" width="28" height="70"/><text class="svg-small" x="46" y="140">Piston + fluid</text>
<text class="svg-txt" x="340" y="64">Caliper</text>
<path class="svg-line" d="M150 140H112M135 84H165M330 60H338"/>
<path class="svg-acc" d="M110 140l10-6v12z"/><text class="svg-small" x="330" y="230">Pressure pushes the piston, the pads squeeze the rotor</text>
</svg>`,
drum: `<svg viewBox="0 0 440 300" role="img" aria-label="Drum brake">
<circle class="svg-fill" cx="220" cy="150" r="125"/><circle class="svg-line" cx="220" cy="150" r="108"/>
<path stroke="var(--accent)" stroke-width="14" fill="none" stroke-linecap="round" d="M178 62A94 94 0 0 0 178 238"/>
<path stroke="var(--accent)" stroke-width="14" fill="none" stroke-linecap="round" d="M262 62A94 94 0 0 1 262 238"/>
<rect class="svg-fill" x="190" y="58" width="60" height="24" rx="4"/><text class="svg-small" x="196" y="75">Wheel cyl.</text>
<rect class="svg-fill" x="200" y="222" width="40" height="16" rx="3"/><text class="svg-small" x="202" y="250">Anchor</text>
<path class="svg-line" stroke-dasharray="5 4" d="M168 110L220 140L272 110M168 200L220 175L272 200"/>
<text class="svg-txt" x="20" y="150">Shoe</text><text class="svg-txt" x="360" y="150">Shoe</text>
<text class="svg-small" x="20" y="170">(lining on shoe)</text><text class="svg-small" x="330" y="170">Return springs</text>
<text class="svg-small" x="150" y="288">Drum surrounds all the parts</text>
</svg>`,
layout: `<svg viewBox="0 0 580 330" role="img" aria-label="Brake system layout">
<rect class="svg-fill" x="190" y="30" width="200" height="270" rx="40"/>
<rect class="svg-acc" x="150" y="55" width="34" height="70" rx="6"/><rect class="svg-acc" x="396" y="55" width="34" height="70" rx="6"/>
<rect class="svg-acc" x="150" y="205" width="34" height="70" rx="6"/><rect class="svg-acc" x="396" y="205" width="34" height="70" rx="6"/>
<text class="svg-small" x="70" y="95">Front left</text><text class="svg-small" x="440" y="95">Front right</text>
<text class="svg-small" x="74" y="245">Rear left</text><text class="svg-small" x="440" y="245">Rear right</text>
<rect class="svg-fill" x="250" y="50" width="80" height="34" rx="5"/><text class="svg-txt" x="258" y="72">Master cyl.</text>
<text class="svg-small" x="252" y="42">Booster + pedal</text>
<rect class="svg-fill" x="330" y="100" width="52" height="30" rx="5"/><text class="svg-small" x="340" y="119">ABS</text>
<path class="svg-line" stroke-width="3" d="M250 67H167V90M330 67H413V90M290 84V150M290 150H167V205M290 150H413V205"/>
<path class="svg-line" stroke-dasharray="4 3" d="M360 130V150"/>
<text class="svg-small" x="205" y="190">Hydraulic lines</text>
<text class="svg-small" x="200" y="315">Cable or electric parking brake acts on the rear wheels</text>
</svg>`
};

/* ---------- block renderers ---------- */
function tableHTML(t) {
  const head = t.h.map(h => `<th scope="col">${esc(h)}</th>`).join('');
  const rows = t.r.map(r => `<tr>${r.map((c, i) => `<td data-label="${esc(t.h[i] || '')}">${c === '' ? '&nbsp;' : fmt(c)}</td>`).join('')}</tr>`).join('');
  return `<div class="tablewrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
const callout = (cls, title, text) => `<div class="callout ${cls}" role="note"><strong class="t">${esc(title)}</strong>${fmt(text)}</div>`;
const ul = a => `<ul>${a.map(x => `<li>${fmt(x)}</li>`).join('')}</ul>`;
const ol = a => `<ol>${a.map(x => `<li>${fmt(x)}</li>`).join('')}</ol>`;
const CHK = {};

function checklistHTML(c, ch, blank) {
  const key = `c${ch}:${slug(c.title)}`;
  CHK[key] = c;
  const st = blank ? [] : (getP().checks[key] || []);
  const done = st.filter(Boolean).length;
  return `<section class="checklist" data-key="${esc(key)}"><h3>${esc(c.title)}</h3>
  ${blank ? '' : `<div class="row"><button class="btn small" data-act="reset-check">Reset</button><button class="btn small" data-act="print-check">Print</button><span class="meta" data-count>${done} of ${c.items.length} done</span></div>`}
  ${c.items.map((it, i) => `<label><input type="checkbox" data-i="${i}" ${st[i] ? 'checked' : ''}><span>${fmt(it)}</span></label>`).join('')}</section>`;
}
function inspHTML(x) {
  return `<details class="insp"><summary>${esc(x.title)}</summary><div class="body"><dl class="dl">
  <div><dt>1. What to inspect</dt><dd>${fmt(x.what)}</dd></div>
  <div><dt>2. Why it matters</dt><dd>${fmt(x.why)}</dd></div>
  <div><dt>3. How to inspect it</dt><dd>${ol(x.how)}</dd></div>
  <div><dt>4. Normal condition</dt><dd>${fmt(x.normal)}</dd></div>
  <div><dt>5. Defective condition</dt><dd>${fmt(x.defective)}</dd></div>
  <div><dt>6. Possible causes</dt><dd>${fmt(x.causes)}</dd></div>
  <div><dt>7. Recommended next action</dt><dd>${fmt(x.action)}</dd></div></dl></div></details>`;
}
function procHTML(x) {
  const cls = x.level.split(' ')[0];
  return `<details class="proc"><summary>${esc(x.title)}<span class="level ${esc(cls)}">${esc(x.level)}</span></summary><div class="body">
  <p><strong>Why it matters:</strong> ${fmt(x.why)}</p>${ol(x.steps)}</div></details>`;
}
function activityHTML(x) {
  return `<details class="activity"><summary>${esc(x.title)}</summary><div class="body"><dl class="dl">
  <div><dt>Learning objective</dt><dd>${fmt(x.objective)}</dd></div>
  <div><dt>Required tools</dt><dd>${ul(x.tools)}</dd></div>
  <div><dt>Required materials</dt><dd>${ul(x.materials)}</dd></div>
  <div><dt>Safety precautions</dt><dd>${ul(x.safety)}</dd></div>
  <div><dt>Procedure</dt><dd>${ol(x.procedure)}</dd></div>
  <div><dt>Expected result</dt><dd>${fmt(x.expected)}</dd></div>
  <div><dt>Common mistakes</dt><dd>${ul(x.mistakes)}</dd></div>
  <div><dt>Learning assessment</dt><dd>${fmt(x.assessment)}</dd></div></dl></div></details>`;
}
function block(b, ch) {
  if (typeof b === 'string') return `<p>${fmt(b)}</p>`;
  if (b.ul) return ul(b.ul);
  if (b.ol) return ol(b.ol);
  if (b.table) return tableHTML(b.table);
  if (b.warn) return callout('warn', 'Safety warning', b.warn);
  if (b.tip) return callout('tip', 'Tip', b.tip);
  if (b.info) return callout('info', 'Note', b.info);
  if (b.h3) return `<h3>${fmt(b.h3)}</h3>`;
  if (b.diagram) return `<figure class="diagram">${SVG[b.diagram] || ''}<figcaption>${fmt(b.cap || '')}</figcaption></figure>`;
  if (b.check) return checklistHTML(b.check, ch);
  if (b.insp) return inspHTML(b.insp);
  if (b.proc) return procHTML(b.proc);
  if (b.activity) return activityHTML(b.activity);
  return '';
}

/* ---------- shell: theme, drawer, progress ---------- */
function applyTheme() {
  const t = LS.get('bsg.theme', null);
  if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
  const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const m = $('meta[name="theme-color"]'); if (m) m.content = dark ? '#0e1218' : '#111827';
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  LS.set('bsg.theme', cur === 'dark' ? 'light' : 'dark'); applyTheme();
}
function buildDrawer(active) {
  const p = getP();
  $('#drawer').innerHTML = `<h2>Chapters</h2><a href="#/" ${active === 0 ? 'aria-current="page"' : ''}><span class="num">&#8962;</span><span>Home and contents</span></a>` +
    CHAPTERS.map(c => `<a href="#/ch/${c.n}" class="${p.done[c.n] ? 'done' : ''}" ${active === c.n ? 'aria-current="page"' : ''}><span class="num">${p.done[c.n] ? '&#10003;' : c.n}</span><span>${esc(c.t)}</span></a>`).join('');
}
function openDrawer(open) {
  $('#drawer').hidden = !open; $('#scrim').hidden = !open;
  $('#menuBtn').setAttribute('aria-expanded', String(open));
  if (open) { const a = $('#drawer a[aria-current="page"]') || $('#drawer a'); a && a.focus(); }
}
function updateProgress() {
  const p = getP(); const n = CHAPTERS.filter(c => p.done[c.n]).length;
  $('#progressFill').style.width = (n / CHAPTERS.length * 100) + '%';
  return n;
}
function toast(msg, actionLabel, action) {
  const t = $('#toast'); t.innerHTML = `<span>${esc(msg)}</span>${actionLabel ? `<button type="button">${esc(actionLabel)}</button>` : ''}`;
  t.hidden = false;
  const b = $('button', t); if (b) b.onclick = () => { t.hidden = true; action && action(); };
  if (!actionLabel) setTimeout(() => { t.hidden = true; }, 3500);
}

/* ---------- views ---------- */
const main = () => $('#main');
function setView(html, title, activeNav) {
  main().innerHTML = html;
  document.title = title ? `${title} | Brake System Study Guide` : TITLE;
  buildDrawer(activeNav); updateProgress(); openDrawer(false);
  window.scrollTo(0, 0); main().focus({ preventScroll: true });
}

async function viewHome() {
  const p = getP(); const doneN = updateProgress();
  const next = CHAPTERS.find(c => !p.done[c.n]) || CHAPTERS[0];
  const scores = Object.keys(p.scores).length;
  setView(`
  <section class="hero">
    <div class="eyebrow">Independent self-paced learning module</div>
    <h1>${esc(TITLE)}</h1>
    <p>Learn how brake systems work, how to inspect them safely, how periodic maintenance is carried out, and how to diagnose common problems. Written for beginners. Works offline once loaded.</p>
    <a class="btn primary" href="#/ch/${next.n}">${doneN ? 'Continue: Chapter ' + next.n : 'Start Chapter 1'}</a>
  </section>
  <div class="keyline">
    <div class="card"><b>12</b>chapters</div><div class="card"><b>${doneN}/12</b>completed</div>
    <div class="card"><b>9</b>printable checklists</div><div class="card"><b>${scores}</b>quiz scores saved</div>
  </div>
  ${callout('warn', 'Important', 'This guide is an independent educational resource. It is not an official certification or institutional training module, and it does not replace the vehicle manufacturer\'s service manual. Specifications such as torque values, wear limits and fluid types vary by vehicle and are never given here. Practise brake work only under qualified supervision.')}
  <h2>Search the guide</h2>
  <input class="search" id="q" type="search" placeholder="Search for a term, symptom or tool&hellip;" aria-label="Search the guide" autocomplete="off">
  <div id="results" aria-live="polite"></div>
  <h2>How each chapter works</h2>
  <div class="stages">${STAGES.map(s => `<span class="stage">${s[1]}</span>`).join('<span aria-hidden="true">&rarr;</span>')}</div>
  <p>Every chapter follows the same path: <strong>Learn</strong> the lesson, <strong>Understand</strong> the key concepts, <strong>Observe</strong> real workshop examples, <strong>Practice</strong> with small tasks, <strong>Review</strong> the summary, then <strong>Assess</strong> yourself with a knowledge check.</p>
  <h2>Table of contents</h2>
  <div class="grid">${CHAPTERS.map(c => `<a class="card" href="#/ch/${c.n}"><div class="eyebrow">Chapter ${c.n}${p.done[c.n] ? '<span class="badge ok">Done</span>' : ''}</div><h3>${esc(c.t)}</h3><div class="meta">Estimated study time: ${c.m}</div></a>`).join('')}</div>
  <div class="row"><button class="btn" data-act="reset-progress">Reset my progress</button><span class="meta">Progress is stored only on this device.</span></div>
  `, '', 0);
  $('#q').addEventListener('input', onSearch);
}

let indexPromise = null;
function collectText(o, out) {
  if (typeof o === 'string') out.push(o);
  else if (Array.isArray(o)) o.forEach(x => collectText(x, out));
  else if (o && typeof o === 'object') Object.values(o).forEach(x => collectText(x, out));
}
function buildIndex() {
  if (!indexPromise) indexPromise = Promise.all(CHAPTERS.map(async c => {
    try { const d = await load(c.f); const out = []; collectText(d, out); return { c, text: out }; }
    catch (e) { return { c, text: [] }; }
  }));
  return indexPromise;
}
async function onSearch(e) {
  const term = e.target.value.trim().toLowerCase(); const box = $('#results');
  if (term.length < 3) { box.innerHTML = ''; return; }
  const idx = await buildIndex(); const hits = [];
  for (const { c, text } of idx) {
    for (const s of text) {
      const k = s.toLowerCase().indexOf(term);
      if (k >= 0) { const a = Math.max(0, k - 50), b = Math.min(s.length, k + term.length + 90); hits.push({ c, snip: (a ? '…' : '') + s.slice(a, b).replace(/\*\*/g, '') + (b < s.length ? '…' : '') }); if (hits.filter(h => h.c === c).length >= 3) break; }
    }
  }
  box.innerHTML = hits.length ? `<div class="grid">${hits.slice(0, 18).map(h => `<a class="card" href="#/ch/${h.c.n}"><div class="eyebrow">Chapter ${h.c.n}: ${esc(h.c.t)}</div><div>${esc(h.snip)}</div></a>`).join('')}</div>` : '<p class="meta">No matches found.</p>';
}

function pagerHTML(n) {
  const prev = CHAPTERS[n - 2], nx = CHAPTERS[n];
  const p = getP();
  return `<div class="row"><button class="btn ${p.done[n] ? '' : 'primary'}" data-act="toggle-done" data-n="${n}">${p.done[n] ? '&#10003; Completed (tap to undo)' : 'Mark chapter complete'}</button><button class="btn" data-act="print-chapter">Print chapter</button></div>
  <div class="pager">${prev ? `<a class="btn" href="#/ch/${prev.n}">&larr; ${esc(prev.t)}</a>` : '<span></span>'}${nx ? `<a class="btn primary" href="#/ch/${nx.n}">${esc(nx.t)} &rarr;</a>` : '<a class="btn" href="#/">Back to contents</a>'}</div>`;
}
function headHTML(n, d) {
  return `<div class="eyebrow">Chapter ${n} &middot; Estimated study time: ${esc(d.time)}</div><h1>${esc(d.title)}</h1><p>${fmt(d.intro)}</p>`;
}

async function viewChapter(n) {
  const meta = CHAPTERS[n - 1];
  if (!meta) return view404();
  if (n === 11) return viewQuiz();
  if (n === 12) return viewGlossary();
  let d;
  try { d = await load(meta.f); } catch (e) { return viewError(); }
  const sec = (id, label, inner) => `<div class="section-label" id="stage-${id}">${label}</div>${inner}`;
  const html = `${headHTML(n, d)}
  <div class="stages" role="navigation" aria-label="Chapter stages">${STAGES.map(s => `<button class="stage" data-scroll="stage-${s[0]}">${s[1]}</button>`).join('')}</div>
  <h2>Learning objectives</h2>${ul(d.objectives)}
  ${sec('learn', 'Learn', d.sections.map(s => `<h2>${esc(s.h)}</h2>${s.blocks.map(b => block(b, n)).join('')}`).join('') +
    (d.safety ? callout('warn', 'Safety notes', '') .replace('</div>', ul(d.safety) + '</div>') : ''))}
  ${sec('understand', 'Understand', `<h2>Important concepts</h2>${ul(d.concepts)}`)}
  ${sec('observe', 'Observe', `<h2>Practical examples</h2>${ul(d.examples)}`)}
  ${sec('practice', 'Practice', `<h2>Try it yourself</h2>${ul(d.practice)}`)}
  ${sec('review', 'Review', `<h2>Chapter summary</h2>${ul(d.summary)}`)}
  ${sec('assess', 'Assess', `<h2>Knowledge check</h2><p class="meta">Think of your answer first, then tap the question to check.</p>${d.check.map(c => `<details class="q"><summary>${fmt(c.q)}</summary><div class="ans">${fmt(c.a)}</div></details>`).join('')}`)}
  ${pagerHTML(n)}`;
  setView(html, `Chapter ${n}: ${d.title}`, n);
}

/* ---------- assessment (chapter 11) ---------- */
let quizTab = 'mcq';
async function viewQuiz() {
  let d; try { d = await load('quiz.json'); } catch (e) { return viewError(); }
  const html = `${headHTML(11, d)}<h2>Learning objectives</h2>${ul(d.objectives)}
  <div class="tabs" role="tablist" aria-label="Assessment sections">
    ${[['mcq', 'Multiple choice (30)'], ['tf', 'True / False (15)'], ['practical', 'Practical (15)'], ['flash', 'Flashcards (20)'], ['final', 'Final assessment'], ['key', 'Answer key']].map(t => `<button class="tab" role="tab" data-tab="${t[0]}" aria-selected="${t[0] === quizTab}">${t[1]}</button>`).join('')}
  </div>
  <div id="quizbody"></div>
  <h2>Review</h2>${ul(d.summary)}${pagerHTML(11)}`;
  setView(html, 'Chapter 11: Knowledge Assessment', 11);
  renderTab(d);
  $$('.tab').forEach(b => b.addEventListener('click', () => { quizTab = b.dataset.tab; $$('.tab').forEach(x => x.setAttribute('aria-selected', String(x === b))); renderTab(d); }));
}
function bestLine(key) { const s = getP().scores[key]; return s ? `<p class="meta">Best score saved on this device: <strong>${s.score}/${s.total}</strong> (${Math.round(s.score / s.total * 100)}%)</p>` : ''; }
function renderTab(d) {
  const el = $('#quizbody');
  if (quizTab === 'mcq') { el.innerHTML = `<p>${d.mcq.length} questions. Each answer is explained.</p>${bestLine('mcq')}<button class="btn primary" id="go">Start</button>`; $('#go').onclick = () => runQuiz(el, d.mcq, 'mcq', 'Multiple choice', () => renderTab(d)); }
  else if (quizTab === 'tf') { el.innerHTML = `<p>${d.tf.length} statements. Decide whether each is true or false.</p>${bestLine('tf')}<button class="btn primary" id="go">Start</button>`; $('#go').onclick = () => runQuiz(el, d.tf, 'tf', 'True or false', () => renderTab(d)); }
  else if (quizTab === 'practical') { el.innerHTML = `<p>Answer each question in your own words first, then compare with the model answer.</p>${d.practical.map((q, i) => `<details class="q"><summary>${i + 1}. ${fmt(q.q)}</summary><div class="ans">${fmt(q.a)}<div class="meta">Review: Chapter ${q.ch}</div></div></details>`).join('')}`; }
  else if (quizTab === 'flash') runFlash(el, d.flash);
  else if (quizTab === 'final') {
    el.innerHTML = `<p>The final assessment draws 25 questions at random (15 multiple choice and 10 true or false) from across all chapters. Pass mark: 70%. Practical questions are in the Practical tab.</p>${bestLine('final')}<button class="btn primary" id="go">Start final assessment</button>`;
    $('#go').onclick = () => { const pool = shuffle([...shuffle(d.mcq).slice(0, 15), ...shuffle(d.tf).slice(0, 10)]); runQuiz(el, pool, 'final', 'Final assessment', () => renderTab(d)); };
  } else if (quizTab === 'key') {
    const L = ['A', 'B', 'C', 'D'];
    el.innerHTML = `<h2>Answer key: multiple choice</h2>${d.mcq.map((q, i) => `<details class="q"><summary>${i + 1}. ${fmt(q.q)}</summary><div class="ans"><strong>${L[q.a]}. ${esc(q.o[q.a])}</strong><br>${fmt(q.e)}<div class="meta">Chapter ${q.ch}</div></div></details>`).join('')}
    <h2>Answer key: true or false</h2>${d.tf.map((q, i) => `<details class="q"><summary>${i + 1}. ${fmt(q.q)}</summary><div class="ans"><strong>${q.a ? 'True' : 'False'}</strong><br>${fmt(q.e)}<div class="meta">Chapter ${q.ch}</div></div></details>`).join('')}
    <h2>Answer key: practical questions</h2>${d.practical.map((q, i) => `<details class="q"><summary>${i + 1}. ${fmt(q.q)}</summary><div class="ans">${fmt(q.a)}<div class="meta">Chapter ${q.ch}</div></div></details>`).join('')}`;
  }
}
function runQuiz(el, qs, key, label, back) {
  let i = 0, score = 0; const missed = [];
  const L = ['A', 'B', 'C', 'D'];
  const show = () => {
    if (i >= qs.length) return finish();
    const q = qs[i]; const opts = q.o || ['True', 'False']; const right = q.o ? q.a : (q.a ? 0 : 1);
    el.innerHTML = `<div class="meta">${esc(label)}: question ${i + 1} of ${qs.length}</div><div class="bar"><i style="width:${i / qs.length * 100}%"></i></div>
    <h3>${fmt(q.q)}</h3><div>${opts.map((o, k) => `<button class="opt" data-k="${k}">${q.o ? L[k] + '. ' : ''}${esc(o)}</button>`).join('')}</div><div id="fb"></div>`;
    $$('.opt', el).forEach(b => b.addEventListener('click', () => {
      const k = +b.dataset.k; const ok = k === right;
      $$('.opt', el).forEach(x => { x.disabled = true; if (+x.dataset.k === right) x.classList.add('correct'); });
      if (!ok) { b.classList.add('wrong'); missed.push(q); } else score++;
      $('#fb', el).innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}"><strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${fmt(q.e)}</div><button class="btn primary" id="nx">${i + 1 < qs.length ? 'Next question' : 'See results'}</button>`;
      $('#nx', el).focus(); $('#nx', el).onclick = () => { i++; show(); };
    }));
  };
  const finish = () => {
    const pct = Math.round(score / qs.length * 100); const p = getP(); const prev = p.scores[key];
    if (!prev || score / qs.length > prev.score / prev.total) { p.scores[key] = { score, total: qs.length }; saveP(p); }
    el.innerHTML = `<div class="card"><div class="score">${score} / ${qs.length} (${pct}%)</div>
    <p>${pct >= 70 ? '<strong>Well done.</strong> You reached the 70% target.' : 'Not at the 70% target yet. Review the chapters listed below and try again.'}</p></div>
    ${missed.length ? `<h3>Questions to review</h3>${missed.map(q => `<details class="q" open><summary>${fmt(q.q)}</summary><div class="ans">${q.o ? '<strong>' + esc(q.o[q.a]) + '</strong><br>' : '<strong>' + (q.a ? 'True' : 'False') + '</strong><br>'}${fmt(q.e)}<div class="meta">Review: <a href="#/ch/${q.ch}">Chapter ${q.ch}</a></div></div></details>`).join('')}` : '<p>No missed questions. Excellent.</p>'}
    <div class="row"><button class="btn primary" id="again">Try again</button><button class="btn" id="done">Back</button></div>`;
    $('#again', el).onclick = () => { if (key === 'final') back(); else runQuiz(el, shuffle(qs), key, label, back); if (key === 'final') $('#go').click(); };
    $('#done', el).onclick = back;
    toast('Score saved on this device');
  };
  show();
}
function runFlash(el, cards) {
  let deck = cards.slice(), i = 0, back = false;
  const draw = () => {
    const c = deck[i];
    el.innerHTML = `<div class="meta">Card ${i + 1} of ${deck.length}. Tap the card to flip.</div>
    <div class="flash"><button class="flash-card ${back ? 'back' : ''}" id="fc" aria-live="polite">${esc(back ? c.b : c.f)}</button></div>
    <div class="row"><button class="btn" id="pv" ${i === 0 ? 'disabled' : ''}>&larr; Previous</button><button class="btn" id="sh">Shuffle</button><button class="btn primary" id="nx" ${i === deck.length - 1 ? 'disabled' : ''}>Next &rarr;</button></div>`;
    $('#fc').onclick = () => { back = !back; draw(); $('#fc').focus(); };
    $('#pv').onclick = () => { i--; back = false; draw(); };
    $('#nx').onclick = () => { i++; back = false; draw(); };
    $('#sh').onclick = () => { deck = shuffle(deck); i = 0; back = false; draw(); };
  };
  draw();
}

/* ---------- glossary (chapter 12) ---------- */
async function viewGlossary() {
  let d; try { d = await load('glossary.json'); } catch (e) { return viewError(); }
  const items = d.items.slice().sort((a, b) => a.t.localeCompare(b.t, 'en', { sensitivity: 'base' }));
  const letters = [...new Set(items.map(x => x.t[0].toUpperCase()))];
  const list = (f) => { const by = {}; items.filter(f).forEach(x => (by[x.t[0].toUpperCase()] = by[x.t[0].toUpperCase()] || []).push(x)); return Object.keys(by).map(L => `<h2 id="g-${L}">${L}</h2><dl class="glossary">${by[L].map(x => `<dt>${esc(x.t)}</dt><dd>${esc(x.d)}</dd>`).join('')}</dl>`).join('') || '<p class="meta">No matching terms.</p>'; };
  setView(`${headHTML(12, d)}<h2>Learning objectives</h2>${ul(d.objectives)}
  <input class="search" id="gq" type="search" placeholder="Filter terms&hellip;" aria-label="Filter glossary terms" autocomplete="off">
  <div class="letters" id="lt">${letters.map(L => `<button data-l="${L}" aria-label="Jump to ${L}">${L}</button>`).join('')}</div>
  <div id="gl">${list(() => true)}</div>
  <h2>Review</h2>${ul(d.summary)}${pagerHTML(12)}`, 'Chapter 12: Glossary', 12);
  $('#gq').addEventListener('input', e => { const t = e.target.value.trim().toLowerCase(); $('#gl').innerHTML = list(x => !t || x.t.toLowerCase().includes(t) || x.d.toLowerCase().includes(t)); });
  $('#lt').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const t = $('#g-' + b.dataset.l); t && t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

function view404() { setView(`<h1>Page not found</h1><p>That chapter does not exist.</p><a class="btn primary" href="#/">Go to contents</a>`, 'Not found', 0); }
function viewError() { setView(`<h1>Content unavailable</h1><p>This chapter could not be loaded. If you are offline, open it once while online so it can be saved for offline use.</p><a class="btn primary" href="#/">Go to contents</a>`, 'Error', 0); }

/* ---------- routing ---------- */
async function route() {
  const h = location.hash.replace(/^#/, '') || '/';
  const m = h.match(/^\/ch\/(\d+)/);
  try { if (m) await viewChapter(+m[1]); else if (h === '/' || h === '') await viewHome(); else view404(); }
  catch (e) { viewError(); }
}

/* ---------- global events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-scroll]'); if (!t) return;
  if (t.dataset.scroll) { const x = document.getElementById(t.dataset.scroll); x && x.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  const act = t.dataset.act;
  if (act === 'toggle-done') { const n = +t.dataset.n, p = getP(); if (p.done[n]) delete p.done[n]; else p.done[n] = true; saveP(p); buildDrawer(n); updateProgress(); t.className = 'btn ' + (p.done[n] ? '' : 'primary'); t.innerHTML = p.done[n] ? '&#10003; Completed (tap to undo)' : 'Mark chapter complete'; }
  else if (act === 'print-chapter') { document.body.classList.remove('print-one'); window.print(); }
  else if (act === 'reset-progress') { if (confirm('Reset all progress, quiz scores and checklist ticks on this device?')) { LS.set('bsg.progress', {}); route(); } }
  else if (act === 'reset-check') { const s = t.closest('.checklist'), p = getP(); delete p.checks[s.dataset.key]; saveP(p); $$('input', s).forEach(i => (i.checked = false)); const c = $('[data-count]', s); c.textContent = `0 of ${$$('input', s).length} done`; }
  else if (act === 'print-check') {
    const s = t.closest('.checklist'); const c = CHK[s.dataset.key]; const ch = s.dataset.key.match(/^c(\d+)/)[1];
    $('#print-area').innerHTML = `<div class="print-head"><strong>${esc(TITLE)}</strong> (educational use)<br>Name: ____________________ &nbsp; Date: ____________ &nbsp; Vehicle: ____________________ &nbsp; Mileage: __________</div>${checklistHTML(c, ch, true)}<p class="print-head">Specifications and limits must come from the vehicle manufacturer's service manual.</p>`;
    document.body.classList.add('print-one'); window.print();
  }
});
document.addEventListener('change', e => {
  const i = e.target; if (!(i instanceof HTMLInputElement) || i.type !== 'checkbox') return;
  const s = i.closest('.checklist'); if (!s || !s.dataset.key) return;
  const p = getP(); const arr = p.checks[s.dataset.key] || []; arr[+i.dataset.i] = i.checked; p.checks[s.dataset.key] = Array.from(arr, v => !!v); saveP(p);
  const all = $$('input', s); const c = $('[data-count]', s); if (c) c.textContent = `${all.filter(x => x.checked).length} of ${all.length} done`;
});
window.addEventListener('afterprint', () => { document.body.classList.remove('print-one'); $('#print-area').innerHTML = ''; });
window.addEventListener('hashchange', route);
document.addEventListener('keydown', e => { if (e.key === 'Escape') openDrawer(false); });

/* ---------- init ---------- */
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener && matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
$('#themeBtn').addEventListener('click', toggleTheme);
$('#menuBtn').addEventListener('click', () => openDrawer($('#drawer').hidden));
$('#scrim').addEventListener('click', () => openDrawer(false));

let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; $('#installBtn').hidden = false; });
$('#installBtn').addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $('#installBtn').hidden = true; });
window.addEventListener('appinstalled', () => { $('#installBtn').hidden = true; toast('App installed'); });

function net() { const off = !navigator.onLine; const c = $('#netStatus'); c.hidden = !off; }
window.addEventListener('online', net); window.addEventListener('offline', net); net();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const prompt = w => toast('A new version is available.', 'Update', () => w.postMessage({ type: 'SKIP_WAITING' }));
      if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) prompt(w); }); });
    }).catch(() => { /* offline support unavailable */ });
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
  });
}

route();
})();
