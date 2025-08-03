from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

@database_sync_to_async
def get_user(token):
    try:
        validated = AccessToken(token)
        user_id = validated['user_id']
        return get_user_model().objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope.get('headers', []))
        subprotocols = scope.get('subprotocols', [])
        token_header = headers.get(b'sec-websocket-protocol')
        token = None
        if token_header:
            token = token_header.decode().split('Bearer ')[-1]
        elif subprotocols:
            token = subprotocols[0]
        else:
            auth_header = headers.get(b'authorization')
            token = auth_header.decode().split('Bearer ')[-1] if auth_header else None
        scope['user'] = await get_user(token) if token else AnonymousUser()
        return await self.inner(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    from channels.auth import AuthMiddlewareStack
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
