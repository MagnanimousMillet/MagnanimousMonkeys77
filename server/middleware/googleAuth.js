var GoogleAuth = require('google-auth-library');

var auth = new GoogleAuth;
var client = new auth.OAuth2('745992232545-a8c7pi5g0eoivjcmho0bdui4ui46d9vb.apps.googleusercontent.com','S29-kguq_cm1Bpr2owhz56_N', 'https://check-thumbs.herokuapp.com/');



const verifyToken = function(token, clientID) {
  return new Promise ((resolve, reject) => {
    client.verifyIdToken(
      token, 
      clientID,
      (e, login) => {
        if (login) {
         var payload = login.getPayload();
         var gmail = payload['email'];
         var first = payload['given_name'];
         var last = payload['family_name'];
         var result = {
          gmail: gmail,
          first: first,
          last: last 
         }
         resolve(result);
       } else {
        reject("invalid token");
       }
      }
    )
  })
}

module.exports.verifyToken = verifyToken;

