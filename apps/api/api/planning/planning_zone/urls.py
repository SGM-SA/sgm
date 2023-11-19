from django.urls import path
from api.planning.planning_zone.view import (
    PlanningZoneAvecFiches,
    ExportPlanningZonePDF,
)

urlpatterns = [
    path("zone", PlanningZoneAvecFiches.as_view()),
    path("zone/pdf", ExportPlanningZonePDF.as_view()),
]
