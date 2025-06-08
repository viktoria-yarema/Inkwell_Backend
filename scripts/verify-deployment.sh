#!/bin/bash

# Deployment verification script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVICE_URL=${1:-""}
MAX_RETRIES=${2:-10}
RETRY_DELAY=${3:-10}

if [ -z "$SERVICE_URL" ]; then
    echo -e "${RED}❌ Usage: $0 <SERVICE_URL> [MAX_RETRIES] [RETRY_DELAY]${NC}"
    echo -e "${YELLOW}Example: $0 https://your-service.run.app 10 10${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Verifying deployment at: $SERVICE_URL${NC}"

# Function to test health endpoint
test_health() {
    local url="$1/health"
    echo "Testing health endpoint: $url"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" "$url" || echo "HTTPSTATUS:000;TIME:0")
    http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    time_total=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*;TIME:[0-9.]*$//')
    
    echo "HTTP Status: $http_code"
    echo "Response Time: ${time_total}s"
    echo "Response Body: $body"
    
    if [ "$http_code" -eq 200 ] && echo "$body" | grep -q "healthy\|ok"; then
        return 0
    else
        return 1
    fi
}

# Test health endpoint with retries
echo -e "${YELLOW}🏥 Testing health endpoint with retries...${NC}"
for i in $(seq 1 $MAX_RETRIES); do
    echo -e "${YELLOW}Attempt $i/$MAX_RETRIES...${NC}"
    
    if test_health "$SERVICE_URL"; then
        echo -e "${GREEN}✅ Health check passed on attempt $i${NC}"
        HEALTH_SUCCESS=true
        break
    else
        echo -e "${RED}❌ Health check failed on attempt $i${NC}"
        if [ $i -eq $MAX_RETRIES ]; then
            echo -e "${RED}❌ Health check failed after $MAX_RETRIES attempts${NC}"
            exit 1
        fi
        echo -e "${YELLOW}Waiting ${RETRY_DELAY}s before retry...${NC}"
        sleep $RETRY_DELAY
    fi
done

# Additional tests
echo -e "${YELLOW}📊 Running additional verification tests...${NC}"

# Test HTTPS
if [[ $SERVICE_URL == https://* ]]; then
    echo -e "${GREEN}✅ HTTPS is properly configured${NC}"
else
    echo -e "${YELLOW}⚠️ Warning: Service is not using HTTPS${NC}"
fi

# Test CORS (if applicable)
echo -e "${YELLOW}🌐 Testing CORS headers...${NC}"
cors_headers=$(curl -s -I -X OPTIONS "$SERVICE_URL/health" | grep -i "access-control" || echo "")
if [ -n "$cors_headers" ]; then
    echo -e "${GREEN}✅ CORS headers present${NC}"
    echo "$cors_headers"
else
    echo -e "${YELLOW}⚠️ No CORS headers detected${NC}"
fi

# Performance check
echo -e "${YELLOW}⚡ Performance check...${NC}"
response_time=$(curl -o /dev/null -s -w '%{time_total}' "$SERVICE_URL/health")
echo "Response time: ${response_time}s"

# Convert to integer for comparison (multiply by 100 to handle decimals)
response_time_int=$(echo "$response_time * 100" | bc -l 2>/dev/null | cut -d. -f1 || echo "0")
if [ "$response_time_int" -gt 500 ]; then  # 5.0 seconds = 500 in our scale
    echo -e "${YELLOW}⚠️ Warning: Response time is slow (${response_time}s)${NC}"
else
    echo -e "${GREEN}✅ Response time is acceptable (${response_time}s)${NC}"
fi

echo -e "${GREEN}🎉 Deployment verification completed successfully!${NC}"
echo -e "${GREEN}🌐 Service URL: $SERVICE_URL${NC}"
echo -e "${GREEN}🔍 Health endpoint: $SERVICE_URL/health${NC}" 