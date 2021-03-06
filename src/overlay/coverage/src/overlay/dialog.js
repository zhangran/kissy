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
if (! _$jscoverage['/overlay/dialog.js']) {
  _$jscoverage['/overlay/dialog.js'] = {};
  _$jscoverage['/overlay/dialog.js'].lineData = [];
  _$jscoverage['/overlay/dialog.js'].lineData[6] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[7] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[8] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[9] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[16] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[19] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[27] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[29] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[33] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[35] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[37] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[38] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[40] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[42] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[46] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[48] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[49] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[50] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[55] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[57] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[58] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[59] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[60] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[67] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[228] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[231] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[233] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[236] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[237] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[239] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[243] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[248] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[253] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[254] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[255] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[258] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[259] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[260] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[264] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[265] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[270] = 0;
  _$jscoverage['/overlay/dialog.js'].lineData[272] = 0;
}
if (! _$jscoverage['/overlay/dialog.js'].functionData) {
  _$jscoverage['/overlay/dialog.js'].functionData = [];
  _$jscoverage['/overlay/dialog.js'].functionData[0] = 0;
  _$jscoverage['/overlay/dialog.js'].functionData[1] = 0;
  _$jscoverage['/overlay/dialog.js'].functionData[2] = 0;
  _$jscoverage['/overlay/dialog.js'].functionData[3] = 0;
  _$jscoverage['/overlay/dialog.js'].functionData[4] = 0;
}
if (! _$jscoverage['/overlay/dialog.js'].branchData) {
  _$jscoverage['/overlay/dialog.js'].branchData = {};
  _$jscoverage['/overlay/dialog.js'].branchData['33'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['33'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['34'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['34'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['35'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['35'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['35'][2] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['35'][3] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['48'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['48'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['59'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['59'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['236'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['236'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['253'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['253'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['258'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['258'][1] = new BranchData();
  _$jscoverage['/overlay/dialog.js'].branchData['264'] = [];
  _$jscoverage['/overlay/dialog.js'].branchData['264'][1] = new BranchData();
}
_$jscoverage['/overlay/dialog.js'].branchData['264'][1].init(65, 38, 'node.equals($el) || $el.contains(node)');
function visit25_264_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['264'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['258'][1].init(992, 41, 'node.equals(lastFocusItem) && !e.shiftKey');
function visit24_258_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['258'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['253'][1].init(741, 30, 'node.equals($el) && e.shiftKey');
function visit23_253_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['253'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['236'][1].init(73, 19, 'keyCode !== KEY_TAB');
function visit22_236_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['236'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['59'][1].init(28, 17, 'self.__lastActive');
function visit21_59_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['59'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['48'][1].init(88, 1, 'v');
function visit20_48_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['48'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['35'][3].init(27, 44, 'e.target.nodeName.toLowerCase() === \'select\'');
function visit19_35_3(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['35'][3].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['35'][2].init(27, 66, 'e.target.nodeName.toLowerCase() === \'select\' && !e.target.disabled');
function visit18_35_2(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['35'][2].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['35'][1].init(25, 69, '!(e.target.nodeName.toLowerCase() === \'select\' && !e.target.disabled)');
function visit17_35_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['35'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['34'][1].init(48, 30, 'e.keyCode === Node.KeyCode.ESC');
function visit16_34_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['34'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].branchData['33'][1].init(21, 79, 'this.get(\'escapeToClose\') && e.keyCode === Node.KeyCode.ESC');
function visit15_33_1(result) {
  _$jscoverage['/overlay/dialog.js'].branchData['33'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/dialog.js'].lineData[6]++;
KISSY.add(function(S, require) {
  _$jscoverage['/overlay/dialog.js'].functionData[0]++;
  _$jscoverage['/overlay/dialog.js'].lineData[7]++;
  var Overlay = require('./control');
  _$jscoverage['/overlay/dialog.js'].lineData[8]++;
  var DialogRender = require('./dialog-render');
  _$jscoverage['/overlay/dialog.js'].lineData[9]++;
  var Node = require('node');
  _$jscoverage['/overlay/dialog.js'].lineData[16]++;
  var Dialog = Overlay.extend({
  __afterCreateEffectGhost: function(ghost) {
  _$jscoverage['/overlay/dialog.js'].functionData[1]++;
  _$jscoverage['/overlay/dialog.js'].lineData[19]++;
  var self = this, elBody = self.get('body');
  _$jscoverage['/overlay/dialog.js'].lineData[27]++;
  ghost.all('.' + self.get('prefixCls') + 'stdmod-body').css({
  height: elBody.height(), 
  width: elBody.width()}).html('');
  _$jscoverage['/overlay/dialog.js'].lineData[29]++;
  return ghost;
}, 
  handleKeyDownInternal: function(e) {
  _$jscoverage['/overlay/dialog.js'].functionData[2]++;
  _$jscoverage['/overlay/dialog.js'].lineData[33]++;
  if (visit15_33_1(this.get('escapeToClose') && visit16_34_1(e.keyCode === Node.KeyCode.ESC))) {
    _$jscoverage['/overlay/dialog.js'].lineData[35]++;
    if (visit17_35_1(!(visit18_35_2(visit19_35_3(e.target.nodeName.toLowerCase() === 'select') && !e.target.disabled)))) {
      _$jscoverage['/overlay/dialog.js'].lineData[37]++;
      this.close();
      _$jscoverage['/overlay/dialog.js'].lineData[38]++;
      e.halt();
    }
    _$jscoverage['/overlay/dialog.js'].lineData[40]++;
    return;
  }
  _$jscoverage['/overlay/dialog.js'].lineData[42]++;
  trapFocus.call(this, e);
}, 
  _onSetVisible: function(v, e) {
  _$jscoverage['/overlay/dialog.js'].functionData[3]++;
  _$jscoverage['/overlay/dialog.js'].lineData[46]++;
  var self = this, el = self.el;
  _$jscoverage['/overlay/dialog.js'].lineData[48]++;
  if (visit20_48_1(v)) {
    _$jscoverage['/overlay/dialog.js'].lineData[49]++;
    self.__lastActive = el.ownerDocument.activeElement;
    _$jscoverage['/overlay/dialog.js'].lineData[50]++;
    self.focus();
    _$jscoverage['/overlay/dialog.js'].lineData[55]++;
    el.setAttribute('aria-hidden', 'false');
  } else {
    _$jscoverage['/overlay/dialog.js'].lineData[57]++;
    el.setAttribute('aria-hidden', 'true');
    _$jscoverage['/overlay/dialog.js'].lineData[58]++;
    try {
      _$jscoverage['/overlay/dialog.js'].lineData[59]++;
      if (visit21_59_1(self.__lastActive)) {
        _$jscoverage['/overlay/dialog.js'].lineData[60]++;
        self.__lastActive.focus();
      }
    }    catch (ee) {
}
  }
  _$jscoverage['/overlay/dialog.js'].lineData[67]++;
  self.callSuper(v, e);
}}, {
  ATTRS: {
  header: {
  view: 1}, 
  body: {
  view: 1}, 
  footer: {
  view: 1}, 
  bodyStyle: {
  value: {}, 
  view: 1}, 
  footerStyle: {
  value: {}, 
  view: 1}, 
  headerStyle: {
  value: {}, 
  view: 1}, 
  headerContent: {
  value: '', 
  view: 1}, 
  bodyContent: {
  value: '', 
  view: 1}, 
  footerContent: {
  value: '', 
  view: 1}, 
  closable: {
  value: true}, 
  xrender: {
  value: DialogRender}, 
  focusable: {
  value: true}, 
  escapeToClose: {
  value: true}}, 
  xclass: 'dialog'});
  _$jscoverage['/overlay/dialog.js'].lineData[228]++;
  var KEY_TAB = Node.KeyCode.TAB;
  _$jscoverage['/overlay/dialog.js'].lineData[231]++;
  function trapFocus(e) {
    _$jscoverage['/overlay/dialog.js'].functionData[4]++;
    _$jscoverage['/overlay/dialog.js'].lineData[233]++;
    var self = this, keyCode = e.keyCode;
    _$jscoverage['/overlay/dialog.js'].lineData[236]++;
    if (visit22_236_1(keyCode !== KEY_TAB)) {
      _$jscoverage['/overlay/dialog.js'].lineData[237]++;
      return;
    }
    _$jscoverage['/overlay/dialog.js'].lineData[239]++;
    var $el = self.$el;
    _$jscoverage['/overlay/dialog.js'].lineData[243]++;
    var node = Node.all(e.target);
    _$jscoverage['/overlay/dialog.js'].lineData[248]++;
    var lastFocusItem = $el.last();
    _$jscoverage['/overlay/dialog.js'].lineData[253]++;
    if (visit23_253_1(node.equals($el) && e.shiftKey)) {
      _$jscoverage['/overlay/dialog.js'].lineData[254]++;
      lastFocusItem[0].focus();
      _$jscoverage['/overlay/dialog.js'].lineData[255]++;
      e.halt();
    } else {
      _$jscoverage['/overlay/dialog.js'].lineData[258]++;
      if (visit24_258_1(node.equals(lastFocusItem) && !e.shiftKey)) {
        _$jscoverage['/overlay/dialog.js'].lineData[259]++;
        self.focus();
        _$jscoverage['/overlay/dialog.js'].lineData[260]++;
        e.halt();
      } else {
        _$jscoverage['/overlay/dialog.js'].lineData[264]++;
        if (visit25_264_1(node.equals($el) || $el.contains(node))) {
          _$jscoverage['/overlay/dialog.js'].lineData[265]++;
          return;
        }
      }
    }
    _$jscoverage['/overlay/dialog.js'].lineData[270]++;
    e.halt();
  }
  _$jscoverage['/overlay/dialog.js'].lineData[272]++;
  return Dialog;
});
