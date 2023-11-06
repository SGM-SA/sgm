from django.urls import path

from api.affectation.views import (
    AffectationMachineCreate,
    AffectationMachineUpdateDelete,
    AffectationAjustageCreate,
    AffectationAjustageUpdateDelete,
)

urlpatterns = [
    path("machines", AffectationMachineCreate.as_view()),
    path("machines/<int:pk>", AffectationMachineUpdateDelete.as_view()),
    path("ajustages", AffectationAjustageCreate.as_view()),
    path("ajustages/<int:pk>", AffectationAjustageUpdateDelete.as_view()),
]
