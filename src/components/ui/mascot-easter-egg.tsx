import React,{ useState } from 'react';
import './mascot-easter-egg.css'; // Import CSS for animations

const funFacts = [
  "Did you know? The first computer bug was an actual bug!",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "Riddle: I speak without a mouth and hear without ears. What am I? (Answer: An echo)",
  "Fun fact: The infinity symbol (∞) was first used in 1655 by John Wallis.",
  "Trivia: Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramid of Giza."
];

const MascotEasterEgg = () => {
  const [visible,setVisible] = useState(false);
  const [currentFact,setCurrentFact] = useState('');
  const [cooldown,setCooldown] = useState(false);

  const handleClick = () => {
    if (cooldown) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false),2000); // 2-second cooldown

    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setCurrentFact(randomFact);
    setVisible(true);

    setTimeout(() => setVisible(false),5000); // Auto-hide after 5 seconds
  };

  return (
    <div className="mascot-container">
      <div className="mascot-icon" onClick={handleClick}>
        🎓
      </div>
      {visible && (
        <div className="mascot-fact">
          {currentFact}
        </div>
      )}
    </div>
  );
};

export default MascotEasterEgg;