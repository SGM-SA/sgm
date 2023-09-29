from django.test import TestCase

from api.utils.dates import week_to_date_range
from datetime import datetime


class TestDates(TestCase):
    def test_debut_annee(self):
        self.assertEqual(
            week_to_date_range("2023-01-01"),
            (datetime(2022, 12, 26), datetime(2023, 1, 1)),
        )

    def test_fin_annee(self):
        self.assertEqual(
            week_to_date_range("2023-12-31"),
            (datetime(2023, 12, 25), datetime(2023, 12, 31)),
        )

    def test_annee_bissextile_28_fevrier(self):
        self.assertEqual(
            week_to_date_range("2024-02-28"),
            (datetime(2024, 2, 26), datetime(2024, 3, 3)),
        )

    def test_annee_bissextile_29_fevrier(self):
        self.assertEqual(
            week_to_date_range("2024-02-29"),
            (datetime(2024, 2, 26), datetime(2024, 3, 3)),
        )

    def test_annee_non_bissextile_28_fevrier(self):
        self.assertEqual(
            week_to_date_range("2023-02-28"),
            (datetime(2023, 2, 27), datetime(2023, 3, 5)),
        )

    def test_debut_mois(self):
        self.assertEqual(
            week_to_date_range("2023-05-01"),
            (datetime(2023, 5, 1), datetime(2023, 5, 7)),
        )

    def test_fin_mois(self):
        self.assertEqual(
            week_to_date_range("2023-05-31"),
            (datetime(2023, 5, 29), datetime(2023, 6, 4)),
        )

    def test_date_aleatoire(self):
        self.assertEqual(
            week_to_date_range("2023-08-08"),
            (datetime(2023, 8, 7), datetime(2023, 8, 13)),
        )
