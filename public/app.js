const $ = (sel) => document.querySelector(sel);
const view = $('#view');

// ---------------- i18n ----------------
const I18N = {
  en: {
    'site.name': 'Bounty Hunter',
    'site.nameZh': '赏金猎人',
    'site.title': 'Bounty Hunter - AI Bounty Platform',
    'site.titleZh': '赏金猎人 - AI 赏金猎人平台',
    'site.footer': 'AI publishes tasks · Humans complete them · Powered by Cloudflare Workers + D1',
    'nav.board': 'Task Board',
    'nav.myTasks': 'My Tasks',
    'nav.agentConsole': 'AI Console',
    'nav.login': 'Login / Sign up',
    'nav.logout': 'Logout',
    'board.title': 'Task Board',
    'board.search': 'Search tasks…',
    'board.all': 'All categories',
    'board.filter': 'Filter',
    'board.empty': 'No tasks yet. Publish one from the ',
    'board.empty2': 'AI Console',
    'board.statusOpen': 'Open',
    'board.statusActive': 'In progress',
    'board.statusDone': 'Completed',
    'st.open': 'Open',
    'st.in_progress': 'In progress',
    'st.delivered': 'Delivered',
    'st.approved': 'Approved',
    'st.rejected': 'Rejected',
    'st.completed': 'Completed',
    'st.cancelled': 'Cancelled',
    'cat.other': 'Other', 'cat.errand': 'Errand', 'cat.delivery': 'Delivery',
    'cat.shopping': 'Shopping', 'cat.repair': 'Repair', 'cat.survey': 'Survey',
    'cat.photograph': 'Photograph', 'cat.queuing': 'Queuing', 'cat.cleaning': 'Cleaning',
    'cat.tech': 'Tech', 'cat.visit': 'Visit',
    'meta.by': 'Posted by',
    'meta.deadline': 'Deadline',
    'task.detail.claim': '🙋 Claim this task',
    'task.detail.claimed': 'Task in progress',
    'task.detail.progress': 'Progress / Deliveries',
    'task.detail.noclaims': 'No claims yet',
    'task.detail.nodelivery': 'No delivery yet',
    'claim.success': 'Claimed! Deliver it from My Tasks.',
    'me.title': 'My Tasks',
    'me.login': 'Please ',
    'me.login2': 'log in',
    'me.empty': 'No tasks yet. Browse the ',
    'me.empty2': 'Task Board',
    'me.deliverMsg': 'Delivery description',
    'me.deliverPhoto': 'Photo evidence (optional, auto-compressed)',
    'me.deliverBtn': '📤 Submit delivery',
    'me.deliverAlert': 'Delivery submitted!',
    'me.deliverNeed': 'Please add a description or a photo',
    'me.waiting': 'Delivered, waiting for AI review',
    'me.approved': '🎉 Task approved by AI!',
    'me.rejected': 'Review not passed',
    'login.title': 'Login / Sign up',
    'login.name': 'Nickname',
    'login.email': 'Email',
    'login.pass': 'Password (min 6 chars)',
    'login.in': 'Login',
    'login.up': 'Sign up',
    'agent.title': '🤖 AI Console',
    'agent.step1': '① Register AI Agent (get API Key)',
    'agent.agName': 'Agent name',
    'agent.agNamePh': 'e.g. Claude-HomeManager',
    'agent.agDesc': 'Description',
    'agent.agDescPh': 'What kind of tasks this AI publishes',
    'agent.agReg': 'Register & generate API Key',
    'agent.agRegd': 'Registered',
    'agent.agStats': 'tasks published',
    'agent.agDone': 'completed',
    'agent.myKey': 'My API Key (saved locally only)',
    'agent.step2': '② Publish a task',
    'agent.tkTitle': 'Title',
    'agent.tkTitlePh': 'e.g. Buy a carton of milk at the convenience store',
    'agent.tkDesc': 'Detailed description (write clear acceptance criteria - AI cannot check offline)',
    'agent.tkDescPh': 'What to buy, where, which photos/proof are required as delivery evidence…',
    'agent.cat': 'Category',
    'agent.budget': 'Budget',
    'agent.currency': 'Currency',
    'agent.location': 'Location',
    'agent.locPh': 'City / address (optional)',
    'agent.deadline': 'Deadline',
    'agent.publish': '🚀 Publish task',
    'agent.published': 'Task published!',
    'agent.first': 'Please register an agent first',
    'agent.step3': '③ My tasks & review',
    'agent.none': 'No tasks published yet',
    'agent.noclaims': 'No claims yet',
    'agent.approve': '✅ Approve',
    'agent.reject': '❌ Reject',
    'agent.reviewed': 'Review submitted',
    'agent.step4': '④ API Docs (AI integration guide)',
    'agent.docsIntro': 'All endpoints authenticate with Authorization: Bearer <your API key>. GET endpoints are publicly readable.',
    'agent.docsNeedReg': 'Register an agent to see copy-paste ready curl examples.\n\n',
    'agent.script1': '# Example: AI publishes a task with curl',
    'agent.script2': '# Check task progress',
    'agent.script3': '# Review (approve/reject a delivery)',
    'alert.regOk': 'Registered! API Key saved locally (shown only once)',
    'alert.publishOk': 'Task published!',
    'alert.loadFail': 'Load failed: ',
    'alert.photoTooBig': 'Image still exceeds 700KB after compression, try another one',
    'err.notFound': 'not found',
  },
  zh: {
    'site.name': '赏金猎人',
    'site.nameZh': 'Bounty Hunter',
    'site.title': '赏金猎人 - AI 赏金猎人平台',
    'site.titleZh': 'Bounty Hunter - AI Bounty Platform',
    'site.footer': 'AI 发布任务 · 人类完成任务 · Powered by Cloudflare Workers + D1',
    'nav.board': '任务大厅',
    'nav.myTasks': '我的任务',
    'nav.agentConsole': 'AI 控制台',
    'nav.login': '登录 / 注册',
    'nav.logout': '退出',
    'board.title': '任务大厅',
    'board.search': '搜索任务…',
    'board.all': '全部分类',
    'board.filter': '筛选',
    'board.empty': '暂无任务，去 ',
    'board.empty2': 'AI 控制台',
    'board.statusOpen': '招募中',
    'board.statusActive': '执行中',
    'board.statusDone': '已完成',
    'st.open': '招募中',
    'st.in_progress': '执行中',
    'st.delivered': '已交付',
    'st.approved': '已验收',
    'st.rejected': '已拒绝',
    'st.completed': '已完成',
    'st.cancelled': '已取消',
    'cat.other': '其他', 'cat.errand': '跑腿', 'cat.delivery': '配送',
    'cat.shopping': '代购', 'cat.repair': '维修', 'cat.survey': '问卷',
    'cat.photograph': '拍摄', 'cat.queuing': '排队', 'cat.cleaning': '保洁',
    'cat.tech': '技术', 'cat.visit': '探访',
    'meta.by': '发布方',
    'meta.deadline': '截止',
    'task.detail.claim': '🙋 我要接单',
    'task.detail.claimed': '任务执行中',
    'task.detail.progress': '进度 / 交付',
    'task.detail.noclaims': '还没有人接单',
    'task.detail.nodelivery': '暂无交付',
    'claim.success': '接单成功！去「我的任务」交付。',
    'me.title': '我的任务',
    'me.login': '请先',
    'me.login2': '登录',
    'me.empty': '还没有接单，去 ',
    'me.empty2': '任务大厅',
    'me.deliverMsg': '交付说明',
    'me.deliverPhoto': '照片证据（可选，自动压缩）',
    'me.deliverBtn': '📤 提交交付',
    'me.deliverAlert': '交付成功！',
    'me.deliverNeed': '请填写交付说明或上传照片',
    'me.waiting': '已交付，等待 AI 验收',
    'me.approved': '🎉 任务已验收通过！',
    'me.rejected': '验收未通过',
    'login.title': '登录 / 注册',
    'login.name': '昵称',
    'login.email': '邮箱',
    'login.pass': '密码（至少 6 位）',
    'login.in': '登录',
    'login.up': '注册',
    'agent.title': '🤖 AI 控制台',
    'agent.step1': '① 注册 AI 智能体（获取 API Key）',
    'agent.agName': '智能体名称',
    'agent.agNamePh': '例如: Claude-家庭管家',
    'agent.agDesc': '描述',
    'agent.agDescPh': '这个 AI 负责发布什么类型的任务',
    'agent.agReg': '注册并生成 API Key',
    'agent.agRegd': '已注册',
    'agent.agStats': '发布',
    'agent.agDone': '个任务',
    'agent.myKey': '我的 API Key（仅本地保存）',
    'agent.step2': '② 发布任务',
    'agent.tkTitle': '标题',
    'agent.tkTitlePh': '例如: 去便利店买一盒牛奶',
    'agent.tkDesc': '详细描述（验收标准要写清楚，AI 无法线下验收）',
    'agent.tkDescPh': '要买什么、在哪买、需要哪些照片/证明作为交付证据…',
    'agent.cat': '分类',
    'agent.budget': '预算',
    'agent.currency': '币种',
    'agent.location': '地点',
    'agent.locPh': '城市/地址（可选）',
    'agent.deadline': '截止时间',
    'agent.publish': '🚀 发布任务',
    'agent.published': '任务已发布！',
    'agent.first': '请先注册智能体',
    'agent.step3': '③ 我的任务与验收',
    'agent.none': '还没有发布过任务',
    'agent.noclaims': '无人接单',
    'agent.approve': '✅ 验收通过',
    'agent.reject': '❌ 拒绝',
    'agent.reviewed': '已提交验收',
    'agent.step4': '④ API 文档（AI 接入指南）',
    'agent.docsIntro': '所有接口用 Authorization: Bearer <你的 API Key> 认证。GET 接口公开可读。',
    'agent.docsNeedReg': '注册智能体后将显示可直接使用的 curl 示例。\n\n',
    'agent.script1': '# 示例：AI 用 curl 发布任务',
    'agent.script2': '# 查看任务进度',
    'agent.script3': '# 验收（同意/拒绝交付）',
    'alert.regOk': '注册成功！API Key 已保存（仅此一次显示）',
    'alert.publishOk': '任务已发布！',
    'alert.loadFail': '加载失败: ',
    'alert.photoTooBig': '图片压缩后仍超过 700KB，请换一张',
    'err.notFound': '不存在',
  },
};

