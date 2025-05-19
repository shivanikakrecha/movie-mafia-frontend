import { useState } from 'react';
import { registerUser, signIn } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      is_active: true,
      is_admin: false,
    };

    try {
      const res = await registerUser(payload);
      navigate('/signin');
      notification.success({
        message: 'Success',
        description: 'Registered successfully!'
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.detail || 'Registration failed'
      });
      console.error('Registration Error:', error);
    }
  };


  return (
    <div className="signin-form-box">
      <h1 className="signin-title">Sign Up</h1>
      <Form
        name="signup"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="full_name"
          rules={[{ required: true, message: 'Please enter full name!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Full Name"
            size="large"
            className='custom-input'
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please enter your Email!' }]}
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
          rules={[{ required: true, message: 'Please enter your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
            className='custom-input'
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            SignUp
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}