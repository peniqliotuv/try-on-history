from django.conf.urls import url
from django.conf import settings
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.schemas import get_schema_view
from rest_framework_swagger.views import get_swagger_view
from . import views

schema_view = get_schema_view(title='Schema Overview')
swagger_view = get_swagger_view(title='Swagger')
'''
GET: Retrieve information about all items
POST: Post information about the item (can only be redirected to)
'''
item_list = views.ItemViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

'''
GET: Retrieve infromation about specific item
'''
item_detail = views.ItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})

item_detail_offers = views.ItemViewSet.as_view({
    'get': 'offers',
})

user_profile_list = views.UserProfileViewSet.as_view({
    'get': 'list',
    'post': 'create_profile',
})

user_profile_detail = views.UserProfileViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})

history_list = views.HistoryViewSet.as_view({
    'get': 'list',
})

history_detail = views.HistoryViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy',
    'put': 'update',
})

urlpatterns = [
    url(r'^jwt-auth/$', obtain_jwt_token, name='jwt-auth'),
    url(r'^jwt-auth-refresh/$', refresh_jwt_token, name='jwt-auth-refresh'),
    url(r'^jwt-auth-verify/$', verify_jwt_token, name='jwt-auth-verify'),
    url(r'^items/$', item_list, name='item-list'),
    url(r'^items/(?P<pk>[0-9]+)/$', item_detail, name='item-detail'),
    url(r'^items/(?P<pk>[0-9]+)/offers/$', item_detail_offers, name='item-detail-offers'),
    url(r'^history/$', history_list, name='history-list'),
    url(r'^history/(?P<pk>[0-9]+)/$', history_detail, name='history-detail'),
    url(r'^users/$', user_profile_list, name='user-profile-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_profile_detail, name='user-profile-detail')
]

if settings.DEBUG:
    urlpatterns += [
        url(r'^schema/$', schema_view),
        url(r'^swagger/$', swagger_view)
    ]

urlpatterns = format_suffix_patterns(urlpatterns)
