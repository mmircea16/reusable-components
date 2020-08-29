import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".color-marker{height:.5em;width:.5em;margin:.25em}.name-with-color{font-size:1em;width:fit-content}";
styleInject(css_248z);

var NameWithColor = function NameWithColor(_ref) {
  var text = _ref.text,
      color = _ref.color,
      rightAligned = _ref.rightAligned;
  return /*#__PURE__*/React.createElement("div", {
    className: "name-with-color"
  }, /*#__PURE__*/React.createElement("div", {
    className: "color-marker",
    style: {
      backgroundColor: color,
      "float": rightAligned ? "right" : "left"
    }
  }), text);
};
NameWithColor.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  rightAligned: PropTypes.bool.isRequired
};

var css_248z$1 = ".party-result-card{display:flex;flex-direction:column}.party-result-card .percentage{font-size:2em}";
styleInject(css_248z$1);

var PartyResultCard = function PartyResultCard(_ref) {
  var name = _ref.name,
      color = _ref.color,
      percentage = _ref.percentage,
      rightAligned = _ref.rightAligned;
  return /*#__PURE__*/React.createElement("div", {
    className: "party-result-card",
    style: {
      alignItems: rightAligned ? "flex-end" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement(NameWithColor, {
    color: color,
    text: name,
    rightAligned: rightAligned
  }), /*#__PURE__*/React.createElement("div", {
    className: "percentage"
  }, percentage, "%"));
};
PartyResultCard.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  rightAligned: PropTypes.bool.isRequired
};

var css_248z$2 = ".party-result-inline{display:flex}.party-result-inline .votes{margin-left:5px;color:#a9a9a9}";
styleInject(css_248z$2);

var PartyResultInline = function PartyResultInline(_ref) {
  var name = _ref.name,
      color = _ref.color,
      percentage = _ref.percentage,
      votesCount = _ref.votesCount;
  return /*#__PURE__*/React.createElement("div", {
    className: "party-result-inline"
  }, /*#__PURE__*/React.createElement(NameWithColor, {
    color: color,
    text: name
  }), /*#__PURE__*/React.createElement("div", {
    className: "votes"
  }, percentage, "% (", votesCount, ")"));
};
PartyResultInline.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  votesCount: PropTypes.number.isRequired
};

var css_248z$3 = ".text-value{fill:#fff}";
styleInject(css_248z$3);

var HorizontalStackedBar = function HorizontalStackedBar(_ref) {
  var results = _ref.results;
  useEffect(function () {
    drawBar();
  }, [results]);
  var marginBottom = 10;
  var chartWidth = 1000;
  var chartHeight = 80;
  var barHeight = chartHeight - 2 * marginBottom;
  var halfBarHeight = barHeight / 2;

  var putLabels = function putLabels(svg, leftLabel, rightLabel) {
    var textMargin = 5;
    var yBottomChart = chartHeight - marginBottom;
    svg.append("text").attr("class", "text-value").attr("x", textMargin).attr("y", yBottomChart - textMargin).text(leftLabel);
    svg.append("text").attr("class", "text-value").attr("text-anchor", "end").attr("x", chartWidth - textMargin).attr("y", yBottomChart - textMargin).text(rightLabel);
  };

  var drawVerticalLine = function drawVerticalLine(svg, xCoord) {
    svg.append("line").attr("x1", xCoord).attr("x2", xCoord).attr("y1", 0).attr("y2", chartHeight).style("stroke-width", 2).style("stroke", "black");
  };

  var drawBar = function drawBar() {
    //this is to remove the previous svg (if exists) - useful in case of re-renders
    select(".horizontal-stacked-bar svg").remove();
    var svg = select(".horizontal-stacked-bar").append("svg").attr("viewBox", "0 0 ".concat(chartWidth, " ").concat(chartHeight)).attr("preserveAspectRatio", "xMidYMid meet");

    var _stackResults = stackResults(results),
        stackedBarData = _stackResults.stackedBarData,
        total = _stackResults.total;

    var xScale = scaleLinear().domain([0, total]).range([0, chartWidth]);
    svg.selectAll("rect").data(stackedBarData).enter().append("rect").attr("class", "rect-stacked").attr("x", function (d) {
      return xScale(d.cumulative);
    }).attr("y", chartHeight / 2 - halfBarHeight).attr("height", barHeight).attr("width", function (d) {
      return xScale(d.value);
    }).style("fill", function (d) {
      return d.data.color;
    });
    drawVerticalLine(svg, xScale(total / 2));
    var len = stackedBarData.length;
    putLabels(svg, stackedBarData[0].value, stackedBarData[len - 1].value);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "horizontal-stacked-bar"
  });
};

var stackResults = function stackResults(results) {
  return results.reduce(function (_ref2, result) {
    var stackedBarData = _ref2.stackedBarData,
        total = _ref2.total;
    stackedBarData.push({
      value: result.votes,
      cumulative: total,
      data: result
    });
    return {
      stackedBarData: stackedBarData,
      total: total + result.votes
    };
  }, {
    stackedBarData: [],
    total: 0
  });
};
HorizontalStackedBar.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    votes: PropTypes.number,
    color: PropTypes.string
  })).isRequired
};

var css_248z$4 = ".percentage-as-bar .text-value{font-size:2em}";
styleInject(css_248z$4);

var PercentageAsBar = function PercentageAsBar(_ref) {
  var value = _ref.value,
      totalColor = _ref.totalColor,
      turnoutColor = _ref.turnoutColor;
  useEffect(function () {
    drawBars();
  }, [value]);
  var chartWidth = 1000;
  var chartHeight = 110;
  var barHeight = 60;
  var overlap = 20;
  var textMargin = 10;
  var barY = barHeight - overlap;

  var drawBars = function drawBars() {
    select(".percentage-as-bar svg").remove();
    var svg = select(".percentage-as-bar").append("svg").attr("viewBox", "0 0 ".concat(chartWidth, " ").concat(chartHeight)).attr("preserveAspectRatio", "xMidYMid meet");
    var xScale = scaleLinear().domain([0, 100]).range([0, chartWidth]);
    svg.append("rect").attr("x", 0).attr("y", 0).attr("height", barHeight).attr("width", chartWidth).style("fill", totalColor);
    svg.append("rect").attr("x", 0).attr("y", barY).attr("height", barHeight).attr("width", xScale(value)).style("fill", turnoutColor);
    svg.append("text").attr("class", "text-value").attr("text-anchor", "end").attr("x", chartWidth - textMargin).attr("y", barHeight / 2 + textMargin).text("100%");
    svg.append("text").attr("class", "text-value").attr("text-anchor", "end").attr("x", xScale(value) - textMargin).attr("y", barHeight / 2 + textMargin + barY).text("".concat(value, "%"));
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "percentage-as-bar"
  });
};
PercentageAsBar.propTypes = {
  value: PropTypes.number.isRequired,
  totalColor: PropTypes.string,
  turnoutColor: PropTypes.string
};

export { HorizontalStackedBar, NameWithColor, PartyResultCard, PartyResultInline, PercentageAsBar };
//# sourceMappingURL=index.js.map
