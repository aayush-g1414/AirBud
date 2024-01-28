import json
import requests

from flask import Flask, request, jsonify
from openai import OpenAI

keys = json.load(open('SuperSecretVars.json'))
OPENAI_API_KEY = keys['OPENAI_API_KEY']
PERPLEXITY_AUTH_KEY = keys['PERPLEXITY_AUTH_KEY']

client = OpenAI(api_key=OPENAI_API_KEY)

def getLocationInfoOnline(question: str , flight_number: str , 
        destination: str, arrival_time: str, destination_city: str):
    url = "https://api.perplexity.ai/chat/completions"

    system_prompt = open('perplexity_system_message.txt', 'r').read().format(
        flight_number=flight_number,
        destination=destination,
        arrival_time=arrival_time,
        destination_city=destination_city)

    payload = {
        "model": "pplx-7b-online",
        "messages": [
            {
                "role": "user",
                "content": system_prompt + "\n\n" + question
            }
        ]
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": PERPLEXITY_AUTH_KEY
    }

    response = requests.post(url, json=payload, headers=headers)

    return str(json.loads(response.text)["choices"][0]["message"]["content"])

def getLocationInfo(question: str , flight_number: str ,
        destination: str, arrival_time: str, destination_city: str):
    """Use OpenAI to get location information
    
    question: str -- input from the user
    flight_number: str -- flight number
    destination: str -- destination airport
    arrival_time: str -- arrival time
    destination_city: str -- destination city
    Return: str -- response from OpenAI
    """

    system_prompt = open('openai_system_message.txt', 'r').read().format(
        flight_number=flight_number,
        destination=destination,
        arrival_time=arrival_time,
        destination_city=destination_city)

    user_prompt = question + "\n"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        model="gpt-4-turbo-preview",
        max_tokens=2048,
    )

    return chat_completion.choices[0].message.content

def _getMovieInfo(question: str, banned_movies: list):
    """Use OpenAI to get movie information
    
    question: str -- input from the user
    Return: str -- response from OpenAI
    """
    system_prompt = []
    with open('movie_system_prompt_with_movies.txt', 'r') as f:
        for line in f:
            valid = True
            for movie in banned_movies:
                if line.startswith(movie):
                    valid = False
                    break
            if valid:
                system_prompt.append(line)
    system_prompt = "".join(system_prompt)
    user_prompt = question + "\n"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        model="gpt-4-0125-preview",
        max_tokens=64,
    )
    response = chat_completion.choices[0].message.content
    response = response.strip()
    response = response.strip("*")
    return response
    
def getMovieInfo(question: str):
    words = []
    for i in range(3):
        words.append(_getMovieInfo(question, words))
    return words

def getFoodInfo(question: str):
    """Use OpenAI to get food information
    
    question: str -- input from the user
    Return: str -- response from OpenAI
    """
    system_prompt = open('food_system_message.txt', 'r').read()
    user_prompt = question + "\n"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        model="gpt-4-0125-preview",
        max_tokens=512,
    )

    return chat_completion.choices[0].message.content

def classify_query(query: str):
    """Use OpenAI to classify a query as either flight information, movies, or online, or general
    
    query: str -- input from the user
    Return: 0, 1, 2 -- 0 for flight, 1 for movies, 2 for online, 3 for general
    """

    system_prompt = open('classification_system_message.txt', 'r').read()
    user_prompt = query + " -> "

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        model="gpt-4-turbo-preview",
        max_tokens=1,
    )

    choice = chat_completion.choices[0].message.content
    if choice not in {"0", "1", "2", "3"}: # if incorrect response, 
        return 3
    return chat_completion.choices[0].message.content


app = Flask(__name__)

@app.route('/query', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    flight_number = data.get('flight_number', '')
    destination = data.get('destination', '')
    arrival_time = data.get('arrival_time', '')
    destination_city = data.get('destination_city', '')

    
    # classify the query
    classification = classify_query(message)
    if classification == 0:
        return getFoodInfo(message)
    elif classification == 1:
        return getMovieInfo(message)
    elif classification == 2:
        return getLocationInfoOnline(message, flight_number, destination, arrival_time, destination_city)
    else:
        return getLocationInfo(message, flight_number, destination, arrival_time, destination_city)

if __name__ == '__main__':
    app.run(debug=True)
