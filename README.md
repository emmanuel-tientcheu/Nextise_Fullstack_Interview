# Seminar Management Platform

## Prérequis

- Node.js 18+
- Docker & Docker Compose

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier et configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs (DATABASE_URL, NEXTAUTH_SECRET, etc.)

# 3. Démarrer Docker (PostgreSQL et Mailhog)
docker-compose up -d

# 4. Initialiser Prisma
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 5. Lancer l'application
npm run dev

npm run test                 # Lancer les tests
docker-compose down          # Arrêter Docker

### 6. Lancer l'application

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000)

## Compte utilisateur

Un utilisateur administrateur est automatiquement créé par le seed :

| Email | Mot de passe |
|---|---|
| admin@test.com | password |