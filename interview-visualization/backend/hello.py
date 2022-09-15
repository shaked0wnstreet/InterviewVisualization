from flask import Flask

app = Flask(__name__)

@app.route('/message')
def hello_world():
    return {'message': "Hello World"}

if __name__ == "__main":
    app.run(debug=True)