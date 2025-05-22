import { useState } from 'react';
import { signIn } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function SignInForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        description: err?.response?.data.detail || `Login Failed: Invalid credentials!`
      });
      console.error('Login failed', err);
    }
  };


  return (
    <div className="signin-form-box">
      <h1 className="signin-title">{t('Sign In')}</h1>
      <Form
        name={t("login")}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name={t("email")}
          rules={[{ required: true, message: t('Please input your Email!') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t("Email")}
            size="large"
            className='custom-input'
          />
        </Form.Item>

        <Form.Item
          name={t("password")}
          rules={[{ required: true, message: t('Please input your Password!') }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("Password")}
            size="large"
            className='custom-input'
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="remember-me">{t("Remember me")}</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            {t('Login')}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" onClick={() => navigate('/signup')} size="large" block>
            {t('SignUp')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}