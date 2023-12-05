from typing import Callable

from django.db.models import QuerySet
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
)
from drf_spectacular.utils import extend_schema, extend_schema_view
from .serializer import (
    BulkDeleteSerializer,
    ConstanceSerializer,
    ConstanceUpdateSerializer,
)


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


class ExportPdfView(APIView):
    """
    Export pdf d'un objet

    queryset: queryset des objets à exporter
    export_pdf: fonction qui exporte l'objet en pdf
    """

    queryset: QuerySet
    export_pdf: Callable
    extra_query_params: dict = {}

    def get(self, request, *args, **kwargs):
        """
        Exporte un objet en pdf
        """
        obj_id = request.query_params.get("id")

        # check if obj exists
        try:
            obj = self.queryset.get(id=obj_id)
        except self.queryset.model.DoesNotExist:
            return Response(
                {"detail": "L'objet n'existe pas"}, status=status.HTTP_400_BAD_REQUEST
            )

        return self.export_pdf(obj, **self.extra_query_params)


class ConfigConstanceView(APIView):
    """
    Vue API pour les paramètres de configuration Constance
    """

    @extend_schema(
        responses={200: ConstanceSerializer(many=True), 400: None},
        tags=["Configuration"],
    )
    def get(self, request, *args, **kwargs):
        """
        Traite la requête LIST : Liste toutes les configurations.
        """
        all_config = ConstanceSerializer.list_config()
        return Response(all_config)

    @extend_schema(
        request=ConstanceUpdateSerializer,
        responses={200: ConstanceSerializer, 400: None},
        tags=["Configuration"],
    )
    def patch(self, request, *args, **kwargs):
        """
        Traite la requête POST : Met à jour un paramètre de configuration spécifique.
        """
        serializer = ConstanceSerializer(data=request.data)
        if serializer.is_valid():
            try:
                config_mise_a_jour = serializer.update({}, serializer.validated_data)
                return Response(config_mise_a_jour)
            except AttributeError:
                return Response(
                    {"erreur": "Clé ou valeur invalide"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
