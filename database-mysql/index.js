var mysql = require('mysql');

var pool  = mysql.createPool(process.env.DATABASE_URL || {
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password :  '',
  database : 'thumbscheck'
});

// console.log(`db connection: DB_HOST ${process.env.DB_HOST}, DB_USERNAME ${process.env.DB_USERNAME}, DB_PASSWORD ${process.env.DB_PASSWORD}, DB_NAME ${process.env.DB_NAME}`);
console.log(`db connection:\n Host: ${pool.config.connectionConfig.host}\n Port: ${pool.config.connectionConfig.port}\n User: ${pool.config.connectionConfig.user}\n Password: ${pool.config.connectionConfig.password}\n Database: ${pool.config.connectionConfig.database}\n`);

exports.databasePull = function() {
  return new Promise ((resolve, reject) => {
    var data = {};
    pool.query('SELECT * FROM thumbs', (err, results) => {
      if (err) console.log(err);
      data.thumbs = results;

      pool.query('SELECT * FROM questions', (err, results) => {
        if (err) console.log(err);
        data.questions = results;

        pool.query('SELECT * FROM users', (err, results) => {
          if (err) console.log(err);
          data.users = results;

          pool.query('SELECT * FROM lectures', (err, results) => {
            if (err) console.log(err);
            data.lectures = results;

            pool.query('SELECT * FROM keywords', (err, results) => {
              if (err) console.log(err);
              data.keywords = results;
              resolve(data);
            });
          });
        });
      });
    });
  });
};

exports.getUserType = function(gmail) {
  return new Promise ((resolve, reject) => {
    pool.query(`SELECT user_type, gmail FROM users WHERE gmail = "${gmail}"`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}

exports.createNewLecture = function(name,username) {
  console.log(username);
  return new Promise ((resolve, reject) => {
    pool.query(`SELECT id FROM users where first_name="${username}"`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        var userID = 0;
        if (results[0]) {
          userID = results[0].id;
        }
        pool.query(`INSERT INTO lectures (name,user_id) VALUES ("${name}","${userID}")`, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
}

exports.createNewQuestion = function(lectureId, question, keyword) {
  return new Promise ((resolve, reject) => {
    pool.query(`SELECT id FROM keywords WHERE name = "${keyword}"`, (err, results) => {
      if (err) {
        console.log(err);
      } else {

        if (results[0]) {
          var keywordId = results[0].id;

          pool.query(`INSERT INTO questions (lecture_id, question, keyword_id) VALUES ("${lectureId}", "${question}", "${keywordId}")`, (err, results) => {
            if (err) {
              console.log(err);
            } else {
              resolve(results);
            }
          });

        } else {

          pool.query(`INSERT INTO keywords (name) VALUES ("${keyword}")`, (err, results) => {
            if (err) {
              console.log(err);
            } else {
              pool.query(`INSERT INTO questions (lecture_id, question, keyword_id) VALUES ("${lectureId}", "${question}", "${results.insertId}")`, (err, results) => {
                if (err) {
                  console.log(err);
                } else {
                  resolve(results);
                }
              });
            }
          });



        }




      }
    });

  })
}

/* Section
*/

exports.addAvgThumbForQuestion = function(questionId, avgThumbValue) {
  return new Promise ((resolve, reject) => {
    pool.query(`UPDATE questions SET average_thumb_question=${avgThumbValue} WHERE id=${questionId}`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}

exports.addAvgThumbForLecture = function(lectureId, avgThumbValue) {
  return new Promise ((resolve, reject) => {
    pool.query(`UPDATE lectures SET average_thumb_lecture=${avgThumbValue} WHERE id=${lectureId}`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}

exports.getAvgThumbsForQuestionsInLecture = function(lectureId) {
  return new Promise ((resolve, reject) => {
    pool.query(`SELECT average_thumb_question FROM questions WHERE lecture_id=${lectureId}`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}


/* Section
*/

exports.createThumbData = function(gmail, questionId, thumbsValue) {
  return new Promise ((resolve, reject) => {
    pool.query(`INSERT INTO thumbs (user_id, question_id, thumb_value) VALUES ((SELECT id FROM users WHERE gmail="${gmail}"), ${questionId}, ${thumbsValue})`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}

exports.getUserId = function(gmail) {
  return new Promise ((resolve, reject) => {
    pool.query(`SELECT id FROM users WHERE gmail = "${gmail}"`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}


exports.addStudent = function(first, last, gmail) {
  return new Promise ((resolve, reject) => {
    pool.query(`INSERT INTO users (first_name, last_name, gmail, user_type) VALUES ("${first}", "${last}", "${gmail}", "STUDENT");`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })
}

exports.getDataForVisualization = function(email) {
  return new Promise ((resolve, reject) => {
    pool.query(`SELECT l.name, q.average_thumb_question FROM lectures as l INNER JOIN questions as q on l.id=q.lecture_id AND l.user_id=(SELECT id FROM users where gmail="${email}")`, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results);
      }
    });
  })

}

//look for lecture name as well.

// test

/*
=======
/* Section
*/

// exports.asyncTimeout = function(time, callback) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       let results = 'no callback';
//       if (callback) {
//         results = callback();
//       }
//       resolve(results);
//     }, time || 1000);
//   });
// }

/* Test Functions

// 1
var prom1 = exports.getUserId('caaker.0@gmail.com');
prom1.then(results => {
  console.log(results[0].id);
});

//2
var prom2 = exports.createThumbData(4, 1, 5);
prom2.then(results => {
  console.log(results);
});

// 3
asyncTimeout(3000, function(){console.log('done')}).then(function(){console.log('continue')})

*/
