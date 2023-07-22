from rest_framework import serializers
from api.models import Facture


class FactureSerializer(serializers.ModelSerializer):

    cout_affaire = serializers.FloatField(read_only=True, default=0)

    class Meta:
        model = Facture
        fields = "__all__"
