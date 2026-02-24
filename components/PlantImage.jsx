"use client"
    
    
    // plantNumber = Which plant ("01", "02", etc.)                                                                                
    // darkMode = Is dark mode on? (true/false)                                                                                    
    // className = Styling classes (size, opacity, etc.)                                                                           
    // alt = "" = Image description (default is empty string) 


export default function PlantImage({ plantNumber, darkMode, className, alt = "" }) {
  // If darkMode is true: use dark mode plant image 
  const imagePath = darkMode
    ? `/images/desktop-images/desktop-plant-${plantNumber}.svg` // If darkMode is TRUE - Dark mode images (turquoise/purple/green colors) 
    : `/images/desktop-images/lightMode-desktop-plant-${plantNumber}.svg`; // If darkMode is FALSE - Light mode images (orange/brown colors) 


    // just for the filter if this is dark mode 
  const filterStyle = darkMode
    ? { filter: 'saturate(0.3) brightness(0.9)' }
    : {};

  return (
    <img
      src={imagePath}
      alt={alt}
      className={className}
      style={filterStyle}
    />
  );
}

  // When dark mode is ON → loads desktop-plant-01.svg, desktop-plant-02.svg, etc.                                                 
  // When light mode is ON → loads lightMode-desktop-plant-01.svg, lightMode-desktop-plant-02.svg, etc.  