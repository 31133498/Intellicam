# ================================
# 1️⃣ Builder stage – build dependencies
# ================================
FROM python:3.11-slim AS builder

# Install build dependencies (removed OpenCV libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency list
COPY requirements.txt .

# Upgrade pip & install dependencies into a local folder
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --prefer-binary -r requirements.txt -t /app/deps


# ================================
# 2️⃣ Final stage – runtime image
# ================================
FROM python:3.11-slim

# Install only minimal runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only dependencies and your app code
COPY --from=builder /app/deps /usr/local/lib/python3.11/site-packages
COPY . .

# Expose Render's port
EXPOSE 10000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
