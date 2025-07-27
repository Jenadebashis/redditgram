from django.shortcuts import render

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
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import status
from .models import Post, Comment, Like, Follow
from .serializers import PostSerializer, ProfileSerializer, CommentSerializer
from django.http import JsonResponse

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_bio_view(request):
    profile = request.user.profile

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
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

    serialized_posts = PostSerializer(paginated_posts, many=True)

    # 🔥 Get bio from profile
    bio = getattr(user.profile, 'bio', '')

    return paginator.get_paginated_response({
        'posts': serialized_posts.data,
        'bio': bio,
        'username': user.username,
    })

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class PostListCreateView(ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


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
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['post_id'])
        serializer.save(author=self.request.user, post=post)


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


