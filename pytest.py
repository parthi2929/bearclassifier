from pymodel import FastaiImageClassifier


model = FastaiImageClassifier()

image_path = 'uploads/test.jpg'

result = model.predict(image_path)

print(result)