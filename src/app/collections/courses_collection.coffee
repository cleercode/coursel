Course = require('models/course_model').Course

class exports.Courses extends Backbone.Collection

  model: Course

  initialize: ->
    @localStorage = new Store 'courses'

  comparator: (course) ->
    course.get('name')

  every: ->
    @filter((course) -> true)

  qpa: ->
    units = 0
    qp = 0
    @each((course) ->
      units += course.get 'units'
      qp += course.qp())
    (qp / units).toFixed(2)

  formatName: (name) ->
    if /^\d{5}$/.test name
      name = name.substring(0, 2) + '-' + name.substring(2)
    name

  formatUnits: (name) ->
    if app.courses && app.courses[name]
       app.courses[name].units
    else 9