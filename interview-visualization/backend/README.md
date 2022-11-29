### __Setting up virtual environment__

Make sure you begin in the correct folder

`cd interview-visualization`

Create virtual environment

`python3 -m venv venv`

Activate virtual environment

`source venv/bin/activate`

### __Install python libraries__

If the working regraph folder is already installed, delete line 2 of requirements.txt. 

`pip3 install -r requirements.txt`

If you had to download the regraph library using the command above, delete the folders `venv/lib/python3.10/site-packages/`... `neo4j`, `regraph/neo4j`, `regraph/backends/neo4j`, and `regraph/networkx`. 

You may also need to comment out lines 6 and 7 of `regraph/__init__.py`. This will comment out calls to neo4j.

### __Running API__

A command has been added to `package.json` to allow the following command to start the backend.

`npm run start-backend`

The API is running on localhost:5000. The front-end fetches data from the API in `APIService.js`