
import pandas as pd
import torch
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    Trainer,
    TrainingArguments
)



df=pd.read_csv("data/complaints.csv")

le=LabelEncoder()
df["label"]=le.fit_transform(df["priority"])

train_texts, val_texts, train_labels, val_labels=train_test_split(
    df["complaint_text"].tolist(),
    df["label"].tolist(),
    test_size=0.2,
    random_state=42,
)



tokenizer=BertTokenizer.from_pretrained("bert-base-uncased")

train_encodings=tokenizer(
    train_texts, truncation=True, padding=True, max_length=128
)
val_encodings=tokenizer(
    val_texts, truncation=True, padding=True, max_length=128
)



class ComplaintDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings=encodings
        self.labels=labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item={key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"]=torch.tensor(self.labels[idx])
        return item

train_dataset=ComplaintDataset(train_encodings, train_labels)
val_dataset=ComplaintDataset(val_encodings, val_labels)



model=BertForSequenceClassification.from_pretrained(
    "bert-base-uncased",
    num_labels=len(le.classes_),
)



training_args=TrainingArguments(
    output_dir="./results",
    num_train_epochs=4,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=100,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=20,
    evaluation_strategy="epoch",
    save_strategy="epoch",
)



from sklearn.metrics import accuracy_score

def compute_metrics(eval_pred):
    logits, labels=eval_pred
    preds=logits.argmax(axis=-1)
    acc=accuracy_score(labels, preds)
    return {"accuracy": acc}

trainer=Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
)



print("🔥 Training Started...")
trainer.train()
print("✅ Training Completed!")



SAVE_DIR="./bert_priority_model"

model.save_pretrained(SAVE_DIR)
tokenizer.save_pretrained(SAVE_DIR)
joblib.dump(le, f"{SAVE_DIR}/label_encoder.pkl")

print("🎉 Model, tokenizer, and label encoder saved successfully!")
