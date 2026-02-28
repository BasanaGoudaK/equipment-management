# Equipment Management System

A full-stack web application to manage equipment and their maintenance lifecycle.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui (Radix UI), Axios, date-fns, Lucide Icons
- **Backend**: Spring Boot 3.2, Java 17, Spring Data JPA, Spring Validation, Lombok
- **Database**: PostgreSQL 14+

---

## Project Structure

```
equipment-management/          ← Monorepo root
├── backend/                   ← Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/equipment/
│       ├── EquipmentApplication.java
│       ├── controller/        ← REST Controllers
│       ├── service/           ← Business Logic
│       ├── repository/        ← Data Access (JPA)
│       ├── model/             ← JPA Entities
│       ├── dto/               ← Request DTOs
│       └── exception/         ← Global Exception Handling
├── frontend/                  ← React application
│   ├── src/
│   │   ├── components/        ← React components
│   │   │   └── ui/            ← shadcn/ui component files
│   │   ├── api/               ← Axios API calls
│   │   ├── lib/               ← Utilities
│   │   └── App.jsx            ← Main app component
│   └── package.json
├── db/
│   └── init.sql               ← Database schema + seed data
├── README.md
└── COMPLIANCE.md
```

---

## Prerequisites

Make sure you have installed:

- **Java 17+** — `java -version`
- **Maven 3.8+** — `mvn -version`
- **Node.js 18+** — `node -version`
- **npm 9+** — `npm -version`
- **PostgreSQL 14+** — running locally

---

## Setup Instructions

### Step 1: Database Setup

1. Open your PostgreSQL client (psql, pgAdmin, or DBeaver).

2. Create the database:
   ```sql
   CREATE DATABASE equipment_db;
   ```

3. Run the initialization script:
   ```bash
   psql -U postgres -d equipment_db -f db/init.sql
   ```
   Or paste the contents of `db/init.sql` into your SQL client.

   This creates:
   - `equipment_types` table (with 6 default types)
   - `equipment` table
   - `maintenance_logs` table
   - 3 sample equipment records

4. Verify (optional):
   ```sql
   SELECT * FROM equipment_types;
   SELECT * FROM equipment;
   ```

---

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/equipment_db
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```
   Change `username` and `password` to match your PostgreSQL setup.

3. Install dependencies and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. The backend starts on **http://localhost:8080**

5. Verify by visiting: http://localhost:8080/api/equipment

---

### Step 3: Frontend Setup

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the app at **http://localhost:5173**

---

## API Endpoints

### Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment (supports `?status=ACTIVE` filter) |
| POST | `/api/equipment` | Create new equipment |
| PUT | `/api/equipment/{id}` | Update existing equipment |
| DELETE | `/api/equipment/{id}` | Delete equipment |
| GET | `/api/equipment/types` | Get all equipment types |

### Maintenance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/maintenance` | Log a maintenance event |
| GET | `/api/equipment/{id}/maintenance` | Get maintenance history for equipment |

---

## Business Rules

1. **Active Status Constraint**: Equipment cannot be set to `ACTIVE` if `lastCleanedDate` is older than 30 days. The backend enforces this and returns a `400 Bad Request` with a clear error message.

2. **Maintenance Auto-Update**: When a maintenance record is logged:
   - Equipment status automatically changes to `ACTIVE`
   - `lastCleanedDate` updates to the maintenance date
   - Both rules enforced server-side in `MaintenanceService`

---

## Additional Libraries Used

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.6.7 | HTTP client for API calls |
| `@radix-ui/react-dialog` | ^1.0.5 | Dialog/modal primitives (shadcn/ui) |
| `@radix-ui/react-select` | ^2.0.0 | Select dropdown primitives (shadcn/ui) |
| `@radix-ui/react-label` | ^2.0.2 | Label primitives (shadcn/ui) |
| `@radix-ui/react-slot` | ^1.0.2 | Slot composition (shadcn/ui) |
| `class-variance-authority` | ^0.7.0 | Component variant styling |
| `clsx` | ^2.1.0 | Conditional class names |
| `tailwind-merge` | ^2.2.1 | Tailwind class merging |
| `lucide-react` | ^0.323.0 | Icon library |
| `date-fns` | ^3.3.1 | Date formatting |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| `spring-boot-starter-web` | 3.2.3 | REST API framework |
| `spring-boot-starter-data-jpa` | 3.2.3 | ORM / database access |
| `spring-boot-starter-validation` | 3.2.3 | Bean validation (@Valid) |
| `postgresql` | runtime | PostgreSQL JDBC driver |
| `lombok` | optional | Boilerplate reduction (@Data, @RequiredArgsConstructor) |

### Installation Commands

**Frontend** (from `/frontend` directory):
```bash
npm install
```

**Backend** (from `/backend` directory):
```bash
mvn clean install
```

---

## Assumptions Made

1. PostgreSQL is running locally on the default port `5432`.
2. The default DB credentials are `postgres/postgres` — update `application.properties` if different.
3. Equipment types are seeded on first run via `db/init.sql`. They can be modified directly in the DB without any code changes.
4. The `lastCleanedDate` field is required when creating/editing equipment (enforced via frontend validation).
5. Deleting an equipment record also cascades and deletes all related maintenance logs (via `ON DELETE CASCADE`).
6. The 30-day Active constraint uses the current server date for comparison.
7. The Vite dev server proxies `/api` requests to `http://localhost:8080` — no CORS issues during development.

---

## Bonus Features Implemented

- ✅ **Filtering by status** — dropdown filter in the UI header
- ✅ **Meaningful error messages** — business rule violations shown inline in forms
