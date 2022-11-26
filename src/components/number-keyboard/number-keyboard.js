// Single button component
const NumberButton = (props) => {    
    return (
        <input type="button" className="number-button button" value={props.number} onClick={props.click} />
    );
}

// All numbers in Keyboard component from min to max
const Keyboard = (props) => {        
    // Create array of numbers
    let numbers = [];
    for(let i = props.max; i >= props.min; i--) {
        numbers.push(i);
    }
    numbers.push("."); // Used to add decimals
    numbers.splice(props.min-2, 0, "+/-");
    // Create button components
    let keyboard = numbers.map(value => {
        return <NumberButton number={value} key={"number_" + value} click={() => {
                    updateHistoric(value);
                    showNumber(value);            
                }} />
    })
    
    return (   
        <div className="keyboard-numbers calculator-section">
            {keyboard}
        </div>
    );
}

// Function to add numbers to the screen
const showNumber = value =>{    
    let screen = document.getElementById("screen");
    let content = screen.innerText;
    // Manage positive - negative changes
    if (value === "+/-" && content !== "0"){
        screen.innerText = (content[0] === "-")? content.substring(1) : "-" + content;
        return;
    } else if (value === "+/-"){        
        return;
    }

    // When clicked on numbers
    if (content === "0" && value !== "+/-") {  // Initial screen
        screen.innerText = value;
    } else if (sessionStorage.getItem("calculate") === "yes"){ // Second term in operation to be introduced (first value)
        screen.innerText = value;
        sessionStorage.setItem("calculate", "no");    
    } else if (sessionStorage.getItem("operation") === "finished"){ // After operation is finished, if new number is introduced screen is reseted to that number. If new operation is introduced, it continues
        screen.innerText = value;
        sessionStorage.setItem("operation" ,"");
    } else {
        screen.innerText += value;
    }
}

// Function to update the historic
const updateHistoric = value => {
    let historic = document.getElementById("historic-container");
    if (value !== "+/-") {        
        // Add space at the begining (to solve bug when deleting a number and the when the number had only 1 digit)
        if (sessionStorage.getItem("addSpace") === "yes"){
            sessionStorage.setItem("addSpace","no");
            value = " " + value;
        }
        historic.innerText += (sessionStorage.getItem("calculate") === "yes")? " " + value: value;       

        // if changing postive - negative
    } else {
        // Get last number in historic and if it was negative ("(-x)"), remove parentheses
        let lastNumber = historic.innerText.split(" ").at(-1);
        lastNumber = (lastNumber[0] === "(") ? lastNumber.substring(1, lastNumber.indexOf(")")): lastNumber;
        // if number is negative turn it to positive and viceversa
        let number = (lastNumber[0] === "-")? " " + lastNumber.substring(1): " (-" + lastNumber + ")";        
        // Replace last number in new text to be displayed in historic
        let oldText = historic.innerText.split(" ");
            oldText.pop();
            oldText.push(number);
        let newText = oldText.join(" ")
        historic.innerText = newText;
    }
}

export default Keyboard;

