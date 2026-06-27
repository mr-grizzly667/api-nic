"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const MOCK_REGISTRARS = [
    { name: "JUST / EXPERTFOX", logo: "JEF", description: "Bureau d'enregistrement accrédité NIC.CI, spécialisé dans les services numériques et l'enregistrement de noms de domaine .CI.", website: "https://www.just.ci", type: "local", accreditedSince: "2015-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 1520 },
    { name: "AFRIREGISTER", logo: "AFR", description: "Bureau d'enregistrement panafricain accrédité par le NIC.CI pour la gestion des noms de domaine .CI.", website: "https://www.afriregister.com", type: "international", accreditedSince: "2016-01-01", featured: false, country: "International", domainsCount: 8400 },
    { name: "AKASSOH", logo: "AKS", description: "Registrar ivoirien accrédité NIC.CI, offrant des services d'enregistrement et de gestion de noms de domaine .CI.", website: "https://www.akassoh.net", type: "local", accreditedSince: "2017-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 1200 },
    { name: "AMIRA GLOBAL TECHNOLOGIE", logo: "AMG", description: "Entreprise technologique ivoirienne proposant des services d'enregistrement de noms de domaine .CI et des solutions numériques.", website: "https://www.amiraglobaltech.com", type: "local", accreditedSince: "2018-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 3400 },
    { name: "ASCIO TECHNOLOGIE", logo: "ASC", description: "Bureau d'enregistrement international accrédité NIC.CI, opérant depuis l'Europe avec des services de gestion de domaines.", website: "https://www.speednic.net", type: "international", accreditedSince: "2014-01-01", featured: false, country: "International", domainsCount: 11200 },
    { name: "ASSISTWEB / CACE", logo: "AWC", description: "Registrar ivoirien proposant des services d'assistance web et d'enregistrement de noms de domaine .CI aux entreprises locales.", website: "https://www.assistweb.ci", type: "local", accreditedSince: "2016-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 650 },
    { name: "AWEBSI / AFRICANTRADE", logo: "AWB", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, spécialisé dans les solutions web et le commerce digital en Afrique.", website: "https://www.awebsi.ci", type: "local", accreditedSince: "2017-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 1800 },
    { name: "ICTINA / PIECE OF LOVE", logo: "ICT", description: "Registrar ivoirien accrédité NIC.CI, offrant des services d'enregistrement de domaines .CI et des solutions TIC.", website: "https://www.pieceoflove.africa", type: "local", accreditedSince: "2019-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 420 },
    { name: "VENAME / CINETCOME", logo: "VEN", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, proposant des services de noms de domaine .CI et de connectivité.", website: "https://www.vename.com", type: "local", accreditedSince: "2018-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 2300 },
    { name: "CSC CORPORATE", logo: "CSC", description: "Leader mondial dans la gestion de noms de domaine et la protection de marques, accrédité NIC.CI pour les domaines .CI.", website: "https://www.cscglobal.com", type: "international", accreditedSince: "2013-01-01", featured: true, country: "International", domainsCount: 24500 },
    { name: "DATACONNECT / EPISTROPHE", logo: "DAT", description: "Registrar ivoirien accrédité NIC.CI, proposant des services d'hébergement, de connectivité et d'enregistrement de domaines .CI.", website: "https://www.dataconnect.africa", type: "local", accreditedSince: "2015-01-01", featured: true, country: "Côte d'Ivoire", domainsCount: 4500 },
    { name: "GRANSY", logo: "GRN", description: "Bureau d'enregistrement européen accrédité NIC.CI, spécialisé dans la gestion de noms de domaine internationaux et africains.", website: "https://www.regtons.com", type: "international", accreditedSince: "2016-01-01", featured: false, country: "International", domainsCount: 5200 },
    { name: "KHEUWEUL", logo: "KHW", description: "Bureau d'enregistrement ouest-africain accrédité NIC.CI, proposant des services de noms de domaine .CI depuis le Sénégal.", website: "https://www.kheweul.com", type: "international", accreditedSince: "2017-01-01", featured: false, country: "International", domainsCount: 1680 },
    { name: "LEXSYNERGY", logo: "LEX", description: "Spécialiste international de la gestion de domaines et de la protection de marques, accrédité NIC.CI pour les domaines .CI.", website: "https://www.lexsynergy.com", type: "international", accreditedSince: "2015-01-01", featured: false, country: "International", domainsCount: 12500 },
    { name: "MTN CI", logo: "MTN", description: "Opérateur télécom leader en Côte d'Ivoire, proposant des services d'enregistrement de noms de domaine .CI pour les particuliers et entreprises.", website: "https://www.mtn.ci", type: "local", accreditedSince: "2010-01-01", featured: true, country: "Côte d'Ivoire", domainsCount: 14200 },
    { name: "NETIM", logo: "NTM", description: "Bureau d'enregistrement français accrédité NIC.CI, offrant des services complets de gestion de noms de domaine .CI.", website: "https://www.netim.com", type: "international", accreditedSince: "2014-01-01", featured: false, country: "International", domainsCount: 18400 },
    { name: "PLANETHOSTERNIC", logo: "PLH", description: "Hébergeur web international accrédité NIC.CI, proposant des services d'enregistrement de domaines .CI et d'hébergement cloud.", website: "https://www.planethoster.com", type: "international", accreditedSince: "2016-01-01", featured: false, country: "International", domainsCount: 9500 },
    { name: "POWERLINE C.", logo: "PWL", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, spécialisé dans les solutions numériques et la gestion de domaines .CI.", website: "https://www.b-technologies.ci", type: "local", accreditedSince: "2017-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 880 },
    { name: "SIGMAS PERFORMANCE", logo: "SIG", description: "Registrar ivoirien accrédité NIC.CI, proposant des services TIC et d'enregistrement de noms de domaine .CI aux entreprises.", website: "https://www.ticafrique.com", type: "local", accreditedSince: "2015-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 2100 },
    { name: "CLOUD4AFRICA / VEONE", logo: "C4A", description: "Acteur du cloud computing en Afrique, accrédité NIC.CI, proposant des services d'hébergement et d'enregistrement de domaines .CI.", website: "https://www.cloud4africa.net", type: "local", accreditedSince: "2018-01-01", featured: true, country: "Côte d'Ivoire", domainsCount: 3600 },
    { name: "VIPNET", logo: "VIP", description: "Fournisseur d'accès Internet ivoirien accrédité NIC.CI, proposant des services d'hébergement et d'enregistrement de noms de domaine.", website: "https://www.vipnet.ci", type: "isp", accreditedSince: "2012-01-01", featured: true, country: "Côte d'Ivoire", domainsCount: 7800 },
    { name: "WEBLOGY", logo: "WBL", description: "Agence web et bureau d'enregistrement ivoirien accrédité NIC.CI, dédié à la création web et la gestion de domaines .CI.", website: "https://www.weblogie.ci", type: "hosting", accreditedSince: "2019-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 8200 },
    { name: "XSELSERVICES", logo: "XSL", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, proposant des services numériques et d'enregistrement de domaines .CI.", website: "https://www.xsel-services.com", type: "local", accreditedSince: "2018-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 1100 },
    { name: "SAFEBRANDS", logo: "SFB", description: "Expert international en protection de marques et gestion de noms de domaine, accrédité NIC.CI pour les domaines .CI.", website: "https://www.safebrands.com", type: "international", accreditedSince: "2014-01-01", featured: false, country: "International", domainsCount: 16500 },
    { name: "ORANGE CI / AVISO", logo: "OCI", description: "Opérateur télécom et hébergeur web leader en Côte d'Ivoire, accrédité NIC.CI pour l'enregistrement de domaines .CI.", website: "https://www.orange.ci", type: "isp", accreditedSince: "2009-01-01", featured: true, country: "Côte d'Ivoire", domainsCount: 12500 },
    { name: "I2S2", logo: "I2S", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, proposant des solutions informatiques et d'enregistrement de noms de domaine .CI.", website: "https://www.i2s2.com", type: "local", accreditedSince: "2017-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 540 },
    { name: "SAFENAMES", logo: "SFN", description: "Bureau d'enregistrement international accrédité NIC.CI, spécialisé dans la protection de marques et la gestion de domaines .CI.", website: "https://www.safenames.net", type: "international", accreditedSince: "2013-01-01", featured: false, country: "International", domainsCount: 11300 },
    { name: "WASSI TECHNOLOGIE", logo: "WST", description: "Entreprise technologique ivoirienne accrédite NIC.CI, offrant des services d'enregistrement de domaines .CI et de solutions numériques.", website: "https://www.wassi.ci", type: "local", accreditedSince: "2016-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 920 },
    { name: "SNDI", logo: "SND", description: "Société nationale de développement informatique, registrar ivoirien accrédité NIC.CI pour la gestion de noms de domaine .CI.", website: "https://www.sndi.ci", type: "local", accreditedSince: "2011-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 4300 },
    { name: "KIP SERVICES", logo: "KIP", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, proposant des services d'enregistrement de noms de domaine .CI.", website: "https://www.ekiptech.com", type: "local", accreditedSince: "2019-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 610 },
    { name: "SIRIUS TECHNO / CONNECTYC", logo: "STC", description: "Registrar ivoirien accrédité NIC.CI, offrant des services de connectivité et d'enregistrement de noms de domaine .CI.", website: "https://www.connectyc.ci", type: "local", accreditedSince: "2018-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 1050 },
    { name: "LABEL", logo: "LBL", description: "Bureau d'enregistrement ivoirien accrédité NIC.CI, proposant des services de gestion de noms de domaine .CI.", website: "https://www.labelci.com", type: "local", accreditedSince: "2017-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 880 },
    { name: "DMEDIA", logo: "DMD", description: "Agence de communication et bureau d'enregistrement ivoirien accrédité NIC.CI, spécialisé dans les services numériques.", website: "https://www.dmedia.ci", type: "local", accreditedSince: "2018-01-01", featured: false, country: "Côte d'Ivoire", domainsCount: 740 },
    { name: "MARKMONITOR", logo: "MMK", description: "Leader mondial dans la protection de marques en ligne et la gestion de noms de domaine, accrédité NIC.CI pour les domaines .CI.", website: "https://www.markmonitor.com", type: "international", accreditedSince: "2012-01-01", featured: true, country: "International", domainsCount: 19800 }
];
async function main() {
    console.log('Restoring registrars data...');
    const dbRegistrars = await prisma.registrar.findMany();
    let restored = 0;
    for (const dbReg of dbRegistrars) {
        const match = MOCK_REGISTRARS.find(m => m.name.toLowerCase() === dbReg.name.toLowerCase() ||
            dbReg.name.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()));
        if (match) {
            await prisma.registrar.update({
                where: { id: dbReg.id },
                data: {
                    website: match.website,
                    description: match.description,
                    type: match.type,
                    accredited_since: new Date(match.accreditedSince),
                    featured: match.featured,
                    country: match.country,
                    domains_count: match.domainsCount,
                    logo: ''
                }
            });
            restored++;
            console.log(`Restored: ${dbReg.name} (Domains: ${match.domainsCount}, URL: ${match.website})`);
        }
        else {
            const randomCount = Math.floor(Math.random() * 5000) + 100;
            await prisma.registrar.update({
                where: { id: dbReg.id },
                data: {
                    logo: '',
                    domains_count: randomCount
                }
            });
            console.log(`Fallback restore: ${dbReg.name} (Domains: ${randomCount})`);
        }
    }
    console.log(`Successfully restored ${restored} registrars.`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=restore-registrars.js.map