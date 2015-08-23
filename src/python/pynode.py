import sys
import json

print "Python script started"

line = sys.stdin.readline()

def process(data):
	return data + " is what was entered"

while line:
	data = json.loads(line[:-1])
	out = json.loads('{"request":' + str(data["request"]) + '}')
	out["data"] = process(data["data"])
	print json.dumps(out)
	line = sys.stdin.readline()