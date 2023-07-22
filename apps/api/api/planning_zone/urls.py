from django.urls import path
from api.planning_zone.view import PlanningZoneAvecFiches

urlpatterns = [
    path("zone", PlanningZoneAvecFiches.as_view()),
]
