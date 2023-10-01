from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.response import Response
from api.affectation.models import AffectationMachine, AffectationAjustage
from api.affectation.serializer import (
    AffectationMachineSerializer,
    AffectationAjustageSerializer,
)


@extend_schema(
    tags=["Affectation Machine"],
    description="Créer une affectation machine",
)
class AffectationMachineCreate(generics.CreateAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineSerializer

    def create(self, request, *args, **kwargs):
        # affectation uses a previous field wich indicates the previous affectation (order to be handled)
        # if the revious field is null, we need to search for the affectation wich has null as previous field
        # and set this affectation as the previous ofthe new affectation
        serializer: AffectationMachineSerializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        current: AffectationMachine = serializer.create(serializer.validated_data)

        # Récupération du champ 'previous' et 'date_affectation' depuis les données de la requête
        previous_field = serializer.validated_data.get("previous", None)
        date_affectation = serializer.validated_data.get("semaine_affectation")
        machine = serializer.validated_data.get("machine")

        # si le champ 'previous' est null, on veut insérer en tête de liste
        if previous_field is None:
            head = (
                AffectationMachine.objects.filter(
                    previous__isnull=True,
                    semaine_affectation=date_affectation,
                    machine=machine,
                )
                .exclude(id=current.id)
                .first()
            )
            # si la liste n'est pas vide, on insère en tête de liste
            if head is not None:
                head.previous = current
                head.save()

        else:
            # on récupère l'objet affectation précédent
            previous = AffectationMachine.objects.get(id=previous_field.id)

            # on récupère l'objet affectation suivant
            next = (
                AffectationMachine.objects.filter(previous=previous)
                .exclude(id=current.id)
                .first()
            )
            if next is not None:
                # on met à jour l'objet affectation précédent
                next.previous = current
                next.save()

        serializer = AffectationMachineSerializer(current)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=["Affectation Machine"],
    description="Récupérer, mettre à jour et supprimer une affectation machine",
)
class AffectationMachineCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineSerializer


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Créer et lister une affectation ajustage",
)
class AffectationAjustageCreate(generics.CreateAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageSerializer

    def create(self, request, *args, **kwargs):
        # affectation uses a previous field wich indicates the previous affectation (order to be handled)
        # if the revious field is null, we need to search for the affectation wich has null as previous field
        # and set this affectation as the previous ofthe new affectation
        serializer: AffectationAjustageSerializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        current: AffectationAjustage = serializer.create(serializer.validated_data)

        # Récupération du champ 'previous' et 'date_affectation' depuis les données de la requête
        previous_field = serializer.validated_data.get("previous", None)
        date_affectation = serializer.validated_data.get("semaine_affectation")
        zone = serializer.validated_data.get("zone")

        # si le champ 'previous' est null, on veut insérer en tête de liste
        if previous_field is None:
            head = (
                AffectationAjustage.objects.filter(
                    previous__isnull=True,
                    semaine_affectation=date_affectation,
                    zone=zone,
                )
                .exclude(id=current.id)
                .first()
            )
            # si la liste n'est pas vide, on insère en tête de liste
            if head is not None:
                head.previous = current
                head.save()

        else:
            # on récupère l'objet affectation précédent
            previous = AffectationAjustage.objects.get(id=previous_field.id)

            # on récupère l'objet affectation suivant
            next = (
                AffectationAjustage.objects.filter(previous=previous)
                .exclude(id=current.id)
                .first()
            )
            if next is not None:
                # on met à jour l'objet affectation précédent
                next.previous = current
                next.save()

        serializer = AffectationAjustageSerializer(current)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Récupérer, mettre à jour et supprimer une affectation ajustage",
)
class AffectationAjustageCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageSerializer
