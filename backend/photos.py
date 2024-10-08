import gdown

url = 'https://drive.google.com/uc?id=1EB1dsXmsMmnJvec-i9Cyk98bzKYQ9vMX'
output = 'picworks.jpeg'

# Download the JPEG file
gdown.download(url, output, quiet=False)
