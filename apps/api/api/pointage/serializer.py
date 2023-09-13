from rest_framework import serializers
from api.pointage.models import PointageEtape
from api.etape.serializer import EtapeSerializer
from api.etape.models import Etape
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field


class PointageSerializer(serializers.Serializer):
    """
    Serializer pour les pointages,
    """

    etape = serializers.PrimaryKeyRelatedField(queryset=Etape.objects.all())
    terminer_etape = serializers.BooleanField(default=False)


class ReadPointageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les pointages en lecture
    """

    user = serializers.CharField(source="user.username", read_only=True)
    etape = EtapeSerializer(Etape, read_only=True)
    en_cours = serializers.SerializerMethodField(
        method_name="get_en_cours", read_only=True
    )
    duree = serializers.SerializerMethodField(method_name="get_duree", read_only=True)

    class Meta:
        model = PointageEtape
        fields = "__all__"

    @extend_schema_field(OpenApiTypes.BOOL)
    def get_en_cours(self, obj):
        return obj.en_cours()

    @extend_schema_field(OpenApiTypes.FLOAT)
    def get_duree(self, obj):
        return obj.duree()
