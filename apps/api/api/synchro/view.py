# create a django view to run a task

from django.http import HttpResponse
from background_task import background
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view
from .task import recuperer_donnees_sgm


@extend_schema(
    summary="Sync data SGM",
    description="Sync les données SGM affaire avec la base de données django",
    tags=["Tasks"],
    request=None,
    responses={200: None},
)
@api_view(["POST"])
def resync_data_sgm(request):
    """
    Sync les données SGM affaire avec la base de données
    """
    recuperer_donnees_sgm()
    return HttpResponse("OK")


# don't forget to add the url to urls.py
# path("run_task", run_task, name="run_task"),
