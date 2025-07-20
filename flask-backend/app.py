from flask import Flask, jsonify, request
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
    country = db.Column(db.String(80), nullable=False)
    process = db.Column(db.String(80), nullable=False)
    roast = db.Column(db.String(80), nullable=True)
    region = db.Column(db.String(80), nullable=True)
    farm = db.Column(db.String(80), nullable=True)
    variety = db.Column(db.String(80), nullable=True)
    drying = db.Column(db.String(80), nullable=True)
    roaster = db.Column(db.String(80), nullable=True)
    harvest_year = db.Column(db.Integer, nullable=False)
    harvest_month = db.Column(db.Integer, nullable=False)
    note = db.Column(db.String(500), nullable=True)
    last_use_date = db.Column(db.DateTime, nullable=True)
    

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


@app.route('/coffee-beans/', methods=['GET'])
def get_coffee_beans():
    coffee_beans = CoffeeBean.query.order_by(CoffeeBean.last_use_date.desc().nullslast()).all()
    result = [
        {
            "id": bean.id,
            "name": bean.name,
            "country": bean.country,
            "process": bean.process,
            "roast": bean.roast,
            "region": bean.region,
            "farm": bean.farm,
            "variety": bean.variety,
            "drying": bean.drying,
            "roaster": bean.roaster,
            "harvest_year": bean.harvest_year,
            "harvest_month": bean.harvest_month,
            "note": bean.note
        } for bean in coffee_beans
    ]
    return jsonify(result)

@app.route('/coffee-beans/', methods=['POST'])
def add_coffee_bean():
    data = request.json
    new_bean = CoffeeBean(
        name=data['name'],
        country=data['country'],
        process=data['process'],
        roast=data.get('roast'),
        region=data.get('region'),
        farm=data.get('farm'),
        variety=data.get('variety'),
        drying=data.get('drying'),
        roaster=data.get('roaster'),
        harvest_year=data['harvest_year'],
        harvest_month=data['harvest_month'],
        note=data.get('note')
    )
    db.session.add(new_bean)
    db.session.commit()
    return jsonify({
        "id": new_bean.id,
        "name": new_bean.name,
        "country": new_bean.country,
        "process": new_bean.process,
        "roast": new_bean.roast,
        "region": new_bean.region,
        "farm": new_bean.farm,
        "variety": new_bean.variety,
        "drying": new_bean.drying,
        "roaster": new_bean.roaster,
        "harvest_year": new_bean.harvest_year,
        "harvest_month": new_bean.harvest_month,
        "note": new_bean.note
    }), 201

@app.route('/coffee-beans/<int:id>', methods=['DELETE'])
def delete_coffee_bean(id):
    bean = CoffeeBean.query.get_or_404(id)
    db.session.delete(bean)
    db.session.commit()
    return jsonify({"message": "Coffee bean deleted successfully"}), 200


# Test Route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to Coffee Manager API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
