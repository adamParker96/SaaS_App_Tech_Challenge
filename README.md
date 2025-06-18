# SaaS_App_Tech_Challenge
For my interview with Autodesk, I was asked to design and create a SaaS application that met their criteria. I created a Knowledge Base tool (Confluence-esque) that uses an API-based backend to retrieve, create, and update data for frontend viewing.

High Level overview:
![Application Architecture Diagram](https://github.com/user-attachments/assets/7a1872be-9c66-469d-a765-b7b82058944f)

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

User Service:

Allows us to perform CRUD operations users from our DB.
