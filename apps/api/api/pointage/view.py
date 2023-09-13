from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from datetime import datetime
from rest_framework import generics, permissions, filters, views, status
from rest_framework.response import Response
from django.utils import timezone

from api.etape.models import Etape
from api.pointage.models import PointageEtape

from api.pointage.serializer import ReadPointageSerializer, PointageSerializer


class PointageFilterBackend(filters.BaseFilterBackend):
    """
    Filtre les pointages selon le paramètre est_termine
    """

    def filter_queryset(self, request, queryset, view):
        en_cours_filter = request.query_params.get("en_cours", None)

        if en_cours_filter is not None:
            if en_cours_filter.lower() == "true":
                queryset = queryset.filter(date_fin__isnull=True)
            elif en_cours_filter.lower() == "false":
                queryset = queryset.filter(date_fin__isnull=False)
            else:
                queryset = queryset.order_by("date_fin")

        return queryset


@extend_schema_view(
    get=extend_schema(
        summary="Pointage",
        description="Liste des pointages",
        tags=["Pointage"],
        parameters=[
            OpenApiParameter(
                name="en_cours",
                description="Filtre les pointages selon qu'ils soient en cours ou non",
                required=False,
                enum=["true", "false"],
            ),
        ],
    )
)
class PointageList(generics.ListAPIView):
    """
    Liste des pointages
    """

    queryset = PointageEtape.objects.all()
    serializer_class = ReadPointageSerializer
    permission_classes = [permissions.IsAdminUser]  # only admin can see all pointages
    filter_backends = [PointageFilterBackend]


class PointageAdminUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    """
    Endpoint pour mettre à jour, supprimer un pointage
    """

    queryset = PointageEtape.objects.all()
    serializer_class = PointageSerializer
    permission_classes = [permissions.IsAdminUser]


@extend_schema(
    summary="Gestion Pointage",
    tags=["Pointage"],
)
class PointageGestion(views.APIView):
    """
    Endpoint pour démarrer / stopper un pointage
    Aucun pointage de l'utilisateur ne doit être en cours pour pouvoir démarrer un nouveau pointage (renvoie une erreur sinon)
    """

    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=PointageSerializer,
        responses={200: PointageSerializer, 400: None, 404: None},
    )
    def post(self, request, *args, **kwargs):
        """
        Si aucun pointage n'est en cours, crée un nouveau pointage

        Si un pointage est en cours et que l'étape est différente que celle du pointage en cours,
        stoppe le pointage en cour et en crée un nouveau

        Si un pointage est en cours et que l'étape est la même que celle du pointage en cours,
        stoppe le pointage en cours
        """
        user = request.user
        etape_id = request.data.get("etape", None)
        terminer_etape = request.data.get("terminer_etape", False)

        if not etape_id:
            return Response(
                {"detail": "Étape ID est nécessaire"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            etape = Etape.objects.get(id=etape_id)
        except Etape.DoesNotExist:
            return Response(
                {"detail": "Étape n'existe pas"}, status=status.HTTP_404_NOT_FOUND
            )

        current_pointage = PointageEtape.objects.filter(
            user=user, date_fin__isnull=True
        ).first()

        # il y a un pointage en cours
        if current_pointage:
            if current_pointage.etape == etape:
                # Stop le pointage en cours si l'étape est la même
                current_pointage.date_fin = timezone.now()
                current_pointage.save()

                if terminer_etape:
                    self.terminer(current_pointage.etape)

                return Response(
                    {"detail": "Pointage arrêté"}, status=status.HTTP_200_OK
                )
            else:
                # Stop le pointage en cours et crée un nouveau pointage si l'étape est différente
                current_pointage.date_fin = timezone.now()
                current_pointage.save()
                new_pointage = PointageEtape(
                    user=user, etape=etape, date_debut=timezone.now()
                )
                new_pointage.save()

                if terminer_etape:
                    self.terminer(current_pointage.etape)

                return Response(
                    {"detail": "Ancien Pointage stoppé, nouveau créé"},
                    status=status.HTTP_200_OK,
                )
        else:
            new_pointage = PointageEtape(
                user=user, etape=etape, date_debut=timezone.now()
            )
            new_pointage.save()
            return Response({"detail": "Pointage créé"}, status=status.HTTP_200_OK)

    def terminer(self, etape: Etape):
        etape.date_cloture = timezone.now()
        etape.terminee = True
        etape.save()
