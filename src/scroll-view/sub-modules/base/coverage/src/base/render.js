function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/base/render.js']) {
  _$jscoverage['/base/render.js'] = {};
  _$jscoverage['/base/render.js'].lineData = [];
  _$jscoverage['/base/render.js'].lineData[6] = 0;
  _$jscoverage['/base/render.js'].lineData[7] = 0;
  _$jscoverage['/base/render.js'].lineData[8] = 0;
  _$jscoverage['/base/render.js'].lineData[11] = 0;
  _$jscoverage['/base/render.js'].lineData[17] = 0;
  _$jscoverage['/base/render.js'].lineData[20] = 0;
  _$jscoverage['/base/render.js'].lineData[36] = 0;
  _$jscoverage['/base/render.js'].lineData[38] = 0;
  _$jscoverage['/base/render.js'].lineData[48] = 0;
  _$jscoverage['/base/render.js'].lineData[51] = 0;
  _$jscoverage['/base/render.js'].lineData[54] = 0;
  _$jscoverage['/base/render.js'].lineData[63] = 0;
  _$jscoverage['/base/render.js'].lineData[67] = 0;
  _$jscoverage['/base/render.js'].lineData[71] = 0;
  _$jscoverage['/base/render.js'].lineData[72] = 0;
  _$jscoverage['/base/render.js'].lineData[74] = 0;
  _$jscoverage['/base/render.js'].lineData[75] = 0;
  _$jscoverage['/base/render.js'].lineData[76] = 0;
  _$jscoverage['/base/render.js'].lineData[81] = 0;
  _$jscoverage['/base/render.js'].lineData[82] = 0;
  _$jscoverage['/base/render.js'].lineData[83] = 0;
  _$jscoverage['/base/render.js'].lineData[89] = 0;
}
if (! _$jscoverage['/base/render.js'].functionData) {
  _$jscoverage['/base/render.js'].functionData = [];
  _$jscoverage['/base/render.js'].functionData[0] = 0;
  _$jscoverage['/base/render.js'].functionData[1] = 0;
  _$jscoverage['/base/render.js'].functionData[2] = 0;
  _$jscoverage['/base/render.js'].functionData[3] = 0;
  _$jscoverage['/base/render.js'].functionData[4] = 0;
  _$jscoverage['/base/render.js'].functionData[5] = 0;
}
if (! _$jscoverage['/base/render.js'].branchData) {
  _$jscoverage['/base/render.js'].branchData = {};
  _$jscoverage['/base/render.js'].branchData['71'] = [];
  _$jscoverage['/base/render.js'].branchData['71'][1] = new BranchData();
}
_$jscoverage['/base/render.js'].branchData['71'][1].init(2296, 11, 'supportCss3');
function visit1_71_1(result) {
  _$jscoverage['/base/render.js'].branchData['71'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/render.js'].lineData[6]++;
KISSY.add(function(S, require) {
  _$jscoverage['/base/render.js'].functionData[0]++;
  _$jscoverage['/base/render.js'].lineData[7]++;
  var Container = require('component/container');
  _$jscoverage['/base/render.js'].lineData[8]++;
  var ContentRenderExtension = require('component/extension/content-render');
  _$jscoverage['/base/render.js'].lineData[11]++;
  var Feature = S.Feature, transformVendorInfo = Feature.getCssVendorInfo('transform'), floor = Math.floor, transformProperty;
  _$jscoverage['/base/render.js'].lineData[17]++;
  var isTransform3dSupported = S.Feature.isTransform3dSupported();
  _$jscoverage['/base/render.js'].lineData[20]++;
  var supportCss3 = !!transformVendorInfo;
  _$jscoverage['/base/render.js'].lineData[36]++;
  var methods = {
  syncUI: function() {
  _$jscoverage['/base/render.js'].functionData[1]++;
  _$jscoverage['/base/render.js'].lineData[38]++;
  var self = this, control = self.control, el = control.el, contentEl = control.contentEl;
  _$jscoverage['/base/render.js'].lineData[48]++;
  var scrollHeight = Math.max(contentEl.offsetHeight, contentEl.scrollHeight), scrollWidth = Math.max(contentEl.offsetWidth, contentEl.scrollWidth);
  _$jscoverage['/base/render.js'].lineData[51]++;
  var clientHeight = el.clientHeight, clientWidth = el.clientWidth;
  _$jscoverage['/base/render.js'].lineData[54]++;
  control.set('dimension', {
  'scrollHeight': scrollHeight, 
  'scrollWidth': scrollWidth, 
  'clientWidth': clientWidth, 
  'clientHeight': clientHeight});
}, 
  '_onSetScrollLeft': function(v) {
  _$jscoverage['/base/render.js'].functionData[2]++;
  _$jscoverage['/base/render.js'].lineData[63]++;
  this.control.contentEl.style.left = -v + 'px';
}, 
  '_onSetScrollTop': function(v) {
  _$jscoverage['/base/render.js'].functionData[3]++;
  _$jscoverage['/base/render.js'].lineData[67]++;
  this.control.contentEl.style.top = -v + 'px';
}};
  _$jscoverage['/base/render.js'].lineData[71]++;
  if (visit1_71_1(supportCss3)) {
    _$jscoverage['/base/render.js'].lineData[72]++;
    transformProperty = transformVendorInfo.propertyName;
    _$jscoverage['/base/render.js'].lineData[74]++;
    methods._onSetScrollLeft = function(v) {
  _$jscoverage['/base/render.js'].functionData[4]++;
  _$jscoverage['/base/render.js'].lineData[75]++;
  var control = this.control;
  _$jscoverage['/base/render.js'].lineData[76]++;
  control.contentEl.style[transformProperty] = 'translateX(' + floor(-v) + 'px)' + ' translateY(' + floor(-control.get('scrollTop')) + 'px)' + (isTransform3dSupported ? ' translateZ(0)' : '');
};
    _$jscoverage['/base/render.js'].lineData[81]++;
    methods._onSetScrollTop = function(v) {
  _$jscoverage['/base/render.js'].functionData[5]++;
  _$jscoverage['/base/render.js'].lineData[82]++;
  var control = this.control;
  _$jscoverage['/base/render.js'].lineData[83]++;
  control.contentEl.style[transformProperty] = 'translateX(' + floor(-control.get('scrollLeft')) + 'px)' + ' translateY(' + floor(-v) + 'px)' + (isTransform3dSupported ? ' translateZ(0)' : '');
};
  }
  _$jscoverage['/base/render.js'].lineData[89]++;
  return Container.getDefaultRender().extend([ContentRenderExtension], methods, {
  name: 'ScrollViewRender'});
});
