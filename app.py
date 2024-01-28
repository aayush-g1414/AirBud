from funcs import *

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from openai import OpenAI
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
import random
CORS(app, resources={r'/*': {'origins': '*'}})
socketio = SocketIO(app, cors_allowed_origins="*")

host = os.getenv("HOST")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
questions = ["What's your favorite way to spend a Saturday?", "What's your go-to comfort food?", "How do you like to unwind after a long day?", "Are you a morning person or a night owl?", "What's your favorite season, and why?",
        "If you could have dinner with any historical figure, who would it be?", "If you could travel anywhere in the world, where would you go?", "If you could meet any fictional character, who would it be?", "If you could live in any era of history, when would it be?", "If you could witness any historical event, what would it be?",
        "What's your all-time favorite TV show?", "What's your favorite book?", "What's a movie or TV show you could watch over and over again?", "What is your favorite movie?", "What's your favorite type of music?",
        "Do you have any hidden talents?", "What's the most adventurous thing you've ever done?", "If you could have any superpower, what would it be?", "What's a skill you've always wanted to learn?", "If you could have any job in the world, what would it be?",
        "What's your most-used app on your phone?", "What's the best piece of advice you've ever received?", "Do you prefer sweet or savory snacks?", "Are you a cat person or a dog person?", "What's your favorite childhood memory?"]

message_count = 0
@socketio.on("send_message")
def handle_send_message(data):
    global message_count
    isIntroduction = data["isIntroduction"]
    answer = data["answer"]
    flightNumber = data["flightNumber"]
    seat = data["seat"]

    if isIntroduction:
        # Broadcast introduction message
        emit("receive_message", {"answer": answer, "question": "", "increment": True, "flightNumber":flightNumber, "seat":seat}, broadcast=True)
    else:
        message_count += 1
        if message_count % 2 == 0:
            # Send a new question after every two messages
            new_question = random.choice(questions)
            emit("receive_message", {"answer": answer, "question": new_question, "flightNumber":flightNumber, "seat":seat}, broadcast=True)
        else:
            # Just send the answer
            emit("receive_message", {"answer": answer, "question": "", "flightNumber":flightNumber, "seat":seat}, broadcast=True)



@socketio.on('chat_message')
def on_chat_message(data):
    print(f"Received message: {data}")
    print(data)
    emit('chat_message_receive', data, broadcast=True)


@app.route('/getOpenaiJSON', methods=['POST'])
def getOpenaiJSON():
    text = request.json.get('text')
    print(text)
    chat_completion = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {
                "role": "user",
                "content": f'Parse the following text into this json format: {{"date\": \"2020-01-01\", origin: \"DFW\", destination=\"PHL\", departureTime:\"2024-10-21T09:01:00.000-05:00\"}} based on the user specifications of the date, origin, destination, and departure time (convert this to millitary time as shown in the example): {text}',
            }
        ],
        response_format={"type": "json_object"}
    )

    # Extracting the content of the response
    # completion.choices[0].message.content;

    response_content = chat_completion.choices[0].message.content
    print(response_content)

    # Returning the response as JSON
    return jsonify({"response": response_content})

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
    print(classification)   
    if classification == "0":
        return getFoodInfo(message)
    elif classification == "1":
        return getMovieInfo(message)
    elif classification == "2":
        return getLocationInfoOnline(message, flight_number, destination, arrival_time, destination_city)
    else:
        return getLocationInfo(message, flight_number, destination, arrival_time, destination_city)

@app.route('/getDestWeatherData', methods=['POST'])
def getWeatherData():
    data = request.get_json()
    latitude = data.get('latitude', '')
    longitude = data.get('longitude', '')


    # Replace with the actual API URL and include your API key if needed
    api_url = f'https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,precipitation,cloudcover'

    try:
        response = requests.get(api_url)
        weather_data = response.json()
        print(weather_data)
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({'error': str(e)})



if __name__ == '__main__':
    socketio.run(app, debug=True, host=host, port=8000)
    
    