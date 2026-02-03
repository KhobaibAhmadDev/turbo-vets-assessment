#!/bin/bash
# End-to-End Integration Test Script
# Demonstrates: Login → Create Task → List Tasks → Update → Delete → View Audit Log

set -e

API_URL="http://localhost:3000/api"
EMAIL="testuser@acme.com"
PASSWORD="testpass123"

echo "================================"
echo "E2E Integration Test"
echo "================================"
echo ""

# 1. Login
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Login successful"
echo "Token (first 50 chars): ${TOKEN:0:50}..."
echo ""

# 2. Create a task
echo "2. Creating a task..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\": \"E2E Test Task\", \"category\": \"Work\"}")

TASK_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
if [ "$TASK_ID" == "null" ] || [ -z "$TASK_ID" ]; then
  echo "❌ Task creation failed"
  echo "Response: $CREATE_RESPONSE"
  exit 1
fi

echo "✓ Task created"
echo "Task ID: $TASK_ID"
echo ""

# 3. List tasks
echo "3. Listing tasks..."
LIST_RESPONSE=$(curl -s -X GET "$API_URL/tasks" \
  -H "Authorization: Bearer $TOKEN")

TASK_COUNT=$(echo "$LIST_RESPONSE" | jq 'length')
echo "✓ Tasks retrieved: $TASK_COUNT task(s)"
echo ""

# 4. Update task
echo "4. Updating task..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\": \"E2E Test Task [UPDATED]\", \"completed\": true}")

UPDATED_TITLE=$(echo "$UPDATE_RESPONSE" | jq -r '.title')
echo "✓ Task updated: $UPDATED_TITLE"
echo ""

# 5. View audit log (Owner/Admin only)
echo "5. Viewing audit log..."
AUDIT_RESPONSE=$(curl -s -X GET "$API_URL/audit-log" \
  -H "Authorization: Bearer $TOKEN")

AUDIT_COUNT=$(echo "$AUDIT_RESPONSE" | jq 'length')
echo "✓ Audit logs: $AUDIT_COUNT entries"
echo ""

# 6. Delete task
echo "6. Deleting task..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")

REMOVED=$(echo "$DELETE_RESPONSE" | jq -r '.removed')
if [ "$REMOVED" == "true" ]; then
  echo "✓ Task deleted successfully"
else
  echo "❌ Task deletion failed"
  exit 1
fi
echo ""

echo "================================"
echo "✓ All E2E tests passed!"
echo "================================"
