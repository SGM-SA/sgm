from django.db import models
from datetime import datetime, timedelta
from django.core.validators import MinValueValidator
from api.user.models import CustomUser
from constance import config


class Affaire(models.Model):
    """
    Model représentant une affaire.

    Les affaires sont directement synchronisées depuis la base de données SGM.
    """

    # Statut de l'affaire
    STATUTS_AFFAIRE = (
        ("S00", "Sous offre"),
        ("A00", "ABANDON"),
        ("EHA", "ACHATS"),
        ("EAA", "ATTENTE ACCORD COMMANDE"),
        ("EAC", "ATTENTE CLIENT"),
        ("P00", "AFFAIRE PERDUE"),
        ("T00", "Affaire Terminée"),
        ("E00", "Affaire en cours"),
        ("ECC", "CHIFFRAGE POUR REPARATION"),
        ("INT", "COMMANDE INTERNE"),
        ("ECA", "ENCOURS CHIFFRAGE ACHAT"),
        ("ED", "EXPERTISE ATELIER"),
        ("D00", "Etat de Devis"),
        ("G00", "NON REFACTURE"),
        ("SV0", "SOLDES VERIFIES"),
        ("EST", "ST / ACHATS"),
        ("ECH", "chantier"),
    )

    # tous les status Exx sont des affaires en cours
    STATUS_EN_COURS = [
        "EHA",
        "E00",
        "EAA",
        "EAC",
        "ECC",
        "ECA",
        "ED",
        "EST",
        "ECH",
    ]

    num_affaire = models.IntegerField(
        "Numéro d'affaire correspondant à l'affaire dans la base de données de SGM",
        unique=True,
        null=True,
        blank=False,
        validators=[MinValueValidator(0)],
    )

    validation_ingenieur = models.BooleanField(
        "Validation de l'ingénieur", default=False
    )

    description = models.CharField(
        "Description de l'affaire", max_length=10000, null=True, blank=True
    )

    observation = models.CharField(
        "Observation faite sur l'affaire",
        max_length=1000,
        null=True,
        blank=True,
    )

    ref_doc = models.CharField(
        "référence vers un document stocké sur serveur local",
        max_length=200,
        null=True,
        blank=True,
    )

    client = models.CharField("nom du client", max_length=200, null=True, blank=True)

    montant = models.DecimalField(
        "montant de l'affaire",
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    statut = models.CharField(
        "statut de l'affaire",
        max_length=200,
        null=False,
        blank=False,
        default="INCONNU",
        choices=STATUTS_AFFAIRE,
    )

    date_creation = models.DateField(
        "date de création de l'affaire (ajout à notre bd)", auto_now_add=True
    )

    date_rendu = models.DateField(
        "date à laquelle l'affaire doit être terminée", null=True, blank=True
    )

    date_modification = models.DateTimeField("date de modification", auto_now=True)

    date_cloture = models.DateField(
        "date de clôture de l'affaire (terminée)", null=True, blank=True
    )

    charge_affaire = models.CharField(
        "nom du chargé d'affaire", max_length=2000, null=True, blank=True
    )

    hash_sgm_bd = models.CharField(
        "hash de l'affaire dans la base de données SGM",
        max_length=200,
        null=True,
        blank=True,
    )

    def couleur_affichage(self):
        """
        Permet de définir la couleur d'affichage de l'affaire dans le tableau des affaires.
        """

        # si retard rouge
        if self.en_retard():
            return config.COULEUR_AFFAIRE_RETARD

        else:
            return ""

    def cout_affaire(self) -> float:
        """
        Cout total d'une affaire
        :return: float
        """
        return sum([fiche.cout_fiche() for fiche in self.fiches.all()])

    def en_retard(self):
        """
        Permet de savoir si le temps restant est inférieur au temps disponible.
        On travaille 21h par jour, 5j/semaine.
        :return: bool - True si en retard, False sinon.
        """

        if self.avancement_affaire() == 100 or self.statut not in self.STATUS_EN_COURS:
            return False

        if self.date_rendu is None or self.date_rendu < datetime.date(datetime.now()):
            return True

        nombre_heures_jusqua_delai = (
            self.jours_ouvrables_restants() * 21
        )  # 21 heures par jour

        return self.temps_restant() > nombre_heures_jusqua_delai

    def jours_ouvrables_restants(self):
        """
        Calcule le nombre de jours ouvrables restants jusqu'à la date de rendu.
        :return: int - Nombre de jours ouvrables.
        """
        if not self.date_rendu:
            return 0

        aujourd_hui = datetime.date(datetime.now())

        if self.date_rendu < aujourd_hui:
            return 0

        jours = (self.date_rendu - aujourd_hui).days
        jours_ouvrables = 0
        for i in range(jours):
            jour = (aujourd_hui + timedelta(days=i)).weekday()
            # weekday() renvoie 0 pour lundi et 6 pour dimanche
            if jour < 5:  # Lundi à Vendredi
                jours_ouvrables += 1
        return jours_ouvrables

    def avancement_affaire(self):
        """
        % des fiches terminées = avancement de l'affaire
        :return: float
        """
        total = self.fiches.count()
        avancement_fiches = [f.avancement_fiche() for f in self.fiches.all()]
        total_avancement_fiches = sum(avancement_fiches)

        if total > 0:
            return round((total_avancement_fiches / total), 0)
        else:
            return 0

    def temps_ajustage(self):
        """
        Temps total d'ajustage de la fiche
        :return: int
        """
        return sum([fiche.temps_ajustage() for fiche in self.fiches.all()])

    def temps_machine(self):
        """
        Temps total machine de la fiche
        :return: int
        """
        return sum([fiche.temps_machine() for fiche in self.fiches.all()])

    def temps_restant(self):
        """
        Temps restant de la fiche
        :return: int
        """
        return sum([fiche.temps_restant() for fiche in self.fiches.all()])

    def __str__(self):
        return f"{self.num_affaire} - {self.statut} - {self.date_creation} - {self.date_rendu} - {self.date_cloture}"
