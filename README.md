# NIC.CI - Plateforme de Gestion de Noms de Domaine

Ce projet constitue la plateforme de gestion et d'administration (Backend et Frontend) pour le registre **NIC.CI**.
Il offre une interface d'administration complète et une API robuste pour gérer les domaines, les bureaux d'enregistrement (registrars), les documents, les utilisateurs, le support et les actualités.

---

## 🎯 Vue d'ensemble de l'Architecture

Le projet repose sur une architecture moderne séparant clairement le Frontend et le Backend pour une meilleure maintenabilité, évolutivité et sécurité.

### 1. Frontend : Application React SPA
L'interface utilisateur est une Single Page Application (SPA) robuste et rapide, développée avec :
- **React 18** : Bibliothèque principale pour les interfaces utilisateurs.
- **Vite** : Outil de build et serveur de développement ultra-rapide.
- **TypeScript** : Pour un typage statique fort, réduisant les erreurs d'exécution.
- **React Router v6** : Pour une gestion de navigation côté client fluide.
- **Context API** : Utilisé pour la gestion d'état global (notamment l'authentification et les notifications).
- **Tailwind CSS / Vanilla CSS** : Utilisé pour styliser rapidement de manière modulaire (selon composants).

*➡️ Voir la documentation complète du Frontend : [nic-ci-react/README.md](./nic-ci-react/README.md)*

### 2. Backend : API RESTful NestJS
Le moteur du système est une API REST sécurisée, structurée de manière modulaire :
- **NestJS (Node.js)** : Framework backend de référence en TypeScript, offrant une architecture par modules, contrôleurs et services (similaire à Angular).
- **Prisma ORM** : Pour une interaction type-safe avec la base de données.
- **MySQL / PostgreSQL** : Base de données relationnelle.
- **JWT (JSON Web Tokens)** : Mécanisme principal d'authentification.
- **Multer** : Pour la gestion sécurisée de l'upload de fichiers.

*➡️ Voir la documentation complète de l'API et de la Sécurité : [nic-ci-api/README.md](./nic-ci-api/README.md)*

---

## 🔄 Flux de données (Data Flow)

Le flux de données global entre les couches se déroule comme suit :
1. **Action Utilisateur** : L'utilisateur interagit avec l'interface React.
2. **Appel Axios** : Un client HTTP configuré (`axios.ts` avec intercepteurs) envoie une requête REST à l'API, en attachant automatiquement le token JWT stocké de façon sécurisée.
3. **Réception NestJS** : 
   - Le *Middleware* / *Guard* de NestJS intercepte la requête.
   - Il valide le token JWT et vérifie si l'utilisateur possède les rôles requis (`RolesGuard`).
4. **Traitement par le Contrôleur** : Les données d'entrée (`DTO`) sont validées par `class-validator` (Protection contre l'injection et les données malformées).
5. **Logique Métier (Service)** : Le service approprié exécute la logique métier et appelle Prisma.
6. **Requête BDD (Prisma)** : Prisma exécute une requête SQL paramétrée (protection anti-injection) vers la base de données.
7. **Retour** : La réponse redescend dans l'arbre et le composant React met à jour l'interface via l'état local ou global.

---

## 🚀 Guide de Démarrage Rapide (Local / Développement)

Pour exécuter le projet complet en local, vous avez besoin de **Node.js (v18+)** et d'une base de données relationnelle.

### 1. Démarrer le Backend (API)
```bash
# 1. Aller dans le dossier API
cd nic-ci-api

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
# Créer un fichier .env et copier le contenu de .env.example
# Configurer DATABASE_URL, JWT_SECRET, etc.

# 4. Appliquer le schéma de la base de données
npx prisma db push
npm run seed # (Optionnel) Pour créer les administrateurs et données de base

# 5. Démarrer en mode développement
npm run start:dev
```
L'API tournera sur `http://localhost:3000`. Vous pouvez consulter la **documentation API Swagger** sur `http://localhost:3000/api` (une fois configurée).

### 2. Démarrer le Frontend (React)
Dans un nouveau terminal :
```bash
# 1. Aller dans le dossier React
cd nic-ci-react

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
# Vérifier que VITE_API_URL pointe bien vers le serveur backend (ex: http://localhost:3000)

# 4. Démarrer le serveur Vite
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 🛠 Guide de Maintenance

### Mise à jour des dépendances
Pour maintenir la sécurité, vérifiez régulièrement les vulnérabilités avec :
```bash
npm audit
npm outdated
```

### Migration de base de données
Toute modification du schéma Prisma (`schema.prisma`) nécessite la création d'une migration pour ne pas perdre les données de production :
```bash
cd nic-ci-api
npx prisma migrate dev --name <nom_de_la_migration>
```

### Journalisation et Erreurs
- L'API utilise les *Exception Filters* de NestJS pour formater toutes les erreurs de manière uniforme sans exposer les "Stack Traces" en production.
- En production, il est recommandé de lier les logs NestJS (via `Winston` ou `Pino`) à un service de monitoring (Datadog, ELK, Sentry).

---

## 🚢 Déploiement

Le déploiement en production fait l'objet d'un guide spécifique et détaillé.
👉 **Voir le [GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)**

---

## 🤝 Contribuer au projet

Veuillez consulter le fichier **[CONTRIBUTING.md](./CONTRIBUTING.md)** pour connaître nos règles de codage, la convention de nommage des branches, et le flux de travail Git (Git Flow, Commits conventionnels).
