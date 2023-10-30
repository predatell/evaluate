from django.urls import reverse
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APITestCase
from evaluate.models import Expression


class AuthorizationTests(APITestCase):
    list_url = reverse('expression-list')

    def test_unauthorized(self):
        """
        Check unauthorized.
        """
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorized(self):
        """
        Check success authentication.
        """
        User.objects.create_user('test', 'test@test.com', 'test')
        self.client.login(username='test', password='test')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_obtain_pair_with_wrong_password(self):
        """
        Check token_obtain_pair with wrong password.
        """
        User.objects.create_user('test', 'test@test.com', 'test')
        self.client.login(username='test', password='test')
        data = {'username': 'test', 'password': 'test1'}
        response = self.client.post(reverse("token_obtain_pair"), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_obtain_pair(self):
        """
        Check token_obtain_pair.
        """
        User.objects.create_user('test', 'test@test.com', 'test')
        self.client.login(username='test', password='test')
        data = {'username': 'test', 'password': 'test'}
        response = self.client.post(reverse("token_obtain_pair"), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.data.keys())


class RegistrationTests(APITestCase):
    register_url = reverse('auth_register')

    def test_get_method(self):
        """
        Check get method for registration end point.
        """
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_registration(self):
        """
        Check new user registration.
        """
        data = {
            'username': "new_user",
            'password': "new_user",
            'password2': "new_user",
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_not_confirmed_password(self):
        """
        Check not confirmed password.
        """
        data = {
            'username': "new_user",
            'password': "new_user",
            'password2': "another",
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data.keys())


class ExpressionSuccessTests(APITestCase):
    list_url = reverse('expression-list')
    field_name = "expression"

    def setUp(self):
        User.objects.create_user('test', 'test@test.com', 'test')
        self.client.login(username='test', password='test')

    def check_success_response(self, expression, result):
        data = {self.field_name: expression}
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Expression.objects.count(), 1)
        self.assertEqual(Expression.objects.get().result, result)

    def test_simple_expression(self):
        """
        Simple check.
        """
        self.check_success_response('2 + 2', "4")
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Expression.objects.count(), 1)

    def test_binary_operators_expression(self):
        """
        Check binary operators.
        """
        self.check_success_response('8 / 2 + 2 * 3 - 1', "9.0")

    def test_len_expression(self):
        """
        Check unary operator len.
        """
        expression = 'len("test") + 2'
        self.check_success_response(expression, "6")

    def test_abs_expression(self):
        """
        Check unary operator abs.
        """
        expression = 'abs(5 - 10) + 2'
        self.check_success_response(expression, "7")


class ExpressionValidationTests(APITestCase):
    list_url = reverse('expression-list')
    field_name = "expression"
    name_error_template = "The use of '%s' is not allowed"
    zero_division_error = "division by zero"
    syntax_error = "invalid decimal literal"

    def setUp(self):
        User.objects.create_user('test', 'test@test.com', 'test')
        self.client.login(username='test', password='test')

    def check_validation_response(self, expression, error_message=None):
        data = {self.field_name: expression}
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Expression.objects.count(), 0)
        if error_message:
            self.assertEqual(response.data[self.field_name][0], error_message)
        return response

    def test_name_error(self):
        wrong_data = "asd"
        expression = '%s + 2' % wrong_data
        error_message = self.name_error_template % wrong_data
        self.check_validation_response(expression, error_message)

    def test_division_by_zero_error(self):
        expression = '2 / 0'
        self.check_validation_response(expression, self.zero_division_error)

    def test_syntax_error(self):
        expression = '2 / 2sd'
        response = self.check_validation_response(expression)
        self.assertContains(response, self.syntax_error, status_code=status.HTTP_400_BAD_REQUEST)
        self.assertIn(self.syntax_error, response.data[self.field_name][0])

    def test_not_allowed(self):
        expression = '().__class__.__base__.__subclasses__()'
        error_message = self.name_error_template % "__class__"
        self.check_validation_response(expression, error_message)
