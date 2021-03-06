HighTables.Base = function(element) {
  element = $(element);

  var options;
  var labelColumn;
  var valueColumns;
  var table;

  var CHART_OPTIONS_MAP = {
    "options": function(value) { return safeEval(value, true); },
    "title": function(value) { return { title: { text: value } }; },
    "order": function(value) { return { order: value }; },
    "x-interval": function(value) { return { xAxis: { tickInterval: parseInt(value) } }; },
    "x-min": function(value) { return { xAxis: { min: parseInt(value) } }; },
    "y-interval": function(value) { return { yAxis: { tickInterval: parseInt(value) } }; },
    "y-min": function(value) { return { yAxis: { min: parseInt(value) } }; }
  };

  function safeEval(name, exec) {
    var parts = name.split(".");
    var result = window;
    while (parts.length > 0) {
      result = result[parts.shift()];
    }
    return (typeof result === "function" && exec) ? result() : result;
  }

  function getTable() {
    if (!table) {
      if (element.is("table")) {
        table = element;
      } else {
        table = $(element.attr("data-source"));
      }
    }
    return table;
  }

  /* TODO: This is stupid. Options and chart options should not be conflated
   * like this; chartOptions should be a property OF options instead.
   */
  function getChartOptions() {
    var options = {};

    var dataAttr;
    for (var key in CHART_OPTIONS_MAP) {
      dataAttr = element.attr("data-" + key);
      if (dataAttr) {
        $.extend(options, CHART_OPTIONS_MAP[key](dataAttr));
      }
    }

    return $.extend(options, {
      labelColumn: getLabelColumn(),
      valueColumns: getValueColumns(),
      limit: getLimit(),
      threshold: getThreshold(),
      transpose: getTranspose(),
      rowFilter: getRowFilter()
    });
  }

  function getLabelColumn() {
    return parseInt(element.attr("data-label-column"));
  }

  function getValueColumns() {
    var attr = element.attr("data-value-columns");
    if (attr) {
      return HighTables.Parse.integersWithRanges(
        attr.split(","),
        getTable().find("tr:first th, tr:first td").length - 1
      );

    } else {
      return null;
    }
  }

  function getLimit() {
    return parseInt(element.attr("data-limit"));
  }

  function getThreshold() {
    return parseFloat(element.attr("data-threshold"));
  }

  function getTranspose() {
    return element.attr("data-transpose") === "true";
  }

  function getRowFilter() {
    var attr = element.attr("data-row-filter");
    if (attr) {
      return safeEval(attr);
    }
  }

  this.getTable = getTable;

  this.options = function() {
    if (!options) {
      options = getChartOptions();
      options.labelColumn = this.labelColumn();
      options.valueColumns = this.valueColumns();
      options.limit = getLimit();
      options.threshold = getThreshold();
      options.transpose = getTranspose();
    }

    return options;
  };

  this.labelColumn = function() {
    if (typeof labelColumn === "undefined") {
      labelColumn = getLabelColumn();
    }

    return labelColumn;
  };

  this.valueColumns = function() {
    if (typeof valueColumns === "undefined") {
      valueColumns = getValueColumns();
    }

    return valueColumns;
  };

  this.element = element;
};
