from datetime import timezone, timedelta, datetime

from rest_framework import status
from django.test import TestCase
from api.zone.models import Zone
from api.fiche.models import Fiche
from api.affaire.models import Affaire
from api.machine.models import Machine
from api.groupe_machine.models import GroupeMachine
from api.etape.models import Etape
from api.affectation_etape_machine.models import AffectationMachine
from api.affectation_etape_zone.models import AffectationAjustage


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
        self.zone = Zone.objects.create(nom="Zone 1", description="Description")

        self.affaire = Affaire.objects.create(num_affaire=1, validation_ingenieur=True)
        self.affaire2 = Affaire.objects.create(num_affaire=2, validation_ingenieur=True)
        self.affaire3 = Affaire.objects.create(num_affaire=3, validation_ingenieur=True)

        # ne sera pas à planifier car l'affaire n'est pas validée
        self.affaire_non_valide = Affaire.objects.create(
            num_affaire=4, validation_ingenieur=False
        )

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

        self.fiche5 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire_non_valide,
            fourniture=False,
            id=5,
        )

        self.etape1 = Etape.objects.create(
            fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=1
        )

        self.etape2 = Etape.objects.create(
            fiche=self.fiche2,
            groupe_machine=self.groupe_machine2,
            num_etape=1,
            terminee=True,
        )

        self.etape3 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine, num_etape=2
        )

        self.etape4 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine, num_etape=3
        )

        # étape terminée donc n'apparait pas dans la liste des étapes à planifier
        self.etape5 = Etape.objects.create(
            fiche=self.fiche3,
            groupe_machine=self.groupe_machine,
            num_etape=1,
            terminee=True,
        )

        self.etape6 = Etape.objects.create(
            fiche=self.fiche3, groupe_machine=self.groupe_machine, num_etape=2
        )

        # ne sera pas à planifier car l'affaire n'est pas validée
        self.etape7 = Etape.objects.create(
            fiche=self.fiche5, groupe_machine=self.groupe_machine2, num_etape=1
        )

        # Ajout d'une affectation prévue mais non terminée
        self.affectation_non_complete = AffectationAjustage.objects.create(
            semaine_affectation=datetime.now().date() - timedelta(days=7),
            etape=self.etape3,
            zone=self.zone,
        )

        # Ajout d'une affectation terminée
        self.affectation_complete = AffectationAjustage.objects.create(
            semaine_affectation=datetime.now().date() - timedelta(days=7),
            etape=self.etape2,
            zone=self.zone,
        )

    def test_retour_affaire(self):
        """
        Seul les affaires contenant au moins une étape ajustage
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

        # 2 fiches pour l'affaire 2
        self.assertEqual(len(response.data["results"][1]["fiches"]), 2)

    def test_retour_etape(self):
        """
        Seul les étapes ajustage non terminées
        """
        url = "/api/fiches/ajustage/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 1 étape pour la fiche 1
        self.assertEqual(len(response.data["results"][0]["fiches"][0]["etapes"]), 1)

        # 2 étapes pour la fiche 2
        self.assertEqual(len(response.data["results"][1]["fiches"][0]["etapes"]), 2)

        # 1 étape pour la fiche 3
        self.assertEqual(len(response.data["results"][1]["fiches"][1]["etapes"]), 1)

    def test_fiches_ajustage_a_planifier(self):
        url = "/api/fiches/ajustage/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # etape 1 pour la fiche 1
        self.assertIn(
            self.etape1.id,
            [
                etape["id"]
                for etape in response.data["results"][0]["fiches"][0]["etapes"]
            ],
        )

        # etape 2 non présente pour la fiche 2 (affectation terminée)
        self.assertNotIn(
            self.etape2.id,
            [
                etape["id"]
                for etape in response.data["results"][1]["fiches"][0]["etapes"]
            ],
        )

        # etape 3 pour la fiche 2 (affectation non terminée)
        self.assertIn(
            self.etape3.id,
            [
                etape["id"]
                for etape in response.data["results"][1]["fiches"][0]["etapes"]
            ],
        )


class FichesMachineAPlanifierTest(TestCase):
    """
    Suite de tests pour la récupération des fiches machine à planifier
    """

    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1, validation_ingenieur=True)
        self.affaire2 = Affaire.objects.create(num_affaire=2, validation_ingenieur=True)
        self.affaire3 = Affaire.objects.create(num_affaire=3, validation_ingenieur=True)
        # ne sera pas à planifier car l'affaire n'est pas validée
        self.affaire_non_valide = Affaire.objects.create(
            num_affaire=4, validation_ingenieur=False
        )

        self.groupe_machine = GroupeMachine.objects.create(
            nom_groupe="Ajustage", prix_theorique=100
        )
        self.groupe_machine2 = GroupeMachine.objects.create(
            nom_groupe="Scie", prix_theorique=1
        )

        self.machine1 = Machine.objects.create(
            nom_machine="Machine 1",
            groupe_machine=self.groupe_machine,
        )

        self.machine2 = Machine.objects.create(
            nom_machine="Machine 2",
            groupe_machine=self.groupe_machine2,
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

        # affaire 3 possède 2 fiches
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

        self.fiche5 = Fiche.objects.create(
            titre="Fiche test",
            affaire=self.affaire_non_valide,
            fourniture=False,
            id=5,
        )

        self.etape1 = Etape.objects.create(
            fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=1
        )

        self.etape2 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine2, num_etape=1
        )

        self.etape21 = Etape.objects.create(
            fiche=self.fiche2, groupe_machine=self.groupe_machine2, num_etape=2
        )

        # fiche 3 possède 2 étapes
        self.etape3 = Etape.objects.create(
            fiche=self.fiche3, groupe_machine=self.groupe_machine2, num_etape=1
        )
        self.etape4 = Etape.objects.create(
            fiche=self.fiche3, groupe_machine=self.groupe_machine2, num_etape=2
        )

        # fiche 4 possède 1 étape
        self.etape5 = Etape.objects.create(
            fiche=self.fiche4, groupe_machine=self.groupe_machine2, num_etape=1
        )

        # ne sera pas à planifier car l'affaire n'est pas validée
        self.etape6 = Etape.objects.create(
            fiche=self.fiche5, groupe_machine=self.groupe_machine2, num_etape=1
        )

        # affectation d'une fiche avec date d'affectation dépasée
        # doit apparaitre dans la liste des fiches à planifier
        self.affectation1 = AffectationMachine.objects.create(
            semaine_affectation=datetime.now().date() - timedelta(days=10),
            etape=self.etape2,
            machine=self.machine2,
        )

        # affectation d'une étape avec date d'affectation non dépasée, ne doit pas apparaitre dans la liste des fiches à planifier
        self.affectation2 = AffectationMachine.objects.create(
            semaine_affectation=datetime.now().date() + timedelta(days=10),
            machine=self.machine2,
            etape=self.etape5,
        )

    def test_retour_affaire(self):
        """
        Renvoie les affaires avec étape machine sans affectation ou avec affectation dépassée
        """
        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 2 affaires avec étape machines, une sans étape machine, une non validée
        self.assertEqual(len(response.data["results"]), 2)

    def test_retour_fiche(self):
        """
        Renvoie les fiches avec étape machine sans affectation ou avec affectation dépassée
        """
        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)

        # 1 fiche pour affaire 2
        self.assertEqual(len(response.data["results"][0]["fiches"]), 1)

        # 1 fiches pour affaire 3 car 2 fiches mais une avec étape planifiée
        self.assertEqual(len(response.data["results"][1]["fiches"]), 1)

    def test_retour_etape(self):
        """
        Renvoie les étapes machine sans affectation ou avec affectation dépassée
        """
        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # affaire 2 possède 2 etapes une non affectée et une affectée mais date dépassée
        self.assertEqual(len(response.data["results"][0]["fiches"][0]["etapes"]), 2)

        # 2 étapes pour affaire 3 fiches 2
        self.assertEqual(len(response.data["results"][1]["fiches"][0]["etapes"]), 2)

class ExportPDFEtapeTest(TestCase):
  def setUp(self):
    self.zone = Zone.objects.create(nom="Zone 1", description="Description")

    self.affaire = Affaire.objects.create(num_affaire=1, validation_ingenieur=True)
    self.affaire2 = Affaire.objects.create(num_affaire=2, validation_ingenieur=True)
    self.affaire3 = Affaire.objects.create(num_affaire=3, validation_ingenieur=True)

    # ne sera pas à planifier car l'affaire n'est pas validée
    self.affaire_non_valide = Affaire.objects.create(
      num_affaire=4, validation_ingenieur=False
    )

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


    self.etape1 = Etape.objects.create(
      fiche=self.fiche1, groupe_machine=self.groupe_machine, num_etape=1, description="Description", temps=10
    )
    # sans description et sans groupe machine
    self.etape2 = Etape.objects.create(
      fiche=self.fiche1,
      num_etape=1,
      terminee=True,
    )



  def test_export_pdf_etape(self):
      url = "/api/fiches/export?fiche_id={}".format(1)
      response = self.client.get(url)

      self.assertEqual(response.status_code, status.HTTP_200_OK)
      self.assertEqual(response["Content-Type"], "application/pdf")


