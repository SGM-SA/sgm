from datetime import datetime

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from api.affaire.models import Affaire
from api.affectation.models import AffectationMachine
from api.fiche.serializer import FicheEtEtapesMachineSerializer
from api.machine.models import Machine
from api.planning.planning_machine.utils import (
    group_sorted_affectations_machine,
    TotalAffaireSerializer,
)
from api.planning.utils import sort_affectations_by_previous
from api.utils.dates import week_to_date_range
from constance import config


class AffaireSerializer(serializers.ModelSerializer):
    fiches = FicheEtEtapesMachineSerializer(many=True, read_only=True)

    class Meta:
        model = Affaire
        fields = ["id", "fiches", "num_affaire"]


class PlanningMachineSerializer(serializers.ModelSerializer):
    """
    Serializer pour la planification d'une machine.
    """

    affectations = serializers.SerializerMethodField()

    heures_travail_dispo = serializers.SerializerMethodField()

    heures_travail_affectees = serializers.SerializerMethodField()

    @extend_schema_field(serializers.ListSerializer(child=TotalAffaireSerializer()))
    def get_affectations(self, obj: Machine):
        """
        Récupère les affaires avec leurs fiches et étapes pour une machine donnée.
        :param obj: Objet Machine
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

        affectations_machine_date = AffectationMachine.objects.filter(
            machine=obj, semaine_affectation__range=week_date_range
        )

        sorted_affectations = sort_affectations_by_previous(affectations_machine_date)
        grouped_affectations = group_sorted_affectations_machine(sorted_affectations)

        return grouped_affectations

    def get_heures_travail_dispo(self, obj: Machine) -> int:
        return config.TEMPS_MACHINE_JOUR * config.JOUR_OUVRE_MACHINE

    def get_heures_travail_affectees(self, obj: Machine) -> int:
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

        affectations_machine_date = AffectationMachine.objects.filter(
            machine=obj, semaine_affectation__range=week_date_range
        )

        heures_travail_affectees = 0
        for affectation in affectations_machine_date:
            heures_travail_affectees += (
                affectation.etape.temps * affectation.etape.quantite
            )

        return heures_travail_affectees

    class Meta:
        model = Machine
        fields = (
            "id",
            "nom_machine",
            "fonctionnelle",
            "heures_travail_dispo",
            "heures_travail_affectees",
            "affectations",
        )
