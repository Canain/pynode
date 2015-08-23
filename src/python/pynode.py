import sys
import json

print "Python script started"

line = sys.stdin.readline()

def sample(data):
	return data + " is what was entered"

while line:
	data = json.loads(line[:-1])
	out = json.loads("{\"request\":" + data.request + "}")
	out.data = sample(data.data)
	print json.dumps(out)
	line = sys.stdin.readline()