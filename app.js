const express = require('express'); //init
const app = express(); // make instance 

const server = require('http').createServer(app);  //create server
const cors = require('cors'); //middleware

const io = require('socket.io')(server,{  //server,options object
    cors : {
        origin : "*", //allow access from all origins
        methods : ["GET", "POST"]
    }
});
//call cors
app.use(cors());

const PORT = process.env.PORT || 4000;

//first route
app.get('/', (req,res) => {
 res.send("Server is live!");
});

//socket - used for real time data transmission
io.on('connection',(socket) => {
//once connection established emit something
    socket.emit('me' , socket.id); // which gives our own id to the front encodeurl
//disconnect
    socket.on('disconnect',() => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser" , ({userToCall,signalData,from,name}) => {
        io.to(userToCall).emit("callUser",{signal : signalData,from,name});
    });

    socket.on("answerCall" ,(data)=>{
        io.to(data.to).emit("callAccepted",data.signal);
    });
});


server.listen(PORT, console.log(`Server running on port ${PORT}`));
