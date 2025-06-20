from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp import detectar_intencao

app = Flask(__name__)
CORS(app)

@app.route('/api/detect_intent', methods=['POST'])
def detect_intent():
    payload = request.get_json() or {}
    mensagem = payload.get('message', '').strip()
    try:
        intencao, resposta = detectar_intencao(mensagem)
        return jsonify({ 'response': resposta })
    except Exception as e:
        print("Erro interno no NLP:", e)
        return jsonify({ 'response': 'Desculpe, deu um erro interno.' }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
