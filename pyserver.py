import zerorpc
import os
from pymodel import FastaiImageClassifier

class PyServer(object):
    # def __init__(self):
        # return "Py server initiated"

    def start_pyserver(self):        
        self.model = FastaiImageClassifier()
        return "Py server started"

    def predict_image(self, image_path): 
        result =  self.model.predict(image_path)        
        return  str(result)        # apparantly this explicit conversion needed to properly receive in nodejs
        # return 'all is well'

s = zerorpc.Server(PyServer(),heartbeat=10)
s.bind("tcp://0.0.0.0:4242")
s.run()