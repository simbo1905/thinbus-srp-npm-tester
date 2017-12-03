var request = require("request");
const frisby = require('frisby');
var helloWorld = require("../app.js")
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

  describe("frisby", function() {

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

    it('should return a test user', function (done) {
      frisby.get(base_url+'load?email='+testUser.email)
        .expect('status', 200)
        .then(function (res) {
          expect(res.json.email).toBe('found@gmail.com');
          expect(res.json.salt).toBe('1234');
          expect(res.json.verifier).toBe('5678');
        })
        .done(done);
    });

  });

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
        helloWorld.closeServer();
        done();
      });
    });

    it("has a link to the register page", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain('href="register.html"');
        helloWorld.closeServer();
        done();
      });
    });

    it("has a link to the login page", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain('href="login.html"');
        helloWorld.closeServer();
        done();
      });
    });
  });
  describe("GET /register.html", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Thinbus Secure Remote Password Register Demo", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain("Thinbus Secure Remote Password Register Demo");
        helloWorld.closeServer();
        done();
      });
    });

    it("has a form that posts to the save page", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain('<form action="/save" method="post">');
        helloWorld.closeServer();
        done();
      });
    });
  });

  describe("POST /register.html", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Thinbus Secure Remote Password Register Demo", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain("Thinbus Secure Remote Password Register Demo");
        helloWorld.closeServer();
        done();
      });
    });

    it("has a form that posts to the save page", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain('<form action="/save" method="post">');
        expect(body).toContain('name="email"');
        expect(body).toContain('name="salt"');
        expect(body).toContain('name="verifierX"');
        helloWorld.closeServer();
        done();
      });
    });
  });


  
});