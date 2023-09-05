from django.db import models


class TypeFourniture(models.Model):

    code_type_fourniture = models.CharField("Code type fourniture", max_length=200)
    description = models.TextField("Description du type de fourniture")

    def __str__(self):
        return f"{self.code_type_fourniture}"

    class Meta:
        db_table = "type_fourniture"
