# ================================
# 1️⃣ Builder stage – install dependencies
# ================================
FROM python:3.11-slim AS builder

# Install required system dependencies for YOLO, OpenCV, and cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libssl-dev \
    libffi-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency list
COPY requirements.txt .

# Upgrade pip & install dependencies into a local folder
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt --prefer-binary -t /app/deps


# ================================
# 2️⃣ Final stage – runtime image
# ================================
FROM python:3.11-slim

# Install only lightweight runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python dependencies and source code
COPY --from=builder /app/deps /usr/local/lib/python3.11/site-packages
COPY . .

# Expose Flask’s port
EXPOSE 8000

# Environment variables (optional for Render / Heroku / etc.)
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Start Flask app
CMD ["python", "app.py"]
