from rest_framework import serializers
from api.salarie.models import Salarie


class SalarieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salarie
        fields = "__all__"

class SalarieFormOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salarie
        fields = ["id", "nom", "prenom"]
        depth = 1