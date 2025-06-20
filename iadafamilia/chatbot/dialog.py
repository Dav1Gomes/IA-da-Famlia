from chatterbot import ChatBot

def get_chatbot():
    chatbot = ChatBot(
        'FamilIA',
        storage_adapter='chatterbot.storage.SQLStorageAdapter',
        logic_adapters=[
            {
                'import_path': 'chatterbot.logic.BestMatch',
                'default_response': 'Desculpe, não entendi. Pode repetir?',
                'maximum_similarity_threshold': 0.90
            },
            'chatterbot.logic.MathematicalEvaluation',
            'chatterbot.logic.TimeLogicAdapter'
        ],
        database_uri='sqlite:///database.sqlite3'
    )
    return chatbot

def get_bot_response(chatbot, message):
    return str(chatbot.get_response(message))