courseTemplate = require('templates/course')

class exports.CourseView extends Backbone.View
  
  tagName: 'li'
  
  className: 'course'
  
  events:
    'blur .name': 'updateName'
    'blur .units': 'updateUnits'
    'click .grades li a': 'updateGrade'
    'click .delete': 'clear'
    
  initialize: ->
    @model.bind('change', @render)
    @model.view = @
    
  render: =>
    $(@el).html(courseTemplate(course: @model.toJSON()))
    $(@el).find('.grades li.' + @model.gradeString()).addClass('selected')
    model = @model
    $(@el).find('a.info').click (e) ->
      e.preventDefault()
      if model.found()
        window.open(model.scheduleman(), 'new_window', 'width=600, height=600,  
          scrollbars=yes')
    @
  
  updateName: (e) ->
    new_name = $(e.target).text()
    @model.save({name: new_name})
  
  updateUnits: (e) ->
    new_units = parseInt($(e.target).text())
    @model.save(units: new_units)
    
  updateGrade: (e) ->
    $grade = $(e.target)
    new_grade =
      switch $grade.text()
        when 'R' then 0
        when 'D' then 1
        when 'C' then 2
        when 'B' then 3
        when 'A' then 4
    $grade.siblings().removeClass('selected')
    $grade.addClass('selected')
    @model.save(grade: new_grade)
    
  remove: ->
    $(@el).fadeOut('fast', ->
      $('#courses').isotope('remove', $(@)).isotope('reLayout')
    )
  
  clear: ->
    @model.clear()