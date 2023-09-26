from datetime import datetime, timedelta


# Merci à chatGPT pour le code et les regles concernant les dates (IsO 8601) :
# To correctly use the ISO 8601 standard in Python, you should use %G, %V, and %u, where:
#
# %G: The ISO 8601 week-numbering year, which is slightly different than the regular calendar year.
# %V: The ISO 8601 week number.
# %u: The ISO 8601 weekday, where Monday is 1 and Sunday is 7.


def week_to_date_range(year: int, week: int) -> (datetime, datetime):
    """
    Convert a year and a week into a date range
    :param year: Year
    :param week: Week
    :return: Tuple (start date, end date)
    """
    start = datetime.strptime(f"{year}-W{week}-1", "%G-W%V-%u")
    end = start + timedelta(weeks=1) - timedelta(days=1)

    return start, end
