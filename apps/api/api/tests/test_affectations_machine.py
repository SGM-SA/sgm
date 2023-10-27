from rest_framework import status
from rest_framework.test import APITestCase
from api.affaire.models import Affaire
from api.affectation.models import AffectationMachine
from api.etape.models import Etape
from api.fiche.models import Fiche
from api.groupe_machine.models import GroupeMachine
from django.utils import timezone

from api.machine.models import Machine


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
            num_etape=2,
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

        affectation = AffectationMachine.objects.get(id=response.data["id"])
        self.assertEqual(affectation.previous, None)

    def test_create_affectation_machine_haut_liste(self):
        """
        Teste la création d'une affectation machine, quand la machine déjà une affectation à cette date
        """

        aff1 = AffectationMachine.objects.create(
            etape=self.etape1,
            semaine_affectation="2021-01-01",
            machine=self.machine_scie,
        )

        url = "/api/affectations/machines"
        data = {
            "etape": self.etape2.id,
            "semaine_affectation": "2021-01-01",
            "machine": self.machine_scie.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        aff_id = response.data["id"]
        aff: AffectationMachine = AffectationMachine.objects.get(id=aff_id)
        aff1.refresh_from_db()
        self.assertEqual(aff1.previous, aff)

    def test_create_affectation_machine_milieu_liste(self):
        """
        Teste la création d'une affectation machine entre 2 affectations
        """

        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )

        aff1 = AffectationMachine.objects.create(
            etape=self.etape1,
            semaine_affectation="2021-01-01",
            machine=self.machine_scie,
        )

        aff2 = AffectationMachine.objects.create(
            etape=self.etape2,
            semaine_affectation="2021-01-01",
            machine=self.machine_scie,
            previous=aff1,
        )

        url = "/api/affectations/machines"
        data = {
            "etape": etape3.id,
            "semaine_affectation": "2021-01-01",
            "machine": self.machine_scie.id,
            "previous": aff1.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        affecation_id = response.data["id"]
        aff3: AffectationMachine = AffectationMachine.objects.get(id=affecation_id)
        aff1.refresh_from_db()
        aff2.refresh_from_db()

        self.assertEqual(aff3.previous, aff1)
        self.assertEqual(aff3.next.first(), aff2)
        self.assertEqual(aff2.previous, aff3)
        self.assertEqual(aff1.next.first(), aff3)

    def test_create_affectation_machine_fin_liste(self):
        """
        Teste la création d'une affectation machine, ajout en fin de liste
        """

        aff1 = AffectationMachine.objects.create(
            etape=self.etape1,
            semaine_affectation="2021-01-01",
            machine=self.machine_scie,
        )

        url = "/api/affectations/machines"
        data = {
            "etape": self.etape2.id,
            "semaine_affectation": "2021-01-01",
            "machine": self.machine_scie.id,
            "previous": aff1.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        aff2: AffectationMachine = AffectationMachine.objects.get(
            id=response.data["id"]
        )
        aff1.refresh_from_db()

        self.assertEqual(aff2.previous.id, aff1.id)
        self.assertEqual(aff1.next.first(), aff2)

    def test_create_affectation_machine_etape_deja_affectee(self):
        """
        Teste la création d'une affectation machine pour une étape déjà affectée à cette date / semaine
        """

        AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        url = "/api/affectations/machines"
        data = {
            "etape": self.etape1.id,
            "machine": self.machine_scie.id,
            "semaine_affectation": "2021-01-01",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_affectation_machine_etape_deja_affectee_autre_semaine(self):
        """
        Teste la création d'une affectation machine pour une étape mais on change la semaine
        """

        AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        url = "/api/affectations/machines"
        data = {
            "etape": self.etape1.id,
            "machine": self.machine_scie.id,
            "semaine_affectation": "2021-02-02",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_affectation_machine(self):
        """
        Teste la mise à jour d'une affectation machine, on ne peut pas changer la semaine
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
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_previous_affectation_machine_de_bas_vers_haut_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, on la met en haut de la liste. Tout en bas vers tout en haut

        """

        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )

        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )

        affectation3 = AffectationMachine.objects.create(
            etape=etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        url = f"/api/affectations/machines/{affectation3.id}"
        data = {
            "previous": None,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        affectation3.refresh_from_db()
        affectation2.refresh_from_db()
        affectation1.refresh_from_db()

        self.assertEqual(affectation1.previous.id, affectation3.id)
        self.assertEqual(affectation2.previous.id, affectation1.id)
        self.assertEqual(affectation3.previous, None)

    def test_update_previous_affectation_machine_de_haut_vers_bas_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, de tout en haut de la liste vers tout en bas.

        """

        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )

        url = f"/api/affectations/machines/{affectation1.id}"
        data = {
            "previous": affectation2.id,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        affectation1.refresh_from_db()
        affectation2.refresh_from_db()

        self.assertEqual(affectation1.previous.id, affectation2.id)
        self.assertEqual(affectation2.previous, None)

    def test_update_previous_affectation_machine_de_milieu_vers_bas_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, de milieu de la liste vers tout en bas.
        """

        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )
        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )
        affectation3 = AffectationMachine.objects.create(
            etape=etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        etape4 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=5,
        )

        affectation4 = AffectationMachine.objects.create(
            etape=etape4,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation3,
        )

        url = f"/api/affectations/machines/{affectation2.id}"
        # on modifie l'affectation 2 pour qu'elle soit en bas de la liste
        data = {
            "previous": affectation4.id,
        }
        response = self.client.patch(url, data, format="json")

        affectation1.refresh_from_db()
        affectation2.refresh_from_db()
        affectation3.refresh_from_db()
        affectation4.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(affectation2.previous, affectation4)

        self.assertEqual(affectation4.previous, affectation3)
        self.assertEqual(affectation3.previous, affectation1)
        self.assertEqual(affectation1.previous, None)

    def test_update_previous_affectation_machine_de_milieu_vers_haut_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, de milieu de la liste vers tout en haut.
        """
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )
        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )
        affectation3 = AffectationMachine.objects.create(
            etape=etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        etape4 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=4,
        )

        affectation4 = AffectationMachine.objects.create(
            etape=etape4,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation3,
        )

        url = f"/api/affectations/machines/{affectation3.id}"
        # on modifie l'affectation 3 pour qu'elle soit en haut de la liste
        data = {
            "previous": None,
        }
        response = self.client.patch(url, data, format="json")

        affectation1.refresh_from_db()
        affectation2.refresh_from_db()
        affectation3.refresh_from_db()
        affectation4.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(affectation3.previous, None)

        self.assertEqual(affectation1.previous, affectation3)
        self.assertEqual(affectation2.previous, affectation1)
        self.assertEqual(affectation4.previous, affectation2)

    def test_update_previous_affectation_machine_de_milieu_vers_milieu_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, de milieu de la liste vers milieu de la liste.
        """

        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )
        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )
        affectation3 = AffectationMachine.objects.create(
            etape=etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        etape4 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=4,
        )

        affectation4 = AffectationMachine.objects.create(
            etape=etape4,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation3,
        )

        etape5 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=5,
        )
        affectation5 = AffectationMachine.objects.create(
            etape=etape5,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation4,
        )

        url = f"/api/affectations/machines/{affectation2.id}"
        # on modifie l'affectation 2 pour qu'elle soit entre 4 et 5
        data = {
            "previous": affectation4.id,
        }

        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        affectation1.refresh_from_db()
        affectation2.refresh_from_db()
        affectation3.refresh_from_db()
        affectation4.refresh_from_db()
        affectation5.refresh_from_db()

        self.assertEqual(affectation2.previous, affectation4)

        self.assertEqual(affectation1.previous, None)
        self.assertEqual(affectation3.previous, affectation1)
        self.assertEqual(affectation4.previous, affectation3)
        self.assertEqual(affectation5.previous, affectation2)

    def test_update_previous_affectation_machine_de_haut_vers_milieu_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, de haut de la liste vers milieu de la liste.
        """

        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )
        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )
        affectation3 = AffectationMachine.objects.create(
            etape=etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        url = f"/api/affectations/machines/{affectation1.id}"
        # on modifie l'affectation 1 pour qu'elle soit entre 2 et 3
        data = {
            "previous": affectation2.id,
        }

        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        affectation1.refresh_from_db()
        affectation2.refresh_from_db()
        affectation3.refresh_from_db()

        self.assertEqual(affectation1.previous, affectation2)

        self.assertEqual(affectation2.previous, None)
        self.assertEqual(affectation3.previous, affectation1)

    def test_update_previous_affectation_machine_de_bas_vers_milieu_liste(self):
        """
        Teste la mise à jour du field previous de l'affectation, de haut de la liste vers milieu de la liste.
        """

        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )
        etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )
        affectation3 = AffectationMachine.objects.create(
            etape=etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        url = f"/api/affectations/machines/{affectation3.id}"
        # on modifie l'affectation 3 pour qu'elle soit entre 1 et 2
        data = {
            "previous": affectation1.id,
        }

        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        affectation1.refresh_from_db()
        affectation2.refresh_from_db()
        affectation3.refresh_from_db()

        self.assertEqual(affectation3.previous, affectation1)

        self.assertEqual(affectation1.previous, None)
        self.assertEqual(affectation2.previous, affectation3)

    def test_delete_affectation_ajustage_seul(self):
        """
        Teste la suppression d'une affectation ajustage
        """
        affectation = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation=timezone.now().strftime("%Y-%m-%d"),
        )

        url = f"/api/affectations/machines/{affectation.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AffectationMachine.objects.count(), 0)

    def test_delete_affectation_ajustage_debut_liste(self):
        """
        Teste la suppression d'une affectation ajustage
        """
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )
        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )

        url = f"/api/affectations/machines/{affectation1.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AffectationMachine.objects.count(), 1)

        affectation2.refresh_from_db()
        self.assertEqual(affectation2.previous, None)

    def test_delete_affectation_ajustage_fin_liste(self):
        """
        Teste la suppression d'une affectation ajustage, fin de liste
        """
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )
        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )

        url = f"/api/affectations/machines/{affectation2.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AffectationMachine.objects.count(), 1)

        affectation1.refresh_from_db()
        self.assertEqual(affectation1.previous, None)
        self.assertEqual(affectation1.next.first(), None)

    def test_delete_affectation_ajustage_milieu_liste(self):
        """
        Teste la suppression d'une affectation ajustage, milieu de liste
        """
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )
        affectation2 = AffectationMachine.objects.create(
            etape=self.etape2,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation1,
        )
        self.etape3 = Etape.objects.create(
            fiche=self.fiche,
            groupe_machine=self.groupe_machine,
            num_etape=3,
        )
        affectation3 = AffectationMachine.objects.create(
            etape=self.etape3,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
            previous=affectation2,
        )

        url = f"/api/affectations/machines/{affectation2.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AffectationMachine.objects.count(), 2)

        affectation1.refresh_from_db()
        affectation3.refresh_from_db()
        self.assertEqual(affectation1.previous, None)
        self.assertEqual(affectation3.previous, affectation1)
        self.assertEqual(affectation3.next.first(), None)

    def test_affectation_pas_meme_semaine(self):
        """
        Teste la création d'une affectation machine avec une semaine différente. Impossible
        """
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        url = f"/api/affectations/machines"
        data = {
            "etape": self.etape1.id,
            "machine": self.machine_scie.id,
            "semaine_affectation": "2021-02-02",
            "previous": affectation1.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(AffectationMachine.objects.count(), 1)

    def test_affectation_pas_meme_semaine_non_liee(self):
        """
        Teste la création d'une affectation machine avec une semaine différente. Non liée donc ok
        """
        affectation1 = AffectationMachine.objects.create(
            etape=self.etape1,
            machine=self.machine_scie,
            semaine_affectation="2021-01-01",
        )

        url = f"/api/affectations/machines"
        data = {
            "etape": self.etape1.id,
            "machine": self.machine_scie.id,
            "semaine_affectation": "2021-02-02",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AffectationMachine.objects.count(), 2)
        self.assertEqual(
            AffectationMachine.objects.get(id=response.data["id"]).previous, None
        )
        self.assertEqual(
            AffectationMachine.objects.get(id=response.data["id"]).next.first(), None
        )
        affectation1.refresh_from_db()
        self.assertEqual(affectation1.next.first(), None)
