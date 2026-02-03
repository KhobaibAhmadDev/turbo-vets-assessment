# Quick Start Guide - TurboVets Task Management System

## 🚀 Get Started in 5 Minutes

### 1. Install & Setup

```bash
# Clone and navigate
cd turbo-vets-assessment

# Install dependencies
npm install

cat > .env << EOF
JWT_SECRET=turbovetskey
DATABASE_URL=postgres://postgres:P@ssw0rd4132@localhost:5432/turbovets
EOF

docker run --name postgres-turbovets \
  -e POSTGRES_PASSWORD=P@ssw0rd4132 \
  -e POSTGRES_DB=turbovets \
  -p 5432:5432 -d postgres:15
```

### 2. Run Backend & Frontend

**Terminal 1 - API Server:**
```bash
npx nx run @turbo-vets-assessment/api:serve
# ✓ Listening on http://localhost:3000
```

**Terminal 2 - Dashboard:**
```bash
npx nx run dashboard:serve
# ✓ Listening on http://localhost:4200
```

### 3. Use the App

1. Open **http://localhost:4200** in your browser
2. Click "Login" (already there via routing)
3. Enter any email and password
4. You're logged in! Token stored in localStorage
5. **Create Task:** Type title, select category, click "Add Task"
6. **Toggle Complete:** Click checkbox
7. **Delete Task:** Click "Delete" button
8. **Filter:** Use filter dropdown (All/Pending/Completed)

### 4. Test API Directly (Optional)

```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' \
  | jq -r '.accessToken')

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","category":"Work"}'

# List tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Core Features

✅ **JWT Authentication** - Secure login and token management  
✅ **RBAC** - Three roles: OWNER, ADMIN, VIEWER with different permissions  
✅ **Task CRUD** - Create, read, update, delete with access control  
✅ **Audit Logging** - All actions logged (create, update, delete)  
✅ **Responsive UI** - Works on desktop and mobile  
✅ **Type-Safe** - Full TypeScript with strict mode  
✅ **Well-Tested** - Jest tests for RBAC logic  
✅ **Well-Documented** - README, API docs, architecture explanation  

---

## 🔐 Understanding RBAC

| Action | OWNER | ADMIN | VIEWER |
|--------|-------|-------|--------|
| Create Task | ✅ | ✅ | ✅ |
| See All Org Tasks | ✅ | ✅ | ❌ (own only) |
| Edit Any Task | ✅ | ✅ | ❌ |
| Delete Any Task | ✅ | ✅ | ❌ |
| View Audit Log | ✅ | ✅ | ❌ |

**Note:** All users log in with OWNER role in development mode for demo purposes.

---

## 📁 Key Files to Understand

| File | Purpose |
|------|---------|
| `libs/src/lib/auth/guards/roles.guard.ts` | RBAC enforcement |
| `libs/src/lib/auth/strategies/jwt.strategy.ts` | JWT validation |
| `api/src/app/tasks/tasks.service.ts` | Task business logic + RBAC checks |
| `api/src/app/audit.service.ts` | Audit logging |
| `dashboard/src/app/components/tasks-list/tasks-list.component.ts` | Task UI component |
| `dashboard/src/app/interceptors/jwt.interceptor.ts` | Automatic token attachment |

---

## 🧪 Run Tests

```bash
# Backend tests (RBAC, auth)
npx nx run @turbo-vets-assessment/api:test

# With coverage
npx nx run @turbo-vets-assessment/api:test --coverage
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `JWT_SECRET missing` | Check `.env` has `JWT_SECRET=turbovetskey` |
| `Cannot connect to database` | Start PostgreSQL: `docker ps` or check localhost:5432 |
| `401 Unauthorized` | You must log in first at `/login` |
| `Port 3000 already in use` | Kill existing process or change port |
| `Cannot find module @myorg/auth` | Run `npm install` to rebuild node_modules |

---

## 📖 Documentation

- **[README.md](README.md)** - Full documentation with setup, architecture, API
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - What's been built and tested
- **[e2e-test.sh](e2e-test.sh)** - Bash script demonstrating full workflow

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add JWT refresh tokens** - Extend token lifetime
2. **Add CSRF protection** - Secure POST/PUT/DELETE
3. **Add rate limiting** - Prevent brute force
4. **Persist tasks to DB** - Use full TypeORM config
5. **Add drag-and-drop** - Reorder tasks visually
6. **Add dark mode** - Toggle with TailwindCSS
7. **Add task search** - Filter by keywords

---

## 📧 Submission

When ready, submit at: **https://forms.gle/1iJ2AHzMWsWecLUE6**

**Deadline:** 4 business days from submission

---

## 💡 Need Help?

- Check the **[README.md](README.md)** for architecture and API details
- Run the **[e2e-test.sh](e2e-test.sh)** to verify the full flow
- Review **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** for what's been completed
- Check backend tests in `api/src/app/tasks/tasks.service.spec.ts`
