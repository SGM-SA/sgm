from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.affectation_etape_zone.models import AffectationAjustage
from api.etape.models import Etape
from api.zone.models import Zone
from api.machine.models import Machine
from api.fiche.models import Fiche
from api.affectation_etape_zone.serializer import AffectationAjustageDetailSerializer


