
// RFC 5054 2048bit constants
const rfc5054 = {
    N_base10: "21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819",
    g_base10: "2", 
    k_base16: "5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300"
}

// generate the server session class from the server session factory closure
const SRP6JavascriptServerSession = require('thinbus-srp/server.js')(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var exports = module.exports = {};

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname } );
});

app.get('/register.html', function(req, res){
  res.sendFile('register.html', { root: __dirname } );
});

app.get('/login.html', function(req, res){
  res.sendFile('login.html', { root: __dirname } );
});

app.get('/srp-client-browserfied.js', function(req, res){
  res.sendFile('srp-client-browserfied.js', { root: __dirname } );
});

// memdown is an in memory db that disappears when you restart the process
var memdown = require('memdown')
var db = new memdown('srp')

// var testUser = {
//     email: 'found@gmail.com',
//     salt: '1234',
//     verifier: '5678' 
// };

// db.put(testUser.email, JSON.stringify(testUser), function (err) {
//     if (err) throw err
// })

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/save', urlencodedParser, function(req, res){
  if (!req.body) return res.sendStatus(400)
  
    db.put(req.body.email, req.body.salt + ':' + req.body.verifier, function (err) {
        if (err) throw err
    })

  res.send('Welcome ' + req.body.email + '!. Your salt: ' + req.body.salt + ', your verifier: ' + req.body.verifier);
});

app.get('/load', function(req, res){
    const email = req.query.email

    if( typeof email === 'undefined') {
        return res.sendStatus(400);
    } else {
        db.get(email, { asBuffer: false }, function(err,value){
            if(err) {
                //console.log('user not found:'+email); //in the real world you should leak that fact that a user is or is not a customer a unique and stable set of values for unregistered users.')
                return res.sendStatus(204) // https://stackoverflow.com/a/11760249/329496
            } else {
                res.setHeader('Content-Type', 'application/json');
                // coerse the object to a string to split it
                const result = JSON.parse(value);
                delete result.verifier;
                //console.log(typeof value);
                res.send(JSON.stringify(result));
            }
        })
    }
});

var server = app.listen(3000, function(){
  //console.log('Magic is happening on port 3000');
});

exports.closeServer = function(){
  server.close();
};