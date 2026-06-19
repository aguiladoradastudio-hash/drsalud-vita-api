// ============================================================
// DR SALUD IA — Calendario común de vacunación e inmunización 2026 (España).
// Fuente: Ministerio de Sanidad — Consejo Interterritorial del SNS (12-dic-2025).
// PDF oficial: CalendarioVacunacion_Todalavida.pdf
// Contenido curado y troceado por bloques tematicos. Ejecutar:
//   node ingest-vacunas.js
// Variables: INGEST_TOKEN (ya configurada). Reanudable por url unico.
// ============================================================

const FUENTE = 'https://www.sanidad.gob.es/areas/promocionPrevencion/vacunaciones/calendario/docs/CalendarioVacunacion_Todalavida.pdf'

const DOCS = [
  {
    titulo: 'Calendario de vacunación 2026 (España): resumen general',
    url: 'sanidad:calendario-vacunas-2026-general',
    texto: `Calendario común de vacunación e inmunización a lo largo de toda la vida en España. Calendario recomendado para el año 2026, aprobado por el Consejo Interterritorial del Sistema Nacional de Salud el 12 de diciembre de 2025. Es el documento oficial del Ministerio de Sanidad que indica qué vacunas se recomienda administrar a toda la población en función de la edad, desde la etapa prenatal hasta las personas mayores de 65 años.

El calendario distingue entre administración sistemática (la que se ofrece de forma rutinaria a toda la población según la edad) y administración en personas susceptibles o no vacunadas con anterioridad (vacunación de rescate o puesta al día).

Las edades de referencia del calendario son: prenatal, 0 meses, 2 meses, 4 meses, 6 meses, 11 meses, 12 meses, 15 meses, 3-4 años, 5 años, 6 años, 12 años, 14 años, 15-18 años, 19-64 años y 65 años o más. La edad puede variar ligeramente en los programas que se implementan en centros escolares.

Las enfermedades incluidas en el calendario 2026 son: poliomielitis; difteria, tétanos y tosferina; Haemophilus influenzae b; hepatitis B; enfermedad neumocócica; rotavirus; enfermedad meningocócica; sarampión, rubeola y parotiditis (triple vírica); varicela; virus del papiloma humano; herpes zóster; gripe; COVID-19; y virus respiratorio sincitial. Esta información es educativa; el calendario y las pautas concretas las indica y administra tu centro de salud.`
  },
  {
    titulo: 'Vacunación infantil 2026 (España): primeros meses y primera infancia',
    url: 'sanidad:calendario-vacunas-2026-infantil',
    texto: `Pauta de vacunación infantil del calendario español 2026 en los primeros meses y la primera infancia.

A los 2, 4 y 11 meses se administra la vacuna combinada frente a difteria, tétanos, tosferina, poliomielitis, Haemophilus influenzae b y hepatitis B (DTPa/VPI/Hib/HB). Es importante que la vacuna se administre en tiempo a los 2, 4 y 11 meses de edad.

Enfermedad neumocócica: la primovacunación infantil con vacuna neumocócica conjugada (VNC) se realiza a partir de los 2 meses, con pauta según la ficha técnica de la vacuna utilizada.

Rotavirus: la vacunación frente a rotavirus se administra en lactantes a partir de las 6 semanas de vida, con pauta según ficha técnica.

Enfermedad meningocócica: se administra MenB a los 2 meses, y MenB y MenC a los 4 y 12 meses. A los 2 y 4 meses es muy importante que la vacuna se administre en tiempo.

Sarampión, rubeola y parotiditis (triple vírica, TV): se administra a los 12 y 15 meses.

Varicela (VVZ): se administra a los 15 meses y a los 3-4 años.

A los 6 años se administra vacuna combinada DTPa/VPI a los menores vacunados a los 2, 4 y 11 meses. Los menores que recibieron la pauta de 2, 4, 6 y 18 meses (4 dosis) recibirán dTpa sin VPI a los 6 años. Esta información es educativa; las pautas concretas las indica tu centro de salud.`
  },
  {
    titulo: 'Vacunación en adolescentes 2026 (España)',
    url: 'sanidad:calendario-vacunas-2026-adolescentes',
    texto: `Vacunación de adolescentes en el calendario español 2026.

Enfermedad meningocócica (MenACWY): a los 12 años se administra 1 dosis a los adolescentes que no hayan recibido una dosis de MenACWY a partir de los 10 años. Entre los 12 y los 18 años se realiza la captación y vacunación de los adolescentes no vacunados.

Virus del papiloma humano (VPH): a los 12 años se administra 1 dosis a niños y niñas. Entre los 12 y los 18 años (incluidos) se realiza la captación de las personas no vacunadas con pauta de 1 dosis; esta captación se podrá realizar progresivamente en hombres.

Varicela: en adolescentes que no refieran antecedentes de haber pasado la enfermedad y no se hayan vacunado, se administran 2 dosis separadas por un intervalo mínimo de 4 semanas (preferiblemente 8 semanas), o se completa la pauta si se recibió una sola dosis con anterioridad.

Difteria, tétanos, tosferina: a los 14 años se administra Td. Esta información es educativa; las pautas concretas las indica tu centro de salud.`
  },
  {
    titulo: 'Vacunación en personas adultas 2026 (España)',
    url: 'sanidad:calendario-vacunas-2026-adultos',
    texto: `Vacunación de personas adultas en el calendario español 2026.

Difteria y tétanos (Td): conviene verificar el estado de vacunación previo antes de iniciar o completar una pauta de primovacunación con Td en personas adultas. Se aprovechará el contacto con los servicios sanitarios para revisar el estado de vacunación y, en caso necesario, se vacunará con Td hasta completar 5 dosis. Se administra una dosis de Td en torno a los 65 años a las personas que recibieron 5 dosis durante la infancia y la adolescencia.

Sarampión, rubeola y parotiditis (triple vírica): se recomienda la vacunación en personas sin vacunación documentada nacidas en España a partir de 1978. En caso necesario se administran 2 dosis con un intervalo mínimo de 4 semanas. Está contraindicada en embarazadas y personas inmunodeprimidas.

Varicela: en personas adultas sin evidencia de inmunidad se realiza determinación serológica (IgG); si es negativa, se vacuna hasta completar 2 dosis. Está contraindicada en embarazadas y personas inmunodeprimidas.

Herpes zóster: se recomienda la vacunación de la población a los 65 años, con 2 dosis separadas por un intervalo mínimo de 8 semanas. Además, se pueden captar progresivamente cohortes entre 66 y 80 años, empezando por quienes cumplen 80 años.

Enfermedad neumocócica: se recomienda la vacunación frente a neumococo a partir de los 65 años. Esta información es educativa; las pautas concretas las indica tu centro de salud.`
  },
  {
    titulo: 'Vacunación en el embarazo (prenatal) 2026 (España)',
    url: 'sanidad:calendario-vacunas-2026-embarazo',
    texto: `Vacunación durante el embarazo según el calendario español 2026.

Tosferina (dTpa): se administra 1 dosis de dTpa en cada embarazo a partir de la semana 27 de gestación, preferentemente en las semanas 27 o 28.

Gripe: en cada temporada estacional se vacuna con 1 dosis a las embarazadas en cualquier trimestre de gestación, y también a las mujeres durante el puerperio (hasta los 6 meses tras el parto y que no se hayan vacunado durante el embarazo).

COVID-19: en cada temporada estacional se vacuna a las embarazadas en cualquier trimestre de gestación.

Importante: durante el embarazo están contraindicadas las vacunas de virus vivos atenuados, como la triple vírica (sarampión, rubeola, parotiditis) y la varicela. Esta información es educativa; las pautas concretas las indica tu matrona, ginecólogo o centro de salud.`
  },
  {
    titulo: 'Hepatitis B: vacunación 2026 (España)',
    url: 'sanidad:calendario-vacunas-2026-hepatitisb',
    texto: `Vacunación frente a la hepatitis B (HB) en el calendario español 2026.

Vacunación en la infancia: se vacuna a los 2, 4 y 11 meses siempre que se asegure una alta cobertura de cribado prenatal de la embarazada. En hijos e hijas de madres con antígeno de superficie (AgHBs) positivo, y de aquellas no vacunadas en las que no se realizó cribado, se vacuna con pauta 0, 2, 4 y 11 meses; la primera dosis se administra en las primeras 24 horas de vida junto con la inmunoglobulina anti-hepatitis B.

Vacunación en adolescentes y jóvenes: en personas no vacunadas con anterioridad, hasta los 18 años de edad, se administran 3 dosis con pauta 0, 1 y 6 meses. Esta información es educativa; las pautas concretas las indica tu centro de salud.`
  },
  {
    titulo: 'Gripe, COVID-19 y virus respiratorio sincitial: inmunización 2026 (España)',
    url: 'sanidad:calendario-vacunas-2026-respiratorias',
    texto: `Inmunización frente a virus respiratorios estacionales en el calendario español 2026.

Gripe: se recomienda la vacunación con 1 dosis en cada temporada estacional en la infancia, de los 6 a los 59 meses. En personas mayores se recomienda 1 dosis durante la temporada estacional a partir de los 60 años. También se vacuna a las embarazadas en cualquier trimestre.

COVID-19: se recomienda la vacunación con 1 dosis en personas de mayor edad según la situación epidemiológica, a partir de los 70 años en la temporada 2025-2026 (la edad de la temporada 2026-2027 está por determinar). También se vacuna a las embarazadas en cualquier trimestre.

Virus respiratorio sincitial (VRS): se recomienda la inmunización de todos los nacidos entre el 1 de abril del año de comienzo de la temporada y el 31 de marzo del año siguiente. La inmunización pasiva se realiza con un anticuerpo monoclonal antes del comienzo y durante la temporada estacional de VRS en menores de 6 meses, con 1 dosis. Los nacidos durante la temporada (de octubre a marzo) deben recibir el anticuerpo monoclonal de manera muy precoz, preferiblemente en las primeras 24-48 horas tras el nacimiento. Esta información es educativa; las pautas concretas las indica tu centro de salud.`
  },
]

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

