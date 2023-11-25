from django.urls import path
from .view import (
    GroupeMachineListCreateView,
    GroupeMachineRetrieveUpdateDestroyView,
    GroupeMachineBulkDeleteView,
    GroupeMachineMachinesListView,
)

urlpatterns = [
    path(
        "",
        GroupeMachineListCreateView.as_view(),
        name="groupe-machine-list-create",
    ),
    path(
        "machines/<int:pk>/",
        GroupeMachineMachinesListView.as_view(),
        name="groupe-machine-machines-list",
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
