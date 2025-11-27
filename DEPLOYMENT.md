<!-- File: blog-app/DEPLOYMENT.md -->
# Docker Deployment Guide for Blog Application

This guide provides comprehensive instructions for containerizing and deploying the Blog Application using Docker on AWS EC2.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Application Architecture](#application-architecture)
3. [Local Development with Docker](#local-development-with-docker)
4. [Building and Pushing to Docker Hub](#building-and-pushing-to-docker-hub)
5. [AWS EC2 Deployment](#aws-ec2-deployment)
6. [Volume Management](#volume-management)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software
- Docker Desktop (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Docker Hub account
- AWS Account with EC2 access
- Git (for version control)

### Knowledge Requirements
- Basic understanding of Docker and containerization
- Familiarity with AWS EC2
- Basic Linux/Unix command line knowledge

---

## 🏗️ Application Architecture

### Components

```
┌─────────────────────────────────────────┐
│         Docker Compose Stack            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌───────────────┐  │
│  │   Web App    │   │  DB Backup    │  │
│  │  (Next.js)   │   │  (Alpine)     │  │
│  │              │   │               │  │
│  │  Port: 3000  │   │  Backup       │  │
│  └──────┬───────┘   │  Service      │  │
│         │           └───────┬───────┘  │
│         │                   │          │
│         └───────┬───────────┘          │
│                 │                      │
│         ┌───────▼────────┐             │
│         │  blog-data     │             │
│         │  (Volume)      │             │
│         │                │             │
│         │  SQLite DB     │             │
│         └────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

### Container Details

1. **Web Application Container**
   - Base Image: `node:18-alpine`
   - Framework: Next.js 15
   - Database: SQLite (better-sqlite3)
   - Port: 3000
   - Health Check: Built-in HTTP endpoint monitoring

2. **Database Backup Container**
   - Base Image: `alpine:latest`
   - Purpose: Demonstrates volume persistence and automated backups
   - Backup Interval: Every hour
   - Backup Location: `/backups` volume

### Persistent Volumes

- **blog-data**: Stores the SQLite database file (`blog.db`)
  - Mount Point (Container): `/app/data`
  - Mount Point (Host): `./data`
  
- **blog-backups**: Stores database backups
  - Mount Point (Container): `/backups`
  - Mount Point (Host): `./backups`

---

## 🚀 Local Development with Docker

### Step 1: Verify Docker Installation

```bash
docker --version
docker-compose --version
```

### Step 2: Create Required Directories

```bash
# Create directories for volumes
mkdir -p data backups
```

### Step 3: Build and Run with Docker Compose

```bash
# Build the Docker image
docker-compose build

# Start the containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check container status
docker-compose ps
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Step 5: Verify Database Persistence

```bash
# Create a user and blog post in the application

# Stop containers
docker-compose down

# Restart containers
docker-compose up -d

# Data should persist - verify by logging in with same credentials
```

### Step 6: Stop the Application

```bash
# Stop and remove containers (data persists in volumes)
docker-compose down

# Stop and remove containers with volumes (removes all data)
docker-compose down -v
```

---

## 🐳 Building and Pushing to Docker Hub

### Step 1: Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password
```

### Step 2: Build the Image

```bash
# Replace <your-dockerhub-username> with your actual Docker Hub username
docker build -t <your-dockerhub-username>/blog-app:latest .

# Example:
# docker build -t johndoe/blog-app:latest .
```

### Step 3: Tag the Image (Optional)

```bash
# Create additional tags (version numbers)
docker tag <your-dockerhub-username>/blog-app:latest <your-dockerhub-username>/blog-app:v1.0.0
```

### Step 4: Push to Docker Hub

```bash
# Push latest tag
docker push <your-dockerhub-username>/blog-app:latest

# Push version tag
docker push <your-dockerhub-username>/blog-app:v1.0.0
```

### Step 5: Verify on Docker Hub

Visit https://hub.docker.com and verify your image is published.

### Step 6: Update docker-compose.yml for Production

For production deployment, update the `docker-compose.yml`:

```yaml
services:
  web:
    image: <your-dockerhub-username>/blog-app:latest  # Use your image
    # Remove the 'build' section
    container_name: blog-app-web
    # ... rest of the configuration
```

---

## ☁️ AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
   - Navigate to EC2 Dashboard
   - Click "Launch Instance"

2. **Choose AMI**
   - Select **Ubuntu Server 22.04 LTS** or **Amazon Linux 2023**
   - Architecture: 64-bit (x86)

3. **Choose Instance Type**
   - Minimum: `t2.micro` (Free Tier eligible)
   - Recommended: `t2.small` or `t3.small` for better performance

4. **Configure Instance**
   - Keep default VPC settings
   - Enable "Auto-assign Public IP"

5. **Add Storage**
   - Minimum: 8 GB
   - Recommended: 20 GB for application and data

6. **Configure Security Group**
   - Create new security group with the following rules:

   | Type  | Protocol | Port Range | Source    | Description           |
   |-------|----------|------------|-----------|-----------------------|
   | SSH   | TCP      | 22         | Your IP   | SSH access            |
   | HTTP  | TCP      | 80         | 0.0.0.0/0 | HTTP access           |
   | Custom| TCP      | 3000       | 0.0.0.0/0 | Application port      |

7. **Create/Select Key Pair**
   - Create new key pair or use existing
   - Download `.pem` file (keep it secure!)
   - Save as `blog-app-key.pem`

8. **Launch Instance**
   - Click "Launch Instance"
   - Note the Public IP address

### Step 2: Connect to EC2 Instance

**For Linux/Mac:**
```bash
# Set key permissions
chmod 400 blog-app-key.pem

# Connect via SSH
ssh -i blog-app-key.pem ubuntu@<EC2-PUBLIC-IP>

# For Amazon Linux:
# ssh -i blog-app-key.pem ec2-user@<EC2-PUBLIC-IP>
```

**For Windows (using PowerShell):**
```powershell
# Connect via SSH
ssh -i blog-app-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Step 3: Install Docker on EC2

**For Ubuntu:**
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply group changes (re-login or run)
newgrp docker

# Verify installation
docker --version
docker compose version
```

**For Amazon Linux:**
```bash
# Update packages
sudo yum update -y

# Install Docker
sudo yum install -y docker

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 4: Deploy Application on EC2

```bash
# Create application directory
mkdir -p ~/blog-app
cd ~/blog-app

# Create docker-compose.yml file
nano docker-compose.yml
```

**Paste the following content** (update with your Docker Hub username):

```yaml
version: '3.8'

services:
  web:
    image: <your-dockerhub-username>/blog-app:latest
    container_name: blog-app-web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=http://<EC2-PUBLIC-IP>:3000
    volumes:
      - blog-data:/app/data
    restart: unless-stopped
    networks:
      - blog-network

  db-backup:
    image: alpine:latest
    container_name: blog-db-backup
    volumes:
      - blog-data:/data
      - blog-backups:/backups
    command: >
      sh -c "
      while true; do
        echo 'Database volume is persistent';
        if [ -f /data/blog.db ]; then
          cp /data/blog.db /backups/blog-backup-$$(date +%Y%m%d-%H%M%S).db 2>/dev/null || true;
        fi;
        sleep 3600;
      done
      "
    restart: unless-stopped
    networks:
      - blog-network

volumes:
  blog-data:
    driver: local
  blog-backups:
    driver: local

networks:
  blog-network:
    driver: bridge
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5: Start the Application

```bash
# Create volume directories
mkdir -p data backups

# Pull the image from Docker Hub
docker compose pull

# Start containers in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Check container status
docker compose ps
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://<EC2-PUBLIC-IP>:3000
```

Replace `<EC2-PUBLIC-IP>` with your actual EC2 instance public IP.

### Step 7: Configure Nginx as Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/blog-app
```

**Paste the following:**

```nginx
server {
    listen 80;
    server_name <EC2-PUBLIC-IP>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/blog-app /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

Now access your application at:
```
http://<EC2-PUBLIC-IP>
```

---

## 💾 Volume Management

### Understanding Volumes

The application uses **named Docker volumes** for data persistence:

1. **blog-data**: Stores SQLite database
   - Location (Container): `/app/data`
   - Contains: `blog.db`
   
2. **blog-backups**: Stores database backups
   - Location (Container): `/backups`
   - Contains: Timestamped backup files

### Volume Operations

**List Volumes:**
```bash
docker volume ls
```

**Inspect Volume:**
```bash
docker volume inspect blog-app_blog-data
```

**Backup Database Manually:**
```bash
# Copy database from container to host
docker cp blog-app-web:/app/data/blog.db ./blog-backup-$(date +%Y%m%d).db
```

**Restore Database:**
```bash
# Stop application
docker compose down

# Copy backup to volume
docker cp ./blog-backup-20251126.db blog-app-web:/app/data/blog.db

# Start application
docker compose up -d
```

**View Backup Container Logs:**
```bash
docker logs blog-db-backup
```

**Access Volume Data:**
```bash
# Run temporary container to access volume
docker run --rm -v blog-app_blog-data:/data alpine ls -lah /data
```

### Persistent Volume Demonstration

**Test Data Persistence:**

```bash
# 1. Create a blog post in the application

# 2. Stop all containers
docker compose down

# 3. Remove containers (volumes remain)
docker compose rm -f

# 4. Start fresh containers
docker compose up -d

# 5. Data should still be present - login and verify your blog post exists
```

**Complete Data Reset:**
```bash
# WARNING: This removes all data
docker compose down -v
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use
```

**Solution:**
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process or change port in docker-compose.yml
# Change "3000:3000" to "8080:3000"
```

#### 2. Container Fails to Start

**Check logs:**
```bash
docker compose logs web
```

**Common causes:**
- Database path not writable
- Node modules not installed
- Port conflicts

#### 3. Database File Not Found

**Solution:**
```bash
# Ensure data directory exists
mkdir -p data

# Check volume mount
docker inspect blog-app-web | grep Mounts -A 10

# Restart containers
docker compose restart
```

#### 4. Cannot Connect to Application

**Check container status:**
```bash
docker compose ps
```

**Check if container is healthy:**
```bash
docker inspect blog-app-web | grep -A 5 Health
```

**Check AWS Security Group:**
- Ensure port 3000 is open in Security Group
- Verify EC2 instance has public IP

#### 5. Docker Build Fails

**Clear cache and rebuild:**
```bash
docker compose build --no-cache
```

**Check Dockerfile syntax:**
```bash
docker build -t test-build .
```

#### 6. Volume Permission Issues

**Solution:**
```bash
# Change ownership on host
sudo chown -R $USER:$USER data backups

# Or run container as root (not recommended)
```

### Monitoring Commands

**View real-time logs:**
```bash
docker compose logs -f --tail=100
```

**Check resource usage:**
```bash
docker stats
```

**Check network:**
```bash
docker network ls
docker network inspect blog-app_blog-network
```

**Container shell access:**
```bash
docker exec -it blog-app-web sh
```

---

## 📊 Performance Optimization

### Production Recommendations

1. **Use Multi-Stage Builds** ✅ (Already implemented)
   - Reduces image size
   - Improves security

2. **Health Checks** ✅ (Already implemented)
   - Monitors container health
   - Auto-restart on failure

3. **Resource Limits**
   ```yaml
   services:
     web:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
           reservations:
             cpus: '0.5'
             memory: 256M
   ```

4. **Logging Configuration**
   ```yaml
   services:
     web:
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"
   ```

---

## 🔒 Security Best Practices

1. ✅ **Non-root User**: Dockerfile uses non-root user `nextjs`
2. ✅ **Minimal Base Image**: Uses `alpine` for smaller attack surface
3. ✅ **Environment Variables**: Sensitive data in environment variables
4. ⚠️ **HTTPS**: Configure SSL/TLS for production (use Let's Encrypt)
5. ⚠️ **AWS Security Groups**: Restrict SSH to your IP only
6. ⚠️ **Regular Updates**: Keep Docker and dependencies updated

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Hub](https://hub.docker.com/)

---

## 🎯 Assignment Completion Checklist

- ✅ Dockerfile created (multi-stage build)
- ✅ Docker Compose file created
- ✅ Database container with persistent volume
- ✅ Application containerized and tested locally
- ✅ Image pushed to Docker Hub
- ✅ Deployment guide for AWS EC2
- ✅ Volume persistence demonstrated
- ✅ Documentation complete

---

## 📝 Notes

- **Database**: SQLite is used for simplicity. For production, consider PostgreSQL or MySQL.
- **Backups**: Automated hourly backups via backup container.
- **Scaling**: Current setup is single-instance. For horizontal scaling, use external database.
- **Monitoring**: Consider adding monitoring tools (Prometheus, Grafana) for production.

---

**Last Updated**: November 26, 2025
**Version**: 1.0.0
