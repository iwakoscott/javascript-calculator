import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function Button(props) {
  return (
    <button className="button" onClick={props.onClick}>{props.value}</button>
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
        valueOnScreen = isOn ? '' : '1';
        currentOperation = null;
        this.setState({
          valueOnScreen: valueOnScreen,
          isOn: !isOn,
          currentOperation,
        });
        break;

      case 'CLEAR':
        valueOnScreen = '0';
        staged = '0';
        currentOperation = null;
        this.setState({
          valueOnScreen,
          staged,
          currentOperation,
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
        currentOperation = type;
        this.setState({
          currentOperation,
          staged: valueOnScreen,
        });
        break;

      case '-':
        currentOperation = type;
        this.setState({
          currentOperation,
          staged: valueOnScreen,
        });
        break;

      case '*':
        currentOperation = type;
        this.setState({
          currentOperation,
          staged: valueOnScreen,
        });
        break;

    case '/':
      currentOperation = type;
      this.setState({
        currentOperation,
        staged: valueOnScreen,
      });
      break;

    case '=':
      break;

    default:
      if (currentOperation) {
        valueOnScreen = type;
        this.setState({
          valueOnScreen,
          stagedOperation: currentOperation,
        });
        currentOperation = '';
        break;
      } // if there is a current operation selected and a number is being typed

      if (valueOnScreen === '0') {
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
