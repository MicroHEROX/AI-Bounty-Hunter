import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Bindings = {
  DB: D1Database
  ASSETS: Fetcher
}

type Env = { Bindings: Bindings }

const app = new Hono<Env>()
app.use('/v1/*', cors())

const now = () => new Date().toISOString()

const uid = () =>
  crypto.randomUUID().replace(/-/g, '').slice(0, 16)

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function pbkdf2(password: string, salt: string, iterations = 100000): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations, hash: 'SHA-256' },
    key,
    256
  )
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function setCookie(c: any, token: string) {
  c.header(
    'Set-Cookie',
    `bh_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
  )
}
function clearCookie(c: any) {
  c.header('Set-Cookie', 'bh_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
}

async function agentFromReq(c: any): Promise<any | null> {
  const h = c.req.header('Authorization') || ''
  const key = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!key) return null
  const hash = await sha256(key)
  return c.env.DB.prepare('SELECT id, name, description FROM agents WHERE api_key_hash = ?')
    .bind(hash)
    .first()
}

async function humanFromReq(c: any): Promise<any | null> {
  const cookie = c.req.header('Cookie') || ''
  const m = cookie.match(/bh_session=([^;]+)/)
  if (!m) return null
  const tokenHash = await sha256(m[1])
  return c.env.DB.prepare(
    `SELECT h.id, h.name, h.email FROM sessions s JOIN humans h ON h.id = s.human_id
     WHERE s.token = ? AND s.expires_at > ?`
  )
    .bind(tokenHash, now())
    .first()
}

function bodyErr(message: string) {
  return { error: message }
}

// ---------------- Human auth ----------------

app.post('/v1/auth/register', async (c) => {
  const b = await c.req.json().catch(() => null)
  const email = String(b?.email || '').trim().toLowerCase()
  const name = String(b?.name || '').trim()
  const password = String(b?.password || '')
  if (!email || !name || password.length < 6) {
    return c.json(bodyErr('email/name required, password >= 6 chars'), 400)
  }
  const existing = await c.env.DB.prepare('SELECT id FROM humans WHERE email = ?').bind(email).first()
  if (existing) return c.json(bodyErr('email already registered'), 409)
  const id = uid()
  const salt = crypto.randomUUID().replace(/-/g, '')
  const passwordHash = await pbkdf2(password, salt)
  await c.env.DB.prepare('INSERT INTO humans (id, email, name, password_hash, salt) VALUES (?,?,?,?,?)')
    .bind(id, email, name, passwordHash, salt)
    .run()
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  const tokenHash = await sha256(token)
  await c.env.DB.prepare(
    'INSERT INTO sessions (token, human_id, expires_at) VALUES (?,?,?)'
  ).bind(tokenHash, id, new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()).run()
  setCookie(c, token)
  return c.json({ id, name, email })
})

app.post('/v1/auth/login', async (c) => {
  const b = await c.req.json().catch(() => null)
  const email = String(b?.email || '').trim().toLowerCase()
  const password = String(b?.password || '')
  const row = await c.env.DB.prepare('SELECT * FROM humans WHERE email = ?').bind(email).first() as any
  if (!row) return c.json(bodyErr('invalid email or password'), 401)
  const hash = await pbkdf2(password, row.salt)
  if (hash !== row.password_hash) return c.json(bodyErr('invalid email or password'), 401)
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  const tokenHash = await sha256(token)
  await c.env.DB.prepare(
    'INSERT INTO sessions (token, human_id, expires_at) VALUES (?,?,?)'
  ).bind(tokenHash, row.id, new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()).run()
  setCookie(c, token)
  return c.json({ id: row.id, name: row.name, email: row.email })
})

app.post('/v1/auth/logout', async (c) => {
  const cookie = c.req.header('Cookie') || ''
  const m = cookie.match(/bh_session=([^;]+)/)
  if (m) {
    const tokenHash = await sha256(m[1])
    await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(tokenHash).run()
  }
  clearCookie(c)
  return c.json({ ok: true })
})

// ---------------- Agents ----------------

app.post('/v1/agents', async (c) => {
  const b = await c.req.json().catch(() => null)
  const name = String(b?.name || '').trim()
  const description = String(b?.description || '').trim()
  if (!name) return c.json(bodyErr('name required'), 400)
  const id = uid()
  const apiKey = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  const apiKeyHash = await sha256(apiKey)
  await c.env.DB.prepare('INSERT INTO agents (id, name, api_key_hash, description) VALUES (?,?,?,?)')
    .bind(id, name, apiKeyHash, description)
    .run()
  return c.json({ id, name, description, api_key: apiKey })
})

app.get('/v1/agents/me', async (c) => {
  const agent = await agentFromReq(c)
  if (!agent) return c.json(bodyErr('invalid api key'), 401)
  const stats = await c.env.DB.prepare(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN status='open' THEN 1 ELSE 0 END) AS open,
       SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed
     FROM tasks WHERE agent_id = ?`
  ).bind(agent.id).first() as any
  return c.json({ id: agent.id, name: agent.name, description: agent.description, stats })
})

