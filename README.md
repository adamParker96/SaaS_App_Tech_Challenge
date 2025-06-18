# SaaS_App_Tech_Challenge
For my interview with Autodesk, I was asked to design and create a SaaS application that met their criteria. I created a Knowledge Base tool (Confluence-esque) that uses an API-based backend to retrieve, create, and update data for frontend viewing.

---------------------------------------------------------

High Level overview:

![Application Architecture Diagram](https://github.com/user-attachments/assets/ec32d0ae-a2f4-4bc8-94c5-c91508b63ad8)

---------------------------------------------------------

Our Tech Stack:

Frontend Framework: Written in React with TailwindCSS

Backend Framework: Written in Node.js + Express

Authorization:	Okta OIDC + JWT

DB:	PostgreSQL (created w/ RDS)

Cache:	Redis

Containerization:	Docker + ECS

Cloud Services:	AWS ECS, AWS S3, AWS ALB, AWS RDS, Cloudfront, Okta, Redis

---------------------------------------------------------

The KnowledgeBase uses a React app hosted on S3 + Cloudfront to dynamically pull data from our backend, 3 dockerized services written in Node.js + Express that are hosted on an ECS cluster. It is locked behind our Auth service, which redirects a user to login via Okta before being redirected to the KnowledgeBase after a successful callback.

---------------------------------------------------------

Auth Service:

Upon first accessing the KnowledgeBase, the user is asked to login via Okta - upon successful login, Okta will return a JWT for us - we verify this using Okta's JWKS endpoint, and upon successful verification the user is redirected to the 'protected' page of the KnowledgeBase.

---------------------------------------------------------

User Service:

This service allows us to perform CRUD operations on users in our 'Users' table
