// ============================================================
// DR SALUD IA — Carga de NOTAS DESCRIPTIVAS de la OMS en espanol.
// Lista fija de fichas (el indice de la OMS se renderiza por JS y no es
// descubrible por fetch directo). Cada pagina de detalle SI es server-rendered.
//
// Uso (consola del servicio vita-api):  node ingest-oms.js
// Variable: INGEST_TOKEN. Opcional: OMS_MAX (limite para pruebas).
// Reanudable: /tmp/oms-done.txt
// Fuente: OMS (WHO). Licencia CC BY-NC-SA 3.0 IGO — uso con atribucion, NO comercial.
// ============================================================
import fs from 'fs'

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
const MAX = parseInt(process.env.OMS_MAX || '0', 10)
const DONE_FILE = '/tmp/oms-done.txt'
const BASE = 'https://www.who.int/es/news-room/fact-sheets/detail/'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

const SLUGS = [
'abortion','stroke','physical-activity','food-additives','post-covid-19-condition-(long-covid)','drinking-water','drowning','alcohol','health-literacy','infant-and-young-child-feeding','healthy-diet','asbestos','anaemia','sickle-cell-disease','emergency-contraception','oral-contraceptives','arsenic','rheumatoid-arthritis','osteoarthritis','asthma','nursing-and-midwifery','primary-health-care','autism-spectrum-disorders','sugars-and-dental-caries','biodiversity','botulism','brucellosis','falls','climate-change-heat-and-health','climate-change-and-health','campylobacter','cancer','colorectal-cancer','breast-cancer','lung-cancer','cancer-in-children','candidiasis-(yeast-infection)','rheumatic-heart-disease','corporal-punishment-and-health','chikungunya','chlamydia','immunization-coverage','universal-health-coverage-(uhc)','cholera','ambient-(outdoor)-air-quality-and-health','household-air-pollution-and-health','middle-east-respiratory-syndrome-coronavirus-(mers-cov)','chromoblastomycosis','palliative-care','dementia','dengue-and-severe-dengue','human-rights-and-health','health-care-waste','electronic-waste-(e-waste)','social-determinants-of-health','diabetes','diphtheria','dioxins-and-their-effects-on-human-health','disability-and-health','blindness-and-visual-impairment','blood-safety-and-availability','intrauterine-devices','dracunculiasis-(guinea-worm-disease)','e-coli','comprehensive-sexuality-education','ionizing-radiation-and-health-effects','el-nino-southern-oscillation-(enso)','radon-and-health','adolescent-pregnancy','japanese-encephalitis','endometriosis','chagas-disease-(american-trypanosomiasis)','parkinson-disease','coronavirus-disease-(covid-19)','marburg-virus-disease','ebola-disease','oropouche-virus-disease','chronic-obstructive-pulmonary-disease-(copd)','kidney-disease','cardiovascular-diseases-(cvds)','diarrhoeal-disease','noncommunicable-diseases','vector-borne-diseases','ageing-and-health','snakebite-envenoming','epilepsy','echinococcosis','multiple-sclerosis','sporotrichosis','schistosomiasis','schizophrenia','infertility','group-b-streptococcus-(gbs)','hiv-drug-resistance','yellow-fever','lassa-fever','rift-valley-fever','crimean-congo-haemorrhagic-fever','lymphatic-filariasis','white-phosphorus','fragility-fractures','gender','soil-transmitted-helminth-infections','gonorrhoea-(neisseria-gonorrhoeae-infection)','multi-drug-resistant-gonorrhoea','trans-fat','influenza-(seasonal)','influenza-(avian-and-other-zoonotic)','hantavirus','hepatitis-a','hepatitis-b','hepatitis-c','hepatitis-d','hepatitis-e','shingles-(herpes-zoster)','hypertension','deliberate-events','west-nile-virus','sexually-transmitted-infections-(stis)','food-safety','lead-poisoning-and-health','gambling','electricity-in-health-care-facilities','adolescents-health-risks-and-solutions','adolescent-mental-health','mental-health-at-work','mental-health-in-emergencies','the-top-10-causes-of-death','legionellosis','leishmaniasis','leprosy','spinal-cord-injury','listeriosis','low-back-pain','malnutrition','abuse-of-older-people','child-maltreatment','essential-medicines','children-reducing-mortality','newborns-reducing-mortality','meningitis','menopause','mercury-and-health','mycetoma','mycotoxins','headache-disorders','animal-bites','maternal-mortality','newborn-mortality','female-genital-mutilation','preterm-birth','pneumonia','noma','children-new-threats-to-health','obesity-and-overweight','millennium-development-goals-(mdgs)','onchocerciasis','cervical-cancer','malaria','human-papilloma-virus-and-cancer','plague','yaws','family-planning-contraception','podoconiosis-(non-filarial-lymphoedema)','poliomyelitis','prequalification-of-medicines-by-who','pre-eclampsia','condoms','substandard-and-falsified-medical-products','burns','rabies','sodium-reduction','civil-registration-and-vital-statistics','rehabilitation','pesticide-residues-in-food','antibiotic-resistance','antimicrobial-resistance','rubella','salmonella-(non-typhoidal)','oral-health','women-s-health','refugee-and-migrant-health','mental-health-strengthening-our-response','mental-health-of-older-adults','refugee-and-migrant-mental-health','occupational-health--health-workers','urban-health','sanitation','measles','scabies','patient-safety','community-based-health-insurance-CBHI','sepsis','quality-health-services','syphilis','guillain-barré-syndrome','polycystic-ovary-syndrome','opioid-overdose','deafness-and-hearing-loss','suicide','typhoid','tobacco','assistive-technology','taeniasis-cysticercosis','tetanus','ringworm-(tinea)','sand-and-dust-storms','trachoma','bipolar-disorder','post-traumatic-stress-disorder','depression','birth-defects','anxiety-disorders','mental-disorders','musculoskeletal-conditions','road-traffic-injuries','foodborne-trematode-infections','trichomoniasis','trypanosomiasis-human-african-(sleeping-sickness)','tuberculosis','tungiasis','ultraviolet-radiation','one-health','bacterial-vaginosis','hiv-aids','violence-against-women','violence-against-children','youth-violence','mpox','nipah-virus','zika-virus','herpes-simplex-virus','human-t-lymphotropic-virus-type-1','respiratory-syncytial-virus-(rsv)','zoonoses','buruli-ulcer-(mycobacterium-ulcerans-infection)'
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
  const a = t.lastIndexOf('Consejo Ejecutivo')
  if (a >= 0) t = t.slice(a + 'Consejo Ejecutivo'.length)
  const b = t.indexOf('Oficinas regionales de la OMS')
  if (b >= 0) t = t.slice(0, b)
  const d = t.indexOf('Destacado')
  if (d > 300) t = t.slice(0, d)
  return t.trim()
}
function titleOf(html, slug) {
  const h = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const t = h ? toText(h[1]) : ''
  return t && t.length > 1 ? t : slug.replace(/-/g, ' ')
}

