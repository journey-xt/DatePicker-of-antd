import moment from 'moment';
import { memoize, chunk, get } from 'lodash';
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Tag, Popover, InputNumber, DatePicker, Button, Col, Row } from 'antd';
import 'moment/locale/zh-cn';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

/**
 * 传入 一个 时间 格式的 字符串 或者 时间戳  转换为momnet
 */
var transformMoment = function (date) {
    if (!date) {
        return undefined;
    }
    var transformDate = moment(date);
    if (date && transformDate.isValid()) {
        return transformDate;
    }
    return undefined;
};

var ValueType;
(function (ValueType) {
    ValueType["TimeStamp"] = "timeStamp";
    ValueType["TimeString"] = "timeString";
    ValueType["Moment"] = "moment"; // moment对象
})(ValueType || (ValueType = {}));
var ValueStatus;
(function (ValueStatus) {
    ValueStatus["Start"] = "start";
    ValueStatus["End"] = "end";
    ValueStatus["None"] = "none"; // 不做取值操作
})(ValueStatus || (ValueStatus = {}));
// 选择模式
var SelectMode;
(function (SelectMode) {
    /**
     * 今天 及 以后
     */
    SelectMode["TODYANDAFTER"] = "todyAndAfter";
    /**
     * 以后
     */
    SelectMode["AFTER"] = "after";
    /**
     * 以前 及 今天
     */
    SelectMode["BREFOREANDTODAY"] = "breforeAndToday";
    /**
     * 以前
     */
    SelectMode["BREFORE"] = "brefore";
})(SelectMode || (SelectMode = {}));

/**
 * 将传入的 moment 对象转换为 时间戳形式
 */
var transformTimeStamp = function (date, valueStatus) {
    if (!date) {
        return undefined;
    }
    switch (valueStatus) {
        case ValueStatus.Start:
            return date ? date.startOf("day").valueOf() : undefined;
        case ValueStatus.End:
            return date ? date.endOf("day").valueOf() : undefined;
        case ValueStatus.None:
        default:
            return date ? date.valueOf() : undefined;
    }
};

var pattern = {
    /** 日期 */
    dateFormat: /YYYY([A-Za-z_\- \/])MM\1DD/,
    /** 时间 */
    TimeFormat: /(HH|hh|kk|H|h|k)((:)((mm|m)(\3(ss|s))?))?/,
    /** 小时 */
    hourFormat: /(HH|hh|kk|H|h|k)/,
    /** 分钟 */
    minuteFormat: /(mm|m)/,
    /** 秒 */
    secondFormat: /(ss|s)/
};

var matchTimeFormat = memoize(function (regexp) {
    var match = regexp.match(pattern.TimeFormat);
    return match;
});

// 判断 数字小于 10 加‘0’前缀
var fillTen = function (number) {
    if (number < 10) {
        return "0" + number;
    }
    return "" + number;
};

var computeTag = function (max, step) {
    var array = [];
    var i = 0;
    while (i < max) {
        /* eslint-disable no-loop-func */
        array.push({
            value: i,
            disabled: false
        });
        /* eslint-enable no-loop-func */
        i += step;
    }
    return array;
};

var PackLayoutTag = styled(Tag.CheckableTag)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 5px !important;\n  background-color: ", ";\n  cursor: ", "!important;\n"], ["\n  margin-bottom: 5px !important;\n  background-color: ", ";\n  cursor: ", "!important;\n"])), function (props) { return props.disabled && "#f5f5f5 !important"; }, function (props) { return (props.disabled ? "not-allowed" : "pointer"); });
var PackTag = function (props) {
    var onChange = props.onChange, tags = props.tags, disabled = props.disabled, checked = props.checked, children = props.children;
    var tagSelected = useCallback(function (checked) {
        if (onChange && !disabled) {
            onChange(tags.value);
        }
    }, [onChange]);
    return (React.createElement(PackLayoutTag, { checked: checked, disabled: disabled, onChange: tagSelected }, children));
};
var templateObject_1;

