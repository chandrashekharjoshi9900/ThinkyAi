# **App Name**: LearnAI

## Core Features:

- Topic Input: A home page with a clear input field to enter the topic for learning, adhering to secure input practices to prevent XSS vulnerabilities.
- AI Explanation Generation: Use an AI tool to generate an explanation of the topic using a LLM which can conditionally insert extra facts or info into the explanation.
- AI Quiz Generation: Use an AI tool to generate a quiz with 3 multiple-choice questions (MCQs) and correct answers using a LLM which can conditionally choose topics to quiz.
- AI Flashcard Generation: Use an AI tool to create 3 flashcards based on the AI-generated explanation.
- Translation: A button to translate the generated explanation into Hindi.
- Text-to-Speech: A button to activate text-to-speech functionality for the explanation.
- Dark Mode Toggle: Implement a toggle for dark mode to enhance user experience.

## Style Guidelines:

- Primary color: Soft purple (#A084CA) to evoke creativity and intellect.
- Background color: Light gray (#F0F0F5) to ensure readability and a clean aesthetic in light mode, complemented by a dark alternative for dark mode.
- Accent color: Pale lavender (#B2BEB5) to add subtle contrast and highlight interactive elements.
- Font pairing: 'Poppins' (sans-serif) for headlines, offering a modern and clean aesthetic, complemented by 'PT Sans' (sans-serif) for body text, providing readability and warmth.
- Use clean and minimalist icons that relate to the topic of the learning material. Icons should be SVG format for scalability.
- Employ a mobile-first, fully responsive design, leveraging Tailwind CSS or custom CSS. Glassmorphism UI with subtle gradients and blur effects to provide a professional modern feel. Ensure proper spacing, alignment, and visual hierarchy to facilitate intuitive navigation.
- Integrate subtle and smooth animations via GSAP or AOS to enhance user engagement and provide feedback for actions.