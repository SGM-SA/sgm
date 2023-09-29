from datetime import datetime

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from api.planning.planning_zone.utils import (
    group_sorted_affectations_ajustage,
    TotalAffaireAjustageSerializer,
)
from api.planning.utils import sort_affectations_by_previous
from api.zone.models import Zone
from api.utils.dates import week_to_date_range
from api.affectation.models import AffectationAjustage


class PlanningZoneSerializer(serializers.ModelSerializer):
    """
    Serializer pour la planification d'une zone.
    """

    affectations = serializers.SerializerMethodField()

    @extend_schema_field(
        serializers.ListSerializer(child=TotalAffaireAjustageSerializer())
    )
    def get_affectations(self, obj: Zone):
        """
        Récupère les affaires avec leurs fiches et étapes pour une zone donnée.
        :param obj: Objet Zone
        :return: Données sérialisées des affaires avec fiches et étapes
        """
        date = self.context["request"].query_params.get("date", None)
        try:
            datetime.strptime(date, "%Y-%m-%d")
            week_date_range = week_to_date_range(date)
        except ValueError:
            raise serializers.ValidationError(
                "Le format de la date est incorrect. Le format attendu est YYYY-MM-DD"
            )

        affectations_ajustage_date = AffectationAjustage.objects.filter(
            zone=obj, semaine_affectation__range=week_date_range
        )

        sorted_affectations = sort_affectations_by_previous(affectations_ajustage_date)
        grouped_affectations = group_sorted_affectations_ajustage(sorted_affectations)

        return grouped_affectations

    class Meta:
        model = Zone
        fields = ("id", "nom", "affectations")
