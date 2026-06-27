import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const registrarsData = [
  { name: "JUST / EXPERTFOX", phone: "0151092627", email: "patricia@just.ci" },
  { name: "AFRIREGISTER", phone: "+257 78605472", email: "suavis@afriregister.com" },
  { name: "AKASSOH", phone: "+225 0544444451 / 0708655362", email: "wilfriedn@akassoh.net" },
  { name: "AMIRA GLOBAL TECHNOLOGIE", phone: "+225 0505577332 / 0101285084", email: "saka@amiraglobaltech.com" },
  { name: "ASCIO TECHNOLOGIE", phone: "+45 33886100 / +49.2283296859", email: "callback@speednic.net" },
  { name: "ASSISTWEB / CACE", phone: "+225 2722591305 / 0102032819", email: "support.assistweb@gmail.com" },
  { name: "AWEBSI / AFRICANTRADE", phone: "+225 0709474800", email: "pekangocoulibaly@gmail.com" },
  { name: "ICTINA / PIECE OF LOVE", phone: "+225 0707579216", email: "visible@pieceoflove.africa" },
  { name: "VENAME / CINETCOME", phone: "+225 0709145146", email: "soungalo.dosso@vename.com" },
  { name: "CSC CORPORATE", phone: "+1 3026365400", email: "cctld-billing@cscinfo.com" },
  { name: "DATACONNECT / EPISTROPHE", phone: "+225 0544027070 / 2722548500", email: "domaines@dataconnect.africa" },
  { name: "GRANSY", phone: "+420 732954549", email: "info@regtons.com" },
  { name: "KHEUWEUL", phone: "+221.338212939", email: "mouhamet.diop@kheweul.com" },
  { name: "LEXSYNERGY", phone: "+44 2031370459", email: "support@lexsynergy.com" },
  { name: "MTN CI", phone: "+225 0504188908", email: "samuel.lorougnon@mtn.com" },
  { name: "NETIM", phone: "+33 972307473", email: "adrien@netim.com" },
  { name: "PLANETHOSTERNIC", phone: "+1.514.360.8573", email: "quentin.clarenne@planethoster.info" },
  { name: "POWERLINE C.", phone: "+225 0708721372", email: "serge.mian@b-technologies.ci" },
  { name: "SIGMAS PERFORMANCE", phone: "+225 2122 00 20 77 / 05 05 50 05 57", email: "support@ticafrique.com" },
  { name: "CLOUD4AFRICA / VEONE", phone: "+225 25 20 00 46 40/ 0554026161", email: "renaud.koutouan@cloud4africa.net" },
  { name: "VIPNET", phone: "+225 21 22 52 62 00 / 0777 74 84 50", email: "eric.assi@vipnet.ci" },
  { name: "WEBLOGY", phone: "+225 0504952220 / 0506351711", email: "nouattara@weblogie.ci" },
  { name: "XSELSERVICES", phone: "+225 0101000364", email: "direction@xsel-services.com" },
  { name: "SAFEBRANDS", phone: "+33.488662222", email: "clientele@safebrands.com" },
  { name: "ORANGE CI / AVISO", phone: "+225 2720348460 / 0708904662", email: "rokiatou.kouyate@orange.com" },
  { name: "I2S2", phone: "+225 0505302159", email: "mori@i2s2.com" },
  { name: "SAFENAMES", phone: "+44 1908200022", email: "thierry.kouebitra@safenames.net" },
  { name: "WASSI TECHNOLOGIE", phone: "+225 2122522522 / 0140200045", email: "info@wassi.ci" },
  { name: "SNDI", phone: "+225 0707490849", email: "herve.akeboue@sndi.ci" },
  { name: "KIP SERVICES", phone: "+225 0544044443", email: "osorho@ekiptech.com" },
  { name: "SIRIUS TECHNO / CONNECTYC", phone: "+225 0707070133", email: "moussa.diomande@gmail.com" },
  { name: "LABEL", phone: "+225 21258074 / 0748212897", email: "gomez.athe@labelci.com" },
  { name: "DMEDIA", phone: "+225 25 20 22 40 72", email: "dossoissouf@gmail.com" },
  { name: "MARKMONITOR", phone: "+1.2083895740", email: "ccops@markmonitor.com" }
];

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function extractDomainFromEmail(email: string) {
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
}

async function main() {
  console.log('Clearing existing registrars...');
  await prisma.registrar.deleteMany();

  console.log(`Inserting ${registrarsData.length} registrars...`);
  
  for (let i = 0; i < registrarsData.length; i++) {
    const reg = registrarsData[i];
    const slug = generateSlug(reg.name);
    // Generate default logo based on the domain in email, e.g. using clearbit or just initial letters later
    // The prompt says "générer les logos par défaut lorsqu'aucun logo n'est disponible"
    // The frontend currently shows initials if logo is empty.
    // To generate a logo URL, we could use a dummy placeholder or just let the frontend handle it.
    // Or we can use Clearbit Logo API: `https://logo.clearbit.com/${domain}`
    const domain = extractDomainFromEmail(reg.email);
    const logoUrl = domain ? `https://logo.clearbit.com/${domain}?size=200` : '';

    await prisma.registrar.create({
      data: {
        name: reg.name,
        slug: slug,
        phone: reg.phone,
        email: reg.email,
        support_email: reg.email, // using same for support
        support_phone: reg.phone,
        status: 'Actif',
        logo: logoUrl,
        type: reg.name.includes('/') ? 'local' : 'international', // just an approximation
        order_position: i + 1,
        featured: i < 5 // First 5 featured just to have some
      }
    });
  }

  const count = await prisma.registrar.count();
  console.log(`Successfully inserted ${count} registrars.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
