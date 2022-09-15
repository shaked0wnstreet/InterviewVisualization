from flask import Flask

app = Flask(__name__)

@app.route('/text')
def hello_world():
    return {'text': "Hello, World!"}

if __name__ == "__main":
    app.run(debug=True)