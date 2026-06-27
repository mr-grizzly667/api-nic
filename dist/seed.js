"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const registrarsData_1 = require("./src/registrarsData");
const prisma = new client_1.PrismaClient({ log: ['info'] });
async function main() {
    const generatedPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@nic.ci' },
        update: {},
        create: {
            email: 'admin@nic.ci',
            first_name: 'Super',
            last_name: 'Admin',
            password: hashedPassword,
            role: 'admin',
        },
    });
    console.log(`\n\n=== IMPORTANT ===\nCompte Admin généré:\nEmail: admin@nic.ci\nMot de passe: ${generatedPassword}\nConservez ce mot de passe, il ne sera plus affiché.\n=================\n\n`);
    const getRandomDate = (monthsAgo) => {
        const d = new Date();
        d.setMonth(d.getMonth() - monthsAgo);
        d.setDate(Math.floor(Math.random() * 28) + 1);
        return d;
    };
    const newsData = [
        {
            title: "Lancement de la nouvelle plateforme NIC.CI",
            slug: "lancement-plateforme-nic-ci",
            summary: "Découvrez les nouvelles fonctionnalités du portail officiel pour les noms de domaine .CI.",
            content: "Le NIC.CI est fier d'annoncer le lancement officiel de son nouveau portail internet. Cette nouvelle plateforme offre une expérience utilisateur améliorée, plus de sécurité et une gestion simplifiée pour tous les acteurs du nom de domaine .CI en Côte d'Ivoire. Développée en interne par nos équipes avec les technologies les plus modernes, elle garantit un taux de disponibilité exceptionnel. Les registrars pourront désormais gérer leurs portefeuilles de domaines de manière centralisée grâce à notre nouvelle API RESTful performante.",
            category: "Institutionnel",
            image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(1),
            created_at: getRandomDate(1),
        },
        {
            title: "Mise à jour des protocoles DNSSEC",
            slug: "mise-a-jour-dnssec",
            summary: "Renforcement de la sécurité de l'infrastructure nationale avec l'adoption des dernières normes.",
            content: "Dans le cadre du renforcement continu de la sécurité de l'infrastructure nationale, le NIC.CI a procédé à une mise à jour majeure de ses protocoles cryptographiques pour le DNSSEC. Tous les registrars sont invités à vérifier la conformité de leurs systèmes avant la fin du trimestre. L'adoption d'algorithmes plus robustes (ECDSA) garantit une meilleure protection contre les attaques par usurpation (spoofing) et une empreinte réseau réduite. Nos ingénieurs sont à votre disposition pour vous accompagner dans cette migration essentielle.",
            category: "Technique",
            image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(2),
            created_at: getRandomDate(2),
        },
        {
            title: "Nouveau partenariat avec les registrars locaux",
            slug: "partenariat-registrars-locaux",
            summary: "L'ARTCI signe un accord historique pour démocratiser l'accès au .CI.",
            content: "L'ARTCI a officiellement signé aujourd'hui un accord stratégique avec 5 nouveaux bureaux d'enregistrement (registrars) locaux. Cette initiative vise à rendre le nom de domaine .CI plus accessible aux petites et moyennes entreprises ivoiriennes. Ce partenariat inclut des tarifs préférentiels pour la première année d'enregistrement et un accompagnement technique personnalisé. L'objectif est d'atteindre la barre des 100 000 domaines .CI actifs d'ici la fin de l'année prochaine.",
            category: "Institutionnel",
            image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(3),
            created_at: getRandomDate(3),
        },
        {
            title: "Comment bien choisir son nom de domaine ?",
            slug: "comment-choisir-son-nom-de-domaine",
            summary: "Guide pratique pour les PME souhaitant établir leur présence en ligne.",
            content: "Le choix d'un nom de domaine est une étape cruciale pour toute entreprise souhaitant se lancer sur le web. Un bon nom de domaine doit être court, mémorable et refléter fidèlement l'identité de votre marque. Évitez les tirets superflus et les chiffres qui peuvent prêter à confusion. En choisissant l'extension .CI, vous montrez instantanément à vos visiteurs que vous êtes un acteur économique basé en Côte d'Ivoire. N'oubliez pas de protéger les déclinaisons de votre marque pour éviter le cybersquatting.",
            category: "Guide",
            image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(4),
            created_at: getRandomDate(4),
        },
        {
            title: "Statistiques Q3 : Le .CI en forte croissance",
            slug: "statistiques-croissance-ci",
            summary: "Analyse des chiffres du dernier trimestre : une augmentation record des enregistrements.",
            content: "Le NIC.CI publie aujourd'hui les statistiques officielles concernant l'enregistrement des noms de domaine pour le troisième trimestre de l'année. Nous constatons une hausse de 18% par rapport au trimestre précédent, portée principalement par le secteur du e-commerce et les startups technologiques. Abidjan reste la région avec le plus fort taux d'adoption, bien que l'intérieur du pays affiche une croissance encourageante. Téléchargez le rapport complet au format PDF dans notre section Documents.",
            category: "Statistiques",
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(5),
            created_at: getRandomDate(5),
        },
        {
            title: "Maintenance programmée des serveurs WHOIS",
            slug: "maintenance-serveurs-whois",
            summary: "Information technique concernant la fenêtre de maintenance prévue.",
            content: "Afin de garantir des performances optimales et d'améliorer la disponibilité de notre service d'annuaire, une maintenance des serveurs WHOIS est programmée pour le week-end prochain, entre 02h00 et 04h00 du matin (heure locale). Durant cette fenêtre d'intervention, le service de consultation de la disponibilité des domaines pourrait connaître des perturbations temporaires. L'enregistrement de nouveaux domaines via l'API REST restera quant à lui pleinement fonctionnel. Nous nous excusons pour les éventuels désagréments.",
            category: "Technique",
            image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(6),
            created_at: getRandomDate(6),
        },
        {
            title: "L'importance de l'identité numérique locale",
            slug: "importance-identite-numerique-locale",
            summary: "Tribune sur l'impact d'un nom de domaine national sur la confiance des consommateurs.",
            content: "Dans un monde de plus en plus globalisé, affirmer son ancrage local sur internet devient un atout concurrentiel majeur. Le choix d'une extension géographique telle que le .CI (Country Code Top-Level Domain) rassure les consommateurs ivoiriens, qui privilégient de plus en plus les achats de proximité et les services locaux. De plus, les moteurs de recherche ont tendance à favoriser les extensions locales pour les requêtes géolocalisées, améliorant ainsi considérablement votre référencement naturel (SEO) en Côte d'Ivoire.",
            category: "Éditorial",
            image_url: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(7),
            created_at: getRandomDate(7),
        },
        {
            title: "Formation : Sécurisation de son nom de domaine",
            slug: "formation-securisation-domaine",
            summary: "Ouverture des inscriptions pour notre prochain webinaire de formation technique.",
            content: "Le NIC.CI organise une session de formation en ligne entièrement gratuite sur le thème de la sécurisation des noms de domaine. Ce webinaire s'adresse aux administrateurs systèmes, aux responsables informatiques et aux agences web. Au programme : bonnes pratiques de gestion des mots de passe, configuration avancée du DNS, prévention du Domain Hijacking (détournement de domaine) et implémentation pratique de DNSSEC. Inscrivez-vous dès maintenant via le formulaire disponible sur notre espace documentaire.",
            category: "Formation",
            image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(8),
            created_at: getRandomDate(8),
        },
        {
            title: "Publication du rapport d'activité annuel",
            slug: "rapport-activite-annuel",
            summary: "Retrouvez les temps forts et les réalisations de l'année écoulée.",
            content: "Le rapport annuel d'activité du NIC.CI vient d'être publié. Ce document exhaustif revient sur une année riche en défis et en innovations. Il détaille notamment les investissements réalisés dans la modernisation de l'infrastructure réseau, les actions de promotion du .CI menées auprès des étudiants, et les résultats financiers du registre. Ce rapport témoigne de notre engagement en faveur de la transparence et de l'excellence opérationnelle. Il est téléchargeable librement dans la rubrique Rapports.",
            category: "Rapport",
            image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(10),
            created_at: getRandomDate(10),
        },
        {
            title: "Règlement des litiges relatifs aux noms de domaine",
            slug: "reglement-litiges-domaines",
            summary: "Mise en place d'une nouvelle procédure de médiation accélérée.",
            content: "Dans le but de protéger plus efficacement les droits de propriété intellectuelle des marques opérant en Côte d'Ivoire, le NIC.CI, en collaboration avec les autorités compétentes, a mis en place une nouvelle procédure de règlement des litiges. Plus rapide et moins coûteuse qu'une action en justice classique, cette procédure de médiation permet de résoudre les conflits liés au cybersquatting en un temps record. Les décisions rendues par la commission d'arbitrage sont exécutoires sous 15 jours ouvrés.",
            category: "Institutionnel",
            image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
            status: "Publié",
            author_id: user.id,
            published_at: getRandomDate(11),
            created_at: getRandomDate(11),
        }
    ];
    const documentsData = [
        {
            title: "Guide d'enregistrement d'un nom de domaine .CI",
            description: "Document complet détaillant pas-à-pas les étapes nécessaires pour enregistrer un nom de domaine .CI auprès d'un bureau d'enregistrement accrédité, incluant les pré-requis administratifs et techniques.",
            category: "Guides",
            file_name: "guide-enregistrement-domaine-ci.pdf",
            file_url: "/uploads/documents/guide-enregistrement-domaine-ci.pdf",
            file_type: "application/pdf",
            file_size: "2.4 MB",
            status: "Publié",
            version: "2.1",
            featured: true,
            downloads: 4150,
            created_by: user.id,
            created_at: getRandomDate(1),
        },
        {
            title: "Guide de renouvellement d'un domaine .CI",
            description: "Ce guide vous accompagne dans le processus de renouvellement de votre nom de domaine avant son expiration, afin d'éviter la perte de votre identité numérique.",
            category: "Guides",
            file_name: "guide-renouvellement.pdf",
            file_url: "/uploads/documents/guide-renouvellement.pdf",
            file_type: "application/pdf",
            file_size: "1.1 MB",
            status: "Publié",
            version: "1.5",
            featured: false,
            downloads: 1840,
            created_by: user.id,
            created_at: getRandomDate(5),
        },
        {
            title: "Procédure de transfert d'un domaine .CI",
            description: "Ce document spécifie les règles et la marche à suivre pour transférer la gestion de votre nom de domaine d'un registrar vers un autre en toute sécurité (obtention de l'AuthInfo).",
            category: "Procédures",
            file_name: "procedure-transfert.pdf",
            file_url: "/uploads/documents/procedure-transfert.pdf",
            file_type: "application/pdf",
            file_size: "850 KB",
            status: "Publié",
            version: "3.0",
            featured: true,
            downloads: 2530,
            created_by: user.id,
            created_at: getRandomDate(3),
        },
        {
            title: "Charte de nommage des domaines .CI",
            description: "Document officiel de l'ARTCI fixant les règles juridiques, techniques et syntaxiques d'éligibilité pour l'attribution des noms de domaine sous la racine .CI.",
            category: "Politiques",
            file_name: "charte-nommage-ci.pdf",
            file_url: "/uploads/documents/charte-nommage-ci.pdf",
            file_type: "application/pdf",
            file_size: "4.2 MB",
            status: "Publié",
            version: "2.0",
            featured: false,
            downloads: 8900,
            created_by: user.id,
            created_at: getRandomDate(12),
        },
        {
            title: "Politique de résolution des litiges",
            description: "Cadre réglementaire régissant les conflits entre titulaires et tiers (notamment les ayants droit) afin de lutter contre le cybersquatting.",
            category: "Politiques",
            file_name: "politique-litiges.pdf",
            file_url: "/uploads/documents/politique-litiges.pdf",
            file_type: "application/pdf",
            file_size: "1.7 MB",
            status: "Publié",
            version: "1.8",
            featured: false,
            downloads: 1250,
            created_by: user.id,
            created_at: getRandomDate(18),
        },
        {
            title: "Formulaire de demande d'accréditation Registrar",
            description: "Formulaire officiel (format Word) à remplir et à soumettre au NIC.CI pour toute entité souhaitant devenir bureau d'enregistrement accrédité.",
            category: "Formulaires",
            file_name: "formulaire-accreditation-registrar.docx",
            file_url: "/uploads/documents/formulaire-accreditation-registrar.docx",
            file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            file_size: "520 KB",
            status: "Publié",
            version: "4.0",
            featured: true,
            downloads: 650,
            created_by: user.id,
            created_at: getRandomDate(2),
        },
        {
            title: "Formulaire de modification des informations titulaire",
            description: "Document permettant à un titulaire de domaine de demander officiellement la mise à jour de ses informations légales (changement de propriétaire, d'adresse, etc.).",
            category: "Formulaires",
            file_name: "modification-titulaire.pdf",
            file_url: "/uploads/documents/modification-titulaire.pdf",
            file_type: "application/pdf",
            file_size: "340 KB",
            status: "Publié",
            version: "2.3",
            featured: false,
            downloads: 3200,
            created_by: user.id,
            created_at: getRandomDate(8),
        },
        {
            title: "Guide DNS et configuration des serveurs de noms",
            description: "Manuel technique détaillé expliquant comment paramétrer correctement vos serveurs DNS (Name Servers) et gérer les enregistrements de zone (A, MX, CNAME, TXT).",
            category: "Documentation Technique",
            file_name: "guide-dns-configuration.pdf",
            file_url: "/uploads/documents/guide-dns-configuration.pdf",
            file_type: "application/pdf",
            file_size: "3.5 MB",
            status: "Publié",
            version: "3.1",
            featured: false,
            downloads: 2100,
            created_by: user.id,
            created_at: getRandomDate(4),
        },
        {
            title: "Guide DNSSEC pour les registrars",
            description: "Spécifications techniques pour l'implémentation du protocole DNSSEC via l'API EPP du registre afin de garantir l'intégrité de la résolution DNS.",
            category: "Documentation Technique",
            file_name: "guide-dnssec-registrars.pdf",
            file_url: "/uploads/documents/guide-dnssec-registrars.pdf",
            file_type: "application/pdf",
            file_size: "4.8 MB",
            status: "Publié",
            version: "2.4",
            featured: false,
            downloads: 410,
            created_by: user.id,
            created_at: getRandomDate(9),
        },
        {
            title: "Procédure WHOIS et vérification des domaines",
            description: "Explication du fonctionnement de l'annuaire WHOIS public, des informations divulguées et de la procédure de masquage partiel selon les réglementations sur les données personnelles.",
            category: "Documentation Technique",
            file_name: "procedure-whois.pdf",
            file_url: "/uploads/documents/procedure-whois.pdf",
            file_type: "application/pdf",
            file_size: "1.2 MB",
            status: "Publié",
            version: "1.9",
            featured: false,
            downloads: 1450,
            created_by: user.id,
            created_at: getRandomDate(14),
        },
        {
            title: "Convention d'accréditation des bureaux d'enregistrement",
            description: "Contrat-type liant juridiquement l'Autorité de Régulation (ARTCI/NIC.CI) aux bureaux d'enregistrement, définissant les obligations, les SLA et les sanctions applicables.",
            category: "Conventions",
            file_name: "convention-accreditation-registrar.pdf",
            file_url: "/uploads/documents/convention-accreditation-registrar.pdf",
            file_type: "application/pdf",
            file_size: "6.1 MB",
            status: "Publié",
            version: "5.0",
            featured: true,
            downloads: 980,
            created_by: user.id,
            created_at: getRandomDate(6),
        },
        {
            title: "Rapport annuel des activités du registre",
            description: "Bilan global de l'année écoulée : croissance du parc de domaines, investissements infrastructurels, actions de sensibilisation et rapports financiers.",
            category: "Rapports",
            file_name: "rapport-annuel-2025.pdf",
            file_url: "/uploads/documents/rapport-annuel-2025.pdf",
            file_type: "application/pdf",
            file_size: "12.5 MB",
            status: "Publié",
            version: "2025",
            featured: false,
            downloads: 5400,
            created_by: user.id,
            created_at: getRandomDate(6),
        },
        {
            title: "Rapport statistique sur les noms de domaine .CI",
            description: "Analyse chiffrée de la répartition des extensions géographiques et thématiques (.ci, .com.ci, .edu.ci), évolution trimestrielle et profil démographique des titulaires.",
            category: "Rapports",
            file_name: "statistiques-domaines-ci-2025.pdf",
            file_url: "/uploads/documents/statistiques-domaines-ci-2025.pdf",
            file_type: "application/pdf",
            file_size: "8.2 MB",
            status: "Publié",
            version: "2025",
            featured: false,
            downloads: 3250,
            created_by: user.id,
            created_at: getRandomDate(2),
        },
        {
            title: "Guide des bonnes pratiques de cybersécurité pour les titulaires",
            description: "Fascicule de prévention destiné aux titulaires (PME et particuliers) sur l'importance des mots de passe robustes, l'authentification à double facteur (2FA) et la protection contre le phishing.",
            category: "Guides",
            file_name: "guide-cybersecurite-titulaires.pdf",
            file_url: "/uploads/documents/guide-cybersecurite-titulaires.pdf",
            file_type: "application/pdf",
            file_size: "3.8 MB",
            status: "Publié",
            version: "1.4",
            featured: false,
            downloads: 6780,
            created_by: user.id,
            created_at: getRandomDate(11),
        },
        {
            title: "Procédure de gestion des incidents liés aux noms de domaine",
            description: "Manuel opérationnel détaillant le plan de réponse en cas de compromission d'un nom de domaine, de panne de registre ou d'attaque DDoS visant les infrastructures DNS.",
            category: "Procédures",
            file_name: "procedure-incidents-domaines.pdf",
            file_url: "/uploads/documents/procedure-incidents-domaines.pdf",
            file_type: "application/pdf",
            file_size: "2.5 MB",
            status: "Publié",
            version: "2.2",
            featured: false,
            downloads: 1120,
            created_by: user.id,
            created_at: getRandomDate(20),
        }
    ];
    console.log("Seeding Documents...");
    await prisma.document.deleteMany();
    for (const doc of documentsData) {
        const createdDoc = await prisma.document.create({
            data: doc
        });
        console.log(`- Created Document: ${createdDoc.title}`);
    }
    console.log("Seeding Registrars...");
    await prisma.registrar.deleteMany();
    let position = 1;
    for (const reg of registrarsData_1.registrarsData) {
        const createdReg = await prisma.registrar.create({
            data: {
                name: reg.name,
                slug: reg.slug,
                logo: reg.logo,
                description: reg.description,
                phone: reg.phone,
                email: reg.email,
                website: reg.website,
                type: reg.type,
                status: reg.status === 'accredited' ? 'Actif' : reg.status === 'suspended' ? 'Suspendu' : 'En attente',
                country: reg.country,
                accredited_since: reg.accreditedSince ? new Date(reg.accreditedSince) : null,
                featured: reg.featured || false,
                order_position: position++,
                domains_count: Math.floor(Math.random() * 5000) + 100
            }
        });
        console.log(`- Created Registrar: ${createdReg.name}`);
    }
    console.log("Seed terminé avec succès.");
}
main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
//# sourceMappingURL=seed.js.map