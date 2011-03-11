$(function() {
  
  
  window.Course = Backbone.Model.extend({
    initialize: function() {
      this.set({
        number: ['xx', 'xxx'],
        units: 9,
        grade: 4
      });
    },
    
    validate: function(attrs) {
      if (attrs.number.length != 2 || attrs.number[0].length != 2
          || attrs.number[1].length != 3) {
        return 'Invalid course number.';
      }
      if (attrs.units > 99) {
        return 'Too many units';
      }
    },

    clear: function() {
      this.destroy();
      this.view.remove();
    },
    
    gradeString: function() {
      switch(this.grade) {
        case 0: return 'R'; break;
        case 1: return 'D'; break;
        case 2: return 'C'; break;
        case 3: return 'B'; break;
        case 4: return 'A'; break;
      };
      return null;
    },
    
    qp: function() {
      return this.get('units') * this.get('grade');
    }
  });


  window.CourseList = Backbone.Collection.extend({
    model: Course,

    localStorage: new Store('courses'),
    
    comparator: function(course) {
      return course.get('number').join('');
    },
    
    qpa: function() {
      var units = 0;
      var qp = 0;
      Courses.each(function(course) {
        units += course.get('units');     
        qp += course.qp(); 
      });
      return (qp / units).toFixed(2);
    }
  });  
  window.Courses = new CourseList;


  window.CourseView = Backbone.View.extend({
    tagName: 'li',
    className: 'course',

    template: _.template($('#courseTemplate').html()),

    events: {
      'blur .number': 'updateNumber',
      'blur .units': 'updateUnits',
      'click .grades li': 'updateGrade'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
      
      $(this.el).find('number').focus();
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    updateNumber: function() {
      var number = $(this.el).find('.number').text().split('-');
      this.model.save({number: number});
      console.log(this.model.get('number'));
    },

    updateUnits: function() {

    },

    updateGrade: function(g) {
      var grade = $(this).text(); 
      $(this).siblings().removeClass('selected');
      $(this).addClass('selected');
      course.grade = function(g) {
        switch(g) {
          case 'R': return 0; break;
          case 'D': return 1; break;
          case 'C': return 2; break;
          case 'B': return 3; break;
          case 'A': return 4; break;
        }
        return null;
      }(new_grade);
      console.log(this);
    },

    remove: function() {
      $(this.el).remove();
    },

    clear: function() {
      this.model.clear();
    }
  });
  

  window.AppView = Backbone.View.extend({
    el: $('body'),

    events: {
      'click #add_course': 'createCourse',
      'click #reset': 'reset'
    },

    initialize: function() {

      _.bindAll(this, 'addOne', 'addAll', 'render');
      Courses.bind('add', this.addOne);
      Courses.bind('refresh', this.addAll);
      Courses.bind('all', this.updateQpa);

      Courses.fetch();
    },

    createCourse: function() {
      Courses.create({});
    },

    reset: function() {
      Courses.each(function(course) {
        course.clear();
      });
    },
    
    updateQpa: function() {
      var message = (!Courses.isEmpty()) ? 'Your QPA is ' + this.qpa() : 'Add a course below!';
      $('#qpa').text(message);
    },

    addOne: function(course) {
      var view = new CourseView({model: course});
      $('#courses').append(view.render().el);
    },

    addAll: function() {
      Courses.each(this.addOne);
    }
  });
  window.App = new AppView;
  
  
});