from django.conf import settings


def evaluate(expression):
    # Validate allowed names
    code = compile(expression, "<string>", "eval")
    for name in code.co_names:
        if name not in settings.ALLOWED_NAMES:
            raise NameError(f"The use of '{name}' is not allowed")

    return eval(expression, {"__builtins__": {}}, settings.ALLOWED_NAMES)
