from rest_framework import pagination


class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    max_page_size = 100
    page_size_query_param = "per_page"


class SmallPagination(pagination.PageNumberPagination):
    page_size = 5
    max_page_size = 50
    page_size_query_param = "per_page"
