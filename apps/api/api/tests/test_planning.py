# import TestCase
from random import shuffle

from django.test import TestCase

from api.affaire.models import Affaire
from api.affectation.models import AffectationMachine
from api.fiche.models import Fiche
from api.machine.models import Machine
from api.planning_machine.utils import (
    sort_affectations_by_previous,
    group_sorted_affectations,
)
from api.etape.models import Etape
from api.groupe_machine.models import GroupeMachine


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

        affectation2.previous = affectation3
        affectation2.save()

        affectation1.previous = affectation2
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

        affectation4.previous = affectation5
        affectation4.save()

        affectation3.previous = affectation4
        affectation3.save()

        affectation2.previous = affectation3
        affectation2.save()

        affectation1.previous = affectation2
        affectation1.save()

        sorted_affectations = sort_affectations_by_previous(
            AffectationMachine.objects.all()
        )

        group_sorted_affectations_result = group_sorted_affectations(
            sorted_affectations
        )

        self.assertEqual(
            group_sorted_affectations_result,
            [
                {
                    "affaire": self.affaire,
                    "fiches": [
                        {
                            "fiche": self.fiche,
                            "etapes": [
                                self.etape1,
                            ],
                        }
                    ],
                },
                {
                    "affaire": self.affaire2,
                    "fiches": [
                        {
                            "fiche": self.fiche2_2,
                            "etapes": [
                                etape1_fiche2_2,
                            ],
                        },
                        {
                            "fiche": self.fiche2_1,
                            "etapes": [
                                etape1_fiche2_1,
                            ],
                        },
                    ],
                },
                {
                    "affaire": self.affaire,
                    "fiches": [
                        {
                            "fiche": self.fiche,
                            "etapes": [
                                self.etape2,
                                self.etape3,
                            ],
                        }
                    ],
                },
            ],
        )
