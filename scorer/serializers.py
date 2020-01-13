from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'first_name', 'last_name', 'email')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('pk', 'post', 'question', 'refans')


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('pk', 'name', 'admin')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('pk', 'question', 'answer',
                  'score1', 'score2', 'systemscore')


class AnsweredQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnsweredQuestions
        fields = ('pk', 'student', 'question', 'date')


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ('pk', 'student', 'answer')
