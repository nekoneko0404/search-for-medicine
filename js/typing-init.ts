import { typewriterMultiple } from './typing-animation';

document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        { element: document.getElementById('drugName') as HTMLInputElement, text: '例: ロキソニン', speed: 150 },
        { element: document.getElementById('ingredientName') as HTMLInputElement, text: '例: ロキソプロフェン', speed: 150 },
        { element: document.getElementById('makerName') as HTMLInputElement, text: '例: 60mg', speed: 150 }
    ];

    typewriterMultiple(inputs, 400);
});
