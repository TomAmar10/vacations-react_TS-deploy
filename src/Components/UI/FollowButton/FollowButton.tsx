import React from "react";
import "./FollowButton.css";

function FollowButton(props: any): JSX.Element {
  return (
    <button
      className={`FollowButton ${props.className}`}
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

export default React.memo(FollowButton);
