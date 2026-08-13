import { useState } from 'react';
import * as math from 'mathjs';
import './App.css';

function App() {
  const [currentVal, setCurrentVal] = useState('0');
  const [formula, setFormula] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  const isOperator = /[x/+‑]/;
  const endsWithOperator = /[x+‑/]$/;
  const endsWithNegativeSign = /\d[x/+‑]{1}‑$/;

  const handleClear = () => {
    setCurrentVal('0');
    setFormula('');
    setEvaluated(false);
  };

  const handleNumber = (e) => {
    const value = e.target.value;
    if (evaluated) {
      setCurrentVal(value);
      setFormula(value !== '0' ? value : '');
      setEvaluated(false);
    } else {
      if (currentVal === '0' && value === '0') return; // Prevent multiple leading zeros
      
      let newVal = currentVal === '0' || isOperator.test(currentVal) ? value : currentVal + value;
      setCurrentVal(newVal);
      setFormula(formula === '0' && value === '0' ? '0' : /([^.0-9]0|^0)$/.test(formula) ? formula.slice(0, -1) + value : formula + value);
    }
  };

  const handleOperator = (e) => {
    if (evaluated) {
      setFormula(currentVal + e.target.value);
      setCurrentVal(e.target.value);
      setEvaluated(false);
    } else {
      setCurrentVal(e.target.value);
      if (!endsWithOperator.test(formula)) {
        setFormula(formula + e.target.value);
      } else if (!endsWithNegativeSign.test(formula) && e.target.value === '‑') {
        setFormula(formula + e.target.value);
      } else if (e.target.value !== '‑') {
        // If 2 or more operators are entered consecutively, the operation performed should be the last operator entered (excluding negative sign)
        let newFormula = formula.replace(/[x/+‑]+$/, '') + e.target.value;
        setFormula(newFormula);
      }
    }
  };

  const handleDecimal = () => {
    if (evaluated) {
      setCurrentVal('0.');
      setFormula('0.');
      setEvaluated(false);
    } else {
      if (!currentVal.includes('.')) {
        setCurrentVal(currentVal + '.');
        setFormula(formula + '.');
      }
    }
  };

  const handleEvaluate = () => {
    if (evaluated || !formula) return;
    
    let expression = formula;
    // Remove trailing operators
    while (endsWithOperator.test(expression)) {
      expression = expression.slice(0, -1);
    }
    
    // Replace custom operators with standard ones for evaluation
    expression = expression.replace(/x/g, '*').replace(/‑/g, '-');
    
    try {
      // Evaluate using mathjs for precision
      let answer = math.evaluate(expression);
      // Round to prevent float precision issues (e.g. 0.1 + 0.2)
      answer = Math.round(1000000000000 * answer) / 1000000000000;
      
      setCurrentVal(answer.toString());
      setFormula(formula + '=' + answer);
      setEvaluated(true);
    } catch (e) {
      setCurrentVal('Error');
      setFormula('');
    }
  };

  return (
    <div className="app-container">
      <div className="calculator-card glass-panel animate-pop">
        
        {/* Screen Area */}
        <div className="screen-container">
          <div className="formula-screen digital-font">{formula}</div>
          <div className="main-screen digital-font" id="display">{currentVal}</div>
        </div>
        
        {/* Keypad */}
        <div className="keypad">
          <button className="calc-btn btn-clear" id="clear" value="AC" onClick={handleClear}>AC</button>
          <button className="calc-btn btn-op" id="divide" value="/" onClick={handleOperator}>/</button>
          <button className="calc-btn btn-op" id="multiply" value="x" onClick={handleOperator}>x</button>
          
          <button className="calc-btn" id="seven" value="7" onClick={handleNumber}>7</button>
          <button className="calc-btn" id="eight" value="8" onClick={handleNumber}>8</button>
          <button className="calc-btn" id="nine" value="9" onClick={handleNumber}>9</button>
          <button className="calc-btn btn-op" id="subtract" value="‑" onClick={handleOperator}>-</button>
          
          <button className="calc-btn" id="four" value="4" onClick={handleNumber}>4</button>
          <button className="calc-btn" id="five" value="5" onClick={handleNumber}>5</button>
          <button className="calc-btn" id="six" value="6" onClick={handleNumber}>6</button>
          <button className="calc-btn btn-op" id="add" value="+" onClick={handleOperator}>+</button>
          
          <button className="calc-btn" id="one" value="1" onClick={handleNumber}>1</button>
          <button className="calc-btn" id="two" value="2" onClick={handleNumber}>2</button>
          <button className="calc-btn" id="three" value="3" onClick={handleNumber}>3</button>
          
          <button className="calc-btn btn-eq" id="equals" value="=" onClick={handleEvaluate}>=</button>
          
          <button className="calc-btn btn-zero" id="zero" value="0" onClick={handleNumber}>0</button>
          <button className="calc-btn" id="decimal" value="." onClick={handleDecimal}>.</button>
        </div>

      </div>
    </div>
  );
}

export default App;