var Warp = styled.div(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n  text-align: left;\n  user-select: none;\n  width: 182px;\n"], ["\n  text-align: left;\n  user-select: none;\n  width: 182px;\n"])));
var RowTagWarp = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  & .ant-tag:last-child {\n    margin-right: 0;\n  }\n"], ["\n  & .ant-tag:last-child {\n    margin-right: 0;\n  }\n"])));
var PopoverRender = function (props) {
    var onChange = props.onChange, rownum = props.rownum, value = props.value;
    var tagChange = useCallback(function (tag) {
        if (onChange) {
            onChange(tag);
        }
    }, [onChange]);
    var chunkRownum = useMemo(function () { return chunk(rownum, 5); }, [rownum]);
    return (React.createElement(Warp, null, chunkRownum.map(function (item, index) { return (React.createElement(RowTagWarp, { key: index }, item.map(function (tag) { return (React.createElement(PackTag, { key: tag.value, tags: tag, disabled: tag.disabled, checked: value === tag.value, onChange: tagChange }, fillTen(tag.value))); }))); })));
};
var templateObject_1$1, templateObject_2;

var PackInputNumebr = styled(InputNumber)(templateObject_1$2 || (templateObject_1$2 = __makeTemplateObject(["\n  &.ant-input-number {\n    display: inline-block;\n    min-height: 38px;\n    width: 50px;\n    padding: 4px 0px;\n  }\n  & .ant-input-number-input {\n    width: 50px;\n  }\n"], ["\n  &.ant-input-number {\n    display: inline-block;\n    min-height: 38px;\n    width: 50px;\n    padding: 4px 0px;\n  }\n  & .ant-input-number-input {\n    width: 50px;\n  }\n"])));
var TimeInPut = function (props) {
    var timeType = props.timeType, value = props.value, format = props.format, max = props.max, step = props.step, onChange = props.onChange, reset = __rest(props, ["timeType", "value", "format", "max", "step", "onChange"]);
    // input dom
    var inputRef = useRef(null);
    var tagSlectedChange = useCallback(function (tag) {
        if (onChange) {
            onChange(tag || 0, timeType);
        }
    }, [timeType]);
    var inputChange = useCallback(function (inputNumber) {
        console.log(inputNumber);
        if (onChange) {
            if ((inputNumber || inputNumber === 0) &&
                inputNumber >= -1 &&
                inputNumber <= max) {
                onChange(inputNumber, timeType);
            }
        }
    }, [onChange, timeType, max]);
    // 获取焦点
    var inputFocus = useCallback(function () {
        if (inputRef &&
            inputRef.current &&
            // @ts-ignore
            inputRef.current.inputNumberRef &&
            // @ts-ignore
            inputRef.current.inputNumberRef.input) {
            // @ts-ignore
            inputRef.current.inputNumberRef.input.select();
        }
    }, []);
    var rownum = useMemo(function () { return computeTag(max, step); }, [max, step]);
    // 失去焦点
    //  const inputBlur = useCallback(() => {}, []);
    var inputPressEnter = useCallback(function () {
        if (inputRef && inputRef.current) {
            console.log(inputRef.current);
            inputRef.current.blur();
        }
    }, []);
    return (React.createElement(Popover, { trigger: "click", mouseEnterDelay: 50, mouseLeaveDelay: 0, getPopupContainer: function (triggerNode) { return triggerNode; }, autoAdjustOverflow: true, overlayStyle: { padding: "12px 4px" }, content: React.createElement(PopoverRender, __assign({}, reset, { value: value, rownum: rownum, onChange: tagSlectedChange })) },
        React.createElement(PackInputNumebr, { ref: inputRef, value: value, max: max, min: -1, onChange: inputChange, onFocus: inputFocus, 
            //   onBlur={inputBlur}
            onPressEnter: inputPressEnter })));
};
var templateObject_1$2;

var TimeType;
(function (TimeType) {
    /** 小时 */
    TimeType["HOUR"] = "hour";
    /** 分 */
    TimeType["MINUTE"] = "minute";
    /** 秒 */
    TimeType["SECOND"] = "second";
})(TimeType || (TimeType = {}));

var HOUR = ["HH", "H", "hh", "h", "kk", "k"];
var MINUTE = ["mm", "m"];
var SEC = ["ss", "s"];
var TIMEFORMAT = [
    { format: HOUR, des: "时" },
    { format: MINUTE, des: "分" },
    { format: SEC, des: "秒" }
];

var Warp$1 = styled.div(templateObject_1$3 || (templateObject_1$3 = __makeTemplateObject(["\n  padding: 5px 0;\n"], ["\n  padding: 5px 0;\n"])));
var TimePicker = function (props) {
    var format = props.format, value = props.value, onChange = props.onChange, _a = props.hourStep, hourStep = _a === void 0 ? 1 : _a, _b = props.minuteStep, minuteStep = _b === void 0 ? 5 : _b, _c = props.secondStep, secondStep = _c === void 0 ? 10 : _c, disabledHours = props.disabledHours, disabledMinutes = props.disabledMinutes, disabledSeconds = props.disabledSeconds;
    var _d = useState(moment(value)), time = _d[0], setTime = _d[1];
    var timeItemProps = useCallback(function (timeType) {
        var hour = moment(value).hour();
        var minute = moment(value).minute();
        var second = moment(value).second();
        switch (true) {
            case SEC.includes(timeType): // 为秒的input框的值
                return {
                    step: secondStep,
                    max: 60,
                    value: second,
                    //    disabledTime: disabledSeconds,
                    hour: hour,
                    minute: minute
                };
            case MINUTE.includes(timeType): // 为分钟的input框的值
                return {
                    step: minuteStep,
                    max: 60,
                    value: minute,
                    //    disabledTime: disabledMinutes,
                    hour: hour,
                    minute: minute
                };
            case HOUR.includes(timeType): // 为小时的input框的值
            default:
                // 默认为  小时
                return {
                    step: hourStep,
                    max: 24,
                    value: hour,
                    //      disabledTime: disabledHours,
                    hour: hour,
                    minute: minute
                };
        }
    }, [
        format,
        value,
        hourStep,
        minuteStep,
        secondStep,
        disabledHours,
        disabledMinutes,
        disabledSeconds
    ]);
    // 时间变化回调
    var timeChange = useCallback(function (value, type) {
        var changeMoment = moment(time).set(type, value);
        if (onChange) {
            onChange(changeMoment);
        }
        else {
            setTime(changeMoment);
        }
    }, [time, onChange, setTime]);
    // 返回分隔符号
    var splitSymbol = useMemo(function () {
        var match = matchTimeFormat(format);
        if (match && Array.isArray(match)) {
            return match[3];
        }
        return "";
    }, [format]);
    // 后缀
    var renderSuffix = useCallback(function (optionformat) {
        var font = TIMEFORMAT.find(function (item) { return item.format.includes(optionformat); });
        if (font) {
            return font.des;
        }
        return "-";
    }, []);
    var formatBackTimeType = useCallback(function (type) {
        if (HOUR.includes(type)) {
            return TimeType.HOUR;
        }
        if (MINUTE.includes(type)) {
            return TimeType.MINUTE;
        }
        if (SEC.includes(type)) {
            return TimeType.SECOND;
        }
        return undefined;
    }, []);
    var timeGroup = useMemo(function () { return format.split(splitSymbol); }, [splitSymbol]);
    useEffect(function () {
        setTime(transformMoment(value) || moment());
    }, [value, setTime]);
    return (React.createElement(Warp$1, null, timeGroup.map(function (item) { return (React.createElement("span", { key: item },
        React.createElement(TimeInPut, __assign({ format: item, timeType: formatBackTimeType(item), onChange: timeChange }, timeItemProps(item))),
        renderSuffix(item))); })));
};
var templateObject_1$3;

var afterCss = css(templateObject_1$4 || (templateObject_1$4 = __makeTemplateObject(["\n  content: \"~\";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  right: -24px;\n  top: 0;\n  height: 100%;\n  width: 24px;\n"], ["\n  content: \"~\";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  right: -24px;\n  top: 0;\n  height: 100%;\n  width: 24px;\n"])));
var PackDataPick = styled(DatePicker)(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["\n  position: relative;\n  width: 100%;\n  & .ant-input {\n    //  border: 1px solid transparent;\n  }\n  &:after {\n    ", "\n  }\n"], ["\n  position: relative;\n  width: 100%;\n  & .ant-input {\n    //  border: 1px solid transparent;\n  }\n  &:after {\n    ", "\n  }\n"])), function (props) { return (props.showElement ? afterCss : ""); });
var RenderTimeWarp = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding-right: 50px;\n  position: relative;\n  .ant-btn {\n    position: absolute;\n    right: 0;\n    top: 50%;\n    margin-top: -12px;\n  }\n"], ["\n  padding-right: 50px;\n  position: relative;\n  .ant-btn {\n    position: absolute;\n    right: 0;\n    top: 50%;\n    margin-top: -12px;\n  }\n"])));
var templateObject_1$4, templateObject_2$1, templateObject_3;

