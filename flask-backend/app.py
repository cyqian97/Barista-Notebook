from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coffee.db'
db = SQLAlchemy(app)

# Models
class CoffeeBean(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

class BrewingMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

class CoffeeResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coffee_type_id = db.Column(db.Integer, db.ForeignKey('coffee_bean.id'), nullable=False)
    brewing_method_id = db.Column(db.Integer, db.ForeignKey('brewing_method.id'), nullable=False)
    result = db.Column(db.String(200), nullable=False)

# # Automatically create tables if they don't exist
# @app.before_first_request
# def initialize_database():
#     db.create_all()


# API Routes
@app.route('/beans/', methods=['GET'])
def get_coffee_beans():
    beans = CoffeeBean.query.all()
    # Serialize the data
    beans_data = [{"id": bean.id, "name": bean.name} for bean in beans]
    return jsonify(beans=beans_data)

# Test Route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to Coffee Manager API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
