# SaaS_App_Tech_Challenge
For my interview with Autodesk, I was asked to design and create a SaaS application that met their criteria. I created a Knowledge Base tool (Confluence-esque) that uses an API-based backend to retrieve, create, and update data for frontend viewing.

High Level overview:
![Application Architecture Diagram](https://github.com/user-attachments/assets/7a1872be-9c66-469d-a765-b7b82058944f)

Our Tech Stack:

Frontend Framework: Written in React with TailwindCSS

Backend Framework: Written in Node.js + Express

Authorization:	Okta OIDC + JWT

DB:	PostgreSQL (created w/ RDS)

Cache:	Redis

Containerization:	Docker + ECS

Cloud Services:	AWS ECS, AWS S3, AWS ALB, AWS RDS, Cloudfront, Okta, Redis


The User begins by accessing our website. They are then asked to login via Okta, and are redirected to the Okta login page. After successfully logging in, the Okta callback redirects our user to the homepage, where they can access the KB data by making calls to our backend via our APIs.

There are 3 sets of APIS for our 3 services that make up our backend - an Article service for pulling the articles themselves out of our DB, creating articles and uploading them, and updating them.
