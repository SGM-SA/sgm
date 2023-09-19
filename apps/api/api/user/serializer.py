from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from api.user.models import CustomUser


class CustomUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "name",
            "surname",
        ]


class CustomUserGroupsSerializer(serializers.ModelSerializer):
    """
    test
    """

    groups = serializers.SerializerMethodField()

    @extend_schema_field(serializers.ListSerializer(child=serializers.CharField()))
    def get_groups(self, obj):
        return obj.groups.values_list("name", flat=True)

    class Meta:
        model = CustomUser

        fields = [
            "email",
            "name",
            "surname",
            "groups",
        ]
