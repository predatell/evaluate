from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

from .utils import evaluate

# Create your models here.


def validate_evaluation(value):
    try:
        evaluate(value)
    except SyntaxError:
        raise ValidationError("Invalid syntax")
    except (TypeError, NameError, ZeroDivisionError) as e:
        raise ValidationError(str(e))


class Expression(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expression = models.TextField(validators=[validate_evaluation])
    result = models.CharField(max_length=100, blank=True, default="")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created',)

    def _str_(self):
        return self.expression

    def save(self, *args, **kwargs):
        self.result = str(evaluate(self.expression))
        super(Expression, self).save(*args, **kwargs)
