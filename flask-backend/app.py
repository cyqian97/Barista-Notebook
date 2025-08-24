from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

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
    harvest_year = db.Column(db.Integer, nullable=True)
    harvest_month = db.Column(db.Integer, nullable=True)
    note = db.Column(db.String(500), nullable=True)
    last_use_date = db.Column(db.DateTime, nullable=True)
    

class BrewingMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    
class Grinder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    
class Brew(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coffee_bean_id = db.Column(db.Integer, db.ForeignKey('coffee_bean.id'), nullable=False)
    grinder_id = db.Column(db.Integer, db.ForeignKey('grinder.id'), nullable=False)
    method_id = db.Column(db.Integer, db.ForeignKey('brewing_method.id'), nullable=False)
    grind_size = db.Column(db.Integer, nullable=False)
    date_brewed = db.Column(db.DateTime, default=datetime.utcnow)
    tasting_notes = db.Column(db.Text)

    coffee_bean = db.relationship('CoffeeBean', backref=db.backref('brews', lazy=True))
    method = db.relationship('BrewingMethod', backref=db.backref('brews', lazy=True))

class BrewParameter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brew_id = db.Column(db.Integer, db.ForeignKey('brew.id'), nullable=False)
    parameter_name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(100), nullable=False)

    brew = db.relationship('Brew', backref=db.backref('parameters', lazy=True))

class MethodParameterTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    method_id = db.Column(db.Integer, db.ForeignKey('brewing_method.id'), nullable=False)
    parameter_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    method = db.relationship('BrewingMethod', backref=db.backref('parameter_templates', lazy=True))


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

@app.route('/grinders/')
def get_grinders():
    grinders = Grinder.query.all()
    return jsonify([{"id": g.id, "name": g.name} for g in grinders])

@app.route('/brewing-methods/')
def get_brewing_methods():
    brewing_methods = BrewingMethod.query.all()
    return jsonify([{"id": b.id, "name": b.name} for b in brewing_methods])

@app.route('/brewing-methods/<int:method_id>/parameters/')
def get_method_parameters(method_id):
    templates = MethodParameterTemplate.query.filter_by(method_id=method_id).all()
    return jsonify([
        {"id": t.id, "parameter_name": t.parameter_name, "description": t.description}
        for t in templates
    ])

@app.route('/brews/', methods=['POST'])
def add_brew():
    data = request.json
    # Create Brew record
    new_brew = Brew(
        coffee_bean_id=data['coffee_bean_id'],
        grinder_id=data['grinder_id'],
        method_id=data['method_id'],
        grind_size=data['grind_size'],
        date_brewed=datetime.fromisoformat(data['date_brewed']) if data.get('date_brewed') else datetime.utcnow(),
        tasting_notes=data.get('tasting_notes', "")
    )
    db.session.add(new_brew)
    db.session.commit()  # Commit to get new_brew.id

    # Add BrewParameter records
    parameters = data.get('parameters', {})
    for param_name, value in parameters.items():
        param = BrewParameter(
            brew_id=new_brew.id,
            parameter_name=param_name,
            value=value
        )
        db.session.add(param)
    db.session.commit()

    return jsonify({"message": "Brew added successfully", "brew_id": new_brew.id}), 201

# Test Route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to Coffee Manager API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
