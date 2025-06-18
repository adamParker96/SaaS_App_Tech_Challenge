
# Backend Deployment Guide on AWS ECS

## Overview
This guide explains how to deploy the services (Auth, User, Knowledge Page, File) on AWS using ECS (Elastic Container Service).

### Prerequisites
- AWS Account with necessary permissions.
- AWS CLI installed and configured.
- Docker installed on your local machine.
- AWS ECR (Elastic Container Registry) for storing Docker images.
- AWS ECS Cluster for managing microservices.

---

## Step 1: Dockerizing the Microservices

Each microservice should have a `Dockerfile` to build a Docker image. Below is an example `Dockerfile` for each microservice.

### Example Dockerfile (for all services)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]
```

Ensure this `Dockerfile` is present in each service directory.

---

## Step 2: Building Docker Images and Pushing to AWS ECR

### 2.1: Create ECR Repositories for Each Microservice

1. Go to **ECR Console** and create a repository for each microservice (Auth, User, Knowledge Page, File).
2. Get the login command for Docker to authenticate with ECR:
   ```bash
   aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com
   ```

### 2.2: Build Docker Images

1. Navigate to each microservice's root directory.
2. Build the Docker image for each service:
   ```bash
   docker build -t <microservice-name> .
   ```
3. Tag the Docker image to match your ECR repository:
   ```bash
   docker tag <microservice-name>:latest <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/<microservice-name>:latest
   ```

### 2.3: Push Docker Image to ECR

1. Push the image to your ECR repository:
   ```bash
   docker push <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/<microservice-name>:latest
   ```

Repeat for each microservice.

---

## Step 3: Creating ECS Task Definitions

Each microservice needs an ECS Task Definition to specify how the service runs on ECS.

### 3.1: Create Task Definitions

1. Go to **ECS Console** and select **Task Definitions**.
2. Click **Create new Task Definition**, and select **Fargate**.
3. For each microservice, configure the task definition:
   - **Task name**: Choose a name for the microservice.
   - **Container name**: The Docker container name.
   - **Image**: The ECR image URL for your service.
   - **Port mapping**: The appropriate port for the service.
   - **Memory and CPU**: Set the resource limits based on service requirements.

Repeat this process for each microservice.

---

## Step 4: Create ECS Services

### 4.1: Set Up ECS Cluster

1. Go to **ECS Console** and create a new **Fargate Cluster**.
2. Choose **Networking Only** for the launch type.
3. Configure the cluster settings.

### 4.2: Create ECS Services

1. In your ECS Cluster, click **Create** to create a new service.
2. Select **Fargate** as the launch type, then configure the service:
   - **Service name**: Name of the microservice.
   - **Task definition**: Choose the Task Definition created earlier.
   - **Cluster**: Select the ECS cluster created above.
   - **Desired count**: Number of instances of the service to run.
   - **VPC & Subnets**: Choose the appropriate VPC and subnet.

Repeat this process for each microservice.

---

## Step 5: Configuring Load Balancer (Optional)

If you wish to expose your services via a load balancer:

1. **Create an Application Load Balancer (ALB)** in the EC2 console.
2. **Create a target group** for each service (Auth, User, Knowledge Page, File).
3. **Add ECS services** to the corresponding target groups.
4. **Configure listener rules** to route traffic to the correct service based on URL paths (e.g., `/auth`, `/users`).

---

## Step 6: Configuring DNS (Optional)

If you have a custom domain:

1. Set up **Route 53** or another DNS service to point your domain to the ALB for backend services.

---

## Conclusion

Once all the steps are completed, your backend microservices will be up and running on ECS. Optionally, you can configure the ALB for routing, and DNS for domain mapping.
