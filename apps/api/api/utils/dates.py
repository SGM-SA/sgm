from datetime import datetime, timedelta


# Merci à chatGPT pour le code et les regles concernant les dates (IsO 8601) :
# To correctly use the ISO 8601 standard in Python, you should use %G, %V, and %u, where:
#
# %G: The ISO 8601 week-numbering year, which is slightly different than the regular calendar year.
# %V: The ISO 8601 week number.
# %u: The ISO 8601 weekday, where Monday is 1 and Sunday is 7.


def week_to_date_range(date_str) -> (datetime, datetime):
    """
    Convertit une semaine en une plage de dates.
    :param date_str: Semaine au format YYYY-MM-DD
    :return: Tuple (lundi date, mardi date)
    """
    input_date = datetime.strptime(date_str, "%Y-%m-%d")
    weekday = input_date.weekday()
    lundi = input_date - timedelta(days=weekday)
    dimanche = lundi + timedelta(days=6)

    return lundi, dimanche
