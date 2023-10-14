from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import generics, permissions
from api.user.models import CustomUser
from api.user.serializer import CustomUserDetailSerializer, CustomUserGroupsSerializer
from api.utils.view import LargeResultsSetPagination


@extend_schema(
    tags=["User"],
    description="Informations utilisateurs",
)
class ProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserGroupsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@extend_schema_view(
    get=extend_schema(
        summary="Salarie form options",
        description="Permet de récupérer les options pour les formulaires",
        tags=["Salarie"],
    )
)
class SalarieFormOptions(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserDetailSerializer
    pagination_class = None
