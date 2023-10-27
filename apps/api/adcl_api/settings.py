"""
Django settings for adcl_api project.

Generated by 'django-admin startproject' using Django 4.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""


# SENTRY
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# OTHER
from pathlib import Path
import django_heroku
import os
from dotenv import load_dotenv

IS_HEROKU = "DYNO" in os.environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

if IS_HEROKU:
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = ["*"]

if not IS_HEROKU:
    DEBUG = True

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ["https://sgm-staging-api.cloudflow.info"]

# Exposistion du header filename pour le téléchargement des fichiers
CORS_EXPOSE_HEADERS = ["filename"]


# Application definition

INSTALLED_APPS = [
    "api.apps.ApiConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.admindocs",
    "rest_framework",
    "rest_framework_simplejwt",
    "django_extensions",
    "corsheaders",
    "drf_spectacular",
    "django_filters",
    "constance",
    "constance.backends.database",
    "background_task",
]

AUTH_USER_MODEL = "api.CustomUser"

# constance (constantes modifiables dans l'admin)
CONSTANCE_BACKEND = "constance.backends.database.DatabaseBackend"
CONSTANCE_CONFIG = {
    "GROUPE_MACHINE_AJUSTAGE_ID": (1, "ID du groupe machine ajustage"),
    "COULEUR_AFFAIRE_RETARD": (
        "#FED7D7",
        "Couleur d'affichage d'une affaire en retard",
    ),
    "TEMPS_MACHINE_JOUR": (21, "Durée de fonctionnement d'une machine"),
    "JOUR_OUVRE_MACHINE": (5, "Nombre de jours qu'une machine fonctionne par semaine"),
    "JOUR_OUVRE_ZONE": (5, "Jour zones"),
    "TEMPS_ZONE_MATIN": (7, "Temps travail matiné"),
    "TEMPS_ZONE_APREM": (8, "Temps travail après-midi"),
    "NB_PERS_ZONES": (7, "Nombre de personnes par zone"),
}


# APPEND_SLASH=False
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "adcl_api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "adcl_api.wsgi.application"


load_dotenv()

if os.getenv("ENV") == "DEV":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

elif os.getenv("ENV") == "PROD":
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("POSTGRES_ENGINE"),
            "NAME": os.getenv("POSTGRES_NAME"),
            "USER": os.getenv("POSTGRES_USER"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
            "HOST": os.getenv("POSTGRES_HOST"),
            "PORT": "5432",
        }
    }

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/
# langage francais
LANGUAGE_CODE = "fr-FR"

TIME_ZONE = "CET"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# rest framework
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
    "MAX_PAGINATE_BY": 100,
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
}

# swagger settings
SPECTACULAR_SETTINGS = {
    "TITLE": "SGM API",
    "DESCRIPTION": "SGM planifiction",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    # OTHER SETTINGS
    "COMPONENT_SPLIT_REQUEST": True,
    "SWAGGER_UI_SETTINGS": {
        "filter": True,
        "docExpansion": "none",
        "operationsSorter": "alpha",
        "showRequestHeaders": True,
        "tagsSorter": "alpha",
        "validatorUrl": None,
        "displayOperationId": True,
        "deepLinking": True,
        "persistAuthorization": True,
    },
}


# Activate Django-Heroku.
if IS_HEROKU:
    django_heroku.settings(locals())
else:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "django-insecure-for-tets-only-ahty%vshmow=vq787&&p0zrvl2hgh+^*d+pofw9#!ot+)kvz4o",
    )

# SENTRY
sentry_sdk.init(
    dsn="https://2176af6897d64b67a6e58076c08296a6@o4505243547140096.ingest.sentry.io/4505243548581888",
    integrations=[
        DjangoIntegration(),
    ],
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,
    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True,
)
