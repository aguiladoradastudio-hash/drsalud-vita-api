// ============================================================
// DR SALUD IA — Carga masiva de MedlinePlus en ESPAÑOL a la biblioteca.
// Descarga el XML diario de MedlinePlus, extrae los temas en español
// (título, url, resumen) y los envía a /ingest (que hace embedding + guardado).
//
// Uso (en la consola del servicio vita-api):
//   node ingest-medlineplus.js
// Requiere la variable de entorno INGEST_TOKEN (ya configurada en el servicio).
// Fuente: MedlinePlus (NLM) — dominio público, con atribución.
// ============================================================
const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function stripHtml(s) {
  return s
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ').trim()
}
function attr(block, name) {
  const m = block.match(new RegExp(name + '="([^"]*)"'))
  return m ? m[1].replace(/&amp;/g, '&') : ''
}

async function main() {
  console.log('1) Buscando el XML más reciente de MedlinePlus…')
  const idx = await (await fetch('https://medlineplus.gov/xml.html')).text()
  const m = idx.match(/mplus_topics_\d{4}-\d{2}-\d{2}\.xml/)
  if (!m) { console.error('No encontré el archivo XML'); process.exit(1) }
  const xmlUrl = 'https://medlineplus.gov/xml/' + m[0]
  console.log('   ->', xmlUrl)

  console.log('2) Descargando XML (~29 MB)…')
  const xml = await (await fetch(xmlUrl)).text()
  console.log('   descargado:', (xml.length / 1048576).toFixed(1), 'MB')

  const blocks = xml.split('<health-topic ').slice(1)
  console.log('3) Temas totales:', blocks.length, '— filtrando español…')

  let enviados = 0, fragmentos = 0, saltados = 0, n = 0
  for (const b of blocks) {
    n++
    const head = b.slice(0, 600) // atributos del <health-topic ...>
    if (!/language="Spanish"/.test(head)) continue
    const title = attr(head, 'title')
    const url = attr(head, 'url')
    const sm = b.match(/<full-summary>([\s\S]*?)<\/full-summary>/)
    const text = sm ? stripHtml(sm[1]) : ''
    if (!title || !url || text.length < 80) { saltados++; continue }
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({
          name: 'MedlinePlus · ' + title,
          url, publisher: 'MedlinePlus (NLM)', license: 'dominio público (NLM)',
          lang: 'es', topic: 'general', text
        })
      })
      const j = await r.json()
      if (j.ok) { enviados++; fragmentos += (j.fragmentos || 0) }
      else saltados++
    } catch (e) { saltados++ }
    if (enviados % 25 === 0 && enviados) console.log(`   …${enviados} temas cargados (${fragmentos} fragmentos)`)
    await sleep(120) // suave con la API de embeddings
  }
  console.log('LISTO ✅  Temas cargados:', enviados, '| fragmentos:', fragmentos, '| saltados:', saltados)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
