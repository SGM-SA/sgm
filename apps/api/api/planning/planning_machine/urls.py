from django.urls import path
from api.planning.planning_machine.view import (
    PlanningMachineAvecFiches,
    ExportPlanningMachinePDF,
)

urlpatterns = [
    path("machine", PlanningMachineAvecFiches.as_view()),
    path("machine/pdf", ExportPlanningMachinePDF.as_view()),
]
