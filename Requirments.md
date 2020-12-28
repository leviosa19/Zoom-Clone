# Steps need to create zoom clone

    - Initialize our NodeJS project 
        - npm i init
    - Initialize our first view
        - npm i express
        - npm i ejs
        - nodemon server.js
    - Create a room id
        - npm i uuid
    - Add the ability to view our own video
        _ create script.js to view
    - Add ability to allow others to stream their video
        - use socket.io for realtime stream
        - npm i socket.io
        - npm i peer
    - Add styling
    - Add the ability to create messages
    - Add mute button
    - Add stop video button

# Deploy on Heroku
1. npm i -g heroku
2. heroku git:clone -a zoom-mern
3. git init
4. git add .
5. git commit -m "Updated"
6. git push heroku master
7. heroku ps:scale web=1
8. heroku open