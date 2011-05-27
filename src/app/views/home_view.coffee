homeTemplate = require('templates/home')

class exports.HomeView extends Backbone.View
  id: 'home-view'
  
  events:
    'keypress #course_input': 'createOnEnter'
    'click #add_course': 'createCourse'
    'click #reset': 'reset'

  render: ->
    $(@el).html(homeTemplate())
    @

  newAttributes: (name) ->
    name = app.collections.courses.formatName name
    name: name
    units: app.collections.courses.formatUnits name
    grade: 4

  createCourse: (e) ->  
    if @$('#course_input').val() isnt ''
      app.collections.courses.create @newAttributes @$('#course_input').val()
      @$('#course_input').val('')
    e.preventDefault()

  createOnEnter: (e) ->
    if e.keyCode is 13
      @createCourse(e)

  reset: (e) ->
    _.each(app.collections.courses.every(), (course) -> course.clear())
    e.preventDefault()