import sys
import json
from importlib import import_module

mod = import_module(sys.argv[1])
process = getattr(mod, sys.argv[2])

print "Python script started"

line = sys.stdin.readline()

while line:
	data = json.loads(line[:-1])
	out = json.loads('{"request":' + str(data["request"]) + '}')
	out["data"] = process(data["data"])
	print json.dumps(out)
	line = sys.stdin.readline()