from rest_framework import serializers
from api.affectation.serializer import AffectationAjustageCreateSerializer
from api.etape.serializer import (
    EtapeDetailAjustage,
    EtapeDetailMachine,
    EtapeDetail,
)
from api.etape.models import Etape
from api.fiche.models import Fiche


class FicheCRUDSerializer(serializers.ModelSerializer):
    avancement_fiche = serializers.FloatField(
        read_only=True, default=0, max_value=1, min_value=0
    )

    class Meta:
        model = Fiche
        fields = "__all__"


class FicheDetailSerializer(FicheCRUDSerializer):
    affectation_zone = AffectationAjustageCreateSerializer(
        source="affectationajustage", read_only=True
    )
    affaire_description = serializers.SlugRelatedField(
        read_only=True, slug_field="description", source="affaire"
    )
    num_affaire = serializers.SlugRelatedField(
        read_only=True, slug_field="num_affaire", source="affaire"
    )
    affaire_id = serializers.SlugRelatedField(
        read_only=True, slug_field="id", source="affaire"
    )

    cout_fiche = serializers.FloatField(read_only=True)

    class Meta:
        model = Fiche
        fields = "__all__"


class FicheEtEtapesSerializer(FicheDetailSerializer):
    etapes = EtapeDetail(Etape, many=True, read_only=True)


class FicheEtEtapesAjustageSerializer(FicheDetailSerializer):
    etapes = EtapeDetailAjustage(Etape, many=True, read_only=True)


class FicheEtEtapesMachineSerializer(FicheDetailSerializer):
    etapes = EtapeDetailMachine(Etape, many=True, read_only=True)


class FicheBulkDeleteRequestSerializer(serializers.Serializer):
    """
    Serializer pour la requête de suppression de plusieurs fiches
    """

    ids = serializers.ListField(child=serializers.IntegerField())
