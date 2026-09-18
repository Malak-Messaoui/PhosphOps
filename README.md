# PhosphOps

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

[![CI/CD](https://github.com/Malak-Messaoui/PhosphOps/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Malak-Messaoui/PhosphOps/actions/workflows/ci-cd.yml)

> A full-stack industrial maintenance and production monitoring platform for CPG.

---

## Description

PhosphOps is a unified industrial maintenance management platform built for CPG (Compagnie des Phosphates de Gafsa). It provides two dedicated portals — a **Front Office** for field technicians to manage and report on-site interventions, and a **Back Office** for administrators to oversee equipment, schedule maintenance, and monitor operations in real time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular, TypeScript, HTML/CSS |
| Backend | Spring Boot, Java |
| Database | PostgreSQL |
| Auth | Spring Security, JWT, BCrypt |
| DevOps | Docker, GitHub Actions (CI/CD), GitHub Container Registry |
| Monitoring | Prometheus, Grafana |

---

## Features

- 🔧 Field technician interventions & maintenance tracking (Front Office)
- 📊 Equipment monitoring & administration dashboard (Back Office)
- 🔐 Role-based authentication & authorization
- 📈 Real-time production & maintenance monitoring

---

## CI/CD

This project uses **GitHub Actions** for continuous integration and deployment. The pipeline runs automatically on every push or pull request to `main` and `develop`:

- **Backend** — Maven build, unit tests, `.jar` packaging
- **Frontend** — dependency install, lint, headless unit tests, production Angular build
- **Docker** — backend/frontend images built and pushed to GitHub Container Registry (`ghcr.io`) on every merge to `main`
- **Deploy** — automated deployment (to be configured for the target environment)

Workflow definition: [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)
Démo Live : https://phosphopsfrontend-fyh6dpbwbmfahphx.swedencentral-01.azurewebsites.net/login?fbclid=IwY2xjawUaOF1wZG9mBWV4dG4DYWVtAjEwAGJyaWQRMXozYW9QRTlLV2haUlhFQzdzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEezcBdrMXJ7bU33jonIhClhWVLV69skYD3XD9OgZLoZ-IkxjmM45GMSntI3h4_aem_reb-XJoCm-2ZCazyvowl7A
---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Malak-Messaoui/PhosphOps.git

# Backend
cd PhosphOps
./mvnw spring-boot:run

# Frontend
cd PhosphOpsFront
npm install
ng serve
```

---

## Author

**Malak Messaoui** — ESPRIT School of Engineering
