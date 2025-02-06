from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(WhatsappAndTelegram)
admin.site.register(UserSelected)
admin.site.register(NewsArticles)
admin.site.register(SocialMediaPosts)
admin.site.register(FacebookPosts)