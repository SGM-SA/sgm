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
