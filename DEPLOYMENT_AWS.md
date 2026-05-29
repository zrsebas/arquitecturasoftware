# AWS Academy Deployment Guide - SportCore Microservices

## 📋 Overview

This guide explains how to deploy the SportCore microservices architecture to AWS Academy using Docker Compose.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Nginx (API Gateway)              │
│         Port 80 - Public Entry Point           │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌──────────────┐      ┌────────────────┐
│   Django     │      │  Flask (MS)    │
│  (Monolito)  │      │  Productos     │
│  Port 8000   │      │  Port 5001     │
└──────────────┘      └────────────────┘
        ↓                       ↓
┌──────────────┐      ┌────────────────┐
│  Flask (MS)  │      │  Flask (MS)    │
│  Pedidos     │      │  (Future)      │
│  Port 5002   │      │                │
└──────────────┘      └────────────────┘
        ↓                       ↓
┌──────────────┐      ┌────────────────┐
│  PostgreSQL  │      │  Redis + Celery│
│  Port 5432   │      │  Port 6379     │
└──────────────┘      └────────────────┘
```

## 🚀 Prerequisites

1. **AWS Academy Account** with EC2 access
2. **Docker** installed on local machine
3. **Docker Compose** installed
4. **SSH Key** for AWS EC2 access

## 📦 Deployment Steps

### Step 1: Prepare the Project

1. Clone the repository:
```bash
git clone https://github.com/zrsebas/arquitecturasoftware.git
cd arquitecturasoftware
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
DB_NAME=sportcore
DB_USER=sportcore
DB_PASSWORD=sportcore123
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-ec2-public-ip,localhost
```

### Step 2: Build Docker Images Locally

```bash
docker-compose build
```

### Step 3: Test Locally

```bash
docker-compose up -d
```

Verify all services are running:
```bash
docker-compose ps
```

Test endpoints:
- http://localhost:80 - Nginx Gateway
- http://localhost:8000 - Django
- http://localhost:5001 - Productos MS
- http://localhost:5002 - Pedidos MS

### Step 4: Deploy to AWS Academy

#### 4.1 Launch EC2 Instance

1. Log in to AWS Academy
2. Go to EC2 Dashboard
3. Click "Launch Instance"
4. Configure:
   - **Name**: SportCore-Microservices
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.medium (or as allocated)
   - **Key Pair**: Select or create your key pair
   - **Security Group**: Allow ports 80, 443, 22

5. Click "Launch Instance"

#### 4.2 Configure Security Group

1. Go to Security Groups
2. Create new security group or edit existing
3. Add inbound rules:
   - **SSH (Port 22)**: Your IP
   - **HTTP (Port 80)**: 0.0.0.0/0
   - **Custom TCP (Port 5432)**: 0.0.0.0/0 (if needed)
   - **Custom TCP (Port 6379)**: 0.0.0.0/0 (if needed)

#### 4.3 Connect to EC2 Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

#### 4.4 Install Docker on EC2

```bash
# Update package index
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker ubuntu

# Logout and login again for group changes to take effect
exit
```

#### 4.5 Deploy Application

```bash
# Connect again
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Clone repository
git clone https://github.com/zrsebas/arquitecturasoftware.git
cd arquitecturasoftware

# Create .env file
nano .env
# Add your environment variables

# Build and start services
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### Step 5: Verify Deployment

1. Get EC2 public IP from AWS Console
2. Access: `http://your-ec2-public-ip`
3. Test endpoints:
   - http://your-ec2-ip/api/clientes/ - Django API
   - http://your-ec2-ip/api/productos/ - Productos MS
   - http://your-ec2-ip/api/pedidos/ - Pedidos MS
   - http://your-ec2-ip/api/public/stats/ - Public API

## 🔧 Troubleshooting

### Services Not Starting

```bash
# Check logs
docker-compose logs django
docker-compose logs productos
docker-compose logs pedidos

# Restart specific service
docker-compose restart django
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres
```

### Nginx Gateway Issues

```bash
# Check Nginx configuration
docker-compose exec nginx nginx -t

# Reload Nginx
docker-compose exec nginx nginx -s reload
```

### Celery Tasks Not Running

```bash
# Check Celery worker logs
docker-compose logs celery_worker

# Check Celery beat logs
docker-compose logs celery_beat
```

## 📊 Monitoring

### Check Service Health

```bash
# All services status
docker-compose ps

# Resource usage
docker stats

# Service logs
docker-compose logs -f [service-name]
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U sportcore -d sportcore

# Run queries
SELECT COUNT(*) FROM clientes_cliente;
SELECT COUNT(*) FROM productos_producto;
SELECT COUNT(*) FROM pedidos_pedido;
```

### Redis Access

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check keys
KEYS *
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use HTTPS** with SSL certificates
3. **Restrict Security Group** to specific IPs when possible
4. **Enable VPC** for network isolation
5. **Use AWS Secrets Manager** for sensitive data
6. **Enable CloudWatch** for logging and monitoring

## 📈 Scaling

### Horizontal Scaling

To scale individual services:

```bash
# Scale Productos microservice
docker-compose up -d --scale productos=3

# Scale Pedidos microservice
docker-compose up -d --scale pedidos=2
```

### Load Balancing

For production, consider:
- AWS Application Load Balancer (ALB)
- AWS Elastic Container Service (ECS)
- AWS Kubernetes Service (EKS)

## 🔄 Updates and Maintenance

### Update Application Code

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Database Migrations

```bash
# Run Django migrations
docker-compose exec django python manage.py migrate

# Create new migrations
docker-compose exec django python manage.py makemigrations
```

### Backup Database

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U sportcore sportcore > backup.sql

# Restore PostgreSQL
docker-compose exec -T postgres psql -U sportcore sportcore < backup.sql
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_NAME | Database name | sportcore |
| DB_USER | Database user | sportcore |
| DB_PASSWORD | Database password | sportcore123 |
| DB_HOST | Database host | postgres |
| SECRET_KEY | Django secret key | - |
| DEBUG | Debug mode | True |
| ALLOWED_HOSTS | Allowed hosts | localhost |
| CELERY_BROKER_URL | Redis broker URL | redis://redis:6379/0 |
| PRODUCTOS_SERVICE_URL | Productos MS URL | http://productos:5001 |

## 🎯 Next Steps

1. **Set up CI/CD pipeline** with GitHub Actions
2. **Configure SSL/TLS** with Let's Encrypt
3. **Set up monitoring** with CloudWatch
4. **Configure auto-scaling** for production
5. **Implement logging** with ELK Stack
6. **Set up backup strategy** for database

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/zrsebas/arquitecturasoftware/issues
- AWS Academy Support: Through AWS Academy portal

---

**Last Updated**: May 28, 2026
