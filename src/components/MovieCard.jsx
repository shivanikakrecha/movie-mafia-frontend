// components/MovieCard.jsx
import { Card, Dropdown, Typography } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

// Destructured components
const { Text } = Typography;

/**
 * MovieCard Component
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.movie - Movie object containing title, year, and poster_url
 * @param {Function} props.posterSrc - Function to process and return the poster URL
 * @param {Function} props.getMenu - Function to get dropdown menu configuration
 * @returns {JSX.Element} A card displaying movie information with hover effects
 */
const MovieCard = ({ movie, posterSrc, getMenu }) => {
  // Styles
  const dropdownIconStyles = {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#fff',
    zIndex: 2,
    background: '#093545',
    border: '2px solid rgb(80, 205, 251)',
    borderRadius: '20%',
    padding: '6px',
    cursor: 'pointer',
  };

  const cardStyles = {
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#092C39'
  };

  // Render Component
  return (
    <div style={{ position: 'relative' }} className="glossy-hover-col">
      {/* Action Dropdown */}
      <Dropdown menu={getMenu(movie)} trigger={['hover']} placement="bottomRight">
        <MoreOutlined style={dropdownIconStyles} />
      </Dropdown>

      {/* Movie Card */}
      <Card
        hoverable
        cover={
          <img
            alt={movie.title}
            src={posterSrc(movie.poster_url)}
            className="h-60 sm:h-72 md:h-80 lg:h-96 object-cover w-full"
          />
        }
        styles={{ body: { padding: 12 } }}
        style={cardStyles}
      >
        {/* Movie Details */}
        {/* <div className="p-3 sm:p-4 md:p-5 sm:text-sm md:text-xl">
          <Text strong style={{ color: '#FFFFFF' }}>
            {movie.title}
          </Text>
          <br />
          <Text type="secondary" className="sm:text-xs md:text-sm" style={{ color: '#FFFFFF' }}>
            {movie.year}
          </Text>
        </div> */}
        <div className="p-3 sm:p-4 md:p-5 sm:text-sm md:text-xl">
          <div className="h-[48px] overflow-hidden">
            <Text
              strong
              style={{
                color: '#FFFFFF',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {movie.title}
            </Text>
          </div>
          <Text type="secondary" className="sm:text-xs md:text-sm" style={{ color: '#FFFFFF' }}>
            {movie.year}
          </Text>
        </div>

      </Card>
    </div>
  );
};

export default MovieCard;
