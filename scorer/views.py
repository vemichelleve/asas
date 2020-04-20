import re

from asas.pagination import CustomPagination
from django.contrib.auth import login, authenticate
from django.db import transaction
from django.db.models import Max
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .model.main import *
from .serializers import *


class UserSignUpView(APIView):
    def post(self, request, format=None):
        user = request.data
        if not (User.objects.filter(email=user['email']).exists() or User.objects.filter(
                username=user['username']).exists()):
            userobj = User.objects.create_user(user['username'], user['email'], user['password'],
                                               first_name=user['first_name'],
                                               last_name=user['last_name'], is_student=user['is_student'],
                                               is_admin=user['is_admin'])
            userobj.save()
            if user['is_admin']:
                Admin.objects.create(user=userobj)
            if user['is_student']:
                Student.objects.create(user=userobj)
            return Response({'message': 'Account successfully created!', 'status': 1})
        else:
            return Response({'message': 'There was an error', 'status': 0})


class UserLoginView(APIView):
    def post(self, request, format=None):
        data = request.data
        try:
            generaluser = User.objects.get(username=data['username'])
        except:
            generaluser = None

        if generaluser is not None:
            if data['is_admin']:
                if Admin.objects.filter(user=generaluser).exists():
                    return Response({'message': 'User found!', 'status': 1})
            elif data['is_student']:
                try:
                    student = Student.objects.get(user=user)
                except:
                    student = None

                if student is not None:
                    if student.get_approved():
                        return Response({'message': 'User found!', 'status': 1})
                    else:
                        return Response({'message': 'Not approved', 'status': 0})
        return Response({'message': 'User not found', 'status': 0})


