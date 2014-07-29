
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/images' }));

app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// app.configure(function() {
//   app.use(express.bodyParser({
//     uploadDir:"./public/images/",
//     keepExtensions:true,
//     limit:10000000, //10M limit
//     defer:true  //enable event
//   }));
// });

// app.post('/upload', function(req, res) {
//   req.form.on('progress', function(bytesReceived, bytesExpected){
//     console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");  //显示上传进度
//   });
//   req.form.on('end', function () {
//     console.log(req.files);
//     res.send("done");
//   });
// });

app.get('/upload', function (req, res) {
    res.render('upload', {
      title: '文件上传',
    });
});

// app.post('/upload', function (req, res) { 

  for (var i in req.files) { 
    if (req.files[i].size == 0){
      // 使用同步方式删除一个文件
      fs.unlinkSync(req.files[i].path);
      console.log('Successfully removed an empty file!');
    } else {
      var target_path = './public/images/' + req.files[i].name;
      // 使用同步方式重命名一个文件
      fs.renameSync(req.files[i].path, target_path);
      console.log('Successfully renamed a file!');
    }
  }

  //req.flash('success', '文件上传成功!');
  // res.render('upload',{
  //   success: 'success'
  //  });
  res.redirect('/upload');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

