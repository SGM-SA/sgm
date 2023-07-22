from django.urls import path
from api.affaire.view import AffaireList, AffaireDetail, AffaireDetailFiches, AffaireNumAffaire

urlpatterns = [
    path("", AffaireList.as_view()),
    path("nums", AffaireNumAffaire.as_view()),
    path("<int:pk>", AffaireDetail.as_view()),
    path("<int:pk>/fiches", AffaireDetailFiches.as_view()),
]
