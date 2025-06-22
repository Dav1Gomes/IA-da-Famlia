# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from dialog import get_chatbot, get_bot_response
from nlp import detectar_intencao
import requests

app = Flask(__name__)
CORS(app)

chatbot = get_chatbot()

@app.route("/api/detect_intent", methods=["POST"])
def detect_intent():
    data = request.get_json() or {}
    message = data.get("message", "").strip()

    #detectar a intenção base do usuario
    intent_id, intent_desc = detectar_intencao(message)

    if intent_id == 0:  
        return jsonify({
            "intent": intent_desc,
            "response": "Perfeito! Para agendar sua consulta, me informe a data e o horário desejados."
        })
    elif intent_id == 1:  # Cancelar
        return jsonify({
            "intent": intent_desc,
            "response": "Tudo bem, me diga qual consulta você gostaria de cancelar."
        })
    elif intent_id == 2:  # Remarcar
        return jsonify({
            "intent": intent_desc,
            "response": "Claro! Vamos remarcar. Me informe a nova data e horário."
        })

    try:
        resp = requests.get("http://localhost:5001/api/faq", timeout=2)
        faq_list = resp.json()
        for item in faq_list:
            if item["pergunta"].strip().lower() == message.lower():
                return jsonify({
                    "intent": intent_desc,
                    "response": item["resposta"]
                })
    except Exception as e:
        app.logger.warning("Não consegui consultar FAQ do Node: %s", e)

    bot_reply = get_bot_response(chatbot, message)
    return jsonify({
        "intent": intent_desc,
        "response": bot_reply
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
