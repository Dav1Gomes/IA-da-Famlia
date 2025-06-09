import requests

API_URL = "http://localhost:5000/api/detect_intent"

intencoes = {
    0: "Agendar consulta",
    1: "Cancelar consulta",
    2: "Remarcar consulta",
    3: "Dúvida geral"
}

print("FamilIA: Olá! Como posso ajudar hoje?")
for key, value in intencoes.items():
    print(f"{key}: {value}")
print("\nDigite sua mensagem:")

while True:
    try:
        user_input = input("Você: ")
        
        if user_input.lower() in ['sair', 'exit', 'quit']:
            print("\nEncerrando o chatbot. Até logo!")
            break
            
        response = requests.post(API_URL, json={'message': user_input})
        
        if response.status_code == 200:
            data = response.json()
            print(f"[Intenção Detectada]: {data['intent']}")
            print(f"FamilIA: {data['response']}")
        else:
            print("FamilIA: Desculpe, estou com problemas para processar sua mensagem.")
            
    except requests.exceptions.RequestException:
        print("FamilIA: Não consegui me conectar ao servidor. Verifique sua conexão.")
    except KeyboardInterrupt:
        print("\nEncerrando o chatbot. Até logo!")
        break
