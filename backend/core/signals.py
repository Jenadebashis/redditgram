# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import (
    Profile,
    Like,
    Comment,
    Follow,
    Notification,
    NotificationPreference,
)
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import NotificationSerializer

@receiver(post_save, sender=User)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        NotificationPreference.objects.create(user=instance)
    instance.profile.save()

@receiver(post_save, sender=Like)
def send_like_notification(sender, instance, created, **kwargs):
    if not created:
        return
    channel_layer = get_channel_layer()
    notification = Notification.objects.create(
        user=instance.post.author,
        from_user=instance.user,
        notification_type='like',
        post=instance.post,
    )
    pref = getattr(instance.post.author, 'notification_preference', None)
    if not pref or pref.notify_on_like:
        payload = NotificationSerializer(notification).data
        data = {
            'type': 'notify',
            'data': payload,
        }
        async_to_sync(channel_layer.group_send)(f'user_{instance.post.author_id}', data)


@receiver(post_save, sender=Comment)
def send_comment_notification(sender, instance, created, **kwargs):
    if not created:
        return
    channel_layer = get_channel_layer()
    notification = Notification.objects.create(
        user=instance.post.author,
        from_user=instance.author,
        notification_type='comment',
        post=instance.post,
    )
    pref = getattr(instance.post.author, 'notification_preference', None)
    if not pref or pref.notify_on_comment:
        payload = NotificationSerializer(notification).data
        data = {
            'type': 'notify',
            'data': payload,
        }
        async_to_sync(channel_layer.group_send)(f'user_{instance.post.author_id}', data)



@receiver(post_save, sender=Follow)
def send_follow_notification(sender, instance, created, **kwargs):
    if not created:
        return
    channel_layer = get_channel_layer()
    notification = Notification.objects.create(
        user=instance.following,
        from_user=instance.follower,
        notification_type='follow',
    )
    pref = getattr(instance.following, 'notification_preference', None)
    if not pref or pref.notify_on_follow:
        payload = NotificationSerializer(notification).data
        data = {
            'type': 'notify',
            'data': payload,
        }
        async_to_sync(channel_layer.group_send)(f'user_{instance.following_id}', data)