moment.locale("zh-cn");
var SingleDatePicker = function (props, ref) {
    var _a = props.format, format = _a === void 0 ? "YYYY-MM-DD" : _a, _b = props.valueStatus, valueStatus = _b === void 0 ? ValueStatus.None : _b, _c = props.valueType, valueType = _c === void 0 ? ValueType.TimeStamp : _c, value = props.value, defaultPickerValue = props.defaultPickerValue, onChange = props.onChange, disabledDate = props.disabledDate, selectMode = props.selectMode, _d = props.open, open = _d === void 0 ? false : _d, upOnOpenChange = props.onOpenChange, reset = __rest(props, ["format", "valueStatus", "valueType", "value", "defaultPickerValue", "onChange", "disabledDate", "selectMode", "open", "onOpenChange"]);
    var _e = useState(transformMoment(value)), dateValue = _e[0], setDateValue = _e[1];
    var _f = useState(defaultPickerValue), defaultValue = _f[0], setDefaultValue = _f[1];
    // 面板 open
    var _g = useState(open), datePanelOpen = _g[0], setDatePanelOpen = _g[1];
    // 时、分、秒 format
    var timeFormat = useMemo(function () {
        var match = format.match(pattern.TimeFormat);
        if (match && Array.isArray(match)) {
            return match[0];
        }
        return undefined;
    }, [format]);
    // 变化回调
    var dateChange = useCallback(function (date, dateString) {
        if (onChange) {
            switch (valueType) {
                case ValueType.TimeStamp:
                    return onChange(transformTimeStamp(date, timeFormat ? ValueStatus.None : valueStatus), valueStatus);
                case ValueType.TimeString:
                    return onChange(dateString, valueStatus);
                case ValueType.Moment:
                default:
                    return onChange(date || undefined, valueStatus);
            }
        }
        else {
            setDateValue(transformMoment(value));
        }
    }, [onChange, valueType, timeFormat, valueStatus]);
    // 不可选择时间回调
    var disabledTime = useCallback(function (currentDate) {
        // 传递外层API 禁用日期
        if (disabledDate && currentDate) {
            return disabledDate(currentDate, valueStatus);
        }
        if (currentDate) {
            if (selectMode) {
                switch (selectMode) {
                    case SelectMode.BREFORE:
                        return currentDate.isAfter(moment());
                    case SelectMode.AFTER:
                        return !currentDate.isAfter(moment(), "day");
                    case SelectMode.BREFOREANDTODAY:
                        return currentDate.isAfter(moment(), "day");
                    case SelectMode.TODYANDAFTER:
                        return currentDate.isBefore(moment(), "day");
                    default:
                        return false;
                }
            }
        }
        return false;
    }, [disabledDate, selectMode, dateValue, valueStatus]);
    // timePicker 变化回调
    var timePickerChange = useCallback(function (timeValue) {
        dateChange(timeValue);
    }, [dateChange]);
    // 关闭 datepanel
    var closePanel = useCallback(function () {
        dateChange(dateValue || defaultValue || null);
        setDatePanelOpen(false);
    }, [setDatePanelOpen, dateChange, dateValue, defaultValue]);
    // 添加额外的的页脚render
    // 需要选择 时分秒生成
    var renderExtraFooter = useCallback(function () {
        if (timeFormat) {
            return (React.createElement(RenderTimeWarp, null,
                React.createElement(TimePicker, { format: timeFormat, onChange: timePickerChange, value: dateValue || defaultValue }),
                React.createElement(Button, { size: "small", type: "primary", onClick: closePanel }, "\u786E\u5B9A")));
        }
        return null;
    }, [timeFormat, dateValue, defaultValue, timePickerChange, closePanel]);
    // 时间组件面板 切换回调
    var onOpenChange = useCallback(function (status) {
        if (status && !dateValue) {
            setDefaultValue(moment());
        }
        if (upOnOpenChange) {
            return upOnOpenChange(status);
        }
        setDatePanelOpen(status);
    }, [upOnOpenChange, setDatePanelOpen, setDefaultValue, dateValue]);
    useEffect(function () {
        setDateValue(transformMoment(value));
    }, [value]);
    return (React.createElement(PackDataPick, __assign({}, reset, { open: datePanelOpen, format: format, value: dateValue, defaultPickerValue: defaultValue, onChange: dateChange, disabledDate: disabledTime, onOpenChange: onOpenChange, renderExtraFooter: renderExtraFooter })));
};
var SingleDatePicker$1 = React.forwardRef(SingleDatePicker);

