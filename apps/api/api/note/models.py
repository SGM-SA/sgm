from django.db import models
from django.contrib.auth.models import User
from api.affaire.models import Affaire


class Note(models.Model):
    affaire = models.ForeignKey(
        Affaire,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="notes",
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_notes"
    )
    contenu = models.TextField()
    date_creation = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.contenu[:10]}..."
