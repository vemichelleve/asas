from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

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
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
