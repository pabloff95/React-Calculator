import React from 'react';

// Normal button component
const Button = (props) => {
    return (
        <input type="button" className="operation-button button" value={props.text} onClick={props.click} />
    )
}

// Side menu receiving string of operations to perform (+ , - , x, ...)
const SideMenu = (props) => {   
    let operations = props.operations.split(',');
    let buttons = operations.map((operation, index) => {
        return <Button text={operation} key={"operation_" + index} click={() => {
                    addOperation(operation);            
                    updateOperationsHistoric(operation);
                }}
                />;
        
    });

    return (
        <div className="side-menu calculator-section">
            {buttons}
        </div>
    );
}

// Function to add the operation simbol to the screen
const addOperation = operation => {
    let screen = document.getElementById("screen");
    // Check if operation = C ==> Delete screen and set 0
    if (operation === "C") { 
        screen.innerText = "0";
        sessionStorage.removeItem("calculate");
        sessionStorage.removeItem("operation");
        sessionStorage.removeItem("firstValue");
    
    // Check if operation = "=" ==> Calculate result
    } else if (operation === "=") {
        let total = calculate(); // Get value of operation
        screen.innerText = total;
        sessionStorage.setItem("operation", "finished");
    
    // Check if operation = "=" ==> Delete 1 number from screen
    } else if (operation === "DEL") {
        let valueAfterDelete = screen.innerText.substring(0, screen.innerText.length -1);
        screen.innerText = (valueAfterDelete.length>0)? valueAfterDelete: "0";

    // Prepare operation --> update session storage and update screen
    } else {
        sessionStorage.setItem("calculate", "yes");    
        sessionStorage.setItem("operation", operation);    
        sessionStorage.setItem("firstValue", screen.innerText);
        let total = calculate(); // Get value of operation
        if(total !== "") screen.innerText = total;
    }    
}

// Calculate operation that is being typed by the user
const calculate = () => {
    // Get full operation (-> last child text)
    let fullOperation = document.getElementById("historic-container").innerText.split("\n").at(-1).split(" ");
    // Perform operation
    let innerOperation;
    // Remove parentheses from negative numbers, ex: (-1)      
    let validFullOperation = fullOperation.map(value => {
        return (value[0] === "(")? value.substring(1, value.indexOf(")")) : value;
    });
    let total = validFullOperation.reduce((total, value) => {        
        if (isNaN(value)) {
            innerOperation = value;
            return total;
        } else {
            if (innerOperation === "+") return (parseFloat(total) + parseFloat(value));
            if (innerOperation === "-") return (parseFloat(total) - parseFloat(value));
            if (innerOperation === "x") return (parseFloat(total) * parseFloat(value));
            if (innerOperation === "/") return (parseFloat(total) / parseFloat(value));
            return total;
        }
    });

    return (isNaN(parseFloat(total)) ? "0" : total);
}

// Function to update the historic
const updateOperationsHistoric = operation => {
    let historic = document.getElementById("historic-container");
    // If calculate (=) -> show result + introduce new line
    if (operation === "=") {
        historic.innerText += " = " + document.getElementById("screen").innerText + "\n";
    
    // If delete (c) -> clean historic
    } else if (operation === "C") {
        historic.innerText = "";

    // Check if operation = "=" ==> Delete 1 number from screen
    } else if (operation === "DEL") {
        deleteHistoric();

    } else {
        historic.innerText +=  " " + operation;
        // If calculating with previous result
        if (historic.hasChildNodes() && historic.lastChild.data !== undefined && historic.lastChild.data[0] === " ") {
            historic.lastChild.data = document.getElementById("screen").innerText + " " + operation + " ";
        }
    }
}

// Update historic when pressed on "DEL" key (delete value)
const deleteHistoric = () => {
    let historic = document.getElementById("historic-container");
    let operation = historic.innerText.split("\n").at(-1).split(" ");
    let lastNumber = operation.pop();
    let valueAfterDelete = (lastNumber.length>0) ? lastNumber.substring(0, lastNumber.length -1): "";
    operation.push(valueAfterDelete);
    // Get new text replacing the last operation with the value deleted
    let newHistoricText = historic.innerText.split("\n");
    newHistoricText.splice(-1, 1, operation.join(" "));
    historic.innerText = newHistoricText.join("\n");
    // Solve bug if number had only 1 digit --> adds space at the begining of the next number introduced (see updateHistoric() in number-keyboard.js)
    if (valueAfterDelete === "") sessionStorage.setItem("addSpace","yes");
}

export {SideMenu as default, calculate, deleteHistoric};
