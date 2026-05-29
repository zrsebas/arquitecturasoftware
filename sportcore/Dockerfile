FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for frontend build
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app

# Expose port
EXPOSE 8000

# Default command (skip collectstatic for now)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
