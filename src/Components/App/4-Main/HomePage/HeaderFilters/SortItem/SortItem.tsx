interface Props {
  sortBy: string;
}

function SortItem(props: Props): JSX.Element {
  return (
    <option id={props.sortBy} defaultChecked={props.sortBy === "start"}>
      {props.sortBy}
    </option>
  );
}

export default SortItem;
