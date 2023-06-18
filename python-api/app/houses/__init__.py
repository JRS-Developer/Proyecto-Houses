from flask import Blueprint

bp = Blueprint('houses', __name__)

from houses import routes
