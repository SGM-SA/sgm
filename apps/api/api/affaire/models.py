from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from api.user.models import CustomUser


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

    charge_affaire = models.ForeignKey(
        CustomUser, on_delete=models.PROTECT, null=True, blank=True
    )

    hash_sgm_bd = models.CharField(
        "hash de l'affaire dans la base de données SGM",
        max_length=200,
        null=True,
        blank=True,
    )

    def en_retard(self):
        """
        Permet de savoir si la date de rendu a été dépassée
        :return:
        """
        return self.date_rendu < timezone.now() and self.date_cloture is None

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
