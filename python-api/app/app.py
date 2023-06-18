from flask import Flask
from extensions import db, ma
from houses import bp as houses_bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

    db.init_app(app)
    ma.init_app(app)

    app.register_blueprint(houses_bp)

    return app


app = create_app()

with app.app_context():
    db.reflect()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
