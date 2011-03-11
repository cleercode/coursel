var Coursel = {
  courses: [],
  
  Course: {
    number: ['xx', 'xxx'],
    units: 9,
    grade: 4,
    
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
      return this.units * this.grade;
    },
    
    createElement: function() {
      var course = this;
      var $elem = $('#courseTemplate').tmpl(course, {
        numberHyphenated: function() {
          return this.data.number.join('-');
        }
      });

      $elem.find('.' + course.gradeString()).addClass('selected');
      
      $elem.find('.number').bind('blur', function() {
        $('#courses').isotope('updateSortData', $elem).isotope({sortBy: 'number'});
        var new_number = $(this).text().split('-');
        course.number = new_number;
        Coursel.trySaveCourses();
      });

      $elem.find('.units').bind('blur', function() {
        var new_units = parseInt($(this).text(), 10);
        course.units = new_units;
        Coursel.trySaveCourses();
      });
      
      $elem.find('.grades li').bind('click', function() {
        var new_grade = $(this).text(); 
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
        Coursel.trySaveCourses();
      });
      
      return $elem;
    }
  },
  
  addCourse: function(data) {
    var course = create(this.Course);
    if (data) {
      if (data.number !== undefined) course.number = data.number;
      if (data.units !== undefined) course.units = data.units;
      if (data.grade !== undefined) course.grade = data.grade;
    }
    this.courses.push(course);
    $('#courses').isotope('insert', course.createElement());
    this.trySaveCourses();
  },
  
  qpa: function() {
    var units = 0;
    var qp = 0;
    for (var i = 0; i < this.courses.length; i++) {
      var course = this.courses[i];
      units += course.units;     
      qp += course.qp(); 
    }
    return (qp / units).toFixed(2);
  },
  
  updateQpa: function() {
    var message = (this.courses.length) ? 'Your QPA is ' + this.qpa() : 'Add a course below!';
    $('#qpa').text(message);
  },
  
  tryLoadCourses: function() {
    if (supports_html5_storage) {
      var loaded = localStorage.getObject('courses');
      if (isArray(loaded)) {
        for (var i = 0; i < loaded.length; i++) {
          var course = loaded[i];
          Coursel.addCourse(course);
        }
      }
    }
  },
  
  trySaveCourses: function() {
    this.updateQpa();
    if (supports_html5_storage) {
      localStorage.setObject('courses', this.courses);
    }
  }
  
};

// On page load
$(function() {
  $('#courses').isotope({
    itemSelector: '.course',
    masonry: {
      columnWidth: 272
    },
    getSortData: {
      number: function($elem) {
        return $elem.find('.number').text();
      }
    },
    sortBy: 'number',
    animationEngine: 'jquery'
  });
  
  Coursel.tryLoadCourses();
  
  $('#add_course').bind('click', function() {
    Coursel.addCourse();
  });
  
  $('#reset').bind('click', function() {
    $('#courses').isotope('remove', $('.course')).isotope('reLayout');
    Coursel.courses = [];
    Coursel.trySaveCourses();
  });
});

// Utility functions
function create(o) {
    function F() {}
    F.prototype = o;
    return new F();
};

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
};

function isArray(obj) {
  return obj && obj.constructor == Array;
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
};