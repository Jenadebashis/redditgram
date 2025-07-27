from django.urls import path
from .views import (
    RegisterView,
    get_user_info,
    user_bio_view,
    get_user_posts,
    PostListCreateView,
    PostDetailView,
    CommentListCreateView,
    like_post,
    follow_user,
    feed_view,
    search,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', get_user_info, name='get_user_info'),
    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comments'),
    path('posts/<int:post_id>/like/', like_post, name='like-post'),
    path('posts/user/<str:username>/', get_user_posts, name='user-posts'),
    path('follow/<str:username>/', follow_user, name='follow-user'),
    path('feed/', feed_view, name='feed'),
    path('search/', search, name='search'),
    path('profile/bio/', user_bio_view),
]
