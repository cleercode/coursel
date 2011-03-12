$(function() {


  window.Course = Backbone.Model.extend({
    initialize: function() {      
      if (this.isNew()) {
        this.set({
          number: ['xx', 'xxx'],
          units: 9,
          grade: 4
        }); 
      }
    },
  
    // validate: function(attrs) {
    //   if (attrs.number.length != 2 || attrs.number[0].length != 2
    //       || attrs.number[1].length != 3) {
    //     return 'Invalid course number.';
    //   }
    //   if (attrs.units > 99) {
    //     return 'Too many units';
    //   }
    // },

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
      'blur .number': 'updateNumber',
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

    updateNumber: function(e) {
      var new_number = $(e.target).text().split('-');
      this.model.save({number: new_number});
      $('#courses').isotope('updateSortData', $(this.el)).isotope({sortBy: 'number'});
    },

    updateUnits: function(e) {
      var new_units = parseInt($(e.target).text(), 10);
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
        return null;
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
            number: function($elem) {
              return $elem.find('.number').text();
            }
          },
          sortBy: 'number'
        });


        _.bindAll(this, 'addOne', 'addAll', 'render');
        Courses.bind('add', this.addOne);
        Courses.bind('refresh', this.addAll);
        Courses.bind('all', this.updateQpa);

        Courses.fetch();
      },

      createCourse: function() {
        Courses.create({});
        return false;
      },

      reset: function() {
        _.each(Courses.every(), function(course){
          course.clear();
        });
        return false;
      },

      updateQpa: function() {

        var message = (!Courses.isEmpty()) ? 'Your QPA is ' + this.qpa() : 'Add a course below!';
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