from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import logging
from dotenv import load_dotenv

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

# Modelo de Producto
class Producto(db.Model):
    __tablename__ = 'productos_producto'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias_categoria.id'))
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Modelo de Categoría
class Categoria(db.Model):
    __tablename__ = 'categorias_categoria'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
    productos = db.relationship('Producto', backref='categoria', lazy=True)

# Endpoints
@app.route('/health', methods=['GET'])
def health_check():
    try:
        productos_count = Producto.query.count()
        categorias_count = Categoria.query.count()
        return jsonify({
            'status': 'healthy',
            'service': 'productos-microservice',
            'timestamp': datetime.utcnow().isoformat(),
            'productos_count': productos_count,
            'categorias_count': categorias_count
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

@app.route('/api/productos', methods=['GET'])
def get_productos():
    try:
        productos = Producto.query.all()
        logger.info(f"Retrieved {len(productos)} productos")
        return jsonify([{
            'id': p.id,
            'nombre': p.nombre,
            'descripcion': p.descripcion,
            'precio': float(p.precio),
            'stock': p.stock,
            'categoria': {
                'id': p.categoria.id,
                'nombre': p.categoria.nombre
            } if p.categoria else None
        } for p in productos])
    except Exception as e:
        logger.error(f"Error fetching productos: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/productos/<int:id>', methods=['GET'])
def get_producto(id):
    try:
        producto = Producto.query.get_or_404(id)
        logger.info(f"Retrieved producto {id}")
        return jsonify({
            'id': producto.id,
            'nombre': producto.nombre,
            'descripcion': producto.descripcion,
            'precio': float(producto.precio),
            'stock': producto.stock,
            'categoria': {
                'id': producto.categoria.id,
                'nombre': producto.categoria.nombre
            } if producto.categoria else None
        })
    except Exception as e:
        logger.error(f"Error fetching producto {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/productos', methods=['POST'])
def create_producto():
    try:
        data = request.json
        if not data or 'nombre' not in data or 'precio' not in data:
            return jsonify({'error': 'nombre and precio are required'}), 400
        
        producto = Producto(
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            precio=data['precio'],
            stock=data.get('stock', 0),
            categoria_id=data.get('categoria_id')
        )
        db.session.add(producto)
        db.session.commit()
        logger.info(f"Created producto {producto.id}: {producto.nombre}")
        return jsonify({
            'id': producto.id,
            'nombre': producto.nombre,
            'precio': float(producto.precio)
        }), 201
    except Exception as e:
        logger.error(f"Error creating producto: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    try:
        producto = Producto.query.get_or_404(id)
        data = request.json
        
        producto.nombre = data.get('nombre', producto.nombre)
        producto.descripcion = data.get('descripcion', producto.descripcion)
        producto.precio = data.get('precio', producto.precio)
        producto.stock = data.get('stock', producto.stock)
        producto.categoria_id = data.get('categoria_id', producto.categoria_id)
        
        db.session.commit()
        logger.info(f"Updated producto {id}")
        return jsonify({
            'id': producto.id,
            'nombre': producto.nombre,
            'precio': float(producto.precio)
        })
    except Exception as e:
        logger.error(f"Error updating producto {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    try:
        producto = Producto.query.get_or_404(id)
        db.session.delete(producto)
        db.session.commit()
        logger.info(f"Deleted producto {id}")
        return jsonify({'message': 'Producto eliminado'})
    except Exception as e:
        logger.error(f"Error deleting producto {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/categorias', methods=['GET'])
def get_categorias():
    try:
        categorias = Categoria.query.all()
        logger.info(f"Retrieved {len(categorias)} categorias")
        return jsonify([{
            'id': c.id,
            'nombre': c.nombre,
            'descripcion': c.descripcion
        } for c in categorias])
    except Exception as e:
        logger.error(f"Error fetching categorias: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    logger.info("Productos microservice starting...")
    app.run(host='0.0.0.0', port=5001)
