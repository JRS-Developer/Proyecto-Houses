from marshmallow import fields
from extensions import db, ma

class House(db.Model):
    __tablename__ = 'houses'
    id = db.Column(db.Integer, primary_key=True)
    salePrice = db.Column("SalePrice",db.Integer)
    houseStyle = db.Column("HouseStyle",db.String)
    neighborhood = db.Column("Neighborhood",db.String)
    firePlaces = db.Column("FirePlaces", db.String)
    garageCars = db.Column("GarageCars", db.String)
    garageCond = db.Column("GarageCond", db.String)
    garageArea = db.Column("GarageArea", db.String)
    garageYrBlt = db.Column("GarageYrBlt", db.String)
    heating = db.Column("Heating", db.String)
    utilities = db.Column("Utilities", db.String)
    yearBuilt = db.Column("YearBuilt", db.String)
    roofStyle = db.Column("RoofStyle", db.String)
    roofMatl = db.Column("RoofMatl", db.String)

class HouseSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    salePrice = fields.Int(required=True)
    class Meta:
        model = House
        fields = ('id', 'salePrice', 'houseStyle', 'neighborhood', 'firePlaces', 'garageCars')

house_schema = HouseSchema()
houses_schema = HouseSchema(many=True)
