
# Frontend Deployment Guide on AWS S3 and CloudFront


### Prerequisites
- AWS Account with necessary permissions.
- AWS CLI installed and configured.
- Docker (optional for building images).
- A React frontend application ready for production.

---

## Step 1: Build the React Application

1. Navigate to the root directory of your frontend project.
2. Run the following command to create a production build:
   ```bash
   npm run build
   ```

This will generate a `build/` directory containing all the static files needed for deployment.

---

## Step 2: Create an S3 Bucket

1. **Go to S3 Console** and click **Create bucket**.
2. Provide a unique name for the bucket and select the AWS region where the bucket will reside.
3. Under **Bucket settings for Block Public Access**, uncheck the options to allow public access. You'll be prompted to confirm this change.
4. In the **Properties** tab, enable **Static Website Hosting**.
   - **Index document**: `index.html`
   - **Error document**: `index.html` (this allows your app to handle client-side routing)
5. **Save the bucket settings**.

---

## Step 3: Upload Build Files to S3

1. Open the `build/` directory created earlier by running `npm run build`.
2. Go to your S3 bucket, click on **Upload**, and select all files and folders inside the `build/` directory.
3. Make sure that the files are set to be publicly accessible. You can do this by selecting **Grant public read access to this object(s)** during the upload.

---

## Step 4: Configure CloudFront

CloudFront helps to serve your static files with better performance and caching.

1. **Go to the CloudFront Console** and click **Create Distribution**.
2. For the **Web** distribution, select your S3 bucket as the origin.
3. Configure the distribution settings (you can leave most options as default).
4. Once the distribution is created, take note of the **CloudFront URL** provided.

---

## Step 5: Set Up DNS for Custom Domain (Optional)

1. If you have a custom domain, use **Route 53** or any other DNS provider to point your domain to the CloudFront distribution:
   - Create a **CNAME** record to point `www.yourdomain.com` to the CloudFront URL.

---

