from chatterbot.trainers import ListTrainer
from dialog import get_chatbot

frases = [
    # Intenção 0: "Agendar consulta"
    ("Quero marcar uma consulta", "Para agendar sua consulta, me informe a data e o horário desejados."),
    ("Gostaria de agendar um horário com o dentista", "Claro! Qual especialidade e data você prefere?"),
    ("Preciso marcar exame de rotina", "Sem problemas! Qual exame e data você deseja marcar?"),
    ("Como faço para marcar uma consulta?", "Basta me informar a especialidade, data e horário desejados."),
    ("Desejo agendar uma avaliação médica", "Perfeito! Qual médico e data você prefere?"),
    ("Poderia marcar minha consulta para amanhã?", "Verificarei a disponibilidade para amanhã. Qual horário prefere?"),
    ("Queria agendar com o cardiologista", "Ótimo! Qual dia e horário você gostaria?"),

    # Intenção 1: "Cancelar consulta"
    ("Preciso cancelar minha consulta", "Tudo bem, me diga qual consulta você gostaria de cancelar."),
    ("Gostaria de desmarcar meu horário", "Informe o dia e horário da consulta que deseja cancelar."),
    ("Como faço para cancelar uma consulta?", "Me informe a especialidade e data da consulta para cancelar."),
    ("Quero cancelar o agendamento de amanhã", "Cancelarei o agendamento de amanhã. Confirma?"),
    ("Infelizmente preciso cancelar", "Sem problemas, me diga qual consulta cancelar."),
    ("Desejo cancelar a consulta marcada", "Qual a data e especialidade da consulta a ser cancelada?"),
    ("É possível cancelar meu exame?", "Sim, me informe qual exame e data para cancelar."),

    # Intenção 2: "Remarcar consulta"
    ("Gostaria de remarcar para outro dia", "Claro! Para qual data deseja remarcar?"),
    ("Preciso mudar a data da minha consulta", "Qual a nova data e horário desejados?"),
    ("Quero alterar o horário do meu atendimento", "Me informe o novo horário para remarcação."),
    ("Como faço para reagendar minha consulta?", "Basta me informar a nova data e horário."),
    ("Desejo trocar a data do meu exame", "Qual a nova data para o exame?"),
    ("É possível remarcar para semana que vem?", "Sim! Qual dia da próxima semana prefere?"),
    ("Preciso adiar minha consulta", "Para qual data deseja adiar sua consulta?"),

    # Intenção 3: "Dúvida geral"
    ("Qual o endereço da clínica?", "A clínica fica na Rua Exemplo, 123, Centro."),
    ("Quais são os horários de funcionamento?", "Funcionamos de segunda a sexta, das 8h às 18h."),
    ("Quanto custa uma consulta particular?", "O valor da consulta particular é R$ 150,00."),
    ("Quais documentos preciso levar?", "Leve documento com foto e carteirinha do plano de saúde."),
    ("Aceitam meu plano de saúde?", "Quais são os dados do seu plano? Posso verificar para você."),
    ("Qual especialista devo consultar?", "Me conte seus sintomas para eu indicar o especialista."),
    ("Tem estacionamento no local?", "Sim, temos estacionamento gratuito para pacientes."),
    ("Qual o telefone para contato?", "Nosso telefone é (11) 1234-5678."),
]

def treinar_chatbot():
    chatbot = get_chatbot()
    # Treinamento de pergunta e resposta
    for pergunta, resposta in frases:
        trainer = ListTrainer(chatbot)
        trainer.train([pergunta, resposta])
    print("Chatbot treinado com sucesso com o novo dataset!")

if __name__ == "__main__":
    treinar_chatbot()