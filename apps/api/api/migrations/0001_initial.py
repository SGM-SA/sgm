# Generated by Django 4.1.6 on 2023-09-17 10:56

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomUser",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="email address"
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        blank=True, max_length=200, null=True, verbose_name="name"
                    ),
                ),
                (
                    "surname",
                    models.CharField(
                        blank=True, max_length=200, null=True, verbose_name="surname"
                    ),
                ),
                ("is_staff", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "date_joined",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Affaire",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "num_affaire",
                    models.IntegerField(
                        null=True,
                        unique=True,
                        validators=[django.core.validators.MinValueValidator(0)],
                        verbose_name="Numéro d'affaire correspondant à l'affaire dans la base de données de SGM",
                    ),
                ),
                (
                    "validation_ingenieur",
                    models.BooleanField(
                        default=False, verbose_name="Validation de l'ingénieur"
                    ),
                ),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        max_length=10000,
                        null=True,
                        verbose_name="Description de l'affaire",
                    ),
                ),
                (
                    "observation",
                    models.CharField(
                        blank=True,
                        max_length=1000,
                        null=True,
                        verbose_name="Observation faite sur l'affaire",
                    ),
                ),
                (
                    "ref_doc",
                    models.CharField(
                        blank=True,
                        max_length=200,
                        null=True,
                        verbose_name="référence vers un document stocké sur serveur local",
                    ),
                ),
                (
                    "client",
                    models.CharField(
                        blank=True,
                        max_length=200,
                        null=True,
                        verbose_name="nom du client",
                    ),
                ),
                (
                    "montant",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="montant de l'affaire",
                    ),
                ),
                (
                    "statut",
                    models.CharField(
                        choices=[
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
                        ],
                        default="INCONNU",
                        max_length=200,
                        verbose_name="statut de l'affaire",
                    ),
                ),
                (
                    "date_creation",
                    models.DateField(
                        auto_now_add=True,
                        verbose_name="date de création de l'affaire (ajout à notre bd)",
                    ),
                ),
                (
                    "date_rendu",
                    models.DateField(
                        blank=True,
                        null=True,
                        verbose_name="date à laquelle l'affaire doit être terminée",
                    ),
                ),
                (
                    "date_modification",
                    models.DateTimeField(
                        auto_now=True, verbose_name="date de modification"
                    ),
                ),
                (
                    "date_cloture",
                    models.DateField(
                        blank=True,
                        null=True,
                        verbose_name="date de clôture de l'affaire (terminée)",
                    ),
                ),
                (
                    "hash_sgm_bd",
                    models.CharField(
                        blank=True,
                        max_length=200,
                        null=True,
                        verbose_name="hash de l'affaire dans la base de données SGM",
                    ),
                ),
                (
                    "charge_affaire",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AffectationAjustage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "semaine_affectation",
                    models.DateField(verbose_name="Semaine d'affectation de l'étape"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Aptitude",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("designation", models.CharField(max_length=200)),
                ("taux_horaire", models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name="Client",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("raison", models.CharField(max_length=200)),
                ("type", models.CharField(blank=True, max_length=200, null=True)),
                ("adresse1", models.CharField(max_length=200)),
                ("adresse2", models.CharField(blank=True, max_length=200, null=True)),
                ("adresse3", models.CharField(blank=True, max_length=200, null=True)),
                ("zip_code", models.CharField(max_length=200)),
                ("ville", models.CharField(max_length=200)),
                ("pays", models.CharField(max_length=200)),
                ("tel1", models.CharField(max_length=200)),
                ("tel2", models.CharField(blank=True, max_length=200, null=True)),
                ("email", models.CharField(max_length=200)),
                ("correspondant", models.CharField(max_length=200)),
                ("memo", models.CharField(blank=True, max_length=200, null=True)),
                ("compte", models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="Etape",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("num_etape", models.IntegerField(verbose_name="N°Étape")),
                (
                    "terminee",
                    models.BooleanField(default=False, verbose_name="Terminée ?"),
                ),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        max_length=10000,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
                ("ref_doc", models.CharField(blank=True, max_length=2000, null=True)),
                (
                    "nom_piece",
                    models.CharField(
                        blank=True,
                        max_length=2000,
                        null=True,
                        verbose_name="Nom de la pièce",
                    ),
                ),
                ("quantite", models.IntegerField(default=0, verbose_name="Quantité")),
                (
                    "temps",
                    models.IntegerField(default=0, verbose_name="Temps nécessaire"),
                ),
                ("plan", models.CharField(blank=True, max_length=2000, null=True)),
                ("rep", models.CharField(blank=True, max_length=2000, null=True)),
                (
                    "date_creation",
                    models.DateField(
                        auto_now_add=True, verbose_name="date de création"
                    ),
                ),
                (
                    "date_modification",
                    models.DateTimeField(
                        auto_now=True, verbose_name="date de modification"
                    ),
                ),
                (
                    "date_cloture",
                    models.DateField(
                        blank=True, null=True, verbose_name="date de clôture"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Etat",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("designation", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="FicheModele",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "date_creation",
                    models.DateField(
                        auto_now_add=True, verbose_name="date de création"
                    ),
                ),
                ("titre", models.CharField(default="", max_length=100)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "fourniture",
                    models.BooleanField(
                        default=False, verbose_name="Fournitures arrivées"
                    ),
                ),
            ],
            options={
                "verbose_name": "Fiche modèle",
                "verbose_name_plural": "Fiches modèle",
            },
        ),
        migrations.CreateModel(
            name="Fournisseur",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("raison", models.CharField(max_length=200)),
                ("adresse1", models.CharField(max_length=200)),
                ("adresse2", models.CharField(blank=True, max_length=200, null=True)),
                ("code_postal", models.CharField(max_length=200)),
                ("ville", models.CharField(max_length=200)),
                ("pays", models.CharField(max_length=200)),
                ("telephone", models.CharField(max_length=200)),
                ("email", models.CharField(max_length=200)),
                (
                    "correspondant",
                    models.CharField(
                        max_length=200, verbose_name="Correspondant de l'entreprise"
                    ),
                ),
                ("siret", models.CharField(blank=True, max_length=200, null=True)),
                ("tva", models.CharField(blank=True, max_length=200, null=True)),
                (
                    "iban",
                    models.CharField(
                        blank=True, max_length=200, null=True, verbose_name="iban"
                    ),
                ),
                (
                    "bic",
                    models.CharField(
                        blank=True, max_length=200, null=True, verbose_name="bic"
                    ),
                ),
                (
                    "delais_livraison",
                    models.IntegerField(
                        blank=True,
                        null=True,
                        verbose_name="délais de livraison (jours)",
                    ),
                ),
                ("memo", models.TextField(blank=True, null=True, verbose_name="mémo")),
            ],
        ),
        migrations.CreateModel(
            name="GroupeMachine",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "nom_groupe",
                    models.CharField(
                        max_length=300, verbose_name="Nom du groupe machine"
                    ),
                ),
                (
                    "prix_theorique",
                    models.IntegerField(
                        default=0, verbose_name="Prix théorique / heure"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Statut",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="TypeFourniture",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code_type_fourniture",
                    models.CharField(
                        max_length=200, verbose_name="Code type fourniture"
                    ),
                ),
                (
                    "description",
                    models.TextField(verbose_name="Description du type de fourniture"),
                ),
            ],
            options={
                "db_table": "type_fourniture",
            },
        ),
        migrations.CreateModel(
            name="Zone",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nom", models.CharField(max_length=200)),
                ("description", models.TextField(max_length=1000)),
                (
                    "etapes",
                    models.ManyToManyField(
                        through="api.AffectationAjustage", to="api.etape"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PointageEtape",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date_debut", models.DateTimeField(verbose_name="Date de début")),
                (
                    "date_fin",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Date de fin"
                    ),
                ),
                (
                    "etape",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT, to="api.etape"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="user_pointages",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Note",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("contenu", models.TextField()),
                ("date_creation", models.DateField(auto_now_add=True)),
                (
                    "affaire",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="notes",
                        to="api.affaire",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_notes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Machine",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nom_machine", models.CharField(max_length=100)),
                (
                    "description",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("fonctionnelle", models.BooleanField(default=True)),
                ("est_active", models.BooleanField(default=True)),
                (
                    "groupe_machine",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        to="api.groupemachine",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Fourniture",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("code_fourniture", models.CharField(max_length=200)),
                (
                    "description",
                    models.TextField(verbose_name="Description de la fourniture"),
                ),
                (
                    "prix_ht",
                    models.DecimalField(
                        decimal_places=2, max_digits=100, verbose_name="Prix HT"
                    ),
                ),
                (
                    "fournisseur",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.fournisseur",
                    ),
                ),
                (
                    "type_fourniture",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.typefourniture",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Fiche",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("titre", models.CharField(default="", max_length=100)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "observation",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("ref_doc", models.CharField(blank=True, max_length=200, null=True)),
                (
                    "terminee",
                    models.BooleanField(default=False, verbose_name="Fiche terminée"),
                ),
                (
                    "fourniture",
                    models.BooleanField(
                        default=False, verbose_name="Fournitures arrivées"
                    ),
                ),
                (
                    "date_creation",
                    models.DateField(
                        auto_now_add=True, verbose_name="date de création"
                    ),
                ),
                (
                    "date_modification",
                    models.DateTimeField(
                        auto_now=True, verbose_name="date de modification"
                    ),
                ),
                (
                    "date_cloture",
                    models.DateField(
                        blank=True, null=True, verbose_name="date de clôture"
                    ),
                ),
                (
                    "affaire",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="fiches",
                        to="api.affaire",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Facture",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "date_creation",
                    models.DateField(
                        auto_now_add=True, verbose_name="date de création"
                    ),
                ),
                (
                    "date_modification",
                    models.DateTimeField(
                        auto_now=True, verbose_name="date de modification"
                    ),
                ),
                (
                    "date_envoi",
                    models.DateField(
                        blank=True, null=True, verbose_name="date d'envoi"
                    ),
                ),
                (
                    "date_echeance",
                    models.DateField(
                        blank=True, null=True, verbose_name="date d'échéance"
                    ),
                ),
                (
                    "date_paiement",
                    models.DateField(
                        blank=True, null=True, verbose_name="date de paiement"
                    ),
                ),
                (
                    "date_relance",
                    models.DateField(
                        blank=True, null=True, verbose_name="date de relance"
                    ),
                ),
                (
                    "affaire",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.affaire"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="EtapeModele",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("num_etape", models.IntegerField(verbose_name="N°Étape")),
                ("quantite", models.IntegerField(default=0, verbose_name="Quantité")),
                (
                    "temps",
                    models.IntegerField(default=0, verbose_name="Temps nécessaire"),
                ),
                ("plan", models.CharField(blank=True, max_length=2000, null=True)),
                ("rep", models.CharField(blank=True, max_length=2000, null=True)),
                (
                    "terminee",
                    models.BooleanField(default=False, verbose_name="Terminée ?"),
                ),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        max_length=10000,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
                (
                    "date_creation",
                    models.DateField(
                        auto_now_add=True, verbose_name="date de création"
                    ),
                ),
                (
                    "date_modification",
                    models.DateTimeField(
                        auto_now=True, verbose_name="date de modification"
                    ),
                ),
                (
                    "fiche_modele",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="etapes_modele",
                        to="api.fichemodele",
                    ),
                ),
                (
                    "groupe_machine",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        to="api.groupemachine",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="etape",
            name="fiche",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="etapes",
                to="api.fiche",
            ),
        ),
        migrations.AddField(
            model_name="etape",
            name="groupe_machine",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.groupemachine",
            ),
        ),
        migrations.CreateModel(
            name="AffectationMachine",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "semaine_affectation",
                    models.DateField(verbose_name="Semaine d'affectation de l'étape"),
                ),
                (
                    "etape",
                    models.OneToOneField(
                        default=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.etape",
                    ),
                ),
                (
                    "machine",
                    models.ForeignKey(
                        default=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.machine",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="affectationajustage",
            name="etape",
            field=models.OneToOneField(
                default=False,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.etape",
            ),
        ),
        migrations.AddField(
            model_name="affectationajustage",
            name="zone",
            field=models.ForeignKey(
                default=False,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.zone",
            ),
        ),
        migrations.CreateModel(
            name="AchatFourniture",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("quantite", models.IntegerField(default=1, verbose_name="Quantité")),
                (
                    "date_demande",
                    models.DateField(
                        auto_now_add=True, verbose_name="Date de la demande"
                    ),
                ),
                (
                    "date_achat",
                    models.DateField(
                        blank=True, null=True, verbose_name="Date d'achat"
                    ),
                ),
                (
                    "date_reception",
                    models.DateField(
                        blank=True, null=True, verbose_name="Date de réception"
                    ),
                ),
                (
                    "affaire",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.affaire"
                    ),
                ),
                (
                    "fourniture",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.fourniture"
                    ),
                ),
            ],
            options={
                "db_table": "achat_fourniture",
            },
        ),
    ]
