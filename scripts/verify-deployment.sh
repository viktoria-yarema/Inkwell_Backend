#!/bin/bash

# Verification script for deployment
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVICE_URL=${1:-""}

if [ -z "$SERVICE_URL" ]; then
    echo -e "${RED}Usage: $0 <service-url>${NC}"
    echo -e "${YELLOW}Example: $0 https://inkwell-dev-123456-ew.a.run.app${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Verifying deployment at: $SERVICE_URL${NC}"

# Function to test endpoint with retries
test_endpoint() {
    local url=$1
    local endpoint=$2
    local expected_status=${3:-200}
    local max_attempts=10
    local attempt=1

    echo -e "${YELLOW}Testing $endpoint endpoint...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt/$max_attempts: Testing $url$endpoint"
        
        if curl -f -s --max-time 30 "$url$endpoint" >/dev/null; then
            echo -e "${GREEN}✅ $endpoint endpoint responded successfully${NC}"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${RED}❌ $endpoint endpoint failed after $max_attempts attempts${NC}"
            return 1
        fi
        
        sleep 5
        ((attempt++))
    done
}

# Test health endpoint
if test_endpoint "$SERVICE_URL" "/health"; then
    echo -e "${GREEN}Health check passed!${NC}"
else
    echo -e "${RED}Health check failed!${NC}"
    exit 1
fi

# Test response time
echo -e "${YELLOW}📊 Testing response time...${NC}"
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "$SERVICE_URL/health")
echo -e "${YELLOW}Response time: ${RESPONSE_TIME}s${NC}"

# Simple performance check
if command -v python3 >/dev/null 2>&1; then
    if python3 -c "print(float('$RESPONSE_TIME') > 5.0)" 2>/dev/null | grep -q True; then
        echo -e "${YELLOW}⚠️ Warning: Response time is slow (${RESPONSE_TIME}s)${NC}"
    else
        echo -e "${GREEN}✅ Response time is acceptable (${RESPONSE_TIME}s)${NC}"
    fi
fi

# Test HTTPS
if [[ $SERVICE_URL == https://* ]]; then
    echo -e "${GREEN}✅ HTTPS is properly configured${NC}"
else
    echo -e "${YELLOW}⚠️ Warning: Service is not using HTTPS${NC}"
fi

# Test CORS headers
echo -e "${YELLOW}🔐 Testing CORS headers...${NC}"
CORS_HEADERS=$(curl -s -I -H "Origin: https://example.com" "$SERVICE_URL/health" | grep -i "access-control")
if [ -n "$CORS_HEADERS" ]; then
    echo -e "${GREEN}✅ CORS headers are present${NC}"
else
    echo -e "${YELLOW}⚠️ Warning: CORS headers not detected${NC}"
fi

echo -e "${GREEN}🎉 Deployment verification completed!${NC}"
echo -e "${GREEN}Service URL: $SERVICE_URL${NC}"
echo -e "${GREEN}Health endpoint: $SERVICE_URL/health${NC}" 