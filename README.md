# evaluate

## Run the project

Clone code from repo:

`git clone https://github.com/predatell/evaluate`

In terminal go to **evaluate** directory:

`cd evaluate`

Runs the app in the development mode:

`docker-compose up --build`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## Unit tests

To run unit tests go to **backend** directory and input:

`python manage.py test evaluate`


## Adding more functions for evaluation algebraic expressions:

You can add more function like **abs**, **len** in the settings `ALLOWED_NAMES` in file:

`backend/backend/settings.py`


## Creation superuser for using admin interface:

In console from directory **backend** run the command:

`python manage.py createsuperuser`

Open [http://localhost:3000/admin/](http://localhost:3000/admin/) to view admin in your browser.
