from rest_framework import status
from rest_framework.test import APITestCase

from api.affaire.models import Affaire
from api.affectation.models import AffectationMachine, AffectationAjustage
from api.etape.models import Etape
from api.fiche.models import Fiche
from api.groupe_machine.models import GroupeMachine
from django.utils import timezone

from api.machine.models import Machine
from api.zone.models import Zone


class AffectationMachineTest(APITestCase):
    def setUp(self) -> None:
        self.groupe_machine_ajustage = GroupeMachine.objects.create(
            nom_groupe="Ajustage", prix_theorique=100
        )

        self.groupe_machine = GroupeMachine.objects.create(
            nom_groupe="Machine", prix_theorique=100
        )

        self.machine_scie = Machine.objects.create(
            nom_machine="Scie",
            groupe_machine=self.groupe_machine,
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

    def test_create_affectation_machine(self):
        """
        Teste la création d'une affectation machine
        """

        url = "/api/affectations/machines"
        data = {
            "etape": self.etape1.id,
            "machine": self.machine_scie.id,
            "semaine_affectation": timezone.now().strftime("%Y-%m-%d"),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_affectation_machine_etape_deja_affectee(self):
        """
        Teste la création d'une affectation machine
        """

        AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
        )

        url = "/api/affectations/machines"
        data = {
            "etape": self.etape1.id,
            "machine": self.machine_scie.id,
            "semaine_affectation": timezone.now().strftime("%Y-%m-%d"),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_affectation_machine(self):
        Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=1,
        )
        affectation = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
        )

        url = f"/api/affectations/machines/{affectation.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_affectation_machine(self):
        """
        Teste la mise à jour d'une affectation machine
        """
        affectation = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
        )

        url = f"/api/affectations/machines/{affectation.id}"
        data = {
            "semaine_affectation": (
                timezone.now() + timezone.timedelta(days=7)
            ).strftime("%Y-%m-%d"),
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_affectation_machine(self):
        """
        Teste la suppression d'une affectation machine
        """
        affectation = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
        )

        url = f"/api/affectations/machines/{affectation.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class AffectationAjustageTest(APITestCase):
    def setUp(self):
        self.groupe_machine_ajustage = GroupeMachine.objects.create(
            nom_groupe="Ajustage", prix_theorique=100
        )

        self.zone = Zone.objects.create(nom="Zone test", description="Description test")

        self.affaire = Affaire.objects.create(num_affaire=1)

        self.fiche = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )

        self.etape1 = Etape.objects.create(
            fiche=self.fiche, groupe_machine=self.groupe_machine_ajustage, num_etape=1
        )

        self.etape2 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine_ajustage,
            num_etape=1,
            terminee=True,
        )

    def test_create_affectation_ajustage(self):
        """
        Teste la création d'une affectation ajustage
        """

        url = "/api/affectations/ajustages"
        data = {
            "etape": self.etape1.id,
            "semaine_affectation": timezone.now().strftime("%Y-%m-%d"),
            "zone": self.zone.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_affectation_ajustage(self):
        """
        Teste la récupération d'une affectation ajustage
        """
        affectation = AffectationAjustage.objects.create(
            etape=self.etape1,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
            zone=self.zone,
        )

        url = f"/api/affectations/ajustages/{affectation.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_affectation_ajustage(self):
        """
        Teste la mise à jour d'une affectation ajustage
        """
        affectation = AffectationAjustage.objects.create(
            etape=self.etape1,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
            zone=self.zone,
        )

        url = f"/api/affectations/ajustages/{affectation.id}"
        data = {
            "semaine_affectation": (
                timezone.now() + timezone.timedelta(days=7)
            ).strftime("%Y-%m-%d")
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_affectation_ajustage(self):
        """
        Teste la suppression d'une affectation ajustage
        """
        affectation = AffectationAjustage.objects.create(
            etape=self.etape1,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
            zone=self.zone,
        )

        url = f"/api/affectations/ajustages/{affectation.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)