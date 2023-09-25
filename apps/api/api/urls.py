from django.urls import path, include
from api.affaire.urls import urlpatterns as affaire_patters
from api.fiche.urls import urlpatterns as fiche_patterns
from api.etape.urls import urlpatterns as etape_patterns
from api.zone.urls import urlpatterns as zone_patterns
from api.machine.urls import urlpatterns as machine_patterns
from api.affectation.urls import urlpatterns as affectations_patterns
from api.planning_zone.urls import urlpatterns as planning_zone_patterns
from api.planning_machine.urls import urlpatterns as planning_machine_patterns
from api.user.urls import urlpatterns as user_patterns, salarie_patterns
from api.etape_modele.urls import urlpatterns as etape_modele_patterns
from api.fiche_modele.urls import urlpatterns as fiche_modele_patterns
from api.synchro.view import resync_data_sgm
from api.note.urls import urlpatterns as note_patterns
from api.groupe_machine.urls import urlpatterns as groupe_machine_patterns
from api.pointage.urls import urlpatterns as pointage_patterns

urlpatterns = [
    path("affaires/", include(affaire_patters)),
    path("notes/", include(note_patterns)),
    path("fiches/", include(fiche_patterns)),
    path("etapes/", include(etape_patterns)),
    path("zones/", include(zone_patterns)),
    path("groupe_machine/", include(groupe_machine_patterns)),
    path("machines/", include(machine_patterns)),
    path("affectations/", include(affectations_patterns)),
    path("pointages/", include(pointage_patterns)),
    path("planning/", include(planning_zone_patterns)),
    path("planning/", include(planning_machine_patterns)),
    path("user", include(user_patterns)),
    path("salaries/", include(salarie_patterns)),
    path("modeles/", include(etape_modele_patterns)),
    path("modeles/", include(fiche_modele_patterns)),
    path("tasks/resync_data_sgm", resync_data_sgm, name="resync_data_sgm"),
]
