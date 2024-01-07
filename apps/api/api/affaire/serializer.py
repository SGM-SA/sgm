from datetime import timedelta

from rest_framework import serializers
from api.fiche.models import Fiche
from api.affaire.models import Affaire, en_retard_filter
from api.fiche.serializer import (
    FicheEtEtapesMachineSerializer,
    FicheDetailSerializer,
    FicheEtEtapesSerializer,
    FicheEtEtapesAjustageSerializer,
)
from django.utils import timezone
from typing import Dict

from api.note.models import Note


class AffaireDefaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Affaire
        fields = ["id", "num_affaire"]


class AffaireDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'affichage des affaires
    """

    avancement_affaire = serializers.FloatField(
        read_only=True, default=0, max_value=1, min_value=0
    )

    en_retard = serializers.BooleanField(read_only=True)

    couleur_affichage = serializers.CharField(read_only=True)

    temps_ajustage = serializers.SerializerMethodField()
    temps_machine = serializers.SerializerMethodField()
    temps_restant = serializers.SerializerMethodField()
    nombre_fiches = serializers.SerializerMethodField()

    nb_notifications = serializers.SerializerMethodField()

    def get_temps_ajustage(self, affaire: Affaire) -> int:
        return affaire.temps_ajustage()

    def get_temps_machine(self, affaire: Affaire) -> int:
        return affaire.temps_machine()

    def get_temps_restant(self, affaire: Affaire) -> int:
        return affaire.temps_restant()

    def get_nombre_fiches(self, affaire: Affaire) -> int:
        return affaire.fiches.count()

    def get_nb_notifications(self, affaire) -> int:

        user = self.context["request"].user
        if user:
            return Note.objects.filter(affaire=affaire).exclude(vue_par=user).count()
        else:
            return 0

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "en_retard",
            "couleur_affichage",
            "description",
            "observation",
            "client",
            "montant",
            "statut",
            "date_rendu",
            "date_modification",
            "date_cloture",
            "charge_affaire",
            "avancement_affaire",
            "cout_affaire",
            "temps_ajustage",
            "temps_machine",
            "temps_restant",
            "nombre_fiches",
            "nb_notifications",
        ]


class AffaireFichesSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches
    """

    fiches = FicheDetailSerializer(Fiche, many=True, read_only=True)
    nb_notifications = serializers.SerializerMethodField()

    def get_nb_notifications(self, affaire) -> int:

        user = self.context["request"].user
        if user:
            return Note.objects.filter(affaire=affaire).exclude(vue_par=user).count()
        else:
            return 0

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "fiches",
            "charge_affaire",
            "nb_notifications",
        ]


class AffaireFichesEtapesSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches et ses étapes
    """

    fiches = FicheEtEtapesSerializer(Fiche, many=True, read_only=True)

    class Meta:
        model = Affaire
        fields = [
            "id",
            "num_affaire",
            "validation_ingenieur",
            "description",
            "fiches",
            "charge_affaire",
        ]


class AffaireFichesEtapesMachineSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer une affaire avec ses fiches et ses étapes machine
    """

    fiches = FicheEtEtapesMachineSerializer(Fiche, many=True, read_only=True)

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
        affaire_count = len(
            [
                affaire
                for affaire in Affaire.objects.filter(en_retard_filter)
                if affaire.en_retard()
            ]
        )
        return affaire_count


class AffaireStatsSerializer(serializers.Serializer):
    """
    Serializer pour les statistiques d'une affaire précise
      on y retrouve
        - temps ajustage total (théorique)
        - temps machine total (théorique)
        - temps restant total
    """
