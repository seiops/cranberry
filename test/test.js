var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var superagent = require('superagent');
var mocha = require('mocha');
var suite = mocha.Suite;


//Always pass test
describe('String#split', function(){
  it('should return an array', function(){
    assert(Array.isArray('a,b,c'.split(',')));
  });
})

//Always fail test
// describe('String Failure Test', function(){
//   it('Test equality of two strings', function(){
//     assert.equal('Mike', 'Mike123');
//   });
// })

//simple get request using superagent
describe("passing browser", function() {  
    
    it("response is 200", function(done) {
        superagent
            .get('http://www.google.com')
            .end(function(err, res){
              assert(res.status == 200);
              done();
        });
    });

    it("response is type text/html", function(done) {
        superagent
            .get('http://www.google.com')
            .end(function(err, res){
              assert(res.type == 'text/html');
              done();
        });
    });
    
});