import "./Button.css";

function Button(props: any): JSX.Element {
  return (
    <button
      className={`Button ${props.className}`}
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

export default Button;
