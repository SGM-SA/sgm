from django.urls import path, include
from api import views
from api.affaire.urls import urlpatterns as affaire_patters
from api.fiche.urls import urlpatterns as fiche_patterns
from api.etape.urls import urlpatterns as etape_patterns
from api.zone.urls import urlpatterns as zone_patterns
from api.machine.urls import urlpatterns as machine_patterns
from api.affectation_etape_zone.urls import urlpatterns as affectation_patterns
from api.affectation_etape_machine.urls import (
    urlpatterns as affectation_machine_patterns,
)
from api.planning_zone.urls import urlpatterns as planning_zone_patterns
from api.planning_machine.urls import urlpatterns as planning_machine_patterns
from api.user.urls import urlpatterns as user_patterns
from api.etape_modele.urls import urlpatterns as etape_modele_patterns
from api.fiche_modele.urls import urlpatterns as fiche_modele_patterns
from api.salarie.urls import urlpatterns as salarie_patterns
from api.synchro.view import resync_data_sgm
from api.note.urls import urlpatterns as note_patterns

urlpatterns = [
    path("affaires/", include(affaire_patters)),
    path("notes/", include(note_patterns)),
    path("fiches/", include(fiche_patterns)),
    path("etapes/", include(etape_patterns)),
    path("zones/", include(zone_patterns)),
    path("machines/", include(machine_patterns)),
    path("affectations/ajustages/", include(affectation_patterns)),
    path("affectations/machines/", include(affectation_machine_patterns)),
    # TODO : ajout affectation_etape_machine
    path("planning/", include(planning_zone_patterns)),
    path("planning/", include(planning_machine_patterns)),
    path("user", include(user_patterns)),
    path("salaries/", include(salarie_patterns)),
    path("modeles/", include(etape_modele_patterns)),
    path("modeles/", include(fiche_modele_patterns)),
    path("clients", views.ClientList.as_view()),
    path("clients/<int:pk>", views.ClientDetail.as_view()),
    path("etats", views.EtatList.as_view()),
    path("etats/<int:pk>", views.EtatDetail.as_view()),
    path("tasks/resync_data_sgm", resync_data_sgm, name="resync_data_sgm"),
]
