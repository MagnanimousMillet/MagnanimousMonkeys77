var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var db = require('../database-mysql');
var google = require('./middleware/googleAuth.js');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var keywords = require('./middleware/keywords.js')
//var data = require('./middleware/thumbsData.js');

const port = process.env.PORT || 3000;
// const port = 3000;

server.listen(port);

var lectureId = '';
var questionId = '';
var thumbs = '';
var instructorId = '';  // this will be the socket.id

app.use(express.static(__dirname + '/../react-client/dist'));

app.use(bodyParser.json());

app.get('/data', (req, res) => {
  db.databasePull().then(data => res.send(data));
});

app.get('/login', (req, res) => {
  var googleResults;
  google.verifyToken(req.query.tokenId, '745992232545-a8c7pi5g0eoivjcmho0bdui4ui46d9vb.apps.googleusercontent.com')
  .then(fromGoogle => {
    googleResults = fromGoogle;
    console.log(googleResults);
    return db.getUserType(fromGoogle.gmail);
  })
  .then(result => {
    if (result.length === 0) {
      //add user to db
      console.log(`add user to db, ${googleResults.gmail}`);
      return db.addStudent(googleResults.first, googleResults.last, googleResults.gmail);
    } else {
      res.status(200).send(result);
      throw ('early exit from promise chain');
    }
  })
  .then(result => {
    return db.getUserType(googleResults.gmail);
  })
  .then(result => {
    res.status(201).send(result);
  })
  .catch(err => {
    console.log(err);
  })
})

app.get('/getDataForVisualization', (req, res) => {
  let email = req.query.useremail;
  console.log('test the email: ', email);
  db.getDataForVisualization(email)
  .then(results => {
    res.send({ results: results });
  })
})

app.post('/lecture', (req, res) => {
  let name = req.query.name;
  let username = req.query.username;
  console.log(name);
  console.log(username);
  db.createNewLecture(name,username)
  .then(results => {
    lectureId = results.insertId;
    res.send({ lectureId: lectureId });
    io.emit('lectureStarted', {
      lectureId: lectureId,
      lectureName: name
    })
  })
})

app.use('/checkthumbs', keywords);

app.post('/checkthumbs', (req, res) => {
  let lecture = req.query.lecture_id || 0;
  var question = req.body.question;
  var keyword = req.body.keyword;
  db.createNewQuestion(lecture, question, keyword)
  .then(results => {
    questionId = results.insertId;
    thumbs = new ThumbsData(lectureId, questionId);
    //Emit the new question to students here
    io.emit('checkingThumbs', { questionId: questionId });
    //This will add thumbsdata in the db after the question ends

    // setTimeout(() => {

    // }, 3200);

    //send the response to the teacher
    res.send({ questionId: questionId });
    res.end();
  });
})

app.post('/interrupt', (req, res) => {
  io.emit('interrupt', {questionId: req.query.question_id});
  for (let student in thumbs.students) {
    //console.log(`${thumbs.students[student].gmail}, ${thumbs.questionId}, ${thumbs.students[student].thumbValue}`);
    db.createThumbData(thumbs.students[student].gmail, thumbs.questionId, thumbs.students[student].thumbValue);
  }
  db.addAvgThumbForQuestion(questionId, thumbs.getAverageThumbValue());
})

app.post('/endLecture', (req, res) => {
  let lecture = req.query.lectureId;
  // calculate the average for all thumbs in lecture
  // and store it in the database
  io.emit('lectureEnded', { response: 'ok' });

  db.getAvgThumbsForQuestionsInLecture(lectureId)
  .then(results => {
    console.log(results);
    let sum = 0;
    let avg = 0;
    for (let i = 0; i < results.length; i++) {
      sum += results[i].average_thumb_question;
    }
    avg = (sum / results.length);
    db.addAvgThumbForLecture(lectureId, avg);
  });
  res.status(200).send('end lecture');
});

io.on('connection', function (socket) {
  console.log(`socket: ${socket}`);

  //put the gmail username on each socket that is connected
  socket.on('username', function(data) {
    console.log('username', data);
    socket.username = data.username;
  });

  socket.on('instructor', data => {
    instructorId = socket.id;
    socket.instructor = data.username;
    console.log(`the instructor is: ${socket.instructor}`);

  })

  //recieve the thumb value from the student
  socket.on('thumbValue', data => {
    if (thumbs) {
      if (!thumbs.hasStudent(socket.username)) {
        let student = new Student(socket.username, socket.id);
        thumbs.addStudent(student);
      }
      thumbs.setThumbValueForStudent(socket.username, data.thumbValue);
      let average = thumbs.getAverageThumbValue();
      io.emit('averageThumbValue', { averageThumbValue: average });
      console.log(`sending averageThumbValue of ${average}`);
      console.log(`thumb value for ${socket.username} is ${data.thumbValue}`);
    }
  })
});

class ThumbsData {
  constructor(lectureId, questionId, instructor) {
    this.lectureId = lectureId;
    this.questionId = questionId;
    this.students = {};
    this.instructor = instructor;
  }

  //adds a student to the data structure
  addStudent(student) {
    this.students[student.gmail] = student;
  }

  //sets the thumb value for the student
  setThumbValueForStudent(gmail, thumbValue) {
    this.students[gmail].thumbValue = thumbValue;
  }

  //returns the average thumb value
  getAverageThumbValue() {
    let count = 0;
    let total = 0;
    for (let student in this.students) {
      if (this.students[student].thumbValue || this.students[student].thumbValue === 0) {
        count++;
        total += this.students[student].thumbValue;
      }
    }
    return total / count;
  }

  //check if a student is connected
  hasStudent(gmail) {
    return this.students.hasOwnProperty(gmail);
  }
}

class Student {
  constructor(gmail, socketId) {
    this.gmail = gmail;
    this.socketId = socketId;
    this.thumbValue = null;
  }
}
