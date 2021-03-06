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
if (! _$jscoverage['/router.js']) {
  _$jscoverage['/router.js'] = {};
  _$jscoverage['/router.js'].lineData = [];
  _$jscoverage['/router.js'].lineData[5] = 0;
  _$jscoverage['/router.js'].lineData[6] = 0;
  _$jscoverage['/router.js'].lineData[7] = 0;
  _$jscoverage['/router.js'].lineData[8] = 0;
  _$jscoverage['/router.js'].lineData[9] = 0;
  _$jscoverage['/router.js'].lineData[10] = 0;
  _$jscoverage['/router.js'].lineData[11] = 0;
  _$jscoverage['/router.js'].lineData[12] = 0;
  _$jscoverage['/router.js'].lineData[13] = 0;
  _$jscoverage['/router.js'].lineData[14] = 0;
  _$jscoverage['/router.js'].lineData[15] = 0;
  _$jscoverage['/router.js'].lineData[16] = 0;
  _$jscoverage['/router.js'].lineData[17] = 0;
  _$jscoverage['/router.js'].lineData[18] = 0;
  _$jscoverage['/router.js'].lineData[20] = 0;
  _$jscoverage['/router.js'].lineData[22] = 0;
  _$jscoverage['/router.js'].lineData[23] = 0;
  _$jscoverage['/router.js'].lineData[24] = 0;
  _$jscoverage['/router.js'].lineData[29] = 0;
  _$jscoverage['/router.js'].lineData[30] = 0;
  _$jscoverage['/router.js'].lineData[34] = 0;
  _$jscoverage['/router.js'].lineData[35] = 0;
  _$jscoverage['/router.js'].lineData[37] = 0;
  _$jscoverage['/router.js'].lineData[42] = 0;
  _$jscoverage['/router.js'].lineData[43] = 0;
  _$jscoverage['/router.js'].lineData[44] = 0;
  _$jscoverage['/router.js'].lineData[45] = 0;
  _$jscoverage['/router.js'].lineData[46] = 0;
  _$jscoverage['/router.js'].lineData[47] = 0;
  _$jscoverage['/router.js'].lineData[49] = 0;
  _$jscoverage['/router.js'].lineData[53] = 0;
  _$jscoverage['/router.js'].lineData[54] = 0;
  _$jscoverage['/router.js'].lineData[55] = 0;
  _$jscoverage['/router.js'].lineData[57] = 0;
  _$jscoverage['/router.js'].lineData[58] = 0;
  _$jscoverage['/router.js'].lineData[59] = 0;
  _$jscoverage['/router.js'].lineData[60] = 0;
  _$jscoverage['/router.js'].lineData[62] = 0;
  _$jscoverage['/router.js'].lineData[63] = 0;
  _$jscoverage['/router.js'].lineData[64] = 0;
  _$jscoverage['/router.js'].lineData[65] = 0;
  _$jscoverage['/router.js'].lineData[66] = 0;
  _$jscoverage['/router.js'].lineData[67] = 0;
  _$jscoverage['/router.js'].lineData[68] = 0;
  _$jscoverage['/router.js'].lineData[69] = 0;
  _$jscoverage['/router.js'].lineData[70] = 0;
  _$jscoverage['/router.js'].lineData[72] = 0;
  _$jscoverage['/router.js'].lineData[77] = 0;
  _$jscoverage['/router.js'].lineData[80] = 0;
  _$jscoverage['/router.js'].lineData[81] = 0;
  _$jscoverage['/router.js'].lineData[82] = 0;
  _$jscoverage['/router.js'].lineData[84] = 0;
  _$jscoverage['/router.js'].lineData[85] = 0;
  _$jscoverage['/router.js'].lineData[86] = 0;
  _$jscoverage['/router.js'].lineData[87] = 0;
  _$jscoverage['/router.js'].lineData[88] = 0;
  _$jscoverage['/router.js'].lineData[89] = 0;
  _$jscoverage['/router.js'].lineData[90] = 0;
  _$jscoverage['/router.js'].lineData[91] = 0;
  _$jscoverage['/router.js'].lineData[92] = 0;
  _$jscoverage['/router.js'].lineData[93] = 0;
  _$jscoverage['/router.js'].lineData[94] = 0;
  _$jscoverage['/router.js'].lineData[95] = 0;
  _$jscoverage['/router.js'].lineData[97] = 0;
  _$jscoverage['/router.js'].lineData[98] = 0;
  _$jscoverage['/router.js'].lineData[99] = 0;
  _$jscoverage['/router.js'].lineData[100] = 0;
  _$jscoverage['/router.js'].lineData[104] = 0;
  _$jscoverage['/router.js'].lineData[106] = 0;
  _$jscoverage['/router.js'].lineData[111] = 0;
  _$jscoverage['/router.js'].lineData[114] = 0;
  _$jscoverage['/router.js'].lineData[115] = 0;
  _$jscoverage['/router.js'].lineData[116] = 0;
  _$jscoverage['/router.js'].lineData[117] = 0;
  _$jscoverage['/router.js'].lineData[118] = 0;
  _$jscoverage['/router.js'].lineData[120] = 0;
  _$jscoverage['/router.js'].lineData[121] = 0;
  _$jscoverage['/router.js'].lineData[132] = 0;
  _$jscoverage['/router.js'].lineData[135] = 0;
  _$jscoverage['/router.js'].lineData[139] = 0;
  _$jscoverage['/router.js'].lineData[148] = 0;
  _$jscoverage['/router.js'].lineData[155] = 0;
  _$jscoverage['/router.js'].lineData[156] = 0;
  _$jscoverage['/router.js'].lineData[157] = 0;
  _$jscoverage['/router.js'].lineData[158] = 0;
  _$jscoverage['/router.js'].lineData[160] = 0;
  _$jscoverage['/router.js'].lineData[172] = 0;
  _$jscoverage['/router.js'].lineData[173] = 0;
  _$jscoverage['/router.js'].lineData[174] = 0;
  _$jscoverage['/router.js'].lineData[175] = 0;
  _$jscoverage['/router.js'].lineData[176] = 0;
  _$jscoverage['/router.js'].lineData[177] = 0;
  _$jscoverage['/router.js'].lineData[178] = 0;
  _$jscoverage['/router.js'].lineData[181] = 0;
  _$jscoverage['/router.js'].lineData[182] = 0;
  _$jscoverage['/router.js'].lineData[188] = 0;
  _$jscoverage['/router.js'].lineData[190] = 0;
  _$jscoverage['/router.js'].lineData[191] = 0;
  _$jscoverage['/router.js'].lineData[194] = 0;
  _$jscoverage['/router.js'].lineData[196] = 0;
  _$jscoverage['/router.js'].lineData[199] = 0;
  _$jscoverage['/router.js'].lineData[200] = 0;
  _$jscoverage['/router.js'].lineData[208] = 0;
  _$jscoverage['/router.js'].lineData[209] = 0;
  _$jscoverage['/router.js'].lineData[210] = 0;
  _$jscoverage['/router.js'].lineData[218] = 0;
  _$jscoverage['/router.js'].lineData[219] = 0;
  _$jscoverage['/router.js'].lineData[220] = 0;
  _$jscoverage['/router.js'].lineData[221] = 0;
  _$jscoverage['/router.js'].lineData[224] = 0;
  _$jscoverage['/router.js'].lineData[232] = 0;
  _$jscoverage['/router.js'].lineData[233] = 0;
  _$jscoverage['/router.js'].lineData[234] = 0;
  _$jscoverage['/router.js'].lineData[235] = 0;
  _$jscoverage['/router.js'].lineData[236] = 0;
  _$jscoverage['/router.js'].lineData[237] = 0;
  _$jscoverage['/router.js'].lineData[238] = 0;
  _$jscoverage['/router.js'].lineData[239] = 0;
  _$jscoverage['/router.js'].lineData[242] = 0;
  _$jscoverage['/router.js'].lineData[249] = 0;
  _$jscoverage['/router.js'].lineData[250] = 0;
  _$jscoverage['/router.js'].lineData[251] = 0;
  _$jscoverage['/router.js'].lineData[259] = 0;
  _$jscoverage['/router.js'].lineData[260] = 0;
  _$jscoverage['/router.js'].lineData[261] = 0;
  _$jscoverage['/router.js'].lineData[262] = 0;
  _$jscoverage['/router.js'].lineData[265] = 0;
  _$jscoverage['/router.js'].lineData[268] = 0;
  _$jscoverage['/router.js'].lineData[269] = 0;
  _$jscoverage['/router.js'].lineData[270] = 0;
  _$jscoverage['/router.js'].lineData[272] = 0;
  _$jscoverage['/router.js'].lineData[273] = 0;
  _$jscoverage['/router.js'].lineData[274] = 0;
  _$jscoverage['/router.js'].lineData[275] = 0;
  _$jscoverage['/router.js'].lineData[278] = 0;
  _$jscoverage['/router.js'].lineData[280] = 0;
  _$jscoverage['/router.js'].lineData[283] = 0;
  _$jscoverage['/router.js'].lineData[286] = 0;
  _$jscoverage['/router.js'].lineData[288] = 0;
  _$jscoverage['/router.js'].lineData[290] = 0;
  _$jscoverage['/router.js'].lineData[291] = 0;
  _$jscoverage['/router.js'].lineData[293] = 0;
  _$jscoverage['/router.js'].lineData[297] = 0;
  _$jscoverage['/router.js'].lineData[300] = 0;
  _$jscoverage['/router.js'].lineData[301] = 0;
  _$jscoverage['/router.js'].lineData[302] = 0;
  _$jscoverage['/router.js'].lineData[303] = 0;
  _$jscoverage['/router.js'].lineData[305] = 0;
  _$jscoverage['/router.js'].lineData[319] = 0;
  _$jscoverage['/router.js'].lineData[320] = 0;
  _$jscoverage['/router.js'].lineData[321] = 0;
  _$jscoverage['/router.js'].lineData[323] = 0;
  _$jscoverage['/router.js'].lineData[327] = 0;
  _$jscoverage['/router.js'].lineData[335] = 0;
  _$jscoverage['/router.js'].lineData[336] = 0;
  _$jscoverage['/router.js'].lineData[337] = 0;
  _$jscoverage['/router.js'].lineData[340] = 0;
  _$jscoverage['/router.js'].lineData[348] = 0;
  _$jscoverage['/router.js'].lineData[349] = 0;
  _$jscoverage['/router.js'].lineData[355] = 0;
  _$jscoverage['/router.js'].lineData[356] = 0;
  _$jscoverage['/router.js'].lineData[358] = 0;
  _$jscoverage['/router.js'].lineData[359] = 0;
  _$jscoverage['/router.js'].lineData[361] = 0;
  _$jscoverage['/router.js'].lineData[370] = 0;
  _$jscoverage['/router.js'].lineData[371] = 0;
  _$jscoverage['/router.js'].lineData[372] = 0;
  _$jscoverage['/router.js'].lineData[374] = 0;
  _$jscoverage['/router.js'].lineData[379] = 0;
  _$jscoverage['/router.js'].lineData[380] = 0;
  _$jscoverage['/router.js'].lineData[381] = 0;
  _$jscoverage['/router.js'].lineData[382] = 0;
  _$jscoverage['/router.js'].lineData[386] = 0;
  _$jscoverage['/router.js'].lineData[388] = 0;
  _$jscoverage['/router.js'].lineData[390] = 0;
  _$jscoverage['/router.js'].lineData[391] = 0;
  _$jscoverage['/router.js'].lineData[392] = 0;
  _$jscoverage['/router.js'].lineData[395] = 0;
  _$jscoverage['/router.js'].lineData[396] = 0;
  _$jscoverage['/router.js'].lineData[397] = 0;
  _$jscoverage['/router.js'].lineData[398] = 0;
  _$jscoverage['/router.js'].lineData[399] = 0;
  _$jscoverage['/router.js'].lineData[400] = 0;
  _$jscoverage['/router.js'].lineData[401] = 0;
  _$jscoverage['/router.js'].lineData[404] = 0;
  _$jscoverage['/router.js'].lineData[406] = 0;
  _$jscoverage['/router.js'].lineData[413] = 0;
  _$jscoverage['/router.js'].lineData[414] = 0;
  _$jscoverage['/router.js'].lineData[417] = 0;
  _$jscoverage['/router.js'].lineData[418] = 0;
  _$jscoverage['/router.js'].lineData[422] = 0;
  _$jscoverage['/router.js'].lineData[423] = 0;
  _$jscoverage['/router.js'].lineData[426] = 0;
  _$jscoverage['/router.js'].lineData[429] = 0;
  _$jscoverage['/router.js'].lineData[430] = 0;
  _$jscoverage['/router.js'].lineData[431] = 0;
  _$jscoverage['/router.js'].lineData[432] = 0;
}
if (! _$jscoverage['/router.js'].functionData) {
  _$jscoverage['/router.js'].functionData = [];
  _$jscoverage['/router.js'].functionData[0] = 0;
  _$jscoverage['/router.js'].functionData[1] = 0;
  _$jscoverage['/router.js'].functionData[2] = 0;
  _$jscoverage['/router.js'].functionData[3] = 0;
  _$jscoverage['/router.js'].functionData[4] = 0;
  _$jscoverage['/router.js'].functionData[5] = 0;
  _$jscoverage['/router.js'].functionData[6] = 0;
  _$jscoverage['/router.js'].functionData[7] = 0;
  _$jscoverage['/router.js'].functionData[8] = 0;
  _$jscoverage['/router.js'].functionData[9] = 0;
  _$jscoverage['/router.js'].functionData[10] = 0;
  _$jscoverage['/router.js'].functionData[11] = 0;
  _$jscoverage['/router.js'].functionData[12] = 0;
  _$jscoverage['/router.js'].functionData[13] = 0;
  _$jscoverage['/router.js'].functionData[14] = 0;
  _$jscoverage['/router.js'].functionData[15] = 0;
  _$jscoverage['/router.js'].functionData[16] = 0;
  _$jscoverage['/router.js'].functionData[17] = 0;
  _$jscoverage['/router.js'].functionData[18] = 0;
  _$jscoverage['/router.js'].functionData[19] = 0;
  _$jscoverage['/router.js'].functionData[20] = 0;
  _$jscoverage['/router.js'].functionData[21] = 0;
  _$jscoverage['/router.js'].functionData[22] = 0;
}
if (! _$jscoverage['/router.js'].branchData) {
  _$jscoverage['/router.js'].branchData = {};
  _$jscoverage['/router.js'].branchData['18'] = [];
  _$jscoverage['/router.js'].branchData['18'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['34'] = [];
  _$jscoverage['/router.js'].branchData['34'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['43'] = [];
  _$jscoverage['/router.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['45'] = [];
  _$jscoverage['/router.js'].branchData['45'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['59'] = [];
  _$jscoverage['/router.js'].branchData['59'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['63'] = [];
  _$jscoverage['/router.js'].branchData['63'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['86'] = [];
  _$jscoverage['/router.js'].branchData['86'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['93'] = [];
  _$jscoverage['/router.js'].branchData['93'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['98'] = [];
  _$jscoverage['/router.js'].branchData['98'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['120'] = [];
  _$jscoverage['/router.js'].branchData['120'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['124'] = [];
  _$jscoverage['/router.js'].branchData['124'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['126'] = [];
  _$jscoverage['/router.js'].branchData['126'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['127'] = [];
  _$jscoverage['/router.js'].branchData['127'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['127'][2] = new BranchData();
  _$jscoverage['/router.js'].branchData['127'][3] = new BranchData();
  _$jscoverage['/router.js'].branchData['156'] = [];
  _$jscoverage['/router.js'].branchData['156'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['173'] = [];
  _$jscoverage['/router.js'].branchData['173'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['174'] = [];
  _$jscoverage['/router.js'].branchData['174'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['175'] = [];
  _$jscoverage['/router.js'].branchData['175'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['176'] = [];
  _$jscoverage['/router.js'].branchData['176'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['181'] = [];
  _$jscoverage['/router.js'].branchData['181'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['190'] = [];
  _$jscoverage['/router.js'].branchData['190'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['199'] = [];
  _$jscoverage['/router.js'].branchData['199'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['219'] = [];
  _$jscoverage['/router.js'].branchData['219'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['220'] = [];
  _$jscoverage['/router.js'].branchData['220'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['233'] = [];
  _$jscoverage['/router.js'].branchData['233'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['235'] = [];
  _$jscoverage['/router.js'].branchData['235'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['236'] = [];
  _$jscoverage['/router.js'].branchData['236'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['238'] = [];
  _$jscoverage['/router.js'].branchData['238'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['260'] = [];
  _$jscoverage['/router.js'].branchData['260'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['261'] = [];
  _$jscoverage['/router.js'].branchData['261'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['272'] = [];
  _$jscoverage['/router.js'].branchData['272'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['277'] = [];
  _$jscoverage['/router.js'].branchData['277'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['290'] = [];
  _$jscoverage['/router.js'].branchData['290'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['300'] = [];
  _$jscoverage['/router.js'].branchData['300'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['302'] = [];
  _$jscoverage['/router.js'].branchData['302'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['320'] = [];
  _$jscoverage['/router.js'].branchData['320'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['336'] = [];
  _$jscoverage['/router.js'].branchData['336'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['337'] = [];
  _$jscoverage['/router.js'].branchData['337'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['348'] = [];
  _$jscoverage['/router.js'].branchData['348'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['349'] = [];
  _$jscoverage['/router.js'].branchData['349'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['355'] = [];
  _$jscoverage['/router.js'].branchData['355'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['356'] = [];
  _$jscoverage['/router.js'].branchData['356'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['370'] = [];
  _$jscoverage['/router.js'].branchData['370'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['381'] = [];
  _$jscoverage['/router.js'].branchData['381'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['390'] = [];
  _$jscoverage['/router.js'].branchData['390'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['391'] = [];
  _$jscoverage['/router.js'].branchData['391'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['397'] = [];
  _$jscoverage['/router.js'].branchData['397'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['397'][2] = new BranchData();
  _$jscoverage['/router.js'].branchData['400'] = [];
  _$jscoverage['/router.js'].branchData['400'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['404'] = [];
  _$jscoverage['/router.js'].branchData['404'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['413'] = [];
  _$jscoverage['/router.js'].branchData['413'][1] = new BranchData();
  _$jscoverage['/router.js'].branchData['417'] = [];
  _$jscoverage['/router.js'].branchData['417'][1] = new BranchData();
}
_$jscoverage['/router.js'].branchData['417'][1].init(1663, 8, 'callback');
function visit75_417_1(result) {
  _$jscoverage['/router.js'].branchData['417'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['413'][1].init(1573, 12, 'triggerRoute');
function visit74_413_1(result) {
  _$jscoverage['/router.js'].branchData['413'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['404'][1].init(1155, 18, 'needReplaceHistory');
function visit73_404_1(result) {
  _$jscoverage['/router.js'].branchData['404'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['400'][1].init(485, 45, 'supportHistoryPushState && utils.hasVid(href)');
function visit72_400_1(result) {
  _$jscoverage['/router.js'].branchData['400'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['397'][2].init(295, 44, 'getVidFromUrlWithHash(href) !== viewUniqueId');
function visit71_397_2(result) {
  _$jscoverage['/router.js'].branchData['397'][2].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['397'][1].init(267, 72, '!supportHistoryPushState && getVidFromUrlWithHash(href) !== viewUniqueId');
function visit70_397_1(result) {
  _$jscoverage['/router.js'].branchData['397'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['391'][1].init(22, 18, '!getUrlForRouter()');
function visit69_391_1(result) {
  _$jscoverage['/router.js'].branchData['391'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['390'][1].init(493, 7, 'useHash');
function visit68_390_1(result) {
  _$jscoverage['/router.js'].branchData['390'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['381'][1].init(81, 23, 'supportHistoryPushState');
function visit67_381_1(result) {
  _$jscoverage['/router.js'].branchData['381'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['370'][1].init(880, 42, '!utils.equalsIgnoreSlash(locPath, urlRoot)');
function visit66_370_1(result) {
  _$jscoverage['/router.js'].branchData['370'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['356'][1].init(26, 41, 'utils.equalsIgnoreSlash(locPath, urlRoot)');
function visit65_356_1(result) {
  _$jscoverage['/router.js'].branchData['356'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['355'][1].init(216, 11, 'hashIsValid');
function visit64_355_1(result) {
  _$jscoverage['/router.js'].branchData['355'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['349'][1].init(18, 23, 'supportHistoryPushState');
function visit63_349_1(result) {
  _$jscoverage['/router.js'].branchData['349'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['348'][1].init(426, 8, '!useHash');
function visit62_348_1(result) {
  _$jscoverage['/router.js'].branchData['348'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['337'][1].init(21, 34, 'callback && callback.call(exports)');
function visit61_337_1(result) {
  _$jscoverage['/router.js'].branchData['337'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['336'][1].init(14, 7, 'started');
function visit60_336_1(result) {
  _$jscoverage['/router.js'].branchData['336'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['320'][1].init(14, 12, 'opts.urlRoot');
function visit59_320_1(result) {
  _$jscoverage['/router.js'].branchData['320'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['302'][1].init(183, 4, '!vid');
function visit58_302_1(result) {
  _$jscoverage['/router.js'].branchData['302'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['300'][1].init(93, 25, 'e.newURL || location.href');
function visit57_300_1(result) {
  _$jscoverage['/router.js'].branchData['300'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['290'][1].init(121, 6, '!state');
function visit56_290_1(result) {
  _$jscoverage['/router.js'].branchData['290'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['277'][1].init(80, 45, 'vid !== viewsHistory[viewsHistory.length - 1]');
function visit55_277_1(result) {
  _$jscoverage['/router.js'].branchData['277'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['272'][1].init(77, 45, 'vid === viewsHistory[viewsHistory.length - 2]');
function visit54_272_1(result) {
  _$jscoverage['/router.js'].branchData['272'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['261'][1].init(18, 28, 'routes[i].path === routePath');
function visit53_261_1(result) {
  _$jscoverage['/router.js'].branchData['261'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['260'][1].init(45, 5, 'i < l');
function visit52_260_1(result) {
  _$jscoverage['/router.js'].branchData['260'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['238'][1].init(75, 19, '!r.callbacks.length');
function visit51_238_1(result) {
  _$jscoverage['/router.js'].branchData['238'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['236'][1].init(22, 8, 'callback');
function visit50_236_1(result) {
  _$jscoverage['/router.js'].branchData['236'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['235'][1].init(50, 20, 'r.path === routePath');
function visit49_235_1(result) {
  _$jscoverage['/router.js'].branchData['235'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['233'][1].init(42, 6, 'i >= 0');
function visit48_233_1(result) {
  _$jscoverage['/router.js'].branchData['233'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['220'][1].init(18, 21, 'routes[i].match(path)');
function visit47_220_1(result) {
  _$jscoverage['/router.js'].branchData['220'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['219'][1].init(45, 5, 'i < l');
function visit46_219_1(result) {
  _$jscoverage['/router.js'].branchData['219'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['199'][1].init(1154, 25, 'opts && opts.triggerRoute');
function visit45_199_1(result) {
  _$jscoverage['/router.js'].branchData['199'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['190'][1].init(22, 23, 'supportHistoryPushState');
function visit44_190_1(result) {
  _$jscoverage['/router.js'].branchData['190'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['181'][1].init(195, 48, '!globalConfig.useHash && supportHistoryPushState');
function visit43_181_1(result) {
  _$jscoverage['/router.js'].branchData['181'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['176'][1].init(18, 8, '!replace');
function visit42_176_1(result) {
  _$jscoverage['/router.js'].branchData['176'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['175'][1].init(88, 26, 'getUrlForRouter() !== path');
function visit41_175_1(result) {
  _$jscoverage['/router.js'].branchData['175'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['174'][1].init(52, 21, 'opts.replace || false');
function visit40_174_1(result) {
  _$jscoverage['/router.js'].branchData['174'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['173'][1].init(17, 10, 'opts || {}');
function visit39_173_1(result) {
  _$jscoverage['/router.js'].branchData['173'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['156'][1].init(14, 26, 'typeof prefix !== \'string\'');
function visit38_156_1(result) {
  _$jscoverage['/router.js'].branchData['156'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['127'][3].init(223, 17, 'replace === false');
function visit37_127_3(result) {
  _$jscoverage['/router.js'].branchData['127'][3].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['127'][2].init(201, 18, 'backward === false');
function visit36_127_2(result) {
  _$jscoverage['/router.js'].branchData['127'][2].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['127'][1].init(201, 39, 'backward === false && replace === false');
function visit35_127_1(result) {
  _$jscoverage['/router.js'].branchData['127'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['126'][1].init(160, 16, 'replace === true');
function visit34_126_1(result) {
  _$jscoverage['/router.js'].branchData['126'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['124'][1].init(87, 17, 'backward === true');
function visit33_124_1(result) {
  _$jscoverage['/router.js'].branchData['124'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['120'][1].init(189, 21, 'uri.toString() || \'/\'');
function visit32_120_1(result) {
  _$jscoverage['/router.js'].branchData['120'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['98'][1].init(80, 30, 'callbackIndex !== callbacksLen');
function visit31_98_1(result) {
  _$jscoverage['/router.js'].branchData['98'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['93'][1].init(30, 17, 'cause === \'route\'');
function visit30_93_1(result) {
  _$jscoverage['/router.js'].branchData['93'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['86'][1].init(40, 13, 'index !== len');
function visit29_86_1(result) {
  _$jscoverage['/router.js'].branchData['86'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['63'][1].init(76, 53, 'S.startsWith(request.path + \'/\', middleware[0] + \'/\')');
function visit28_63_1(result) {
  _$jscoverage['/router.js'].branchData['63'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['59'][1].init(40, 13, 'index === len');
function visit27_59_1(result) {
  _$jscoverage['/router.js'].branchData['59'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['45'][1].init(84, 48, '!globalConfig.useHash && supportHistoryPushState');
function visit26_45_1(result) {
  _$jscoverage['/router.js'].branchData['45'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['43'][1].init(16, 20, 'url || location.href');
function visit25_43_1(result) {
  _$jscoverage['/router.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['34'][1].init(220, 7, 'replace');
function visit24_34_1(result) {
  _$jscoverage['/router.js'].branchData['34'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].branchData['18'][1].init(536, 28, 'history && history.pushState');
function visit23_18_1(result) {
  _$jscoverage['/router.js'].branchData['18'][1].ranCondition(result);
  return result;
}_$jscoverage['/router.js'].lineData[5]++;
KISSY.add(function(S, require, exports) {
  _$jscoverage['/router.js'].functionData[0]++;
  _$jscoverage['/router.js'].lineData[6]++;
  var middlewares = [];
  _$jscoverage['/router.js'].lineData[7]++;
  var routes = [];
  _$jscoverage['/router.js'].lineData[8]++;
  var utils = require('./router/utils');
  _$jscoverage['/router.js'].lineData[9]++;
  var Route = require('./router/route');
  _$jscoverage['/router.js'].lineData[10]++;
  var Uri = require('uri');
  _$jscoverage['/router.js'].lineData[11]++;
  var Request = require('./router/request');
  _$jscoverage['/router.js'].lineData[12]++;
  var DomEvent = require('event/dom');
  _$jscoverage['/router.js'].lineData[13]++;
  var CustomEvent = require('event/custom');
  _$jscoverage['/router.js'].lineData[14]++;
  var getVidFromUrlWithHash = utils.getVidFromUrlWithHash;
  _$jscoverage['/router.js'].lineData[15]++;
  var win = S.Env.host;
  _$jscoverage['/router.js'].lineData[16]++;
  var history = win.history;
  _$jscoverage['/router.js'].lineData[17]++;
  var supportNativeHashChange = S.Feature.isHashChangeSupported();
  _$jscoverage['/router.js'].lineData[18]++;
  var supportHistoryPushState = !!(visit23_18_1(history && history.pushState));
  _$jscoverage['/router.js'].lineData[20]++;
  var BREATH_INTERVAL = 100;
  _$jscoverage['/router.js'].lineData[22]++;
  var viewUniqueId = 10;
  _$jscoverage['/router.js'].lineData[23]++;
  var viewsHistory = [viewUniqueId];
  _$jscoverage['/router.js'].lineData[24]++;
  var globalConfig = {
  urlRoot: '', 
  useHash: !supportHistoryPushState};
  _$jscoverage['/router.js'].lineData[29]++;
  function setPathByHash(path, replace) {
    _$jscoverage['/router.js'].functionData[1]++;
    _$jscoverage['/router.js'].lineData[30]++;
    var hash = utils.addVid('#!' + path + (supportNativeHashChange ? '' : (replace ? DomEvent.REPLACE_HISTORY : '')), viewUniqueId);
    _$jscoverage['/router.js'].lineData[34]++;
    if (visit24_34_1(replace)) {
      _$jscoverage['/router.js'].lineData[35]++;
      location.replace(hash);
    } else {
      _$jscoverage['/router.js'].lineData[37]++;
      location.hash = hash;
    }
  }
  _$jscoverage['/router.js'].lineData[42]++;
  function getUrlForRouter(url) {
    _$jscoverage['/router.js'].functionData[2]++;
    _$jscoverage['/router.js'].lineData[43]++;
    url = visit25_43_1(url || location.href);
    _$jscoverage['/router.js'].lineData[44]++;
    var uri = new Uri(url);
    _$jscoverage['/router.js'].lineData[45]++;
    if (visit26_45_1(!globalConfig.useHash && supportHistoryPushState)) {
      _$jscoverage['/router.js'].lineData[46]++;
      var query = uri.query;
      _$jscoverage['/router.js'].lineData[47]++;
      return uri.getPath().substr(globalConfig.urlRoot.length) + (query.has() ? ('?' + query.toString()) : '');
    } else {
      _$jscoverage['/router.js'].lineData[49]++;
      return utils.getHash(uri);
    }
  }
  _$jscoverage['/router.js'].lineData[53]++;
  function fireMiddleWare(request, response, cb) {
    _$jscoverage['/router.js'].functionData[3]++;
    _$jscoverage['/router.js'].lineData[54]++;
    var index = -1;
    _$jscoverage['/router.js'].lineData[55]++;
    var len = middlewares.length;
    _$jscoverage['/router.js'].lineData[57]++;
    function next() {
      _$jscoverage['/router.js'].functionData[4]++;
      _$jscoverage['/router.js'].lineData[58]++;
      index++;
      _$jscoverage['/router.js'].lineData[59]++;
      if (visit27_59_1(index === len)) {
        _$jscoverage['/router.js'].lineData[60]++;
        cb(request, response);
      } else {
        _$jscoverage['/router.js'].lineData[62]++;
        var middleware = middlewares[index];
        _$jscoverage['/router.js'].lineData[63]++;
        if (visit28_63_1(S.startsWith(request.path + '/', middleware[0] + '/'))) {
          _$jscoverage['/router.js'].lineData[64]++;
          var prefixLen = middleware[0].length;
          _$jscoverage['/router.js'].lineData[65]++;
          request.url = request.url.slice(prefixLen);
          _$jscoverage['/router.js'].lineData[66]++;
          var path = request.path;
          _$jscoverage['/router.js'].lineData[67]++;
          request.path = request.path.slice(prefixLen);
          _$jscoverage['/router.js'].lineData[68]++;
          middleware[1](request, next);
          _$jscoverage['/router.js'].lineData[69]++;
          request.url = request.originalUrl;
          _$jscoverage['/router.js'].lineData[70]++;
          request.path = path;
        } else {
          _$jscoverage['/router.js'].lineData[72]++;
          next();
        }
      }
    }
    _$jscoverage['/router.js'].lineData[77]++;
    next();
  }
  _$jscoverage['/router.js'].lineData[80]++;
  function fireRoutes(request, response) {
    _$jscoverage['/router.js'].functionData[5]++;
    _$jscoverage['/router.js'].lineData[81]++;
    var index = -1;
    _$jscoverage['/router.js'].lineData[82]++;
    var len = routes.length;
    _$jscoverage['/router.js'].lineData[84]++;
    function next() {
      _$jscoverage['/router.js'].functionData[6]++;
      _$jscoverage['/router.js'].lineData[85]++;
      index++;
      _$jscoverage['/router.js'].lineData[86]++;
      if (visit29_86_1(index !== len)) {
        _$jscoverage['/router.js'].lineData[87]++;
        var route = routes[index];
        _$jscoverage['/router.js'].lineData[88]++;
        if ((request.params = route.match(request.path))) {
          _$jscoverage['/router.js'].lineData[89]++;
          var callbackIndex = -1;
          _$jscoverage['/router.js'].lineData[90]++;
          var callbacks = route.callbacks;
          _$jscoverage['/router.js'].lineData[91]++;
          var callbacksLen = callbacks.length;
          _$jscoverage['/router.js'].lineData[92]++;
          var nextCallback = function(cause) {
  _$jscoverage['/router.js'].functionData[7]++;
  _$jscoverage['/router.js'].lineData[93]++;
  if (visit30_93_1(cause === 'route')) {
    _$jscoverage['/router.js'].lineData[94]++;
    nextCallback = null;
    _$jscoverage['/router.js'].lineData[95]++;
    next();
  } else {
    _$jscoverage['/router.js'].lineData[97]++;
    callbackIndex++;
    _$jscoverage['/router.js'].lineData[98]++;
    if (visit31_98_1(callbackIndex !== callbacksLen)) {
      _$jscoverage['/router.js'].lineData[99]++;
      request.route = route;
      _$jscoverage['/router.js'].lineData[100]++;
      callbacks[callbackIndex](request, response, nextCallback);
    }
  }
};
          _$jscoverage['/router.js'].lineData[104]++;
          nextCallback('');
        } else {
          _$jscoverage['/router.js'].lineData[106]++;
          next();
        }
      }
    }
    _$jscoverage['/router.js'].lineData[111]++;
    next();
  }
  _$jscoverage['/router.js'].lineData[114]++;
  function dispatch(backward, replace) {
    _$jscoverage['/router.js'].functionData[8]++;
    _$jscoverage['/router.js'].lineData[115]++;
    var url = getUrlForRouter();
    _$jscoverage['/router.js'].lineData[116]++;
    var uri = new S.Uri(url);
    _$jscoverage['/router.js'].lineData[117]++;
    var query = uri.query.get();
    _$jscoverage['/router.js'].lineData[118]++;
    uri.query.reset();
    _$jscoverage['/router.js'].lineData[120]++;
    var path = visit32_120_1(uri.toString() || '/');
    _$jscoverage['/router.js'].lineData[121]++;
    var request = new Request({
  query: query, 
  backward: visit33_124_1(backward === true), 
  replace: visit34_126_1(replace === true), 
  forward: (visit35_127_1(visit36_127_2(backward === false) && visit37_127_3(replace === false))), 
  path: path, 
  url: url, 
  originalUrl: url});
    _$jscoverage['/router.js'].lineData[132]++;
    var response = {
  redirect: exports.navigate};
    _$jscoverage['/router.js'].lineData[135]++;
    exports.fire('dispatch', {
  request: request, 
  response: response});
    _$jscoverage['/router.js'].lineData[139]++;
    fireMiddleWare(request, response, fireRoutes);
  }
  _$jscoverage['/router.js'].lineData[148]++;
  S.mix(exports, CustomEvent.Target);
  _$jscoverage['/router.js'].lineData[155]++;
  exports.use = function(prefix, callback) {
  _$jscoverage['/router.js'].functionData[9]++;
  _$jscoverage['/router.js'].lineData[156]++;
  if (visit38_156_1(typeof prefix !== 'string')) {
    _$jscoverage['/router.js'].lineData[157]++;
    callback = prefix;
    _$jscoverage['/router.js'].lineData[158]++;
    prefix = '';
  }
  _$jscoverage['/router.js'].lineData[160]++;
  middlewares.push([prefix, callback]);
};
  _$jscoverage['/router.js'].lineData[172]++;
  exports.navigate = function(path, opts) {
  _$jscoverage['/router.js'].functionData[10]++;
  _$jscoverage['/router.js'].lineData[173]++;
  opts = visit39_173_1(opts || {});
  _$jscoverage['/router.js'].lineData[174]++;
  var replace = visit40_174_1(opts.replace || false);
  _$jscoverage['/router.js'].lineData[175]++;
  if (visit41_175_1(getUrlForRouter() !== path)) {
    _$jscoverage['/router.js'].lineData[176]++;
    if (visit42_176_1(!replace)) {
      _$jscoverage['/router.js'].lineData[177]++;
      viewUniqueId++;
      _$jscoverage['/router.js'].lineData[178]++;
      viewsHistory.push(viewUniqueId);
    }
    _$jscoverage['/router.js'].lineData[181]++;
    if (visit43_181_1(!globalConfig.useHash && supportHistoryPushState)) {
      _$jscoverage['/router.js'].lineData[182]++;
      history[replace ? 'replaceState' : 'pushState']({
  vid: viewUniqueId}, '', utils.getFullPath(path, globalConfig.urlRoot));
      _$jscoverage['/router.js'].lineData[188]++;
      dispatch(false, replace);
    } else {
      _$jscoverage['/router.js'].lineData[190]++;
      if (visit44_190_1(supportHistoryPushState)) {
        _$jscoverage['/router.js'].lineData[191]++;
        history[replace ? 'replaceState' : 'pushState']({
  vid: viewUniqueId}, '', '#!' + path);
        _$jscoverage['/router.js'].lineData[194]++;
        dispatch(false, replace);
      } else {
        _$jscoverage['/router.js'].lineData[196]++;
        setPathByHash(path, replace);
      }
    }
  } else {
    _$jscoverage['/router.js'].lineData[199]++;
    if (visit45_199_1(opts && opts.triggerRoute)) {
      _$jscoverage['/router.js'].lineData[200]++;
      dispatch(false, true);
    }
  }
};
  _$jscoverage['/router.js'].lineData[208]++;
  exports.get = function(routePath) {
  _$jscoverage['/router.js'].functionData[11]++;
  _$jscoverage['/router.js'].lineData[209]++;
  var callbacks = S.makeArray(arguments).slice(1);
  _$jscoverage['/router.js'].lineData[210]++;
  routes.push(new Route(routePath, callbacks, globalConfig));
};
  _$jscoverage['/router.js'].lineData[218]++;
  exports.matchRoute = function(path) {
  _$jscoverage['/router.js'].functionData[12]++;
  _$jscoverage['/router.js'].lineData[219]++;
  for (var i = 0, l = routes.length; visit46_219_1(i < l); i++) {
    _$jscoverage['/router.js'].lineData[220]++;
    if (visit47_220_1(routes[i].match(path))) {
      _$jscoverage['/router.js'].lineData[221]++;
      return routes[i];
    }
  }
  _$jscoverage['/router.js'].lineData[224]++;
  return false;
};
  _$jscoverage['/router.js'].lineData[232]++;
  exports.removeRoute = function(routePath, callback) {
  _$jscoverage['/router.js'].functionData[13]++;
  _$jscoverage['/router.js'].lineData[233]++;
  for (var i = routes.length - 1; visit48_233_1(i >= 0); i--) {
    _$jscoverage['/router.js'].lineData[234]++;
    var r = routes[i];
    _$jscoverage['/router.js'].lineData[235]++;
    if (visit49_235_1(r.path === routePath)) {
      _$jscoverage['/router.js'].lineData[236]++;
      if (visit50_236_1(callback)) {
        _$jscoverage['/router.js'].lineData[237]++;
        r.removeCallback(callback);
        _$jscoverage['/router.js'].lineData[238]++;
        if (visit51_238_1(!r.callbacks.length)) {
          _$jscoverage['/router.js'].lineData[239]++;
          routes.splice(i, 1);
        }
      } else {
        _$jscoverage['/router.js'].lineData[242]++;
        routes.splice(i, 1);
      }
    }
  }
};
  _$jscoverage['/router.js'].lineData[249]++;
  exports.clearRoutes = function() {
  _$jscoverage['/router.js'].functionData[14]++;
  _$jscoverage['/router.js'].lineData[250]++;
  middlewares = [];
  _$jscoverage['/router.js'].lineData[251]++;
  routes = [];
};
  _$jscoverage['/router.js'].lineData[259]++;
  exports.hasRoute = function(routePath) {
  _$jscoverage['/router.js'].functionData[15]++;
  _$jscoverage['/router.js'].lineData[260]++;
  for (var i = 0, l = routes.length; visit52_260_1(i < l); i++) {
    _$jscoverage['/router.js'].lineData[261]++;
    if (visit53_261_1(routes[i].path === routePath)) {
      _$jscoverage['/router.js'].lineData[262]++;
      return routes[i];
    }
  }
  _$jscoverage['/router.js'].lineData[265]++;
  return false;
};
  _$jscoverage['/router.js'].lineData[268]++;
  function dispatchByVid(vid) {
    _$jscoverage['/router.js'].functionData[16]++;
    _$jscoverage['/router.js'].lineData[269]++;
    var backward = false;
    _$jscoverage['/router.js'].lineData[270]++;
    var replace = false;
    _$jscoverage['/router.js'].lineData[272]++;
    if (visit54_272_1(vid === viewsHistory[viewsHistory.length - 2])) {
      _$jscoverage['/router.js'].lineData[273]++;
      backward = true;
      _$jscoverage['/router.js'].lineData[274]++;
      viewsHistory.pop();
    } else {
      _$jscoverage['/router.js'].lineData[275]++;
      if (visit55_277_1(vid !== viewsHistory[viewsHistory.length - 1])) {
        _$jscoverage['/router.js'].lineData[278]++;
        viewsHistory.push(vid);
      } else {
        _$jscoverage['/router.js'].lineData[280]++;
        replace = true;
      }
    }
    _$jscoverage['/router.js'].lineData[283]++;
    dispatch(backward, replace);
  }
  _$jscoverage['/router.js'].lineData[286]++;
  function onPopState(e) {
    _$jscoverage['/router.js'].functionData[17]++;
    _$jscoverage['/router.js'].lineData[288]++;
    var state = e.originalEvent.state;
    _$jscoverage['/router.js'].lineData[290]++;
    if (visit56_290_1(!state)) {
      _$jscoverage['/router.js'].lineData[291]++;
      return;
    }
    _$jscoverage['/router.js'].lineData[293]++;
    dispatchByVid(state.vid);
  }
  _$jscoverage['/router.js'].lineData[297]++;
  function onHashChange(e) {
    _$jscoverage['/router.js'].functionData[18]++;
    _$jscoverage['/router.js'].lineData[300]++;
    var newURL = visit57_300_1(e.newURL || location.href);
    _$jscoverage['/router.js'].lineData[301]++;
    var vid = getVidFromUrlWithHash(newURL);
    _$jscoverage['/router.js'].lineData[302]++;
    if (visit58_302_1(!vid)) {
      _$jscoverage['/router.js'].lineData[303]++;
      return;
    }
    _$jscoverage['/router.js'].lineData[305]++;
    dispatchByVid(vid);
  }
  _$jscoverage['/router.js'].lineData[319]++;
  exports.config = function(opts) {
  _$jscoverage['/router.js'].functionData[19]++;
  _$jscoverage['/router.js'].lineData[320]++;
  if (visit59_320_1(opts.urlRoot)) {
    _$jscoverage['/router.js'].lineData[321]++;
    opts.urlRoot = opts.urlRoot.replace(/\/$/, '');
  }
  _$jscoverage['/router.js'].lineData[323]++;
  S.mix(globalConfig, opts);
};
  _$jscoverage['/router.js'].lineData[327]++;
  var started;
  _$jscoverage['/router.js'].lineData[335]++;
  exports.start = function(callback) {
  _$jscoverage['/router.js'].functionData[20]++;
  _$jscoverage['/router.js'].lineData[336]++;
  if (visit60_336_1(started)) {
    _$jscoverage['/router.js'].lineData[337]++;
    return visit61_337_1(callback && callback.call(exports));
  }
  _$jscoverage['/router.js'].lineData[340]++;
  var useHash = globalConfig.useHash, urlRoot = globalConfig.urlRoot, triggerRoute = globalConfig.triggerRoute, locPath = location.pathname, href = location.href, hash = getUrlForRouter(), hashIsValid = location.hash.match(/#!.+/);
  _$jscoverage['/router.js'].lineData[348]++;
  if (visit62_348_1(!useHash)) {
    _$jscoverage['/router.js'].lineData[349]++;
    if (visit63_349_1(supportHistoryPushState)) {
      _$jscoverage['/router.js'].lineData[355]++;
      if (visit64_355_1(hashIsValid)) {
        _$jscoverage['/router.js'].lineData[356]++;
        if (visit65_356_1(utils.equalsIgnoreSlash(locPath, urlRoot))) {
          _$jscoverage['/router.js'].lineData[358]++;
          history.replaceState({}, '', utils.getFullPath(hash, urlRoot));
          _$jscoverage['/router.js'].lineData[359]++;
          triggerRoute = 1;
        } else {
          _$jscoverage['/router.js'].lineData[361]++;
          S.error('router: location path must be same with urlRoot!');
        }
      }
    } else {
      _$jscoverage['/router.js'].lineData[370]++;
      if (visit66_370_1(!utils.equalsIgnoreSlash(locPath, urlRoot))) {
        _$jscoverage['/router.js'].lineData[371]++;
        location.replace(utils.addEndSlash(urlRoot) + '#!' + hash);
        _$jscoverage['/router.js'].lineData[372]++;
        return undefined;
      } else {
        _$jscoverage['/router.js'].lineData[374]++;
        useHash = true;
      }
    }
  }
  _$jscoverage['/router.js'].lineData[379]++;
  setTimeout(function() {
  _$jscoverage['/router.js'].functionData[21]++;
  _$jscoverage['/router.js'].lineData[380]++;
  var needReplaceHistory = supportHistoryPushState;
  _$jscoverage['/router.js'].lineData[381]++;
  if (visit67_381_1(supportHistoryPushState)) {
    _$jscoverage['/router.js'].lineData[382]++;
    DomEvent.on(win, 'popstate', onPopState);
  } else {
    _$jscoverage['/router.js'].lineData[386]++;
    DomEvent.on(win, 'hashchange', onHashChange);
    _$jscoverage['/router.js'].lineData[388]++;
    triggerRoute = 1;
  }
  _$jscoverage['/router.js'].lineData[390]++;
  if (visit68_390_1(useHash)) {
    _$jscoverage['/router.js'].lineData[391]++;
    if (visit69_391_1(!getUrlForRouter())) {
      _$jscoverage['/router.js'].lineData[392]++;
      exports.navigate('/', {
  replace: 1});
      _$jscoverage['/router.js'].lineData[395]++;
      triggerRoute = 0;
      _$jscoverage['/router.js'].lineData[396]++;
      needReplaceHistory = false;
    } else {
      _$jscoverage['/router.js'].lineData[397]++;
      if (visit70_397_1(!supportHistoryPushState && visit71_397_2(getVidFromUrlWithHash(href) !== viewUniqueId))) {
        _$jscoverage['/router.js'].lineData[398]++;
        setPathByHash(utils.getHash(new S.Uri(href)), true);
        _$jscoverage['/router.js'].lineData[399]++;
        triggerRoute = 0;
      } else {
        _$jscoverage['/router.js'].lineData[400]++;
        if (visit72_400_1(supportHistoryPushState && utils.hasVid(href))) {
          _$jscoverage['/router.js'].lineData[401]++;
          location.replace(href = utils.removeVid(href));
        }
      }
    }
  }
  _$jscoverage['/router.js'].lineData[404]++;
  if (visit73_404_1(needReplaceHistory)) {
    _$jscoverage['/router.js'].lineData[406]++;
    history.replaceState({
  vid: viewUniqueId}, '', href);
  }
  _$jscoverage['/router.js'].lineData[413]++;
  if (visit74_413_1(triggerRoute)) {
    _$jscoverage['/router.js'].lineData[414]++;
    dispatch(false, true);
  }
  _$jscoverage['/router.js'].lineData[417]++;
  if (visit75_417_1(callback)) {
    _$jscoverage['/router.js'].lineData[418]++;
    callback(exports);
  }
}, BREATH_INTERVAL);
  _$jscoverage['/router.js'].lineData[422]++;
  started = true;
  _$jscoverage['/router.js'].lineData[423]++;
  return exports;
};
  _$jscoverage['/router.js'].lineData[426]++;
  exports.Utils = utils;
  _$jscoverage['/router.js'].lineData[429]++;
  exports.stop = function() {
  _$jscoverage['/router.js'].functionData[22]++;
  _$jscoverage['/router.js'].lineData[430]++;
  started = false;
  _$jscoverage['/router.js'].lineData[431]++;
  DomEvent.detach(win, 'hashchange', onHashChange);
  _$jscoverage['/router.js'].lineData[432]++;
  DomEvent.detach(win, 'popstate', onPopState);
};
});
