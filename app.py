from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import json
import requests #para la API de noticias
from datetime import datetime 
from flask_sqlalchemy import SQLAlchemy # para la base de datos actividades

app = Flask(__name__) 

#---------------------EDIT_IMAGE-----------------------------
STATE_FILE = os.path.join('data', 'state.json')

# Función para cargar el estado
def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"main_image": "/static/images/imagen6.jpg", "background": "/static/images/backgrounds/fnd1.jpg"}

# Función para guardar el estado
def save_state(data):
    with open(STATE_FILE, 'w') as f:
        json.dump(data, f)

# Rutas para manejar la edición de imagen:
@app.route('/edit-image', methods=['GET'])
def edit_image():
    state = load_state()
    return render_template('edit_image.html', state=state)

@app.route('/save-image', methods=['POST'])
def save_image():
    data = request.json
    main_image = data.get("main_image")
    background = data.get("background")

    # Actualizar el estado
    state = load_state()
    state["main_image"] = main_image
    state["background"] = background
    save_state(state)

    return jsonify({"message": "Configuración guardada correctamente"})

#----------------------NEWS-------------------------
#para la API de noticias :https://newsapi.org/

API_KEY = 'bd44f49d78ae4e709a71bb3254ca9bea'
WSJ_URL = 'https://newsapi.org/v2/everything?domains=wsj.com&apiKey=bd44f49d78ae4e709a71bb3254ca9bea'

@app.route('/news', methods=['GET'])
def show_news():
    # Configurar los parámetros para obtener artículos del WSJ
    params = {
        'domains': 'wsj.com',
        'apiKey': API_KEY,
    }

    # Realizar la solicitud a la API
    response = requests.get(WSJ_URL, params=params)
    
    if response.status_code == 200:
        news_data = response.json()  # Convertir la respuesta en JSON
        articles = news_data.get('articles', [])  # Obtener los artículos
    else:
        articles = []  # Manejo de errores: lista vacía si hay problemas
    
    # Renderizar la plantilla con los artículos
    return render_template('news.html', articles=articles)

#-----------------------ACTIVITIES---------------------------
# Configurar la aplicación Flask y la base de datos

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///activities.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Crear la instancia de SQLAlchemy
db = SQLAlchemy(app)
# Definir el modelo para las actividades

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)  # Fecha (YYYY-MM-DD)
    time = db.Column(db.String(5), nullable=False)   # Hora (HH:MM)
    description = db.Column(db.String(255), nullable=False)  # Descripción

# Crear las tablas en la base de datos
#with app.app_context():
#    db.create_all()
# Ruta para mostrar actividades y formulario
@app.route('/activities', methods=['GET'])
def activities_page():
    activities = Activity.query.all()
    return render_template('activities.html', activities=activities)

# Ruta para agregra actividades 
@app.route('/add-activity', methods=['POST'])
def add_activity():
    data = request.json
    new_activity = Activity(
        date=data['date'],
        time=data['time'],
        description=data['description']
    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify({"message": "Actividad agregada exitosamente"})

#Ruta para eliminar actividades
@app.route('/delete-activity/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if activity:
        db.session.delete(activity)
        db.session.commit()
        return jsonify({"message": "Actividad eliminada exitosamente"})
    return jsonify({"message": "Actividad no encontrada"}), 404

# Ruta para verificar actividades pendientes
@app.route('/check-activities', methods=['GET'])
def check_activities():
    now = datetime.now()
    current_date = now.strftime('%Y-%m-%d')
    current_time = now.strftime('%H:%M')

    # Buscar actividades que coincidan con la fecha y hora actuales
    activities = Activity.query.filter_by(date=current_date, time=current_time).all()

    # Si hay actividades coincidentes, devolver sus descripciones
    if activities:
        alerts = [{"id": activity.id, "description": activity.description} for activity in activities]
        return jsonify({"alerts": alerts})
    return jsonify({"alerts": []})

# -------------------------------------------------------
# Rutas principal main
@app.route('/')
def main_page():
    state = load_state() # Función que devuelve el estado, incluyendo "main_image"
    # Enviamos las actividades como JSON
    return render_template('main.html', 
                           main_image=state["main_image"],
                           background=state["background"],)
# -------------------------------------------------------

if __name__ == '__main__':
    app.run(debug=True)
