from datetime import timedelta
from rest_framework import serializers
from api.fiche.models import Fiche
from api.affaire.models import Affaire
from api.salarie.serializer import SalarieSerializer
from api.fiche.serializer import (
    FicheEtEtapesMachineSerializer,
    FicheDetailSerializer,
    FicheEtEtapesSerializer,
    FicheEtEtapesAjustageSerializer,
)
from django.utils import timezone
from typing import Dict

class AffaireDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'affichage des affaires
    """

    avancement_affaire = serializers.FloatField(
        read_only=True, default=0, max_value=1, min_value=0
    )

    charge_affaire_detail = SalarieSerializer(
        source="charge_affaire",
        read_only=True,
    )

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "description",
            "observation",
            "client",
            "montant",
            "statut",
            "date_rendu",
            "date_modification",
            "date_cloture",
            "charge_affaire_detail",
            "avancement_affaire",
        ]


class AffaireFichesSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches
    """

    fiches = FicheDetailSerializer(Fiche, many=True, read_only=True)

    charge_affaire_detail = SalarieSerializer(
        source="charge_affaire",
        read_only=True,
    )

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "fiches",
            "charge_affaire_detail",
        ]


class AffaireFichesEtapesSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches et ses étapes
    """

    fiches = FicheEtEtapesSerializer(Fiche, many=True, read_only=True)
    charge_affaire_detail = SalarieSerializer(
        source="charge_affaire",
        read_only=True,
    )

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "description",
            "fiches",
            "charge_affaire_detail",
        ]


class AffaireFichesEtapesMachineSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches et ses étapes machine
    """

    fiches = FicheEtEtapesMachineSerializer(Fiche, many=True, read_only=True)
    charge_affaire = serializers.SlugRelatedField(read_only=True, slug_field="nom")

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "description",
            "fiches",
            "charge_affaire",
        ]  # ["id","raison", "charge_affaire_detail", "client_detail"]


class AffaireFichesEtapesAjustageSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches et ses étapes ajustage
    """

    fiches = FicheEtEtapesAjustageSerializer(Fiche, many=True, read_only=True)
    charge_affaire = serializers.SlugRelatedField(read_only=True, slug_field="nom")

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "description",
            "fiches",
            "charge_affaire",
        ]  # ["id","raison", "charge_affaire_detail", "client_detail"]


class AffaireNumAffaireSerializer(serializers.ModelSerializer):
    """
    Serializer permettant de récuper uniquement l'id et le numéro d'affaire
    """

    class Meta:
        model = Affaire
        fields = ["id", "num_affaire"]


class AffaireStatsGlobalSerializer(serializers.Serializer):
    """
    Serializer pour les statistiques des affaires.
      on y retrouve
        - le nombre d'affaires par statut
        - nombre d'affaires terminées cette semaine
        - nombre d'affaires en retard

    """

    par_statut = serializers.SerializerMethodField()
    terminees_cette_semaine = serializers.SerializerMethodField()
    terminees_semaine_der = serializers.SerializerMethodField()
    en_retard = serializers.SerializerMethodField()

    def get_par_statut(self, obj) -> Dict[str, int]:
        stats = {}
        for statut, _ in Affaire.STATUTS_AFFAIRE:
            stats[statut] = Affaire.objects.filter(statut=statut).count()
        return stats

    def get_terminees_cette_semaine(self, obj) -> int:
        debut_semaine = timezone.now() - timedelta(days=timezone.now().weekday())
        fin_semaine = debut_semaine + timedelta(days=6)
        return Affaire.objects.filter(
            date_cloture__range=(debut_semaine, fin_semaine)
        ).count()

    def get_terminees_semaine_der(self, obj) -> int:
        debut_semaine_der = timezone.now() - timedelta(
            days=timezone.now().weekday() + 7
        )
        fin_semaine_der = debut_semaine_der + timedelta(days=6)
        return Affaire.objects.filter(
            date_cloture__range=(debut_semaine_der, fin_semaine_der)
        ).count()

    def get_en_retard(self, obj) -> int:
        return Affaire.objects.filter(
            date_rendu__lt=timezone.now(), date_cloture=None
        ).count()


class AffaireStatsSerializer(serializers.Serializer):
    """
    Serializer pour les statistiques d'une affaire précise
      on y retrouve
        - temps ajustage total (théorique)
        - temps machine total (théorique)
        - temps restant total
    """

    temps_ajustage = serializers.SerializerMethodField()
    temps_machine = serializers.SerializerMethodField()
    temps_restant = serializers.SerializerMethodField()

    def get_temps_ajustage(self, affaire: Affaire):
        # pour chaque fiches prendre etapes.temps
        return affaire.temps_ajustage()

    def get_temps_machine(self, affaire: Affaire):
        return affaire.temps_machine()

    def get_temps_restant(self, affaire: Affaire):
        return affaire.temps_restant()
