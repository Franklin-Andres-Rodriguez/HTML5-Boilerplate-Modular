let outputDiv = document.getElementById('output');
let stackDiv = document.getElementById('stackVisualization');
let stepDelay = 800;

function clearOutput() {
    outputDiv.textContent = '';
    stackDiv.innerHTML = '';
}

async function runDemo() {
    clearOutput();
    outputDiv.textContent = "🚀 Starting execution...\n\n";
    await simulateCallStack();
}

async function simulateCallStack() {
    const steps = [
        { action: 'call', function: 'cook()', message: '🍳 1. Starting to cook...' },
        { action: 'call', function: 'washDishes()', message: '🧽 2. Starting to wash dishes...' },
        { action: 'call', function: 'dryDishes()', message: '🏠 3. Starting to dry dishes...' },
        { action: 'call', function: 'putAwayDishes()', message: '📦 Putting dishes in the cupboard' },
        { action: 'return', function: 'putAwayDishes()', message: '✅ putAwayDishes() finished' },
        { action: 'continue', function: 'dryDishes()', message: '🏠 4. Finished drying dishes!' },
        { action: 'return', function: 'dryDishes()', message: '✅ dryDishes() finished' },
        { action: 'continue', function: 'washDishes()', message: '🧽 5. Finished washing dishes!' },
        { action: 'return', function: 'washDishes()', message: '✅ washDishes() finished' },
        { action: 'continue', function: 'cook()', message: '🍳 6. Finished cooking!' },
        { action: 'return', function: 'cook()', message: '✅ cook() finished' }
    ];

    let stack = [];

    for (let step of steps) {
        if (step.action === 'call') {
            stack.push(step.function);
            outputDiv.textContent += step.message + '\n';
        } else if (step.action === 'return') {
            stack.pop();
            outputDiv.textContent += step.message + '\n';
        } else if (step.action === 'continue') {
            outputDiv.textContent += step.message + '\n';
        }
        
        updateStackVisualization(stack);
        await sleep(stepDelay);
    }

    outputDiv.textContent += '\n🎉 Execution complete!';
    stackDiv.innerHTML += '<div style="color: #ff6b6b; font-weight: bold;">Empty stack - Program finished</div>';
}

function updateStackVisualization(stack) {
    stackDiv.innerHTML = '';
    if (stack.length === 0) {
        stackDiv.innerHTML = '<div style="color: #666;">Empty stack</div>';
        return;
    }

    stackDiv.innerHTML += '<div style="color: #888; margin-bottom: 10px;">⬇️ Last in (Top of Stack)</div>';
    
    for (let i = stack.length - 1; i >= 0; i--) {
        const isActive = i === stack.length - 1;
        stackDiv.innerHTML += `
            <div class="stack-frame ${isActive ? 'active' : ''}">
                ${stack[i]} ${isActive ? '← Running' : '← Waiting'}
            </div>
        `;
    }
    
    stackDiv.innerHTML += '<div style="color: #888; margin-top: 10px;">⬆️ First in (Bottom of Stack)</div>';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
