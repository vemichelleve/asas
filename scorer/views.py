from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import *
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

        serializer = UserSerializer(student, context={'request': request})
        return Response({'message': 'Student fount', 'status': 1, 'data': serializer.data})


class QuestionListView(APIView):
    def get_object(self):
        try:
            return Question.objects.all()
        except:
            return None

    def get(self, request, format=None):
        questions = self.get_object()
        if questions is not None:
            serializer = QuestionSerializer(
                questions, context={'request': request}, many=True)
            return Response({'message': 'Questions retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'No questions available', 'status': 0})


class AddManualQuestionView(APIView):
    def post(self, request, format=None):
        user = User.objects.get(username='admin')  # Logged in user!
        admin = Admin.objects.get(user=user)
        if not Post.objects.filter(name='Manually added').exists():
            post = Post(admin=admin, name='Manually added').save()
        else:
            post = Post.objects.get(name='Manually added')
        if not Question.objects.filter(question=request.data['question']).exists():
            question = Question(
                post=post, question=request.data['question'], refans=request.data['refans']).save()
            return Response({'message': 'Question added', 'status': 1})
        else:
            return Response({'message': 'Question already exists', 'status': 0})


class QuestionDetailsView(APIView):
    def get(self, request, pk, format=None):
        try:
            question = Question.objects.get(pk=pk)
        except:
            return Response({'message': 'Question not found', 'status': 0})
        serializer = QuestionSerializer(question, context={'request': request})
        return Response({'message': 'Question retrieved', 'status': 1, 'data': serializer.data})


class PostListView(APIView):
    def get(self, request, format=None):
        try:
            posts = Post.objects.all()
        except:
            return Response({'message': 'No posts found', 'status': 0})
        serializer = PostSerializer(
            posts, context={'request': request}, many=True)
        return Response({'message': 'Posts retrieved', 'status': 1, 'data': serializer.data})


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
        post = self.get_post(pk)
        if post is None:
            return Response({'message': 'Post not found', 'status': 0})
        else:
            admin = self.get_admin(post)
            if admin is not None:
                adminSerializer = UserSerializer(
                    admin, context={'request': request})
            questions = self.get_question(post)
            postSerializer = PostSerializer(post, context={'request': request})
            if questions is None:
                return Response({'message': 'Post retrieved, no questions', 'status': 1, 'post': postSerializer.data, 'admin': adminSerializer.data})
            else:
                questionSerializer = QuestionSerializer(
                    questions, context={'request': request}, many=True)
                return Response({'message': 'Post and questions retrieved', 'status': 2, 'post': postSerializer.data, 'admin': adminSerializer.data, 'questions': questionSerializer.data})


class AnswerView(APIView):
    def get(self, request, pk, format=None):
        answers = Answer.objects.all()
        answeredquestions = AnsweredQuestions.objects.all()
        studentanswer = StudentAnswer.objects.all()
        ansSerializer = AnswerSerializer(
            answers, context={'request': request}, many=True)
        aqSerializer = AnsweredQuestionsSerializer(
            answeredquestions, context={'request': request}, many=True)
        saSerializer = StudentAnswerSerializer(
            studentanswer, context={'request': request}, many=True)
        return Response({'message': 'try', 'answer': ansSerializer.data, 'answered questions': aqSerializer.data, 'student answer': saSerializer.data})

    def post(self, request, pk, format=None):
        answer = request.data['answer']
        user = User.objects.get(username='vemichelleve')  # Logged in user!
        student = Student.objects.get(user=user)
        question = Question.objects.get(pk=pk)
        if not (AnsweredQuestions.objects.filter(student=student, question=question).exists()):
            student.questions.add(question)
            student.save()
            ans = Answer.objects.create(
                question=question, answer=answer)
            ans.save()
            StudentAnswer.objects.create(student=student, answer=ans).save()
            return Response({'message': 'Question answered', 'status': 1})
        else:
            return Response({'message': 'Question is already answered', 'status': 0})


class AnswersView(APIView):
    def get(self, request, format=None):
        user = User.objects.get(username='vemichelleve')  # Logged in user!
        student = Student.objects.get(user=user)
        studentans = StudentAnswer.objects.filter(student=student)

        answers = Answer.objects.none()
        for x in studentans:
            answers |= Answer.objects.filter(answer=x.answer)

        serializer = AnswerSerializer(
            answers, context={'request': request}, many=True)
        return Response({'message': 'Answers retrieved', 'status': 1, 'data': serializer.data})


class StudentAccountView(APIView):
    def get(self, request, format=None):
        user = User.objects.get(username='vemichelleve')  # Logged in user!
        serializer = UserSerializer(user, context={'request': request})
        return Response({'message': 'Details retreived', 'data': serializer.data})


class StudentEditAccountView(APIView):
    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except:
            return None

    def put(self, request, pk, format=None):
        student = self.get_user(pk)
        serializer = UserSerializer(
            student, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Changes saved', 'status': 1})
        else:
            return Response({'message': 'Data is not valid', 'status': 0})
