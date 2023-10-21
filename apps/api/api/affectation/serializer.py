from typing import Union, Type

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api.affectation.models import AffectationMachine, AffectationAjustage, Affectation
from api.utils.dates import week_to_date_range
from datetime import datetime


class AffectationAbstractSerializer(serializers.ModelSerializer):
    """
    Serializer abstract pour l'affectation d'une machine ou d'un ajustage à une étape, comprenant toute la logique
    """

    class Meta:
        model = Affectation
        fields = "__all__"

    def validate(self, data):
        instance = self.Meta.model(**data)
        try:
            instance.validate_unique()
        except ValidationError as e:
            raise serializers.ValidationError(e.detail)
        return data

    def create(
        self,
        validated_data,
        model_class: Type[Union[AffectationMachine, AffectationAjustage]],
        filter_field: Union["machine", "zone"],
    ):
        """
        Création d'une affectation. La logique est découpée en semaine.


        Attention previous représente l'affectation au-dessus de la nouvelle affectation
        3 cas sont possibles :
        - L'affectation est en tête de liste
        - L'affectation est en queue de liste
        - L'affectation est entre deux affectations

        :param validated_data: Données validées
        :param model_class: Classe du modèle à utiliser AffectionMachine ou AffectationAjustage
        :param filter_field: Champ de filtrage pour la requête

        """
        # vérifier que la classe est bien une classe d'affectation
        if not issubclass(model_class, Affectation):
            raise ValueError("model_class must be a subclass of Affectation")

        previous_field = validated_data.get("previous", None)
        date_affectation = validated_data.get("semaine_affectation")
        specific_field = (
            validated_data.get("machine")
            if model_class == AffectationMachine
            else validated_data.get("zone")
        )

        # si le champ 'previous' est null, on veut insérer en tête de liste
        if previous_field is None:
            head = model_class.objects.filter(
                previous__isnull=True,
                semaine_affectation__range=week_to_date_range(
                    date_affectation.strftime("%Y-%m-%d")
                ),
                **{filter_field: specific_field},  # on filtre par machine ou zone
            ).first()

            current = model_class.objects.create(**validated_data)

            # si la liste n'est pas vide, on insère en tête de liste et on met à jour l'objet head
            if head is not None:
                head.previous = current
                head.save()

            return current

        else:
            print("ici")
            # on récupère l'objet affectation précédent
            previous = previous_field

            print(previous.id)

            # on vérifie qu'elle est bien dans la même range de date (week_to_date_range)
            if week_to_date_range(
                previous.semaine_affectation.strftime("%Y-%m-%d")
            ) != week_to_date_range(date_affectation.strftime("%Y-%m-%d")):
                raise serializers.ValidationError(
                    "L'affectation précédente n'est pas dans la même semaine"
                )

            # on récupère l'objet affectation suivant
            next = previous.next.first()

            # on crée l'objet courant, après avoir récupéré next (sinon on a un faux next)
            current = model_class.objects.create(**validated_data)

            # si l'objet suivant n'est pas null, on insère entre les deux
            if next is not None:
                next.previous = current
                next.save()

            return current

    def update(self, instance, validated_data):
        """
        Mise à jour d'une affectation. La logique est découpée en semaine.

        Dans le cas d'une affectation, on ne met à jour que le fiedl previous ou la machine / zone

        3 cas sont possibles :
        - L'affectation est mise en tête de liste
        - L'affectation est mise en queue de liste
        - L'affectation est mise entre deux affectations

        :param instance: Instance de l'affectation à mettre à jour
        :param validated_data: Données validées
        """

        new_previous = validated_data.get("previous", None)

        # on récupère l'objet affectation précédent
        previous = instance.previous

        # on récupère l'objet affectation suivant
        next = instance.next.first()

        # si le champ new_previous est null, on veut insérer en tête de liste
        if new_previous is None:
            # si l'objet précédent est null, on est déjà en tête de liste
            if previous is None:
                return instance

            # on met à jour le suivant pour qu'il pointe vers l'objet précédent
            next.previous = previous
            next.save()

            # on met à jour l'objet courant
            instance.previous = None
            instance.save()

            # on met à jour l'objet précédent
            previous.previous = instance
            previous.save()

            return instance


class AffectationMachineSerializer(AffectationAbstractSerializer):
    """
    Serializer pour l'affectation d'une machine à une étape
    """

    class Meta:
        model = AffectationMachine
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data, AffectationMachine, "machine")


class AffectationAjustageSerializer(AffectationAbstractSerializer):
    """
    Serializer pour l'affectation d'un ajustage à une étape
    """

    class Meta:
        model = AffectationAjustage
        fields = ["id", "etape", "zone", "semaine_affectation", "previous"]

    def create(self, validated_data):
        return super().create(validated_data, AffectationAjustage, "zone")