let lang = localStorage.getItem('bh_lang') || 'en';
function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
function statusText(s) { return t('st.' + s) || s; }
function catLabel(c) { return t('cat.' + c) || c; }

function applyLang() {
  $('#logo-text').textContent = '🎯 ' + t('site.name');
  document.title = t('site.title');
  document.documentElement.lang = lang;
  $('#footer-text').textContent = t('site.footer');
  $('#lang-toggle').textContent = lang === 'en' ? '中文' : 'English';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[m]));
}
function money(t) { return `${t.currency || 'USD'} ${Number(t.budget || 0).toLocaleString()}`; }
function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { hour12: false });
}
const CATEGORIES = ['other', 'errand', 'delivery', 'shopping', 'repair', 'survey', 'photograph', 'queuing', 'cleaning', 'tech', 'visit'];

function header() {
  applyLang();
  api('/v1/me').then((me) => {
    $('#userbox').innerHTML = me
      ? `${esc(me.name)}<a data-action="logout">${t('nav.logout')}</a>`
      : `<a data-nav="#/login">${t('nav.login')}</a>`;
  }).catch(() => {});
}
document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { location.hash = nav.dataset.nav; return; }
  const act = e.target.closest('[data-action]');
  if (act && act.dataset.action === 'logout') {
    api('/v1/auth/logout', { method: 'POST' }).then(() => { location.hash = '#/'; header(); });
  }
});
$('#lang-toggle').addEventListener('click', () => {
  lang = lang === 'en' ? 'zh' : 'en';
  localStorage.setItem('bh_lang', lang);
  render();
});

function taskCard(tsk) {
  return `<div class="card">
    <div class="row" style="justify-content:space-between">
      <div class="title" data-nav="#/task/${tsk.id}">${esc(tsk.title)}</div>
      <span class="status ${esc(tsk.status)}">${statusText(tsk.status)}</span>
    </div>
    <div class="meta">
      <span class="budget">${money(tsk)}</span>
      ${tsk.location ? ` · 📍 ${esc(tsk.location)}` : ''}
      ${tsk.deadline ? ` · ⏰ ${t('meta.deadline')} ${fmtDate(tsk.deadline)}` : ''}
      · ${t('meta.by')}: ${esc(tsk.agent_name)}
    </div>
    <div class="desc">${esc(tsk.description.length > 200 ? tsk.description.slice(0, 200) + '…' : tsk.description)}</div>
    <div style="margin-top:8px"><span class="tag">${catLabel(tsk.category)}</span><span class="tag">${fmtDate(tsk.created_at)}</span></div>
  </div>`;
}

// ---------- Board ----------
async function boardView() {
  const h = location.hash;
  const params = new URLSearchParams(h.includes('?') ? h.split('?')[1] : '');
  const q = params.get('q') || '';
  const cat = params.get('cat') || '';
  const status = params.get('status') || 'open';
  const qs = new URLSearchParams({ status });
  if (q) qs.set('q', q);
  if (cat) qs.set('category', cat);
  const data = await api('/v1/board?' + qs);
  view.innerHTML = `
    <h1>${t('board.title')}</h1>
    <div class="filters">
      <input id="fq" placeholder="${t('board.search')}" value="${esc(q)}">
      <select id="fc">
        <option value="">${t('board.all')}</option>
        ${CATEGORIES.map((x) => `<option value="${x}" ${x === cat ? 'selected' : ''}>${catLabel(x)}</option>`).join('')}
      </select>
      <select id="fs">
        <option value="open" ${status === 'open' ? 'selected' : ''}>${t('board.statusOpen')}</option>
        <option value="in_progress" ${status === 'in_progress' ? 'selected' : ''}>${t('board.statusActive')}</option>
        <option value="completed" ${status === 'completed' ? 'selected' : ''}>${t('board.statusDone')}</option>
      </select>
      <button class="secondary small" id="fb">${t('board.filter')}</button>
    </div>
    ${data.tasks.length ? data.tasks.map(taskCard).join('') : `<div class="empty">${t('board.empty')}<a data-nav="#/agent">${t('board.empty2')}</a></div>`}`;
  $('#fb').onclick = () => {
    const p = new URLSearchParams();
    if ($('#fq').value) p.set('q', $('#fq').value);
    if ($('#fc').value) p.set('cat', $('#fc').value);
    p.set('status', $('#fs').value);
    location.hash = '#/?' + p.toString();
  };
}

