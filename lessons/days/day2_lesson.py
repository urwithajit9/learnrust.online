LESSON = [
    {
  "day_index": 2,
  "title": "Anatomy of the First Program (main and println!)",
  "topic_slug": "first_program_anatomy",
  "estimated_time_minutes": 15,
  "theory": "Every executable Rust program starts execution at a function named `main`. Understanding this structure is crucial, as it’s the foundation of all your future applications.\n\n### 1. The `main` Function\n\nThe `fn` keyword is used to declare a function in Rust. The `main` function is special: it's the entry point.\n\n```rust\nfn main() {\n    // Code goes here\n}\n```\n\n* `fn`: Function declaration keyword.\n* `main`: The name of the function; always the starting point.\n* `()`: Placeholder for arguments (inputs) to the function. For `main`, it's usually empty.\n* `{}`: The curly braces define the body of the function, which contains the steps the program executes.\n\n### 2. The `println!` Macro\n\nIn Rust, you often see function names ending with an exclamation mark (`!`). This signifies a **macro**, not a regular function. Macros look like functions but operate differently (they expand code at compile time).\n\n* `println!`: A macro used to print text to the console (standard output).\n* `\"Hello, world!\"`: The string literal (text) enclosed in double quotes that you want to display.\n* `;`: Rust is an 'expression-based' language, but most statements (like function calls or macro calls) must end with a semicolon.",
  "core_example": {
    "code": "// File: src/main.rs\nfn main() {\n    // This is the core 'Hello World' code.\n    println!(\"Hello, world!\");\n}\n",
    "explanation": "This is the simplest executable program in Rust. When you run `$ cargo run` in your project folder, the compiler looks for the `main` function and executes the `println!` macro inside it, displaying the string on your screen.",
    "tools_used": [
      "println!"
    ]
  },
  "pitfall_example": {
    "code": "// File: src/main.rs\nfn main() {\n    println(\"Hello, world!\") // ERROR: Missing '!' and ';'\n}\n",
    "reason": "Omitting the exclamation mark (`!`) turns the macro `println!` into a regular function call that doesn't exist, leading to a compilation error. Omitting the semicolon (`;`) is often acceptable but best practice for statements is to include it to avoid confusing the compiler's expression evaluation.",
    "tools_used": [
      "println"
    ]
  },
  "challenge": {
    "task": "Open the `src/main.rs` file in your `hello_cargo` project from Day 1. Inside the `main` function, add two more `println!` macro calls: one above the original line and one below it. The first should print 'Program Starting...' and the last should print 'Program Finished.'.",
    "hint": "Ensure all three lines of code are within the curly braces (`{}`) of the `main` function and each ends with a semicolon (`;`).",
    "tools_used": [
      "println!"
    ]
  }
},
]