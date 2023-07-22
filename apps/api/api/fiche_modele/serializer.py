from rest_framework import serializers
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
