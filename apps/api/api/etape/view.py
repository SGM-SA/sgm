from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from rest_framework.response import Response
from api.etape.models import Etape
from api.etape.serializer import EtapeCreateSerializer
from rest_framework import generics, status
from typing import List

class EtapeCreate(generics.CreateAPIView):
    queryset = Etape.objects.all()
    serializer_class = EtapeCreateSerializer


class EtapeRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Etape.objects.all()
    serializer_class = EtapeCreateSerializer


@extend_schema_view(
    delete=extend_schema(
        summary="Suppression",
        description="Bulk delete des étapes",
        tags=["Etape"],
    ),
)
class EtapesBulkDelete(generics.DestroyAPIView):
    queryset = Etape.objects.all()
    serializer_class = EtapeCreateSerializer

    # custom delete method where ids are provided in the url
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="ids",
                type=int,
                required=True,
                description="Liste des ids des étapes à supprimer",
            )
        ]
    )
    def delete(self, request, *args, **kwargs):

        try:
            # delete all the objects
            pk_ids: str = request.query_params.get('ids', None)
            if pk_ids is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            pk_ids: List[str] = pk_ids.split(',')
            objs = self.get_queryset().filter(id__in=pk_ids)
            print(objs)
            objs.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})