from flask import Flask, request, jsonify
from flask_cors import CORS
from dialog import get_chatbot, get_bot_response
from nlp import detectar_intencao

app = Flask(__name__)
CORS(app)
chatbot = get_chatbot()

@app.route("/api/detect_intent", methods=["POST"])
def detect_intent():
    data = request.get_json()
    message = data.get("message", "")
    intent_id, intent_desc = detectar_intencao(message)

    if intent_desc == "Agendar consulta":
        response = "Perfeito! Para agendar sua consulta, me informe a data e o horário desejados."
    elif intent_desc == "Cancelar consulta":
        response = "Tudo bem, me diga qual consulta você gostaria de cancelar."
    elif intent_desc == "Remarcar consulta":
        response = "Claro! Vamos remarcar. Me informe a nova data e horário."
    else:
        response = get_bot_response(chatbot, message)

    return jsonify({
        "intent": intent_desc,
        "response": response
    })

if __name__ == "__main__":
    app.run(debug=True)