import sys

print "hello"

line = sys.stdin.readline()

def sample(line):
	return line + " is what was entered"

while line:
	print sample(line[:-1])
	line = sys.stdin.readline()