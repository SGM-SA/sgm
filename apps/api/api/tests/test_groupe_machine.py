from rest_framework import status
from django.test import TestCase
from api.groupe_machine.models import GroupeMachine


class GroupeMachineCreateViewTestCase(TestCase):
    def test_create_groupe_machine(self):
        url = "/api/groupe_machine/"
        data = {
            "nom_groupe": "Groupe A",
            "prix_theorique": 100,
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(GroupeMachine.objects.count(), 1)
        self.assertEqual(GroupeMachine.objects.first().nom_groupe, "Groupe A")


class GroupeMachineRUDViewTestCase(TestCase):
    def setUp(self):
        self.groupe_machine = GroupeMachine.objects.create(
            nom_groupe="Groupe A",
            prix_theorique=100,
        )

    def test_read_groupe_machine(self):
        url = f"/api/groupe_machine/{self.groupe_machine.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nom_groupe"], "Groupe A")

    def test_update_groupe_machine(self):
        url = f"/api/groupe_machine/{self.groupe_machine.id}/"
        data = {
            "nom_groupe": "Groupe B",
            "prix_theorique": 150,
        }
        response = self.client.patch(
            url, data, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nom_groupe"], "Groupe B")
        self.assertEqual(response.data["prix_theorique"], 150)

    def test_delete_groupe_machine(self):
        url = f"/api/groupe_machine/{self.groupe_machine.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(GroupeMachine.objects.count(), 0)


class GroupeMachineBulkDeleteTestCase(TestCase):
    def test_bulk_delete_groupe_machine(self):
        url = "/api/groupe_machine/delete/"

        groupe1 = GroupeMachine.objects.create(
            nom_groupe="Groupe A",
            prix_theorique=100,
        )
        groupe2 = GroupeMachine.objects.create(
            nom_groupe="Groupe B",
            prix_theorique=200,
        )
        groupe3 = GroupeMachine.objects.create(
            nom_groupe="Groupe C",
            prix_theorique=300,
        )

        response = self.client.post(
            url,
            data={
                "ids": [groupe1.id, groupe2.id],
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(GroupeMachine.objects.count(), 1)
        self.assertEqual(GroupeMachine.objects.first(), groupe3)
