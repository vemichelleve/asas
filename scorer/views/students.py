from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from scorer.models import Student, Admin, User
from scorer.serializers import *

# Create your views here.
@api_view(['GET'])
def students_list(request):
    students = Student.objects.all()
    serializer = StudentSerializer(
        students, context={'request': request}, many=True)

    return Response({'data': serializer.data})
