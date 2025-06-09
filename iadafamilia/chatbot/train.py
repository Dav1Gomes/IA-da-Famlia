from chatterbot.trainers import ListTrainer
from dialog import get_chatbot

def treinar_chatbot():
    chatbot = get_chatbot()
    conversation = [
        "Olá",
        "Bom dia! Como posso ajudar?",
        "Quem é você?",
        "Eu sou a FamilIA!",
        "O que você faz?",
        "Eu te ajudo a tirar suas dúvidas!",
        "Entendo, muito obrigado",
        "Eu que agradeço!"
    ]
    trainer = ListTrainer(chatbot)
    trainer.train(conversation)
    print("Chatbot treinado com sucesso!")

if __name__ == "__main__":
    treinar_chatbot()