var request = require('request');
const frisby = require('frisby');
var helloWorld = require('../app.js');
var base_url = "http://localhost:3000/"
const Joi = frisby.Joi; // Frisby exposes Joi for convenience

// memdown is an in memory db that disappears when you restart the process
var memdown = require('memdown');

var db = new memdown('srp');

var testUser = {
    email: 'found@gmail.com',
    salt: '1234',
    verifier: '5678' 
};

db.put(testUser.email, JSON.stringify(testUser), function (err) {
    if (err) throw err
})

describe("SRP Secured Server", function() {

  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Thinbus Secure Remote Password Demo", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain("Thinbus Secure Remote Password Demo");
        done();
      });
    });
  });

  describe("load of user salt", function() {
    it('should return a 400 for bad request of no email', function (done) {
      frisby.get(base_url+'load')
        .expect('status', 400) 
        .done(done);
    });

    it('should return a 204 for user not found', function (done) {
      frisby.get(base_url+'load?email=notfound@gmail.com')
        .expect('status', 204) // https://stackoverflow.com/a/11760249/329496
        .done(done);
    });

    /**
     * Note that this checks that the verifier is not accidently sent to the server. 
     */
    it('should return a 204 for user not found', function (done) {
      frisby.get(base_url+'load?email='+testUser.email)
        .expect('status', 200) // https://stackoverflow.com/a/11760249/329496
        .then(
          function(res){
            expect(res.json.email).toBe('found@gmail.com');
            expect(res.json.salt).toBe('1234');
            expect(typeof res.json.verifier).toBe('undefined');
          }
        )
        .done(done);
    });
  });

  // describe("save of user detals", function() {
  //   if('should return a 422 for bad put with no email', function(done){
  //     frisby.post(base_url+'save', ).expect('status', 422).done(done);
  //   });
  // })

  
  // describe("GET /", function() {
  //   it("returns status code 200", function(done) {
  //     request.get(base_url, function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       done();
  //     });
  //   });

    // it("returns Thinbus Secure Remote Password Register Demo", function(done) {
    //   request.get(base_url, function(error, response, body) {
    //     expect(body).toContain("Thinbus Secure Remote Password Register Demo");
    //     helloWorld.closeServer();
    //     done();
    //   });
    // });

    // it("has a form that posts to the save page", function(done) {
    //   request.get(base_url, function(error, response, body) {
    //     expect(body).toContain('<form action="/save" method="post">');
    //     expect(body).toContain('name="email"');
    //     expect(body).toContain('name="salt"');
    //     expect(body).toContain('name="verifier"');
    //     helloWorld.closeServer();
    //     done();
    //   });
    // });
  // });
});