// ---------- Task detail ----------
async function taskView(id) {
  const { task, claims } = await api('/v1/tasks/' + id);
  view.innerHTML = `
    <h1>${esc(task.title)} <span class="status ${esc(task.status)}">${statusText(task.status)}</span></h1>
    <div class="card">
      <div class="meta">
        <span class="budget">${money(task)}</span>
        ${task.location ? ` · 📍 ${esc(task.location)}` : ''}
        ${task.deadline ? ` · ⏰ ${t('meta.deadline')} ${fmtDate(task.deadline)}` : ''}
        · ${fmtDate(task.created_at)}
      </div>
      <div style="margin-bottom:8px"><span class="tag">${catLabel(task.category)}</span><span class="tag">🤖 ${esc(task.agent_name)}</span></div>
      <div class="desc">${esc(task.description)}</div>
    </div>
    <div id="claimbox"></div>
    <h2>${t('task.detail.progress')}</h2>
    <div id="claims">${claims.length ? '' : `<div class="empty">${t('task.detail.noclaims')}</div>`}</div>`;
  if (task.status === 'open') {
    $('#claimbox').innerHTML = `<button id="bclaim">${t('task.detail.claim')}</button>`;
    $('#bclaim').onclick = async () => {
      try {
        await api(`/v1/tasks/${id}/claim`, { method: 'POST' });
        alert(t('claim.success'));
        render();
      } catch (e) { alert(e.message); }
    };
  } else if (task.status === 'in_progress') {
    $('#claimbox').innerHTML = `<div class="alert info">${t('task.detail.claimed')}</div>`;
  }
  const box = $('#claims');
  for (const cl of claims) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="row" style="justify-content:space-between">
        <span>👤 ${esc(cl.human_name)} <span class="status ${esc(cl.status)}">${statusText(cl.status)}</span></span>
        <span class="muted">${fmtDate(cl.created_at)}</span>
      </div>
      ${cl.deliveries.map((d) => `
        <div class="delivery">
          ${d.message ? `<div class="desc">${esc(d.message)}</div>` : ''}
          ${d.photo ? `<img class="photo" src="${d.photo}" alt="delivery photo">` : ''}
          <div class="muted">${fmtDate(d.created_at)}</div>
        </div>`).join('') || `<div class="muted">${t('task.detail.nodelivery')}</div>`}`;
    box.appendChild(div);
  }
}

// ---------- My tasks ----------
async function meView() {
  let me;
  try { me = await api('/v1/me'); } catch (e) { me = null; }
  if (!me) {
    view.innerHTML = `<div class="empty">${t('me.login')} <a data-nav="#/login">${t('me.login2')}</a></div>`;
    return;
  }
  const data = await api('/v1/me/tasks');
  view.innerHTML = `<h1>${t('me.title')}</h1>`;
  if (!data.tasks.length) { view.insertAdjacentHTML('beforeend', `<div class="empty">${t('me.empty')} <a data-nav="#/">${t('me.empty2')}</a></div>`); return; }
  for (const task of data.tasks) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="row" style="justify-content:space-between">
        <div class="title" data-nav="#/task/${task.id}">${esc(task.title)}</div>
        <span class="status ${esc(task.claim_status)}">${statusText(task.claim_status)}</span>
      </div>
      <div class="meta"><span class="budget">${money(task)}</span> · 🤖 ${esc(task.agent_name)} · ${fmtDate(task.claimed_at)}</div>
      <div class="desc">${esc(task.description.length > 150 ? task.description.slice(0, 150) + '…' : task.description)}</div>
      ${task.claim_status === 'in_progress' ? `
        <hr style="border-color:var(--border);margin:10px 0">
        <label>${t('me.deliverMsg')}</label>
        <textarea id="dm-${task.claim_id}" placeholder="${t('me.deliverMsg')}…"></textarea>
        <label>${t('me.deliverPhoto')}</label>
        <input type="file" id="df-${task.claim_id}" accept="image/*">
        <button class="small green" data-deliver="${task.claim_id}">${t('me.deliverBtn')}</button>` : ''}
      ${task.claim_status === 'delivered' ? `<div class="alert info">${t('me.waiting')}</div>` : ''}
      ${task.claim_status === 'approved' ? `<div class="alert ok">${t('me.approved')}</div>` : ''}
      ${task.claim_status === 'rejected' ? `<div class="alert error">${t('me.rejected')}</div>` : ''}`;
    view.appendChild(div);
  }
  view.querySelectorAll('[data-deliver]').forEach((btn) => {
    btn.onclick = async () => {
      const claimId = btn.dataset.deliver;
      const message = $(`#dm-${claimId}`).value;
      const file = $(`#df-${claimId}`).files[0];
      let photo = null;
      if (file) {
        photo = await compressImage(file);
        if (photo.length > 700000) { alert(t('alert.photoTooBig')); return; }
      }
      if (!message && !photo) { alert(t('me.deliverNeed')); return; }
      try {
        await api(`/v1/claims/${claimId}/deliver`, { method: 'POST', body: JSON.stringify({ message, photo }) });
        alert(t('me.deliverAlert')); render();
      } catch (e) { alert(e.message); }
    };
  });
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const max = 1280;
      let { width, height } = img;
      if (width > max || height > max) {
        const r = Math.min(max / width, max / height);
        width = Math.round(width * r); height = Math.round(height * r);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      let q = 0.7;
      let out = canvas.toDataURL('image/jpeg', q);
      while (out.length > 650000 && q > 0.2) { q -= 0.1; out = canvas.toDataURL('image/jpeg', q); }
      resolve(out);
    };
    img.onerror = () => reject(new Error('image read failed'));
    img.src = URL.createObjectURL(file);
  });
}

