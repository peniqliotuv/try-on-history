from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from . import views


urlpatterns = [
    url(r'^items/$', views.ItemList.as_view(), name='item-list'),
    url(r'^items/(?P<pk>[0-9]+)/$', views.ItemDetail.as_view(), name='item-detail')
]

urlpatterns = format_suffix_patterns(urlpatterns)
