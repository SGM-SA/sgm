from rest_framework import serializers

from api.affaire.models import Affaire
from api.fiche_modele.models import FicheModele
from api.etape_modele.serializer import EtapeModeleDetail
from api.etape_modele.models import EtapeModele


class FicheModeleDetail(serializers.ModelSerializer):
    class Meta:
        model = FicheModele
        fields = "__all__"


class FicheModeleEtEtapes(FicheModeleDetail):
    etapes_modele = EtapeModeleDetail(EtapeModele, many=True, read_only=True)

    class Meta:
        model = FicheModele
        fields = "__all__"


class FicheModeleOptionsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="titre")
    value = serializers.CharField(source="id")

    class Meta:
        model = FicheModele
        fields = ["value", "name"]


class CopyFicheSerializer(serializers.Serializer):
    """
    Serializer pour copier une fiche, besoin d'un field affaire et modele
    """

    affaire = serializers.IntegerField()
    modele = serializers.IntegerField()

    def validate_affaire(self, value):
        if not Affaire.objects.filter(id=value).exists():
            raise serializers.ValidationError("Affaire non trouvée.")
        return value

    def validate_modele(self, value):
        if not FicheModele.objects.filter(id=value).exists():
            raise serializers.ValidationError("Modele non trouvé.")
        return value
