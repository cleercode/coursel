CourseView = require('views/course_view').CourseView

class exports.CoursesView extends Backbone.View

  initialize: ->
    $(document).ready ->
      $('#courses').isotope
        itemSelector: '.course'
        masonry:
          columnWidth: 270
        getSortData:
          name: ($elem) -> $elem.find('.name').text()
        sortBy: 'name'
    
    app.collections.courses.bind('add', @addOne)
    app.collections.courses.bind('refresh', @addAll)
    app.collections.courses.bind('all', @updateQpa)
    
    $(document).ready ->
      app.collections.courses.fetch()
    
  updateQpa: ->
    message =
      if !app.collections.courses.isEmpty()
      then 'Your QPA is ' + @qpa()
      else 'Go on, add a course!'
    $('#qpa').text(message)
      
  addOne: (course) =>
    view = new CourseView(model: course)
    $('#courses').isotope('insert', $(view.render().el))
    
  addAll: =>
    app.collections.courses.each(@addOne)