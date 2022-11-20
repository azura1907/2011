import { Button, Form, Input, notification, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import appAxios from '../../services/axios';
import { useParams } from 'react-router-dom';

const AddProductPage = () => {

    const [loading, setLoading] = useState(false)

    const param = useParams();

    const [productForm] = Form.useForm();

    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 8,
        },
    };

    const handleFetchProduct = async (id) => {
        try {
            const productData = await appAxios.get(`/products/${id}`)
            productForm.setFieldValue(productData.data.body.data)

        } catch (error) {
            notification.error({
                title: 'error',
                message: 'something went wrong'
            })
        }
    }

    useEffect(() => {
        handleFetchProduct(param.id)
    }, [param.id])

    const onFinish = async (values) => {

        // upload img -> lấy imageUrl về mới call API để post lên đc
        try {
            setLoading(true)
            console.log(values);
            const file = values.imageUrl.file.originFileObj;
            const formData = new FormData();
            console.log('form data', formData)
            formData.append('file', file)

            const uploadData = await appAxios.post('/upload', formData)

            //call API add product 
            const addProductData = {
                ...values,
                imageUrl: uploadData.data.body.data.imageUrl,
                price: Number(values.price)
            }

            //post product data
            const newProduct = await appAxios.post('/products', addProductData);
            if (newProduct) {
                notification.success({
                    title: 'Success',
                    message: 'Product added'
                })
            }

        } catch (error) {
            notification.error({
                title: "error",
                message: "something went wrong"
            })
        }
        setLoading(false)
        // console.log(values);
    };

    const validateMessages = {
        required: '${label} is required!'
    };

    const props = {
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png';
            if (!isPNG) {
                message.error(`${file.name} is not a png file`);
            }
            return isPNG || Upload.LIST_IGNORE;
        },
        onChange: (info) => {
            console.log(info.fileList);
        },
    };


    return (
        <Form  {...layout} form={productForm} onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
                name="name"
                label="Product Name"
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="price"
                label="Price"
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="Description"
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                name="imageUrl"
                label="Product Image"
            >
                <Upload {...props}>
                    <Button loading={loading} icon={<UploadOutlined />}>Upload png only</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AddProductPage