from django.shortcuts import render
import random
# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *

def predictFakeNews(text_content,image_src,social_media):
    result = random.randint(0,100)
    SocialMedia.objects.create(
                text_content=text_content,
                image_src=image_src,
                social_media=social_media,
                result=str(result)
            )

    return result

@csrf_exempt
def extension_add_data_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text_content = data.get('textContent')
            image_src = data.get('imageSrc')
            social_media = data.get('socialMedia')
            print('receive data printing from views')
            # Insert received data into the database using the model
            result = predictFakeNews(text_content,image_src,social_media)
            
            
            # response_data = {'status': 'success', 'message': 'Data inserted into database'}
            response_data = {'result':result}
            return JsonResponse(response_data)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

