import { useEffect } from 'react';

const DisableCopyPasteRightClick = () => {
  useEffect(() => {
    const handleCopy = (event) => {
      event.preventDefault();
    };

    const handleCut = (event) => {
      event.preventDefault();
    };

    const handlePaste = (event) => {
      event.preventDefault();
    };

    const handleSelect = (event) => {
      event.preventDefault();
    };

    // Attach the event listeners to the appropriate input elements
    const inputElements = document.querySelectorAll('input'); // Replace 'input' with your desired selector
    inputElements.forEach((input) => {
      input.addEventListener('copy', handleCopy);
      input.addEventListener('cut', handleCut);
      input.addEventListener('paste', handlePaste);
      input.addEventListener('selectstart', handleSelect);
    });

    // Attach event listener to disable right-click
    const handleRightClick = (event) => {
      event.preventDefault();
    };
    document.addEventListener('contextmenu', handleRightClick);

    // Clean up the event listeners when the component unmounts
    return () => {
      inputElements.forEach((input) => {
        input.removeEventListener('copy', handleCopy);
        input.removeEventListener('cut', handleCut);
        input.removeEventListener('paste', handlePaste);
        input.removeEventListener('selectstart', handleSelect);
      });
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return null; // This component doesn't render any UI
};

export default DisableCopyPasteRightClick;
