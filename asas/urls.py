"""asas URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from scorer import views

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^signup/$', views.UserSignUpView.as_view()),
    url(r'^accounts/login/$', views.UserLoginView.as_view()),
    url(r'^students/$', views.StudentListView.as_view()),
    url(r'^students/(?P<pk>[0-9]+)$', views.StudentDetailsView.as_view()),
    url(r'^addquestion/manual/$', views.AddManualQuestionView.as_view()),
    url(r'^questions/$', views.QuestionListView.as_view()),
    url(r'^questions/(?P<pk>[0-9]+)$', views.QuestionDetailsView.as_view()),
    url(r'^posts/$', views.PostListView.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)$', views.PostDetailsView.as_view()),
    url(r'^answers/(?P<pk>[0-9]+)$', views.AnswerView.as_view()),
    url(r'^answers/$', views.AnswersView.as_view()),
    url(r'^accounts/student/$', views.StudentAccountView.as_view()),
    url(r'^accounts/student/edit/$', views.StudentEditAccountView.as_view()),
    url(r'^score/$', views.ScoreAnswerView.as_view()),
    url(r'^addquestion/auto/$', views.AddAutoQuestionView.as_view()),
    url(r'^questions/user/(?P<pk>[0-9]+)$',
        views.QuestionbyUserView.as_view()),
    url(r'^model/train/$', views.TrainModel.as_view()),
    url(r'^model/metrics/$', views.ModelMetrics.as_view()),
]
