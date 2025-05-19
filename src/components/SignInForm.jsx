import { useState } from 'react';
import { signIn } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';

export default function SignInForm() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    try {
      const data = await signIn(email, password); // Replace with your API call
      localStorage.setItem('authToken', data.access_token);
      notification.success({
        message: 'Success',
        description: 'Loggedin successfully!'
      });
      navigate('/movies-list');
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err?.response?.data.detail ||  `Login Failed: Invalid credentials!`
      });
      console.error('Login failed', err);
    }
  };


  return (
    <div className="signin-form-box">
      <h1 className="signin-title">Sign In</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            size="large"
            className='custom-input'
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
            className='custom-input'
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="remember-me">Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" onClick={() => navigate('/signup')} size="large" block>
            SignUp
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}