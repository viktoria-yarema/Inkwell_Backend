# Google Cloud Run Deployment Guide

This guide will walk you through deploying the Inkwell Backend to Google Cloud Run using Docker.

## 🚀 Automated CI/CD with GitHub Actions

The repository includes a comprehensive GitHub Actions workflow that ensures safe and reliable deployments:

### ✅ What happens on Pull Requests:

- **Code Quality Validation**: ESLint, Prettier formatting checks
- **Build Verification**: Compiles TypeScript and verifies output
- **Docker Testing**: Builds container and tests health endpoint
- **PR Summary**: Provides clear feedback on readiness to merge

### 🔄 What happens on Push to Main:

1. **Pre-deployment Validation**: All PR checks run again
2. **Docker Build**: Multi-stage build optimized for production
3. **Google Cloud Deploy**: Pushes to Artifact Registry and deploys to Cloud Run
4. **Health Verification**: Comprehensive post-deployment testing
5. **Auto-Rollback**: Automatically rolls back if deployment fails
6. **Notifications**: Success/failure notifications

### 🛡️ Safety Features:

- **Zero-downtime deployments** with health checks
- **Automatic rollback** on failure
- **Performance monitoring** with response time checks
- **Security validation** (HTTPS, CORS headers)
- **Comprehensive logging** for debugging

### 📊 Using the Workflows:

**For Pull Requests:**

```bash
# Simply create a PR - all checks run automatically
git checkout -b feature/my-new-feature
git commit -m "Add new feature"
git push origin feature/my-new-feature
# Create PR in GitHub - checks will run automatically
```

**For Deployments:**

```bash
# Merge to main - deployment happens automatically
git checkout main
git merge feature/my-new-feature
git push origin main
# Deployment starts automatically and takes ~3-5 minutes
```

**Manual Verification:**

```bash
# Test any deployment manually
npm run verify:deployment https://your-service-url.run.app
```

---

## Prerequisites

1. **Google Cloud SDK**: Install and configure the Google Cloud SDK

   ```bash
   # Install gcloud CLI (if not already installed)
   # macOS
   brew install google-cloud-sdk

   # Ubuntu/Debian
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. **Docker**: Install Docker on your machine

   ```bash
   # macOS
   brew install docker

   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker.io
   ```

3. **Google Cloud Project**: Create a new project in the Google Cloud Console

## Setup Steps

### 1. Authentication and Project Setup

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project ID (replace with your actual project ID)
export PROJECT_ID="inkwell-447220"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Environment Variables Setup

Create secrets in Google Cloud Secret Manager for your environment variables:

```bash
# Create secrets for sensitive data
gcloud secrets create inkwell-jwt-secret --data-file=<(echo -n "your-jwt-secret")
gcloud secrets create inkwell-jwt-refresh-secret --data-file=<(echo -n "your-jwt-refresh-secret")
gcloud secrets create inkwell-db-uri --data-file=<(echo -n "your-mongodb-uri")
gcloud secrets create inkwell-salt --data-file=<(echo -n "your-salt-value")
gcloud secrets create inkwell-storage-bucket --data-file=<(echo -n "your-storage-bucket-name")

# Grant Cloud Run access to secrets
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 3. Service Account Setup (Optional but Recommended)

```bash
# Create a service account for Cloud Run
gcloud iam service-accounts create inkwell-backend \
    --description="Service account for Inkwell Backend" \
    --display-name="Inkwell Backend"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:inkwell-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:inkwell-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

## Deployment Options

### Option 1: Automated Deployment (Recommended)

Use the provided deployment script:

```bash
# Set your project ID (defaults are already configured)
export PROJECT_ID="inkwell-447220"

# Optional: Customize other settings
export SERVICE_NAME="inkwell-dev"
export REGION="europe-west10"

# Run the deployment script
./scripts/deploy.sh
```

### Option 2: Manual Deployment

#### Step 1: Build the Docker Image

```bash
# Build the image
docker build -t gcr.io/inkwell-447220/inkwell-dev:latest .

# Test locally (optional)
docker run -p 8080:8080 \
    -e JWT_SECRET="your-test-secret" \
    -e DB_URI="your-test-db-uri" \
    gcr.io/inkwell-447220/inkwell-dev:latest
```

#### Step 2: Push to Container Registry

```bash
# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker

