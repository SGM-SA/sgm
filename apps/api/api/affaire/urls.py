from django.urls import path
from api.affaire.view import (
    AffaireList,
    AffaireDetail,
    AffaireDetailFiches,
    AffaireNumAffaire,
    AffaireStatsGlobalView,
    AffaireStatsView,
)

urlpatterns = [
    path("", AffaireList.as_view()),
    path("nums", AffaireNumAffaire.as_view()),
    path("<int:pk>", AffaireDetail.as_view()),
    path("<int:pk>/fiches", AffaireDetailFiches.as_view()),
    path("stats/", AffaireStatsGlobalView.as_view(), name="affaires-stats"),
    path("stat/<int:pk>", AffaireStatsView.as_view(), name="affaire-stats"),
]
