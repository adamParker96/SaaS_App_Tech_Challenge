# File Service API Documentation

Base URL: `http://<host>:4000/files`

The File Service provides CRUD operations for managing files in the knowledge base. It supports caching via Redis, request validation, and API key protection on write operations.

---

## Authentication

- **API Key** is required on all **write operations** (`POST`, `PUT`, `DELETE`).
- Clients must send the header:  
  ```
  x-api-key: your-very-secret-api-key
  ```
- Missing or invalid API key returns **401 Unauthorized**.

---

## Endpoints

### 1. Get All Files

- **URL:** `/files`
- **Method:** `GET`
- **Description:** Retrieve a list of all files, ordered by creation date descending.
- **Auth required:** No
- **Query Parameters:** None
- **Response:**
  - **Status 200 OK**
  - JSON array of file objects.

```json
[
  {
    "id": 1,
    "filename": "example.pdf",
    "mime_type": "application/pdf",
    "url": "https://example.com/files/example.pdf",
    "uploaded_by": "user123",
    "created_at": "2025-06-17T14:00:00Z"
  },
  ...
]
```

- **Example curl:**

```bash
curl -X GET http://<host>:4000/files
```

---

### 2. Get File by ID

- **URL:** `/files/:id`
- **Method:** `GET`
- **Description:** Retrieve a single file by its unique ID.
- **Auth required:** No
- **URL Parameters:**
  - `id` — File ID (integer)
- **Response:**
  - **Status 200 OK**  
    JSON object with file details.
  - **Status 404 Not Found** if file does not exist.

Example response:

```json
{
  "id": 1,
  "filename": "example.pdf",
  "mime_type": "application/pdf",
  "url": "https://example.com/files/example.pdf",
  "uploaded_by": "user123",
  "created_at": "2025-06-17T14:00:00Z"
}
```

- **Example curl:**

```bash
curl -X GET http://<host>:4000/files/1
```

---

### 3. Get File by Filename

- **URL:** `/files/name/:filename`
- **Method:** `GET`
- **Description:** Retrieve a single file by its filename.
- **Auth required:** No
- **URL Parameters:**
  - `filename` — File name (string)
- **Response:**
  - **Status 200 OK**  
    JSON object with file details.
  - **Status 404 Not Found** if file does not exist.

- **Example curl:**

```bash
curl -X GET http://<host>:4000/files/name/example.pdf
```

---

### 4. Upload a File (Create)

- **URL:** `/files`
- **Method:** `POST`
- **Description:** Upload a new file and store its metadata.
- **Auth required:** Yes, API Key in `x-api-key` header
- **Request Body:** `application/json`

```json
{
  "filename": "example.pdf",
  "mime_type": "application/pdf",
  "url": "https://example.com/files/example.pdf",
  "uploaded_by": "user123"
}
```

- **Validation:**
  - `filename`: required, string, 1-255 chars
  - `mime_type`: required, string, 1-100 chars
  - `url`: required, must be a valid URI
  - `uploaded_by`: required, string, non-empty

- **Response:**
  - **Status 201 Created**  
    Returns the created file metadata object.
  - **Status 400 Bad Request** if validation fails or fields are missing.

Example response:

```json
{
  "id": 42,
  "filename": "example.pdf",
  "mime_type": "application/pdf",
  "url": "https://example.com/files/example.pdf",
  "uploaded_by": "user123",
  "created_at": "2025-06-18T12:00:00Z"
}
```

- **Example curl:**

```bash
curl -X POST http://<host>:4000/files \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-very-secret-api-key" \
  -d '{
    "filename": "example.pdf",
    "mime_type": "application/pdf",
    "url": "https://example.com/files/example.pdf",
    "uploaded_by": "user123"
  }'
```

---

### 5. Update a File

- **URL:** `/files/:id`
- **Method:** `PUT`
- **Description:** Update metadata of an existing file. At least one field required.
- **Auth required:** Yes, API Key in `x-api-key` header
- **URL Parameters:**
  - `id` — File ID (integer)
- **Request Body:** `application/json`

```json
{
  "filename": "newname.pdf",
  "mime_type": "application/pdf",
  "url": "https://example.com/files/newname.pdf"
}
```

- All fields are optional but at least one must be present.
- Validation:
  - `filename`: optional, string, 1-255 chars
  - `mime_type`: optional, string, 1-100 chars
  - `url`: optional, valid URI
- **Response:**
  - **Status 200 OK** with updated file object
  - **Status 400 Bad Request** if validation fails
  - **Status 404 Not Found** if file ID does not exist

- **Example curl:**

```bash
curl -X PUT http://<host>:4000/files/42 \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-very-secret-api-key" \
  -d '{
    "filename": "newname.pdf",
    "mime_type": "application/pdf",
    "url": "https://example.com/files/newname.pdf"
  }'
```

---

### 6. Delete a File

- **URL:** `/files/:id`
- **Method:** `DELETE`
- **Description:** Delete a file by its ID.
- **Auth required:** Yes, API Key in `x-api-key` header
- **URL Parameters:**
  - `id` — File ID (integer)
- **Response:**
  - **Status 204 No Content** on success
  - **Status 404 Not Found** if file does not exist

- **Example curl:**

```bash
curl -X DELETE http://<host>:4000/files/42 \
  -H "x-api-key: your-very-secret-api-key"
```

---

## Errors

- `400 Bad Request` — Validation or missing required fields
- `401 Unauthorized` — Missing or invalid API key on write operations
- `404 Not Found` — File not found for get/update/delete
- `500 Internal Server Error` — Unexpected server error

---

## Notes

- The service caches GET requests for 1 hour (3600 seconds) in Redis.
- After file creation, update, or deletion, the cache for relevant keys is invalidated to keep data fresh.
- All timestamps are in ISO 8601 format UTC.
- The `uploaded_by` field is assumed to be a user identifier (ID or username).

---
