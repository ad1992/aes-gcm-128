const Placeholder = ({ text }: { text: string }) => {
  return (
    <span className="flex align-items-center justify-content-center wide-100">
      {text}
    </span>
  );
};

export default Placeholder;
