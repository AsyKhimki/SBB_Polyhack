from flask import Flask, render_template, request, jsonify
import logging
from logging import Formatter, FileHandler
import os

import b_logic

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/allops')
def all_ops():
    return jsonify(b_logic.all_ops())


@app.route('/alllines')
def all_lines():
    return jsonify(b_logic.all_lines())


@app.route('/mockops')
def all_mock_ops():
    return jsonify(b_logic.all_mock_ops())


@app.route('/allconstrs')
def all_construction_sites():
    return jsonify(b_logic.all_constructions())


@app.route('/allproblems')
def all_problem_zones():
    return jsonify(b_logic.all_problem_zones())


if __name__ == '__main__':
    app.run()
