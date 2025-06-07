import React from 'react';
import PropTypes from 'prop-types';
import './userAvatar.css';

export default function UserAvatar({ firstName, lastName, imageUrl, size = 64 }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const avatarSrc =
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${firstName} ${lastName}`
    )}&background=random&rounded=true&size=${size}`;

  return (
    <div className="avatar-container" style={{ width: size, height: size }}>
      <img
        src={avatarSrc}
        alt={`${firstName} ${lastName}`}
        className="user-avatar"
      />
      <div className="avatar-overlay">
        <span className="avatar-name">{firstName} {lastName}</span>
      </div>
    </div>
  );
}

UserAvatar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  size: PropTypes.number,
};




