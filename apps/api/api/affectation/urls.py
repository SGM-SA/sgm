from django.urls import path

from api.affectation.views import (
    AffectationMachineCreate,
    AffectationMachineCRUD,
    AffectationAjustageCreate,
    AffectationAjustageCRUD,
)

urlpatterns = [
    path("machines", AffectationMachineCreate.as_view()),
    path("machines/<int:pk>", AffectationMachineCRUD.as_view()),
    path("ajustages", AffectationAjustageCreate.as_view()),
    path("ajustages/<int:pk>", AffectationAjustageCRUD.as_view()),
]
