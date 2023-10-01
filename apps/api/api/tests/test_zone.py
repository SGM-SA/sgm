from rest_framework.test import APITestCase

from api.zone.models import Zone


class ZoneTest(APITestCase):
    def setUp(self):
        self.zone1 = Zone.objects.create(nom="Zone1", description="Description1")
        self.zone2 = Zone.objects.create(nom="Zone2", description="Description2")

    def test_list_zone(self):
        response = self.client.get("/api/zones/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["nom"], "Zone1")
        self.assertEqual(response.data["results"][1]["nom"], "Zone2")

    def test_create_zone(self):
        response = self.client.post(
            "/api/zones/", {"nom": "Zone3", "description": "Description3"}
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["nom"], "Zone3")
        self.assertEqual(response.data["description"], "Description3")

    def test_update_zone(self):
        response = self.client.put(
            f"/api/zones/{self.zone1.id}",
            {"nom": "Zone1", "description": "Description1"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["nom"], "Zone1")
        self.assertEqual(response.data["description"], "Description1")

    def test_bulk_delete_zone(self):
        response = self.client.post(
            "/api/zones/delete",
            {"ids": [self.zone1.id, self.zone2.id]},
            format="json",
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Zone.objects.count(), 0)
