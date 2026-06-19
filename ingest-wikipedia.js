// ============================================================
// DR SALUD IA — Carga de artículos MÉDICOS de Wikipedia en español.
// Usa la API oficial de MediaWiki (sin JavaScript): recorre categorías
// médicas, saca los artículos y su texto plano, y los envía a /ingest.
//
// Uso (consola del servicio vita-api):  node ingest-wikipedia.js
// Variables: INGEST_TOKEN. Opcional: WIKI_MAX (limite de articulos para pruebas).
// Reanudable: /tmp/wiki-done.txt
// Fuente: Wikipedia (ES). Licencia CC BY-SA — uso con atribucion (texto educativo).
// ============================================================
import fs from 'fs'

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
const MAX = parseInt(process.env.WIKI_MAX || '0', 10) // 0 = sin limite
const DONE_FILE = '/tmp/wiki-done.txt'
const WP = 'https://es.wikipedia.org/w/api.php'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

// Categorias semilla (se recorren ellas + 1 nivel de subcategorias)
const SEED_CATS = [
  'Enfermedades', 'Síntomas', 'Signos clínicos', 'Medicina', 'Salud pública',
  'Salud', 'Enfermedades infecciosas', 'Enfermedades crónicas', 'Trastornos mentales',
  'Salud mental', 'Nutrición', 'Vacunas', 'Pediatría', 'Ginecología y obstetricia',
  'Cardiología', 'Neurología', 'Endocrinología', 'Oncología', 'Dermatología',
  'Gastroenterología', 'Enfermedades respiratorias', 'Primeros auxilios',
  'Farmacología', 'Embarazo', 'Primera infancia', 'Higiene', 'Prevención de enfermedades'
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function api(params) {
  const u = WP + '?' + new URLSearchParams({ format: 'json', maxlag: '5', ...params }).toString()
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'DrSaludIA/1.0 (educativo; info@aguilaiastudio.es)' } })
      if (r.ok) return await r.json()
      if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue }
    } catch { await sleep(1500) }
  }
  return null
}

// Recoge titulos de articulos (ns=0) de una categoria
async function pagesOfCat(cat, out) {
  let cont = null
  do {
    const p = { action: 'query', list: 'categorymembers', cmtitle: 'Categoría:' + cat, cmlimit: '500', cmtype: 'page' }
    if (cont) p.cmcontinue = cont
    const j = await api(p)
    if (!j) break
    for (const m of (j.query?.categorymembers || [])) if (m.ns === 0) out.add(m.title)
    cont = j.continue?.cmcontinue
    await sleep(120)
  } while (cont)
}
// Subcategorias (un nivel)
async function subcats(cat) {
  const res = []
  let cont = null
  do {
    const p = { action: 'query', list: 'categorymembers', cmtitle: 'Categoría:' + cat, cmlimit: '500', cmtype: 'subcat' }
    if (cont) p.cmcontinue = cont
    const j = await api(p)
    if (!j) break
    for (const m of (j.query?.categorymembers || [])) res.push(m.title.replace(/^Categoría:/, ''))
    cont = j.continue?.cmcontinue
    await sleep(120)
  } while (cont)
  return res
}

let done = new Set()
try { done = new Set(fs.readFileSync(DONE_FILE, 'utf8').split('\n').filter(Boolean)) } catch {}
const markDone = (t) => { try { fs.appendFileSync(DONE_FILE, t + '\n') } catch {} done.add(t) }

async function main() {
  console.log('WIKI: recopilando titulos de', SEED_CATS.length, 'categorias (+ subcategorias)...')
  const titles = new Set()
  for (const cat of SEED_CATS) {
    await pagesOfCat(cat, titles)
    const subs = await subcats(cat)
    for (const sc of subs.slice(0, 40)) await pagesOfCat(sc, titles)
    console.log('  · tras', cat, '->', titles.size, 'titulos')
  }
  const list = [...titles]
  console.log('WIKI: articulos unicos:', list.length, '| ya hechos:', done.size)

  let enviados = 0, fragmentos = 0, saltados = 0
  for (const title of list) {
    if (MAX && enviados >= MAX) { console.log('Limite WIKI_MAX alcanzado'); break }
    if (done.has(title)) { saltados++; continue }
    const j = await api({ action: 'query', prop: 'extracts', explaintext: '1', exsectionformat: 'plain', redirects: '1', titles: title })
    const pages = j && j.query && j.query.pages
    let text = ''
    if (pages) { const pg = Object.values(pages)[0]; text = (pg && pg.extract) ? String(pg.extract) : '' }
    text = text.replace(/\s+/g, ' ').trim()
    if (text.length < 200) { markDone(title); saltados++; continue }
    const url = 'https://es.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_'))
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({
          name: 'Wikipedia · ' + title, url,
          publisher: 'Wikipedia (ES)', license: 'CC BY-SA',
          lang: 'es', topic: 'enciclopedia', text
        })
      })
      const res = await r.json()
      if (res.ok && (res.fragmentos || 0) > 0) { enviados++; fragmentos += res.fragmentos; markDone(title) }
      else saltados++
    } catch { saltados++ }
    if (enviados % 25 === 0 && enviados) console.log(`   …${enviados} articulos (${fragmentos} fragmentos)`)
    await sleep(120)
  }
  console.log(`LISTO WIKIPEDIA ✅ articulos: ${enviados} | fragmentos: ${fragmentos} | saltados: ${saltados}`)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
