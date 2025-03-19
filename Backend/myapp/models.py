from django.db import models

# Create your models here.

class NewsArticles(models.Model):
    source_url = models.CharField(max_length=100)
    article_title = models.CharField(max_length=100)
    article_content = models.TextField()
    image_url = models.CharField(max_length=100, null=True)
    status = models.CharField(max_length=20, default="Unverified")

class SocialMediaPosts(models.Model):
    source_url = models.CharField(max_length=100)
    article_content = models.TextField(null=True)
    image_url = models.CharField(max_length=100, null=True)
    platform_name = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default="Unverified")

class WhatsappAndTelegram(models.Model):
    text_content = models.TextField(null=True)
    image_src = models.TextField(null=True)
    social_media = models.CharField(max_length=30)
    result = models.CharField(max_length=20,default='unverified')
    
class UserSelected(models.Model):
    selected_content = models.CharField(max_length=100)
    confidence = models.IntegerField()
    image_url = models.CharField(max_length=100, null=True)
    source_url = models.CharField(max_length=100)
    proof_url = models.CharField(max_length=100)
    user_feedback = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="Unverified")

class FacebookPosts(models.Model):
    source_url = models.CharField(max_length=100)
    article_content = models.TextField(null=True)
    image_url = models.CharField(max_length=100, null=True)
    platform_name = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default="Unverified")
