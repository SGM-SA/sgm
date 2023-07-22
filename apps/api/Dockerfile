# image de base
FROM python:3.9

# défini le répertoire de travail
RUN mkdir -p code

# où se trouve le code
WORKDIR /code

# définis les variables d'environnement
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# installer les dépendances
RUN pip install --upgrade pip

# copie l'ensemble du projet dans le répertoire de travail Docker.
COPY . /code
# installe toutes les dépendances
RUN pip install -r requirements.txt
