from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Max

from .models import *
from .serializers import *
from .model.main import *

import csv
import re


# User sign up page
class UserSignUpView(APIView):
    def post(self, request, format=None):
        user = request.data
        # Account created only if email and username is not used
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


# User log in page
class UserLoginView(APIView):
    def get_object(self, data):
        try:
            return User.objects.get(username=data)
        except:
            return None

    def post(self, request, format=None):
        data = request.data
        generaluser = self.get_object(data['username'])
        # If user is found
        if generaluser is not None:
            # Check if user is registered as admin or student
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
            # If user is authenticated (i.e. password is correct)
            if user is not None:
                login(request, user)
                return Response({'message': 'Login successful', 'status': 1})
            else:
                return Response({'message': 'Wrong password', 'status': 0})
        else:
            return Response({'message': 'User not found', 'status': 0})


# Student list in admin page
class StudentListView(APIView):
    def get(self, request, format=None):
        # Retrieve all students
        students = User.objects.all().filter(is_student=True)
        # Check if queryset empty
        if students is not None:
            serializer = UserSerializer(
                students, context={'request': request}, many=True)
            return Response({'message': 'Students retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'Students not found', 'status': 0})


# Student details in admin page
class StudentDetailsView(APIView):
    def get_student(self, pk):
        try:
            return User.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk, format=None):
        student = self.get_student(pk)
        # Check if student exists
        if student is not None:
            serializer = UserSerializer(student, context={'request': request})
            return Response({'message': 'Student fount', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'Student not found', 'status': 0})


# Question list in admin and student page
class QuestionListView(APIView):
    def get_object(self):
        try:
            return Question.objects.all()
        except:
            return None

    def get(self, request, format=None):
        # Retrieve all questions
        questions = self.get_object()
        if questions is not None:
            serializer = QuestionSerializer(
                questions, context={'request': request}, many=True)
            return Response({'message': 'Questions retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'No questions available', 'status': 0})


# Add question manually
class AddManualQuestionView(APIView):
    def post(self, request, format=None):
        user = User.objects.get(username='admin')  # TODO: Logged in user!
        admin = Admin.objects.get(user=user)
        # Add question to 'Manually added' post
        if not Post.objects.filter(name='Manually added').exists():
            post = Post(admin=admin, name='Manually added').save()
        else:
            post = Post.objects.get(name='Manually added')
        # Check if question already exists
        if not Question.objects.filter(question=request.data['question']).exists():
            question = Question(
                post=post, question=request.data['question'], refans=request.data['refans']).save()
            return Response({'message': 'Question added', 'status': 1})
        else:
            return Response({'message': 'Question already exists', 'status': 0})


# Question details in admin and student page
class QuestionDetailsView(APIView):
    def get_question(self, pk):
        try:
            return Question.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk, format=None):
        # Retrieve question
        question = self.get_question(pk)
        # Check if question exists
        if question is not None:
            serializer = QuestionSerializer(
                question, context={'request': request})
            return Response({'message': 'Question retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'Question not found', 'status': 0})


# Post list in admin page
class PostListView(APIView):
    def get_posts(self):
        try:
            return Post.objects.all()
        except:
            return None

    def get(self, request, format=None):
        # Retrieve all posts
        posts = self.get_posts()
        # Check if posts exist
        if posts is not None:
            serializer = PostSerializer(
                posts, context={'request': request}, many=True)
            users = User.objects.all()
            userSerializer = UserSerializer(
                users, context={'request': request}, many=True)
            return Response({'message': 'Posts retrieved', 'status': 1, 'data': serializer.data, 'users': userSerializer.data})
        else:
            return Response({'message': 'No posts found', 'status': 0})


# Post details in admin page
class PostDetailsView(APIView):
    def get_question(self, post):
        try:
            return Question.objects.filter(post=post)
        except:
            return None

    def get_post(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except:
            return None

    def get_admin(self, post):
        try:
            return User.objects.get(pk=post.get_admin())
        except:
            return None

    def get(self, request, pk, format=None):
        # Retrieve post
        post = self.get_post(pk)
        # Check if post exists
        if post is not None:
            # Retrieve admin who created the post
            admin = self.get_admin(post)
            # If admin is found
            if admin is not None:
                adminSerializer = UserSerializer(
                    admin, context={'request': request})
            # Retrieve questions belong to the post
            questions = self.get_question(post)
            postSerializer = PostSerializer(post, context={'request': request})
            # Check if post contains questions
            if questions is not None:
                questionSerializer = QuestionSerializer(
                    questions, context={'request': request}, many=True)
                return Response({'message': 'Post and questions retrieved', 'status': 2, 'post': postSerializer.data, 'admin': adminSerializer.data, 'questions': questionSerializer.data})
            else:
                return Response({'message': 'Post retrieved, no questions', 'status': 1, 'post': postSerializer.data, 'admin': adminSerializer.data})
        else:
            return Response({'message': 'Post not found', 'status': 0})


# Answer action in student page
class AnswerView(APIView):
    def post(self, request, pk, format=None):
        answer = request.data['answer']
        user = User.objects.get(username='vemichelleve')  # TODO: Logged in user!
        # Retrieve student and question object
        student = Student.objects.get(user=user)
        question = Question.objects.get(pk=pk)
        # Check whether student has answered the question
        if not (AnsweredQuestions.objects.filter(student=student, question=question).exists()):
            # Add question to the list of answered questions and list of questions in student object (many-to-many through)
            student.questions.add(question)
            student.save()
            # Create answer object
            ans = Answer.objects.create(
                question=question, answer=answer)
            ans.save()
            # Create student answer object
            StudentAnswer.objects.create(
                student=student, answer=ans).save()
            return Response({'message': 'Question answered', 'status': 1})
        else:
            return Response({'message': 'Question is already answered', 'status': 0})

    def get_question(self, pk):
        try:
            return Question.objects.get(pk=pk)
        except:
            return None

    def get_answers(self, question):
        try:
            return Answer.objects.filter(question=question)
        except:
            return None

    def get(self, request, pk, format=None):
        question = self.get_question(pk)
        if question is not None:
            answers = self.get_answers(question)
            if answers is not None:
                answerSerializer = AnswerSerializer(
                    answers, context={'request': request}, many=True)
                studnetans = StudentAnswer.objects.none()
                for x in answers:
                    studnetans |= StudentAnswer.objects.filter(answer=x)
                studentansSerializer = StudentAnswerSerializer(
                    studnetans, context={'request': request}, many=True)
                return Response({'message': 'Answers retrieved', 'status': 1, 'answers': answerSerializer.data, 'students': studentansSerializer.data, 'max': answers.aggregate(Max('pk'))})
            else:
                return Response({'message': 'No answer for this question', 'status': 0})
        else:
            return Repsonse({'message': 'Question not found', 'status': 0})


# Retrieve answers by student
class AnswersView(APIView):
    def get(self, request, format=None):
        user = User.objects.get(username='vemichelleve')  # TODO: Logged in user!
        # Retrieve student and student answer
        student = Student.objects.get(user=user)
        studentans = StudentAnswer.objects.filter(student=student)
        # Create queryset of answers by logged in student
        answers = Answer.objects.none()
        for x in studentans:
            answers |= Answer.objects.filter(answer=x.answer)
        serializer = AnswerSerializer(
            answers, context={'request': request}, many=True)
        return Response({'message': 'Answers retrieved', 'status': 1, 'data': serializer.data})


# Student account details
class StudentAccountView(APIView):
    def get(self, request, format=None):
        user = User.objects.get(username='vemichelleve')  # TODO: Logged in user!
        serializer = UserSerializer(user, context={'request': request})
        return Response({'message': 'Details retreived', 'data': serializer.data})


# Edit student account
class StudentEditAccountView(APIView):
    def put(self, request, format=None):
        # Retrieve student
        student = User.objects.get(username='vemichelleve')  # TODO: Logged in user!
        # Check if student exists
        if student is not None:
            serializer = UserSerializer(
                student, data=request.data, context={'request': request})
            # If data is valid, make changes
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Changes successfully saved!', 'status': 1})
            else:
                return Response({'message': 'Data is not valid', 'status': 0})
        else:
            return Response({'message': 'Student not found', 'status': 0})


class ScoreAnswerView(APIView):
    def get_answer(self, pk):
        try:
            return Answer.objects.get(pk=pk)
        except:
            return None

    def put(self, request, format=None):
        score1 = request.data['score1']
        score2 = request.data['score2']
        stat1 = False
        stat2 = False
        for x in range(0, len(score1)):
            if score1[x] is not None:
                answer = self.get_answer(x)
                if answer is not None:
                    data = {'score1': score1[x]}
                    serializer = AnswerSerializer(
                        answer, data=data, context={'request': request}, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        stat1 = True
            if score2[x] is not None:
                answer = self.get_answer(x)
                if answer is not None:
                    data = {'score2': score2[x]}
                    serializer = AnswerSerializer(
                        answer, data=data, context={'request': request}, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        stat2 = True
        if stat1 and stat2:
            return Response({'message': 'Scores successfully saved', 'status': 1})
        elif stat1 and not stat2:
            return Response({'message': 'Score 1 successfully saved', 'status': 1})
        elif not stat1 and stat2:
            return Response({'message': 'Score 2 successfully saved', 'status': 1})
        else:
            return Response({'message': 'Scores not saved', 'status': 0})


class AddAutoQuestionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        user = User.objects.get(username='admin')  # TODO: Logged in user!
        admin = Admin.objects.get(user=user)
        name = request.data['post']
        alluploaded = True
        if not Post.objects.filter(name=name).exists():
            post = Post(admin=admin, name=name)
            post.save()
        else:
            post = Post.objects.get(name=name)
        fileobj = request.data['file']
        for line in fileobj:
            arr = re.compile(
                '(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))').split(line.decode('utf-8'))
            arr = list(filter(None, arr))
            question = arr[0].replace('"', '')
            refans = arr[1].replace('"', '')
            if not Question.objects.filter(question=question).exists():
                question = Question(
                    post=post, question=question, refans=refans).save()
        return Response({'message': 'Questions added', 'status': 1})


class QuestionbyUserView(APIView):
    def get_student(self, pk):
        try:
            return Student.objects.get(user=pk)
        except:
            return None

    def get_questions(self):
        try:
            return Question.objects.all()
        except:
            return None

    def get(self, request, pk, format=None):
        student = self.get_student(pk)
        if student is not None:
            serializer = StudentSerializer(
                student, context={'request': request})
            questions = self.get_questions()
            qnSerializer = QuestionSerializer(
                questions, context={'request': request}, many=True)
            return Response({'message': 'try', 'status': 1, 'data': serializer.data, 'questionlist': qnSerializer.data})
        return Response({'message': 'fail', 'status': 0})


class ProcessData(APIView):
    def get_question(self):
        try:
            return Question.objects.all()
        except:
            return None

    def get_answers(self, pk):
        try:
            return Answer.objects.filter(question=pk)
        except:
            return None

    def get(self, request, format=None):
        questions = self.get_question()  # TODO: change question pk!
        answers = self.get_answers(10)  # TODO: change question pk!

        buildmodel(questions, answers)

        if answers is not None:
            serializer = AnswerSerializer(
                answers, context={'request': request}, many=True)
        return Response({'message': 'try', 'answers': serializer.data})
