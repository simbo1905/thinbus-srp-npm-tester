
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
  res.set('Content-Type', 'application/javascript');
  res.sendFile('browser.js', { root: __dirname + "/node_modules/thinbus-srp/" } );
});

// memdown is an in memory db that disappears when you restart the process
const memdown = require('memdown')
const db = new memdown('srp')
const cache = new memdown('challenge')

// var testUser = {
//     username: 'found@gmail.com',
//     salt: '1234',
//     verifier: '5678' 
// };

// db.put(testUser.username, JSON.stringify(testUser), function (err) {
//     if (err) throw err
// })

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/save', urlencodedParser, function(req, res){
  if (!req.body) return res.sendStatus(400)
  
    var data = {salt: req.body.salt, verifier: req.body.verifier};

    db.put(req.body.username , JSON.stringify(data), function (err) {
        if (err) throw err
    })

  res.send('Welcome ' + req.body.username + '!</br>You can now attempt to authenticated at <a href="/login.html">the login page</a>.');

});

// this is mostly a diagnostic function used by the frisby tests
app.get('/load', function(req, res){
    const username = req.query.username

    if( typeof username === 'undefined') {
        return res.sendStatus(400);
    } else {
        db.get(username, { asBuffer: false }, function(err,value){
            if(err) {
                //console.log('user not found:'+username); //in the real world you should leak that fact that a user is or is not a customer a unique and stable set of values for unregistered users.')
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

app.post('/challenge', urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400)
    const username = req.body.username

    if( typeof username === 'undefined') {
        return res.sendStatus(400);
    } else {
        db.get(username, { asBuffer: false }, function(err,value){
            if(err) {
                //console.log('user not found:'+username); //in the real world you should leak that fact that a user is or is not a customer a unique and stable set of values for unregistered users.')
                return res.sendStatus(204) // https://stackoverflow.com/a/11760249/329496
            } else {
                res.setHeader('Content-Type', 'application/json');
                
                const result = JSON.parse(value);
                //console.log('loaded: '+JSON.stringify(result));
                const salt = result.salt;
                const verifier = result.verifier;

                // generate the server session class from the server session factory using the safe prime constants
                const SRP6JavascriptServerSession = require('thinbus-srp/server.js')(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);

                // server generates B and b, sends B to client and b to a cache
                var serverWillDie = new SRP6JavascriptServerSession();
                const B = serverWillDie.step1(username, salt, verifier);
                const privateState = serverWillDie.toPrivateStoreState();
                const cacheJson = JSON.stringify(privateState);

                cache.put(username, cacheJson, function (err) {
                    if (err) throw err
                })

                // store the dbJson in a temporary cache or the main DB and await client to respond to challenge B. 
                // return B and salt to the client. 

                var response = {salt: result.salt, B: B};
                //console.log(JSON.stringify(response));
                res.send(JSON.stringify(response));
            }
        })
    }
});

app.post('/authenticate', urlencodedParser, function(req, res){
  if (!req.body) return res.sendStatus(400)
  const creds = req.body.credentials

  if( typeof creds === 'undefined'){
    return res.sendStatus(400);
  } else {
    const credentials = JSON.parse(creds)
    const username = credentials.username
    const A = credentials.A
    const M1 = credentials.M1
    db.get(username, { asBuffer: false }, function(err,value){
    if(err) {
        //console.log('user not found:'+username); //in the real world you should leak that fact that a user is or is not a customer a unique and stable set of values for unregistered users.')
        return res.sendStatus(204) // https://stackoverflow.com/a/11760249/329496
    } else {
        res.setHeader('Content-Type', 'application/json');
        
        const result = JSON.parse(value);
        //console.log('loaded from db: '+JSON.stringify(result));
        const salt = result.salt;
        const verifier = result.verifier;

        cache.get(username, {asBuffer: false}, function(err,cacheJson){
          if( err ) {
            return res.sendStatus(403)
          } else {
            // we now need to load the challenge data from the cache to check the credentials {A,M1}
            const newPrivate = JSON.parse(cacheJson);
            server = new SRP6JavascriptServerSession();
            server.fromPrivateStoreState(newPrivate);

            // the server takes `A`, internally computes `M1` based on the verifier, and checks that its `M1` matches the value sent from the client. If not it throws an exception. If the `M1` match then the password proof is valid. It then generates `M2` which is a proof that the server has the shared session key. 
            try {
              var M2 = server.step2(A, M1)
              console.log("shared key: "+server.getSessionKey())
              var string = encodeURIComponent(M2)
              res.redirect('/home?username='+username+'&M2=' + string);
            } catch (e) {
              return res.sendStatus(403)
            }
          }
        })
    }
    })
  }
});

app.get('/home', function(req,res){
  const username = req.query.username
  res.send('Welcome ' + username + ' you have successfully authenticated!');
});

var server = app.listen(8080, function(){
  console.log('Node has started on port 8080');
});

exports.closeServer = function(){
  server.close();
};