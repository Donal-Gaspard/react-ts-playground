import React, { useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import "./EditableFormTable.css";
import "antd/dist/antd.css";
import { Item, EditableCellProps } from "../../models/Item";
import EditableCell from "../EditableCell/EditableCell";
import EditRow from "../../models/EditRow";

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  });
}

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: Item) => (
        <EditRow
          cancel={cancel}
          edit={edit}
          editable={isEditing(record)}
          record={record} 
          save={save}
        />
      )
    }
  ];

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  );
};

export default EditableTable;
