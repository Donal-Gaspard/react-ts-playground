import React from "react";
import { Item } from "./Item";
import { Popconfirm } from "antd";

interface Props {
  editable: boolean;
  record: Item;
  cancel: () => void;
  edit: (record: Item) => void;
  save:  (key: React.Key)=>void;
}


//   render: (_: any, record: Item) => {
const EditRow: React.FC<Props> = props => {
  const { editable, record, cancel, edit, save } = props;
  return editable ? (
    <span>
      <a
        href="#"
        onClick={() => save(record.key)}
        style={{ marginRight: 8 }}
      >
        Save
      </a>
      <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
        <a>Cancel</a>
      </Popconfirm>
    </span>
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a onClick={() => edit(record)}>Edit</a>
  );
};

export default EditRow;
