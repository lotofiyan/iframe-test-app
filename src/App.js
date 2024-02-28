import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState(0);
  const [count, setCount] = useState(0);
  const [receivedFunctions, setReceivedFunctions] = useState();

  useEffect(() => {
    function receiveMessage(event) {
      // Check if the message is coming from the expected origin
      if (event.origin === "http://localhost:3000") {
        // Handle the message

        if (event.data.type === "styles") {
          // Inject the received styles into the iframe's <head>
          const styleElement = document.createElement("style");
          styleElement.textContent = event.data.styles;
          document.head.appendChild(styleElement);
        }

        if (event.data.type === "count") {
          setCount(event.data.count);
        }
        if (event.data.type === "string") {
          setText(event.data.string);
        }

        const { type, functions } = event.data;
        if (type === "functions") {
          setReceivedFunctions(functions);
        }
        if (event.data.type === "setCookies") {
          // Set the received cookies
          console.log("the new cookies", event.data.cookies);
          document.cookie = event.data.cookies;
        }
      } else {
        // Ignore messages from other origins
        console.log("Ignoring message from unexpected origin:", event.origin);
      }
    }

    window.addEventListener("message", receiveMessage, false);

    return () => {
      // Cleanup: remove the event listener when the component unmounts
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  const handleButtonClick = () => {
    if (receivedFunctions) {
      console.log("function is triggered");
      const testFunc = new Function("return " + receivedFunctions?.function3)();
      testFunc();
    }
  };

  return (
    <div className="App">
      <div className="border border-green bg-red-200 font-semibold flex flex-col">
        Test here...... {count}
        {text}
        <button
          className="bg-red-300"
          onClick={() => {
            console.log("functionmv", receivedFunctions);
            console.log("current cookies", document.cookie);
            handleButtonClick();
          }}
        >
          Click here
        </button>
      </div>
    </div>
  );
}

export default App;
