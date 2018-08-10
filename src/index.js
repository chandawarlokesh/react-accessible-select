import React from "react";
import PropTypes from "prop-types";
import "./style.css";

export default class ReactAccessibleSelect extends React.Component {
    static defaultProps = {
        options: []
    };

    propTypes = {
        options: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        label: PropTypes.string
    };

    constructor(props) {
        super(props);
        const newOptions = props.options.map((option, index) => ({
            ...option,
            id: index
        }));
        this.state = {
            isActive: false,
            options: newOptions,
            selected: newOptions[0]
        };
        this.options = [];
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    scrollToFocus = () => {
        const element = this.options && this.options[this.state.selected.id];
        if (this.optionBox && element) {
            if (this.optionBox.scrollHeight > this.optionBox.clientHeight) {
                const scrollBottom =
                    this.optionBox.clientHeight + this.optionBox.scrollTop;
                const elementBottom = element.offsetTop + element.offsetHeight;
                if (elementBottom > scrollBottom) {
                    this.optionBox.scrollTop =
                        elementBottom - this.optionBox.clientHeight;
                } else if (element.offsetTop < this.optionBox.scrollTop) {
                    this.optionBox.scrollTop = element.offsetTop;
                }
            }
        }
    };

    moveUpItems = () => {
        const prevItemIndex = this.state.selected.id - 1;
        if (prevItemIndex >= 0) {
            this.handleOptionChange(this.state.options[prevItemIndex]);
        }
    };

    moveDownItems = () => {
        const nextItemIndex = this.state.selected.id + 1;
        if (nextItemIndex < this.state.options.length) {
            this.handleOptionChange(this.state.options[nextItemIndex]);
        }
    };

    focusFirstItem = () => {
        this.handleOptionChange(this.state.options[0]);
    };

    focusLastItem = () => {
        this.handleOptionChange(
            this.state.options[this.state.options.length - 1]
        );
    };

    focusOptions = isActive => {
        this.setState(
            {
                isActive
            },
            () => {
                if (this.state.isActive) {
                    this.optionBox && this.optionBox.focus();
                } else {
                    this.selectBox && this.selectBox.focus();
                }
            }
        );
        // const optionRef = this.options[this.state.selected.id]
        // optionRef && optionRef.focus()
    };

    handleOptionChange = selected => {
        this.setState(
            {
                selected
            },
            () => {
                this.scrollToFocus();
                this.props.onClick && this.props.onClick(selected);
            }
        );
    };

    handleOptionOnClick = selected => {
        this.setState(
            {
                selected
            },
            () => {
                this.focusOptions(false);
                this.props.onClick && this.props.onClick(selected);
            }
        );
    };

    handleOptionOnFocus = event => {};

    handleOptionOnBlur = event => {
        if (event.key === "Escape" || event.key === "Enter") {
            this.setState({
                isActive: false
            });
        }
    };

    handleButtonOnClick = event => {
        event.stopPropagation();
        this.focusOptions(!this.state.isActive);
    };

    handleButtonOnKeyUp = event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            this.focusOptions(true);
        }
    };

    handleListOnKeyDown = event => {
        if (this.state.isActive) {
            event.preventDefault();
            switch (event.key) {
                case "PageUp":
                case "ArrowUp":
                    this.moveUpItems();
                    break;
                case "PageDown":
                case "ArrowDown":
                    this.moveDownItems();
                    break;
                case "Home":
                    this.focusFirstItem();
                    break;
                case "End":
                    this.focusLastItem();
                    break;
                case "Backspace":
                case "Delete":
                case "Enter":
                    this.focusOptions(false);
                    break;
                case "Tab":
                    this.setState({
                        isActive: false
                    });
                    break;
                default:
                    break;
            }
        }
    };

    handleClickOutside = event => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.focusOptions(false);
        }
    };

    render() {
        const { label } = this.props;
        return (
            <div className="listbox-area">
                <div className="left-area">
                    {label && <span id="exp_elem">{label}</span>}
                    <div
                        id="exp_wrapper"
                        style={{ width: 200 }}
                        ref={wrapperRef => (this.wrapperRef = wrapperRef)}
                    >
                        <button
                            id="exp_button"
                            aria-haspopup
                            aria-labelledby="exp_elem exp_button"
                            aria-expanded={this.state.isActive}
                            ref={selectBox => (this.selectBox = selectBox)}
                            onKeyUp={this.handleButtonOnKeyUp}
                            onClick={this.handleButtonOnClick}
                        >
                            {this.state.selected.label}
                        </button>
                        <ul
                            id="exp_elem_list"
                            role="listbox"
                            tabIndex="0"
                            aria-labelledby="exp_elem"
                            aria-activedescendant={`option_${
                                this.state.selected.id
                            }`}
                            aria-hidden={!this.state.isActive}
                            className={this.state.isActive ? "" : "hidden"}
                            ref={optionBox => (this.optionBox = optionBox)}
                            onKeyDown={this.handleListOnKeyDown}
                        >
                            {this.state.options.map(option =>
                                this.renderOption(option)
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    renderOption = option => {
        const handleOnClick = () => this.handleOptionOnClick(option);
        return (
            <li
                id={`option_${option.id}`}
                key={option.id}
                role="option"
                ref={input => {
                    this.options[option.id] = input;
                }}
                aria-selected={this.state.selected.id === option.id}
                className={`${
                    this.state.selected.id === option.id ? "focused" : ""
                }`}
                onFocus={this.handleOptionOnFocus}
                onBlur={this.handleOptionOnBlur}
                onClick={handleOnClick}
            >
                {option.label}
            </li>
        );
    };
}
