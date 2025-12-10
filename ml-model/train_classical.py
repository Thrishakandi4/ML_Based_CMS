import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Load data
df = pd.read_csv("data/complaints.csv")
X = df["complaint_text"]
y = df["priority"]

# Build pipeline
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression(max_iter=1000))
])

# Train model
pipeline.fit(X, y)

# Save model
joblib.dump(pipeline, "priority_classifier.pkl")
print("Model trained and saved as priority_classifier.pkl")
