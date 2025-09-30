from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def before_game():
    return render_template('beforegame.html')

@app.route('/game')
def game():
    return render_template('game.html')