import { Button, Checkbox, Form, Input, Card, Alert } from 'antd';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import AuthContext from '../../context/userContext';
import { CONFIG } from '../../services/utils';
import './LoginPage.css';
export const LoginPage = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const onFinish = async (values) => {
        try {
            const API_URL = `${CONFIG.API_URL}/auth/login`;

            const data = await axios.post(API_URL, {
                email: values.username,
                password: values.password
            }) 
            authContext.setUser(data.data.body.data.user);
         
            localStorage.setItem('user', JSON.stringify(data.data.body.data));
            navigate('/dashboard');
        } catch(e) {
            console.log(e, 'error');
            setError(e.response.data.body.message);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <div className="login-page">
        <Card style={{ width: 400 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
           
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input placeholder="email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="password" />
                </Form.Item>
                { error && <Alert message={error} type="error" /> }
                <Form.Item
                    style={{marginBottom: 0, marginTop: 10}}
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>
}