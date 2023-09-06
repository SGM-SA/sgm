from django.contrib.auth.models import User
from rest_framework import status
from django.test import TestCase
from api.affaire.models import Affaire
from api.etape.models import Etape
from api.fiche.models import Fiche
from api.groupe_machine.models import GroupeMachine
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from api.pointage.models import PointageEtape


class PointageGestionTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

        self.groupe_machine = GroupeMachine.objects.create(
            nom_groupe="Ajustage", prix_theorique=100
        )

        self.affaire = Affaire.objects.create(num_affaire=1)
        self.fiche = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )
        self.etape1 = Etape.objects.create(
            fiche=self.fiche, groupe_machine=self.groupe_machine, num_etape=1
        )

        self.etape2 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=1,
            terminee=True,
        )

        # Set up the client for API requests
        self.client = APIClient()

        # Authenticate the client using JWT
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_start_pointage(self):
        """
        Teste la création d'un pointage, aucun pointage en cours
        """
        url = "/api/pointages/"
        data = {
            "etape": self.etape1.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_stop_pointage(self):
        """
        Teste le stop d'un pointage, même étape que le pointage en cours
        """

        url = "/api/pointages/"
        data = {
            "etape": self.etape1.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = "/api/pointages/"
        data = {
            "etape": self.etape1.id,
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(PointageEtape.objects.get(etape=self.etape1).en_cours(), False)

    def test_stop_pointage_different_etape(self):
        """
        Teste le stop d'un pointage, étape différente du pointage en cours
        """

        url = "/api/pointages/"
        data = {
            "etape": self.etape1.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = "/api/pointages/"
        data = {
            "etape": self.etape2.id,
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(PointageEtape.objects.get(etape=self.etape1).en_cours(), False)
        self.assertEqual(PointageEtape.objects.get(etape=self.etape2).en_cours(), True)


