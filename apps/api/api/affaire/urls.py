from django.urls import path
from api.affaire.view import (
    AffaireList,
    AffaireDetail,
    AffaireDetailFiches,
    AffaireNumAffaire,
    AffaireNumAffaires,
    AffaireStatsGlobalView,
    AffaireStatsView,
)

urlpatterns = [
    path("", AffaireList.as_view()),
    path("nums", AffaireNumAffaires.as_view()),
    path("nums/<int:num_affaire>", AffaireNumAffaire.as_view(), name="affaire-by-num"),
    path("<int:pk>", AffaireDetail.as_view()),
    path("<int:pk>/fiches", AffaireDetailFiches.as_view()),
    path("stats/", AffaireStatsGlobalView.as_view(), name="affaires-stats"),
    path("stats/<int:pk>", AffaireStatsView.as_view(), name="affaire-stats"),
]