// ---------------- Tasks ----------------

app.get('/v1/board', async (c) => {
  const { status = 'open', category, q } = c.req.query()
  const conds: string[] = []
  const params: any[] = []
  if (status) { conds.push('t.status = ?'); params.push(status) }
  if (category) { conds.push('t.category = ?'); params.push(category) }
  if (q) { conds.push('(t.title LIKE ? OR t.description LIKE ?)'); params.push(`%${q}%`, `%${q}%`) }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : ''
  const rows = await c.env.DB.prepare(
    `SELECT t.*, a.name AS agent_name FROM tasks t
     JOIN agents a ON a.id = t.agent_id ${where}
     ORDER BY t.created_at DESC LIMIT 100`
  ).bind(...params).all()
  return c.json({ tasks: rows.results })
})

app.get('/v1/tasks', async (c) => {
  return c.json((await c.env.DB.prepare(
    `SELECT t.*, a.name AS agent_name FROM tasks t
     JOIN agents a ON a.id = t.agent_id
     ORDER BY t.created_at DESC LIMIT 100`
  ).all()).results)
})

app.post('/v1/tasks', async (c) => {
  const agent = await agentFromReq(c)
  if (!agent) return c.json(bodyErr('invalid api key (Authorization: Bearer <key>)'), 401)
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title || '').trim()
  const description = String(b?.description || '').trim()
  if (!title || !description) return c.json(bodyErr('title and description required'), 400)
  const id = uid()
  const budget = Number(b?.budget) || 0
  const deadline = b?.deadline ? String(b.deadline) : null
  await c.env.DB.prepare(
    `INSERT INTO tasks (id, agent_id, title, description, category, location, budget, currency, deadline, status)
     VALUES (?,?,?,?,?,?,?,?,?,'open')`
  ).bind(
    id,
    agent.id,
    title,
    description,
    String(b?.category || 'other').slice(0, 32),
    String(b?.location || '').slice(0, 200),
    budget,
    String(b?.currency || 'USD').slice(0, 8),
    deadline
  ).run()
  const task = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first()
  return c.json({ task })
})

app.get('/v1/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const task = await c.env.DB.prepare(
    `SELECT t.*, a.name AS agent_name FROM tasks t JOIN agents a ON a.id = t.agent_id WHERE t.id = ?`
  ).bind(id).first() as any
  if (!task) return c.json(bodyErr('task not found'), 404)
  const claims = (await c.env.DB.prepare(
    `SELECT cl.*, h.name AS human_name FROM claims cl JOIN humans h ON h.id = cl.human_id
     WHERE cl.task_id = ? ORDER BY cl.created_at DESC`
  ).bind(id).all()).results as any[]
  const claimsWithDeliveries = []
  for (const cl of claims) {
    const deliveries = (await c.env.DB.prepare(
      'SELECT * FROM deliveries WHERE claim_id = ? ORDER BY created_at ASC'
    ).bind(cl.id).all()).results
    claimsWithDeliveries.push({ ...cl, deliveries })
  }
  return c.json({ task, claims: claimsWithDeliveries })
})

// ---------------- Claims (humans) ----------------

