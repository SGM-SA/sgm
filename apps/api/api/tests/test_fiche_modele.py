from datetime import timezone, timedelta, datetime

from rest_framework import status
from django.test import TestCase
from api.zone.models import Zone
from api.fiche.models import Fiche
from api.affaire.models import Affaire
from api.machine.models import Machine
from api.groupe_machine.models import GroupeMachine
from api.fiche_modele.models import FicheModele
from api.etape_modele.models import EtapeModele
from api.affectation_etape_machine.models import AffectationMachine
from api.affectation_etape_zone.models import AffectationAjustage


class FicheModeleCopyViewTestCase(TestCase):
    def setUp(self):
        self.affaire = Affaire.objects.create(num_affaire=1)
        self.groupe_machine = GroupeMachine.objects.create(nom_groupe="Groupe 1")
        self.machine = Machine.objects.create(
            nom_machine="Machine 1", groupe_machine=self.groupe_machine
        )

        self.fiche_modele = FicheModele.objects.create(
            titre="Fiche modele 1",
            description="Description 1",
            fourniture=False,
        )

        self.etape_modele = EtapeModele.objects.create(
            fiche_modele=self.fiche_modele,
            num_etape=1,
            quantite=1,
            temps=1,
            groupe_machine=self.groupe_machine,
        )

        self.etape_modele_2 = EtapeModele.objects.create(
            fiche_modele=self.fiche_modele,
            num_etape=2,
            quantite=1,
            temps=1,
            groupe_machine=self.groupe_machine,
        )

    def test_copy_modele(self):
        url = f"/api/modeles/fiches/copy?affaire={self.affaire.id}&modele={self.fiche_modele.id}"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # fiche
        self.assertEqual(self.affaire.fiches.first().titre, self.fiche_modele.titre)
        self.assertEqual(
            self.affaire.fiches.first().description, self.fiche_modele.description
        )
        self.assertEqual(
            self.affaire.fiches.first().fourniture, self.fiche_modele.fourniture
        )
        self.assertEqual(self.affaire.fiches.first().affaire, self.affaire)

        # etapes
        self.assertEqual(
            self.affaire.fiches.first().etapes.first().num_etape,
            self.etape_modele.num_etape,
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.first().quantite,
            self.etape_modele.quantite,
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.first().temps, self.etape_modele.temps
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.first().fiche,
            self.affaire.fiches.first(),
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.first().groupe_machine,
            self.etape_modele.groupe_machine,
        )

        self.assertEqual(
            self.affaire.fiches.first().etapes.last().num_etape,
            self.etape_modele_2.num_etape,
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.last().quantite,
            self.etape_modele_2.quantite,
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.last().temps, self.etape_modele_2.temps
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.last().fiche, self.affaire.fiches.first()
        )
        self.assertEqual(
            self.affaire.fiches.first().etapes.last().groupe_machine,
            self.etape_modele_2.groupe_machine,
        )