# Push the image
docker push gcr.io/inkwell-447220/inkwell-dev:latest
```

#### Step 3: Deploy to Cloud Run

```bash
gcloud run deploy inkwell-dev \
    --image gcr.io/inkwell-447220/inkwell-dev:latest \
    --platform managed \
    --region europe-west10 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1000m \
    --max-instances 10 \
    --min-instances 0 \
    --port 8080 \
    --timeout 300s \
    --concurrency 80 \
    --set-env-vars NODE_ENV=production \
    --set-secrets JWT_SECRET=inkwell-jwt-secret:latest \
    --set-secrets JWT_REFRESH_SECRET=inkwell-jwt-refresh-secret:latest \
    --set-secrets DB_URI=inkwell-db-uri:latest \
    --set-secrets SALT=inkwell-salt:latest \
    --set-secrets INKWELL_GOOGLE_STORAGE_BUCKET=inkwell-storage-bucket:latest
```

### Option 3: Using Cloud Build (CI/CD)

Create a `cloudbuild.yaml` file:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/inkwell-backend:$COMMIT_SHA', '.']

  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/inkwell-backend:$COMMIT_SHA']

  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      [
        'run',
        'deploy',
        'inkwell-backend',
        '--image',
        'gcr.io/$PROJECT_ID/inkwell-backend:$COMMIT_SHA',
        '--region',
        'us-central1',
        '--platform',
        'managed',
        '--allow-unauthenticated',
      ]

images:
  - 'gcr.io/$PROJECT_ID/inkwell-backend:$COMMIT_SHA'
```

## Configuration

### Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to "production" for Cloud Run
- `PORT`: Automatically set by Cloud Run (defaults to 8080)
- `JWT_SECRET`: Your JWT signing secret
- `JWT_REFRESH_SECRET`: Your JWT refresh token secret
- `DB_URI`: MongoDB connection string
- `SALT`: Salt for password hashing
- `INKWELL_GOOGLE_STORAGE_BUCKET`: Google Cloud Storage bucket name
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### Resource Limits

The current configuration sets:

- **Memory**: 512Mi
- **CPU**: 1000m (1 vCPU)
- **Max Instances**: 10
- **Min Instances**: 0
- **Concurrency**: 80 requests per instance
- **Timeout**: 300 seconds

## Monitoring and Troubleshooting

### Health Check

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Viewing Logs

```bash
# View recent logs
gcloud logs read --project=$PROJECT_ID --service=inkwell-backend

# Follow logs in real-time
gcloud logs tail --project=$PROJECT_ID --service=inkwell-backend
```

### Debugging Common Issues

1. **Service not starting**: Check environment variables and secrets
2. **Database connection issues**: Verify DB_URI secret and network access
3. **Memory issues**: Increase memory limit in deployment
4. **Timeout issues**: Check database queries and external API calls

### Updating the Deployment

To update your deployment:

```bash
# Build new image with updated code
docker build -t gcr.io/$PROJECT_ID/inkwell-backend:latest .

# Push updated image
docker push gcr.io/$PROJECT_ID/inkwell-backend:latest

# Cloud Run will automatically deploy the new version
# Or trigger manually:
gcloud run services update inkwell-backend --region=us-central1
```

### Custom Domain (Optional)

To set up a custom domain:

```bash
# Map your domain
gcloud run domain-mappings create \
    --service inkwell-backend \
    --domain your-domain.com \
    --region us-central1
```

## Security Considerations

1. **Service Account**: Use a dedicated service account with minimal permissions
2. **Secrets**: Store sensitive data in Google Secret Manager
3. **CORS**: Configure appropriate CORS origins
4. **Authentication**: Implement proper authentication and authorization
5. **HTTPS**: Cloud Run provides HTTPS by default
6. **VPC**: Consider using VPC connector for private resources

## Cost Optimization

1. **CPU Allocation**: Only allocate CPU during request processing
2. **Min Instances**: Set to 0 for cost savings (cold starts acceptable)
3. **Request Limits**: Set appropriate concurrency and timeout values
4. **Monitoring**: Monitor usage and adjust resources accordingly

## Support

For issues specific to this deployment:

1. Check the application logs
2. Verify environment variables and secrets
3. Test the health endpoint
4. Review Google Cloud Run documentation

For Google Cloud Run specific issues, refer to the [official documentation](https://cloud.google.com/run/docs).
