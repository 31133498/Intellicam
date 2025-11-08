# Use slim Python image
FROM python:3.11-slim

# Install system dependencies required by cryptography and bcrypt
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency list first (for Docker caching)
COPY requirements.txt /app/

# Upgrade pip & install dependencies (use prebuilt wheels where possible)
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt --prefer-binary

# Copy the rest of your code
COPY . /app

# Expose Render's port
EXPOSE 10000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
