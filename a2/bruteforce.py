import binascii
import string
import time
import itertools

start_time = time.time()
print("Starting to test...")
test = binascii.crc32("310139671b9e90d8ef9b21fc82b8337e")
test2 = 0
amount = 0
exportString = ""
x = 6
escape = False

while (escape == False):
	for string in itertools.imap(''.join, itertools.product(string.ascii_uppercase + string.ascii_lowercase+ string.digits, repeat=x)):
		test2 = binascii.crc32(string)
		if (test == test2):
			escape = True
			exportString = string
			break
		amount += 1
		if (amount %1000000 == 0):
			print(amount)


print(time.time() - start_time)
print(exportString)


