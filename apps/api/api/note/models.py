from django.db import models

from api.user.models import CustomUser
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
        CustomUser, on_delete=models.CASCADE, related_name="user_notes"
    )
    contenu = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)

    vue_par = models.ManyToManyField(CustomUser, blank=True, related_name="notes_vues")

    def __str__(self):
        return f"{self.user.name}: {self.contenu[:10]}..."
