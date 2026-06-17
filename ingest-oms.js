// ============================================================
// DR SALUD IA — Carga de NOTAS DESCRIPTIVAS de la OMS en espanol.
// Descubre TODAS las fichas del indice de la OMS, descarga cada una,
// extrae el cuerpo del articulo y lo envia a /ingest.
//
// Uso (consola del servicio vita-api):  node ingest-oms.js
// Variable: INGEST_TOKEN (ya configurada). Opcional: OMS_MAX (limite para pruebas).
// Reanudable: guarda urls ya hechas en /tmp/oms-done.txt
// Fuente: OMS (WHO). Licencia CC BY-NC-SA 3.0 IGO — uso con atribucion, NO comercial.
// ============================================================
import fs from 'fs'

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
const MAX = parseInt(process.env.OMS_MAX || '0', 10)
const DONE_FILE = '/tmp/oms-done.txt'
const INDEX = 'https://www.who.int/es/news-room/fact-sheets'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const toText = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#?\w+;/g, ' ')
  .replace(/\s+/g, ' ').trim()

// Aisla el cuerpo del articulo quitando el mega-menu (antes) y el pie (despues)
function bodyOf(html) {
  let t = toText(html)
  const a = t.lastIndexOf('Consejo Ejecutivo')          // fin del mega-menu superior
  if (a >= 0) t = t.slice(a + 'Consejo Ejecutivo'.length)
  const b = t.indexOf('Oficinas regionales de la OMS')   // inicio del pie
  if (b >= 0) t = t.slice(0, b)
  const d = t.indexOf('Destacado')                       // bloque de enlaces relacionados
  if (d > 300) t = t.slice(0, d)
  return t.trim()
}

let done = new Set()
try { done = new Set(fs.readFileSync(DONE_FILE, 'utf8').split('\n').filter(Boolean)) } catch {}
const markDone = (u) => { try { fs.appendFileSync(DONE_FILE, u + '\n') } catch {} done.add(u) }

async function main() {
  console.log('OMS: descargando indice...')
  const idx = await (await fetch(INDEX)).text()
  // titulos + url:  <a href="...detail/slug">Titulo</a>
  const re = /href="(https:\/\/www\.who\.int\/es\/news-room\/fact-sheets\/detail\/[^"]+)"[^>]*>([^<]{2,})<\/a>/g
  const map = new Map()
  let m
  while ((m = re.exec(idx)) !== null) {
    const url = m[1]
    const title = m[2].replace(/&amp;/g, '&').replace(/‎/g, '').trim()
    if (!map.has(url)) map.set(url, title)
  }
  const items = [...map.entries()]
  console.log('OMS: fichas encontradas:', items.length, '| ya hechas:', done.size)

  let enviados = 0, fragmentos = 0, saltados = 0
  for (const [url, title] of items) {
    if (MAX && enviados >= MAX) { console.log('Limite OMS_MAX alcanzado'); break }
    if (done.has(url)) { saltados++; continue }
    let html = null
    try { const r = await fetch(url); if (r.ok) html = await r.text() } catch {}
    const text = html ? bodyOf(html) : ''
    if (text.length < 200) { markDone(url); saltados++; continue }
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({
          name: 'OMS · ' + (title || 'Nota descriptiva'),
          url, publisher: 'OMS (WHO)', license: 'CC BY-NC-SA 3.0 IGO',
          lang: 'es', topic: 'oms', text
        })
      })
      const j = await r.json()
      if (j.ok) { enviados++; fragmentos += (j.fragmentos || 0); markDone(url) }
      else saltados++
    } catch { saltados++ }
    if (enviados % 20 === 0 && enviados) console.log(`   …${enviados} notas (${fragmentos} fragmentos)`)
    await sleep(200)
  }
  console.log(`LISTO OMS ✅ notas: ${enviados} | fragmentos: ${fragmentos} | saltados: ${saltados}`)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
