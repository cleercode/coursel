window.app = {}
app.controllers = {}
app.models = {}
app.collections = {}
app.views = {}

Courses = require('collections/courses_collection').Courses
MainController = require('controllers/main_controller').MainController
HomeView = require('views/home_view').HomeView
CoursesView = require('views/courses_view').CoursesView
CourseView = require('views/course_view').CourseView

$.getJSON 'fall2011.json', (data) -> app.courses = data

# app bootstrapping on document ready
$(document).ready ->
  app.initialize = ->
    app.collections.courses = new Courses()

    app.controllers.main = new MainController()
    app.views.home = new HomeView()
    app.views.courses = new CoursesView

    Backbone.history.saveLocation("home") if Backbone.history.getFragment() is ''
  app.initialize()
  Backbone.history.start()