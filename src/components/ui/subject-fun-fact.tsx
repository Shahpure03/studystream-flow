import React,{ useState } from 'react';
import './subject-fun-fact.css';

const subjectFacts: Record<string,string[]> = {
  Mathematics: [
    "Did you know? The concept of zero was independently invented by the Mayans and Indians.",
    "The infinity symbol (∞) was first used in 1655 by John Wallis.",
    "Math joke: Why was the equal sign so humble? Because it knew it wasn’t less than or greater than anyone else!"
  ],
  Science: [
    "Lightning strikes the Earth 100 times every second!",
    "The human body contains enough carbon to fill 9,000 pencils.",
    "Science joke: Why can’t you trust an atom? Because they make up everything!"
  ],
  History: [
    "Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramid of Giza.",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
    "History joke: Why did the scarecrow become a historian? Because he was outstanding in his field!"
  ]
};

type SubjectFunFactProps = {
  subject: string;
  icon: string;
};

const SubjectFunFact: React.FC<SubjectFunFactProps> = ({ subject,icon }) => {
  const [visible,setVisible] = useState(false);
  const [currentFact,setCurrentFact] = useState('');

  const handleClick = () => {
    const facts = subjectFacts[subject] || [];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setCurrentFact(randomFact);
    setVisible(true);

    setTimeout(() => setVisible(false),5000); // Auto-hide after 5 seconds
  };

  return (
    <div className="subject-container">
      <div className="subject-icon" onClick={handleClick}>
        {icon}
      </div>
      {visible && (
        <div className="subject-fact">
          {currentFact}
        </div>
      )}
    </div>
  );
};

export default SubjectFunFact;