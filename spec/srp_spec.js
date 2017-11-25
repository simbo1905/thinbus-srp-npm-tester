var request = require("request");
var helloWorld = require("../app.js")
var base_url = "http://localhost:3000/"

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
        expect(body).toContain('name="verifier"');
        helloWorld.closeServer();
        done();
      });
    });
  });
});