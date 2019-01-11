'''
Modified from: https://github.com/navjotts/node-python/blob/5b0b86a755bcf79e1ebf77e29324522f30f23763/model_fastai.py
'''
from pathlib import Path
import fastai
from fastai import *
from fastai.vision import *
from fastai.core import *



# SETUP HERE
YOUR_CLASSES_HERE = ['black', 'grizzly', 'teddys'] # Your class labels
NAME_OF_PTH_FILE = 'stage-2' # Name of your exported `.pth` file 
PATH_TO_MODELS_DIR = Path('.') # by default just use /models in root dir

class FastaiImageClassifier(object):
    def __init__(self):
        print('fastai version: {}'.format(fastai.__version__ ))
        defaults.device = torch.device('cpu')
        self.learner = self.setup_model(PATH_TO_MODELS_DIR, NAME_OF_PTH_FILE, YOUR_CLASSES_HERE)
        print('model created')

    def setup_model(self, path_to_pth_file, learner_name_to_load, classes):
        "Initialize our learner for inference"

        print('creating learner')
        data = ImageDataBunch.single_from_classes(
            path_to_pth_file, classes, 
            tfms=get_transforms(), 
            size=64).normalize(imagenet_stats)

        learner = create_cnn(data, models.resnet34).load(learner_name_to_load)
        
        
        print('created learner')
        return learner    
    
    def predict(self, img_path):

        img = open_image(Path(img_path))
        pred_class, pred_idx, losses = self.learner.predict(img)

        print('Class pred:', pred_class)
        print('Pred-idx:', pred_idx)
        print('Losses:', losses)

        # return { 'predict': pred_class }    
        # return 'testing return value'
        return pred_class