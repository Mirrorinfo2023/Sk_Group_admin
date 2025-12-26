import React, { useState } from 'react';
import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/emoji-mart@3.0.0/css/emoji-mart.css" />

const EmojiPicker = ({ onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPicker(!showPicker)}>
        Pick an Emoji
      </button>
      {showPicker && (
        <Picker
          onSelect={(emoji) => {
            onSelect(emoji);
            setShowPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default EmojiPicker;