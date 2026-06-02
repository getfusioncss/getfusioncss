/*!
 * FusionCSS JS v1.0.0
 * Complete JavaScript Framework for FusionCSS
 * Includes: Components, Utilities, Animations, Form Validation, and more
 * Licensed under MIT
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Fusion = factory());
}(this, (function() {
    'use strict';

    // ========================================
    // CORE UTILITIES
    // ========================================
    
    const Fusion = {
        version: '1.0.0',
        components: {},
        plugins: []
    };

    // DOM Ready helper
    const ready = (callback) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    };

    // Element selector helper
    const $ = (selector, context = document) => {
        return context.querySelector(selector);
    };

    const $$ = (selector, context = document) => {
        return Array.from(context.querySelectorAll(selector));
    };

    // Event listener helper
    const on = (element, events, handler, options = {}) => {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler, options);
        });
    };

    // ========================================
    // NAVBAR COMPONENT
    // ========================================
    
    class Navbar {
        constructor(element, options = {}) {
            this.element = typeof element === 'string' ? $(element) : element;
            if (!this.element) return;
            
            this.options = {
                collapseOnClick: true,
                autoClose: true,
                ...options
            };
            
            this.toggler = this.element.querySelector('.navbar-toggler');
            this.collapse = this.element.querySelector('.navbar-collapse');
            
            this.init();
        }
        
        init() {
            if (!this.toggler || !this.collapse) return;
            
            // Toggle navbar on button click
            on(this.toggler, 'click', (e) => {
                e.preventDefault();
                this.toggle();
            });
            
            // Close on outside click if enabled
            if (this.options.autoClose) {
                on(document, 'click', (e) => {
                    if (!this.element.contains(e.target) && this.collapse.classList.contains('show')) {
                        this.hide();
                    }
                });
            }
            
            // Close on nav link click if enabled
            if (this.options.collapseOnClick) {
                const navLinks = $$('.nav-link', this.collapse);
                navLinks.forEach(link => {
                    on(link, 'click', () => this.hide());
                });
            }
        }
        
        toggle() {
            if (this.collapse.classList.contains('show')) {
                this.hide();
            } else {
                this.show();
            }
        }
        
        show() {
            this.collapse.classList.add('show');
            this.toggler.setAttribute('aria-expanded', 'true');
            this.element.dispatchEvent(new CustomEvent('navbar.show'));
        }
        
        hide() {
            this.collapse.classList.remove('show');
            this.toggler.setAttribute('aria-expanded', 'false');
            this.element.dispatchEvent(new CustomEvent('navbar.hide'));
        }
    }

    // ========================================
    // MODAL COMPONENT
    // ========================================
    
    class Modal {
        constructor(element, options = {}) {
            this.element = typeof element === 'string' ? $(element) : element;
            if (!this.element) return;
            
            this.options = {
                backdrop: true,
                keyboard: true,
                focus: true,
                show: false,
                ...options
            };
            
            this.backdrop = null;
            this.isShown = false;
            this.init();
        }
        
        init() {
            // Create backdrop
            if (this.options.backdrop) {
                this.backdrop = document.createElement('div');
                this.backdrop.className = 'modal-backdrop fade';
                document.body.appendChild(this.backdrop);
            }
            
            // Close buttons
            const closeButtons = $$('[data-modal-close], .modal-close', this.element);
            closeButtons.forEach(btn => {
                on(btn, 'click', () => this.hide());
            });
            
            // Close on backdrop click
            if (this.options.backdrop) {
                on(this.element, 'click', (e) => {
                    if (e.target === this.element) {
                        this.hide();
                    }
                });
            }
            
            // Keyboard events
            if (this.options.keyboard) {
                on(document, 'keydown', (e) => {
                    if (this.isShown && e.key === 'Escape') {
                        this.hide();
                    }
                });
            }
            
            if (this.options.show) {
                this.show();
            }
        }
        
        show() {
            if (this.isShown) return;
            
            this.element.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                this.element.classList.add('show');
                if (this.backdrop) this.backdrop.classList.add('show');
            }, 10);
            
            this.isShown = true;
            this.element.dispatchEvent(new CustomEvent('modal.show'));
            
            // Focus management
            if (this.options.focus) {
                const focusable = this.element.querySelector('input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable) focusable.focus();
            }
        }
        
        hide() {
            if (!this.isShown) return;
            
            this.element.classList.remove('show');
            if (this.backdrop) this.backdrop.classList.remove('show');
            
            setTimeout(() => {
                this.element.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
            
            this.isShown = false;
            this.element.dispatchEvent(new CustomEvent('modal.hide'));
        }
        
        toggle() {
            if (this.isShown) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    // ========================================
    // DROPDOWN COMPONENT
    // ========================================
    
    class Dropdown {
        constructor(element, options = {}) {
            this.element = typeof element === 'string' ? $(element) : element;
            if (!this.element) return;
            
            this.options = {
                placement: 'bottom-start',
                autoClose: true,
                ...options
            };
            
            this.menu = this.element.querySelector('.dropdown-menu');
            this.isOpen = false;
            this.init();
        }
        
        init() {
            if (!this.menu) return;
            
            on(this.element, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
            
            // Close on outside click
            if (this.options.autoClose) {
                on(document, 'click', (e) => {
                    if (!this.element.contains(e.target) && this.isOpen) {
                        this.close();
                    }
                });
            }
            
            // Close on escape
            on(document, 'keydown', (e) => {
                if (this.isOpen && e.key === 'Escape') {
                    this.close();
                }
            });
        }
        
        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }
        
        open() {
            this.menu.classList.add('show');
            this.element.setAttribute('aria-expanded', 'true');
            this.isOpen = true;
            this.element.dispatchEvent(new CustomEvent('dropdown.show'));
        }
        
        close() {
            this.menu.classList.remove('show');
            this.element.setAttribute('aria-expanded', 'false');
            this.isOpen = false;
            this.element.dispatchEvent(new CustomEvent('dropdown.hide'));
        }
    }

    // ========================================
    // TABS COMPONENT
    // ========================================
    
    class Tabs {
        constructor(element, options = {}) {
            this.element = typeof element === 'string' ? $(element) : element;
            if (!this.element) return;
            
            this.options = {
                activeTab: 0,
                ...options
            };
            
            this.tabs = $$('.nav-link', this.element);
            this.panes = $$('.tab-pane');
            this.init();
        }
        
        init() {
            this.tabs.forEach((tab, index) => {
                on(tab, 'click', (e) => {
                    e.preventDefault();
                    this.activate(index);
                });
            });
            
            if (this.options.activeTab !== null) {
                this.activate(this.options.activeTab);
            }
        }
        
        activate(index) {
            // Deactivate all tabs
            this.tabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            
            // Hide all panes
            this.panes.forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Activate selected tab
            this.tabs[index].classList.add('active');
            this.tabs[index].setAttribute('aria-selected', 'true');
            
            // Show selected pane
            const targetId = this.tabs[index].getAttribute('data-tab-target') || 
                           this.tabs[index].getAttribute('href');
            const targetPane = targetId ? $(targetId) : this.panes[index];
            
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
            
            this.element.dispatchEvent(new CustomEvent('tab.change', { detail: { index } }));
        }
    }

    // ========================================
    // ACCORDION COMPONENT
    // ========================================
    
    class Accordion {
        constructor(element, options = {}) {
            this.element = typeof element === 'string' ? $(element) : element;
            if (!this.element) return;
            
            this.options = {
                multiple: false,
                ...options
            };
            
            this.items = $$('.accordion-item', this.element);
            this.init();
        }
        
        init() {
            this.items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const button = item.querySelector('.accordion-button');
                const collapse = item.querySelector('.accordion-collapse');
                
                if (button && collapse) {
                    on(button, 'click', () => {
                        if (collapse.classList.contains('show')) {
                            this.close(item);
                        } else {
                            if (!this.options.multiple) {
                                this.closeAll();
                            }
                            this.open(item);
                        }
                    });
                }
            });
        }
        
        open(item) {
            const button = item.querySelector('.accordion-button');
            const collapse = item.querySelector('.accordion-collapse');
            
            if (button && collapse) {
                button.classList.remove('collapsed');
                collapse.classList.add('show');
                item.dispatchEvent(new CustomEvent('accordion.open'));
            }
        }
        
        close(item) {
            const button = item.querySelector('.accordion-button');
            const collapse = item.querySelector('.accordion-collapse');
            
            if (button && collapse) {
                button.classList.add('collapsed');
                collapse.classList.remove('show');
                item.dispatchEvent(new CustomEvent('accordion.close'));
            }
        }
        
        closeAll() {
            this.items.forEach(item => this.close(item));
        }
    }

    // ========================================
    // TOOLTIP COMPONENT
    // ========================================
    
    class Tooltip {
        constructor(element, options = {}) {
            this.element = typeof element === 'string' ? $(element) : element;
            if (!this.element) return;
            
            this.options = {
                placement: 'top',
                title: '',
                delay: 0,
                ...options
            };
            
            this.title = this.options.title || this.element.getAttribute('title') || 
                        this.element.getAttribute('data-tooltip');
            
            this.tooltip = null;
            this.timeout = null;
            this.init();
        }
        
        init() {
            if (!this.title) return;
            
            // Remove default title to prevent browser tooltip
            this.element.removeAttribute('title');
            
            on(this.element, 'mouseenter', () => this.show());
            on(this.element, 'mouseleave', () => this.hide());
        }
        
        show() {
            if (this.timeout) clearTimeout(this.timeout);
            
            this.timeout = setTimeout(() => {
                this.createTooltip();
                this.positionTooltip();
                this.tooltip.classList.add('show');
            }, this.options.delay);
        }
        
        hide() {
            if (this.timeout) clearTimeout(this.timeout);
            
            if (this.tooltip) {
                this.tooltip.classList.remove('show');
                setTimeout(() => {
                    if (this.tooltip && this.tooltip.parentNode) {
                        this.tooltip.parentNode.removeChild(this.tooltip);
                        this.tooltip = null;
                    }
                }, 150);
            }
        }
        
        createTooltip() {
            if (this.tooltip) return;
            
            this.tooltip = document.createElement('div');
            this.tooltip.className = `tooltip bs-tooltip-${this.options.placement}`;
            this.tooltip.innerHTML = `
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">${this.title}</div>
            `;
            
            document.body.appendChild(this.tooltip);
        }
        
        positionTooltip() {
            const rect = this.element.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();
            
            let top, left;
            
            switch (this.options.placement) {
                case 'top':
                    top = rect.top - tooltipRect.height - 8;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'bottom':
                    top = rect.bottom + 8;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'left':
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    left = rect.left - tooltipRect.width - 8;
                    break;
                case 'right':
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    left = rect.right + 8;
                    break;
                default:
                    top = rect.top - tooltipRect.height - 8;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            }
            
            this.tooltip.style.top = `${top + window.scrollY}px`;
            this.tooltip.style.left = `${left + window.scrollX}px`;
        }
    }

    // ========================================
    // TOAST NOTIFICATION
    // ========================================
    
    class Toast {
        constructor(options = {}) {
            this.options = {
                title: '',
                message: '',
                type: 'info', // info, success, warning, danger
                duration: 3000,
                position: 'top-right', // top-right, top-left, bottom-right, bottom-left
                ...options
            };
            
            this.element = null;
            this.timeout = null;
            this.show();
        }
        
        show() {
            this.createToast();
            this.positionToast();
            
            if (this.options.duration > 0) {
                this.timeout = setTimeout(() => this.hide(), this.options.duration);
            }
        }
        
        createToast() {
            this.element = document.createElement('div');
            this.element.className = `toast toast-${this.options.type}`;
            this.element.innerHTML = `
                <div class="toast-header">
                    <strong class="me-auto">${this.options.title || this.getDefaultTitle()}</strong>
                    <button type="button" class="btn-close" data-toast-close></button>
                </div>
                <div class="toast-body">
                    ${this.options.message}
                </div>
            `;
            
            const closeBtn = this.element.querySelector('[data-toast-close]');
            if (closeBtn) {
                on(closeBtn, 'click', () => this.hide());
            }
            
            document.body.appendChild(this.element);
            
            setTimeout(() => {
                if (this.element) this.element.classList.add('show');
            }, 10);
        }
        
        positionToast() {
            let container = $(`.toast-container-${this.options.position}`);
            
            if (!container) {
                container = document.createElement('div');
                container.className = `toast-container toast-container-${this.options.position}`;
                container.style.cssText = `
                    position: fixed;
                    z-index: 1080;
                    ${this.options.position.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
                    ${this.options.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
                `;
                document.body.appendChild(container);
            }
            
            container.appendChild(this.element);
        }
        
        hide() {
            if (this.element) {
                this.element.classList.remove('show');
                setTimeout(() => {
                    if (this.element && this.element.parentNode) {
                        this.element.parentNode.removeChild(this.element);
                    }
                }, 300);
            }
            
            if (this.timeout) clearTimeout(this.timeout);
        }
        
        getDefaultTitle() {
            const titles = {
                info: 'Information',
                success: 'Success',
                warning: 'Warning',
                danger: 'Error'
            };
            return titles[this.options.type] || 'Notification';
        }
        
        static info(message, title = 'Information', duration = 3000) {
            return new Toast({ title, message, type: 'info', duration });
        }
        
        static success(message, title = 'Success', duration = 3000) {
            return new Toast({ title, message, type: 'success', duration });
        }
        
        static warning(message, title = 'Warning', duration = 3000) {
            return new Toast({ title, message, type: 'warning', duration });
        }
        
        static error(message, title = 'Error', duration = 3000) {
            return new Toast({ title, message, type: 'danger', duration });
        }
    }

    // ========================================
    // FORM VALIDATION
    // ========================================
    
    class FormValidator {
        constructor(form, rules = {}, options = {}) {
            this.form = typeof form === 'string' ? $(form) : form;
            if (!this.form) return;
            
            this.rules = rules;
            this.options = {
                liveValidation: true,
                showErrors: true,
                errorClass: 'is-invalid',
                successClass: 'is-valid',
                ...options
            };
            
            this.errors = {};
            this.init();
        }
        
        init() {
            // Add validation on submit
            on(this.form, 'submit', (e) => {
                if (!this.validate()) {
                    e.preventDefault();
                    this.form.dispatchEvent(new CustomEvent('validation.failed', { detail: this.errors }));
                } else {
                    this.form.dispatchEvent(new CustomEvent('validation.success'));
                }
            });
            
            // Live validation
            if (this.options.liveValidation) {
                Object.keys(this.rules).forEach(fieldName => {
                    const field = this.form.querySelector(`[name="${fieldName}"]`);
                    if (field) {
                        on(field, 'input change blur', () => {
                            this.validateField(fieldName);
                        });
                    }
                });
            }
        }
        
        validate() {
            this.errors = {};
            let isValid = true;
            
            Object.keys(this.rules).forEach(fieldName => {
                const field = this.form.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    const fieldError = this.validateFieldRules(fieldName, field.value);
                    if (fieldError) {
                        this.errors[fieldName] = fieldError;
                        isValid = false;
                        this.showError(field, fieldError);
                    } else {
                        this.showSuccess(field);
                    }
                }
            });
            
            return isValid;
        }
        
        validateField(fieldName) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field) return true;
            
            const fieldError = this.validateFieldRules(fieldName, field.value);
            
            if (fieldError) {
                this.errors[fieldName] = fieldError;
                this.showError(field, fieldError);
                return false;
            } else {
                delete this.errors[fieldName];
                this.showSuccess(field);
                return true;
            }
        }
        
        validateFieldRules(fieldName, value) {
            const rules = this.rules[fieldName];
            if (!rules) return null;
            
            // Required validation
            if (rules.required && !value) {
                return rules.messages?.required || `${fieldName} is required`;
            }
            
            // Min length validation
            if (rules.minLength && value.length < rules.minLength) {
                return rules.messages?.minLength || `${fieldName} must be at least ${rules.minLength} characters`;
            }
            
            // Max length validation
            if (rules.maxLength && value.length > rules.maxLength) {
                return rules.messages?.maxLength || `${fieldName} must not exceed ${rules.maxLength} characters`;
            }
            
            // Email validation
            if (rules.email && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return rules.messages?.email || `Please enter a valid email address`;
                }
            }
            
            // Pattern validation
            if (rules.pattern && value) {
                const regex = new RegExp(rules.pattern);
                if (!regex.test(value)) {
                    return rules.messages?.pattern || `${fieldName} format is invalid`;
                }
            }
            
            // Match validation (confirm password)
            if (rules.match) {
                const matchField = this.form.querySelector(`[name="${rules.match}"]`);
                if (matchField && value !== matchField.value) {
                    return rules.messages?.match || `${fieldName} does not match`;
                }
            }
            
            // Number validation
            if (rules.number && value && isNaN(Number(value))) {
                return rules.messages?.number || `${fieldName} must be a number`;
            }
            
            // Min value validation
            if (rules.min !== undefined && Number(value) < rules.min) {
                return rules.messages?.min || `${fieldName} must be at least ${rules.min}`;
            }
            
            // Max value validation
            if (rules.max !== undefined && Number(value) > rules.max) {
                return rules.messages?.max || `${fieldName} must not exceed ${rules.max}`;
            }
            
            return null;
        }
        
        showError(field, message) {
            field.classList.remove(this.options.successClass);
            field.classList.add(this.options.errorClass);
            
            if (this.options.showErrors) {
                // Remove existing error message
                let errorDiv = field.parentNode.querySelector('.invalid-feedback');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    field.parentNode.appendChild(errorDiv);
                }
                errorDiv.textContent = message;
            }
        }
        
        showSuccess(field) {
            field.classList.remove(this.options.errorClass);
            field.classList.add(this.options.successClass);
            
            if (this.options.showErrors) {
                const errorDiv = field.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) errorDiv.textContent = '';
            }
        }
    }

    // ========================================
    // LOADING SPINNER
    // ========================================
    
    class Loader {
        constructor(options = {}) {
            this.options = {
                fullscreen: false,
                text: 'Loading...',
                size: 'md',
                ...options
            };
            
            this.element = null;
        }
        
        show() {
            this.element = document.createElement('div');
            this.element.className = `loader-overlay ${this.options.fullscreen ? 'loader-fullscreen' : ''}`;
            this.element.innerHTML = `
                <div class="loader-content">
                    <div class="spinner spinner-${this.options.size}"></div>
                    ${this.options.text ? `<p class="loader-text mt-3">${this.options.text}</p>` : ''}
                </div>
            `;
            
            if (this.options.fullscreen) {
                document.body.appendChild(this.element);
            } else {
                const relativeParent = this.findRelativeParent();
                if (relativeParent) {
                    relativeParent.style.position = 'relative';
                    relativeParent.appendChild(this.element);
                } else {
                    document.body.appendChild(this.element);
                }
            }
            
            setTimeout(() => {
                if (this.element) this.element.classList.add('show');
            }, 10);
        }
        
        hide() {
            if (this.element) {
                this.element.classList.remove('show');
                setTimeout(() => {
                    if (this.element && this.element.parentNode) {
                        this.element.parentNode.removeChild(this.element);
                    }
                }, 300);
            }
        }
        
        findRelativeParent() {
            let parent = this.options.fullscreen ? null : document.body;
            // In real implementation, find nearest positioned parent
            return parent;
        }
    }

    // ========================================
    // SCROLL SPY
    // ========================================
    
    class ScrollSpy {
        constructor(options = {}) {
            this.options = {
                target: '',
                offset: 0,
                ...options
            };
            
            this.sections = [];
            this.navLinks = [];
            this.init();
        }
        
        init() {
            const target = $(this.options.target);
            if (!target) return;
            
            this.navLinks = $$('[href^="#"]', target);
            
            this.navLinks.forEach(link => {
                const hash = link.getAttribute('href');
                if (hash && hash !== '#') {
                    const section = $(hash);
                    if (section) {
                        this.sections.push({
                            id: hash,
                            element: section,
                            link: link
                        });
                    }
                }
            });
            
            on(window, 'scroll', () => this.update());
            on(window, 'resize', () => this.update());
            this.update();
        }
        
        update() {
            const scrollPosition = window.scrollY + this.options.offset;
            
            for (let i = this.sections.length - 1; i >= 0; i--) {
                const section = this.sections[i];
                const sectionTop = section.element.offsetTop;
                
                if (scrollPosition >= sectionTop) {
                    this.activate(section);
                    break;
                }
            }
        }
        
        activate(section) {
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                link.setAttribute('aria-current', 'false');
            });
            
            section.link.classList.add('active');
            section.link.setAttribute('aria-current', 'true');
        }
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    
    class SmoothScroll {
        constructor(options = {}) {
            this.options = {
                offset: 0,
                duration: 500,
                easing: 'easeInOutCubic',
                ...options
            };
            
            this.init();
        }
        
        init() {
            const links = $$('a[href^="#"]:not([href="#"])');
            
            links.forEach(link => {
                on(link, 'click', (e) => {
                    const hash = link.getAttribute('href');
                    const target = $(hash);
                    
                    if (target) {
                        e.preventDefault();
                        this.scrollTo(target);
                        
                        // Update URL without jumping
                        history.pushState(null, null, hash);
                    }
                });
            });
        }
        
        scrollTo(target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.options.offset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / this.options.duration, 1);
                const ease = this.easing(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < this.options.duration) {
                    requestAnimationFrame(animation);
                }
            };
            
            requestAnimationFrame(animation);
        }
        
        easing(t) {
            const easings = {
                linear: t => t,
                easeInCubic: t => t * t * t,
                easeOutCubic: t => 1 - Math.pow(1 - t, 3),
                easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
            };
            
            return (easings[this.options.easing] || easings.easeInOutCubic)(t);
        }
    }

    // ========================================
    // THEME MANAGER (Dark/Light Mode)
    // ========================================
    
    class ThemeManager {
        constructor(options = {}) {
            this.options = {
                defaultTheme: 'light',
                storageKey: 'fusion-theme',
                ...options
            };
            
            this.currentTheme = this.getStoredTheme() || this.options.defaultTheme;
            this.init();
        }
        
        init() {
            this.applyTheme(this.currentTheme);
            
            // Listen for system theme changes
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
        
        getStoredTheme() {
            return localStorage.getItem(this.options.storageKey);
        }
        
        setTheme(theme) {
            this.currentTheme = theme;
            localStorage.setItem(this.options.storageKey, theme);
            this.applyTheme(theme);
            document.dispatchEvent(new CustomEvent('theme.change', { detail: { theme } }));
        }
        
        applyTheme(theme) {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        }
        
        toggle() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        }
    }

    // ========================================
    // ANIMATION UTILITIES
    // ========================================
    
    class Animation {
        static fadeIn(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        static fadeOut(element, duration = 300) {
            let start = null;
            const startOpacity = parseFloat(getComputedStyle(element).opacity);
            
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                element.style.opacity = startOpacity * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        static slideDown(element, duration = 300) {
            const height = element.scrollHeight;
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                element.style.height = `${height * progress}px`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = '';
                    element.style.overflow = '';
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        static slideUp(element, duration = 300) {
            const height = element.scrollHeight;
            element.style.height = `${height}px`;
            element.style.overflow = 'hidden';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                element.style.height = `${height * (1 - progress)}px`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.height = '';
                    element.style.overflow = '';
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    // ========================================
    // AJAX & API UTILITIES
    // ========================================
    
    class HTTP {
        static async get(url, options = {}) {
            return this.request('GET', url, null, options);
        }
        
        static async post(url, data, options = {}) {
            return this.request('POST', url, data, options);
        }
        
        static async put(url, data, options = {}) {
            return this.request('PUT', url, data, options);
        }
        
        static async delete(url, options = {}) {
            return this.request('DELETE', url, null, options);
        }
        
        static async request(method, url, data = null, options = {}) {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };
            
            if (data) {
                config.body = JSON.stringify(data);
            }
            
            try {
                const response = await fetch(url, config);
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.message || 'Request failed');
                }
                
                return result;
            } catch (error) {
                console.error('HTTP Error:', error);
                throw error;
            }
        }
    }

    // ========================================
    // AUTO-INITIALIZATION
    // ========================================
    
    ready(() => {
        // Initialize all navbars
        $$('[data-fusion-navbar]').forEach(element => {
            new Navbar(element);
        });
        
        // Initialize all modals
        $$('[data-fusion-modal]').forEach(element => {
            const show = element.hasAttribute('data-modal-show');
            new Modal(element, { show });
        });
        
        // Initialize all dropdowns
        $$('[data-fusion-dropdown]').forEach(element => {
            new Dropdown(element);
        });
        
        // Initialize all tabs
        $$('[data-fusion-tabs]').forEach(element => {
            new Tabs(element);
        });
        
        // Initialize all accordions
        $$('[data-fusion-accordion]').forEach(element => {
            new Accordion(element);
        });
        
        // Initialize all tooltips
        $$('[data-fusion-tooltip]').forEach(element => {
            new Tooltip(element);
        });
        
        // Initialize all forms with validation
        $$('[data-fusion-validation]').forEach(element => {
            const rulesAttr = element.getAttribute('data-validation-rules');
            if (rulesAttr) {
                try {
                    const rules = JSON.parse(rulesAttr);
                    new FormValidator(element, rules);
                } catch (e) {
                    console.error('Invalid validation rules JSON');
                }
            }
        });
        
        // Initialize theme manager
        const themeToggle = $('[data-fusion-theme-toggle]');
        if (themeToggle) {
            const themeManager = new ThemeManager();
            on(themeToggle, 'click', () => themeManager.toggle());
        }
        
        // Initialize smooth scroll
        if ($('[data-fusion-smooth-scroll]')) {
            new SmoothScroll();
        }
        
        // Initialize scroll spy
        $$('[data-fusion-scrollspy]').forEach(element => {
            const target = element.getAttribute('data-scrollspy-target');
            if (target) {
                new ScrollSpy({ target });
            }
        });
    });

    // ========================================
    // EXPOSE PUBLIC API
    // ========================================
    
    // Component classes
    Fusion.Navbar = Navbar;
    Fusion.Modal = Modal;
    Fusion.Dropdown = Dropdown;
    Fusion.Tabs = Tabs;
    Fusion.Accordion = Accordion;
    Fusion.Tooltip = Tooltip;
    Fusion.Toast = Toast;
    Fusion.FormValidator = FormValidator;
    Fusion.Loader = Loader;
    Fusion.ScrollSpy = ScrollSpy;
    Fusion.SmoothScroll = SmoothScroll;
    Fusion.ThemeManager = ThemeManager;
    Fusion.Animation = Animation;
    
    // Utilities
    Fusion.$ = $;
    Fusion.$$ = $$;
    Fusion.on = on;
    Fusion.ready = ready;
    Fusion.HTTP = HTTP;
    
    // Global Toast shortcuts
    Fusion.toast = {
        info: Toast.info,
        success: Toast.success,
        warning: Toast.warning,
        error: Toast.error
    };
    
    // Global loader
    Fusion.loader = {
        show: (options) => new Loader(options).show(),
        hide: () => {
            const loader = $('.loader-overlay');
            if (loader) {
                loader.classList.remove('show');
                setTimeout(() => loader.remove(), 300);
            }
        }
    };
    
    return Fusion;
})));
