from django.shortcuts import render

from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.serializers import ModelSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView
from .models import Post
from .serializers import PostSerializer
from django.http import JsonResponse
import cloudinary.uploader

def test_cloudinary_upload(request):
    result = cloudinary.uploader.upload("core/3.webp")
    print("✅ Uploaded:", result['secure_url'])
    return JsonResponse({"url": result['secure_url']})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
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
        image_url = self.request.data.get('image_url')
        serializer.save(author=self.request.user, image_url=image_url)


