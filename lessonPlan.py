from educhain import Educhain
from educhain.core import config
from langchain.chat_models import ChatOpenAI


llama = ChatOpenAI(
    model="llama-3.1-70b-versatile",
    openai_api_base="https://api.groq.com/openai/v1",
    openai_api_key="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"  # Assuming userdata is a dictionary with the API key
)


llm_config = config.LLMConfig(
    custom_model=llama
)

client = Educhain(llm_config)

lesson_plan = client.content_engine.generate_lesson_plan(
    topic="Trigonometry",
    custom_instructions="Include real-world examples"
)
lesson_plan.show()