from django.db import models

# Create your models here.

class SocialMedia(models.Model):
    text_content = models.TextField(null=True)
    image_src = models.TextField(null=True)
    social_media = models.CharField(max_length=100,default='default-value')
    result = models.TextField(default='unverified')
