# Guide de Contribution (NIC.CI)

Merci de l'intérêt que vous portez au projet NIC.CI ! Ce document explique les conventions et les bonnes pratiques pour collaborer efficacement.

## 1. Conventions de nommage des Branches

Nous suivons le standard **Git Flow** (simplifié). Chaque nouvelle branche doit respecter le format suivant :
- `feat/nom-de-la-fonctionnalite` : Pour le développement d'une nouvelle fonctionnalité.
- `fix/nom-du-bug` : Pour la correction d'un bug.
- `hotfix/nom-du-bug-critique` : Pour corriger un bug critique en production.
- `refactor/nom-de-la-tache` : Pour une modification de code qui n'ajoute pas de fonctionnalité et ne corrige pas de bug (amélioration).
- `docs/nom-de-la-doc` : Pour un ajout ou une mise à jour de documentation.

Exemple : `feat/ajouter-authentification-jwt`

## 2. Conventions des Commits

Vos messages de commit doivent être clairs et utiliser la convention des **Conventional Commits** :
- `feat: <description>` (Nouvelle fonctionnalité)
- `fix: <description>` (Correction de bug)
- `docs: <description>` (Mise à jour de la documentation)
- `style: <description>` (Formatage, points-virgules manquants, etc., pas de changement logique)
- `refactor: <description>` (Refactoring de code)
- `test: <description>` (Ajout ou modification de tests)
- `chore: <description>` (Mise à jour des outils de build, des dépendances, etc.)

**Exemple de bon commit :**
`feat: implémentation du middleware de validation JWT`

## 3. Processus de Développement (Pull Requests)

1. Clonez le dépôt et créez une branche depuis `main` ou `develop`.
2. Développez votre fonctionnalité en faisant des commits petits et réguliers.
3. Avant de pousser votre code :
   - Assurez-vous que l'application compile correctement (frontend et backend).
   - Vérifiez qu'il n'y a pas d'erreurs Linter (utilisez `npm run lint`).
   - Assurez-vous que le formatage est correct (`npm run format` pour l'API backend).
4. Poussez votre branche : `git push origin <nom-de-votre-branche>`.
5. Ouvrez une Pull Request (PR) vers la branche principale (`main` ou `develop`).
6. Un autre développeur ou Tech Lead devra relire et approuver le code (Code Review) avant la fusion.

## 4. Bonnes Pratiques de Code

### Généralités
- Privilégiez le **TypeScript strict** sans utiliser le type `any`. Créez des interfaces ou des types clairs.
- Nommez vos variables, fonctions et classes en anglais de préférence, de façon descriptive.
- Le code mort (commenté) et les `console.log` doivent être retirés avant le commit.

### Backend (NestJS)
- Gardez vos contrôleurs légers : la logique métier doit se trouver dans les **Services**.
- Protégez vos routes en ajoutant les gardes appropriés (ex: `@UseGuards(JwtAuthGuard, RolesGuard)`).
- Documentez les nouveaux endpoints (si possible) via les décorateurs Swagger (ex: `@ApiTags()`, `@ApiOperation()`).

### Frontend (React)
- Divisez les gros composants en sous-composants réutilisables dans `src/components/`.
- Regroupez la logique réutilisable dans des *Custom Hooks* (dossier `src/hooks/`).
- Ne manipulez pas le DOM directement (pas de `document.getElementById`).
- Centralisez les appels API via un fichier Axios configuré (ex: `src/api/axios.ts`).

---
En suivant ces conventions, vous contribuez à garder la base de code du projet propre, maintenable, et professionnelle.
