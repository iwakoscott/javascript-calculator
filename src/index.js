import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function calculate(x, y, operation) {
  var returnValue = 0;
  x = parseFloat(x);
  y = parseFloat(y);
  switch (operation) {

    case '+':
      returnValue = x + y;
      break;

    case '*':
      returnValue = x * y;
      break;

    case '-':
      returnValue = x - y;
      break;

    case '/':
      returnValue = y === 0 ? NaN : x / y;
      break;

    default:
      returnValue = null;
      break;
  }
  return returnValue;
}


function Button(props) {
  return (
    <button className="button btn-primary" onClick={props.onClick}>{props.value}</button>
  );
}

class Buttons
extends Component {

  renderButton(type) {
    return (
      <Button value={type} onClick={() => {this.props.onClick(type)}}/>
    );
  }

  render() {
    return (
      <div className="buttons">
        <div className="calc-row">
          {this.renderButton('CLEAR')}
          {this.renderButton('+/-')}
          {this.renderButton('/')}
          {this.renderButton('ON')}
        </div>
        <div className="calc-row">
          {this.renderButton('7')}
          {this.renderButton('8')}
          {this.renderButton('9')}
          {this.renderButton('*')}
        </div>
        <div className="calc-row">
          {this.renderButton('4')}
          {this.renderButton('5')}
          {this.renderButton('6')}
          {this.renderButton('-')}
        </div>
        <div className="calc-row">
          {this.renderButton('1')}
          {this.renderButton('2')}
          {this.renderButton('3')}
          {this.renderButton('+')}
        </div>
        <div className="calc-row">
          {this.renderButton('0')}
          {this.renderButton('%')}
          {this.renderButton('.')}
          {this.renderButton('=')}
        </div>
      </div>
    );
  }
}

class Calculator
extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      cache: null,
      valueOnScreen: '',
      currentOperation: null,
      staged: '',
      stagedOperation: '',
    };
  }

  render() {
    return (
      <div className="calculator">
        <div className="calc-window">
          <h1>
            {this.state.valueOnScreen}
          </h1>
        </div>
        <div className="calc-body">
          <Buttons onClick={(type) => this.handleClick(type)}/>
        </div>
      </div>
    );
  } // render

  handleClick(type) {
    const isOn = this.state.isOn;
    var valueOnScreen = this.state.valueOnScreen;
    var staged = this.state.staged;
    var stagedOperation = this.state.stagedOperation;
    var currentOperation = this.state.currentOperation;

    switch(type) {

      case 'ON':
        valueOnScreen = isOn ? '' : '0';
        currentOperation = '';
        stagedOperation = '';
        this.setState({
          valueOnScreen: valueOnScreen,
          isOn: !isOn,
          currentOperation,
          stagedOperation,
        });
        break;

      case 'CLEAR':
        valueOnScreen = '0';
        staged = '0';
        currentOperation = '';
        stagedOperation = '';
        this.setState({
          valueOnScreen,
          staged,
          currentOperation,
          stagedOperation,
        });
        break;

      case '+/-':
        valueOnScreen = String(-1 * parseFloat(valueOnScreen));
        staged = valueOnScreen;
        this.setState({
          valueOnScreen,
          staged,
        });
        break;

      case '%':
        valueOnScreen = String(parseFloat(valueOnScreen)/100);
        staged = valueOnScreen;
        this.setState({
          valueOnScreen,
          staged,
        });
        break;

      case '.':
        if ( !(/\./g).test(valueOnScreen) ) {
          valueOnScreen += '.';
          this.setState({
            valueOnScreen,
          });
        } // if valueOnScreen isnt already a decimal value
        break;

      case '+':
        if (stagedOperation) {
          valueOnScreen = calculate(staged, valueOnScreen, stagedOperation);
        }

        currentOperation = type;
        this.setState({
          currentOperation,
          staged: valueOnScreen,
          valueOnScreen,
        });
        break;

      case '-':
        if (stagedOperation) {
          valueOnScreen = calculate(staged, valueOnScreen, stagedOperation);
        }
        currentOperation = type;
        this.setState({
          currentOperation,
          staged: valueOnScreen,
          valueOnScreen,
        });
        break;

      case '*':
        if (stagedOperation) {
          valueOnScreen = calculate(staged, valueOnScreen, stagedOperation);
        }
        currentOperation = type;
        this.setState({
          currentOperation,
          staged: valueOnScreen,
          valueOnScreen,
        });
        break;

    case '/':
      if (stagedOperation) {
        valueOnScreen = calculate(staged, valueOnScreen, stagedOperation);
      }
      currentOperation = type;
      this.setState({
        currentOperation,
        staged: valueOnScreen,
        valueOnScreen,
      });
      break;

    case '=':
      if (stagedOperation) {
        valueOnScreen = calculate(staged, valueOnScreen, stagedOperation);
        stagedOperation = '';
        currentOperation = '';
      }

      else if (currentOperation) {
        valueOnScreen = calculate(valueOnScreen, valueOnScreen, currentOperation);
        currentOperation = '=';
      }

      staged = valueOnScreen;

      this.setState({
        currentOperation,
        stagedOperation,
        valueOnScreen,
        staged,
      });
      break;

    default:
      if (currentOperation) {
        valueOnScreen = type;

        if (currentOperation !== '=') {
          this.setState({
            valueOnScreen,
            stagedOperation: currentOperation,
            currentOperation: ''
          });
        }

        else {
          this.setState({
            valueOnScreen,
            currentOperation: '',
            staged: '',
          });
        }
        break;
      } // if there is a current operation selected and a number is being typed.

      if (valueOnScreen == '0') {
        valueOnScreen = type;
      } else {
        valueOnScreen += type;
      }
      this.setState({
        valueOnScreen,
      });
      break;

    } //switch

  } // handleClick
}


ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
