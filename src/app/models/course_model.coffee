class exports.Course extends Backbone.Model
  
  validate: (attrs) ->
    if attrs.name? && attrs.name.length == 0
      'Course name should not be blank.'
  
  clear: ->
    @destroy()
    @view.remove()
  
  gradeString: ->
    switch @get('grade')
      when 0 then 'R'
      when 1 then 'D'
      when 2 then 'C'
      when 3 then 'B'
      when 4 then 'A'
    
  qp: ->
    @get('units') * @get('grade')
    
  scheduleman: ->
    'http://scheduleman.org/courses/' + @get('name').replace('-', '') +
      '?popup=1'
      
  found: ->
    app.courses && app.courses[@get('name')]