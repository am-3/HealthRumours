from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
@csrf_exempt
def insertUser(request):
    try:
        if request.method == 'POST':
            receivedData = json.loads(request.body)
            selectedContent_value = receivedData.get('selectedContent', '')
            confidence_value = receivedData.get('confidence')
            imageURL_value = receivedData.get('imageURL')
            sourceURL_value = receivedData.get('sourceURL')
            proofURL_value = receivedData.get('proofURL')
            userFeedback_value = receivedData.get('userFeedback', '')
            newEntry = userSelected(selectedContent=selectedContent_value,
                    confidence=confidence_value,
                    imageURL=imageURL_value,
                    sourceURL=sourceURL_value,
                    proofURL=proofURL_value,
                    userFeedback=userFeedback_value);
            newEntry.save()
            return JsonResponse({'message': 'Post stored successfully!'})
        else:
            return JsonResponse({'message': 'Invalid request method'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def insertNews(request):
    try:
        if request.method == 'POST':
            receivedData = json.loads(request.body)
            sourceURL_value = receivedData.get('sourceURL')
            articleTitle_value = receivedData.get('articleTitle')
            articleContent_value = receivedData.get('articleContent')
            imageURL_value = receivedData.get('imageURL')
            newEntry = newsArticles(sourceURL=sourceURL_value,
                                    articleTitle=articleTitle_value,
                                    articleContent=articleContent_value,
                                    imageURL=imageURL_value);
            newEntry.save()
            return JsonResponse({'message': 'Post stored successfully!'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def insertSocial(request):
    try:
        if request.method == 'POST':
            receivedData = json.loads(request.body)
            sourceURL_value = receivedData.get('sourceURL')
            articleContent_value = receivedData.get('articleContent')
            imageURL_value = receivedData.get('imageURL')
            platformName_value = receivedData.get('platformName')
            newEntry = socialMediaPosts(sourceURL=sourceURL_value,
                                    articleContent=articleContent_value,
                                    imageURL=imageURL_value,
                                    platformName=platformName_value);
            newEntry.save()
            return JsonResponse({'message': 'Post stored successfully!'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def getData(request):
    try:
        if request.method == 'GET':
            selectedContent_value = request.GET.get('selectedContent', '');
            row = userSelected.objects.get(selectedContent=selectedContent_value)
            return JsonResponse({'result': row.status})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)