import bcrypt

password = "test"
hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

print(hashed_pw)