import {calculate, deleteHistoric} from '../operation-buttons/side-menu';

const Screen = (props) => {
    return (
        <div id="screen">{props.initial}</div>
    );
}

// Add event to write in screen when pressing keyboard key
window.addEventListener("keydown", (event) => {
    keyboardWrite(event.key);
});

const keyboardWrite = (key) => {        
    let screen = document.querySelector("#screen");
    let screenContent = screen.innerText;
    let historic = document.querySelector("#historic-container");
    let historicContent = historic.innerText;
    let operations = ["+", "x", "X", "-", "/"];
    
    // Write numbers
    if (!isNaN(parseInt(key))) {
        // Numbers and screen is different to "0"
        if (screenContent !== "0") {
            // Last element pressed was an operation (--> add space before number)
            if (operations.includes(historicContent.at(-1))) {                
                historic.innerText += " " + key;
                screen.innerText = key;

            // Last element pressed was a number
            } else {
                screen.innerText += key;
                historic.innerText += key;
            }    

        // Numbers, but in screen there is only a "0"       
        } else { 
            screen.innerText = key;
            historic.innerText = key;
        }
    }

    // Write operations (+, -, x, /)
    else if (operations.includes(key)) {
        // Update historic      
        historic.innerText += " " + key;
        // If calculating with result of precedent operation
        if (historic.lastChild.data !== undefined && historic.lastChild.data[0] === " ") {
            historic.lastChild.data = screenContent + " " + key;
        }        
        
        // Update session storage to perform operation in next steps (see side-menu.js)
        sessionStorage.setItem("calculate", "yes");    
        sessionStorage.setItem("operation", key);    
        sessionStorage.setItem("firstValue", screen.innerText);
        // Update screen with total value 
        let total = calculate(); // Get value of operation
        if(total !== "") screen.innerText = total;        
    }

    // Decimals
    else if (key === "."){
        screen.innerText += ".";
    }

    // Delete
    else if (key === "Backspace") {        
        // Update screen
        let newScreenContent = screenContent.substring(0, screenContent.length -1);
        screen.innerText = (newScreenContent === "")? "0": newScreenContent;
        // Update historic
        deleteHistoric(); 
    }
    
    // Calculate operation
    else if (key === "=" || key === "Enter") {
        screen.innerText = calculate();
        historic.innerText += " = " + calculate() + "\n";
    }

}

export default Screen;