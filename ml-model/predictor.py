# predictor.py
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import joblib

# Force CPU if no GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# Use the smallest BERT model from HuggingFace Hub
model_name = "prajjwal1/bert-tiny"

# Load tokenizer + model
from transformers import AutoTokenizer, AutoModelForSequenceClassification
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
model.to(device)
model.eval()  # Set model to evaluation mode


def predict_priority(complaint_text):
    """Returns predicted priority + confidence."""

    # Tokenization
    encoding = tokenizer(
        [complaint_text],
        truncation=True,
        padding=True,
        max_length=128,
        return_tensors="pt"
    ).to(device)

    # Disable gradient for faster prediction
    with torch.no_grad():
        outputs = model(**encoding)

    # Softmax probabilities
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)

    # Predicted class + confidence
    conf, pred = torch.max(probs, dim=1)

    priority_label = label_encoder.inverse_transform([pred.item()])[0]
    confidence = float(conf.item())

    return priority_label, confidence


# Manual test (optional)
if __name__ == "__main__":
    text = "Internet is not working since yesterday"
    p, c = predict_priority(text)
    print(f"Predicted Priority: {p}, Confidence: {c:.2f}")
