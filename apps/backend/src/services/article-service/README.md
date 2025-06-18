
# Article Service API Documentation

Base URL: `http://<your-service-host>:4000`

All responses are in JSON format.

---

## Authentication

Some endpoints require an API key.  
Clients must send an HTTP header:

```
x-api-key: your-very-secret-api-key
```

If the API key is missing or invalid, the service responds with HTTP 401 Unauthorized.

---

## Endpoints

### 1. Get All Articles

Retrieve a list of all articles, sorted by creation date descending.

```
GET /articles
```

**Request Example:**

```bash
curl http://localhost:4000/articles
```

**Response Example:**

```json
[
  {
    "id": 1,
    "title": "Introduction to Node.js",
    "content": "Node.js is a JavaScript runtime...",
    "tags": ["javascript", "nodejs"],
    "author_id": 5,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2025-06-01T10:00:00Z"
  },
  {
    "id": 2,
    "title": "Understanding Express Middleware",
    "content": "Middleware functions are functions that have access to the request object...",
    "tags": ["express", "nodejs", "middleware"],
    "author_id": 3,
    "created_at": "2025-05-28T09:30:00Z",
    "updated_at": "2025-05-28T09:30:00Z"
  }
]
```

---

### 2. Get Article by ID

Retrieve a specific article by its numeric ID.

```
GET /articles/:id
```

**Request Example:**

```bash
curl http://localhost:4000/articles/1
```

**Response Example:**

```json
{
  "id": 1,
  "title": "Introduction to Node.js",
  "content": "Node.js is a JavaScript runtime...",
  "tags": ["javascript", "nodejs"],
  "author_id": 5,
  "created_at": "2025-06-01T10:00:00Z",
  "updated_at": "2025-06-01T10:00:00Z"
}
```

**Error Response:**

```json
Status: 404 Not Found
"Not found"
```

---

### 3. Get Article by Title

Retrieve a specific article by its exact title (case-sensitive).

```
GET /articles/title/:title
```

**Request Example:**

```bash
curl http://localhost:4000/articles/title/Introduction%20to%20Node.js
```

**Response Example:**

```json
{
  "id": 1,
  "title": "Introduction to Node.js",
  "content": "Node.js is a JavaScript runtime...",
  "tags": ["javascript", "nodejs"],
  "author_id": 5,
  "created_at": "2025-06-01T10:00:00Z",
  "updated_at": "2025-06-01T10:00:00Z"
}
```

**Error Response:**

```json
Status: 404 Not Found
"Not found"
```

---

### 4. Create a New Article

Create a new article. Requires API key authentication.

```
POST /articles
Headers:
  x-api-key: your-very-secret-api-key
Content-Type: application/json
```

**Request Body Schema:**

| Field     | Type                | Required | Description                     |
|-----------|---------------------|----------|--------------------------------|
| title     | string (3-255 chars) | Yes      | Article title                  |
| content   | string (min 10 chars)| Yes      | Article content (HTML allowed) |
| tags      | string or array of strings | No | Tags associated with the article|
| author_id | positive integer     | Yes      | ID of the article author       |

**Request Example:**

```json
{
  "title": "Getting Started with Redis",
  "content": "<p>Redis is an in-memory data structure store...</p>",
  "tags": ["redis", "cache", "database"],
  "author_id": 7
}
```

**Response Example:**

```json
Status: 201 Created
{
  "id": 10,
  "title": "Getting Started with Redis",
  "content": "Redis is an in-memory data structure store...",
  "tags": ["redis", "cache", "database"],
  "author_id": 7,
  "created_at": "2025-06-18T12:00:00Z",
  "updated_at": "2025-06-18T12:00:00Z"
}
```

**Error Responses:**

- 400 Bad Request: Validation errors (e.g., missing required fields)
- 401 Unauthorized: Missing or invalid API key

---

### 5. Update an Existing Article

Update an article by its ID. Requires API key authentication.

```
PUT /articles/:id
Headers:
  x-api-key: your-very-secret-api-key
Content-Type: application/json
```

**Request Body Schema:**

At least one of these fields should be provided:

| Field   | Type                | Required | Description              |
|---------|---------------------|----------|--------------------------|
| title   | string (3-255 chars) | No       | New article title        |
| content | string (min 10 chars)| No       | New article content      |
| tags    | string or array     | No       | New tags list            |

**Request Example:**

```json
{
  "title": "Updated Redis Guide",
  "tags": ["redis", "database"]
}
```

**Response Example:**

```json
{
  "id": 10,
  "title": "Updated Redis Guide",
  "content": "Redis is an in-memory data structure store...",
  "tags": ["redis", "database"],
  "author_id": 7,
  "created_at": "2025-06-18T12:00:00Z",
  "updated_at": "2025-06-18T15:30:00Z"
}
```

**Error Responses:**

- 400 Bad Request: Validation errors
- 401 Unauthorized: Missing or invalid API key

---

### 6. Delete an Article

Delete an article by its ID. Requires API key authentication.

```
DELETE /articles/:id
Headers:
  x-api-key: your-very-secret-api-key
```

**Request Example:**

```bash
curl -X DELETE http://localhost:4000/articles/10 -H "x-api-key: your-very-secret-api-key"
```

**Response:**

```
Status: 204 No Content
```

**Error Response:**

- 401 Unauthorized: Missing or invalid API key

---

## Notes on Validation and Sanitization

- `title` and `content` fields are validated for length and type.
- `tags` can be provided as either an array of strings or a comma-separated string.
- Request body fields `title` and `content` are sanitized to strip any HTML tags before storing.
- API key authentication is mandatory for POST, PUT, and DELETE endpoints.
