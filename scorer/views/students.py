from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView

from .forms import StudentSignUpForm
from .models import User
from .serializers import *

# Create your views here.


@api_view(['GET'])
# class StudentSignUpView(CreateView):
def create_student(reponse):
    model = User
    form_class = StudentSignUpForm

    def form_valid(self, form):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
