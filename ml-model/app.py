# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import predict_priority

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Input validation
    complaint_text = data.get("complaint_text", "")
    if complaint_text.strip() == "":
        return jsonify({"error": "No complaint text provided"}), 400

    # Predict priority
    priority, confidence = predict_priority(complaint_text)

    return jsonify({
        "priority": priority,
        "confidence": round(confidence, 2)
    })

if __name__ == "__main__":
    print("🚀 Flask server running on http://127.0.0.1:5001")
    app.run(port=5001, debug=True)
