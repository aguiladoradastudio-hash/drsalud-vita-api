// ============================================================
// DR SALUD IA — Carga de PROSPECTOS de medicamentos desde CIMA (AEMPS).
// Recorre la API oficial de CIMA, toma los medicamentos COMERCIALIZADOS,
// descarga el PROSPECTO (texto para pacientes) y lo envia a /ingest.
//
// Uso (consola del servicio vita-api):
//   node ingest-cima.js
// Variables: INGEST_TOKEN (ya configurada). Opcional: CIMA_MAX (limite de medicamentos para pruebas).
// Reanudable: guarda los nregistro ya hechos en /tmp/cima-done.txt
// Fuente: AEMPS — CIMA. Reutilizacion de informacion del sector publico, con atribucion.
// ============================================================
import fs from 'fs'

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
const MAX = parseInt(process.env.CIMA_MAX || '0', 10) // 0 = sin limite
const DONE_FILE = '/tmp/cima-done.txt'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const strip = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#?\w+;/g, ' ')
  .replace(/\s+/g, ' ').trim()

// set de ya procesados (reanudar)
let done = new Set()
try { done = new Set(fs.readFileSync(DONE_FILE, 'utf8').split('\n').filter(Boolean)) } catch {}
const markDone = (nreg) => { try { fs.appendFileSync(DONE_FILE, nreg + '\n') } catch {} done.add(nreg) }

async function getJson(url) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url); if (r.ok) return await r.json() } catch {}
    await sleep(800)
  }
  return null
}

async function main() {
  const first = await getJson('https://cima.aemps.es/cima/rest/medicamentos?pagina=1')
  if (!first) { console.error('No pude leer CIMA'); process.exit(1) }
  const total = first.totalFilas || 0
  const size = first.tamanioPagina || 200
  const pages = Math.ceil(total / size)
  console.log(`CIMA: ${total} medicamentos, ${pages} paginas. Ya hechos: ${done.size}`)

  let enviados = 0, fragmentos = 0, saltados = 0
  for (let pg = 1; pg <= pages; pg++) {
    const data = pg === 1 ? first : await getJson('https://cima.aemps.es/cima/rest/medicamentos?pagina=' + pg)
    const items = (data && data.resultados) || []
    for (const m of items) {
      if (MAX && enviados >= MAX) { console.log('Limite CIMA_MAX alcanzado'); finish(enviados, fragmentos, saltados); return }
      const nreg = String(m.nregistro || '')
      if (!nreg || done.has(nreg)) { saltados++; continue }
      if (m.comerc !== true) { markDone(nreg); saltados++; continue } // solo comercializados
      const doc = (m.docs || []).find((d) => d.tipo === 2 && d.urlHtml) // 2 = prospecto
      if (!doc) { markDone(nreg); saltados++; continue }
      let html = null
      try { const r = await fetch(doc.urlHtml); if (r.ok) html = await r.text() } catch {}
      const text = html ? strip(html) : ''
      if (text.length < 200) { markDone(nreg); saltados++; continue }
      try {
        const r = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
          body: JSON.stringify({
            name: 'AEMPS · Prospecto — ' + (m.nombre || nreg),
            url: doc.urlHtml,
            publisher: 'AEMPS · CIMA',
            license: 'reutilizacion sector publico (AEMPS)',
            lang: 'es', topic: 'medicamentos', text
          })
        })
        const j = await r.json()
        if (j.ok) { enviados++; fragmentos += (j.fragmentos || 0); markDone(nreg) }
        else saltados++
      } catch { saltados++ }
      if (enviados % 50 === 0 && enviados) console.log(`   …${enviados} prospectos (${fragmentos} fragmentos) | pagina ${pg}/${pages}`)
      await sleep(150)
    }
  }
  finish(enviados, fragmentos, saltados)
}
function finish(e, f, s) { console.log(`LISTO CIMA ✅ prospectos: ${e} | fragmentos: ${f} | saltados: ${s}`) }
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
