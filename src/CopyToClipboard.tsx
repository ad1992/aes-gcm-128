export const copy = (text: string) => {
  navigator.clipboard.writeText(text || "");
};

export const pasteFromClipboard = async () => {
  return await navigator.clipboard.readText();
};

const CopyToClipboard = ({ text }: { text: string }) => {
  return (
    <button className="align-self-baseline copy" onClick={() => copy(text)}>
      Copy
    </button>
  );
};

export default CopyToClipboard;
