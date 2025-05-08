import easyocr
import cv2 as cv
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Concatenate, Flatten
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
import keras.applications
import transformers
import tensorflow
from keras.models import load_model
from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json
import newspaper
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import joblib
import pandas as pd
import re
import pickle
import spacy
import urllib.request
from transformers import pipeline
import numpy as np
import keras
from keras import models
from transformers import BertTokenizer, TFBertModel

tensorflow.config.set_visible_devices([], 'GPU')

bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_encoder = TFBertModel.from_pretrained('bert-base-uncased')
text_classifier = load_model(
    "./text_classifier.h5")
summarizer = pipeline(
    "summarization", model="pszemraj/long-t5-tglobal-base-16384-book-summary")


params = {
    "max_length": 200,
    "min_length": 50,
    "no_repeat_ngram_size": 3,
    "early_stopping": True,
    "repetition_penalty": 3.5,
    "length_penalty": 0.3,
    "encoder_no_repeat_ngram_size": 3,
    "num_beams": 4,
}


nlp = spacy.load("en_core_web_sm")
reader = easyocr.Reader(["en"])



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def insertUser(request):
    try:
        if request.method == 'POST':
            received_data = json.loads(request.body)
            selected_content_value = received_data.get('selectedContent', '')
            confidence_value = received_data.get('confidence')
            image_url_value = received_data.get('imageURL')
            source_url_value = received_data.get('sourceURL')
            proof_url_value = received_data.get('proofURL')
            user_fedback_value = received_data.get('userFeedback', '')
            newEntry = UserSelected(selectedContent=selected_content_value,
                                    confidence=confidence_value,
                                    image_url=image_url_value,
                                    source_url=source_url_value,
                                    proof_url=proof_url_value,
                                    user_feedback=user_fedback_value)
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
            received_data = json.loads(request.body)
            source_url_value = received_data.get('source_url')
            article_title_value = received_data.get('article_title')
            article_content_value = received_data.get('article_content')
            image_url_value = received_data.get('image_url')
            print("before searching")
            result = searchNews(source_url_value)
            print("after searching")
            if result:
                print("exists")
                return Response({'message': 'Already exists in Database', 'result': result})
            else:
                print("doesnt exist")
                result = predictFakeNews(
                    image_url_value, article_title_value+article_content_value)
                if result is not None:
                    new_entry = NewsArticles(source_url=source_url_value,
                                             article_title=article_title_value,
                                             article_content=article_content_value,
                                             image_url=image_url_value,
                                             status=str(result))
                    new_entry.save()
                response_data = {'result': str(result)}
                return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def insertSocial(request):
    try:
        if request.method == 'POST':
            print("inside insertSocial")
            receivedData = json.loads(request.body)
            sourceURL_value = receivedData.get('sourceURL')
            articleContent_value = receivedData.get('articleContent')
            imageURL_value = receivedData.get('imageURL')
            platformName_value = receivedData.get('platformName')

            existing_entry = SocialMediaPosts.objects.filter(
                sourceURL=sourceURL_value,
                articleContent=articleContent_value,
                imageURL=imageURL_value
            ).first()

            if existing_entry:
                return Response({'message': 'Post already exists!'})
                # Entry already exists, you may choose to handle this case differently
            image_text = ""
            print(imageURL_value)
            print("before image url value")
            if imageURL_value:
                print("inside if condition of image url value")
                image_text = getTextFromImage(imageURL_value)

            print("image text is: ", image_text)

            result = tagging(articleContent_value+image_text)
            newEntry = SocialMediaPosts(sourceURL=sourceURL_value,
                                        articleContent=articleContent_value,
                                        imageURL=imageURL_value,
                                        platformName=platformName_value,
                                        status=str(result))

            newEntry.save()
            return Response({'message': 'Post stored successfully!'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def insertFacebook(request):
    try:
        if request.method == 'POST':
            received_data = json.loads(request.body)
            source_url_value = received_data.get('sourceURL')
            article_content_value = received_data.get('articleContent')
            image_url_value = received_data.get('imageURL')
            platform_name_value = received_data.get('platformName')

            existing_entry = FacebookPosts.objects.filter(
                source_url=source_url_value,
                article_content=article_content_value,
                image_url=image_url_value
            ).first()
            if existing_entry:
                # Entry already exists, you may choose to handle this case differently
                return Response({'message': 'Post with the same source URL and content and img already exists!', 'result': existing_entry.status})

            result = "Unverified"
            # result = predictFakeNews()
            # print(existing_entry,articleContent_value)
            if article_content_value is not None:
                t = tagging(article_content_value)
                if (t == 0):
                    result = "Health Related"
                elif (t == 1):
                    # result=str(predict(article_content_value))
                    result = predictFakeNews(
                        image_url_value, article_content_value)

                elif (t == 2):
                    result = "Satirecal"

            newEntry = FacebookPosts(source_url=source_url_value,
                                     article_content=article_content_value,
                                     image_url=image_url_value,
                                     platform_name=platform_name_value,
                                     status=result)
            newEntry.save()
            existing_entry = FacebookPosts.objects.filter(
                source_url=source_url_value,
                article_content=article_content_value,
                imageURL=image_url_value,
                status=result
            ).delete()
            newEntry = FacebookPosts(sourceURL=source_url_value,
                                     articleContent=article_content_value,
                                     imageURL=image_url_value,
                                     platformName=platform_name_value,
                                     status=result)
            newEntry.save()
            # print(len(FacebookPosts.objects.all()))

            return Response({'message': 'Post stored successfully!', 'result': result})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


def getTextFromImage(url):
    try:
        if not url:
            return ''
        urllib.request.urlretrieve(url, "temp.jpeg")
        result = reader.readtext('temp.jpeg')
        text = [i[1] for i in result]
        return ' '.join(text)
    except Exception as e:
        return ''


def tagging(text):
    try:
        print("Inside tagging fn 1")
        text = text.lower()
        doc = nlp(text)
        filtered_tokens = []
        print("Inside tagging fn")

        for token in doc:
            if token.is_stop or token.is_punct:
                # print("Inside tagging fn 2")
                continue
            else:
                # print(token.lemma_)
                # print("Inside tagging fn 3")
                filtered_tokens.append(token.lemma_)

        filtered_text = ' '.join(filtered_tokens)

        filtered_text = filtered_text.replace('\n', '').replace('\r', '')

        # tfid = pickle.load(open("C:/Users/SRI SAI SNIGDHA/Desktop/icssr-zip/icssr/backend/Backend/myapp/tfid_vectorizer.pkl", "rb"))
        tfid = pickle.load(open("C:/tfid_vectorizer.pkl", "rb"))

        print("after tfid")
        # print("Filtered text: ", filtered_text)
        test = tfid.transform([filtered_text])
        # print("test : ",test)
        model = pickle.load(open("C:/rfcmodel.pkl", "rb"))
        result = model.predict(test)[0]
        print("result inside tagging function is ", result)
        return result
    except Exception as e:
        print("Inside tagging fn error")
        print(f"Error: {e}")


# commented on 31-10-2024
# def predictFakeNews(image_url, text_content):
#     # print("Text content:", text_content)
#     print("inside predict")
#     image_text = ""
#     if image_url:
#         image_text = getTextFromImage(image_url)
#     print("img text: ",image_text)
#     print("text: ",text_content)
#     print("inside predict if")
#     print("image url", image_url)
#     # print("Text content:", text_content)
#     # print("Text content:", type(text_content))
#     result = tagging(text_content+image_text)
#     print("result inside predict",result)
#     if result == 1:
#         if len(image_text.split(' ')) > 6 or not image_url:
#             print("inside len > 6")
#             result = predictText(text_content)
#         else:
#             print("inside else")
#             result = predictImageText(image_url, text_content)
#         print(result, "is the prediction for fake news")
#         return result

#     else:
#         return result

def predictFakeNews(image_url, text_content):
    # print("Text content:", text_content)
    print("inside predict")
    image_text = ""
    if image_url:
        image_text = getTextFromImage(image_url)
    print("inside predict if")
    print("image url", image_url)
    # print("Text content:", text_content)
    # print("Text content:", type(text_content))
    if len(image_text.split(' ')) > 6:
        result = tagging(text_content+image_text)
        if result == 1:
            if not image_url:
                print("inside len > 6")
                result = predictText(text_content)
            else:
                print("inside else")
                result = predictImageText(image_url, text_content+image_text)
            print(result, "is the prediction for fake news")
            return result

        else:
            return result
    else:
        if not image_url:
            print("inside len > 6")
            result = predictText(text_content)
        else:
            print("inside else")
            result = predictImageText(image_url, text_content)
            print(result, "is the prediction for fake news")
            return result

# def predictFakeNews(image_url, text_content):
#     image_text = ""
#     if image_url:
#         image_text = getTextFromImage(image_url)
#     result = tagging(text_content+image_text)
#     if result == 1:
#         if len(image_text.split(' ')) > 6 or not image_url:
#             print("inside len > 6")
#             result = predictText(text_content)
#         else:
#             print("inside else")
#             result = predictImageText(image_url, text_content)
#         print(result, "is the prediction for fake news")
#         return result
#     else:
#         return result


def extractNews(url):
    article = newspaper.Article(url=url, language='en')
    article.download()
    article.parse()

    article = {
        "title": str(article.title),
        "text": str(article.text),
    }
    return article


def searchNews(source_url):
    print("searching news")
    existing_entry = NewsArticles.objects.filter(
        source_url=source_url,
    ).first()
    print("searched")
    if existing_entry:
        print("exists")
        return existing_entry.status
    else:
        print("doesnt exist")
        return None


def searchWhatsappAndTelegram(text_content, image_src):
    print("searching whatsapp and telegram")
    existing_entry = WhatsappAndTelegram.objects.filter(
        text_content=text_content,
        image_src=image_src
    ).first()
    print("searched")
    if existing_entry:
        print("exists")
        return existing_entry.result
    else:
        print("doesnt exist")
        return None


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def insertWhatsappAndTelegram(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            text_content = data.get('text_content')
            image_url = data.get('image_src')
            social_media = data.get('social_media')
            is_url = data.get('is_url')
            if is_url:
                print("url")
                result = searchNews(text_content)
                print("returned")
                if result:
                    print("existing entry")
                    return JsonResponse({'message': 'Already exists in Database', 'result': result})
                else:
                    print("not existing entry")
                    article = extractNews(text_content)
                    result = predictFakeNews(
                        "", article['title']+article['text'])
                    if result is not None:
                        new_entry = NewsArticles(source_url=text_content,
                                                 article_title=article['title'],
                                                 article_content=article['text'],
                                                 status=str(result))
                        new_entry.save()
                    response_data = {'result': str(result)}
                    return JsonResponse(response_data)
            else:
                print("not url")
                result = searchWhatsappAndTelegram(text_content, image_url)
                print("returned")
                if result:
                    print("existing entry")
                    return JsonResponse({'message': 'Already exists in Database', 'result': result})
                else:
                    print("not existing entry")
                    result = predictFakeNews(image_url, text_content)
                    print("result", result)
                    if result is not None:
                        new_entry = WhatsappAndTelegram(text_content=text_content,
                                                        image_src=image_url,
                                                        social_media=social_media,
                                                        result=str(result))
                        new_entry.save()
                    response_data = {'result': str(result)}
                    return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def predictText(text):
    if len(text.split(' ')) >= 200:
        text = summarizer(text, **params)[0]['summary_text']
    preprocessed_text = preprocess(text)
    encoded_text = np.array(bert_encoder(bert_tokenizer(preprocessed_text, return_tensors='tf',
                            padding="max_length", truncation=True, max_length=200)['input_ids'])[1])
    result = text_classifier.predict(encoded_text)
    return result[0][0]


def predictImageText(image_url, text):
    # print(image_url,"\n")
    print("before url")
    format = image_url.split('.')[-1]
    list_of_formats = ["jpeg", "jpg", "png", "jfif"]
    for f in list_of_formats:
        if format == f:
            f = "image."+f
            urllib.request.urlretrieve(image_url, f)
            break
    else:
        urllib.request.urlretrieve(image_url, "image.jpeg")

    # print(image_url,"\n")

    # urllib.request.urlretrieve(image_url,"image.jpeg")
    if len(text.split(' ')) >= 200:
        text = summarizer(text, **params)[0]['summary_text']
    print("after summarixer")
    MAX_LEN = 200
    tokenized_text = bert_tokenizer(
        [text], return_tensors='tf', padding="max_length", truncation=True, max_length=MAX_LEN)
    encoded_text = bert_encoder(tokenized_text['input_ids'])[1]
    print("reading image")
    image = cv.imread("./image.jpeg")
    image = cv.resize(image, (224, 224))
    image = np.expand_dims(image, axis=0)
    preprocessed_images = preprocess_input(np.array(image))
    resnet_model = ResNet50(weights='imagenet', include_top=False)
    resnet_output = resnet_model(preprocessed_images)
    concatenated_features = Concatenate()(
        [Flatten()(resnet_output), encoded_text])
    model = load_model("C:/Users/SRI SAI SNIGDHA/Downloads/classifier.h5")
    prediction = model.predict(concatenated_features)
    print("predicted")

    return int(prediction[0][0])


def preprocess(sent):
    sent = re.sub(r"[^a-zA-Z0-9]", " ", sent)
    doc = nlp(sent)
    filtered_tokens = []
    for token in doc:
        if token.is_stop or token.is_punct:
            continue
        else:
            filtered_tokens.append(token.lemma_)

    filtered_text = ' '.join(filtered_tokens)
    filtered_text = filtered_text.replace('\n', '').replace('\r', '')
    sent = " ".join(filtered_text)
    return sent


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getData(request):
    try:
        if request.method == 'GET':
            selectedContent_value = request.GET.get('selectedContent', '')
            row = UserSelected.objects.get(
                selectedContent=selectedContent_value)
            return Response({'result': row.status})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_jwt_token(request):
    try:
        if (request.method == 'POST'):
            if (request.user):
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

# model = joblib.load("D:/icssr/backend/Backend/myapp/isot_LR_model.joblib")
# def predict(text):
#     try:
#         combined_input = text.lower()
#         combined_input = re.sub(r'\W', ' ', combined_input)
#         combined_input = re.sub(r'\d+', '', combined_input)
#         combined_input = re.sub(r'https?://[A-Za-z0-9./]+', '', combined_input)
#         doc = nlp(combined_input)
#         filtered_tokens = []
#         for token in doc:
#             if token.is_stop or token.is_punct :
#                 continue
#             else:
#                 filtered_tokens.append(token.lemma_)
#         filtered_text = ' '.join(filtered_tokens)
#         # combined_input = ' '.join([word for word in combined_input.split() if word not in stopwords.words('english')])
#         # combined_input = ' '.join([WordNetLemmatizer().lemmatize(word) for word in combined_input.split()])
#         model = joblib.load('D:/icssr/backend/Backend/myapp/isot_LR_model.joblib')
#         combined_input = pd.Series(filtered_text)
#         answer = model.predict(combined_input)
#         return answer[0]
#     except Exception as e:
#         print(f"Error: {e}")
