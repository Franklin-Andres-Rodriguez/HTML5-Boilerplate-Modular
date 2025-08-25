---

# Call Stack 📚

An educational project to understand how the **Call Stack** works in JavaScript.

## 🎯 Description

This repository contains practical examples and explanations about how the Call Stack works in JavaScript, a fundamental data structure for understanding function execution in the language.

## 🧠 What is the Call Stack?

The Call Stack is a **LIFO (Last In, First Out)** data structure that keeps track of:

* Which functions are being executed
* The order in which they were called
* Where the control should return after each execution

## 📋 Contents

* `examples/` - Example code demonstrating the Call Stack
* `theory/` - Theoretical explanations and diagrams
* `exercises/` - Interactive practice

## 🚀 How to Use this Repository

1. Clone the repository:

   ```bash
   git clone https://github.com/Franklin-Andres-Rodriguez/Call-Stack.git
   ```
2. Navigate to the directory:

   ```bash
   cd Call-Stack
   ```
3. Open the files in your favorite editor and run the examples.

## 📊 Basic Example

```javascript
function third() {
    console.log("Running third()");
}

function second() {
    console.log("Running second()");
    third();
    console.log("Ending second()");
}

function first() {
    console.log("Running first()");
    second();
    console.log("Ending first()");
}

first();
```

**Call Stack in action:**

```
1. first() - enters the stack  
2. second() - enters the stack  
3. third() - enters the stack  
4. third() - exits the stack (LIFO)  
5. second() - exits the stack  
6. first() - exits the stack  
```

## 🤝 Contributions

Contributions are welcome! If you have additional examples or improvements:

1. Fork the project
2. Create a new feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📚 Additional Resources

* [MDN - Call Stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)
* [JavaScript Visualizer](https://www.jsv9000.app/)
* [Loupe - Call Stack Visualizer](http://latentflip.com/loupe/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐ If this project helped you understand the Call Stack, give it a star!

**Author:** Franklin Andrés Rodríguez
**GitHub:** [@Franklin-Andres-Rodriguez](https://github.com/Franklin-Andres-Rodriguez)

---

