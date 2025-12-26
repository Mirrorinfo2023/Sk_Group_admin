
import React from 'react';
import { darken, lighten } from 'polished';
import theme from '../styles/theme'; // Assuming you have a theme file

const ColoredBox = () => {
  const primaryColor = theme.colors.primary;
  const darkenedColor = darken(0.2, primaryColor);
  const lightenedColor = lighten(0.2, primaryColor);

  return (
    <div>
      <div style={{ backgroundColor: primaryColor, padding: '20px' }}>
        Primary Color
      </div>
      <div style={{ backgroundColor: darkenedColor, padding: '20px' }}>
        Darkened Color
      </div>
      <div style={{ backgroundColor: lightenedColor, padding: '20px' }}>
        Lightened Color
      </div>
    </div>
  );
};

export default ColoredBox;
