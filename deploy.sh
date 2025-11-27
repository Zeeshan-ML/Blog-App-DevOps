#!/bin/bash

# Blog App Deployment Script for AWS EC2
# This script automates the deployment process

set -e  # Exit on error

echo "========================================"
echo "Blog App Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if Docker is installed
print_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Compose is installed
print_info "Checking Docker Compose installation..."
if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed"

# Get Docker Hub username
echo ""
read -p "Enter your Docker Hub username: " DOCKER_USERNAME
if [ -z "$DOCKER_USERNAME" ]; then
    print_error "Docker Hub username is required"
    exit 1
fi

# Get EC2 Public IP (optional)
echo ""
read -p "Enter your EC2 Public IP (press Enter to skip for local deployment): " EC2_IP

# Create necessary directories
print_info "Creating required directories..."
mkdir -p data backups
print_success "Directories created"

# Build Docker image
echo ""
print_info "Building Docker image..."
docker build -t $DOCKER_USERNAME/blog-app:latest .
print_success "Docker image built successfully"

# Ask if user wants to push to Docker Hub
echo ""
read -p "Do you want to push the image to Docker Hub? (y/n): " PUSH_IMAGE
if [ "$PUSH_IMAGE" = "y" ] || [ "$PUSH_IMAGE" = "Y" ]; then
    print_info "Logging in to Docker Hub..."
    docker login
    
    print_info "Pushing image to Docker Hub..."
    docker push $DOCKER_USERNAME/blog-app:latest
    print_success "Image pushed to Docker Hub"
fi

# Update docker-compose.yml with the image name
print_info "Updating docker-compose.yml..."
if [ -f docker-compose.yml ]; then
    # Create a temporary file with updated image name
    sed "s|image: <your-dockerhub-username>/blog-app:latest|image: $DOCKER_USERNAME/blog-app:latest|g" docker-compose.yml > docker-compose.tmp
    mv docker-compose.tmp docker-compose.yml
    print_success "docker-compose.yml updated"
fi

# Update environment variables if EC2 IP provided
if [ ! -z "$EC2_IP" ]; then
    print_info "Updating environment variables with EC2 IP..."
    sed -i "s|NEXT_PUBLIC_BASE_URL=http://localhost:3000|NEXT_PUBLIC_BASE_URL=http://$EC2_IP:3000|g" docker-compose.yml
    print_success "Environment variables updated"
fi

# Start containers
echo ""
read -p "Do you want to start the application now? (y/n): " START_APP
if [ "$START_APP" = "y" ] || [ "$START_APP" = "Y" ]; then
    print_info "Starting containers..."
    docker compose up -d
    print_success "Containers started successfully"
    
    echo ""
    echo "========================================"
    echo "Deployment Complete!"
    echo "========================================"
    echo ""
    if [ -z "$EC2_IP" ]; then
        echo "Access your application at: http://localhost:3000"
    else
        echo "Access your application at: http://$EC2_IP:3000"
    fi
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker compose logs -f"
    echo "  Stop app:     docker compose down"
    echo "  Restart app:  docker compose restart"
    echo ""
fi

print_success "Script completed successfully!"
