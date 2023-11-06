from datetime import datetime, timedelta


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
