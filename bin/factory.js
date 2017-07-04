// Run this to generate data.json
var fs      = require('fs')
var _       = require('underscore')
var Factory = require('rosie').Factory
var Faker   = require('faker')
var db      = {}

// Credit http://www.paulirish.com/2009/random-hex-color-code-snippets/
function hex() {
  return Math.floor(Math.random()*16777215).toString(16)
}

// Tables
db.posts    = []
db.comments = []
db.albums   = []
db.photos   = []
db.users    = []
db.todos    = []

// Factories
Factory.define('post')
  .sequence('id')
  .attr('title', function() {return Faker.lorem.sentence()})
  .attr('body', function() {return Faker.lorem.sentences(4)})

Factory.define('comment')
  .sequence('id')
  .attr('name', function() {return Faker.lorem.sentence()})
  .attr('email', function() {return Faker.internet.email()})
  .attr('body', function() {return Faker.lorem.sentences(4)})

Factory.define('album')
  .sequence('id')
  .attr('title', function() {return Faker.lorem.sentence()})

Factory.define('photo')
  .sequence('id')
  .attr('title', function() {return Faker.lorem.sentence()})
  .option('color', hex())
  .attr('url', [ 'color' ], function(color) {
    return 'http://placehold.it/600/' + color
  })
  .attr('thumbnailUrl', [ 'color' ], function(color) {
    return 'http://placehold.it/150/' + color
  })

Factory.define('todo')
  .sequence('id')
  .attr('title', function() {return Faker.lorem.sentence()})
  .attr('completed', function() { return _.random(1) ? true : false})

Factory.define('user')
  .sequence('id')
  .after(function(user) {
    var card = Faker.helpers.userCard()
    _.each(card, function(value, key) {
      user[key] = value
    })
  })

// Has many relationships
// Users
_(1).times(function () {
  var user = Factory.build('user') 
  db.users.push(user)

  // Posts
  _(5).times(function() {
    // userId not set in create so that it appears as the last
    // attribute
    var post = Factory.build('post', {userId: user.id})
    db.posts.push(post)
    
    // Comments
    _(5).times(function () {
      var comment = Factory.build('comment', {postId: post.id})
      db.comments.push(comment)
    })
  })

  // Albums
  _(1).times(function() {
    var album = Factory.build('album', {userId: user.id})
    db.albums.push(album)

    // Photos
    _(5).times(function() {
      var photo = Factory.build('photo', {albumId: album.id})
      db.photos.push(photo)
    })
  })

  // Todos
  _(5).times(function() {
    var todo = Factory.build('todo', {userId: user.id})
    db.todos.push(todo)
  })
})

fs.writeFileSync('./db/db.json', JSON.stringify(db, null, 2));
