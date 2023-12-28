from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(WhatsappAndTelegram)
admin.site.register(userSelected)
admin.site.register(newsArticles)
admin.site.register(socialMediaPosts)