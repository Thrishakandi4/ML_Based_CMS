# predictor.py
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import joblib

# Force CPU if no GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")



# Use classical ML model (logistic regression)
import joblib
pipeline = joblib.load("priority_classifier.pkl")



def predict_priority(complaint_text):
    """Returns predicted priority and confidence."""
    pred = pipeline.predict([complaint_text])[0]
    proba = pipeline.predict_proba([complaint_text])[0]
    confidence = max(proba)
    return pred, confidence


# Manual test (optional)
if __name__ == "__main__":
    text = "Internet is not working since yesterday"
    p, c = predict_priority(text)
    print(f"Predicted Priority: {p}, Confidence: {c:.2f}")