var LayoutLeftCol = styled(Col)(templateObject_1$5 || (templateObject_1$5 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var LayoutRightCol = styled(Col)(templateObject_2$2 || (templateObject_2$2 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var templateObject_1$5, templateObject_2$2;

var Placeholder;
(function (Placeholder) {
    /** 开始时间 */
    Placeholder["START"] = "\u5F00\u59CB\u65F6\u95F4";
    /** 结束时间 */
    Placeholder["END"] = "\u7ED3\u675F\u65F6\u95F4";
})(Placeholder || (Placeholder = {}));

var FormatDefault;
(function (FormatDefault) {
    /** 日期 */
    FormatDefault["FORMAT_DEFAULT"] = "YYYY-MM-DD";
})(FormatDefault || (FormatDefault = {}));

var RangePicker = function (props, ref) {
    var _a;
    var id = props.id, name = props.name, format = props.format, onChange = props.onChange, value = props.value, disabledDate = props.disabledDate, selectMode = props.selectMode, placeholder = props.placeholder, _b = props.valueType, valueType = _b === void 0 ? ValueType.TimeStamp : _b, reset = __rest(props, ["id", "name", "format", "onChange", "value", "disabledDate", "selectMode", "placeholder", "valueType"]);
    var _c = useMemo(function () {
        if (placeholder && Array.isArray(placeholder)) {
            return [
                placeholder[0] || Placeholder.START,
                placeholder[1] || Placeholder.END
            ];
        }
        if (typeof placeholder === "string") {
            return [placeholder || Placeholder.START, placeholder || Placeholder.END];
        }
        return [Placeholder.START, Placeholder.END];
    }, [placeholder]), startPlaceholder = _c[0], endPlaceholder = _c[1];
    var _d = useMemo(function () {
        if (typeof format === "string") {
            return [format, format];
        }
        if (Array.isArray(format)) {
            return format;
        }
        return [FormatDefault.FORMAT_DEFAULT, FormatDefault.FORMAT_DEFAULT];
    }, [format]), startFormat = _d[0], endFormat = _d[1];
    var _e = useState((_a = {},
        _a[ValueStatus.Start] = undefined,
        _a[ValueStatus.End] = undefined,
        _a)), RangeValue = _e[0], setRangeValue = _e[1];
    // 时间变化回调
    var rangeChange = useCallback(function (value, valueStatus) {
        var _a, _b, _c;
        if (onChange) {
            onChange(value ||
                RangeValue[valueStatus === ValueStatus.Start
                    ? ValueStatus.End
                    : ValueStatus.Start]
                ? __assign(__assign({}, RangeValue), (valueStatus ? (_a = {}, _a[valueStatus] = value, _a) : {})) : undefined);
        }
        else {
            setRangeValue(value ||
                RangeValue[valueStatus === ValueStatus.Start
                    ? ValueStatus.End
                    : ValueStatus.Start]
                ? __assign(__assign({}, RangeValue), (valueStatus ? (_b = {}, _b[valueStatus] = value, _b) : {})) : (_c = {},
                _c[ValueStatus.Start] = undefined,
                _c[ValueStatus.End] = undefined,
                _c));
        }
    }, [onChange, RangeValue]);
    // 不可选择时间回调
    var rangeDisabledDate = useCallback(function (currentDate, valueStatus) {
        // 上层 不可选择时间段 回调
        if (disabledDate) {
            return disabledDate(currentDate, valueStatus);
        }
        var startTime = RangeValue[ValueStatus.Start];
        var endTime = RangeValue[ValueStatus.End];
        if (!currentDate) {
            return true;
        }
        switch (valueStatus) {
            case ValueStatus.Start:
                switch (selectMode) {
                    case SelectMode.BREFORE:
                        return endTime
                            ? !currentDate.isBefore(moment(), "day") ||
                                !currentDate.isBefore(endTime, "day")
                            : !currentDate.isBefore(moment(), "day");
                    case SelectMode.BREFOREANDTODAY:
                        return currentDate.isAfter(moment()) || endTime
                            ? currentDate.isAfter(endTime)
                            : currentDate.isAfter(moment());
                    case SelectMode.AFTER:
                        return endTime
                            ? currentDate.isBefore(moment()) || currentDate.isAfter(endTime)
                            : currentDate.isBefore(moment());
                    case SelectMode.TODYANDAFTER:
                        return endTime
                            ? currentDate.isBefore(moment(), "day") ||
                                currentDate.isAfter(endTime)
                            : currentDate.isBefore(moment(), "day");
                    default:
                        return endTime ? currentDate.isAfter(moment(endTime)) : false;
                }
            case ValueStatus.End:
                switch (selectMode) {
                    case SelectMode.BREFORE:
                        var brefore = !currentDate.isBefore(moment(), "day");
                        return startTime
                            ? brefore || currentDate.isBefore(startTime)
                            : brefore;
                    case SelectMode.BREFOREANDTODAY:
                        var breforeAndToday = !currentDate.isBefore(moment());
                        return startTime
                            ? breforeAndToday || currentDate.isBefore(startTime)
                            : breforeAndToday;
                    case SelectMode.AFTER:
                        var after = currentDate.isBefore(moment());
                        return startTime
                            ? after || currentDate.isBefore(startTime)
                            : after;
                    case SelectMode.TODYANDAFTER:
                        return startTime
                            ? currentDate.isBefore(startTime)
                            : currentDate.isBefore(moment(), "day");
                    default:
                        return startTime
                            ? currentDate.isBefore(moment(startTime))
                            : false;
                }
            default:
                return false;
        }
    }, [RangeValue, disabledDate]);
    // 上层porps变化
    useEffect(function () {
        var _a;
        setRangeValue((_a = {},
            _a[ValueStatus.Start] = get(value, ValueStatus.Start, undefined),
            _a[ValueStatus.End] = get(value, ValueStatus.End, undefined),
            _a));
    }, [setRangeValue, value]);
    return (React.createElement("span", __assign({}, (id ? { id: "" + id } : {}), (name ? { name: name } : {})),
        React.createElement(Row, { gutter: 24 },
            React.createElement(LayoutLeftCol, { span: 12 },
                React.createElement(SingleDatePicker$1, __assign({}, reset, { showElement: true, format: startFormat, value: RangeValue[ValueStatus.Start], valueStatus: ValueStatus.Start, disabledDate: rangeDisabledDate, onChange: rangeChange, placeholder: startPlaceholder, defaultPickerValue: RangeValue[ValueStatus.Start]
                        ? moment(RangeValue[ValueStatus.Start])
                        : undefined }))),
            React.createElement(LayoutRightCol, { span: 12 },
                React.createElement(SingleDatePicker$1, __assign({}, reset, { format: endFormat, value: RangeValue[ValueStatus.End], valueStatus: ValueStatus.End, disabledDate: rangeDisabledDate, onChange: rangeChange, placeholder: endPlaceholder, defaultPickerValue: RangeValue[ValueStatus.Start]
                        ? moment(RangeValue[ValueStatus.Start])
                        : undefined }))))));
};
var RangePicker$1 = React.forwardRef(RangePicker);

moment.locale("zh-cn");

export default SingleDatePicker$1;
export { RangePicker$1 as RangePicker, ValueType, ValueStatus, SelectMode };
//# sourceMappingURL=index.es.js.map
