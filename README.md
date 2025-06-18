# SaaS_App_Tech_Challenge
For my interview with Autodesk, I was asked to design and create a SaaS application that met their criteria. I created a Knowledge Base tool (Confluence-esque) that uses an API-based backend to retrieve, create, and update data for frontend viewing. I had one week to do this.

---------------------------------------------------------

## High Level overview:

![Application Architecture Diagram](https://github.com/user-attachments/assets/ec32d0ae-a2f4-4bc8-94c5-c91508b63ad8)


---------------------------------------------------------

## Flow:

The KnowledgeBase uses a React app hosted on S3 + Cloudfront to dynamically pull data from our backend, 3 dockerized services written in Node.js + Express that are hosted on an ECS cluster. 
It is locked behind our Auth service, which redirects a user to login via Okta before being redirected to the KnowledgeBase after a successful callback. 
Once they have returned to the KnowledgeBase, they can make API calls to our backend and create, retrieve, update, and delete data.

---------------------------------------------------------


## Our Tech Stack:

Frontend Framework: Written in React with TailwindCSS

Backend Framework: Written in Node.js + Express

Authorization:	Okta OIDC + JWT

DB:	PostgreSQL (created w/ RDS)

Cache:	Redis

Containerization:	Docker + ECS

Cloud Services:	AWS ECS, AWS S3, AWS ALB, AWS RDS, AWS ECR, Cloudfront, Okta, Redis

---------------------------------------------------------

## User Authentication:

Upon first accessing the KnowledgeBase, the user is asked to login via Okta - upon successful login, Okta will return a JWT (JSON Web Token) for us - we verify this using Okta's JWKS endpoint, and upon successful verification the user is redirected to the 'protected' page of the KnowledgeBase.

---------------------------------------------------------

## User Service:

This service allows us to perform CRUD operations on users in our 'Users' table. 

API Documentation can be found in /apps/backend/src/services/user-service

---------------------------------------------------------

## Article Service:

This service allows users to perform CRUD operations on articles in our 'Articles' table. 

API Documentation can be found in /apps/backend/src/services/article-service

---------------------------------------------------------

## File Service:

This service allows users to perform CRUD operations on files in our 'Files' table. 

API Documentation can be found in /apps/backend/src/services/file-service

---------------------------------------------------------

## Slack integration:

Whenever a user attempts to input data that doesn't meet validation checks set in our JOI schema, an alert is sent to a Slack group (in this scenario it's ITSEC) alerting them that someone is attempting to pass invalid data to our DB.

---------------------------------------------------------

## Security:

Data is protected in transit via HTTPS - our frontend is hosted in S3 and distributed via CloudFront (AWS's Contend Delivery Network), which gives us HTTPS support, and our backend is hosted on ECS with ALB (Application Load Balancing) configured, giving us HTTPS support.

Data at rest is protected natively by AWS - S3 encrypts all its stored data.

Currently the routes for each service are set up so that only the user that passes the API key that matches the one in our .env file will be able to make calls to routes that mutate our data (POST, PATCH, DEL) - reading data is public.

### To add: JWT checks on each API call 

Right now the Auth process finishes once the user logs into the frontend via Okta. I'd like to take the JWT that okta returns us and use that to authorize API calls for users, instead of just assuming that the user is good to go after logging in.

(IE: after the user logs into Okta, store the JWT in cookies. Then, take the JWT verification middleware we use in the Auth service (oktaAuth.js) , and implement it into each of our services' routes):

Example:
```
// POST /users - Create a new user
router.post(
  '/',
  checkJWT,
  validateSanitize(createUserSchema, { sanitize: ['name', 'email'] }),
  createUser
);
```
This will make access to our backend much more secure, and allow us to block access to unauthorized parties attempting to access the API without a valid JWT.

Data validation is done using the JOI javascript library and schemas created for each service allowing us to ensure that input matches expected types and formats.

SQL injection is prevented by using parameterized SQL queries (ie await db.query('SELECT * FROM users WHERE id = $1', [id]);) in each of our services' models.

XSS is prevented by using the santize-html javascript library, which allows us to define allowed tags and attributes that can be passed to our backend.

---------------------------------------------------------

## Performance:

We use Redis on ECS as a read-through cache to reduce database load and improve response times for frequently accessed data. This allows us to feed users frequently requested data without hitting our PostgreSQL database.

For our database, we use indexing to speed up data retrieval by marking important keys as indexes, allowing us to avoid scanning every row in a table for results. (Please see the infra/amazons-rds/init.sql for more)

Example:
```
-- Index for filtering by user
CREATE INDEX idx_files_user_id ON files (user_id);
```

---------------------------------------------------------

## Deployment: 

Deployment information for the frontend and backend can be found in their respective /source/ folders. Instructions on how to setup and create our PostgreSQL database via RDS can be found in /infra/amazon-rds/.

---------------------------------------------------------

## Known Issues:

.env and package.json() files based off a boilerplate - need to go through and make sure that the correct ports are exposed and the correct paths are being referenced.

---------------------------------------------------------

## If I had more time (TODO):

Currently there is only one API key that is allowed to make mutating calls to our service - creating a database of API keys and their corresponding users will allow us to have more granular access control.

File upload validation not currently implemented - I would like to make it so that only specific file types are allowed for upload, and that those files get scanned before being uploaded to our S3 bucket(s).

Roles for users - this would allow us to implement RBAC into the system

Slack notifications only send when someone attempts to send bad data to the User API - i would like to implement this feature into the Files and Articles APIs as well.

Frontend - super bare bones, currently just lets users make API calls and downloads the data for them. Would like to add a search feature, and also create a page that dynamically displays data depending on what the user searched for.

Miro - I'd like to create a page in the frontend where users can create pages via the frontend, including allowing them to connect to Miro and import flowcharts into our File table.


