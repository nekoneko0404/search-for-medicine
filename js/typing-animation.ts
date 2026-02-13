/**
 * Typewriter effect for input placeholder
 * @param inputElement - The input element to animate
 * @param fullText - The full placeholder text to display
 * @param speed - Typing speed in milliseconds per character
 */
export function typewriterPlaceholder(inputElement: HTMLInputElement, fullText: string, speed: number = 100): void {
    if (!inputElement || !fullText) return;

    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isAnimating = true;

    // Clear the placeholder initially
    inputElement.placeholder = '';

    // Function to stop animation and show full text
    const stopAnimation = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        isAnimating = false;
        inputElement.placeholder = fullText;
    };

    // Function to type one character
    const typeNextChar = () => {
        if (!isAnimating) return;

        if (currentIndex < fullText.length) {
            inputElement.placeholder = fullText.substring(0, currentIndex + 1);
            currentIndex++;
            timeoutId = setTimeout(typeNextChar, speed);
        }
    };

    // Stop animation if user focuses or inputs
    const handleUserInteraction = () => {
        stopAnimation();
        // Remove listeners after first interaction
        inputElement.removeEventListener('focus', handleUserInteraction);
        inputElement.removeEventListener('input', handleUserInteraction);
    };

    inputElement.addEventListener('focus', handleUserInteraction);
    inputElement.addEventListener('input', handleUserInteraction);

    // Start typing animation
    typeNextChar();
}

interface TypewriterConfig {
    element: HTMLInputElement | null;
    text: string;
    speed?: number;
}

/**
 * Apply typewriter effect to multiple inputs with staggered start times
 * @param inputs - Array of input configurations
 * @param staggerDelay - Delay between starting each animation in milliseconds
 */
export function typewriterMultiple(inputs: TypewriterConfig[], staggerDelay: number = 300): void {
    inputs.forEach((config, index) => {
        if (config.element) {
            setTimeout(() => {
                typewriterPlaceholder(config.element as HTMLInputElement, config.text, config.speed || 100);
            }, index * staggerDelay);
        }
    });
}
