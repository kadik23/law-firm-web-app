# law-firm-web-app
use http://localhost:8080/api-docs/


# To run backend in docker: 
1- delete node_modules folder
2- docker build: ```docker build -t express-app -f Dockerfile.express .```
3- run both express server and mysql server: ```docker run -p 5000:5000 express-app```

# NOTE: this is just if you want to test it in docker so no need to use it always in develepment mode (it's just for production mode), use npm and your localhost mysql
