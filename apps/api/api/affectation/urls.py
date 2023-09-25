from django.urls import path

from api.affectation.views import (
    AffectationMachineCreateList,
    AffectationMachineCRUD,
    AffectationAjustageCreateList,
    AffectationAjustageCRUD,
)

urlpatterns = [
    path("machines", AffectationMachineCreateList.as_view()),
    path("machines/<int:pk>", AffectationMachineCRUD.as_view()),
    path("ajustages", AffectationAjustageCreateList.as_view()),
    path("ajustages/<int:pk>", AffectationAjustageCRUD.as_view()),
]
