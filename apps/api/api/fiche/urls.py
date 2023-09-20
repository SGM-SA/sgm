from django.urls import path
from api.fiche.view import (
    FicheCreateView,
    FicheRUDView,
    FicheEtEtapes,
    FichesAjustageAPlanifier,
    FichesMachineAPlanifier,
    FicheBulkDelete,
    ExportFicheEtapesView
)

urlpatterns = [
    path("", FicheCreateView.as_view()),
    path("delete/", FicheBulkDelete.as_view()),
    path("<int:pk>", FicheRUDView.as_view()),
    path("etapes/<int:pk>", FicheEtEtapes.as_view()),
    path("ajustage/a_planifier", FichesAjustageAPlanifier.as_view()),
    path("machine/a_planifier", FichesMachineAPlanifier.as_view()),
    path("export", ExportFicheEtapesView.as_view()),
]
