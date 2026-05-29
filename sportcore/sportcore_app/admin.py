from django.contrib import admin
from django.utils.html import format_html
from .models import Categoria, Cliente, Producto, Inventario, Pedido, DetallePedido


class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 1
    fields = ['producto', 'cantidad', 'precio_unitario']


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'correo', 'direccion']
    search_fields = ['nombre', 'correo']
    list_filter = ['nombre']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio', 'categoria']
    search_fields = ['nombre']
    list_filter = ['categoria']
    list_editable = ['precio']


@admin.register(Inventario)
class InventarioAdmin(admin.ModelAdmin):
    list_display = ['producto', 'cantidad']
    search_fields = ['producto__nombre']
    list_filter = ['cantidad']


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'fecha', 'estado', 'total', 'acciones_estado']
    search_fields = ['cliente__nombre']
    list_filter = ['estado', 'fecha']
    readonly_fields = ['fecha']
    inlines = [DetallePedidoInline]
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
    
    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            instance.save()
        formset.save_m2m()
        
        # Calcular total del pedido
        if form.instance.pk:
            pedido = form.instance
            total = 0
            for detalle in pedido.detallepedido_set.all():
                total += detalle.cantidad * detalle.precio_unitario
            pedido.total = total
            pedido.save()
    
    def acciones_estado(self, obj):
        botones = ''
        if obj.estado == 'pendiente':
            botones += format_html(
                '<a href="/admin/sportcore_app/pedido/{}/change/?estado=completado" class="button">Completar</a> ',
                obj.id
            )
            botones += format_html(
                '<a href="/admin/sportcore_app/pedido/{}/change/?estado=cancelado" class="button">Cancelar</a>',
                obj.id
            )
        return botones
    acciones_estado.short_description = 'Acciones'
    
    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        extra_context = extra_context or {}
        if request.GET.get('estado'):
            extra_context['estado_sugerido'] = request.GET.get('estado')
        return super().changeform_view(request, object_id, form_url, extra_context)
    
    def save_model(self, request, obj, form, change):
        if not change and hasattr(request, 'estado_sugerido'):
            obj.estado = request.estado_sugerido
        super().save_model(request, obj, form, change)


@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ['pedido', 'producto', 'cantidad', 'precio_unitario', 'subtotal']
    search_fields = ['pedido__id', 'producto__nombre']
    list_filter = ['pedido']
    readonly_fields = ['subtotal']
    
    def subtotal(self, obj):
        return obj.cantidad * obj.precio_unitario
    subtotal.short_description = 'Subtotal'
