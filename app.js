// Social Work Path Quiz — 16 pathway version (student-friendly prompts + relative scoring)
// Place next to index.html and load with: <script src="app.js" defer></script>

window.addEventListener('DOMContentLoaded', () => {
  const fatal = (err) => {
    try {
      let slot = document.getElementById('content');
      if (!slot) {
        slot = document.createElement('div'); slot.id = 'content';
        (document.querySelector('section') || document.body).appendChild(slot);
      }
      slot.innerHTML = `
        <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <p class="font-semibold">The quiz script hit an error.</p>
          <p class="mt-1 text-sm">Open the browser console and share the red message. Try a hard refresh (Cmd/Ctrl-Shift-R).</p>
        </div>`;
    } catch {}
    console.error('[SW Quiz] Fatal error:', err);
  };

  try {
    const STORAGE_KEY = 'sw-path-quiz-v1';

    // -------- PATHWAYS (16) --------
    const PATHWAYS = [
      // Original 8
      { id: 'clinical', name: 'Clinical / Therapy',
        blurb: 'One-on-one and small-group counseling, assessment, treatment planning, crisis intervention.',
        courses: ['Clinical Practice I/II','Psychopathology/Assessment','Trauma-Informed Practice'],
        practicum: ['Outpatient mental health clinic','Hospital psych unit','College counseling'] },

      { id: 'school', name: 'School Social Work',
        blurb: 'Supporting students, families, and educators; attendance, IEP collaboration, prevention.',
        courses: ['School Social Work','Child & Adolescent Practice','Family Systems'],
        practicum: ['K–12 schools','Alternative education','After-school programs'] },

      { id: 'medical', name: 'Health / Medical Social Work',
        blurb: 'Hospitals and clinics, care transitions, discharge planning, team-based care.',
        courses: ['Health/Medical SW','Integrated Care','Motivational Interviewing'],
        practicum: ['Medical-surgical unit','Primary care clinic','Oncology/NICU'] },

      { id: 'childfam', name: 'Child & Family Welfare',
        blurb: 'Safety, permanency, family preservation, foster/kinship support, prevention.',
        courses: ['Child Welfare','Family Systems','Trauma & Resilience'],
        practicum: ['Child welfare services','Family resource centers','Prevention programs'] },

      { id: 'community', name: 'Community Organizing & Program Development',
        blurb: 'Coalitions, outreach, program design/management, fundraising and partnerships.',
        courses: ['Macro Practice','Program Planning','Community Organizing'],
        practicum: ['Community-based nonprofits','Neighborhood initiatives','Mutual aid orgs'] },

      { id: 'policy', name: 'Policy & Advocacy',
        blurb: 'Legislative advocacy, policy analysis, systems design, public testimony.',
        courses: ['Policy Analysis','Advocacy & Lobbying','Economics of Social Policy'],
        practicum: ['Legislative offices','Policy think tanks','Advocacy coalitions'] },

      { id: 'research', name: 'Research & Program Evaluation',
        blurb: 'Study design, measurement, implementation, clear reporting and evidence use.',
        courses: ['Research Methods','Program Evaluation','Data Analysis/Stats'],
        practicum: ['Research centers','Evaluation firms','University labs'] },

      { id: 'justice', name: 'Justice / Forensic Social Work',
        blurb: 'Courts, reentry, probation, mitigation, diversion, family support around the legal system.',
        courses: ['Forensic/Justice SW','Substance Use & Recovery','Trauma-Informed Systems'],
        practicum: ['Public defender teams','Reentry programs','Problem-solving courts'] },

      // New 8
      { id: 'aging', name: 'Aging / Gerontology',
        blurb: 'Support for older adults and caregivers; home care, benefits, elder justice, aging services.',
        courses: ['Gerontology','Benefits/Medicare & Medicaid','Palliative & Long-Term Care'],
        practicum: ['Area Agencies on Aging','Senior centers','Home health/hospice'] },

      { id: 'substance', name: 'Substance Use & Recovery',
        blurb: 'Recovery-oriented care; harm reduction, motivational interviewing, treatment & peer supports.',
        courses: ['Substance Use & Recovery','Motivational Interviewing','Co-Occurring Disorders'],
        practicum: ['Outpatient/inpatient programs','MAT clinics','Recovery community orgs'] },

      { id: 'housing', name: 'Housing & Homeless Services',
        blurb: 'Outreach, shelter, rapid rehousing, eviction prevention, landlord/agency navigation.',
        courses: ['Housing Policy & Services','Case Management','Street Outreach'],
        practicum: ['Continuum of Care agencies','Shelters/Navigation centers','Rapid Re-Housing teams'] },

      { id: 'disability', name: 'Disability & Accessibility Services',
        blurb: 'Independent living, accommodations, benefits, accessibility and rights.',
        courses: ['Disability Studies','IEP/504 Advocacy','Benefits Navigation (SSI/SSDI)'],
        practicum: ['Centers for Independent Living','Vocational rehab','Disability rights orgs'] },

      { id: 'immigration', name: 'Immigration & Refugee Services',
        blurb: 'Resettlement, legal aid partnerships, language access, trauma-informed supports.',
        courses: ['Immigration Policy','Cross-Cultural Practice','Trauma & Resilience'],
        practicum: ['Refugee resettlement agencies','Legal aid immigration units','Community orgs'] },

      { id: 'dv', name: 'Domestic & Gender-Based Violence',
        blurb: 'Crisis response, safety planning, survivor advocacy, civil/criminal legal navigation.',
        courses: ['Trauma-Informed Practice','DV & Safety Planning','Forensic/Justice SW'],
        practicum: ['DV shelters','Family justice centers','Campus Title IX offices'] },

      { id: 'veterans', name: 'Military & Veterans Services',
        blurb: 'Veteran-centered care; benefits, family support, transition, trauma-informed practice.',
        courses: ['Military Culture & BH','VA Systems & Benefits','Trauma/PTSD'],
        practicum: ['VA medical centers','Vet Centers','Military family support orgs'] },

      { id: 'hospice', name: 'Hospice & Palliative Care',
        blurb: 'End-of-life care, family support, grief and bereavement, interdisciplinary teams.',
        courses: ['Palliative Care','Grief & Bereavement','Medical SW'],
        practicum: ['Hospice agencies','Hospital palliative teams','Home-based care'] },
    ];

    // -------- PROMPTS (30) --------
    const QUESTIONS = [
      { id: 'q1',  text: 'I like talking one-on-one with someone to help them figure things out.' },
      { id: 'q2',  text: 'I get curious about how rules and policies shape people’s options—and how to change them.' },
      { id: 'q3',  text: 'I enjoy turning messy information into a clear explanation or short brief.' },
      { id: 'q4',  text: 'I like running groups and getting people moving in the same direction.' },
      { id: 'q5',  text: 'I focus well in fast-moving or crisis moments.' },
      { id: 'q6',  text: 'I want work that deals with rights, ethics, and accountability.' },
      { id: 'q7',  text: 'Seeing simple progress over time (even small wins) keeps me motivated.' },
      { id: 'q8',  text: 'I prefer days with movement and field visits over mostly desk time.' },
      { id: 'q9',  text: 'I enjoy building long-term relationships with clients, students, or families.' },
      { id: 'q10', text: 'I get energy from starting new programs or making a service run better.' },
      { id: 'q11', text: 'I’d rather design systems and processes than provide therapy myself.' },
      { id: 'q12', text: 'Working in a school or youth setting sounds appealing to me.' },
      { id: 'q13', text: 'Working in health/medical settings sounds appealing to me.' },
      { id: 'q14', text: 'Helping children and families feel safe and stable matters a lot to me.' },
      { id: 'q15', text: 'I’m comfortable engaging with courts, public defenders, probation, or corrections.' },
      { id: 'q16', text: 'I like bringing people from different organizations together to solve a problem.' },
      { id: 'q17', text: 'Reducing inequities and improving fairness at a systems level motivates me.' },
      { id: 'q18', text: 'I prefer predictable routines and schedules.' },
      { id: 'q19', text: 'I’m okay with mandated reporting and detailed documentation.' },
      { id: 'q20', text: 'I like brief, solution-focused contacts more than long-term ones.' },
      { id: 'q21', text: 'I’m comfortable speaking up in front of a group or presenting.' },
      { id: 'q22', text: 'I enjoy deep, independent work time.' },
      { id: 'q23', text: 'I’d enjoy doing home, hospital, or community visits.' },
      { id: 'q24', text: 'I like negotiating with agencies or insurers to get services approved.' },
      { id: 'q25', text: 'I’d rather write a brief/report than run a counseling session.' },
      { id: 'q26', text: 'I’m open to shifts, evenings, or weekends if the role needs it.' },
      { id: 'q27', text: 'I want to mentor or supervise a small team.' },
      { id: 'q28', text: 'I enjoy using simple feedback or data to improve programs.' },
      { id: 'q29', text: 'Reentry work, diversion programs, or problem-solving courts sound meaningful.' },
      { id: 'q30', text: 'I’d rather help many people indirectly by improving a system than help a few people directly.' },
    ];

    // -------- WEIGHT MATRIX (−2..+2 typical; omissions default to 0) --------
    const WEIGHTS = {
      // original 8 (kept from prior student-friendly version)
      clinical:  { q1:2,q2:-1,q3:0,q4:0,q5:1,q6:1,q7:0,q8:0,q9:2,q10:0,q11:-2,q12:1,q13:1,q14:1,q15:0,q16:0,q17:1,q18:1,q19:1,q20:-1,q21:0,q22:-1,q23:0,q24:0,q25:-2,q26:0,q27:1,q28:0,q29:0,q30:-2 },
      school:    { q1:1,q2:0,q3:0,q4:1,q5:0,q6:0,q7:1,q8:0,q9:2,q10:0,q11:0,q12:2,q13:0,q14:1,q15:0,q16:1,q17:1,q18:2,q19:1,q20:-1,q21:1,q22:0,q23:1,q24:1,q25:0,q26:-1,q27:1,q28:1,q29:0,q30:0 },
      medical:   { q1:1,q2:0,q3:0,q4:0,q5:2,q6:0,q7:1,q8:1,q9:0,q10:1,q11:0,q12:0,q13:2,q14:0,q15:0,q16:0,q17:0,q18:-1,q19:1,q20:1,q21:0,q22:0,q23:1,q24:2,q25:0,q26:1,q27:1,q28:1,q29:0,q30:0 },
      childfam:  { q1:1,q2:0,q3:0,q4:1,q5:1,q6:1,q7:0,q8:1,q9:1,q10:0,q11:0,q12:1,q13:0,q14:2,q15:1,q16:1,q17:1,q18:1,q19:2,q20:0,q21:0,q22:0,q23:1,q24:1,q25:0,q26:1,q27:1,q28:1,q29:0,q30:0 },
      community: { q1:0,q2:1,q3:1,q4:2,q5:1,q6:0,q7:0,q8:2,q9:0,q10:2,q11:1,q12:0,q13:0,q14:1,q15:0,q16:2,q17:2,q18:-1,q19:0,q20:1,q21:1,q22:-1,q23:1,q24:1,q25:0,q26:1,q27:2,q28:1,q29:1,q30:1 },
      policy:    { q1:-1,q2:2,q3:2,q4:1,q5:0,q6:1,q7:1,q8:0,q9:0,q10:1,q11:2,q12:0,q13:0,q14:0,q15:1,q16:1,q17:2,q18:0,q19:1,q20:1,q21:2,q22:1,q23:0,q24:1,q25:1,q26:0,q27:1,q28:1,q29:1,q30:2 },
      research:  { q1:-1,q2:1,q3:2,q4:0,q5:0,q6:0,q7:2,q8:-1,q9:1,q10:1,q11:1,q12:0,q13:0,q14:0,q15:0,q16:0,q17:1,q18:1,q19:0,q20:0,q21:1,q22:2,q23:-1,q24:0,q25:2,q26:0,q27:0,q28:2,q29:0,q30:1 },
      justice:   { q1:1,q2:1,q3:0,q4:0,q5:1,q6:2,q7:0,q8:1,q9:0,q10:0,q11:0,q12:0,q13:0,q14:1,q15:2,q16:1,q17:1,q18:-1,q19:1,q20:1,q21:1,q22:0,q23:1,q24:1,q25:0,q26:0,q27:0,q28:0,q29:2,q30:0 },

      // new 8
      aging:     { q1:2,q2:0,q3:0,q4:0,q5:0,q6:1,q7:1,q8:1,q9:2,q10:0,q11:-1,q12:0,q13:1,q14:0,q15:0,q16:1,q17:1,q18:2,q19:2,q20:-1,q21:0,q22:0,q23:2,q24:2,q25:-1,q26:1,q27:1,q28:1,q29:0,q30:-1 },
      substance: { q1:1,q2:0,q3:0,q4:1,q5:2,q6:1,q7:1,q8:1,q9:0,q10:0,q11:-1,q12:0,q13:1,q14:0,q15:1,q16:0,q17:1,q18:-1,q19:1,q20:1,q21:0,q22:0,q23:1,q24:1,q25:-1,q26:2,q27:0,q28:1,q29:1,q30:-1 },
      housing:   { q1:1,q2:1,q3:0,q4:1,q5:2,q6:1,q7:1,q8:2,q9:0,q10:1,q11:-1,q12:0,q13:0,q14:1,q15:1,q16:2,q17:2,q18:-2,q19:1,q20:1,q21:0,q22:-1,q23:2,q24:2,q25:-1,q26:2,q27:1,q28:1,q29:1,q30:1 },
      disability:{ q1:1,q2:1,q3:1,q4:0,q5:0,q6:2,q7:1,q8:0,q9:2,q10:1,q11:0,q12:1,q13:0,q14:1,q15:1,q16:1,q17:2,q18:1,q19:2,q20:-1,q21:0,q22:0,q23:1,q24:2,q25:0,q26:0,q27:1,q28:1,q29:0,q30:1 },
      immigration:{q1:1,q2:2,q3:1,q4:0,q5:1,q6:2,q7:0,q8:1,q9:1,q10:0,q11:0,q12:0,q13:0,q14:1,q15:2,q16:1,q17:2,q18:-1,q19:0,q20:-1,q21:1,q22:0,q23:1,q24:2,q25:1,q26:0,q27:0,q28:0,q29:0,q30:1 },
      dv:        { q1:1,q2:1,q3:0,q4:0,q5:2,q6:2,q7:0,q8:1,q9:1,q10:0,q11:-1,q12:0,q13:0,q14:1,q15:2,q16:1,q17:2,q18:-1,q19:2,q20:1,q21:0,q22:0,q23:1,q24:1,q25:-1,q26:1,q27:0,q28:0,q29:0,q30:0 },
      veterans:  { q1:1,q2:0,q3:0,q4:0,q5:1,q6:1,q7:1,q8:1,q9:2,q10:0,q11:0,q12:0,q13:1,q14:0,q15:1,q16:1,q17:1,q18:1,q19:1,q20:0,q21:0,q22:0,q23:1,q24:2,q25:0,q26:1,q27:1,q28:1,q29:0,q30:0 },
      hospice:   { q1:2,q2:0,q3:0,q4:0,q5:1,q6:1,q7:1,q8:1,q9:2,q10:0,q11:-1,q12:0,q13:2,q14:0,q15:0,q16:0,q17:1,q18:1,q19:1,q20:-1,q21:0,q22:0,q23:2,q24:1,q25:-1,q26:1,q27:1,q28:1,q29:0,q30:0 },
    };

    // -------- STATE --------
    let answers = loadAnswers(); // { q#: 1..5 }
    let step = loadStep();       // 0=intro, 1..N questions, N+1 results

    // -------- RENDER --------
    function render() {
      updateProgress();
      const slot = ensureSlot();
      slot.innerHTML = '';
      if (step === 0) slot.appendChild(renderIntro());
      else if (step >= 1 && step <= QUESTIONS.length) slot.appendChild(renderQuestion(step));
      else slot.appendChild(renderResults());
    }

    function ensureSlot() {
      let slot = document.getElementById('content');
      if (!slot) {
        slot = document.createElement('div'); slot.id = 'content';
        slot.className = 'p-6 md:p-8';
        (document.querySelector('section') || document.body).appendChild(slot);
      }
      return slot;
    }

    function renderIntro() {
      const el = document.createElement('div');
      el.innerHTML = `
        <div class="flex flex-col gap-4">
          <p class="text-slate-700">These prompts focus on values, pace, and working conditions—not specific settings or skills. Answer for what sounds energizing, even if it’s new to you.</p>
          <ul class="list-disc pl-6 text-slate-600 space-y-1">
            <li>No logins. Your progress saves locally.</li>
            <li>You can skip questions and come back.</li>
            <li>Results can be printed or saved as PDF.</li>
          </ul>
          <div class="mt-2 flex items-center gap-3">
            <button id="startBtn" class="rounded-2xl bg-sky-600 text-white px-5 py-3 text-sm font-semibold shadow hover:bg-sky-700">Start quiz</button>
            <button id="jumpResultsBtn" class="text-sky-700 underline underline-offset-2">See last saved results</button>
          </div>
        </div>`;
      el.querySelector('#startBtn')?.addEventListener('click', () => setStep(1));
      el.querySelector('#jumpResultsBtn')?.addEventListener('click', () => setStep(QUESTIONS.length + 1));
      return el;
    }

    function renderQuestion(idx) {
      const q = QUESTIONS[idx - 1];
      const el = document.createElement('div');
      const val = answers[q.id] ?? null;
      el.innerHTML = `
        <div class="flex flex-col gap-6">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Question ${idx} of ${QUESTIONS.length}</p>
            <h2 class="mt-1 text-2xl font-bold">${q.text}</h2>
          </div>
          <fieldset class="space-y-3" aria-label="Likert scale from 1 to 5">${renderLikert(q.id, val)}</fieldset>
          <div class="flex flex-wrap items-center gap-3">
            <button class="rounded-xl bg-sky-600 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-700" id="nextBtn">${idx === QUESTIONS.length ? 'Finish' : 'Next'}</button>
            <button class="rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50" id="skipBtn">Skip</button>
            <button class="rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50" id="prevBtn">Back</button>
          </div>
        </div>`;
      el.querySelector('#nextBtn')?.addEventListener('click', () => setStep(idx === QUESTIONS.length ? QUESTIONS.length + 1 : idx + 1));
      el.querySelector('#skipBtn')?.addEventListener('click', () => setStep(idx === QUESTIONS.length ? QUESTIONS.length + 1 : idx + 1));
      el.querySelector('#prevBtn')?.addEventListener('click', () => setStep(Math.max(0, idx - 1)));
      return el;
    }

    function renderLikert(qid, currentVal) {
      const labels = ['1 Strongly Disagree','2','3','4','5 Strongly Agree'];
      return labels.map((label, i) => {
        const val = i + 1;
        const checked = currentVal === val ? 'checked' : '';
        return `
          <label class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50">
            <input type="radio" name="${qid}" value="${val}" ${checked} class="h-4 w-4" />
            <span class="text-sm">${label}</span>
          </label>`;
      }).join('');
    }

    function renderResults() {
      const { scores, ranked, answeredCount } = scorePaths();
      const el = document.createElement('div');
      const answeredNote = answeredCount === 0
        ? '<p class="text-sm text-rose-600">You skipped everything—results are empty. Go back and answer a few!</p>'
        : `<p class="text-sm text-slate-500">Based on <strong>${answeredCount}</strong> answered item${answeredCount===1?'':'s'}. You can change answers and results will update.</p>`;
      const bars = ranked.map(({ id, pct }) => {
        const p = PATHWAYS.find(p => p.id === id);
        const w = Math.round(pct);
        return `
          <div class="space-y-1">
            <div class="flex items-center justify-between text-sm"><span class="font-medium">${p.name}</span><span class="tabular-nums">${w}%</span></div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden"><div class="h-3 bg-sky-500" style="width:${w}%"></div></div>
          </div>`;
      }).join('');
      const top3 = ranked.slice(0, 3).map(({ id, pct }) => {
        const p = PATHWAYS.find(p => p.id === id);
        return renderPathwayCard(p, Math.round(pct));
      }).join('');
      el.innerHTML = `
        <div class="flex flex-col gap-6">
          <div><h2 class="text-2xl font-bold">Your Results</h2>${answeredNote}</div>
          <div class="grid gap-4">${bars}</div>
          <div class="mt-4"><h3 class="text-xl font-semibold">Your Top Matches</h3><div class="mt-3 grid gap-4 md:grid-cols-2">${top3}</div></div>
          <div class="mt-2 text-xs text-slate-500">
            <p><span class="font-semibold">How this works:</span> Each 1–5 answer is centered to −2..+2 and weighted per pathway, then converted to a <em>relative score</em> (z-score across all ${PATHWAYS.length} paths) so agreeing with everything doesn’t give all high scores. ~50 is your personal midpoint.</p>
          </div>
          <div class="no-print mt-4 flex items-center gap-3">
            <button class="rounded-xl bg-sky-600 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-700" id="editBtn">Edit answers</button>
            <button class="rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50" id="retakeBtn">Retake</button>
          </div>
        </div>`;
      el.querySelector('#editBtn')?.addEventListener('click', () => setStep(1));
      el.querySelector('#retakeBtn')?.addEventListener('click', () => { answers = {}; persistAnswers(); setStep(1); });
      return el;
    }

    function renderPathwayCard(p, pct) {
      const courseList = p.courses.map(c => `<li>${c}</li>`).join('');
      const pracList = p.practicum.map(c => `<li>${c}</li>`).join('');
      return `
        <article class="rounded-2xl border border-slate-200 p-4">
          <div class="flex items-center justify-between"><h4 class="text-lg font-semibold">${p.name}</h4><span class="text-sm tabular-nums rounded-full bg-sky-50 text-sky-700 px-2 py-1">${pct}%</span></div>
          <p class="mt-1 text-sm text-slate-600">${p.blurb}</p>
          <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div><p class="text-xs font-semibold text-slate-500">Suggested coursework</p><ul class="mt-1 text-sm list-disc pl-5">${courseList}</ul></div>
            <div><p class="text-xs font-semibold text-slate-500">Field/Practicum ideas</p><ul class="mt-1 text-sm list-disc pl-5">${pracList}</ul></div>
          </div>
        </article>`;
    }

    // -------- SCORING (relative / ipsative) --------
    function scorePaths() {
      const rawTotals = {}; PATHWAYS.forEach(p => rawTotals[p.id] = 0);
      let answeredCount = 0;

      QUESTIONS.forEach(q => {
        const a = answers[q.id];
        if (!a) return;
        answeredCount++;
        const centered = a - 3; // −2..+2
        PATHWAYS.forEach(p => {
          const w = (WEIGHTS[p.id] && WEIGHTS[p.id][q.id]) ? WEIGHTS[p.id][q.id] : 0;
          rawTotals[p.id] += w * centered;
        });
      });

      const vals = Object.values(rawTotals);
      const mean = vals.reduce((s,v)=>s+v,0) / (vals.length || 1);
      const variance = vals.reduce((s,v)=>s + Math.pow(v - mean, 2), 0) / (vals.length || 1);
      const stdev = Math.sqrt(variance) || 1;
      const Z_SCALE = 20; // raise to 22–24 for sharper separation

      const scores = {};
      PATHWAYS.forEach(p => {
        const z = (rawTotals[p.id] - mean) / stdev;
        const pct = Math.round(Math.max(0, Math.min(100, 50 + Z_SCALE * z)));
        scores[p.id] = pct;
      });

      const ranked = Object.entries(scores)
        .map(([id,pct]) => ({ id, pct }))
        .sort((a,b) => b.pct - a.pct);

      return { scores, ranked, answeredCount };
    }

    // -------- STORAGE & WIRING --------
    function persistAnswers(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step })); }catch{} updateProgress(); }
    function loadAnswers(){ try{ const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); return raw && raw.answers ? raw.answers : {}; } catch { return {}; } }
    function loadStep(){ try{ const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); return raw && Number.isInteger(raw.step) ? raw.step : 0; } catch { return 0; } }
    function setStep(n){ step = n; persistAnswers(); render(); }

    function updateProgress(){
      const total = QUESTIONS.length;
      const pct = step === 0 ? 0 : Math.round((Math.max(1, Math.min(step, total)) / total) * 100);
      const bar = document.getElementById('progressBar'); if (bar) bar.style.width = pct + '%';
    }

    document.addEventListener('change', (e) => {
      const el = e.target;
      if (el && el.name && el.type === 'radio') {
        const qid = el.name; const val = Number(el.value);
        if (QUESTIONS.find(q => q.id === qid)) { answers[qid] = val; persistAnswers(); }
      }
    });

    document.getElementById('printBtn')?.addEventListener('click', () => window.print());
    document.getElementById('resetBtn')?.addEventListener('click', () => {
      if (confirm('Clear saved answers and results?')) { answers = {}; step = 0; persistAnswers(); render(); }
    });
    document.getElementById('copyBtn')?.addEventListener('click', () => {
      const { ranked } = scorePaths();
      const top = ranked.slice(0, 3).map(r => {
        const p = PATHWAYS.find(x => x.id === r.id);
        return `${p.name}: ${Math.round(r.pct)}%`;
      }).join('\n');
      const text = `Social Work Path Quiz — Top Matches\n${top}\n\nThis tool is exploratory. Use results as a starting point for advising and field searches.`;
      navigator.clipboard.writeText(text).then(() => toast('Results copied to clipboard')).catch(() => alert('Copy failed.'));
    });

    function toast(msg){
      const t = document.createElement('div');
      t.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-3 py-2 rounded-xl shadow-lg';
      t.textContent = msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
    }

    render();
  } catch (err) { fatal(err); }
});
