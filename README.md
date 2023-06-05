# multonion
to run the project you can clone and run npm install.
the main suite uses npm start 
the test suite can be assessed with npm test

I did not used any external apis so that anybody that wants to use or review the project would not have to to go and create an account somewhere to get keys to run the project.

#I was unable to set up docker on my local machine I sincerely apologise for that 

the project has two routes 
the first one for returning all available countries can be accessed by entering 
url="http://localhost:3000/" on a browser or via a get request on postman 

the second one for scheduling meetings can be accessed by entering 
url="http://localhost:3000/setmeeting?input=[{"from":"2023-09-10T09:00:00.0+01:00","to":"2023-09-10T17:00:00.0+01:00","CC":"ng"},{"from":"2023-09-10T09:00:00.0+08:00", "to":"2023-09-10T17:00:00.0+08:00", "CC":"SG"}]"

note the input is the required query paremeter and please use JSON format on the objects to enable it run smoothly 

The api takes into account public holidays and weekends

To run the app in Docker
1  build the image by using the docker build-t <projectname> .
2  docker run -p 9000:3000  multonion-interview <projectname>
