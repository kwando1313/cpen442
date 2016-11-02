import itertools
import string
import hashlib
from Crypto.Hash import SHA256

matching_hash = "wN39A15A4128E62903D4EDD0575B5B64DC7ED464AB"


stripped_hash = matching_hash[2:].lower()
counter = 0
for str in map(''.join, itertools.product("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=", repeat=6)):
    str = 'wN' + str
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