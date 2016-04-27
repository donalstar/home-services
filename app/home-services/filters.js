'use strict';

/* Filters */

var module = angular.module('filters', []);

module.filter('tel', function () {
  return function (tel) {
      if (!tel) { return ''; }

      var value = tel.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
          return tel;
      }

      var country, city, number;

      switch (value.length) {
          case 10: // +1PPP####### -> C (PPP) ###-####
              country = 1;
              city = value.slice(0, 3);
              number = value.slice(3);
              break;

          case 11: // +CPPP####### -> CCC (PP) ###-####
              country = value[0];
              city = value.slice(1, 4);
              number = value.slice(4);
              break;

          case 12: // +CCCPP####### -> CCC (PP) ###-####
              country = value.slice(0, 3);
              city = value.slice(3, 5);
              number = value.slice(5);
              break;

          default:
              return tel;
      }

      if (country == 1) {
          country = "";
      }

      number = number.slice(0, 3) + '-' + number.slice(3);

      return (country + " (" + city + ") " + number).trim();
  };
});

module.filter('dt', function () {
  return function (raw_date) {
      if (!raw_date) { return ''; }

      var date = new Date(raw_date);

      var m_names = new Array("Jan", "Feb", "Mar",
          "Apr", "May", "Jun", "Jul", "Aug", "Sep",
          "Oct", "Nov", "Dec");

      return date.getDate() + '-' + m_names[date.getMonth()] + '-' + date.getFullYear();
  }
});

module.filter('curr', function () {
  return function (amount) {
      if (!amount) { return ''; }

      return "$" + amount + ".00";
  }
});




