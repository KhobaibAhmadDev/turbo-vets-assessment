# Secure Task Management System - TurboVets Assessment

A full-stack secure Task Management System with role-based access control (RBAC), built with NestJS, Angular, TypeORM, and JWT authentication.

**Repository:** turbo-vets-assessment  
**Assessment Duration:** 8 hours  
**Submission Deadline:** 4 business days from submission

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Architecture Overview](#architecture-overview)
3. [Data Model](#data-model)
4. [Access Control Implementation](#access-control-implementation)
5. [API Endpoints](#api-endpoints)
6. [Running Tests](#running-tests)
7. [Troubleshooting](#troubleshooting)
8. [Future Considerations](#future-considerations)

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (local or Docker)
- NX CLI: `npm install -g nx`

### Installation & Configuration

1. **Clone and install dependencies:**
   ```bash
   cd turbo-vets-assessment
   npm install
   ```

2. **Create `.env` file in project root:**
   ```env
   JWT_SECRET=turbovetskey
   DATABASE_URL=postgres://postgres:P@ssw0rd4132@localhost:5432/turbovets
   ```

3. **Start PostgreSQL:**
   ```bash
   # Docker (optional)
   docker run --name postgres-turbovets -e POSTGRES_PASSWORD=P@ssw0rd4132 -e POSTGRES_DB=turbovets -p 5432:5432 -d postgres:15
   ```

4. **Build the monorepo:**
   ```bash
   npx nx run-many --target build --all
   ```

### Running the Applications

**Terminal 1 - API Server (NestJS):**
```bash
npx nx run @turbo-vets-assessment/api:serve
# Server runs on http://localhost:3000
# Endpoints available at http://localhost:3000/api
```

**Terminal 2 - Dashboard (Angular):**
```bash
npx nx run dashboard:serve
# Dashboard runs on http://localhost:4200
```

### Authentication Flow

1. **Login:**
   - Navigate to `http://localhost:4200/login` (or you'll be auto-redirected here if not authenticated)
   - Enter email: `owner@example.com` and password: `password123` (seeded credentials)
   - Click "Login" → Token is signed and stored in `localStorage`
   - ⚠️ Invalid credentials return `401 Unauthorized`

2. **Access Tasks:**
   - Automatically redirected to `/tasks` after successful login
   - All subsequent API requests include `Authorization: Bearer <token>` (via JwtInterceptor)
   - Tasks are fetched from the backend and displayed
   - You can create, update, delete, and filter tasks
   - Click "Logout" in the top-right corner to clear token and return to login

3. **Protected Routes:**
   - `/tasks` - Requires authentication (AuthGuard)
   - `/tasks/create` - Requires authentication
   - `/tasks/edit/:id` - Requires authentication
   - `/login` - Publicly accessible

### Local Seed & Login (Quick Start)

**Important:** The application requires seeded credentials to log in. Follow these steps:

1. **Ensure PostgreSQL is running** (see [Start PostgreSQL](#installation--configuration) above).

2. **Start the API server** (it auto-creates tables via TypeORM `synchronize`):
   ```bash
   npx nx run @turbo-vets-assessment/api:serve
   ```
   Wait until you see: `Nest application successfully started on port 3000`

3. **Seed the database** (run in a new terminal from project root):
   ```bash
   node api\scripts\seed.js
   ```
   You should see output:
   ```
   Found/Created organization Acme Org
   Created user owner@example.com
   Seed complete. Use: owner@example.com / password123
   ```

4. **Demo Credentials:**
   - **Email:** `owner@example.com`
   - **Password:** `password123`
   
   ⚠️ **Only these credentials will work.** Invalid credentials will return `401 Unauthorized`.

5. **Login & Access Tasks:**
   - Open `http://localhost:4200` in your browser
   - Redirect automatically takes you to `/login`
   - Enter the demo credentials above
   - Click "Login" → You'll be redirected to `/tasks`
   - All task operations now available (create, edit, delete, filter)
   - Click "Logout" button in the top-right to log out (redirects to login)

---

## Architecture Overview

### NX Monorepo Structure

```
turbo-vets-assessment/
├── api/                          # NestJS backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── tasks/           # Task CRUD endpoints
│   │   │   ├── auth/            # Authentication (login)
│   │   │   ├── audit.service.ts # Audit logging
│   │   │   └── app.module.ts    # Main module
│   │   └── main.ts              # Bootstrap
│   ├── jest.config.ts
│   └── webpack.config.js
├── dashboard/                    # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Task CRUD UI, Login
│   │   │   ├── guards/          # Auth guard
│   │   │   ├── interceptors/    # JWT interceptor
│   │   │   ├── services/        # Auth service, Task service
│   │   │   └── app.module.ts
│   ├── tailwind.config.js
│   └── tsconfig.app.json
├── libs/                         # Shared code
│   ├── src/lib/
│   │   ├── data/                # DTOs, Entities, Enums
│   │   │   ├── dto/             # CreateTaskDto, UpdateTaskDto
│   │   │   ├── models/          # Task, User, Organization entities
│   │   │   └── enums/           # Role enum
│   │   └── auth/                # RBAC logic
│   │       ├── guards/          # JwtAuthGuard, RolesGuard
│   │       ├── decorators/      # @Roles() decorator
│   │       ├── strategies/      # JWT strategy
│   │       └── auth.module.ts
├── .env                          # Environment config
├── tsconfig.base.json
├── nx.json
└── package.json
```

### Key Design Decisions

1. **Modular Libraries:**
   - `@myorg/data`: Shared types, DTOs, entities
   - `@myorg/auth`: RBAC decorators, guards, strategies

2. **Authentication:**
   - JWT tokens signed with `JWT_SECRET`
   - JwtStrategy validates bearer tokens
   - JwtAuthGuard enforces authentication on protected routes

3. **Authorization:**
   - `RolesGuard` checks `@Roles()` decorator
   - TasksService enforces ownership & organization-level access
   - Audit service logs all actions

4. **Frontend:**
   - JwtInterceptor attaches tokens to all requests
   - AuthGuard redirects unauthenticated users to login

---

## Data Model

### Entity Relationships

```
┌─────────────────────────────────────────────────┐
│              Organization (Org)                 │
│  ────────────────────────────────────────────   │
│  ┌ id: UUID (PK)                              │
│  ├ name: string                               │
│  └ users: User[] (One-to-Many)               │
└─────────────────────────────────────────────────┘
          │
          │ ManyToOne
          ▼
┌─────────────────────────────────────────────────┐
│                 User                            │
│  ────────────────────────────────────────────   │
│  ┌ id: UUID (PK)                              │
│  ├ email: string (unique)                     │
│  ├ password: string (hashed)                  │
│  ├ role: Role (OWNER | ADMIN | VIEWER)       │
│  ├ organization: Organization (ManyToOne)     │
│  └ tasks: Task[] (One-to-Many)               │
└─────────────────────────────────────────────────┘
          │
          │ ManyToOne
          ▼
┌─────────────────────────────────────────────────┐
│                  Task                           │
│  ────────────────────────────────────────────   │
│  ┌ id: UUID (PK)                              │
│  ├ title: string                              │
│  ├ category: string (e.g., "Work", "Personal")│
│  ├ completed: boolean                         │
│  └ owner: User (ManyToOne)                    │
└─────────────────────────────────────────────────┘
```

### Roles & Permissions

| Role   | Create Tasks | View All Org Tasks | Edit Any Task | Delete Any Task | View Audit Log |
|--------|--------------|-------------------|----------------|-----------------|----------------|
| OWNER  | ✅            | ✅ (org-wide)      | ✅ (org-wide)   | ✅ (org-wide)   | ✅              |
| ADMIN  | ✅            | ✅ (org-wide)      | ✅ (org-wide)   | ✅ (org-wide)   | ✅              |
| VIEWER | ✅            | ❌ (own only)      | ❌              | ❌              | ❌              |

---

## Access Control Implementation

### 1. Authentication (JWT)

**JwtStrategy** validates bearer tokens:
```typescript
// Extract token from Authorization: Bearer <token>
// Validate signature using JWT_SECRET
// Return decoded payload as user
```

**JwtAuthGuard** protects routes:
```typescript
@UseGuards(JwtAuthGuard)
@Get('/tasks')
findAll(@Req() req) { ... }
```

### 2. Authorization (RBAC)

**@Roles() Decorator** specifies required roles:
```typescript
@Get('/audit-log')
@Roles(Role.OWNER, Role.ADMIN)
getAuditLog() { ... }
```

**RolesGuard** validates user role:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController { ... }
```

### 3. Data Access Control

**TasksService** enforces access rules:
- **CREATE**: Any authenticated user
- **READ (findAll)**: 
  - OWNER/ADMIN: All tasks in their organization
  - VIEWER: Only their own tasks
- **UPDATE**: Task owner OR OWNER/ADMIN in same organization
- **DELETE**: Task owner OR OWNER/ADMIN in same organization

### 4. Audit Logging

**ApiAuditService** logs all task operations:
```typescript
this.audit.log({
  action: 'create' | 'update' | 'delete',
  actor: user.email,
  resource: 'task',
  resourceId: task.id,
  timestamp: ISO8601
});
```

---

## API Endpoints

### Base URL
`http://localhost:3000/api`

### Authentication

#### POST /auth/login
**Description:** Login and obtain JWT token (validates against seeded User records)

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 - Invalid Credentials):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

### Tasks

#### GET /tasks
**Description:** List all accessible tasks (scoped by role)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Design homepage",
    "category": "Work",
    "completed": false,
    "owner": {
      "id": "uuid",
      "email": "user@acme.com",
      "role": "OWNER"
    }
  }
]
```

---

#### POST /tasks
**Description:** Create a new task

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Implement auth",
  "category": "Work"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "Implement auth",
  "category": "Work",
  "completed": false
}
```

---

#### PUT /tasks/:id
**Description:** Update a task (if permitted)

**Request:**
```json
{
  "title": "Implement auth [DONE]",
  "completed": true
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Implement auth [DONE]",
  "completed": true
}
```

---

#### DELETE /tasks/:id
**Description:** Delete a task (if permitted)

**Response (200):**
```json
{ "removed": true }
```

---

### Audit

#### GET /audit-log
**Description:** View access logs (OWNER/ADMIN only)

**Response (200):**
```json
[
  {
    "action": "create",
    "actor": "user@acme.com",
    "resource": "task",
    "resourceId": "uuid",
    "timestamp": "2026-02-03T10:30:00Z"
  }
]
```

---

## Running Tests

### Backend Tests (NestJS + Jest)

```bash
# Run all backend tests
npx nx run @turbo-vets-assessment/api:test

# Run with coverage
npx nx run @turbo-vets-assessment/api:test --coverage
```

**Test Files:**
- `api/src/app/tasks/tasks.service.spec.ts` - RBAC and ownership checks
- `api/src/app/auth/auth.service.spec.ts` - JWT signing

---

## Troubleshooting

### "JWT_SECRET missing in .env"
- Ensure `.env` file exists in project root with `JWT_SECRET=turbovetskey`

### "Unable to connect to the database"
- Verify PostgreSQL is running on localhost:5432
- Check `.env` database credentials

### "401 Unauthorized" on /tasks
- You must log in first at `/login`
- Token is stored in localStorage after login
- Check browser DevTools → Application → LocalStorage for `token` key

---

## Future Considerations

### Advanced Security
1. **JWT Refresh Tokens** - Implement token refresh mechanism
2. **CSRF Protection** - Add CSRF tokens to state-changing requests
3. **Rate Limiting** - Prevent brute-force attacks on login

### Performance & Scaling
1. **Permission Caching** - Cache user permissions in Redis
2. **Pagination** - Paginate task lists for large datasets
3. **Database Indexing** - Add indexes on frequently queried fields

### Advanced Features
1. **Role Delegation** - Allow OWNERs to temporarily grant permissions
2. **Task Templates** - Create reusable task templates
3. **Real-time Updates** - WebSocket notifications for task changes
4. **Analytics** - Task completion reports and activity dashboards

---

## Submission

Submit completed work to:
**https://forms.gle/1iJ2AHzMWsWecLUE6**

Deadline: 4 business days from submission

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
