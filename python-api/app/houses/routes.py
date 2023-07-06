from flask import jsonify, request
from houses import bp
from model import rf
import numpy as np

@bp.route('/houses/price', methods=['POST'])
def recommend_price():
    json = request.get_json()

    data = rf.predict_on_batch({
        "YearBuilt": np.array([
            int(json['yearBuilt'])
        ]),
        "GarageCars": np.array(
            [int(json['garageCars'])]
        )
    })

    print(data.squeeze())
    return jsonify({
        "price": data.squeeze().tolist()
    })
