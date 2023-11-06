from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
)
from drf_spectacular.utils import extend_schema
from .serializer import BulkDeleteSerializer


class BulkDeleteView(APIView):
    """
    Bulk delete d'objets en fonction de leur id,
    permet de supprimer plusieurs objets en même temps ou de les désactiver
    query_set: queryset des objets à supprimer
    disable: booléen, si True désactive les objets au lieu de les supprimer
    disable_field: champ à modifier pour désactiver les objets
    """

    queryset = None
    disable = False
    active_field = None

    @extend_schema(
        request=BulkDeleteSerializer,
        responses={204: None, 400: None},
    )
    def post(self, request, *args, **kwargs):
        if not self.disable:
            try:
                ids = request.data.get("ids", None)
                if ids is None:
                    return Response(status=HTTP_400_BAD_REQUEST)

                objs = self.queryset.filter(id__in=ids)
                objs.delete()

                return Response(status=HTTP_204_NO_CONTENT)
            except Exception as e:
                return Response(status=HTTP_400_BAD_REQUEST, data={"error": str(e)})

        else:
            try:
                ids = request.data.get("ids", None)
                if ids is None:
                    return Response(status=HTTP_400_BAD_REQUEST)

                objs = self.queryset.filter(id__in=ids)
                objs.update(**{self.active_field: False})

                return Response(status=HTTP_204_NO_CONTENT)
            except Exception as e:
                return Response(status=HTTP_400_BAD_REQUEST, data={"error": str(e)})
