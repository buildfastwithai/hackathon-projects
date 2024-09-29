import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# convert the .csv to array of reviews
# df = pd.read_csv(r'product_reviews/iphone 15.csv')
# arr_reviews = df.values

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)


def get_answer(question, context, flag):
    if flag == 0:
        content = f"I have given you student background knowledge {context} use that background knowledge to answer the student question{question}" + \
            "also provide the example" + \
            "dont give introduction or greet user be specific and point-to-point"+"within 150 words"
    elif flag == 1:
        content = f"give me the list of prerequisites for the following question {question} and the output should be array of prerequisites" + \
            'provide only array not other text'+"give me the 5 top prerequisites" + \
            "strictly give only array"+"ex:['hello','hi']"
    elif flag == 2:
        content = f"list the project which a student can do to understand that concept {question} and the difficulty of the project should be accroding to his/her previous knowledge{context}" + \
            "give me the list of 5 projects"+"directly give me the list without any prior introduction" + \
            "provide only array not other text" + \
            "strictly give only array"+"ex:['hello','hi']"
    elif flag == 3:
        content = f"only give the topic name, not prepositions from the following {question}"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": content,
            }
        ],
        model="llama3-8b-8192",
        temperature=0.1,
    )

    response = chat_completion.choices[0].message.content
    return response


# question='what is deep learning'
# context='i am a school student i do not know much about programming'
# answer=get_answer(question,context,0)
# pre=get_answer(question,context,1)
# project=get_answer(question,context,2)
# title=get_answer(question, context,3)

# # print(answer)
# # print('-----------------------------------------------------------------------------')
# print(pre)
# print(type(pre))
# print('-----------------------------------------------------------------------------')
# print(project)
# print(type(project))
# # print('-----------------------------------------------------------------------------')
# # print(title)
