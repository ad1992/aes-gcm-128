import { useState } from "react";
import "./App.scss";
import DecyrptView from "./DecryptView";
import EncryptView from "./EncryptView";
import clsx from "clsx";
const VIEW = {
  ENCRYPT: 0,
  DECRYPT: 1,
};
function App() {
  const [activeView, setActiveView] = useState(VIEW.ENCRYPT);
  return (
    <div className="App">
      <h1>AES-GCM-128 DEMO</h1>
      <div>
        <button
          className={clsx("encrypt", { active: activeView === VIEW.ENCRYPT })}
          onClick={() => setActiveView(VIEW.ENCRYPT)}
        >
          Encyrpt
        </button>
        <button
          className={clsx("decrypt", { active: activeView === VIEW.DECRYPT })}
          onClick={() => setActiveView(VIEW.DECRYPT)}
        >
          Decrypt
        </button>
      </div>
      {activeView === VIEW.ENCRYPT ? <EncryptView /> : <DecyrptView />}
    </div>
  );
}

export default App;
