from rest_framework import generics
from api.serializers import UserSerializer


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
