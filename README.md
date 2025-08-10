## Project Setup
### Run the Project
Create a ```Dockerfile``` in the frontend folder and the backend folder, and a ```docker-compose.yml``` file in the ```/usr/app``` folder. See the github repository for the content of these files. 
Run the following commands to build and run the frontend and backend images:
```
docker-compose build
docker-compose up 
```

### Create Frontend and Backend
(P.S.: I am using npm installed in WSL directily now, so ignore the node:22-ubuntu22.04 docker part.)
- Spin up the development environment. Change directory to the parent folder of the app and run the following command
```
docker run -it --name <Dev Env Name> -v .:/usr/app cyqian97/node:22-ubuntu22.04 bash
```
- Create a react frontend app. In the development container, run: 
```
cd /usr/app
npm init react-app --legacy-peer-deps <Frontend Name>
npm install --legacy-peer-deps ajv@^8
```
This step installs all necessary packages in the frontend folder. The ```npm install``` process takes forever in the ```node:22-alpine``` docker image, so I created the ```cyqian97/node:22-ubuntu22.04``` image to handle all the npm installations. This can avoid the ```npm install``` process in the latter ```docker-compose up``` step.
- Create a flask backend. Still in the container, run
```
mkdir <Backend Name> && cd <Backend Name>
python3 -m venv venv
source venv/bin/activate
pip install flask flask-sqlalchemy
```

## Frontend
### Configure Backend Url
The backend url is set in the ```.env.development``` and ```.env.production``` files.
The first file is used when the frontend docker runs ```npm start```; the second is used when ```npm run build``` is executed.

### Add New Package
After add a new package to the frontend environment, a re-build of the docker image is required.
Below is a precedure that tested to be safe:
```
docker compose down
rm -rf barista-app/node_modules
docker compose build --no-cache
docker compose up
```