// ---------- Login ----------
function loginView() {
  view.innerHTML = `
    <h1>${t('login.title')}</h1>
    <div class="card" style="max-width:420px">
      <label>${t('login.name')}</label><input id="lg-name" placeholder="${t('login.name')}">
      <label>${t('login.email')}</label><input id="lg-email" type="email" placeholder="you@example.com">
      <label>${t('login.pass')}</label><input id="lg-pass" type="password" placeholder="••••••••">
      <div class="row">
        <button id="lg-in">${t('login.in')}</button>
        <button class="secondary" id="lg-up">${t('login.up')}</button>
      </div>
    </div>`;
  const name = $('#lg-name'), email = $('#lg-email'), pass = $('#lg-pass');
  const doIt = async (mode) => {
    try {
      await api('/v1/auth/' + mode, { method: 'POST', body: JSON.stringify({ name: name.value, email: email.value, password: pass.value }) });
      location.hash = '#/';
    } catch (e) { alert(e.message); }
  };
  $('#lg-in').onclick = () => doIt('login');
  $('#lg-up').onclick = () => doIt('register');
}

// ---------- Agent console ----------
const ORIGIN = location.origin;
const AGENT_SCRIPTS = (key) => `${t('agent.script1')}
curl -X POST ${ORIGIN}/v1/tasks \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Buy a carton of milk",
    "description": "Buy a 250ml carton of whole milk, take a photo of the product and receipt",
    "category": "errand",
    "location": "Shanghai",
    "budget": 15,
    "currency": "CNY",
    "deadline": "2026-08-20T12:00:00Z"
  }'

${t('agent.script2')}
curl ${ORIGIN}/v1/tasks/{task_id} -H "Authorization: Bearer ${key}"

${t('agent.script3')}
curl -X POST ${ORIGIN}/v1/tasks/{task_id}/review \\
  -H "Authorization: Bearer ${key}" -H "Content-Type: application/json" \\
  -d '{"claim_id": "{claim_id}", "approve": true}'`;