let done = new Set()
try { done = new Set(fs.readFileSync(DONE_FILE, 'utf8').split('\n').filter(Boolean)) } catch {}
const markDone = (u) => { try { fs.appendFileSync(DONE_FILE, u + '\n') } catch {} done.add(u) }

async function main() {
  console.log('OMS: fichas en lista:', SLUGS.length, '| ya hechas:', done.size)
  let enviados = 0, fragmentos = 0, saltados = 0
  for (const slug of SLUGS) {
    if (MAX && enviados >= MAX) { console.log('Limite OMS_MAX alcanzado'); break }
    const url = BASE + slug
    if (done.has(url)) { saltados++; continue }
    let html = null
    try { const r = await fetch(url); if (r.ok) html = await r.text() } catch {}
    const text = html ? bodyOf(html) : ''
    if (text.length < 200) { saltados++; continue }
    const title = titleOf(html, slug)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({
          name: 'OMS · ' + title, url,
          publisher: 'OMS (WHO)', license: 'CC BY-NC-SA 3.0 IGO',
          lang: 'es', topic: 'oms', text
        })
      })
      const j = await r.json()
      if (j.ok && (j.fragmentos || 0) > 0) { enviados++; fragmentos += j.fragmentos; markDone(url) }
      else saltados++
    } catch { saltados++ }
    if (enviados % 20 === 0 && enviados) console.log(`   …${enviados} notas (${fragmentos} fragmentos)`)
    await sleep(200)
  }
  console.log(`LISTO OMS ✅ notas: ${enviados} | fragmentos: ${fragmentos} | saltados: ${saltados}`)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
