from django.urls import path
from api.affectation_etape_zone.view import (
    AffectationAjustageCreateList,
    AffectationAjustageCRUD,
)

urlpatterns = [
    path("", AffectationAjustageCreateList.as_view()),
    path("<int:pk>", AffectationAjustageCRUD.as_view()),
]
