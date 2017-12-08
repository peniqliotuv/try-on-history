from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.schemas import get_schema_view
from . import views

schema_view = get_schema_view(title='Schema Overview')

item_list = views.ItemViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

item_detail = views.ItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})

urlpatterns = [
    url(r'^login/$', views.login),
    url(r'^schema/$', schema_view),
    url(r'^items/$', item_list, name='item-list'),
    url(r'^items/(?P<pk>[0-9]+)/$', item_detail, name='item-detail'),
    url(r'^users/$', views.UserProfileList.as_view(), name='user-profile-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserProfileDetail.as_view(), name='user-profile-detail')
]

urlpatterns = format_suffix_patterns(urlpatterns)