class StudentListView(GenericAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(is_student=True)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            data = result.data
        else:
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data

        payload = {
            'return_code': '0000',
            'return_message': 'Success',
            'data': data
        }

        if len(queryset) > 0:
            return Response({'message': 'Students retrieved', 'status': 1, 'data': data})
        else:
            return Response({'message': 'Students not found', 'status': 0})


class StudentDetailsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        try:
            student = User.objects.get(pk=pk)
        except:
            student = None

        if student is not None:
            serializer = UserSerializer(student, context={'request': request})
            return Response({'message': 'Student fount', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'Student not found', 'status': 0})


class QuestionListView(GenericAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            data = result.data
        else:
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data

        payload = {
            'return_code': '0000',
            'return_message': 'Success',
            'data': data
        }

        return Response({'status': 1, 'data': data, 'message': 'Questions retrieved'})


class AddManualQuestionView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        admin = Admin.objects.get(user=request.user)
        try:
            post = Post.objects.get(name=data['post'])
        except:
            post = None

        if post is None:
            post = Post(admin=admin, name=request.data['post'])
            post.save()

        if not Question.objects.filter(question=request.data['question']).exists():
            question = Question(
                post=post, question=request.data['question'], refans=request.data['refans'])
            question.save()
            return Response({'message': 'Question added', 'status': 1})
        else:
            return Response({'message': 'Question already exists', 'status': 0})


class QuestionDetailsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        try:
            question = Question.objects.get(pk=pk)
        except:
            question = None

        if question is not None:
            serializer = QuestionSerializer(
                question, context={'request': request})
            return Response({'message': 'Question retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'Question not found', 'status': 0})


class PostListView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            data = result.data
        else:
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data

        payload = {
            'return_code': '0000',
            'return_message': 'Success',
            'data': data
        }

        if len(queryset) > 0:
            users = User.objects.all()
            userSerializer = UserSerializer(
                users, context={'request': request}, many=True)
            return Response({'message': 'Posts retrieved', 'status': 1, 'data': data, 'users': userSerializer.data})
        else:
            return Response({'message': 'No posts found', 'status': 0})


class PostDetailsView(GenericAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        try:
            post = Post.objects.get(pk=pk)
        except:
            post = None

        if post is not None:
            postSerializer = PostSerializer(post, context={'request': request})
            admin = User.objects.get(pk=post.get_admin())
            adminSerializer = UserSerializer(
                admin, context={'request': request})

            queryset = self.filter_queryset(self.get_queryset())
            queryset = queryset.filter(post=post)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                result = self.get_paginated_response(serializer.data)
                data = result.data
            else:
                serializer = self.get_serializer(queryset, many=True)
                data = serializer.data

            payload = {
                'return_code': '0000',
                'return_message': 'Success',
                'data': data
            }

            if len(queryset) > 0:
                return Response({'message': 'Post and questions retrieved', 'status': 2, 'post': postSerializer.data,
                                 'admin': adminSerializer.data, 'data': data})
            else:
                return Response({'message': 'Post retrieved, no questions', 'status': 1, 'post': postSerializer.data,
                                 'admin': adminSerializer.data})
        else:
            return Response({'message': 'Post not found', 'status': 0})


class AnswerView(GenericAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, format=None):
        answer = request.data['answer']
        student = Student.objects.get(user=request.user)
        question = Question.objects.get(pk=pk)

        if not (AnsweredQuestions.objects.filter(student=student, question=question).exists()):
            student.questions.add(question)
            student.save()
            ans = Answer.objects.create(
                question=question, answer=answer)
            ans.save()

            StudentAnswer.objects.create(
                student=student, answer=ans).save()
            return Response({'message': 'Question answered', 'status': 1})
        else:
            return Response({'message': 'Question is already answered', 'status': 0})

    def get(self, request, pk, format=None):
        try:
            question = Question.objects.get(pk=pk)
        except:
            question = None

        if question is not None:
            queryset = self.filter_queryset(self.get_queryset())
            queryset = queryset.filter(question=question)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                result = self.get_paginated_response(serializer.data)
                data = result.data
            else:
                serializer = self.get_serializer(queryset, many=True)
                data = serializer.data

            payload = {
                'return_code': '0000',
                'return_message': 'Success',
                'data': data
            }

            if queryset is not None:
                studnetans = StudentAnswer.objects.none()
                for x in queryset:
                    studnetans |= StudentAnswer.objects.filter(answer=x)

                studentansSerializer = StudentAnswerSerializer(
                    studnetans, context={'request': request}, many=True)
                return Response(
                    {'message': 'Answers retrieved', 'status': 1, 'data': data, 'students': studentansSerializer.data,
                     'max': queryset.aggregate(Max('pk'))})
            else:
                return Response({'message': 'No answer for this question', 'status': 0})
        else:
            return Repsonse({'message': 'Question not found', 'status': 0})


class AnswersView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        student = Student.objects.get(user=request.user)
        studentans = StudentAnswer.objects.filter(student=student)

        answers = Answer.objects.none()
        for x in studentans:
            answers |= Answer.objects.filter(answer=x.answer)

        serializer = AnswerSerializer(
            answers, context={'request': request}, many=True)

        return Response({'message': 'Answers retrieved', 'status': 1, 'data': serializer.data})


class StudentAccountView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response({'message': 'Details retreived', 'data': serializer.data})


class StudentEditAccountView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        serializer = UserSerializer(
            user.request, data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Changes successfully saved!', 'status': 1})
        else:
            return Response({'message': 'Data is not valid', 'status': 0})


class ScoreAnswerView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

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
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        admin = Admin.objects.get(user=request.user)
        name = request.data['post']
        alluploaded = True
        count = 0

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
            try:
                refans = arr[1].replace('"', '')
            except IndexError:
                msg = 'Error! No reference answer. ' + \
                      str(count) + ' questions added.'
                return Response({'message': msg, 'status': 0})
            if not Question.objects.filter(question=question, refans=refans, post=post).exists():
                Question(
                    post=post, question=question, refans=refans).save()
                count += 1
            else:
                alluploaded = False
            msg = str(count) + ' questions added'

        if alluploaded:
            msg = 'All questions uploaded. ' + msg
        else:
            msg = 'Not all questions uploaded. ' + msg

        return Response({'message': msg, 'status': 1})


class QuestionbyUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        try:
            student = Student.objects.get(user=pk)
        except:
            student = None

        if student is not None:
            serializer = StudentSerializer(
                student, context={'request': request})

            questions = Question.objects.all()
            qnSerializer = QuestionSerializer(
                questions, context={'request': request}, many=True)

            return Response({'message': 'try', 'status': 1, 'data': serializer.data, 'questionlist': qnSerializer.data})
        return Response({'message': 'fail', 'status': 0})


class TrainModel(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        questions = Question.objects.all()
        answers = Answer.objects.filter(score1__isnull=False)
        answers = answers.filter(score2__isnull=False)

        metrics, model, tokenizer, df_test, scaler = buildmodel(
            questions, answers)

        for metric in metrics:
            name = metric['metric']
            value = metric['value']
            if not Metrics.objects.filter(name=name).exists():
                metricobj = Metrics.objects.create(name=name, value=value)
                metricobj.save()
            else:
                metric = Metrics.objects.get(name=name)
                data = {'value': value}

                serializer = MetricsSerializer(metric, data=data, context={
                    'request': request}, partial=True)
                if serializer.is_valid():
                    serializer.save()

        result = score(df_test, model, tokenizer, scaler)

        index = 0
        if len(result) == len(answers):
            print('========== Uploading scores ==========')
            with transaction.atomic():
                for ans in answers:
                    print(str(round(index / len(result) * 100, 1)) + '%')

                    data = {'systemscore': result[index]}
                    serializer = AnswerSerializer(ans, data=data, context={
                        'request': request}, partial=True)
                    if serializer.is_valid():
                        serializer.save()

                    index += 1
            print('========== Upload done ==========')
            return Response({'message': 'Model successfully trained'})
        else:
            return Response({'message': 'Result not uploaded'})

    def get(self, request, format=None):
        metrics = Metrics.objects.all()

        if metrics is not None:
            serializer = MetricsSerializer(
                metrics, context={'request': request}, many=True)
            return Response({'message': 'Metrics retrieved', 'status': 1, 'data': serializer.data})
        else:
            return Response({'message': 'No metrics found', 'status': 0})


class AddAutoAnswers(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, format=None):
        user = User.objects.get(username='auto')
        student = Student.objects.get(user=user)
        qn = Question.objects.get(pk=pk)
        questions = Question.objects.filter(question=str(qn))

        fileobj = request.data['file']
        count = 0
        for line in fileobj:
            arr = re.compile(
                '(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))').split(line.decode('utf-8'))
            arr = list(filter(None, arr))
            answer = arr[0].replace('"', '')

            # TODO: fix below
            if len(arr) > 2 and arr[2] != '':
                score1 = float(arr[1])
                score2 = float(arr[2])
            else:
                score1 = float(arr[1])
                score2 = float(arr[1])

            for question in questions:
                if not Answer.objects.filter(question=question, answer=answer).exists():
                    student.questions.add(question)
                    student.save()

                    ans = Answer.objects.create(
                        question=question, answer=answer, score1=score1, score2=score2)
                    ans.save()
                    StudentAnswer.objects.create(
                        student=student, answer=ans).save()

                    count += 1

        msg = str(count) + ' answers added.'

        if count > 0:
            return Response({'message': msg, 'status': 1})
        else:
            msg = msg + ' Answers already exist.'
            return Response({'message': msg, 'status': 1})


class AddAnyAnswers(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = User.objects.get(username='auto')
        student = Student.objects.get(user=user)

        fileobj = request.data['file']
        count = 0

        for line in fileobj:
            arr = re.compile(
                '(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))').split(line.decode('utf-8'))
            arr = list(filter(None, arr))
            qn = arr[0].replace('"', '')
            answer = arr[1].replace('"', '')

            # TODO: accept more than one score
            score1 = float(arr[2])
            score2 = float(arr[2])
            questions = Question.objects.filter(question=qn)

            for question in questions:
                if not Answer.objects.filter(question=question, answer=answer).exists():
                    student.questions.add(question)
                    student.save()

                    ans = Answer.objects.create(
                        question=question, answer=answer, score1=score1, score2=score2)
                    ans.save()
                    StudentAnswer.objects.create(
                        student=student, answer=ans).save()

                    count += 1

        msg = str(count) + ' answers added.'

        if count > 0:
            return Response({'message': msg, 'status': 1})
        else:
            msg = msg + ' Answers already added.'
            return Response({'message': msg, 'status': 1})


class AnswerListView(GenericAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            data = result.data
        else:
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data

        payload = {
            'return_code': '0000',
            'return_message': 'Success',
            'data': data
        }

        return Response({'status': 1, 'data': data, 'message': 'Answers retrieved'})


class StudentApprovedView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        try:
            student = Student.objects.get(user=request.data['data'])
        except:
            student = None

        if student is not None:
            data = {'approved': True}
            serializer = StudentSerializer(
                student, context={'request': request}, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Student successfully approved'})
            else:
                return Response({'message': 'Failed to approve student'})
        else:
            return Response({'message': 'Student not found'})

    def get(self, request, format=None):
        students = Student.objects.all()
        if students is not None:
            serializer = StudentSerializer(
                students, context={'request': request}, many=True)
            return Response({'message': 'Approved list retrieved', 'data': serializer.data})
        else:
            return Response({'message': 'Students not found'})


class StudentUpdatePasswordView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        data = request.data
        if authenticate(username=request.user, password=data['oldpass']) is not None:
            user = request.user
            user.set_password(request.data['newpass'])
            user.save()
            return Response({'message': 'Password successfully updated', 'status': 1})
        else:
            return Repsonse({'message': 'Failed to update password', 'status': 0})
