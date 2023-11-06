from django.db import models


class Client(models.Model):
    raison = models.CharField(max_length=200)
    type = models.CharField(max_length=200, null=True, blank=True)
    adresse1 = models.CharField(max_length=200)
    adresse2 = models.CharField(max_length=200, null=True, blank=True)
    adresse3 = models.CharField(max_length=200, null=True, blank=True)
    zip_code = models.CharField(max_length=200)
    ville = models.CharField(max_length=200)
    pays = models.CharField(max_length=200)
    tel1 = models.CharField(max_length=200)
    tel2 = models.CharField(max_length=200, null=True, blank=True)
    email = models.CharField(max_length=200)
    correspondant = models.CharField(max_length=200)
    memo = models.CharField(max_length=200, null=True, blank=True)
    compte = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.raison} - {self.tel1} - {self.email} - {self.correspondant}"
