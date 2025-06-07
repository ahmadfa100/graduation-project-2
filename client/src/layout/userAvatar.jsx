import React from 'react';
import PropTypes from 'prop-types';


export default function UserAvatar({ firstName, lastName, imageUrl, size = 64 }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const avatarSrc =
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${firstName} ${lastName}`
    )}&background=random&rounded=true&size=${size}`;

  return (
    <img
      src={avatarSrc}
      alt={`${firstName} ${lastName}`}
      width={size}
      height={size}
      className="user-avatar"
    />
  );
}

UserAvatar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  size: PropTypes.number,
};




