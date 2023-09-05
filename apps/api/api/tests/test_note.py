from django.contrib.auth.models import User
from rest_framework import status
from django.test import TestCase
from api.affaire.models import Affaire
from api.note.models import Note
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class NoteViewsTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

        # Create an instance of Affaire
        self.affaire = Affaire.objects.create(num_affaire=1)

        # Set up the client for API requests
        self.client = APIClient()

        # Authenticate the client using JWT
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_create_note(self):
        url = "/api/notes/"
        data = {
            "contenu": "Test note",
            "affaire": self.affaire.id,
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)
        self.assertEqual(Note.objects.first().contenu, "Test note")
        self.assertEqual(Note.objects.first().affaire, self.affaire)
        self.assertEqual(Note.objects.first().user, self.user)

    def test_retrieve_note(self):
        note = Note.objects.create(
            contenu="Test note for retrieve",
            affaire=self.affaire,
            user=self.user,
        )
        url = f"/api/notes/{note.id}"

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["contenu"], note.contenu)

    def test_update_note(self):
        note = Note.objects.create(
            contenu="Test note for update",
            affaire=self.affaire,
            user=self.user,
        )
        url = f"/api/notes/{note.id}"
        updated_content = "Updated note content"
        response = self.client.put(url, {"contenu": updated_content}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        note.refresh_from_db()
        self.assertEqual(note.contenu, updated_content)

    def test_delete_note(self):
        note = Note.objects.create(
            contenu="Test note for delete",
            affaire=self.affaire,
            user=self.user,
        )
        url = f"/api/notes/{note.id}"

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)
