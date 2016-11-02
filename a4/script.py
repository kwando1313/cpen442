import hashlib
program_name = "92859115.program2.exe"


newPassword = input("Put in the new password.")
m = hashlib.sha1()
m.update(newPassword.encode('utf-8'))
print(m.hexdigest())
location = 0x01e000 + 0x03
passwordByteArray = bytes(bytearray.fromhex(m.hexdigest()))

f = open(program_name, "r+b")
f.seek(location, 0)
print(f.read(20))
f.seek(location, 0)
f.write(passwordByteArray)
f.seek(location, 0)
print(f.read(20))
f.close()

print("Complete!")