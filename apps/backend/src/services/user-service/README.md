# User Service API Documentation

**Base URL**: `http://<host>:3001/users`

## Authentication
**Header** (for protected routes):

```
x-api-key: your-very-secret-api-key
```

## Common User Object
```json
{
  "id": "uuid-v4-string",
  "name": "Full Name",
  "email": "email@example.com"
}
```

## Endpoints

### GET `/users`
Retrieve **all users**.
**Response**: `200 OK`
```json
[
  {
    "id": "85e472de-47d1-4f3a-b2a9-8a6b2d760c89",
    "name": "Alice",
    "email": "alice@example.com"
  }
]
```

### GET `/users/id/:id`
Retrieve a user by **UUID**.
**Response**: `200 OK`
```json
{
  "id": "85e472de-47d1-4f3a-b2a9-8a6b2d760c89",
  "name": "Alice",
  "email": "alice@example.com"
}
```

### GET `/users/email/:email`
Retrieve a user by **email**.
**Response**: `200 OK`
```json
{
  "id": "85e472de-47d1-4f3a-b2a9-8a6b2d760c89",
  "name": "Alice",
  "email": "alice@example.com"
}
```

### POST `/users`
Create a new user.
**Headers**:
```
x-api-key: your-very-secret-api-key
Content-Type: application/json
```
**Request Body**:
```json
{
  "id": "85e472de-47d1-4f3a-b2a9-8a6b2d760c89",
  "name": "Alice",
  "email": "alice@example.com"
}
```
**Response**: `201 Created`
```json
{
  "id": "85e472de-47d1-4f3a-b2a9-8a6b2d760c89",
  "name": "Alice",
  "email": "alice@example.com"
}
```

### PUT `/users/:id`
Update an existing user.
**Request Body**:
```json
{
  "name": "Alice Updated",
  "email": "alice.new@example.com"
}
```
**Response**: `201 Created`

### DELETE `/users/:id`
Delete a user by ID.
**Response**: `204 No Content`

## Caching
- Responses for GET endpoints are cached for 1 hour.
- Mutations clear affected cache entries.

## Slack Integration
Invalid input triggers Slack alert.

## Example cURL Commands

### Create a User
```bash
curl -X POST http://localhost:3001/users   -H "Content-Type: application/json"   -H "x-api-key: your-very-secret-api-key"   -d '{
    "id": "85e472de-47d1-4f3a-b2a9-8a6b2d760c89",
    "name": "Alice",
    "email": "alice@example.com"
  }'
```

### Update a User
```bash
curl -X PUT http://localhost:3001/users/85e472de-47d1-4f3a-b2a9-8a6b2d760c89   -H "Content-Type: application/json"   -H "x-api-key: your-very-secret-api-key"   -d '{
    "name": "Alice Updated",
    "email": "alice.new@example.com"
  }'
```

### Delete a User
```bash
curl -X DELETE http://localhost:3001/users/85e472de-47d1-4f3a-b2a9-8a6b2d760c89   -H "x-api-key: your-very-secret-api-key"
```
