# import TestCase

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from api.affaire.models import Affaire
from api.affectation.models import AffectationMachine
from api.fiche.models import Fiche
from api.machine.models import Machine
from api.planning.planning_machine.utils import (
    group_sorted_affectations_machine,
)
from api.planning.utils import sort_affectations_by_previous
from api.etape.models import Etape
from api.groupe_machine.models import GroupeMachine
from datetime import datetime


class UtilsPlanningTestCase(TestCase):
    def setUp(self) -> None:
        self.affaire = Affaire.objects.create(num_affaire=1)
        self.affaire2 = Affaire.objects.create(num_affaire=2)

        self.group_machine = GroupeMachine.objects.create(nom_groupe="Groupe 1")
        self.machine = Machine.objects.create(
            nom_machine="Machine 1", groupe_machine=self.group_machine
        )

        self.fiche = Fiche.objects.create(
            titre="Affaire Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )
        self.fiche2_1 = Fiche.objects.create(
            titre="Affaire 2 Fiche test 2_1",
            affaire=self.affaire2,
            fourniture=False,
            id=2,
        )
        self.fiche2_2 = Fiche.objects.create(
            titre="Affaire 2 Fiche test 2_2",
            affaire=self.affaire2,
            fourniture=False,
            id=3,
        )
        self.etape1 = Etape.objects.create(num_etape=1, terminee=True, fiche=self.fiche)
        self.etape2 = Etape.objects.create(num_etape=2, terminee=True, fiche=self.fiche)
        self.etape3 = Etape.objects.create(num_etape=3, terminee=True, fiche=self.fiche)

    def test_sorting_affectations_by_previous(self):
        affectation3 = AffectationMachine.objects.create(
            etape=self.etape3,
            machine=self.machine,
            semaine_affectation="2021-01-03",
        )
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine,
            semaine_affectation="2021-01-01",
            # previous=affectation2,
        )
        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine,
            semaine_affectation="2021-01-02",
            # previous=affectation3,
        )

        affectation3.previous = affectation2
        affectation3.save()

        affectation2.previous = affectation1
        affectation2.save()

        affectation1.previous = None
        affectation1.save()

        sorted_affecations = sort_affectations_by_previous(
            AffectationMachine.objects.all()
        )

        self.assertEqual(sorted_affecations[0], affectation1)
        self.assertEqual(sorted_affecations[1], affectation2)
        self.assertEqual(sorted_affecations[2], affectation3)

    def test_group_sorted_affectations(self):
        """
        Teste la fonction group_sorted_affectations.

        Exemple:
           affaire_1:
               fiche_1:
                   etape_1:
           affaire_2:
               fiche_2_2:
                   etape_1:
               fiche_2_1:
                   etape_1:

           affaire_1:
               fiche_1:
                   etape_2:
                   etape_3:

        """
        etape1_fiche2_2 = Etape.objects.create(
            num_etape=1, terminee=True, fiche=self.fiche2_2
        )
        etape1_fiche2_1 = Etape.objects.create(
            num_etape=1, terminee=True, fiche=self.fiche2_1
        )

        # affaire 1 fiche 1 etape 1
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine,
            semaine_affectation="2021-01-01",
        )

        # affaire 2 fiche 2 etape 1
        affectation2 = AffectationMachine.objects.create(
            etape=etape1_fiche2_2,
            machine=self.machine,
            semaine_affectation="2021-01-01",
        )

        # affaire 2 fiche 1 etape 1
        affectation3 = AffectationMachine.objects.create(
            etape=etape1_fiche2_1,
            machine=self.machine,
            semaine_affectation="2021-01-01",
        )

        # affaire 1 fiche 1 etape 2
        affectation4 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine,
            semaine_affectation="2021-01-02",
        )

        # affaire 1 fiche 1 etape 3
        affectation5 = AffectationMachine.objects.create(
            etape=self.etape3,
            machine=self.machine,
            semaine_affectation="2021-01-03",
        )

        affectation5.previous = affectation4
        affectation5.save()

        affectation4.previous = affectation3
        affectation4.save()

        affectation3.previous = affectation2
        affectation3.save()

        affectation2.previous = affectation1
        affectation2.save()

        affectation1.previous = None
        affectation1.save()

        sorted_affectations = sort_affectations_by_previous(
            AffectationMachine.objects.all()
        )

        group_sorted_affectations_result = group_sorted_affectations_machine(
            sorted_affectations
        )

        expected_result = {
            "id": self.affaire.id,
            "num_affaire": self.affaire.num_affaire,
            "fiches": [
                {
                    "id": self.fiche.id,
                    "titre": self.fiche.titre,
                    "avancement_fiche": 100.0,
                    "etapes": [
                        {
                            "id": self.etape1.id,
                            "affectation_id": affectation1.id,
                            "user_id": None,
                            "num_etape": 1,
                            "terminee": True,
                            "description": "",
                            "ref_doc": "",
                            "nom_piece": None,
                            "quantite": 0,
                            "temps": 0,
                            "plan": "",
                            "rep": "",
                            "fiche": self.fiche.id,
                            "groupe_machine": None,
                        }
                    ],
                }
            ],
        }

        # tests un par un pour plus simplicité + éviter les dates inutiles
        self.assertEqual(
            group_sorted_affectations_result[0]["id"], expected_result["id"]
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["num_affaire"],
            expected_result["num_affaire"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["id"],
            expected_result["fiches"][0]["id"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["titre"],
            expected_result["fiches"][0]["titre"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["avancement_fiche"],
            expected_result["fiches"][0]["avancement_fiche"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0]["id"],
            expected_result["fiches"][0]["etapes"][0]["id"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0][
                "affectation_id"
            ],
            expected_result["fiches"][0]["etapes"][0]["affectation_id"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0]["user_id"],
            expected_result["fiches"][0]["etapes"][0]["user_id"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0]["num_etape"],
            expected_result["fiches"][0]["etapes"][0]["num_etape"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0]["terminee"],
            expected_result["fiches"][0]["etapes"][0]["terminee"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0][
                "description"
            ],
            expected_result["fiches"][0]["etapes"][0]["description"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0]["ref_doc"],
            expected_result["fiches"][0]["etapes"][0]["ref_doc"],
        )
        self.assertEqual(
            group_sorted_affectations_result[0]["fiches"][0]["etapes"][0]["nom_piece"],
            expected_result["fiches"][0]["etapes"][0]["nom_piece"],
        )


class PlanningMachineTest(APITestCase):
    def setUp(self) -> None:
        """
        Exemple:
           affaire_1:
               fiche_1:
                   etape_1:
           affaire_2:
               fiche_2_2:
                   etape_1:
               fiche_2_1:
                   etape_1:

           affaire_1:
               fiche_1:
                   etape_2:
                   etape_3:
        """
        self.affaire = Affaire.objects.create(num_affaire=1, validation_ingenieur=True)
        self.affaire2 = Affaire.objects.create(num_affaire=2)
        self.group_machine_ajustage = GroupeMachine.objects.create(
            nom_groupe="Ajustage"
        )

        self.group_machine = GroupeMachine.objects.create(nom_groupe="Groupe 1")
        self.machine = Machine.objects.create(
            nom_machine="Machine 1", groupe_machine=self.group_machine
        )

        self.fiche = Fiche.objects.create(
            titre="Affaire Fiche test",
            affaire=self.affaire,
            fourniture=False,
            id=1,
        )
        self.fiche2_1 = Fiche.objects.create(
            titre="Affaire 2 Fiche test 2_1",
            affaire=self.affaire2,
            fourniture=False,
            id=2,
        )
        self.fiche2_2 = Fiche.objects.create(
            titre="Affaire 2 Fiche test 2_2",
            affaire=self.affaire2,
            fourniture=False,
            id=3,
        )
        self.etape1 = Etape.objects.create(
            num_etape=1,
            terminee=False,
            fiche=self.fiche,
            groupe_machine=self.group_machine,
        )
        self.etape2 = Etape.objects.create(
            num_etape=2,
            terminee=True,
            fiche=self.fiche,
            groupe_machine=self.group_machine,
        )
        self.etape3 = Etape.objects.create(
            num_etape=3,
            terminee=False,
            fiche=self.fiche,
            groupe_machine=self.group_machine,
        )
        etape1_fiche2_2 = Etape.objects.create(
            num_etape=1,
            terminee=True,
            fiche=self.fiche2_2,
            groupe_machine=self.group_machine,
        )
        etape1_fiche2_1 = Etape.objects.create(
            num_etape=1,
            terminee=True,
            fiche=self.fiche2_1,
            groupe_machine=self.group_machine,
        )

        # affaire 1 fiche 1 etape 1
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine,
            semaine_affectation="2021-01-01",
        )

        # affaire 2 fiche 2 etape 1
        affectation2 = AffectationMachine.objects.create(
            etape=etape1_fiche2_2,
            machine=self.machine,
            semaine_affectation="2021-01-01",
        )

        # affaire 2 fiche 1 etape 1
        affectation3 = AffectationMachine.objects.create(
            etape=etape1_fiche2_1,
            machine=self.machine,
            semaine_affectation="2021-01-01",
        )

        # affaire 1 fiche 1 etape 2
        affectation4 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine,
            semaine_affectation="2021-01-02",
        )

        # affaire 1 fiche 1 etape 3
        affectation5 = AffectationMachine.objects.create(
            etape=self.etape3,
            machine=self.machine,
            semaine_affectation="2021-01-03",
        )

        affectation5.previous = affectation4
        affectation5.save()

        affectation4.previous = affectation3
        affectation4.save()

        affectation3.previous = affectation2
        affectation3.save()

        affectation2.previous = affectation1
        affectation2.save()

        affectation1.previous = None
        affectation1.save()

    def test_retrieve_planning_machine_semaine(self):

        url = "/api/planning/machine"
        query_param = {"date": "2021-01-01"}
        response = self.client.get(url, query_param)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        affectations_machine_1 = response.json()[0]["affectations"]

        # séparer les affectations suivant l'ordre et leur affaire
        self.assertEqual(len(affectations_machine_1), 3)

        # affectation 1 = affaire 1 fiche 1 etape 1
        self.assertEqual(affectations_machine_1[0]["id"], 1)
        self.assertEqual(affectations_machine_1[0]["fiches"][0]["id"], 1)
        self.assertEqual(
            affectations_machine_1[0]["fiches"][0]["titre"], "Affaire Fiche test"
        )
        self.assertEqual(affectations_machine_1[0]["fiches"][0]["etapes"][0]["id"], 1)

        # affectation 2 = affaire 2 fiche 2 etape 1 + fiche 1 etape 1
        self.assertEqual(affectations_machine_1[1]["id"], 2)
        self.assertEqual(affectations_machine_1[1]["fiches"][0]["id"], 3)
        self.assertEqual(
            affectations_machine_1[1]["fiches"][0]["titre"], "Affaire 2 Fiche test 2_2"
        )
        self.assertEqual(affectations_machine_1[1]["fiches"][0]["etapes"][0]["id"], 4)

        self.assertEqual(affectations_machine_1[1]["fiches"][1]["id"], 2)
        self.assertEqual(
            affectations_machine_1[1]["fiches"][1]["titre"], "Affaire 2 Fiche test 2_1"
        )

        # affectation 3 = affaire 1 fiche 1 etape 2 + fiche 1 etape 3
        self.assertEqual(affectations_machine_1[2]["id"], 1)
        self.assertEqual(affectations_machine_1[2]["fiches"][0]["id"], 1)
        self.assertEqual(
            affectations_machine_1[2]["fiches"][0]["titre"], "Affaire Fiche test"
        )
        self.assertEqual(affectations_machine_1[2]["fiches"][0]["etapes"][0]["id"], 2)
        self.assertEqual(affectations_machine_1[2]["fiches"][0]["etapes"][1]["id"], 3)

    def test_a_planifier(self):
        """
        La semaine après le 2021-01-01, on doit retrouver 2 étapes à planifier, la 1 et la 2 car elles ne sont pas terminées
        """

        url = "/api/fiches/machine/a_planifier"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        a_planifier = response.json()
        # meme affaire, meme fiche, 2 etapes
        self.assertEqual(len(a_planifier), 1)
        self.assertEqual(len(a_planifier[0]["fiches"][0]["etapes"]), 2)
        self.assertEqual(a_planifier[0]["fiches"][0]["etapes"][0]["id"], 1)
        self.assertEqual(a_planifier[0]["fiches"][0]["etapes"][1]["id"], 3)


class PlanningAjustageTest(APITestCase):
    def setUp(self) -> None:
        pass
