from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from openai import OpenAI
from flask_cors import CORS, cross_origin
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

CORS(app, resources={r'/*': {'origins': '*'}})

host = os.getenv("HOST")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
@app.route('/getOpenaiJSON', methods=['POST'])
def getOpenaiJSON():
    print("hello1")
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


if __name__ == '__main__':
    app.run(debug=True, host=host, port=8000)
    
    