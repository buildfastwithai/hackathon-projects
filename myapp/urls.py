from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('response/', views.response, name='response'),
    path('roadmap/', views.roadmap, name='roadmap'),
    path('test/', views.test, name='test'),
    
    
]
