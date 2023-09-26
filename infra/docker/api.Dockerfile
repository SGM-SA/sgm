# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.9-slim-bullseye as base

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

# Install required dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the project files
COPY apps/api/ .

# Install dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Run the application
CMD ["python", "manage.py", "runserver"]
