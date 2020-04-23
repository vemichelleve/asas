# Automated Short Answer Scoring

## Requirements

The code is written in [Python 3.7](https://www.python.org/), and it needs to be run inside a virtual environment to isolate package installation from the system. Hence, Package manager, [pip](https://pip.pypa.io/en/stable/installing/), and [virtual environment](https://pypi.org/project/virtualenv/) is required in this project.

### Backend dependencies
* [Django](https://docs.djangoproject.com/en/3.0/topics/install/)
* [Django REST framework](https://www.django-rest-framework.org/#installation)
* [django-cors-headers](https://pypi.org/project/django-cors-headers/)

#### Machine learning libraries
* [TensorFlow 1.13.1](https://www.tensorflow.org/install/pip?lang=python3)
* [pandas](https://pandas.pydata.org/getting_started.html)
* [NumPy](https://numpy.org/)
* [Keras 2.1.0](https://keras.io/)
* [scikit-learn](https://scikit-learn.org/stable/install.html)
* [nltk](https://www.nltk.org/install.html)

### Frontend dependencies
* [npm](https://www.npmjs.com/get-npm)
* [React](https://reactjs.org/docs/getting-started.html)

### Required files
Download [GloVe](https://www.kaggle.com/thanakomsn/glove6b300dtxt) and save it inside the directory.

## Deployment
Open [Installing Guide](https://github.com/vemichelleve/fypcode/blob/master/Guide.pdf) for more detailed guide on how to run on remote server.

1. Activate virtual environment.
2. Run Django server
```
python3 manage.py runserver
```
3. Run React
```
npm start
```
4. Access website at [localhost](http://localhost:3000/)