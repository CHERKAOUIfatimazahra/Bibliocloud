Contexte du projet
Vous êtes chargé de développer une application moderne pour une bibliothèque locale qui souhaite améliorer ses services numériques. L’objectif est de créer une plateforme complète où les utilisateurs peuvent :

S'inscrire et se connecter de manière sécurisée. Rechercher et emprunter des livres disponibles. Recevoir des notifications pour des rappels d'emprunts ou des retours. La bibliothèque souhaite utiliser une architecture moderne basée sur les microservices, tout en exploitant les services AWS pour une infrastructure évolutive et robuste.

​

Le projet est structuré autour de trois services principaux et une infrastructure DevOps.

​

1. Service d'Authentification (Auth Service)

​

Rôle : Ce service gère l’inscription, la connexion et l’authentification des utilisateurs via AWS Cognito.

Fonctionnalités : Inscription d’un utilisateur (nom, email, mot de passe). Connexion via AWS Cognito (récupération du jeton JWT). Endpoint pour récupérer les informations de l’utilisateur connecté.

Technologies : Backend : NestJS. AWS : Cognito pour gérer les utilisateurs. Base de données : DynamoDB ou MongoDB (pour stocker des informations complémentaires comme le rôle utilisateur).

Endpoints : POST /auth/signup : Inscription d’un nouvel utilisateur.

POST /auth/login : Connexion et obtention du jeton JWT.

GET /auth/me : Récupération des données de l’utilisateur connecté (token JWT requis).

Déploiement : Hébergé sur AWS Lambda via Serverless Framework ou AWS ECS. Configuration des variables sensibles via AWS Secrets Manager.

​

2. Service de Gestion des Livres (Book Service)

​

Rôle : Ce service gère les livres disponibles dans la bibliothèque : création, recherche, mise à jour, suppression, et gestion des emprunts.

Fonctionnalités : CRUD (Create, Read, Update, Delete) pour les livres. Rechercher un livre par titre, auteur ou catégorie. Enregistrer les emprunts et retours des utilisateurs.

Technologies : Backend : NestJS. Base de données : MongoDB ou DynamoDB pour les informations sur les livres et les emprunts.

Endpoints : GET /books : Lister tous les livres.

GET /books/:id : Détails d’un livre.

POST /books : Ajouter un nouveau livre (admin uniquement).

PUT /books/:id : Mettre à jour un livre (admin uniquement).

DELETE /books/:id : Supprimer un livre (admin uniquement).

POST /books/:id/borrow : Emprunter un livre (utilisateur authentifié).

POST /books/:id/return : Retourner un livre (utilisateur authentifié).

Déploiement : Hébergé sur AWS ECS ou AWS Lambda. API exposée via AWS API Gateway.

​

3. Frontend (Bookio Web)

​

Rôle : Ce service est une application frontend qui permet aux utilisateurs d’interagir avec les services backend via une interface intuitive.

Fonctionnalités : Page d’accueil : Présentation de l’application. Page d’inscription et connexion (avec Cognito). Tableau de bord utilisateur : Lister et rechercher des livres. Visualiser les détails d’un livre. Ajouter des livres aux favoris. Emprunter et rendre des livres. Page admin (optionnel) : Gérer les livres (ajouter, modifier, supprimer).

Technologies : Framework : React.js avec Axios pour appeler les APIs. Authentification : Jetons JWT via AWS Cognito. Déploiement : Hébergé sur AWS S3 avec CloudFront pour la distribution.

​

4. Infrastructure et DevOps

​

Rôle : Déployer et orchestrer les services avec une approche CI/CD et les meilleures pratiques cloud.

​

Services AWS Utilisés :

​

Cognito : Authentification et gestion des utilisateurs. S3 + CloudFront : Hébergement du frontend. ECS ou Lambda : Hébergement des services backend. API Gateway : Exposition des endpoints. Secrets Manager : Gestion des secrets (ex. : clés JWT, configurations Cognito). CodePipeline / GitHub Actions : CI/CD pour automatiser les déploiements.

​

Architecture Technique

​

Diagramme d’Architecture L’utilisateur interagit avec le frontend (React.js), hébergé sur S3 + CloudFront. Les requêtes API sont routées via API Gateway vers : Auth Service pour la gestion des utilisateurs via AWS Cognito. Book Service pour la gestion des livres et emprunts. Les données sont stockées dans MongoDB ou DynamoDB.

​

Plan de Travail sur 4 Semaines

Semaine 1 : Authentification Mise en place d’AWS Cognito. Développement du service Auth (backend). Intégration avec le frontend (React.js).

Semaine 2 : Gestion des Livres Développement du service Book (CRUD, emprunts, retours). Connexion backend et frontend pour afficher les livres.

Semaine 3 : Déploiement Déployer les microservices sur AWS ECS ou Lambda. Déployer le frontend sur AWS S3 + CloudFront. Configurer API Gateway pour les endpoints.

**Semaine 4 **: Tests et Documentation Tester l’ensemble de l’application. Documenter les endpoints, l’architecture, et les étapes de déploiement.

​

​

Objectifs Pédagogiques

Apprendre à intégrer AWS Cognito pour l’authentification des utilisateurs. Développer une architecture en microservices avec NestJS. Gérer des interactions frontend-backend via des API REST. Maîtriser le déploiement cloud sur AWS en utilisant des services comme ECS, S3, CloudFront, et API Gateway. Automatiser le déploiement avec CI/CD.

Modalités pédagogiques
Travail Individual

date limite : du 09/12/2024 au 25/10/2024

Modalités d'évaluation
Évaluation Hebdomadaire pour chaque fin de semaine  :
Une durée de 25 min organisée comme suit :
5  minutes pour Démontrer le contenu et la fonctionnalité du site Web (très rapidement)
Montrez le code source et expliquez brièvement comment il fonctionne. (5 minutes)
Mise en situation (10minutes)
Code Review \ Questions culture Web (5 minutes)

Livrables
Code source sur GitHub avec un fichier README.md.
Lien déployé pour l’application frontend et les APIs backend.
Documentation API (Swagger ou Postman).
Diagramme d’architecture illustrant les services AWS utilisés.
Présenation de projet

Critères de performance
Fonctionnalités opérationnelles (authentification, gestion des livres, emprunts).
Qualité du code (modularité, DRY, SOLID).
Déploiement réussi (frontend et backend accessibles en ligne).
CI/CD : Pipeline fonctionnel et automatisé.
Documentation : Complète et claire (README, diagramme, endpoints API).
