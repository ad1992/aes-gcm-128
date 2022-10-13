import { useEffect, useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import {
  deriveEncryptionKeyFromCryptoKey,
  encode,
  encrypt,
  generateCryptoKey,
} from "./crypto";
import Error from "./Error";
import Placeholder from "./Placeholder";

declare global {
  interface Window {
    data?: any;
  }
}
const EncryptView = () => {
  const {
    iv: initialIv,
    encryptedBuffer: initialEncryptedBuffer,
    cryptoKey: initialCryptoKey = null,
    message: initialMessage,
  } = window.data?.encrypt || {};

  const [message, setMessage] = useState<string>(initialMessage);
  const [encryptedBuffer, setEncryptedBuffer] = useState<ArrayBuffer | null>(
    initialEncryptedBuffer
  );
  const [iv, setIV] = useState<Uint8Array>(initialIv);
  const [encodeData, setEncodeData] = useState<Uint8Array>(encode(message));
  const [cryptoKey, setCryptoKey] = useState(initialCryptoKey);
  const [encryptionKey, setEncryptionKey] = useState<string | undefined | null>(
    ""
  );
  const [error, setError] = useState<string | undefined | null>(null);
  const [extractable, setExtractable] = useState<boolean>(false);
  const [showEncryptionKey, setShowEncryptionKey] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      window.data = {
        ...window.data,
        encrypt: {
          iv,
          encryptedBuffer,
          encodeData,
          cryptoKey,
          encryptionKey,
          extractable,
          message,
        },
      };
    };
  }, [
    iv,
    encodeData,
    encryptionKey,
    extractable,
    message,
    cryptoKey,
    encryptedBuffer,
  ]);

  const renderEncryptedContent = (encryptedBuffer: ArrayBuffer) => {
    return new Uint8Array(encryptedBuffer);
  };
  return (
    <div className="flex flex-col align-items-center justify-content-center encrypt-view">
      <div className="flex wide-100">
        <div className="flex-container generate-crypto-key">
          <div>
            <h2 className="text-align-left"> Generate Crypto Key</h2>
            <div className="flex-container">
              <div className="flex align-items-center">
                <input
                  id="extractable"
                  type="checkbox"
                  checked={extractable}
                  onChange={() => {
                    setExtractable(!extractable);
                    setCryptoKey(null);
                  }}
                />
                <label htmlFor="extractable" className="cursor-pointer">
                  Extractable
                </label>
              </div>
              <button
                className="flex-item gen-crypto-key"
                onClick={async () => {
                  const cryptoKey = await generateCryptoKey(extractable);
                  setCryptoKey(cryptoKey);
                  setEncryptionKey(null);
                  setShowEncryptionKey(false);
                  setError(null);
                }}
              >
                {" "}
                Generate Crypto Key
              </button>{" "}
            </div>

            <div className="flex readonly p-10" style={{ height: "330px" }}>
              {cryptoKey ? (
                <>
                  {showEncryptionKey ? (
                    <span className="flex align-items-center">
                      {" "}
                      {encryptionKey}
                    </span>
                  ) : (
                    <pre style={{ marginTop: 0 }}>
                      {JSON.stringify(
                        {
                          type: cryptoKey.type,
                          extractable: cryptoKey.extractable,
                          algorithm: cryptoKey.algorithm,
                          usages: cryptoKey.usages,
                        },
                        null,
                        2
                      )}
                    </pre>
                  )}
                  {error && <Error error={error} />}
                  <div className="align-self-baseline">
                    {encryptionKey && <CopyToClipboard text={encryptionKey} />}
                    <button
                      className="view-encryption-key"
                      onClick={async () => {
                        try {
                          const encryptionKey =
                            await deriveEncryptionKeyFromCryptoKey(cryptoKey);
                          setError(null);
                          setEncryptionKey(encryptionKey);
                          setShowEncryptionKey(!showEncryptionKey);
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                    >
                      {showEncryptionKey ? "Hide" : "View"}
                    </button>
                  </div>
                </>
              ) : (
                <Placeholder text="The Crypto Key will be displayed here" />
              )}
            </div>
          </div>
        </div>
        <div className="flex-container data-to-bytes">
          <h2 className="text-align-left"> Convert the data to bytes</h2>
          <div className=""></div>
          <label>
            {" "}
            Enter the message
            <textarea
              rows={4}
              className="flex-item wide-100"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setEncodeData(encode(event.target.value));
              }}
            ></textarea>
          </label>

          <label>
            Data in bytes
            <div className="readonly flex-item">
              {" "}
              {encodeData && encodeData.length > 0 ? (
                <p className="flex-1 p-10"> {`[ ${encodeData} ]`} </p>
              ) : (
                <Placeholder text="The Encoded text will be displayed here" />
              )}
              {encodeData && encodeData.length > 0 && (
                <CopyToClipboard text={`[ ${encodeData} ]`} />
              )}
            </div>
          </label>
        </div>
      </div>

      <button
        className="flex-item encrypt-btn"
        style={{
          width: "60%",
        }}
        onClick={async () => {
          try {
            if (!message) {
              return;
            }
            const data = await encrypt(message, cryptoKey);
            setEncryptedBuffer(data.encryptedBuffer);
            setIV(data.iv);

            setEncodeData(encode(message));
          } catch (err: any) {
            setError(err.message);
          }
        }}
      >
        {" "}
        Encrypt
      </button>
      <div className="flex wide-100">
        <label className=" data-to-bytes">
          Encrypted Buffer
          <div className="readonly flex-item">
            {encryptedBuffer ? (
              <p className="flex-1 p-10">{`[ ${renderEncryptedContent(
                encryptedBuffer
              )} ]`}</p>
            ) : (
              <Placeholder text="The Encrypted Buffer  will be displayed here" />
            )}{" "}
            {encryptedBuffer && (
              <CopyToClipboard
                text={`[ ${renderEncryptedContent(encryptedBuffer)} ]`}
              />
            )}
          </div>
        </label>

        <label className=" data-to-bytes">
          Initialization Vector
          <div className="readonly flex-item">
            {iv ? (
              <p className="flex-1p-10"> {`[ ${iv} ]`}</p>
            ) : (
              <Placeholder text=" The Initialization Vector will be displayed here" />
            )}{" "}
            {iv && <CopyToClipboard text={`[ ${iv} ]`} />}
          </div>
        </label>
      </div>
    </div>
  );
};

export default EncryptView;
