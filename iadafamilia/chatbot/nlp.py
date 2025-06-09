from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

INTENT_MAP = {
    0: "Agendar consulta",
    1: "Cancelar consulta",
    2: "Remarcar consulta",
    3: "Dúvida geral"
}

def detectar_intencao(frase):
    inputs = tokenizer(frase, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    return predicted_class, INTENT_MAP.get(predicted_class, "Intenção desconhecida")