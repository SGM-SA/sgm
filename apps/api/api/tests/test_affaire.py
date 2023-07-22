from rest_framework import status
from rest_framework.test import APITestCase

from api.affaire.models import Affaire


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

    def test_create_affaire(self):
        data = {
            "num_affaire": 3,
            "description": "Test affaire 3",
            "observation": "Observation affaire 3",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Vérifie que l'affaire a bien été créée
        self.assertEqual(Affaire.objects.count(), 3)
        # Vérifie que l'affaire créée correspond aux données envoyées
        self.assertEqual(
            Affaire.objects.get(num_affaire=3).description, "Test affaire 3"
        )
        self.assertEqual(
            Affaire.objects.get(num_affaire=3).observation, "Observation affaire 3"
        )
