import React from 'react';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import "./styles.css";



export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(stat, {type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
    if(stat.overwrite){
      return { ...stat, overwrite: false, currentOperand: payload.digit }
    }
    if(payload.digit === "0" && stat.currentOperand === "0"){
      return stat
    }  
    if(payload.digit === "." && stat.currentOperand.includes(".")){
      return stat
    }
    return {
        ...stat,
        currentOperand: `${stat.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(stat.currentOperand ==null && stat.previousOperand == null){
        return stat
      }
      if(stat.currentOperand == null){
        return {
          ...stat,
          operation: payload.operation,
        }
      }
      if(stat.previousOperand == null){
        return {
          ...stat,
          operation: payload.operation,
          previousOperand: stat.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...stat,
        previousOperand: evaluate(stat),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if(stat.overwrite){
        return { ...stat, overwrite: false , currentOperand: null }
      }
      if(stat.currentOperand == null){
        return stat
      }
      if(stat.currentOperand.length === 1){
        return { ...stat, currentOperand: null }
      }
      return {
        ...stat,
        currentOperand: stat.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if(
        stat.operation == null ||
        stat.currentOperand == null ||
        stat.previousOperand == null
      )
      {
        return stat
      }
      return {
        ...stat,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(stat),
      }
        
  }
}

function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}
const INTEGER_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand){
  if(operand == null){
    return
  }
  const [integer, decimal] = operand.split('.')
  if(decimal == null){
    return INTEGER_FORMAT.format(integer)
  }
  return `${INTEGER_FORMAT.format(integer)}.${decimal}`
}
function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] =useReducer(reducer, {})

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)}{operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
    <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})} >AC</button>
    <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEl</button>
    <OperationButton operation="/" dispatch={dispatch} /> 
    <DigitButton digit="1" dispatch={dispatch} />
    <DigitButton digit="2" dispatch={dispatch} />
    <DigitButton digit="3" dispatch={dispatch} />
    <OperationButton operation="*" dispatch={dispatch} /> 
    <DigitButton digit="4" dispatch={dispatch} />
    <DigitButton digit="5" dispatch={dispatch} />
    <DigitButton digit="6" dispatch={dispatch} />
    <OperationButton operation="+" dispatch={dispatch} /> 
    <DigitButton digit="7" dispatch={dispatch} />
    <DigitButton digit="8" dispatch={dispatch} />
    <DigitButton digit="9" dispatch={dispatch} />
    <OperationButton operation="-" dispatch={dispatch} /> 
    <DigitButton digit="." dispatch={dispatch} />
    <DigitButton digit="0" dispatch={dispatch} />
    <button className='span-two'onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
