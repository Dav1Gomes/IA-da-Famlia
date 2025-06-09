from chatterbot import ChatBot

def get_chatbot():
    chatbot = ChatBot(
        'FamilIA',
        storage_adapter='chatterbot.storage.SQLStorageAdapter',
        logic_adapters=[
            'chatterbot.logic.MathematicalEvaluation',
            'chatterbot.logic.TimeLogicAdapter'
        ],
        database_uri='sqlite:///database.sqlite3'
    )
    return chatbot

def get_bot_response(chatbot, message):
    return str(chatbot.get_response(message))