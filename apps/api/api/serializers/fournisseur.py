from rest_framework import serializers
from api.models import Fournisseur


class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = "__all__"
