# **Inventory Monitoring System**

This system consists of three main components:  
 1. **Flask API** (UV-packaged Python backend for anomaly detection & DB operations)  
 2. **Laravel Gateway Backend** (acts as middleware between Flask API and frontend)  
 3. **Next.js Frontend** (user interface)

It also uses **PostgreSQL** as the database. Install all necessary prerequisites if you do not have Python, UV, Laravel, Next.js, or PostgreSQL in your system.

## **SETUP GUIDE**

### Step 1: Import the database

1. Make sure you have PostgreSQL installed and running with pgadmin4.
2. Copy the _.sql_ file in the Flask API's _schema/_ folder.
3. follow the steps provided in this [video](https://www.youtube.com/watch?v=NuPSz1_Yb1g).

### Step 2: Install the dependencies for all components

1. For the Flask API:
   **_uv_** automatically installs the dependencies listed in the _pyproject.toml_ file, so just run the server by going into the project folder with:

```
cd barcode-scan-flask/python-microservice
```

and type:

```
uv run app.py
```

2. For the Laravel Backend Middleware:
   open the new terminal, go to the project folder with:

```
cd inventory-backend-laravel/backend
```

and install the dependencies with:

```
composer install
```

3. For the Frontend Webpage:
   open a new terminal, go to the project folder with:

```
cd dashboard-visuals/inventory-dashboard
```

and install the dependencies with:

```
npm install
```

### Step 3: Set up the environment variables in Flask

1. Navigate to the root project folder for the Flask API project, which would be the _'python-microservice/'_ folder
2. Add a _.env_ file inside the folder
3. Follow the template provided by the _.env.example_ file and set up your Flask API port and your PGSQL URL
4. Save the file

### Step 4: Running the System

1. Go to the terminal where you accessed your Laravel Folder and boot up the middleware with:

```
php artisan serve
```

2. Go to the terminal where you access your Next.js Folder and boot up the frontend website with:

```
npm run dev
```

3. Open the localhost or the network URL provided by the Next.js terminal in your chosen browser.