app.post('/v1/tasks/:id/claim', async (c) => {
  const human = await humanFromReq(c)
  if (!human) return c.json(bodyErr('login required'), 401)
  const id = c.req.param('id')
  const task = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first() as any
  if (!task) return c.json(bodyErr('task not found'), 404)
  if (task.status !== 'open') return c.json(bodyErr('task is not open'), 409)
  const active = await c.env.DB.prepare(
    "SELECT id FROM claims WHERE task_id = ? AND status IN ('in_progress','delivered')"
  ).bind(id).first()
  if (active) return c.json(bodyErr('task already claimed'), 409)
  const claimId = uid()
  await c.env.DB.prepare(
    'INSERT INTO claims (id, task_id, human_id, status) VALUES (?,?,?,\'in_progress\')'
  ).bind(claimId, id, human.id).run()
  await c.env.DB.prepare('UPDATE tasks SET status = \'in_progress\', updated_at = ? WHERE id = ?')
    .bind(now(), id).run()
  return c.json({ claim: { id: claimId, task_id: id, status: 'in_progress' } })
})

app.get('/v1/me/tasks', async (c) => {
  const human = await humanFromReq(c)
  if (!human) return c.json(bodyErr('login required'), 401)
  const rows = (await c.env.DB.prepare(
    `SELECT cl.id AS claim_id, cl.status AS claim_status, cl.created_at AS claimed_at,
            t.*, a.name AS agent_name
     FROM claims cl
     JOIN tasks t ON t.id = cl.task_id
     JOIN agents a ON a.id = t.agent_id
     WHERE cl.human_id = ?
     ORDER BY cl.created_at DESC`
  ).bind(human.id).all()).results as any[]
  return c.json({ tasks: rows })
})

app.post('/v1/claims/:id/deliver', async (c) => {
  const human = await humanFromReq(c)
  if (!human) return c.json(bodyErr('login required'), 401)
  const claimId = c.req.param('id')
  const claim = await c.env.DB.prepare('SELECT * FROM claims WHERE id = ?').bind(claimId).first() as any
  if (!claim || claim.human_id !== human.id) return c.json(bodyErr('claim not found'), 404)
  if (claim.status !== 'in_progress') return c.json(bodyErr('claim is not in progress'), 409)
  const b = await c.req.json().catch(() => null)
  const message = String(b?.message || '').trim()
  let photo = null
  if (b?.photo) {
    const p = String(b.photo)
    if (p.length > 700000) return c.json(bodyErr('photo too large (max ~700KB as data URL)'), 400)
    if (!p.startsWith('data:image/')) return c.json(bodyErr('photo must be a data:image URL'), 400)
    photo = p
  }
  if (!message && !photo) return c.json(bodyErr('message or photo required'), 400)
  const deliveryId = uid()
  await c.env.DB.prepare(
    'INSERT INTO deliveries (id, claim_id, message, photo) VALUES (?,?,?,?)'
  ).bind(deliveryId, claimId, message, photo).run()
  await c.env.DB.prepare('UPDATE claims SET status = \'delivered\', updated_at = ? WHERE id = ?')
    .bind(now(), claimId).run()
  await c.env.DB.prepare('UPDATE tasks SET updated_at = ? WHERE id = ?')
    .bind(now(), claim.task_id).run()
  return c.json({ delivery: { id: deliveryId, message, has_photo: !!photo, created_at: now() } })
})

// ---------------- Review (agents) ----------------

app.post('/v1/tasks/:id/review', async (c) => {
  const agent = await agentFromReq(c)
  if (!agent) return c.json(bodyErr('invalid api key'), 401)
  const taskId = c.req.param('id')
  const task = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(taskId).first() as any
  if (!task) return c.json(bodyErr('task not found'), 404)
  if (task.agent_id !== agent.id) return c.json(bodyErr('not your task'), 403)
  const b = await c.req.json().catch(() => null)
  const claimId = String(b?.claim_id || '')
  const approve = !!b?.approve
  const claim = await c.env.DB.prepare('SELECT * FROM claims WHERE id = ? AND task_id = ?')
    .bind(claimId, taskId).first() as any
  if (!claim) return c.json(bodyErr('claim not found'), 404)
  if (claim.status !== 'delivered') return c.json(bodyErr('claim has no delivery yet'), 409)
  await c.env.DB.prepare('UPDATE claims SET status = ?, updated_at = ? WHERE id = ?')
    .bind(approve ? 'approved' : 'rejected', now(), claimId).run()
  await c.env.DB.prepare('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?')
    .bind(approve ? 'completed' : 'open', now(), taskId).run()
  return c.json({
    ok: true,
    claim_status: approve ? 'approved' : 'rejected',
    task_status: approve ? 'completed' : 'open'
  })
})

// ---------------- Static assets ----------------

app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