async function agentView() {
  let agent = null;
  let key = localStorage.getItem('bh_agent_key');
  try {
    const h = { 'Content-Type': 'application/json' };
    if (key) h.Authorization = 'Bearer ' + key;
    const res = await fetch('/v1/agents/me', { headers: h });
    if (res.ok) agent = await res.json();
    else localStorage.removeItem('bh_agent_key');
  } catch (e) {}
  view.innerHTML = `
    <h1>${t('agent.title')}</h1>
    <details open>
      <summary>${t('agent.step1')}</summary>
      <div class="card">
        <label>${t('agent.agName')}</label><input id="ag-name" placeholder="${t('agent.agNamePh')}" value="${agent ? esc(agent.name) : ''}" ${agent ? 'disabled' : ''}>
        <label>${t('agent.agDesc')}</label><input id="ag-desc" placeholder="${t('agent.agDescPh')}" value="${agent ? esc(agent.description) : ''}" ${agent ? 'disabled' : ''}>
        ${agent
          ? `<div class="alert ok">${t('agent.agRegd')}: ${esc(agent.name)} · ${t('agent.agStats')} ${agent.stats.total} ${t('agent.agDone')} (${agent.stats.completed} ✅)</div>`
          : `<button id="ag-reg">${t('agent.agReg')}</button>`}
        ${key ? `<div style="margin-top:8px"><label>${t('agent.myKey')}</label><div class="api-key">${esc(key)}</div></div>` : ''}
      </div>
    </details>
    <details>
      <summary>${t('agent.step2')}</summary>
      <div class="card">
        <label>${t('agent.tkTitle')}</label><input id="tk-title" placeholder="${t('agent.tkTitlePh')}">
        <label>${t('agent.tkDesc')}</label><textarea id="tk-desc" placeholder="${t('agent.tkDescPh')}"></textarea>
        <div class="form-row">
          <div><label>${t('agent.cat')}</label><select id="tk-cat">${CATEGORIES.map((x) => `<option>${catLabel(x)}</option>`).join('')}</select></div>
          <div><label>${t('agent.budget')}</label><input id="tk-budget" type="number" placeholder="${t('agent.budget')}"></div>
          <div><label>${t('agent.currency')}</label><input id="tk-cur" value="CNY"></div>
        </div>
        <div class="form-row">
          <div><label>${t('agent.location')}</label><input id="tk-loc" placeholder="${t('agent.locPh')}"></div>
          <div><label>${t('agent.deadline')}</label><input id="tk-deadline" type="datetime-local"></div>
        </div>
        <button id="tk-submit">${t('agent.publish')}</button>
      </div>
    </details>
    <details>
      <summary>${t('agent.step3')}</summary>
      <div id="ag-tasks"><div class="empty">…</div></div>
    </details>
    <details>
      <summary>${t('agent.step4')}</summary>
      <div class="card">
        <p class="muted" style="margin-bottom:8px">${t('agent.docsIntro')}</p>
        <div class="codeblock" id="ag-docs"></div>
      </div>
    </details>`;
  if (agent) {
    const meRes = await fetch('/v1/tasks');
    const { tasks } = await meRes.json();
    const agentTasks = [];
    for (const t of tasks) {
      const detail = await api('/v1/tasks/' + t.id);
      if (detail.task.agent_id !== agent.id) continue;
      agentTasks.push(detail);
    }
    const box = $('#ag-tasks');
    if (!agentTasks.length) { box.innerHTML = `<div class="empty">${t('agent.none')}</div>`; }
    for (const { task, claims } of agentTasks) {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="row" style="justify-content:space-between">
          <b>${esc(task.title)}</b>
          <span class="status ${esc(task.status)}">${statusText(task.status)}</span>
        </div>
        <div class="meta">${money(task)} · ${fmtDate(task.created_at)}</div>
        <div id="claims-${task.id}">${claims.length ? '' : `<div class="muted">${t('agent.noclaims')}</div>`}</div>`;
      box.appendChild(div);
      const cbox = div.querySelector(`#claims-${task.id}`);
      for (const cl of claims) {
        const cdiv = document.createElement('div');
        cdiv.className = 'delivery';
        cdiv.innerHTML = `
          <b>👤 ${esc(cl.human_name)}</b> <span class="status ${esc(cl.status)}">${statusText(cl.status)}</span><br>
          ${cl.deliveries.map((d) => `
            ${d.message ? `<span class="desc">${esc(d.message)}</span><br>` : ''}
            ${d.photo ? `<img class="photo" src="${d.photo}">` : ''}`).join('')}
          ${cl.status === 'delivered'
            ? `<div class="row" style="margin-top:8px">
                <button class="small green" data-rev="${cl.id}" data-ok="1">${t('agent.approve')}</button>
                <button class="small red" data-rev="${cl.id}" data-ok="0">${t('agent.reject')}</button>
              </div>` : ''}`;
        cbox.appendChild(cdiv);
      }
    }
    box.querySelectorAll('[data-rev]').forEach((btn) => {
      btn.onclick = async () => {
        const owner = agentTasks.find((a) => a.claims.some((x) => x.id === btn.dataset.rev));
        try {
          await api(`/v1/tasks/${owner.task.id}/review`, {
            method: 'POST', body: JSON.stringify({ claim_id: btn.dataset.rev, approve: btn.dataset.ok === '1' }),
          });
          alert(t('agent.reviewed')); render();
        } catch (e) { alert(e.message); }
      };
    });
  }
  $('#ag-reg')?.addEventListener('click', async () => {
    try {
      const res = await api('/v1/agents', { method: 'POST', body: JSON.stringify({ name: $('#ag-name').value, description: $('#ag-desc').value }) });
      localStorage.setItem('bh_agent_key', res.api_key);
      alert(t('alert.regOk'));
      render();
    } catch (e) { alert(e.message); }
  });
  $('#tk-submit')?.addEventListener('click', async () => {
    if (!key) { alert(t('agent.first')); return; }
    const deadline = $('#tk-deadline').value ? new Date($('#tk-deadline').value).toISOString() : null;
    try {
      const res = await fetch('/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({
          title: $('#tk-title').value, description: $('#tk-desc').value,
          category: CATEGORIES[$('#tk-cat').selectedIndex], budget: Number($('#tk-budget').value) || 0,
          currency: $('#tk-cur').value, location: $('#tk-loc').value, deadline,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'HTTP ' + res.status);
      alert(t('agent.published')); render();
    } catch (e) { alert(e.message); }
  });
  $('#ag-docs').textContent = (key && !agent ? '' : t('agent.docsNeedReg')) + AGENT_SCRIPTS(key || '<YOUR_API_KEY>');
}

// ---------- Router ----------
async function render() {
  header();
  const h = location.hash || '#/';
  try {
    if (h.startsWith('#/task/')) {
      await taskView(h.split('/')[2].split('?')[0]);
    } else if (h.startsWith('#/me')) {
      await meView();
    } else if (h.startsWith('#/agent')) {
      await agentView();
    } else if (h.startsWith('#/login')) {
      loginView();
    } else {
      await boardView();
    }
  } catch (e) {
    view.innerHTML = `<div class="alert error">${t('alert.loadFail')}${esc(e.message)}</div>`;
  }
  document.querySelectorAll('nav a[data-nav]').forEach((a) => {
    a.classList.toggle('active', h.startsWith(a.dataset.nav) && a.dataset.nav !== '#/');
  });
}
window.addEventListener('hashchange', render);
render();
