from django.urls import path
from api.affectation_etape_machine.view import (
    AffectationMachineCreateList,
    AffectationMachineCRUD,
)

urlpatterns = [
    path("", AffectationMachineCreateList.as_view()),
    path("<int:pk>", AffectationMachineCRUD.as_view()),
]
