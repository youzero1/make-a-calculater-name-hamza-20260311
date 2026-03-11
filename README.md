# Prime Calculator

A modern, fullstack prime number calculator built with Next.js 14, TypeScript, TypeORM, and SQLite.

## Features

- **Prime Number Checker** – Check if a number is prime or composite.
- **Prime Number Generator** – Generate all primes within a range (max range: 100,000).
- **Nth Prime Finder** – Find the Nth prime number (up to N = 10,000).
- **Prime Factorization** – Decompose a number into prime factors (up to 10,000,000).
- **Calculation History** – All calculations are stored in SQLite and displayed with timestamps.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TypeORM** + **better-sqlite3**
- **Tailwind CSS**

## Getting Started

### Local Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
docker-compose up --build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/prime.db` | Path to SQLite database |

## Project Structure

```
prime-calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── prime/route.ts
│   │       └── history/route.ts
│   ├── components/
│   │   ├── PrimeChecker.tsx
│   │   ├── PrimeGenerator.tsx
│   │   ├── NthPrimeFinder.tsx
│   │   ├── PrimeFactorization.tsx
│   │   └── HistoryLog.tsx
│   ├── lib/
│   │   ├── prime-utils.ts
│   │   └── database.ts
│   └── entities/
│       └── Calculation.ts
├── Dockerfile
├── docker-compose.yml
└── package.json
```
