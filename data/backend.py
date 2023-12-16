from flask import Flask, send_from_directory, send_file, render_template, request
from flask_talisman import Talisman
from datetime import datetime, date
import logging
import json
from game import Game

app = Flask(__name__)

game = Game()
start_date = date(2023, 12, 1)


# @app.route('/')
# def index():
#     return render_template('main.html', title=title, header=header, page=page)

def get_game_id(game_date: date = date.today()) -> int:
    difference = (game_date - start_date).days
    if difference < 0:
        return 0
    else:
        return difference


@app.route('/game')
def get_game():
    game_date = datetime.today().date()
    query_date = request.args.get('date', '')
    try:
        parsed_date = datetime.strptime(query_date, '%Y-%m-%d').date()
        if parsed_date < game_date:
            game_date = parsed_date
    except ValueError:
        logging.error(f"Invalid date while fetching game: {query_date}")

    return game.get_game(get_game_id(game_date))


@app.route('/cities')
def get_cities():
    return game.cities


#
# @app.route("/static/<path:path>")
# def send_static(path):
#     return send_from_directory("static", path)
#
#
# @app.route("/google918863081480b8fc.html")
# def send_google():
#     return send_file("static/google918863081480b8fc.html")


# Talisman(app, content_security_policy=None)

if __name__ == '__main__':
    app.run()
