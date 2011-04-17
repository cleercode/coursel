$(function() {


  window.Course = Backbone.Model.extend({
    validate: function(attrs) {
      if (attrs.name !== undefined && attrs.name.length == 0) {
        return 'Course name should not be blank.';
      }
    },
    
    clear: function() {
      this.destroy();
      this.view.remove();
    },

    gradeString: function() {
      switch(this.get('grade')) {
        case 0: return 'R'; break;
        case 1: return 'D'; break;
        case 2: return 'C'; break;
        case 3: return 'B'; break;
        case 4: return 'A'; break;
      };
    },

    qp: function() {
      return this.get('units') * this.get('grade');
    }
  });


  window.CourseList = Backbone.Collection.extend({
    model: Course,

    localStorage: new Store('courses'),

    comparator: function(course) {
      return course.get('name');
    },

    every: function() {
      return this.filter(function(todo){
        return true;
      });
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
      'blur .name': 'updateName',
      'blur .units': 'updateUnits',
      'click .grades li a': 'updateGrade',
      'click .delete': 'clear'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).find('.grades li.' + this.model.gradeString()).addClass('selected');
      return this;
    },

    updateName: function(e) {
      var new_name = $(e.target).text();
      this.model.save({name: new_name});
      $('#courses').isotope('updateSortData', $(this.el)).isotope({sortBy: 'name'});
    },

    updateUnits: function(e) {
      var new_units = parseInt($(e.target).text());
      this.model.save({units: new_units});
    },

    updateGrade: function(e) {
      $grade = $(e.target);
      var new_grade = function(g) {
        switch(g) {
          case 'R': return 0; break;
          case 'D': return 1; break;
          case 'C': return 2; break;
          case 'B': return 3; break;
          case 'A': return 4; break;
        }
      }($grade.text());
      $grade.siblings().removeClass('selected');
      $grade.addClass('selected');
      this.model.save({grade: new_grade});
    },

    remove: function() {
      $(this.el).fadeOut('fast', function() {
        $('#courses').isotope('remove', $(this)).isotope('reLayout');
      });
    },

    clear: function() {
      this.model.clear();
    }
  });


  window.AppView = Backbone.View.extend({
    el: $('body'),

    events: {
      'keypress #course_input': 'createOnEnter',
      'click #add_course': 'createCourse',
      'click #reset': 'reset'
    },

    initialize: function() {
      $('#courses').isotope({
        itemSelector: '.course',
        masonry: {
          columnWidth: 270
        },
        getSortData: {
          name: function($elem) {
            return $elem.find('.name').text();
          }
        },
        sortBy: 'name'
      });

      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input = this.$('#course_input').focus();

      Courses.bind('add', this.addOne);
      Courses.bind('refresh', this.addAll);
      Courses.bind('all', this.updateQpa);

      Courses.fetch();
    },

    newAttributes: function() {
      return {
        name: this.input.val(),
        units: 9,
        grade: 4
      };
    },

    createCourse: function(e) {
      if (this.input.val() != '') {
        Courses.create(this.newAttributes());
        this.input.val('');
      }
      e.preventDefault();
    },

    createOnEnter: function(e) {
      if (e.keyCode == 13) {
        this.createCourse(e);
      }
    },

    reset: function(e) {
      _.each(Courses.every(), function(course){
        course.clear();
      });
      e.preventDefault();
    },

    updateQpa: function() {
      var message = (!Courses.isEmpty()) ? 'Your QPA is ' + this.qpa() : 'Go on, add a course!';
      $('#qpa').text(message);
    },

    addOne: function(course) {
      var view = new CourseView({model: course});
      $('#courses').isotope('insert', $(view.render().el));
    },

    addAll: function() {
      Courses.each(this.addOne);
    }
  });
  window.App = new AppView;


});