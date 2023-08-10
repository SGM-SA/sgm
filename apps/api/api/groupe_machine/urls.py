from django.urls import path
from .view import (
    GroupeMachineListCreateView,
    GroupeMachineRetrieveUpdateDestroyView,
    GroupeMachineBulkDeleteView,
)

urlpatterns = [
    path(
        "",
        GroupeMachineListCreateView.as_view(),
        name="groupe-machine-list-create",
    ),
    path(
        "<int:pk>/",
        GroupeMachineRetrieveUpdateDestroyView.as_view(),
        name="groupe-machine-detail",
    ),
    path(
        "delete/",
        GroupeMachineBulkDeleteView.as_view(),
        name="groupe-machine-bulk-delete",
    ),
]
