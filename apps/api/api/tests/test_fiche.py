from rest_framework import status
from django.test import TestCase
from api.fiche.models import Fiche
from api.affaire.models import Affaire
from api.machine.models import Machine
from api.groupe_machine.models import GroupeMachine
from api.etape.models import Etape


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
        response = self.client.patch(
            url, data, content_type="application/json"
        )
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

        # Effectue une requête POST avec les IDs des fiches à supprimer

        response = self.client.post(
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


class FichesAjustageAPlanifierTest(TestCase):
    """
    Suite de tests pour la récupération des fiches d'ajustage à planifier
    """

    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1)
        self.affaire2 = Affaire.objects.create(num_affaire=2)
        self.affaire3 = Affaire.objects.create(num_affaire=3)

        self.groupe_machine = GroupeMachine.objects.create(
            nom_groupe="Ajustage", prix_theorique=100
        )
        self.groupe_machine2 = GroupeMachine.objects.create(
            nom_groupe="Scie", prix_theorique=1
        )

        self.fiche1 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )
        self.fiche2 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire2,
            fourniture=False,
            id=2,
        )
        self.fiche3 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire2,
            fourniture=False,
            id=3,
        )

        self.etape1 = Etape.objects.create(
            fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=1
        )

        self.etape2 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine2, num_etape=1
        )

        self.etape3 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine, num_etape=2
        )

        self.etape4 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine, num_etape=3
        )

    def test_retour_affaire(self):
        """
        Seul les affaires contenant au moins une étape machine
        """
        url = "/api/fiches/ajustage/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 2 affaires avec des fiches d'ajustage à planifier
        self.assertEqual(len(response.data["results"]), 2)

    def test_retour_fiche(self):
        """
        Seul les fiches ajustage contenant au moins une étape ajustage
        """
        url = "/api/fiches/ajustage/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 2 affaires avec des fiches d'ajustage à planifier
        self.assertEqual(len(response.data["results"]), 2)
        # 1 fiche pour l'affaire 1
        self.assertEqual(len(response.data["results"][0]["fiches"]), 1)

        # 1 fiche pour l'affaire 2
        self.assertEqual(len(response.data["results"][1]["fiches"]), 1)

    def test_fiches_ajustage_a_planifier(self):
        url = "/api/fiches/ajustage/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 2 affaires avec des fiches d'ajustage à planifier
        self.assertEqual(len(response.data["results"]), 2)
        # 1 fiche pour l'affaire 1
        self.assertEqual(len(response.data["results"][0]["fiches"]), 1)

        # 1 fiche pour l'affaire 2
        self.assertEqual(len(response.data["results"][1]["fiches"]), 1)

        # 2 etaes pour l'affaire 2
        self.assertEqual(
            len(response.data["results"][1]["fiches"][0]["etapes"]), 2
        )

        # Vérifiez que les fiches sont bien triées par affaire
        self.assertEqual(response.data["results"][0]["id"], self.affaire.id)
        self.assertEqual(response.data["results"][1]["id"], self.affaire2.id)

        # Vérifiez que les fiches sont bien triées par étape
        self.assertEqual(
            response.data["results"][1]["fiches"][0]["etapes"][0]["id"],
            self.etape3.id,
        )

        self.assertEqual(
            response.data["results"][1]["fiches"][0]["etapes"][1]["id"],
            self.etape4.id,
        )


class FichesMachineAPlanifierTest(TestCase):
    """
    Suite de tests pour la récupération des fiches machine à planifier
    """

    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1)
        self.affaire2 = Affaire.objects.create(num_affaire=2)
        self.affaire3 = Affaire.objects.create(num_affaire=3)

        self.groupe_machine = GroupeMachine.objects.create(
            nom_groupe="Ajustage", prix_theorique=100
        )
        self.groupe_machine2 = GroupeMachine.objects.create(
            nom_groupe="Scie", prix_theorique=1
        )

        self.fiche1 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )
        self.fiche2 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire2,
            fourniture=False,
            id=2,
        )
        self.fiche3 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire3,
            fourniture=False,
            id=3,
        )

        self.fiche4 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire3,
            fourniture=False,
            id=4,
        )

        self.etape1 = Etape.objects.create(
            fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=1
        )

        self.etape2 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine2, num_etape=1
        )

        self.etape3 = Etape.objects.create(
            fiche=self.fiche3, groupe_machine=self.groupe_machine2, num_etape=2
        )

        self.etape4 = Etape.objects.create(
            fiche=self.fiche3, groupe_machine=self.groupe_machine2, num_etape=3
        )

        self.etape5 = Etape.objects.create(
            fiche=self.fiche4, groupe_machine=self.groupe_machine2, num_etape=1
        )

    def test_retour_affaire(self):
        """
        Seul les affaires sans étape machine de type ajustage (groupe_machine.id != 1)
        """
        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 2 affaires sans avec étape machine
        self.assertEqual(len(response.data["results"]), 2)

    def test_retour_fiche(self):
        """
        Seul les fiches machine sans étape de type ajustage
        """
        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 1 fiche pour affaire 2
        self.assertEqual(len(response.data["results"][0]["fiches"]), 1)

        # 2 fiches pour affaire 3
        self.assertEqual(len(response.data["results"][1]["fiches"]), 2)

    def test_retour_etape(self):
        """
        Seul les étapes machine autre que ajustage
        """
        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 1 étape pour affaire 2 fiches 1
        self.assertEqual(
            len(response.data["results"][0]["fiches"][0]["etapes"]), 1
        )

        # 2 étapes pour affaire 3 fiches 2
        self.assertEqual(
            len(response.data["results"][1]["fiches"][0]["etapes"]), 2
        )

        # 1 étape pour affaire 3 fiches 4
        self.assertEqual(
            len(response.data["results"][1]["fiches"][1]["etapes"]), 1
        )
