/* global ejecutarDemo, limpiarOutput, simularCallStack, updateStackVisualization, sleep */

// We will stub sleep to avoid waiting in tests
function fastSleep() { return Promise.resolve(); }

describe('Call Stack Demo', () => {
  beforeEach(() => {
    // Do not replace the entire body, because the app captured references
    // to outputDiv and stackDiv at load time. Just reset their contents.
    const out = document.getElementById('output');
    const stack = document.getElementById('stackVisualization');
    if (!out || !stack) {
      throw new Error('Required DOM nodes are missing for tests');
    }
    out.textContent = '';
    stack.innerHTML = '';

    // Force no delay for determinism
    window.stepDelay = 0;
  });

  it('should clear previous output and stack when limpiarOutput is called', () => {
    const out = document.getElementById('output');
    const stack = document.getElementById('stackVisualization');
    out.textContent = 'something';
    stack.innerHTML = '<span>frame</span>';

    limpiarOutput();

    expect(out.textContent).toBe('');
    expect(stack.innerHTML).toBe('');
  });

  it('should append step messages and final completion text after simularCallStack', async () => {
    // stub sleep so the test runs immediately
    spyOn(window, 'sleep').and.callFake(fastSleep);

    await simularCallStack();

    const text = document.getElementById('output').textContent;
    expect(text).toContain('🍳 1. Empezando a cocinar...');
    expect(text).toContain('✅ cocinar() termina');
    expect(text.trim().endsWith('🎉 ¡Ejecución completa!')).toBeTrue();

    const stackHtml = document.getElementById('stackVisualization').innerHTML;
    expect(stackHtml).toContain('Stack vacío - Programa terminado');
  });

  it('should visualize stack frames in LIFO order and mark top frame as active', () => {
    updateStackVisualization(['cocinar()', 'lavarPlatos()', 'secarPlatos()']);

    const frames = Array.from(document.querySelectorAll('.stack-frame'));
    expect(frames.length).toBe(3);

    // First rendered frame corresponds to top of stack (last pushed)
    expect(frames[0].textContent).toContain('secarPlatos()');
    expect(frames[0].classList.contains('active')).toBeTrue();

    expect(frames[frames.length - 1].textContent).toContain('cocinar()');
    expect(frames[frames.length - 1].classList.contains('active')).toBeFalse();
  });

  it('should indicate empty stack when no frames exist', () => {
    updateStackVisualization([]);

    expect(document.getElementById('stackVisualization').innerHTML).toContain('Stack vacío');
  });

  it('ejecutarDemo should reset output and start the simulation', async () => {
    spyOn(window, 'limpiarOutput').and.callThrough();
    spyOn(window, 'sleep').and.callFake(fastSleep);

    await ejecutarDemo();

    expect(window.limpiarOutput).toHaveBeenCalled();
    expect(document.getElementById('output').textContent).toContain('🚀 Iniciando ejecución');
  });
});
