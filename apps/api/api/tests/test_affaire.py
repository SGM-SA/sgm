from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone
from api.affaire.models import Affaire
from api.etape.models import Etape
from api.fiche.models import Fiche
from api.groupe_machine.models import GroupeMachine


class AffaireListTestCase(APITestCase):
    def setUp(self):
        self.url = "/api/affaires/"
        self.affaire1 = Affaire.objects.create(
            num_affaire=1,
            description="Test affaire 1",
            observation="Observation affaire 1",
        )
        self.affaire2 = Affaire.objects.create(
            num_affaire=2,
            description="Test affaire 2",
            observation="Observation affaire 2",
        )

    def test_list_affaires(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = response.json()["results"]
        self.assertEqual(len(response_data), 2)

        # Vérifie que les données de la première affaire sont correctes
        affaire1_data = response_data[0]
        self.assertEqual(affaire1_data["num_affaire"], self.affaire1.num_affaire)
        self.assertEqual(affaire1_data["description"], self.affaire1.description)
        self.assertEqual(affaire1_data["observation"], self.affaire1.observation)

        # Vérifie que la deuxième affaire dans la réponse est la bonne
        affaire2_data = response_data[1]
        self.assertEqual(affaire2_data["num_affaire"], self.affaire2.num_affaire)
        self.assertEqual(affaire2_data["description"], self.affaire2.description)
        self.assertEqual(affaire2_data["observation"], self.affaire2.observation)

    def test_list_affaires_et_fiches(self):
        # TODO: Teste que les fiches sont bien incluses dans la réponse

        pass


class AffaireStatsGlobalTestCase(APITestCase):
    def setUp(self) -> None:
        Affaire.objects.create(
            num_affaire=1,
            description="Test affaire 1",
            observation="Observation affaire 1",
            statut="S00",
        )

        Affaire.objects.create(
            num_affaire=2,
            description="Test affaire 2",
            observation="Observation affaire 2",
            statut="A00",
        )

        Affaire.objects.create(
            num_affaire=3,
            description="Test affaire 3",
            observation="Observation affaire 3",
            statut="T00",
            date_cloture=timezone.now(),
        )

        # en retard
        Affaire.objects.create(
            num_affaire=10,
            description="Test affaire 1",
            observation="Observation affaire 1",
            statut="S00",
            date_rendu=timezone.now() - timezone.timedelta(days=7),
        )

    def test_stats_global(self):
        response = self.client.get("/api/affaires/stats")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(data["par_statut"]["S00"], 2)
        self.assertEqual(data["par_statut"]["A00"], 1)
        self.assertEqual(data["par_statut"]["T00"], 1)
        self.assertEqual(data["par_statut"]["INT"], 0)

        self.assertEqual(data["terminees_cette_semaine"], 1)
        self.assertEqual(data["terminees_semaine_der"], 0)

        self.assertEqual(data["en_retard"], 1)

class StatsAffaireIndTestCase(APITestCase):
    def setUp(self) -> None:
        self.affaire = Affaire.objects.create(
          num_affaire=1,
          description="Test affaire 1",
          observation="Observation affaire 1",
          statut="S00",
        )

        self.groupe_machine = GroupeMachine.objects.create(
          nom_groupe="Ajustage", prix_theorique=100
        )
        self.groupe_machine2 = GroupeMachine.objects.create(
          nom_groupe="Scie", prix_theorique=20
        )

        self.fiche1 = Fiche.objects.create(
          titre="Fiche test",
          affaire=self.affaire,
          fourniture=False,
          id=1,
        )

        self.fiche2 = Fiche.objects.create(
          titre="Fiche test",
          affaire=self.affaire,
          fourniture=False,
          id=2,
        )

        Etape.objects.create(
          fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=1, temps=4
        )

        Etape.objects.create(
          fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=2, temps=8, terminee=True
        )

        Etape.objects.create(
          fiche=self.fiche1, groupe_machine=self.groupe_machine2, num_etape=2, temps=8
        )

        Etape.objects.create(
          fiche=self.fiche2, groupe_machine=self.groupe_machine2, num_etape=2, temps=7
        )

    def test_stats_affaire_ind(self):
      response = self.client.get(f"/api/affaires/stats/{self.affaire.id}")
      self.assertEqual(response.status_code, status.HTTP_200_OK)

      data = response.json()

      self.assertEqual(data["temps_ajustage"], 12)
      self.assertEqual(data["temps_machine"], 15)
      self.assertEqual(data["temps_restant"], 19)

