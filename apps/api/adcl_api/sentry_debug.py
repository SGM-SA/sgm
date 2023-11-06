from django.urls import path


def trigger_error(request):
    return 1 / 0


urlpatterns = [
    path("sentry-debug/", trigger_error),
    # ...
]
