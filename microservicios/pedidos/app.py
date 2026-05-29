from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import logging
from dotenv import load_dotenv
import requests

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuración de base de datos PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'postgresql://sportcore:sportcore123@postgres:5432/sportcore'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# URL del microservicio de productos
PRODUCTOS_SERVICE_URL = os.getenv('PRODUCTOS_SERVICE_URL', 'http://productos:5001')

# Modelo de Pedido
class Pedido(db.Model):
    __tablename__ = 'pedidos_pedido'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes_cliente.id'))
    estado = db.Column(db.String(50), default='CREADO')
    total = db.Column(db.Numeric(10, 2), default=0)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Modelo de DetallePedido
class DetallePedido(db.Model):
    __tablename__ = 'pedidos_detallepedido'
    
    id = db.Column(db.Integer, primary_key=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidos_pedido.id'))
    producto_id = db.Column(db.Integer)
    cantidad = db.Column(db.Integer, default=1)
    precio_unitario = db.Column(db.Numeric(10, 2))
    pedido = db.relationship('Pedido', backref=db.backref('detalles', lazy=True))

# Helper function to get product info
def get_producto_info(producto_id):
    """Get product information from productos microservice"""
    try:
        response = requests.get(f'{PRODUCTOS_SERVICE_URL}/api/productos/{producto_id}', timeout=5)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Failed to get product {producto_id}: Status {response.status_code}")
            return None
    except requests.RequestException as e:
        logger.error(f"Error fetching product {producto_id}: {str(e)}")
        return None

# Endpoints
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'pedidos-microservice',
        'timestamp': datetime.utcnow().isoformat(),
        'productos_service': PRODUCTOS_SERVICE_URL
    })

@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    try:
        pedidos = Pedido.query.all()
        result = []
        for pedido in pedidos:
            detalles = DetallePedido.query.filter_by(pedido_id=pedido.id).all()
            detalles_data = []
            for detalle in detalles:
                producto_data = get_producto_info(detalle.producto_id)
                if producto_data is None:
                    producto_data = {'nombre': 'Producto no disponible', 'categoria': None}
                
                detalles_data.append({
                    'producto_id': detalle.producto_id,
                    'producto': producto_data,
                    'cantidad': detalle.cantidad,
                    'precio_unitario': float(detalle.precio_unitario),
                    'subtotal': float(detalle.cantidad * detalle.precio_unitario)
                })
            
            result.append({
                'id': pedido.id,
                'cliente_id': pedido.cliente_id,
                'estado': pedido.estado,
                'total': float(pedido.total),
                'fecha': pedido.fecha.isoformat(),
                'detallepedido_set': detalles_data
            })
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error fetching pedidos: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos/<int:id>', methods=['GET'])
def get_pedido(id):
    try:
        pedido = Pedido.query.get_or_404(id)
        detalles = DetallePedido.query.filter_by(pedido_id=pedido.id).all()
        
        detalles_data = []
        for detalle in detalles:
            producto_data = get_producto_info(detalle.producto_id)
            if producto_data is None:
                producto_data = {'nombre': 'Producto no disponible', 'categoria': None}
            
            detalles_data.append({
                'producto_id': detalle.producto_id,
                'producto': producto_data,
                'cantidad': detalle.cantidad,
                'precio_unitario': float(detalle.precio_unitario),
                'subtotal': float(detalle.cantidad * detalle.precio_unitario)
            })
        
        return jsonify({
            'id': pedido.id,
            'cliente_id': pedido.cliente_id,
            'estado': pedido.estado,
            'total': float(pedido.total),
            'fecha': pedido.fecha.isoformat(),
            'detallepedido_set': detalles_data
        })
    except Exception as e:
        logger.error(f"Error fetching pedido {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos', methods=['POST'])
def create_pedido():
    try:
        data = request.json
        
        if not data or 'cliente_id' not in data:
            return jsonify({'error': 'cliente_id is required'}), 400
        
        if 'detalles' not in data or not data['detalles']:
            return jsonify({'error': 'detalles are required'}), 400
        
        logger.info(f"Creating pedido for cliente_id: {data['cliente_id']}")
        
        # Calcular total
        total = 0
        detalles_validos = []
        
        for item in data['detalles']:
            producto = get_producto_info(item['producto_id'])
            if producto is None:
                logger.warning(f"Product {item['producto_id']} not available, skipping")
                continue
            
            item_total = producto['precio'] * item['cantidad']
            total += item_total
            detalles_validos.append({
                'producto_id': item['producto_id'],
                'cantidad': item['cantidad'],
                'precio_unitario': producto['precio']
            })
        
        if not detalles_validos:
            return jsonify({'error': 'No valid products found'}), 400
        
        # Crear pedido
        pedido = Pedido(
            cliente_id=data['cliente_id'],
            estado='CREADO',
            total=total
        )
        db.session.add(pedido)
        db.session.commit()
        logger.info(f"Pedido {pedido.id} created with total: {total}")
        
        # Crear detalles
        for item in detalles_validos:
            detalle = DetallePedido(
                pedido_id=pedido.id,
                producto_id=item['producto_id'],
                cantidad=item['cantidad'],
                precio_unitario=item['precio_unitario']
            )
            db.session.add(detalle)
        
        db.session.commit()
        logger.info(f"Added {len(detalles_validos)} details to pedido {pedido.id}")
        
        return jsonify({
            'id': pedido.id,
            'cliente_id': pedido.cliente_id,
            'estado': pedido.estado,
            'total': float(pedido.total),
            'detalles_count': len(detalles_validos)
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating pedido: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos/<int:id>', methods=['PUT'])
def update_pedido(id):
    try:
        pedido = Pedido.query.get_or_404(id)
        data = request.json
        
        if 'estado' in data:
            pedido.estado = data['estado']
            logger.info(f"Pedido {id} status updated to {data['estado']}")
        
        db.session.commit()
        
        return jsonify({
            'id': pedido.id,
            'estado': pedido.estado,
            'total': float(pedido.total)
        })
    except Exception as e:
        logger.error(f"Error updating pedido {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos/<int:id>', methods=['DELETE'])
def delete_pedido(id):
    try:
        pedido = Pedido.query.get_or_404(id)
        # Eliminar detalles primero
        DetallePedido.query.filter_by(pedido_id=id).delete()
        db.session.delete(pedido)
        db.session.commit()
        logger.info(f"Pedido {id} deleted")
        return jsonify({'message': 'Pedido eliminado'})
    except Exception as e:
        logger.error(f"Error deleting pedido {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    logger.info("Pedidos microservice starting...")
    app.run(host='0.0.0.0', port=5002)
