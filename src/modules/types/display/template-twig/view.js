'use strict';

define([
    'jquery',
    'modules/default/defaultview',
    'lib/twigjs/twig',
    'src/util/debug',
    'lodash',
    'src/util/Form',
    'src/util/util'
], function ($, Default, Twig, Debug, _, Form, Util) {

    function View() {
    }

    $.extend(true, View.prototype, Default, {
        init() {
            this._changedJpaths = new Set();
            var configTemplate = this.module.getConfiguration('template');
            this.hasTemplate = new Promise((resolve) => {
                this._resolveTemplate = resolve;
            });
            if (configTemplate) {
                this._resolveTemplate();
            }
            this.dom = $('<div>').css({
                height: '100%',
                width: '100%',
                'user-select': this.module.getConfigurationCheckbox('selectable', 'yes') ? 'initial' : 'none'
            });


            var debouncing = this.module.getConfiguration('debouncing');
            if (debouncing) {
                var submitChange = _.debounce(this.submitChange, debouncing).bind(this);
            } else {
                submitChange = this.submitChange.bind(this);
            }

            var submit = this.submit.bind(this);

            if (this.form) this.form.unbind();
            this.form = new Form(this.dom, {
                keepFormValueIfDataUndefined: this.module.getConfigurationCheckbox('formOptions', 'keepFormValueIfDataUndefined')
            });

            this.form.onChange(submitChange);
            this.form.onSubmit(submit);

            this._values = new DataObject();

            if (!this.renderPromise) {
                this.renderPromise = Promise.resolve();
            }

            this.renderPromise.then(() => {
                this.template = Twig.twig({
                    data: this.module.getConfiguration('template')
                });
            });
        },
        inDom() {
            this.module.getDomContent().html(this.dom);
            this.resolveReady();
            this.rerender();
        },

        rerender() {
            this.render(() => {
                this.resetForm();
            });
        },

        resetForm() {
            this.form.setData(this.currentForm);
        },

        setStyle() {
            var style = this.styleObject;
            if (!style) return;
            if (!(style instanceof Array)) {
                style = [style];
            }

            for (let i = 0; i < style.length; i++) {
                if (style[i].input) {
                    var selector = `input[name="${style[i].input}"],textarea[name="${style[i].input}"],select[name="${style[i].input}"]`;
                } else {
                    selector = style[i].selector;
                }
                var $el = this.dom.find(selector);
                if (style[i].attributes) {
                    $el.attr(style[i].attributes);
                }
                if (style[i].style) {
                    $el.css(style[i].style);
                }
            }
        },

        getForm() {
            return this.currentForm = this.form.getData(false);
        },

        submitChange(event, noChange) {
            event = event || {target: {}};
            const toSend = {
                data: this.getForm()
            };

            if (this._lastChanged) {
                toSend.previousData = this._lastChanged;
            }
            this._lastChanged = toSend.data;
            toSend.jpath = event.target.name && event.target.name.split('.');
            if (event.target.name) {
                this._changedJpaths.add(event.target.name);
            }

            this.module.controller.onFormChanged(toSend, noChange);
        },

        submit() {
            const toSend = {
                data: this.getForm(),
                jpaths: Array.from(this._changedJpaths).map(j => j.split('.'))
            };

            this._changedJpaths.clear();
            if (this._lastSubmit) {
                toSend.previousData = this._lastSubmit;
            }
            this._lastSubmit = toSend.data;
            this.module.controller.onFormSubmitted(toSend);
        },
        blank: {
            value() {
                this.renderPromise = this.renderPromise.then(() => {
                    this.dom.hide();
                    this.getForm();
                }).catch(e => {
                    Debug.warn('Error');
                });
                return null;
            },
            tpl() {
                this.renderPromise = this.renderPromise.then(() => {
                    this.dom.hide();
                    this.getForm();
                    this.template = Twig.twig({
                        data: ''
                    });
                });
                return null;
            },
            form: Util.noop,
            style: Util.noop
        },
        update: {
            value(value, name) {
                /*
                 Convert special DataObjects
                 (twig does some check depending on the filter used
                 and the values need to be native)
                 */
                this._values[name] = DataObject.resurrect(value.get());
                this.rerender();
            },
            tpl(value) {
                var tpl = value.get().toString();
                return this.renderPromise.then(() => {
                    this.template = Twig.twig({
                        data: tpl
                    });
                    this.rerender();
                    return null;
                }).then(() => this._resolveTemplate()).catch(e => {
                    Debug.info('Problem with template: ' + e);
                }).then(() => {
                    this.submitChange();
                });
            },

            form(value, name) {
                this.formName = name;
                this.formObject = value;
                // fill form should execute when the template exists
                // It doesn't make sense otherwise
                return this.hasTemplate.then(() => this.fillForm(true));
            },

            style(value) {
                this.styleObject = value.resurrect();
                this.rerender();
            }
        },

        fillForm(noChange) {
            const changed = this.form.setData(this.formObject);
            changed.forEach(c => this._changedJpaths.add(c));
            this.submitChange(null, noChange);
        },

        render(cb) {
            var that = this;
            return this.renderPromise = this.renderPromise.then(() => {
                if (this.formName) {
                    this._values[this.formName] = this.formObject;
                }
                var render = this.template.renderAsync(this._values);
                this.dom.html(render.html);
                const renderProm = render.render().then(function () {
                    if (cb) cb();
                    that.setStyle();
                    that.module.controller.onRendered(that.dom.html());
                }).catch(e => {
                    Debug.warn('Error rendering twig template', e);
                });

                this.dom.show();
                return renderProm;
            });
        }
    });

    return View;

});
