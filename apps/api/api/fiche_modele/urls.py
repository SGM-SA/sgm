from django.urls import path

from api.fiche_modele.view import (
    FicheModeleListCreateView,
    FicheModeleDetailView,
    CopieModeleToAffaire,
    FicheModeleOptionsView
)

urlpatterns = [
    path("fiches/", FicheModeleListCreateView.as_view()),
    path("fiches/<int:pk>", FicheModeleDetailView.as_view()),
    path("fiches/copy", CopieModeleToAffaire.as_view()),
    path("fiches/options", FicheModeleOptionsView.as_view()),
]