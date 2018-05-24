var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

var Form = (_temp2 = _class = function (_Component) {
    _inherits(Form, _Component);

    function Form() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Form);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _this.$$registers = {}, _this.$$register = function (name, handler, preName) {
            if (preName) {
                delete _this.$$registers[preName];
            }

            _this.$$registers[name] = handler;

            handler.validate();

            _this.forceUpdate();
        }, _this.$$unregister = function (name) {
            delete _this.$$registers[name];

            _this.forceUpdate();
        }, _this.$getField = function (name) {
            return _this.$$registers[name];
        }, _this.$$onChange = function (name, $state, callback) {
            return _this.$setState(_defineProperty({}, name, $state), callback);
        }, _this.$setState = function ($stateTree, callback) {
            utils.objectEach($stateTree, function ($newState, name) {
                if (name in _this.$$registers) {
                    var handler = _this.$$registers[name];
                    handler.merge($newState);

                    if ('$value' in $newState) {
                        handler.validate();
                    }
                } else {
                    console.warn('react-formutil: The Field: \'' + name + '\' is not existed!');
                }
            });

            _this.forceUpdate(callback);
        }, _this.$setValue = function ($valueTree, callback) {
            return _this.$setState(utils.objectMap($valueTree, function ($value) {
                return { $value: $value };
            }), callback);
        }, _this.$setDirty = function ($dirtyTree) {
            return _this.$setState(utils.objectMap($dirtyTree, function ($dirty) {
                return { $dirty: $dirty, $pristine: !$dirty };
            }));
        }, _this.$setTouched = function ($touchedTree) {
            return _this.$setState(utils.objectMap($touchedTree, function ($touched) {
                return { $touched: $touched, $untouched: !$touched };
            }));
        }, _this.$batchState = function () {
            var $state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this.$setState(utils.objectMap(_this.$$registers, function () {
                return $state;
            }));
        }, _this.$batchDirty = function ($dirty) {
            return _this.$batchState({
                $dirty: $dirty,
                $pristine: !$dirty
            });
        }, _this.$batchTouched = function ($touched) {
            return _this.$batchState({
                $touched: $touched,
                $untouched: !$touched
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Form, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                $$register: this.$$register,
                $$unregister: this.$$unregister,
                $$onChange: this.$$onChange
            };
        }

        /**
         * @desc 注册或者替换(preName)Field
         */

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var $stateArray = Object.keys(this.$$registers).map(function (path) {
                return {
                    path: path,
                    $state: _this2.$$registers[path].picker()
                };
            });

            var $valid = $stateArray.every(function (_ref2) {
                var $state = _ref2.$state;
                return $state.$valid;
            });
            var $dirty = $stateArray.some(function (_ref3) {
                var $state = _ref3.$state;
                return $state.$dirty;
            });
            var $touched = $stateArray.some(function (_ref4) {
                var $state = _ref4.$state;
                return $state.$touched;
            });
            var $pending = $stateArray.some(function (_ref5) {
                var $state = _ref5.$state;
                return $state.$pending;
            });

            var $formutil = {
                $$registers: this.$$registers,
                $state: $stateArray.reduce(function ($formState, _ref6) {
                    var path = _ref6.path,
                        $state = _ref6.$state;
                    return utils.parsePath($formState, path, $state);
                }, {}),
                $params: $stateArray.reduce(function (params, _ref7) {
                    var path = _ref7.path,
                        $state = _ref7.$state;
                    return utils.parsePath(params, path, $state.$value);
                }, {}),
                $error: $valid ? null : $stateArray.reduce(function ($error, _ref8) {
                    var path = _ref8.path,
                        $state = _ref8.$state;

                    if ($state.$invalid) {
                        return utils.parsePath($error, path, $state.$error);
                    }
                    return $error;
                }, {}),
                $weakState: $stateArray.reduce(function ($formState, _ref9) {
                    var path = _ref9.path,
                        $state = _ref9.$state;

                    $formState[path] = $state;
                    return $formState;
                }, {}),
                $weakParams: $stateArray.reduce(function (params, _ref10) {
                    var path = _ref10.path,
                        $state = _ref10.$state;

                    params[path] = $state.$value;
                    return params;
                }, {}),
                $weakError: $valid ? null : $stateArray.reduce(function ($error, _ref11) {
                    var path = _ref11.path,
                        $state = _ref11.$state;

                    if ($state.$invalid) {
                        $error[path] = $state.$error;
                    }
                    return $error;
                }, {}),

                $getField: this.$getField,

                $setState: this.$setState,
                $setValue: this.$setValue,
                $setTouched: this.$setTouched,
                $setDirty: this.$setDirty,

                $batchState: this.$batchState,
                $batchTouched: this.$batchTouched,
                $batchDirty: this.$batchDirty,

                $valid: $valid,
                $invalid: !$valid,
                $dirty: $dirty,
                $pristine: !$dirty,
                $touched: $touched,
                $untouched: !$touched,
                $pending: $pending
            };

            var children = this.props.children;


            if (typeof children === 'function') {
                return children($formutil);
            }

            return Children.map(children, function (child) {
                return cloneElement(child, {
                    $formutil: $formutil
                });
            });
        }
    }]);

    return Form;
}(Component), _class.displayName = 'React.formutil.Form', _class.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element, PropTypes.array]).isRequired
}, _class.childContextTypes = {
    $$register: PropTypes.func,
    $$unregister: PropTypes.func,
    $$onChange: PropTypes.func
}, _temp2);


export default Form;