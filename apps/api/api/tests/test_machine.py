from rest_framework.test import APITestCase

from api.groupe_machine.models import GroupeMachine
from api.machine.models import Machine


class MachineTest(APITestCase):
    def setUp(self):
        self.group1 = GroupeMachine.objects.create(nom_groupe="group1")
        self.machine1 = Machine.objects.create(
            nom_machine="machine1",
            groupe_machine=self.group1,
        )
        self.machine2 = Machine.objects.create(
            nom_machine="machine2",
            groupe_machine=self.group1,
        )

    def test_list(self):
        response = self.client.get("/api/machines/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

    def test_create(self):
        response = self.client.post(
            "/api/machines/",
            {
                "nom_machine": "machine3",
                "groupe_machine": self.group1.id,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Machine.objects.count(), 3)

    def test_retrieve(self):
        response = self.client.get(f"/api/machines/{self.machine1.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["nom_machine"], "machine1")

    def test_update(self):
        response = self.client.patch(
            f"/api/machines/{self.machine1.id}",
            {
                "nom_machine": "machine1_updated",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["nom_machine"], "machine1_updated")

    def test_bulk_delete(self):
        """
        Test bulk delete, les machines ne doivent pas être supprimées, mais seulement désactivées
        """
        response = self.client.post(
            "/api/machines/delete",
            {
                "ids": [self.machine2.id, self.machine1.id],
            },
            format="json",
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Machine.objects.count(), 2)
        self.assertEqual(Machine.objects.filter(est_active=True).count(), 0)
