//1. Import
var express = require('express');
var path = require('path');
var routes = require('./routes/route.js');
var zerorpc = require("zerorpc");
const spawn = require('child_process').spawn;
const http = require('http');
const multer = require('multer');

//https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //saving with file extension 
    }
  })
  
var upload = multer({ storage: storage });

const fs = require('fs'); // to clean up the file


//2. Initiate
const hostname = '127.0.0.1';
var app = express();


//3. Configure
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));


//4. Routing
app.get("/",routes.home);



//---- PYTHON STUFF -----
//start python server
var server = spawn('python', ['pyserver.py']);
var client = new zerorpc.Client();
if (server != null)
{
    console.log('Py server called');   // server call initiation success
}

// connect nodejs as client for python server    
client.connect("tcp://127.0.0.1:4242");
client.on("error", function(error) {
    console.error("RPC client error:", error);     // error connecting from client
});
client.invoke("start_pyserver", function(error, res, more) {
    console.log(res);                              // server response as per method invoked
});
//---- END OF PYTHON STUFF -----

//---- FILE UPLOAD ----
// It's very crucial that the file name matches the name attribute in your html
var global_res;
app.post('/upload', upload.single('file-to-upload'), (req, upload_res) => {

    if (req.file != null)  // if no resubmission of same data..
    {

        const {path} = req.file;
        console.log(path);
        
        // call dummy test function (predict image) - shall comemnt it once main call implemented
        client.invoke("predict_image", path, function(error, res, more) {

            console.log('the prediction from python server is ' + res);

            // render same index page with success message
            // res.json('success');
            upload_res.render('home',{
                title:"Image Classifier",
                msg: 'Image contains a ' + res + ' bear'
            });        
            
            // delete the uploaded file (regardless whether prediction successful or not)
            // need to delete only after our job is done so placing it here. 
            fs.unlink(path, (err) => {
                if (err) console.error(err)
                console.log('Cleaned up', path)
            });

            //if no more to stream from python its done
            if(!more) {
                console.log("Done.");
            }

            global_res = res;

        });       
    }
    else
    {
        upload_res.render('home',{
            title:"Image Classifier",
            msg: 'Image contains a ' + global_res + ' bear'
        }); 
    }
    
});



//5. Listen
var port = process.env.PORT || 8080;
var server = app.listen(port,hostname,
    function(request,response)
    {
        console.log(`Node Server started. Running at http://${hostname}:${port}/`);
    }
);