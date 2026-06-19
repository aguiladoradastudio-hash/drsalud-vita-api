// ============================================================
// DR SALUD IA — Carga de DOCUMENTOS PROPIOS de la marca.
// Pega tus textos (guias, protocolos, FAQs) en la lista DOCS y ejecuta:
//   node ingest-midoc.js
// Cada documento necesita un "url" UNICO (puede ser inventado, p. ej. "drsaludia:guia-fiebre").
// Variables: INGEST_TOKEN (ya configurada en el servicio).
// ============================================================

// 👇👇👇  EDITA SOLO ESTA LISTA. Repite el bloque { ... } para varios documentos.  👇👇👇
const DOCS = [
  {
    titulo: 'Guía para padres: la fiebre en niños',
    url: 'drsaludia:guia-fiebre-ninos',
    texto: `La fiebre es la elevación de la temperatura corporal por encima de lo normal y, en la mayoría de los casos, es una respuesta natural del cuerpo del niño frente a una infección. No es una enfermedad en sí misma, sino una señal de que el organismo está reaccionando. En general se considera fiebre a partir de 38 grados centígrados medidos correctamente. Lo más importante no es el número exacto del termómetro, sino cómo se encuentra el niño: un pequeño con fiebre que sigue jugando, bebiendo líquidos y respondiendo bien suele estar afrontando un proceso leve y autolimitado.

Qué se puede hacer en casa de forma segura: mantener al niño bien hidratado ofreciéndole líquidos con frecuencia en pequeñas cantidades, vestirlo con ropa ligera sin abrigarlo en exceso, mantener la habitación a una temperatura agradable y dejarlo descansar. Conviene observar su comportamiento general, su color, su respiración y la cantidad de orina como señal de buena hidratación. No se recomienda el uso de paños con alcohol ni baños de agua fría, porque pueden provocar malestar y escalofríos.

Cuándo acudir a urgencias o llamar a tu médico: si el niño es menor de 3 meses y tiene cualquier fiebre; si la fiebre supera los 40 grados o no baja pese a las medidas habituales; si aparece dificultad para respirar, manchas en la piel que no desaparecen al presionarlas, rigidez en el cuello, convulsiones, vómitos persistentes, somnolencia excesiva o le cuesta despertarse, llanto inconsolable, o señales de deshidratación como boca seca, ausencia de lágrimas o muy poca orina. También si la fiebre dura más de tres días o si los padres notan que el niño está claramente peor de lo habitual. Ante la duda, siempre es preferible una valoración profesional. Esta guía es información educativa y no sustituye la atención de tu pediatra.`
  },
  {
    titulo: 'Guía para padres: vómitos y diarrea en niños',
    url: 'drsaludia:guia-vomitos-diarrea',
    texto: `Los vómitos y la diarrea son muy frecuentes en la infancia y la mayoría de las veces se deben a infecciones leves del estómago e intestino que se resuelven solas en unos días. El principal riesgo en estos casos no es la infección en sí, sino la deshidratación, especialmente en bebés y niños pequeños, porque pierden líquidos con rapidez.

Qué se puede hacer en casa de forma segura: lo fundamental es reponer líquidos poco a poco. Se recomienda ofrecer pequeñas cantidades de líquido de forma muy frecuente, por ejemplo unos sorbos cada pocos minutos, en lugar de grandes cantidades de golpe que pueden provocar más vómitos. Las soluciones de rehidratación oral que se venden en farmacia están diseñadas para esto. Conviene evitar bebidas muy azucaradas. Una vez el niño tolera líquidos, se puede reintroducir la comida de forma progresiva con alimentos suaves, sin forzar. La lactancia materna debe mantenerse.

Cuándo acudir a urgencias o llamar a tu médico: si aparecen signos de deshidratación como boca y labios secos, ausencia de lágrimas al llorar, ojos hundidos, mucha menos orina de lo normal o pañales secos durante varias horas, y decaimiento marcado; si hay sangre en los vómitos o en las heces; si los vómitos son verdosos; si hay dolor abdominal intenso y continuo; si el niño está muy somnoliento o irritable y difícil de calmar; si no consigue retener ningún líquido; o si es un bebé pequeño. Ante la duda, busca valoración profesional. Esta guía es información educativa y no sustituye la atención de tu pediatra.`
  },
  {
    titulo: 'Guía para padres: golpes en la cabeza',
    url: 'drsaludia:guia-golpe-cabeza',
    texto: `Los golpes en la cabeza son muy habituales en niños, sobre todo cuando empiezan a caminar y a explorar. La gran mayoría son leves y solo provocan un chichón o un pequeño moretón sin mayores consecuencias. Aun así, conviene vigilar al niño durante las horas siguientes al golpe, porque algunos síntomas de alarma pueden aparecer más tarde.

Qué se puede hacer en casa de forma segura: aplicar frío suave sobre la zona del golpe durante unos minutos, envuelto en un paño, ayuda a reducir la hinchazón del chichón. Mantener al niño tranquilo y en reposo. Se le puede dejar dormir si lo necesita, pero conviene comprobar de vez en cuando que descansa con normalidad y que se le puede despertar sin dificultad. Observar su comportamiento, su equilibrio y si responde con normalidad a lo largo del día.

Cuándo acudir a urgencias o llamar a tu médico: si el niño pierde el conocimiento, aunque sea unos segundos; si vomita de forma repetida tras el golpe; si presenta somnolencia excesiva o cuesta despertarlo; si tiene convulsiones; si nota debilidad, dificultad para hablar, caminar o mantener el equilibrio; si las pupilas se ven de distinto tamaño; si sale sangre o líquido claro por la nariz o los oídos; si el llanto es inconsolable; o si el golpe ha sido muy fuerte, por ejemplo una caída desde una altura considerable. En bebés pequeños conviene ser especialmente prudente. Ante cualquier duda, busca valoración profesional inmediata. Esta guía es información educativa y no sustituye la atención médica.`
  },
  {
    titulo: 'Guía para padres: dificultad para respirar y tos',
    url: 'drsaludia:guia-dificultad-respirar',
    texto: `La tos y los catarros son muy frecuentes en la infancia y casi siempre se deben a infecciones respiratorias leves que mejoran solas. Sin embargo, los problemas para respirar sí requieren atención, porque la respiración es una función vital y los niños pequeños pueden empeorar con rapidez.

Qué se puede hacer en casa de forma segura: mantener al niño hidratado, con el ambiente limpio y sin humo de tabaco, que es muy irritante para las vías respiratorias. Los lavados nasales con suero fisiológico ayudan a despejar la nariz de los bebés, que respiran principalmente por ella. Mantener al niño algo incorporado puede ayudarle a estar más cómodo. Observar su respiración cuando está tranquilo: cómo respira, a qué ritmo y si lo hace con esfuerzo.

Cuándo acudir a urgencias o llamar a tu médico: si el niño respira muy deprisa o con esfuerzo evidente; si se le marcan las costillas o se le hunde la piel entre ellas o en el cuello al respirar, lo que se llama tiraje; si hace un ruido agudo al inspirar o un pitido al respirar; si los labios, la lengua o la cara se ven azulados o muy pálidos; si no puede hablar, comer o llorar con normalidad por la falta de aire; si está muy decaído o no reacciona como siempre; o si tiene fiebre alta junto con dificultad respiratoria. La dificultad para respirar es una señal de alarma que siempre justifica valoración profesional urgente. Esta guía es información educativa y no sustituye la atención médica.`
  },
]
// 👆👆👆  FIN DE LA ZONA EDITABLE  👆👆👆

