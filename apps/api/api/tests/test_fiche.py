from rest_framework import status
from django.test import TestCase
from api.fiche.models import Fiche
from api.affaire.models import Affaire
from api.machine.models import Machine


class FicheCreateViewTestCase(TestCase):
    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1)
        self.machine = Machine.objects.create(nom_machine="Machine 1")

    def test_create_fiche(self):
        url = "/api/fiches/"
        data = {
            "titre": "Fiche test",
            "affaire": self.affaire.id,
            "fourniture": False,
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fiche.objects.count(), 1)
        self.assertEqual(Fiche.objects.first().titre, "Fiche test")
        self.assertEqual(Fiche.objects.first().affaire, self.affaire)


class FicheRUDViewTestCase(TestCase):
    """
    Suite de tests pour les opérations de lecture, mise à jour et suppression
    """

    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1)
        self.machine = Machine.objects.create(nom_machine="Machine 1")
        self.fiche = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )

    def test_read_fiche(self):
        url = "/api/fiches/{}".format(self.fiche.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["titre"], "Fiche test")
        self.assertEqual(response.data["affaire"], self.affaire.id)
        self.assertEqual(response.data["fourniture"], False)

    def test_update_fiche(self):
        url = "/api/fiches/{}".format(self.fiche.id)
        data = {
            "titre": "Fiche test updated",
            "description": "Description updated",
            "fourniture": True,
        }
        response = self.client.patch(url, data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["titre"], "Fiche test updated")
        self.assertEqual(response.data["description"], "Description updated")
        self.assertEqual(response.data["fourniture"], True)

    def test_delete_fiche(self):
        url = "/api/fiches/{}".format(self.fiche.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Fiche.objects.count(), 0)


class FicheBulkDeleteTestCase(TestCase):
    """
    Suite de tests pour la suppression de plusieurs fiches en une seule requête
    """

    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1)

    def test_bulk_delete_fiches(self):
        url = "/api/fiches/delete/"

        # Préparez les données de test
        fiche1 = Fiche.objects.create(
            titre="Fiche test 1",
            affaire=self.affaire,
        )
        fiche2 = Fiche.objects.create(
            titre="Fiche test 2",
            affaire=self.affaire,
        )
        fiche3 = Fiche.objects.create(
            titre="Fiche test 3",
            affaire=self.affaire,
        )

        # Effectue une requête DELETE avec les IDs des fiches à supprimer

        response = self.client.delete(
            url,
            data={
                "ids": [fiche1.id, fiche2.id],
            },
            content_type="application/json",
        )

        # Vérifiez les résultats de la requête
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Vérifiez que les fiches ont été supprimées de la base de données
        self.assertEqual(Fiche.objects.count(), 1)

        # Vérifiez que la fiche restante est celle qui n'a pas été supprimée
        self.assertEqual(Fiche.objects.first(), fiche3)
