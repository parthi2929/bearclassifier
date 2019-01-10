import zerorpc

from pymodel import FastaiImageClassifier

class PyServer(object):
    def __init__(self):
        self.model = FastaiImageClassifier()

    def start_pyserver(self):        
        return "Py server started"

    def predict_image(self, image_path):         
        result =  self.model.predict(image_path)        
        return  str(result)        # apparantly this explicit conversion needed to properly receive in nodejs
        # return 'all is well'

s = zerorpc.Server(PyServer())
s.bind("tcp://0.0.0.0:4242")
s.run()