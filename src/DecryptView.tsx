import { useEffect, useState } from "react";
import { dataToBytes, decrypt } from "./crypto";
import Confetti from "react-confetti";
import Error from "./Error";

const DecyrptView = () => {
  const {
    encryptedText: initialEncryptedText = "",
    iv: initialIV = "",
    encryptionKey: initialEncryptionKey,
  } = window.data?.decrypt || {};
  const [encryptedText, setEncryptedText] = useState(initialEncryptedText);
  const [encryptionKey, setEncryptionKey] = useState(initialEncryptionKey);
  const [iv, setIV] = useState(initialIV);
  const [error, setError] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState("");

  useEffect(() => {
    return () => {
      console.log(encryptedText);
      window.data = {
        ...window.data,
        decrypt: {
          encryptedText,
          encryptionKey,
          iv,
        },
      };
    };
  }, [encryptedText, encryptionKey, iv]);
  return (
    <div className="flex flex-col align-items-center justify-content-center">
      <div className="flex flex-col" style={{ width: "50%" }}>
        <label htmlFor="encryptedText">Paste the Encrypted Content</label>
        <textarea
          id="encryptedText"
          rows={4}
          className="flex-item "
          onChange={(event) => setEncryptedText(event.target.value)}
          value={encryptedText}
        ></textarea>
        <label placeholder="Enter the key" htmlFor="encryptionKey">
          {" "}
          Enter the Encryption Key
        </label>
        <input
          id="encryptionKey"
          className="flex-item "
          onChange={(event) => setEncryptionKey(event.target.value)}
          value={encryptionKey}
        ></input>
        <label placeholder="Enter the key" htmlFor="iv">
          {" "}
          Enter the IV
        </label>
        <input
          id="iv"
          className="flex-item"
          onChange={(event) => setIV(event.target.value)}
          value={iv}
        ></input>
        <button
          className="flex-item decrypt-btn"
          onClick={async () => {
            try {
              const data = await decrypt(
                dataToBytes(encryptedText.split(",")),
                encryptionKey,
                dataToBytes(iv.split(","))
              );
              setDecryptedText(data);
            } catch (err) {
              setError("Error while decrypting");
              console.error(err);
              setDecryptedText("");
            }
          }}
        >
          {" "}
          Decrypt
        </button>
        {decryptedText && (
          <div className="flex-item decrypt-text">{decryptedText} </div>
        )}
      </div>
      {decryptedText && (
        <Confetti
          numberOfPieces={500}
          gravity={0.4}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
      {error && <Error error={error} />}
    </div>
  );
};

export default DecyrptView;
