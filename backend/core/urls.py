from django.urls import path
from .views import (
    RegisterView,
    get_user_info,
    get_user_posts,
    PostListCreateView,
    PostDetailView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', get_user_info, name='get_user_info'),
    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/user/<str:username>/', get_user_posts, name='user-posts'),
]
