from flask import Flask, render_template, request, jsonify
import logging
from logging import Formatter, FileHandler
import os

import database

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/allops')
def all_ops():
    return jsonify(database.all_ops())


if __name__ == '__main__':
    app.run()
