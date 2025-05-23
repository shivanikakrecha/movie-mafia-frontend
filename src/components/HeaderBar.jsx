// components/HeaderBar.jsx
// External Dependencies
import { Header } from 'antd/es/layout/layout';
import { Typography, Button, Dropdown, Tooltip } from 'antd';
import { PlusOutlined, MoreOutlined, LogoutOutlined } from '@ant-design/icons';

// Internal Components
import LanguageSelector from './LanguageSelector';

// Destructured Components
const { Title } = Typography;

/**
 * HeaderBar Component
 * Main navigation header with title, add movie button, and user actions
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.t - Translation function
 * @param {Function} props.handleAddMovie - Handler for adding new movie
 * @param {Function} props.handleLogout - Handler for user logout
 * @returns {JSX.Element} Header bar with navigation controls
 */
const HeaderBar = ({ t, handleAddMovie, handleLogout }) => {
  // Navigation Menu Configuration
  const navMenu = {
    items: [
      {
        key: 'language',
        label: <LanguageSelector />,
      },
      {
        key: 'logout',
        label: (
          <Button
            type="link"
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            style={{ color: 'black' }}
            aria-label={t('Logout')}
          >
            {t('Logout')}
          </Button>
        ),
      },
    ],
  };

  // Styles
  const headerStyles = "bg-transparent !px-6 md:!px-12 lg:!px-24 xl:!px-32 flex justify-between";
  const titleStyles = "!text-white !m-0 flex items-center text-xl md:text-2xl";
  const addButtonStyles = "!bg-transparent !text-white !border-white !border-2";
  const moreButtonStyles = "!text-white bg-[#1d4c5c] rounded-full p-2 cursor-pointer";

  return (
    <Header className={headerStyles}>
      {/* Title and Add Movie Button */}
      <Title level={3} className={titleStyles}>
        {t('My movies')}&nbsp;
        <Tooltip title={t('Add new movie')}>
          <Button
            className={addButtonStyles}
            size="small"
            shape="circle"
            onClick={handleAddMovie}
            icon={<PlusOutlined />}
            aria-label={t('Add new movie')}
          />
        </Tooltip>
      </Title>

      {/* User Actions Dropdown */}
      <Dropdown menu={navMenu} trigger={['hover']} placement="bottomLeft">
        <MoreOutlined
          className={moreButtonStyles}
          style={{ fontSize: 20 }}
          aria-label={t('More options')}
        />
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
