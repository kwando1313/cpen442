import itertools
import string
import hashlib
from Crypto.Hash import SHA256

matching_hash = "tDE91286F8E9EBC12A6039114AB2F5CBA5B7ED56C2"


stripped_hash = matching_hash[2:].lower()
counter = 0
for str in map(''.join, itertools.product("1234567890", repeat=4)):
    str = 'tD' + str
    m = hashlib.sha1()
    m.update(str.encode('utf-8'))
    if (m.hexdigest() == stripped_hash):
        print(m.hexdigest())
        print("Using the second one")
        print(str)
        break
    counter+=1
    if (counter % 10000000 == 0):
        print(counter)

print("Complete!")