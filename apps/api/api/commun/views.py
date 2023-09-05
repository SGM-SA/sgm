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
    Bulk delete d'objets en fonction de leur id
    """

    queryset = None

    @extend_schema(
        request=BulkDeleteSerializer,
        responses={204: None, 400: None},
    )
    def post(self, request, *args, **kwargs):
        try:
            ids = request.data.get("ids", None)
            if ids is None:
                return Response(status=HTTP_400_BAD_REQUEST)

            objs = self.queryset.filter(id__in=ids)
            objs.delete()

            return Response(status=HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(status=HTTP_400_BAD_REQUEST, data={"error": str(e)})
