# Redditgram

This project combines a Django REST backend with a React frontend.

## Setup
Install the backend dependencies using the provided helper script:

```bash
./setup.sh
```

This script creates a virtual environment in `env/` and installs the packages
listed in `requirements.txt`.

If you prefer to set up manually, run:

```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

## Running the backend

Activate the virtual environment and start the Django development server:

```bash
source env/bin/activate
cd backend
python manage.py migrate
python manage.py runserver
```

## Running the frontend

Install the Node dependencies and start the React dev server:

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the backend URLs from the environment variables
`VITE_API_BASE_URL` and `VITE_WS_BASE_URL`. If not provided, they default to
`http://localhost:9000/api` and `ws://localhost:9000` respectively.

The application will be available at `http://localhost:5173` by default. Build a
production bundle with `npm run build` and preview it locally using `npm run preview`.

## Running tests

Run backend tests from the `backend` directory:

```bash
source env/bin/activate
cd backend
python manage.py test
```

Run frontend tests using `npm`:

```bash
cd frontend
npm test
```
