from django.contrib import admin
from .models import Profile, Comment, Like, Follow, CommentLike

admin.site.register(Profile)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(CommentLike)
admin.site.register(Follow)
# Register your models here.
