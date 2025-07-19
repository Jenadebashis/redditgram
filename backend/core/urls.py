from django.urls import path
from .views import (
    RegisterView,
    get_user_info,
    PostListCreateView,
    PostDetailView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', get_user_info, name='get_user_info'),
    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
]
