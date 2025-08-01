from rest_framework import serializers
from .models import Post, Profile, Comment, Tag, Bookmark, Notification, Story


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    comment_count = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    bookmark_id = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'author_username',
            'author_avatar',
            'caption',
            'profession',
            'feeling',
            'created_at',
            'comment_count',
            'like_count',
            'is_liked',
            'is_bookmarked',
            'bookmark_id',
            'tags',
            'tag_names',
        ]
        read_only_fields = ['author']

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_bookmark_id(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            bookmark = obj.bookmarks.filter(user=request.user).first()
            if bookmark:
                return bookmark.id
        return None

    def get_is_bookmarked(self, obj):
        return self.get_bookmark_id(obj) is not None

    def get_author_avatar(self, obj):
        avatar = getattr(obj.author.profile, 'avatar', None)
        if avatar:
            request = self.context.get('request')
            url = avatar.url
            return request.build_absolute_uri(url) if request else url
        return None

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        post = super().create(validated_data)
        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name)
            tags.append(tag)
        if tags:
            post.tags.set(tags)
        return post

class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = ['bio', 'profession', 'avatar', 'avatar_url']
        extra_kwargs = {
            'profession': {'required': False, 'allow_null': True, 'allow_blank': True}
        }

    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            url = obj.avatar.url
            return request.build_absolute_uri(url) if request else url
        return None


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    parent = serializers.PrimaryKeyRelatedField(read_only=True)
    replies = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'parent','author', 'author_username', 'text', 'created_at', 'like_count', 'is_liked', 'replies']
        read_only_fields = ['author', 'post', 'parent']
        
    def get_replies(self, obj):
        qs = obj.replies.order_by('created_at')
        serializer = CommentSerializer(qs, many=True, context=self.context)
        return serializer.data

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class BookmarkSerializer(serializers.ModelSerializer):
    """Serialize bookmarks with nested post details for easy display."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Include basic post info so the frontend can link directly to the post
        data["post"] = PostSerializer(instance.post, context=self.context).data
        return data

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['user', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'from_user', 'from_username', 'notification_type', 'post', 'created_at', 'is_read']
        read_only_fields = ['user', 'from_user', 'created_at']


class StorySerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Story
        fields = ['id', 'author', 'author_username', 'file', 'caption', 'created_at', 'expires_at']
        read_only_fields = ['author', 'created_at']