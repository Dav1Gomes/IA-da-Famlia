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
    frase = frase.lower()
    if any(palavra in frase for palavra in ["agendar", "marcar", "consulta nova"]):
        return 0, "Agendar consulta"
    elif any(palavra in frase for palavra in ["cancelar", "desmarcar"]):
        return 1, "Cancelar consulta"
    elif any(palavra in frase for palavra in ["remarcar", "mudar horário", "trocar data"]):
        return 2, "Remarcar consulta"
    else:
        return 3, "Dúvida geral"