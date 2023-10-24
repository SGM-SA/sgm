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
from constance import config


class PlanningZoneSerializer(serializers.ModelSerializer):
    """
    Serializer pour la planification d'une zone.
    """

    affectations = serializers.SerializerMethodField()

    heures_travail_dispo = serializers.SerializerMethodField()

    heures_travail_affectees = serializers.SerializerMethodField()

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

    def get_heures_travail_dispo(self, obj: Zone) -> int:
        """
        Calcule le nombre d'heures de travail disponibles pour la semaine donnée.
        """
        return (
            (config.TEMPS_ZONE_MATIN + config.TEMPS_ZONE_APREM)
            * config.JOUR_OUVRE_ZONE
            * config.NB_PERS_ZONES  # TODO : remplacer par le nombre de personnes affectées à la zone
        )

    def get_heures_travail_affectees(self, obj: Zone) -> int:
        """
        Caclule le nombre d'heures de travail affectées à la machine pour la semaine donnée.
        """
        date = self.context["request"].query_params.get("date", None)
        try:
            datetime.strptime(date, "%Y-%m-%d")
            week_date_range = week_to_date_range(date)
        except ValueError:
            raise serializers.ValidationError(
                "Le format de la date est incorrect. Le format attendu est YYYY-MM-DD"
            )

        affectations_machine_date = AffectationAjustage.objects.filter(
            zone=obj, semaine_affectation__range=week_date_range
        )

        heures_travail_affectees = 0
        for affectation in affectations_machine_date:
            heures_travail_affectees += (
                affectation.etape.temps * affectation.etape.quantite
            )

        return heures_travail_affectees

    class Meta:
        model = Zone
        fields = (
            "id",
            "nom",
            "heures_travail_dispo",
            "heures_travail_affectees",
            "affectations",
        )
