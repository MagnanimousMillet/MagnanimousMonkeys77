var cred = require('./watsonCredentials.js');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
// var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud');


var nlu = new NaturalLanguageUnderstandingV1({
  username: cred.username,
  password: cred.password,
  version_date: '2017-02-27'
});


var pluckKeywords = (req, res, next) => {
  var results;
  var parameters = {
    'text': req.body.question,
    'features': {
      'keywords': {
        'sentiment': false,
        'emotion': false,
        'limit': 1
      }
    }
  };

  nlu.analyze(parameters, function(err, response) {
  if (err) {
    console.log('error:', err);
  } else {
    // JSON.stringify(response, null, 2);
    req.body.keyword = response.keywords[0].text;
  }
  next();
  });
}

module.exports = pluckKeywords;
