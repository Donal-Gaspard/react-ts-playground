import React, { useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import { FormComponentProps } from "antd/lib/form";

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const originData: Item[] = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  });
}

interface IProps extends FormComponentProps {}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  const FormItem = Form.Item;
  return (
    <td {...restProps}>
      {editing ? (
        <FormItem style={{ margin: 0 }}>
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </FormItem>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: React.FC<IProps> = props => {
  const [data, setData] = useState<Item[]>(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    props.form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = (key: string) => {
    props.form.validateFields((error, row) => {
      if (error) {
        return;
      }
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
    });
  };

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
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </a>
            )}
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a
            href="javascript:;"
            // disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </a>
        );
      }
    }
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    // const components = {
    //   body: {
    //     cell: EditableCell
    //   }
    // };

    // const columns = this.columns.map(col => {
    //   if (!col.editable) {
    //     return col;
    //   }
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
    <Form form={props.form}>
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

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
