from django.db import models

# Create your models here.

class newsArticles(models.Model):
    sourceURL = models.CharField(max_length=100)
    articleTitle = models.CharField(max_length=100)
    articleContent = models.CharField(max_length=10000)
    imageURL = models.CharField(max_length=100, null=True)
    status = models.CharField(max_length=20, default="Unverified")

class socialMediaPosts(models.Model):
    sourceURL = models.CharField(max_length=100)
    articleContent = models.CharField(max_length=10000)
    imageURL = models.CharField(max_length=100, null=True)
    platformName = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default="Unverified")
    
class userSelected(models.Model):
    selectedContent = models.CharField(max_length=100)
    confidence = models.IntegerField()
    imageURL = models.CharField(max_length=100, null=True)
    sourceURL = models.CharField(max_length=100)
    proofURL = models.CharField(max_length=100)
    userFeedback = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="Unverified")
