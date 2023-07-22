from django.db.models import Count, Prefetch
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from api.affaire.models import Affaire
from api.affaire.serializer import AffaireFichesEtapesAjustageSerializer
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.zone.models import Zone
from api.utils.dates import week_to_date_range


class PlanningZoneSerializer(serializers.ModelSerializer):
    """
    Serializer pour la planification d'une zone.
    """

    affaires = serializers.SerializerMethodField()

    @extend_schema_field(
        serializers.ListSerializer(child=AffaireFichesEtapesAjustageSerializer())
    )
    def get_affaires(self, obj):
        """
        Récupère les affaires avec leurs fiches et étapes pour une zone donnée.
        :param obj: Objet Zone
        :return: Données sérialisées des affaires avec fiches et étapes
        """
        semaine = self.context["request"].query_params.get("semaine", None)
        annee = self.context["request"].query_params.get("annee", None)

        if semaine is not None:
            fiche_avec_etapes = (
                Etape.objects.all()
                .filter(
                    affectationajustage__zone=obj,
                    affectationajustage__semaine_affectation__range=week_to_date_range(
                        int(annee), int(semaine)
                    ),
                )
                .values("fiche")
                .alias(total=Count("id"))
                .filter(total__gt=0)
            )
            affaire_avec_fiches = (
                Fiche.objects.all()
                .filter(id__in=fiche_avec_etapes)
                .values("affaire")
                .alias(total=Count("id"))
                .filter(total__gt=0)
            )

            queryset = Affaire.objects.filter(
                id__in=affaire_avec_fiches
            ).prefetch_related(
                Prefetch(
                    "fiches",
                    queryset=Fiche.objects.prefetch_related(
                        Prefetch(
                            "etapes",
                            queryset=Etape.objects.filter(
                                affectationajustage__zone=obj,
                                affectationajustage__semaine_affectation__range=week_to_date_range(
                                    int(annee), int(semaine)
                                ),
                            ),
                        )
                    ).filter(id__in=fiche_avec_etapes),
                ),
            )

        else:
            queryset = Affaire.objects.all().prefetch_related(
                Prefetch(
                    "fiches",
                    queryset=Fiche.objects.prefetch_related(
                        Prefetch(
                            "etapes",
                            queryset=Etape.objects.filter(
                                affectationajustage__zone=obj,
                            ),
                        )
                    ),
                ),
            )

        return AffaireFichesEtapesAjustageSerializer(queryset, many=True).data

    class Meta:
        model = Zone
        fields = ("id", "nom", "description", "affaires")