async function main() {
  const urls = DOCS.map((d) => d.url)
  if (new Set(urls).size !== urls.length) { console.error('ERROR: urls repetidas'); process.exit(1) }
  console.log('VACUNAS: documentos en lista:', DOCS.length)
  let ok = 0, frag = 0, err = 0
  for (const d of DOCS) {
    const texto = String(d.texto || '').replace(/\s+/g, ' ').trim()
    if (!d.titulo || !d.url || texto.length < 80) { console.log('SALTADO:', d.titulo); err++; continue }
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({
          name: 'Ministerio de Sanidad · ' + d.titulo,
          url: FUENTE + '#' + d.url,
          publisher: 'Ministerio de Sanidad (España)',
          license: 'uso institucional con atribucion',
          lang: 'es', topic: 'vacunas', text: texto
        })
      })
      const j = await r.json()
      if (j.ok && (j.fragmentos || 0) > 0) { ok++; frag += j.fragmentos; console.log('OK:', d.titulo, '->', j.fragmentos) }
      else { err++; console.log('NO guardado:', d.titulo, JSON.stringify(j.errores || j)) }
    } catch (e) { err++; console.log('ERROR:', d.titulo, e.message) }
  }
  console.log(`LISTO VACUNAS ✅ documentos: ${ok} | fragmentos: ${frag} | con problemas: ${err}`)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
