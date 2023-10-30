import math


ALLOWED_NAMES = {
    k: v for k, v in math.__dict__.items() if not k.startswith("__")
}

# Here we can add allowed functions
ALLOWED_NAMES.update({
    'abs': abs,
    'len': len,
})


def evaluate(expression):
    # Validate allowed names
    code = compile(expression, "<string>", "eval")
    for name in code.co_names:
        if name not in ALLOWED_NAMES:
            raise NameError(f"The use of '{name}' is not allowed")

    return eval(expression, {"__builtins__": {}}, ALLOWED_NAMES)
