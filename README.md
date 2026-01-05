# Warrior Joinery

Warrior Joinery is the **first full website I built after graduating from Code Institute**.

The project was created as a **hybrid portfolio piece**:
- to demonstrate my **full-stack software development skills**, and
- to market myself and showcase my **joinery skills**, drawing on my real background working in the construction industry.

Although the site is not a finished product, it is intentionally built around a **real-world trade business scenario**, focusing on production-ready patterns rather than visual polish alone.

---

## Project Aims

- Build a realistic business website using modern web technologies
- Showcase completed work through a managed image gallery
- Convert visitors into enquiries via a contact form
- Provide a simple, secure way to manage content without a CMS
- Demonstrate competence in full-stack development and deployment

---

## Features

- ⚡ React + Vite frontend
- 🎨 Tailwind CSS styling
- 📨 Contact form API using Nodemailer
- 🖼️ Public image gallery powered by Cloudinary
- 🔐 Admin API for managing gallery images
  - Basic Auth protection for admin routes
  - Token-based authentication for admin API calls
- 🧩 Single Page Application routing (Express serves `dist/`)
- ✅ Health check endpoint for deployment monitoring

---

## Tech Stack

### Frontend
- React
- React Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

### Backend
- Node.js (ES Modules)
- Express
- Nodemailer
- Cloudinary
- Multer (in-memory uploads)

### Build & Deployment
- Vite
- Heroku-compatible configuration

---

## Getting Started

### Prerequisites
- Node.js **20.x**
- Cloudinary account
- Gmail account (App Password recommended)

### Installation

```bash
git clone https://github.com/BrandonWarrior/warrior-joinery.git
cd warrior-joinery
npm install
Environment Variables
Create a .env file in the project root.

env
Copy code
# Server
PORT=5050

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=warrior-joinery/gallery

# Admin protection (Basic Auth)
ADMIN_BASIC_USER=admin_username
ADMIN_BASIC_PASS=admin_password

# Admin API token
ADMIN_TOKEN=your_secure_token

# Email (Nodemailer)
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
MAIL_FROM="Warrior Joinery Website <yourgmail@gmail.com>"
MAIL_TO=destination@email.com
For Gmail, use an App Password rather than your normal account password.

Running the Project
Development (Vite)
bash
Copy code
npm run dev
Production-style (Express serving built frontend)
bash
Copy code
npm run build
npm start
The app will run on:

arduino
Copy code
http://localhost:5050
API Endpoints
Public
POST /api/contact
Sends an enquiry email.

Body:

json
Copy code
{
  "name": "Your Name",
  "email": "you@example.com",
  "message": "Your message",
  "company": ""
}
The company field is a honeypot used for spam prevention.

GET /api/gallery
Returns gallery images from Cloudinary.

Admin (Protected)
All admin routes require:

Basic Auth

X-Admin-Token header

GET /api/admin/list
Returns all gallery images.

POST /api/admin/upload
Uploads a new image.

multipart/form-data

Field name: file

DELETE /api/admin/delete/:public_id
Deletes an image from Cloudinary.

Admin Page
/admin is protected by Basic Auth

Intended for managing gallery content

Served from the built SPA

Health Check
bash
Copy code
GET /healthz
Returns:

json
Copy code
{ "ok": true, "ts": "ISO timestamp" }
Deployment
This project is configured for Heroku:

start: node server.js

heroku-postbuild: npm run build

Set all environment variables as Heroku Config Vars before deploying.

Planned Improvements
Customer feedback / testimonials page

Admin UI login flow (replace Basic Auth prompt)

Database integration for persistent data

Image pagination and optimisation

Rate limiting and enhanced spam protection

Automated testing for API routes

Notes
This project was built to demonstrate real-world development skills, including:

authentication and security decisions

third-party service integration

environment configuration

deployment-ready architecture

License
No license specified.

yaml
Copy code

---