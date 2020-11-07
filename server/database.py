import json


def all_ops():
    with open("server/mock_ops.json", "r") as read_file:
        data = json.load(read_file)
    return data
