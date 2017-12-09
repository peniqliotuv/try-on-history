from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
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

user_profile_list = views.UserProfileViewSet.as_view({
    'get': 'list',
})

user_profile_detail = views.UserProfileViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})

urlpatterns = [
    url(r'^jwt-auth/$', obtain_jwt_token),
    url(r'^jwt-auth-refresh/$', refresh_jwt_token),
    url(r'^schema/$', schema_view),
    url(r'^items/$', item_list, name='item-list'),
    url(r'^items/(?P<pk>[0-9]+)/$', item_detail, name='item-detail'),
    url(r'^users/$', user_profile_list, name='user-profile-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_profile_detail, name='user-profile-detail')
]

urlpatterns = format_suffix_patterns(urlpatterns)
