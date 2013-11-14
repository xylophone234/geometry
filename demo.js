demoList = [
{
"label": "Middle of segment",
"data":
  [
  {"id": 0, "label": "A", "type": "PointFree", "x": -100, "y": 22},
  {"id": 1, "label": "B", "type": "PointFree", "x": 96, "y": -7},
  {"id": 2, "type": "Segment", "p1": 0, "p2": 1},
  {"id": 3, "color": "#999999", "type": "Circle_3p", "p1": 0, "p2": 1, "p3": 0},
  {"id": 4, "color": "#999999", "type": "Circle_3p", "p1": 1, "p2": 0, "p3": 1},
  {"id": 5, "color": "#999999", "type": "Point_2c", "obj1": 3, "obj2": 4, "num": 0},
  {"id": 6, "color": "#999999", "type": "Point_2c", "obj1": 3, "obj2": 4, "num": 1},
  {"id": 7, "color": "#999999", "type": "Line_2p", "p1": 5, "p2": 6},
  {"id": 8, "label": "O", "color": "#ff00ff", "type": "Point_2l", "obj1": 2, "obj2": 7},
  {"id": 9, "type": "PointFree", "x": -449, "y": -310.5}
  ]
},
{
"label": "Triangle by three sides",
"data":
  [
  {"id": 0, "type": "PointFree", "x": -119, "y": 88},
  {"id": 1, "type": "PointFree", "x": 39, "y": 86},
  {"id": 2, "type": "Segment", "p1": 0, "p2": 1},
  {"id": 3, "type": "PointFree", "x": -121, "y": 122},
  {"id": 4, "type": "PointFree", "x": -7, "y": 120},
  {"id": 5, "type": "Segment", "p1": 3, "p2": 4},
  {"id": 6, "label": "B", "type": "PointFree", "x": 105, "y": 51},
  {"id": 7, "label": "A", "type": "PointFree", "x": -119, "y": 51},
  {"id": 8, "type": "Segment", "p1": 6, "p2": 7},
  {"id": 9, "color": "#999999", "type": "Circle_3p", "p1": 7, "p2": 3, "p3": 4},
  {"id": 10, "color": "#999999", "type": "Circle_3p", "p1": 6, "p2": 0, "p3": 1},
  {"id": 11, "label": "C", "color": "#ff00ff", "type": "Point_2c", "obj1": 10, "obj2": 9, "num": 0},
  {"id": 12, "color": "#ff00ff", "type": "Segment", "p1": 7, "p2": 11},
  {"id": 13, "color": "#ff00ff", "type": "Segment", "p1": 6, "p2": 11}
  ]
},
{
"label": "Circle through three points",
"data":
  [
  {"id": 0, "label": "A", "type": "PointFree", "x": -205, "y": 141},
  {"id": 1, "label": "B", "type": "PointFree", "x": -33, "y": 23},
  {"id": 2, "label": "C", "type": "PointFree", "x": -245, "y": -82},
  {"id": 3, "hidden": true, "type": "Circle_3p", "p1": 1, "p2": 0, "p3": 1},
  {"id": 4, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 1, "p3": 0},
  {"id": 5, "hidden": true, "type": "Circle_3p", "p1": 2, "p2": 1, "p3": 0},
  {"id": 6, "hidden": true, "type": "Point_2c", "obj1": 4, "obj2": 5, "num": 1},
  {"id": 7, "hidden": true, "type": "Point_2c", "obj1": 5, "obj2": 4, "num": 1},
  {"id": 8, "hidden": true, "type": "Line_2p", "p1": 6, "p2": 7},
  {"id": 9, "hidden": true, "type": "Point_2c", "obj1": 3, "obj2": 4, "num": 0},
  {"id": 10, "hidden": true, "type": "Point_2c", "obj1": 3, "obj2": 4, "num": 1},
  {"id": 11, "hidden": true, "type": "Line_2p", "p1": 10, "p2": 9},
  {"id": 12, "label": "O", "color": "#ff00ff", "type": "Point_2l", "obj1": 11, "obj2": 8},
  {"id": 13, "color": "#ff00ff", "type": "Circle_3p", "p1": 12, "p2": 0, "p3": 12}
  ]
},
{
"label": "Middle of hypotenuse",
"data":
  [
  {"id": 0, "hidden": true, "type": "PointFree", "x": 65, "y": -41.5},
  {"id": 1, "type": "PointFree", "x": -78, "y": -41.5},
  {"id": 2, "type": "Line_2p", "p1": 0, "p2": 1},
  {"id": 3, "hidden": true, "type": "Circle_3p", "p1": 1, "p2": 0, "p3": 1},
  {"id": 4, "hidden": true, "type": "Point_lc", "obj1": 2, "obj2": 3, "num": 1},
  {"id": 5, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 4, "p3": 0},
  {"id": 6, "hidden": true, "type": "Circle_3p", "p1": 4, "p2": 0, "p3": 4},
  {"id": 7, "hidden": true, "type": "Point_2c", "obj1": 6, "obj2": 5, "num": 0},
  {"id": 8, "hidden": true, "type": "Point_2c", "obj1": 5, "obj2": 6, "num": 0},
  {"id": 9, "type": "Line_2p", "p1": 7, "p2": 8},
  {"id": 10, "hidden": true, "type": "PointAtLine", "obj": 2, "t": -2.5874125874125875},
  {"id": 11, "color": "#ff00ff", "type": "PointAtLine", "obj": 2, "t": -1.7818181818181829},
  {"id": 12, "hidden": true, "type": "Circle_3p", "p1": 11, "p2": 10, "p3": 1},
  {"id": 13, "type": "Point_lc", "obj1": 9, "obj2": 12, "num": 0},
  {"id": 14, "color": "#9900ff", "type": "Segment", "p1": 13, "p2": 11},
  {"id": 15, "hidden": true, "type": "Circle_3p", "p1": 11, "p2": 13, "p3": 11},
  {"id": 16, "hidden": true, "type": "Circle_3p", "p1": 13, "p2": 11, "p3": 13},
  {"id": 17, "hidden": true, "type": "Point_2c", "obj1": 15, "obj2": 16, "num": 0},
  {"id": 18, "hidden": true, "type": "Point_2c", "obj1": 16, "obj2": 15, "num": 0},
  {"id": 19, "hidden": true, "type": "Line_2p", "p1": 17, "p2": 18},
  {"id": 20, "color": "#ff0000", "trace": true, "type": "Point_2l", "obj1": 14, "obj2": 19}
  ]
},
{
"label": "Bisectors in triangle",
"data":
  [
  {"id": 0, "label": "B", "type": "PointFree", "x": 188, "y": 145},
  {"id": 1, "label": "C", "type": "PointFree", "x": 110, "y": -93},
  {"id": 2, "type": "Segment", "p1": 0, "p2": 1},
  {"id": 3, "label": "A", "type": "PointFree", "x": -346, "y": -72.5},
  {"id": 4, "type": "Segment", "p1": 3, "p2": 1},
  {"id": 5, "type": "Segment", "p1": 3, "p2": 0},
  {"id": 6, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 0, "p3": 1},
  {"id": 7, "hidden": true, "type": "Circle_3p", "p1": 1, "p2": 0, "p3": 1},
  {"id": 8, "type": "Circle_3p", "p1": 1, "p2": 1, "p3": 1},
  {"id": 9, "hidden": true, "type": "Point_lc", "obj1": 5, "obj2": 6, "num": 0},
  {"id": 10, "hidden": true, "type": "Circle_3p", "p1": 9, "p2": 1, "p3": 0},
  {"id": 11, "hidden": true, "type": "Point_lc", "obj1": 4, "obj2": 7, "num": 0},
  {"id": 12, "hidden": true, "type": "Circle_3p", "p1": 11, "p2": 1, "p3": 0},
  {"id": 13, "hidden": true, "type": "Point_2c", "obj1": 6, "obj2": 12, "num": 1},
  {"id": 14, "color": "#ff9900", "type": "Line_2p", "p1": 13, "p2": 1},
  {"id": 15, "hidden": true, "type": "Point_2c", "obj1": 7, "obj2": 10, "num": 0},
  {"id": 16, "color": "#ff9900", "type": "Line_2p", "p1": 15, "p2": 0},
  {"id": 17, "hidden": true, "type": "Circle_3p", "p1": 3, "p2": 3, "p3": 1},
  {"id": 18, "hidden": true, "type": "Circle_3p", "p1": 1, "p2": 3, "p3": 1},
  {"id": 19, "hidden": true, "type": "Point_lc", "obj1": 5, "obj2": 17, "num": 1},
  {"id": 20, "hidden": true, "type": "Circle_3p", "p1": 19, "p2": 3, "p3": 1},
  {"id": 21, "hidden": true, "type": "Point_2c", "obj1": 20, "obj2": 18, "num": 0},
  {"id": 22, "color": "#ff9900", "type": "Line_2p", "p1": 3, "p2": 21},
  {"id": 23, "label": "O", "color": "#ff00ff", "type": "Point_2l", "obj1": 22, "obj2": 16},
  {"id": 24, "label": "A'", "color": "#ff9900", "type": "Point_2l", "obj1": 22, "obj2": 2},
  {"id": 25, "label": "B'", "color": "#ff9900", "type": "Point_2l", "obj1": 4, "obj2": 16},
  {"id": 26, "label": "C'", "color": "#ff9900", "type": "Point_2l", "obj1": 14, "obj2": 5},
  {"id": 27, "hidden": true, "type": "Circle_3p", "p1": 23, "p2": 0, "p3": 23},
  {"id": 28, "hidden": true, "type": "Point_lc", "obj1": 5, "obj2": 27, "num": 0},
  {"id": 29, "hidden": true, "type": "Circle_3p", "p1": 28, "p2": 28, "p3": 0},
  {"id": 30, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 28, "p3": 0},
  {"id": 31, "hidden": true, "type": "Point_2c", "obj1": 30, "obj2": 29, "num": 0},
  {"id": 32, "type": "Line_2p", "p1": 31, "p2": 31},
  {"id": 33, "hidden": true, "type": "Point_2c", "obj1": 29, "obj2": 30, "num": 0},
  {"id": 34, "hidden": true, "type": "Line_2p", "p1": 31, "p2": 33},
  {"id": 35, "hidden": true, "type": "Point_2l", "obj1": 34, "obj2": 5},
  {"id": 36, "color": "#ff00ff", "type": "Circle_3p", "p1": 23, "p2": 35, "p3": 23}
  ]
},
{
"label": "Inversion of point",
"data":
  [
  {"id": 0, "hidden": true, "type": "PointFree", "x": 317, "y": 231},
  {"id": 1, "hidden": true, "type": "PointFree", "x": 275, "y": -230},
  {"id": 2, "type": "Line_2p", "p1": 0, "p2": 1},
  {"id": 3, "label": "O", "type": "PointFree", "x": -18, "y": -50},
  {"id": 4, "type": "PointFree", "x": 140, "y": -157},
  {"id": 5, "type": "Circle_3p", "p1": 3, "p2": 3, "p3": 4},
  {"id": 6, "label": "A", "color": "#ff00ff", "type": "PointAtLine", "obj": 2, "t": 0.4},
  {"id": 7, "color": "#999999", "type": "Line_2p", "p1": 3, "p2": 6},
  {"id": 8, "color": "#999999", "type": "PointAtCircle", "obj": 5, "x": -113, "y": 152},
  {"id": 9, "color": "#999999", "type": "Line_2p", "p1": 6, "p2": 8},
  {"id": 10, "hidden": true, "type": "Point_lc", "obj1": 7, "obj2": 5, "num": 0},
  {"id": 11, "hidden": true, "type": "Point_lc", "obj1": 7, "obj2": 5, "num": 1},
  {"id": 12, "hidden": true, "type": "Circle_3p", "p1": 8, "p2": 10, "p3": 11},
  {"id": 13, "hidden": true, "type": "Point_lc", "obj1": 7, "obj2": 12, "num": 1},
  {"id": 14, "hidden": true, "type": "Point_lc", "obj1": 7, "obj2": 12, "num": 0},
  {"id": 15, "hidden": true, "type": "Circle_3p", "p1": 14, "p2": 13, "p3": 14},
  {"id": 16, "hidden": true, "type": "Circle_3p", "p1": 13, "p2": 14, "p3": 13},
  {"id": 17, "hidden": true, "type": "Point_2c", "obj1": 15, "obj2": 16, "num": 0},
  {"id": 18, "hidden": true, "type": "Point_2c", "obj1": 15, "obj2": 16, "num": 1},
  {"id": 19, "color": "#999999", "type": "Line_2p", "p1": 17, "p2": 18},
  {"id": 20, "color": "#999999", "type": "Point_lc", "obj1": 19, "obj2": 5, "num": 1},
  {"id": 21, "color": "#999999", "type": "Point_lc", "obj1": 9, "obj2": 5, "num": 0},
  {"id": 22, "color": "#999999", "type": "Line_2p", "p1": 20, "p2": 21},
  {"id": 23, "label": "A'", "color": "#ff9900", "trace": true, "type": "Point_2l", "obj1": 7, "obj2": 22}
  ]
},
{
"label": "Cube Dissection",
"data":
  [
  {"id": 0, "label": "A", "type": "PointFree", "x": -152, "y": -107},
  {"id": 1, "label": "B", "type": "PointFree", "x": 62, "y": -109.5},
  {"id": 2, "type": "Segment", "p1": 0, "p2": 1},
  {"id": 3, "hidden": true, "type": "Circle_3p", "p1": 1, "p2": 0, "p3": 1},
  {"id": 4, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 1, "p3": 0},
  {"id": 5, "hidden": true, "type": "Point_lc", "obj1": 2, "obj2": 3, "num": 1},
  {"id": 6, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 5, "p3": 0},
  {"id": 7, "hidden": true, "type": "Circle_3p", "p1": 5, "p2": 0, "p3": 5},
  {"id": 8, "hidden": true, "type": "Point_lc", "obj1": 2, "obj2": 4, "num": 0},
  {"id": 9, "hidden": true, "type": "Circle_3p", "p1": 8, "p2": 5, "p3": 0},
  {"id": 10, "hidden": true, "type": "Circle_3p", "p1": 1, "p2": 5, "p3": 0},
  {"id": 11, "hidden": true, "type": "Point_2c", "obj1": 9, "obj2": 10, "num": 0},
  {"id": 12, "hidden": true, "type": "Point_2c", "obj1": 10, "obj2": 9, "num": 0},
  {"id": 13, "hidden": true, "type": "Line_2p", "p1": 11, "p2": 12},
  {"id": 14, "hidden": true, "type": "Point_2c", "obj1": 7, "obj2": 6, "num": 0},
  {"id": 15, "hidden": true, "type": "Point_2c", "obj1": 6, "obj2": 7, "num": 0},
  {"id": 16, "hidden": true, "type": "Line_2p", "p1": 14, "p2": 15},
  {"id": 17, "label": "D", "type": "Point_lc", "obj1": 13, "obj2": 4, "num": 0},
  {"id": 18, "label": "C", "type": "Point_lc", "obj1": 16, "obj2": 3, "num": 1},
  {"id": 19, "type": "Segment", "p1": 0, "p2": 17},
  {"id": 20, "type": "Segment", "p1": 17, "p2": 18},
  {"id": 21, "type": "Segment", "p1": 1, "p2": 18},
  {"id": 22, "hidden": true, "type": "Line_2p", "p1": 0, "p2": 18},
  {"id": 23, "hidden": true, "type": "Circle_3p", "p1": 18, "p2": 0, "p3": 18},
  {"id": 24, "hidden": true, "type": "Point_lc", "obj1": 22, "obj2": 23, "num": 1},
  {"id": 25, "hidden": true, "type": "Circle_3p", "p1": 24, "p2": 0, "p3": 24},
  {"id": 26, "hidden": true, "type": "Circle_3p", "p1": 0, "p2": 24, "p3": 0},
  {"id": 27, "hidden": true, "type": "Point_2c", "obj1": 25, "obj2": 26, "num": 0},
  {"id": 28, "hidden": true, "type": "Point_2c", "obj1": 25, "obj2": 26, "num": 1},
  {"id": 29, "hidden": true, "type": "Line_2p", "p1": 27, "p2": 28},
  {"id": 30, "hidden": true, "type": "Line_2p", "p1": 17, "p2": 1},
  {"id": 31, "label": "E", "color": "#999999", "type": "Point_2l", "obj1": 30, "obj2": 22},
  {"id": 32, "hidden": true, "type": "Circle_3p", "p1": 18, "p2": 31, "p3": 18},
  {"id": 33, "label": "H", "type": "Point_lc", "obj1": 29, "obj2": 32, "num": 1},
  {"id": 34, "type": "Segment", "p1": 17, "p2": 33},
  {"id": 35, "label": "G", "type": "Point_lc", "obj1": 22, "obj2": 32, "num": 1},
  {"id": 36, "type": "Segment", "p1": 33, "p2": 35},
  {"id": 37, "label": "F", "type": "Point_lc", "obj1": 29, "obj2": 32, "num": 0},
  {"id": 38, "type": "Segment", "p1": 35, "p2": 37},
  {"id": 39, "color": "#999999", "type": "Segment", "p1": 31, "p2": 37},
  {"id": 40, "color": "#999999", "type": "Segment", "p1": 33, "p2": 31},
  {"id": 41, "type": "Segment", "p1": 37, "p2": 1},
  {"id": 42, "color": "#999999", "type": "Segment", "p1": 0, "p2": 31},
  {"id": 43, "type": "Segment", "p1": 18, "p2": 35},
  {"id": 44, "label": "X", "color": "#ff00ff", "type": "PointAtLine", "obj": 19, "t": 0.6282302270947532},
  {"id": 45, "label": "Y", "color": "#ff00ff", "type": "PointAtLine", "obj": 2, "t": 0.6217391304347826},
  {"id": 46, "label": "Z", "color": "#ff00ff", "type": "PointAtLine", "obj": 43, "t": 0.8492560689115106},
  {"id": 47, "hidden": true, "type": "Line_2p", "p1": 44, "p2": 45},
  {"id": 48, "hidden": true, "type": "Line_2p", "p1": 18, "p2": 1},
  {"id": 49, "hidden": true, "type": "Point_2l", "obj1": 47, "obj2": 48},
  {"id": 50, "hidden": true, "type": "Line_2p", "p1": 46, "p2": 49},
  {"id": 51, "color": "#ff9900", "type": "Point_2l", "obj1": 41, "obj2": 50},
  {"id": 52, "hidden": true, "type": "Line_2p", "p1": 18, "p2": 17},
  {"id": 53, "hidden": true, "type": "Point_2l", "obj1": 47, "obj2": 52},
  {"id": 54, "hidden": true, "type": "Line_2p", "p1": 46, "p2": 53},
  {"id": 55, "color": "#ff9900", "type": "Point_2l", "obj1": 54, "obj2": 34},
  {"id": 56, "color": "#ff9900", "type": "Segment", "p1": 46, "p2": 55},
  {"id": 57, "color": "#ff9900", "type": "Segment", "p1": 55, "p2": 44},
  {"id": 58, "color": "#ff9900", "type": "Segment", "p1": 44, "p2": 45},
  {"id": 59, "color": "#ff9900", "type": "Segment", "p1": 45, "p2": 51},
  {"id": 60, "color": "#ff9900", "type": "Segment", "p1": 46, "p2": 51}
  ]
},
{
"label": "Archimed's problem",
"data":
  [
  {"id": 0, "hidden": true, "type": "PointFree", "x": -51, "y": 15},
  {"id": 1, "hidden": true, "type": "PointFree", "x": 192, "y": -99},
  {"id": 2, "type": "Circle_3p", "p1": 0, "p2": 0, "p3": 1},
  {"id": 3, "hidden": true, "type": "PointFree", "x": -514, "y": 83},
  {"id": 4, "hidden": true, "type": "PointFree", "x": 413, "y": 51},
  {"id": 5, "hidden": true, "type": "Line_2p", "p1": 3, "p2": 4},
  {"id": 6, "label": "B", "type": "Point_lc", "obj1": 5, "obj2": 2, "num": 1},
  {"id": 7, "label": "A", "type": "Point_lc", "obj1": 5, "obj2": 2, "num": 0},
  {"id": 8, "label": "M", "color": "#ff00ff", "type": "PointAtCircle", "obj": 2, "x": 237, "y": -191},
  {"id": 9, "type": "Segment", "p1": 7, "p2": 8},
  {"id": 10, "type": "Segment", "p1": 6, "p2": 8},
  {"id": 11, "hidden": true, "type": "Circle_3p", "p1": 8, "p2": 6, "p3": 8},
  {"id": 12, "hidden": true, "type": "Point_lc", "obj1": 9, "obj2": 11, "num": 1},
  {"id": 13, "hidden": true, "type": "Circle_3p", "p1": 7, "p2": 12, "p3": 7},
  {"id": 14, "hidden": true, "type": "Circle_3p", "p1": 12, "p2": 7, "p3": 12},
  {"id": 15, "hidden": true, "type": "Point_2c", "obj1": 13, "obj2": 14, "num": 0},
  {"id": 16, "hidden": true, "type": "Point_2c", "obj1": 13, "obj2": 14, "num": 1},
  {"id": 17, "hidden": true, "type": "Line_2p", "p1": 15, "p2": 16},
  {"id": 18, "label": "O", "color": "#ff9900", "trace": true, "type": "Point_2l", "obj1": 9, "obj2": 17},
  {"id": 19, "hidden": true, "type": "Circle_3p", "p1": 8, "p2": 7, "p3": 8},
  {"id": 20, "hidden": true, "type": "Point_lc", "obj1": 10, "obj2": 19, "num": 1},
  {"id": 21, "hidden": true, "type": "Circle_3p", "p1": 6, "p2": 20, "p3": 6},
  {"id": 22, "hidden": true, "type": "Circle_3p", "p1": 20, "p2": 6, "p3": 20},
  {"id": 23, "hidden": true, "type": "Point_2c", "obj1": 21, "obj2": 22, "num": 1},
  {"id": 24, "hidden": true, "type": "Point_2c", "obj1": 21, "obj2": 22, "num": 0},
  {"id": 25, "hidden": true, "type": "Line_2p", "p1": 23, "p2": 24},
  {"id": 26, "label": "O'", "color": "#ff9900", "trace": true, "type": "Point_2l", "obj1": 25, "obj2": 10}
  ]
}
]
