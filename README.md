# 🍽️ HorecaWeb — Plataforma SaaS All-in-One para Hostelería

> **Solución integral de gestión operativa y digitalización ultra-segura para bares, restaurantes y cafeterías.**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Security](https://img.shields.io/badge/Shield-V2.4_Ultra--Secure-emerald?style=for-the-badge)](https://github.com/AlvaroNavarreteGarcia/horecaweb-saas)

---

## 📌 Descripción del Proyecto

**HorecaWeb** es un modelo de negocio SaaS (*Software as a Service*) diseñado para democratizar la gestión hostelera. Ofrece una alternativa eficiente, accesible y **sin comisiones por reserva**, eliminando la dependencia de intermediarios costosos.

La plataforma está diseñada con una arquitectura **multitenant**, lo que permite optimizar los costes de infraestructura y ofrecer planes altamente competitivos para los propietarios del sector HORECA.

---

## 🚀 Funcionalidades Principales

### 🛋️ Operativo Sala & Libro Digital de Reservas
- **Gestión en tiempo real:** Registro manual rápido de reservas presenciales o telefónicas.
- **Métricas operativas:** Control visual de comensales diarios, mesas asignadas y estado de ocupación.
- **Interfaz táctil optimizada:** Diseñada para uso rápido por camareros en sala mediante dispositivos móviles o tablets.

### 💼 Gestión & Servicios (Panel Propietario / PIN)
- **Control de Seguridad (SHIELD V2.4):** Monitorización de estado de servidores, SSL/WAF activo e incidencias de red.
- **Métricas de Negocio:** Visualización clara de rendimiento, suscripciones y servicios contratados.
- **Modo Admin Protegido:** Acceso mediante PIN para funciones ejecutivas y de configuración.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React.js, Vite, JavaScript (ES6+).
- **Estilos & UI:** Tailwind CSS, Lucide Icons, diseño *Responsive Mobile-First*.
- **Seguridad / Infraestructura:** Arquitectura Multitenant, HTTPS/SSL, Protección WAF simulada.
- **Despliegue:** Netlify Continuous Deployment.

---

## 📂 Estructura del Repositorio

```text
horecaweb-saas/
├── src/
│   ├── components/       # Componentes de UI (Reservas, Panel Admin, Modales)
│   ├── assets/           # Iconos y recursos estáticos
│   └── App.jsx           # Componente principal de la aplicación
├── public/               # Archivos públicos
├── index.html            # Punto de entrada HTML
└── README.md             # Documentación del proyecto