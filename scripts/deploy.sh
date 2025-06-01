#!/bin/bash

# Deployment script for Google Cloud Run
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-"inkwell-447220"}
SERVICE_NAME=${SERVICE_NAME:-"inkwell-dev"}
REGION=${REGION:-"europe-west10"}
REPOSITORY=${REPOSITORY:-"inkwell-repo"}
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME"

echo -e "${YELLOW}Starting deployment process...${NC}"
echo -e "${YELLOW}Project ID: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Service Name: ${SERVICE_NAME}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Repository: ${REPOSITORY}${NC}"

# Check current authentication
CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null || echo "none")
echo -e "${YELLOW}Current account: ${CURRENT_ACCOUNT}${NC}"

# If authenticated as service account, switch to user account
if [[ "$CURRENT_ACCOUNT" == *"@"*".iam.gserviceaccount.com" ]]; then
    echo -e "${YELLOW}Currently authenticated as service account. Switching to user account for deployment...${NC}"
    echo -e "${YELLOW}Please authenticate with your Google user account:${NC}"
    gcloud auth login --no-activate-service-account
    
    # Verify we're now using user account
    USER_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -v "gserviceaccount.com" | head -1)
    if [ -z "$USER_ACCOUNT" ]; then
        echo -e "${RED}Error: No user account found. Please run 'gcloud auth login' manually.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Now using user account: ${USER_ACCOUNT}${NC}"
    gcloud config set account "$USER_ACCOUNT"
fi

# Set the project
echo -e "${YELLOW}Setting Google Cloud project to ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet
gcloud services enable secretmanager.googleapis.com --quiet

# Create Artifact Registry repository if it doesn't exist
echo -e "${YELLOW}Creating Artifact Registry repository (if needed)...${NC}"
gcloud artifacts repositories create ${REPOSITORY} \
    --repository-format=docker \
    --location=${REGION} \
    --project=${PROJECT_ID} 2>/dev/null || echo "Repository already exists or creation failed (this is ok if it exists)"

# Configure Docker for Artifact Registry
echo -e "${YELLOW}Configuring Docker for Artifact Registry...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Build the Docker image for linux/amd64 platform (required for Cloud Run)
echo -e "${YELLOW}Building Docker image for linux/amd64 platform...${NC}"
docker buildx build --platform linux/amd64 -t ${IMAGE_NAME}:latest .

# Tag with timestamp for versioning
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${TIMESTAMP}

# Push the image to Artifact Registry
echo -e "${YELLOW}Pushing image to Artifact Registry...${NC}"
docker push ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:${TIMESTAMP}

# Deploy to Cloud Run
echo -e "${YELLOW}Deploying to Google Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME}:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1000m \
    --max-instances 10 \
    --min-instances 0 \
    --port 8080 \
    --timeout 300s \
    --concurrency 80 \
    --service-account="inkwell-bucket@${PROJECT_ID}.iam.gserviceaccount.com" \
    --quiet

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Service URL: ${SERVICE_URL}${NC}"
echo -e "${GREEN}Health check: ${SERVICE_URL}/health${NC}"

# Test the health endpoint
echo -e "${YELLOW}Testing health endpoint...${NC}"
sleep 10  # Give the service a moment to start
if curl -f -s "${SERVICE_URL}/health" > /dev/null; then
    echo -e "${GREEN}Health check passed!${NC}"
else
    echo -e "${RED}Health check failed. Please check the logs.${NC}"
    echo "View logs with: gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}\" --limit=20 --project=${PROJECT_ID}"
fi 