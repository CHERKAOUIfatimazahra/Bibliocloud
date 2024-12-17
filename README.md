# bibliocloud - Bibliothèque Numérique

## 🚀 Présentation du Projet

Bookio est une application de gestion de bibliothèque moderne utilisant une architecture de microservices basée sur AWS, permettant aux utilisateurs de rechercher, emprunter et gérer des livres de manière efficace et sécurisée.

## 📋 Fonctionnalités Principales

- **Authentification Sécurisée** : Inscription et connexion via AWS Cognito
- **Gestion des Livres** : Recherche, emprunt et retour de livres
- **Interface Utilisateur Moderne** : Application React intuitive
- **Infrastructure Cloud** : Déployée et scalable sur AWS

## 🛠 Technologies Utilisées

### Backend
- **Langage & Framework** : NestJS
- **Authentification** : AWS Cognito
- **Base de Données** : DynamoDB
- **Hébergement** : AWS ECS

### Frontend
- **Framework** : React.js
- **Gestion des États** : Axios
- **Hébergement** : AWS S3 + CloudFront

### Infrastructure DevOps
- **Cloud** : Amazon Web Services (AWS)
- **CI/CD** : GitHub Actions
- **Gestion des Secrets** : AWS Secrets Manager

## 🔧 Configuration et Installation

### Prérequis
- Node.js (v16+)
- npm ou yarn
- Compte AWS
- AWS CLI configuré

### Installation Locale

1. Cloner le repository
```bash
https://github.com/CHERKAOUIfatimazahra/Bibliocloud_backend.git
```

2. Installer les dépendances
```bash
npm install
```

3. Configuration des Variables d'Environnement
Créez un fichier `.env` dans chaque service avec les configurations nécessaires :

**.env**
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
BOOKS_TABLE_NAME=your_dynamodb_table_name
```

## 🚀 Déploiement

### Déploiement Local
```bash
# Démarrer le service d'authentification
cd auth-service
npm run start:dev

# Démarrer le service de gestion des livres
cd ../book-service
npm run start:dev

# Démarrer le frontend
cd ../frontend
npm start
```

### Déploiement AWS
Le déploiement est automatisé via GitHub Actions ou AWS CodePipeline.

1. Configurer les secrets GitHub/AWS
2. Pousser sur la branche `main`
3. Le pipeline de CI/CD gère automatiquement :
   - Build des services
   - Tests
   - Déploiement sur AWS

## 📡 API Endpoints

### Service d'Authentification
- `POST /auth/signup` : Inscription
- `POST /auth/login` : Connexion
- `GET /auth/me` : Informations utilisateur

### Service de Gestion des Livres
- `GET /books` : Lister tous les livres
- `GET /books/:id` : Détails d'un livre
- `POST /books/:id/borrow` : Emprunter un livre
- `POST /books/:id/return` : Retourner un livre

## 🧪 Tests

```bash
# Lancer les tests
npm run test

## 📝 Documentation API

La documentation complète de l'API est disponible via :
- Collection Postman : Voir `docs/`


## 🔒 Sécurité

- Authentification via AWS Cognito
- Jetons JWT pour toutes les requêtes
- Gestion des secrets via AWS Secrets Manager
