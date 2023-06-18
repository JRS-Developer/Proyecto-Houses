from flask import request
from marshmallow import ValidationError
from houses import bp
from models.House import House, house_schema, houses_schema
from extensions import db

@bp.route('/houses', methods=['GET'])
def get_houses():
    houses = db.session.execute(db.select(House).order_by(House.id.desc())).scalars()
    return houses_schema.jsonify(houses)

@bp.route('/houses', methods=['POST'])
def create_house():
    try:
        data = request.get_json()
        house_schema.load(data)

        new_house = House(
            **data
        )
        db.session.add(new_house)
        db.session.commit()
    except ValidationError as e:
        return e.messages, 400
    return "New House"
