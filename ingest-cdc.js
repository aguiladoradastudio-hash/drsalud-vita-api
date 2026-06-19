// ============================================================
// DR SALUD IA — Carga curada de CDC en español (dominio público, EE. UU.).
// Lista fija de URLs de alto valor (viajero, infantil, comun). El script
// descarga cada pagina, extrae el cuerpo y lo envia a /ingest. Ignora 404.
//   node ingest-cdc.js
// Variables: INGEST_TOKEN. Reanudable: /tmp/cdc-done.txt
// Fuente: CDC (HHS, EE. UU.) — dominio publico, con atribucion.
// ============================================================
import fs from 'fs'

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
const DONE_FILE = '/tmp/cdc-done.txt'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

// URLs verificadas (CDC reorganiza su web; las que no existan se ignoran solas).
const URLS = [
  'https://www.cdc.gov/measles/es/about/acerca-del-sarampion.html',
  'https://www.cdc.gov/dengue/es/about/acerca-del-dengue.html',
  'https://www.cdc.gov/flu/es/testing/diagnostico-de-la-influenza.html',
  'https://www.cdc.gov/norovirus/es/prevention/como-prevenir-los-norovirus.html',
  'https://www.cdc.gov/birth-defects/es/about/sobre-los-defectos-de-nacimiento.html',
  'https://www.cdc.gov/cancer/es/index.html',
  'https://www.cdc.gov/asthma/es/living-with/vivir-con-asma.html',
  'https://www.cdc.gov/diabetes/es/diabetes-testing/deteccion-de-la-diabetes-tipo-1.html',
  'https://www.cdc.gov/nutrition/es/features/consejos-para-una-alimentacion-saludable.html',
  'https://www.cdc.gov/floods/es/about/las-inundaciones-y-su-seguridad.html',
  'https://www.cdc.gov/long-covid/es/talking-to-doctor/como-hablar-con-su-medico-sobre-el-covid-19-persistente.html'
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const toText = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#?\w+;/g, ' ')
  .replace(/\s+/g, ' ').trim()

function bodyOf(html) {
  let t = toText(html)
  // quitar pie de pagina
  for (const m of ['Comun', 'HHS.gov', 'Acerca de los CDC Los CDC']) {
    const i = t.indexOf(m); if (i > 400) { t = t.slice(0, i); break }
  }
  // quitar cabecera/menu comun (corta tras el indice A-Z si aparece)
  const h = t.lastIndexOf('ndice de la A a la Z')
  if (h >= 0 && h < t.length * 0.5) t = t.slice(h + 'ndice de la A a la Z'.length)
  return t.trim()
}
function titleOf(html, url) {
  const h = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const t = h ? toText(h[1]) : ''
  if (t && t.length > 1) return t
  const seg = url.split('/').pop().replace('.html', '').replace(/-/g, ' ')
  return seg
}

let done = new Set()
try { done = new Set(fs.readFileSync(DONE_FILE, 'utf8').split('\n').filter(Boolean)) } catch {}
const markDone = (u) => { try { fs.appendFileSync(DONE_FILE, u + '\n') } catch {} done.add(u) }

async function main() {
  console.log('CDC: urls en lista:', URLS.length, '| ya hechas:', done.size)
  let ok = 0, frag = 0, saltados = 0
  for (const url of URLS) {
    if (done.has(url)) { saltados++; continue }
    let html = null
    try { const r = await fetch(url); if (r.ok) html = await r.text() } catch {}
    if (!html) { console.log('  · 404/no disponible:', url); saltados++; continue }
    const text = bodyOf(html)
    if (text.length < 200) { console.log('  · texto corto, saltado:', url); markDone(url); saltados++; continue }
    const title = titleOf(html, url)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({ name: 'CDC · ' + title, url, publisher: 'CDC (HHS, EE. UU.)', license: 'dominio publico', lang: 'es', topic: 'cdc', text })
      })
      const j = await r.json()
      if (j.ok && (j.fragmentos || 0) > 0) { ok++; frag += j.fragmentos; markDone(url); console.log('  OK:', title) }
      else saltados++
    } catch { saltados++ }
    await sleep(200)
  }
  console.log(`LISTO CDC ✅ notas: ${ok} | fragmentos: ${frag} | saltados: ${saltados}`)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
