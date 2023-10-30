from django.contrib import admin

from .models import Expression


class ExpressionAdmin(admin.ModelAdmin):
    list_display = ('expression', 'result', 'user', 'created')
    readonly_fields = ('result', 'created', 'user')
    date_hierarchy = 'created'
    list_filter = (('user', admin.RelatedOnlyFieldListFilter),)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.user = request.user
        super(ExpressionAdmin, self).save_model(request, obj, form, change)


admin.site.register(Expression, ExpressionAdmin)
