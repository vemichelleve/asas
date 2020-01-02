from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth import login, authenticate

from .models import User, Student
from .serializers import *


class StudentSignUpView(APIView):
    def get_object(self):
        try:
            return User.objects.all()
        except:
            return None

    def get(self, request, format=None):
        user = self.get_object()
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        user = request.data
        if not (User.objects.filter(email=user['email']).exists()):
            User.objects.create_user(user['username'], user['email'], user['password'], first_name=user['first_name'],
                                     last_name=user['last_name'], is_student=True, is_admin=False).save()
            return Response({'message': 'Account successfully created!', 'status': 1})
        else:
            return Response({'message': 'There was an error', 'status': 0})