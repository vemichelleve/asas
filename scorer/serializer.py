from rest_framework import serializers
from scorer.models import Student, Admin, User


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('pk', 'first_name', 'last_name', 'email', 'password')