const TOKEN = process.env.INGEST_TOKEN
const API = process.env.INGEST_URL || 'http://localhost:3000/ingest'
if (!TOKEN) { console.error('Falta INGEST_TOKEN'); process.exit(1) }

async function main() {
  const urls = DOCS.map((d) => d.url)
  if (new Set(urls).size !== urls.length) { console.error('ERROR: hay urls repetidas; cada doc necesita un url unico'); process.exit(1) }

  let ok = 0, frag = 0, err = 0
  for (const d of DOCS) {
    const texto = String(d.texto || '').replace(/\s+/g, ' ').trim()
    if (!d.titulo || !d.url || texto.length < 80) { console.log('SALTADO (faltan datos o texto muy corto):', d.titulo || '(sin titulo)'); err++; continue }
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ingest-token': TOKEN },
        body: JSON.stringify({
          name: 'Aguila IA Studio · ' + d.titulo,
          url: d.url,
          publisher: 'Aguila IA Studio',
          license: 'contenido propio',
          lang: 'es', topic: 'marca', text: texto
        })
      })
      const j = await r.json()
      if (j.ok && (j.fragmentos || 0) > 0) { ok++; frag += j.fragmentos; console.log('OK:', d.titulo, '->', j.fragmentos, 'fragmentos') }
      else { err++; console.log('NO guardado:', d.titulo, JSON.stringify(j.errores || j)) }
    } catch (e) { err++; console.log('ERROR:', d.titulo, e.message) }
  }
  console.log(`LISTO MIDOC ✅ documentos: ${ok} | fragmentos: ${frag} | con problemas: ${err}`)
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
