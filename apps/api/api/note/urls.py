from django.urls import path
from .view import NoteCreateAPIView, NoteRUDAPIView, AffaireNotesListView

urlpatterns = [
    path("", NoteCreateAPIView.as_view()),
    path("<int:pk>", NoteRUDAPIView.as_view()),
    path("affaire/<int:affaire_id>", AffaireNotesListView.as_view()),
]
