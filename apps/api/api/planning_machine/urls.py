from django.urls import path
from api.planning_machine.view import PlanningMachineAvecFiches

urlpatterns = [
    path("machine", PlanningMachineAvecFiches.as_view()),
]
