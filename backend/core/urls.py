from django.urls import path
from .views import RegisterView, get_user_info

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', get_user_info, name='get_user_info'),
]
