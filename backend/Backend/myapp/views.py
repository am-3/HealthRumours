from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken , RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
            return Response({'message': 'Post stored successfully!'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
def predictFakeNews(text_content,image_src,social_media):
    result = random.randint(0,100)
    WhatsappAndTelegram.objects.create(
                text_content=text_content,
                image_src=image_src,
                social_media=social_media,
                result=str(result)
            )

    return result

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def insertWhatsappAndTelegram(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            text_content = data.get('textContent')
            image_src = data.get('imageSrc')
            social_media = data.get('socialMedia')
            result = predictFakeNews(text_content,image_src,social_media)
            response_data = {'result':result}
            return JsonResponse(response_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getData(request):
    try:
        if request.method == 'GET':
            selectedContent_value = request.GET.get('selectedContent', '');
            row = userSelected.objects.get(selectedContent=selectedContent_value)
            return Response({'result': row.status})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_jwt_token(request):
    try:
        if(request.method == 'POST'):
            if(request.user):
                token = AccessToken.for_user(request.user)
                print("HERE")
                jwt_token = str(token)
                return Response({'access': jwt_token})
            else:
                return Response({'error': 'User auth failed'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

class TokenObtainView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh_token': str(refresh)
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)