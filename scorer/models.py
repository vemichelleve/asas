from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)


class Admin(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.username
    
    def get_pk(self):
        return self.user.pk


class Post(models.Model):
    admin = models.ForeignKey(
        Admin, on_delete=models.CASCADE, related_name='post')
    name = models.CharField("Name", max_length=255)

    def __str__(self):
        return self.name

    def get_admin(self):
        return self.admin.get_pk()


class Question(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='questions')
    question = models.TextField("Question")
    refans = models.TextField("Reference anser")

    def __str__(self):
        return self.question


class Student(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
    questions = models.ManyToManyField(Question, through='AnsweredQuestions')

    def __str__(self):
        return self.user.username


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name='answers')
    answer = models.TextField('Answer')
    score1 = models.FloatField('Score 1', null=True)
    score2 = models.FloatField('Score 2', null=True)
    systemscore = models.FloatField('System score', null=True)

    def __str__(self):
        return self.answer


class AnsweredQuestions(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='answered_questions')
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name='answered_questions')
    date = models.DateTimeField(auto_now_add=True)


class StudentAnswer(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='question_answers')
    answer = models.ForeignKey(
        Answer, on_delete=models.CASCADE, related_name='+')
