# Automated Short Answer Scoring

## Requirements

The code is written in [Python](https://www.python.org/), and it needs to be run inside a virtual environment to isolate package installation from the system.

### Backend dependencies
* [pip](https://pip.pypa.io/en/stable/installing/)
* [virtualenv](https://pypi.org/project/virtualenv/)
* [Django](https://docs.djangoproject.com/en/3.0/topics/install/)
* [Django REST framework](https://www.django-rest-framework.org/#installation)
* [django-cors-headers](https://pypi.org/project/django-cors-headers/)
#### Machine learning libraries
* [TensorFlow](https://www.tensorflow.org/install/pip?lang=python3)
* [pandas](https://pandas.pydata.org/getting_started.html)
* [NumPy](https://numpy.org/)
* [Keras 2.2.2](https://keras.io/)
* [scikit-learn](https://scikit-learn.org/stable/install.html)
* [nltk](https://www.nltk.org/install.html)

### Frontend dependencies
* [npm](https://www.npmjs.com/get-npm)
* [React](https://reactjs.org/docs/getting-started.html)

## Usage

Open [Installing Guide](https://github.com/vemichelleve/fypcode/blob/master/Guide.pdf) for more detailed guide on how to run on remote server.

### Install backend dependencies
1. Install pip
```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```
2. Create and activate virtual environment
```
pip install virtualenv
virtualenv --system-site-packages -p python3 ./venv
source ./venv/bin/activate
```
3. Install Django and its frameworks
```
pip install django
pip install djangorestframework
pip install django-cors-headers
```
4. Install machine learning libraries
```
pip install tensorflow==1.12.0
pip install pandas
pip install numpy
pip install keras==2.2.2
pip install nltk
pip install scikit-learn
```
_Note: Install tensorflow-gpu to run using GPU with CUDA 9.1 installed_
5. Download stopwords from nltk
```
python
>>> import nltk
>>> nltk.download('stopwords')
```

### Install frontend dependencies
1. Download and install Node.js and npm from the [website](https://www.npmjs.com/get-npm)
2. Install React
```
npm install react
```

### Running a local copy
1. Make sure virtual environment is activated
2. Run Django server
```
python3 manage.py runserver
```
3. Run React
```
npm start
```
4. Access website at [localhost](http://localhost:3000/)