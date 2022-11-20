import CustomTable from "../../../components/customTalbe/CustomTable";
import { useEffect, useState } from "react";
import { Button, notification, Space } from "antd";
import appAxios from "../../../services/axios";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  let limit = 5;
  const [pagination, setPagination] = useState(null)
  const navigation = useNavigate()


  const handleFetchProduct = async (page, limit) => {
    try {
      setLoading(true);
      const products = await appAxios.get("./products", {
        params: {
          page,
          limit,
        },
      });
      setProducts(products.data.body.data.products);
      setPagination(products.data.body.data.pagination)
      setLoading(false);
    } catch (error) {
      notification.error({
        title: "error",
        message: "error!!!",
      });
    }
  };
  useEffect(() => {
    handleFetchProduct(page, limit);
  }, [page]);

  const handleChangePagi = (page) => {
    setPage(page)
  }

  const handleRemove = async (id) => {
    if (window.confirm('Delete Item ??')) {
      try {
        await appAxios.delete(`/products/${id}`)
        handleFetchProduct(page, limit)
      } catch (error) {
        console.log('handle remove err', error)
      }
    }
  }

  const handleAddNewPro = () => {
    navigation('/dashboard/add-product')
  }

  const columns = [
    {
      title: "ProductName",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (url) => {
        return <img src={url} style={{ width: "100px", height: "100px" }} />;
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "price",
      render: (id) => {
        return (
          <>
            <Button type="default" onClick={() => { navigation(`/dashboard/edit-product/${id}`) }}>
              EDIT
            </Button>
            <Button onClick={() => {
              handleRemove(id)
            }} type="default" danger>
              REMOVE
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <CustomTable
      loading={loading}
      dataSource={products}
      columns={columns}
      limit={limit}
      total={pagination && pagination._total}
      handleChangePagi={handleChangePagi}
      handleAddNewPro={handleAddNewPro}
      defaultPage={page}
    />
  );
};
