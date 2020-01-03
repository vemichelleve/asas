from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth import login, authenticate
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import User, Student, Admin
from .serializers import *


class UserSignUpView(APIView):
    def post(self, request, format=None):
        user = request.data
        if not (User.objects.filter(email=user['email']).exists() or User.objects.filter(username=user['username']).exists()):
            userobj = User.objects.create_user(user['username'], user['email'], user['password'], first_name=user['first_name'],
                                               last_name=user['last_name'], is_student=user['is_student'], is_admin=user['is_admin'])
            userobj.save()
            if user['is_admin']:
                Admin.objects.create(user=userobj)
            if user['is_student']:
                Student.objects.create(user=userobj)
            return Response({'message': 'Account successfully created!', 'status': 1})
        else:
            return Response({'message': 'There was an error', 'status': 0})


class UserLoginView(APIView):
    def get_object(self, data):
        try:
            return User.objects.get(username=data)
        except:
            return None

    def post(self, request, format=None):
        data = request.data
        generaluser = self.get_object(data['username'])

        if generaluser is None:
            return Response({'message': 'User not found', 'status': 0})

        else:
            if data['is_admin']:
                if Admin.objects.filter(user=generaluser).exists():
                    user = authenticate(
                        username=data['username'], password=data['password'])
                else:
                    return Response({'message': 'You are not registered as admin', 'status': 0})
            elif data['is_student']:
                if Student.objects.filter(user=generaluser).exists():
                    user = authenticate(
                        username=data['username'], password=data['password'])
                else:
                    return Response({'message': 'You are not registered as student', 'status': 0})

            if user is not None:
                login(request, user)
                return Response({'message': 'Login successful', 'status': 1})
            else:
                return Response({'message': 'Wrong password', 'status': 0})


class StudentListView(APIView):
    def get(self, request, format=None):
        students = User.objects.all().filter(is_student=True)
        if students is not None:
            serializer = UserSerializer(
                students, context={'request': request}, many=True)
            return Response({'message': 'Students retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'Students not found', 'status': 0})


class StudentDetailsView(APIView):
    def get(self, request, pk, format=None):
        try:
            student = User.objects.get(pk=pk)
        except:
            return Response({'message': 'Student not found', 'status': 0})

        serializer = UserSerializer(
            student, context={'request': request})
        return Response({'message': 'Student fount', 'status': 1, 'data': serializer.data})


class QuestionListView(APIView):
    def get(self, request, format=None):
        return Response({'message': 'try', 'status': 0})