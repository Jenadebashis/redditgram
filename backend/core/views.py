from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    BasePermission,
    SAFE_METHODS,
)
from rest_framework.serializers import ModelSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import status
from django.db.models import Count
from .models import Post, Comment, Like, CommentLike, Follow, Tag, Bookmark, Notification
from .serializers import (
    PostSerializer,
    ProfileSerializer,
    CommentSerializer,
    TagSerializer,
    BookmarkSerializer,
    NotificationSerializer,
)
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings


def send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    link = f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"
    send_mail(
        "Verify your email",
        f"Click the link to verify your email: {link}",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=True,
    )

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_bio_view(request):
    profile = request.user.profile

    if request.method == 'GET':
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_avatar(request):
    profile = request.user.profile
    serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    profile = user.profile
    avatar = profile.avatar.url if profile.avatar else None
    if avatar and request is not None:
        avatar = request.build_absolute_uri(avatar)
    return Response({
        'username': user.username,
        'email': user.email,
        'avatar': avatar,
    })
    

@api_view(['GET'])
def get_user_posts(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    posts = Post.objects.filter(author=user).order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 5
    paginated_posts = paginator.paginate_queryset(posts, request)

    serialized_posts = PostSerializer(paginated_posts, many=True, context={'request': request})

    # 🔥 Get bio from profile
    profile = user.profile
    bio = getattr(profile, 'bio', '')
    avatar = profile.avatar.url if profile.avatar else None
    if avatar:
        avatar = request.build_absolute_uri(avatar)

    return paginator.get_paginated_response({
        'posts': serialized_posts.data,
        'bio': bio,
        'username': user.username,
        'avatar': avatar,
    })

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(is_active=False, **validated_data)
        send_verification_email(user)
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class TrendingPostsView(ListCreateAPIView):
    serializer_class = PostSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Post.objects.all().prefetch_related("tags")
        if self.request.query_params.get("sort") == "trending":
            qs = qs.annotate(like_count=Count("likes")).order_by("-like_count", "-created_at")
        else:
            qs = qs.order_by("-created_at")
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class TagPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        name = self.kwargs['name']
        return Post.objects.filter(tags__name=name).order_by('-created_at').prefetch_related('tags')


class IsAuthorOrReadOnly(BasePermission):
    """Allow authors to edit or delete their own posts."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user


class PostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]


class CommentListCreateView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id, parent__isnull=True).order_by('created_at')

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['post_id'])
        serializer.save(author=self.request.user, post=post)


class ReplyListCreateView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        comment_id = self.kwargs['comment_id']
        return Comment.objects.filter(parent_id=comment_id).order_by('created_at')

    def perform_create(self, serializer):
        parent = Comment.objects.get(pk=self.kwargs['comment_id'])
        serializer.save(
            author=self.request.user,
            post=parent.post,
            parent=parent,
        )


class CommentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'detail': 'Post not found.'}, status=404)

    like, created = Like.objects.get_or_create(post=post, user=request.user)
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    return Response({'liked': liked, 'like_count': post.likes.count()})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return Response({'detail': 'Comment not found.'}, status=404)

    like, created = CommentLike.objects.get_or_create(comment=comment, user=request.user)
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    return Response({'liked': liked, 'like_count': comment.likes.count()})


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    try:
        target = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)

    if target == request.user:
        return Response({'detail': 'Cannot follow yourself.'}, status=400)

    if request.method == 'GET':
        following = Follow.objects.filter(follower=request.user, following=target).exists()
        return Response({'following': following})

    follow, created = Follow.objects.get_or_create(follower=request.user, following=target)
    if not created:
        follow.delete()
        following = False
    else:
        following = True
    return Response({'following': following})


@api_view(['GET'])
@permission_classes([AllowAny])
def list_followers(request, username):
    """Return a list of usernames following the given user."""
    try:
        target = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    follower_usernames = list(
        target.followers.values_list('follower__username', flat=True)
    )
    return Response({'followers': follower_usernames})


@api_view(['GET'])
@permission_classes([AllowAny])
def list_following(request, username):
    """Return a list of usernames that the user is following."""
    try:
        target = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    following_usernames = list(
        target.following.values_list('following__username', flat=True)
    )
    return Response({'following': following_usernames})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed_view(request):
    followed = request.user.following.values_list('following', flat=True)
    posts = Post.objects.filter(author__in=list(followed) + [request.user.id]).order_by('-created_at')
    paginator = PageNumberPagination()
    paginator.page_size = 5
    paginated = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(paginated, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    q = request.query_params.get('q', '')
    posts = Post.objects.filter(caption__icontains=q).order_by('-created_at')[:10]
    users = User.objects.filter(username__icontains=q)[:10]
    post_ser = PostSerializer(posts, many=True, context={'request': request})
    user_data = [{'username': u.username} for u in users]
    return Response({'posts': post_ser.data, 'users': user_data})


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request):
    uid = request.query_params.get('uid')
    token = request.query_params.get('token')
    if not uid or not token:
        return Response({'detail': 'Invalid link.'}, status=400)
    try:
        uid = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'detail': 'Email verified.'})
    return Response({'detail': 'Invalid or expired token.'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get('email')
    if not email:
        return Response({'email': 'This field is required.'}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Respond with success even if user does not exist
        return Response({'detail': 'If an account exists, a password reset email has been sent.'})

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    link = f"{settings.FRONTEND_URL}/reset-password-confirm?uid={uid}&token={token}"
    send_mail(
        'Reset your password',
        f'Click the link to reset your password: {link}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=True,
    )
    return Response({
        'detail': 'If an account exists, a password reset email has been sent.',
        'reset_link': link,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    password = request.data.get('password')

    if not all([uid, token, password]):
        return Response({'detail': 'Missing parameters.'}, status=400)

    try:
        uid = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'detail': 'Invalid link.'}, status=400)

    if default_token_generator.check_token(user, token):
        user.set_password(password)
        user.save()
        return Response({'detail': 'Password reset successful.'})
    return Response({'detail': 'Invalid or expired token.'}, status=400)


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]


class PopularTagListView(generics.ListAPIView):
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Tag.objects.annotate(post_count=Count('posts')).order_by('-post_count')


class SuggestedUsersView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            User.objects.exclude(id=self.request.user.id)
            .annotate(follower_count=Count('followers'))
            .order_by('-follower_count')[:5]
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [{'username': user.username} for user in queryset]
        return Response(data)


class BookmarkListView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('post')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookmarkDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only access their own bookmarks
        return Bookmark.objects.filter(user=self.request.user)


class UserStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'post_count': Post.objects.filter(author=user).count(),
            'following_count': user.following.count(),
            'follower_count': user.followers.count(),
            'bookmark_count': user.bookmarks.count(),
        }
        return Response(data)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user)
        if self.request.query_params.get('unread') == 'true':
            qs = qs.filter(is_read=False)
        if self.request.query_params.get('unread_first') == 'true':
            qs = qs.order_by('is_read', '-created_at')
        else:
            qs = qs.order_by('-created_at')
        return qs


class NotificationDetailView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all of the current user's notifications as read."""
    Notification.objects.filter(user=request.user, is_read=False).update(
        is_read=True
    )
    return Response({'detail': 'All notifications marked as read.'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_notifications(request):
    """Delete all notifications for the current user."""
    Notification.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


