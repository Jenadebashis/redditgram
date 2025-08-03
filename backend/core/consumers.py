import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from .models import Message

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if user is None or user.is_anonymous:
            await self.close()
            return
        self.group_name = f'user_{user.id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept(
            subprotocol=self.scope['subprotocols'][0] if self.scope['subprotocols'] else None
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notify(self, event):
        await self.send_json(event['data'])

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'ping':
            await self.send_json({'type': 'pong'})
        # Safely ignore any other incoming messages to keep the connection open


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        other_username = self.scope['url_route']['kwargs']['username']
        if user is None or user.is_anonymous:
            await self.close()
            return
        User = get_user_model()
        try:
            other = await sync_to_async(User.objects.get)(username=other_username)
        except User.DoesNotExist:
            await self.close()
            return
        ids = sorted([user.id, other.id])
        self.group_name = f"chat_{ids[0]}_{ids[1]}"
        self.other_id = other.id
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept(
            subprotocol=self.scope['subprotocols'][0] if self.scope['subprotocols'] else None
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        message = content.get('message')
        if not message:
            return
        user = self.scope['user']
        msg = await sync_to_async(Message.objects.create)(
            sender_id=user.id, recipient_id=self.other_id, content=message
        )
        data = {
            'id': msg.id,
            'sender': msg.sender.username,
            'recipient': msg.recipient.username,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
        }
        await self.channel_layer.group_send(
            self.group_name,
            {'type': 'chat.message', 'message': data}
        )

    async def chat_message(self, event):
        await self.send_json(event['message'])
