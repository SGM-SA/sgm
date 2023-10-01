from django.urls import path
from api.machine.view import MachineListCreate, MachineDetail, MachinesBulkDelete

urlpatterns = [
    path("", MachineListCreate.as_view()),
    path("delete", MachinesBulkDelete.as_view()),
    path("<int:pk>", MachineDetail.as_view()),
]
