import { Pagination, Table, Button } from "antd";

export default function (props) {
  return (
    <>
      <Button type="default" onClick={props.handleAddNewPro}>
        Add new product
      </Button>
      <Table
        pagination={false}
        loading={props.loading}
        dataSource={props.dataSource}
        columns={props.columns}
      />
      {!props.loading && (
        <Pagination
          defaultPageSize={props.limit}
          total={props.total}
          defaultCurrent={props.defaultPage}
          onChange={props.handleChangePagi}
        />
      )}
    </>
  );
}
