// Fun facts and easter eggs for mascot and subject icons

export interface FunFact {
    id: string;
    content: string;
    type: 'joke' | 'fact' | 'riddle';
}

export interface SubjectFact {
    subject: string;
    facts: FunFact[];
}

// Mascot easter eggs (random fun facts, jokes, riddles)
export const mascotEasterEggs: FunFact[] = [
    {
        id: 'mascot-1',
        content: "🎓 Did you know? The word 'education' comes from the Latin 'educare' meaning 'to bring up' or 'to train'!",
        type: 'fact'
    },
    {
        id: 'mascot-2',
        content: "🤔 Why don't scientists trust atoms? Because they make up everything!",
        type: 'joke'
    },
    {
        id: 'mascot-3',
        content: "🧠 What has keys but no locks, space but no room, and you can enter but not go inside? A keyboard!",
        type: 'riddle'
    },
    {
        id: 'mascot-4',
        content: "📚 Fun fact: The shortest war in history lasted only 38-45 minutes! (Anglo-Zanzibar War, 1896)",
        type: 'fact'
    },
    {
        id: 'mascot-5',
        content: "🎯 Why did the math book look so sad? Because it had too many problems!",
        type: 'joke'
    },
    {
        id: 'mascot-6',
        content: "🌟 What gets wetter the more it dries? A towel!",
        type: 'riddle'
    },
    {
        id: 'mascot-7',
        content: "🔬 Did you know? Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs!",
        type: 'fact'
    },
    {
        id: 'mascot-8',
        content: "🎨 Why don't eggs tell jokes? They'd crack each other up!",
        type: 'joke'
    }
];

// Subject-specific fun facts
export const subjectFacts: SubjectFact[] = [
    {
        subject: 'Mathematics',
        facts: [
            {
                id: 'math-1',
                content: "🔢 Zero was invented in India around the 5th century! Before that, there was no concept of 'nothing'!",
                type: 'fact'
            },
            {
                id: 'math-2',
                content: "📐 Why was the math book sad? Because it had too many problems!",
                type: 'joke'
            },
            {
                id: 'math-3',
                content: "🧮 What do you call a number that can't keep still? A roamin' numeral!",
                type: 'joke'
            },
            {
                id: 'math-4',
                content: "∞ The symbol for infinity (∞) was first used by mathematician John Wallis in 1655!",
                type: 'fact'
            }
        ]
    },
    {
        subject: 'Science',
        facts: [
            {
                id: 'science-1',
                content: "⚡ Lightning strikes the Earth about 100 times per second!",
                type: 'fact'
            },
            {
                id: 'science-2',
                content: "🧪 Why don't scientists trust atoms? Because they make up everything!",
                type: 'joke'
            },
            {
                id: 'science-3',
                content: "🌍 The Earth is actually getting lighter! We lose about 50,000 tons of atmosphere to space each year!",
                type: 'fact'
            },
            {
                id: 'science-4',
                content: "🔬 What do you call a fake noodle? An impasta! (But in chemistry, it's a polymer!)",
                type: 'joke'
            }
        ]
    },
    {
        subject: 'English',
        facts: [
            {
                id: 'english-1',
                content: "📝 The word 'set' has the most definitions in the English language - over 400 different meanings!",
                type: 'fact'
            },
            {
                id: 'english-2',
                content: "📚 Why did the grammar book break up with the dictionary? It found the relationship too defining!",
                type: 'joke'
            },
            {
                id: 'english-3',
                content: "✍️ The longest word in English is 'pneumonoultramicroscopicsilicovolcanoconiosis' (45 letters)!",
                type: 'fact'
            },
            {
                id: 'english-4',
                content: "🎭 What do you call a bear with no teeth? A gummy bear!",
                type: 'joke'
            }
        ]
    },
    {
        subject: 'History',
        facts: [
            {
                id: 'history-1',
                content: "🏛️ Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid!",
                type: 'fact'
            },
            {
                id: 'history-2',
                content: "⚔️ Why did the knight break up with his sword? It was too sharp for him!",
                type: 'joke'
            },
            {
                id: 'history-3',
                content: "📜 The shortest war in history lasted only 38-45 minutes! (Anglo-Zanzibar War, 1896)",
                type: 'fact'
            },
            {
                id: 'history-4',
                content: "👑 What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
                type: 'joke'
            }
        ]
    },
    {
        subject: 'Programming',
        facts: [
            {
                id: 'programming-1',
                content: "💻 The first computer bug was an actual bug! A moth got stuck in a Harvard Mark II computer in 1947!",
                type: 'fact'
            },
            {
                id: 'programming-2',
                content: "🐛 Why do programmers prefer dark mode? Because light attracts bugs!",
                type: 'joke'
            },
            {
                id: 'programming-3',
                content: "⌨️ The first computer mouse was made of wood! Doug Engelbart invented it in 1964!",
                type: 'fact'
            },
            {
                id: 'programming-4',
                content: "🤖 What do you call a programmer from Finland? Nerdic!",
                type: 'joke'
            }
        ]
    },
    {
        subject: 'Languages',
        facts: [
            {
                id: 'languages-1',
                content: "🌍 There are over 7,000 languages spoken in the world today!",
                type: 'fact'
            },
            {
                id: 'languages-2',
                content: "🗣️ Why don't language teachers ever get lost? Because they always know the way to speak!",
                type: 'joke'
            },
            {
                id: 'languages-3',
                content: "📚 The word 'hello' was first used in writing in 1827! Before that, people said 'hail' or 'good day'!",
                type: 'fact'
            },
            {
                id: 'languages-4',
                content: "🎭 What do you call a fish that speaks three languages? A tri-lingual!",
                type: 'joke'
            }
        ]
    }
];

// Helper function to get random fact
export const getRandomMascotFact = (): FunFact => {
    const randomIndex = Math.floor(Math.random() * mascotEasterEggs.length);
    return mascotEasterEggs[randomIndex];
};

// Helper function to get random subject fact
export const getRandomSubjectFact = (subject: string): FunFact | null => {
    const subjectData = subjectFacts.find(s => s.subject.toLowerCase() === subject.toLowerCase());
    if (!subjectData) return null;

    const randomIndex = Math.floor(Math.random() * subjectData.facts.length);
    return subjectData.facts[randomIndex];
};
