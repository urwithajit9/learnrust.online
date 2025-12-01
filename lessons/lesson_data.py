LESSONS = [
    {
        "day_index": 1,
        "title": "Setting Up Your Rust Environment (rustup & Cargo)",
        "topic_slug": "setup",
        "estimated_time_minutes": 20,
        "theory": "Rust uses two primary tools that you need to know: \n\n1. rustup: The toolchain installer. This is how you get Rust on your computer and manage different versions.\n2. Cargo: Rust's build system and package manager. Every serious Rust project uses Cargo to handle compiling, running, testing, and managing dependencies.\n\n### Step 1: Installing Rust with rustup\n\nLinux/macOS\nOpen your terminal and run the following command. This downloads rustup and installs the latest stable version of Rust and Cargo.\n\n$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\n\nFollow the on-screen instructions (the default installation option is usually fine).\n\nWindows\nGo to the official Rust website and download the rustup-init.exe installer. Run the installer and follow the prompts.\n\nVerification\nAfter installation, you should be able to run these commands in a new terminal session:\n\n$ rustc --version (Shows the Rust compiler version)\n$ cargo --version (Shows the Cargo version)\n\n### Step 2: Creating a Project with Cargo\n\nCargo simplifies everything. Instead of manually creating files and running the compiler, you use Cargo. Let's create our first project, hello_cargo:\n\n$ cargo new hello_cargo\n\nThis command creates a new directory named hello_cargo with this standard structure: \n\n* src/main.rs: This is where your code lives. Cargo looks for the main entry point here.\n* Cargo.toml: This is the configuration file for your project. It holds metadata (name, version) and lists any external libraries (dependencies) your project uses.",
        "core_example": {
            "code": "# 1. Change directory into your new project:\n$ cd hello_cargo\n\n# 2. Run the project (compiles and executes the code):\n$ cargo run\n\n# Output:\n# Compiling hello_cargo v0.1.0 (...\n# Finished dev [unoptimized + debuginfo] target(s) in 0.10s\n# Running target/debug/hello_cargo\nHello, world!",
            "explanation": "cargo run is the standard way to build and execute a Rust project. It handles calling the rustc compiler behind the scenes and places the executable binary in the target/debug/ directory.",
        },
        "pitfall_example": {
            "code": "# Manual 'Hello World' (Don't do this!)\n$ rustc main.rs\n$ ./main\n\n# Why Cargo is better:\n$ cargo run\n",
            "reason": "While you can compile a single file manually with rustc main.rs, it is strongly discouraged. As soon as your project requires more than one file or any external dependencies (which all real-world apps do), Cargo becomes mandatory. Always use cargo new and cargo run.",
        },
        "challenge": {
            "task": "Create a second, separate project named my_tool using cargo new. Then, modify the src/main.rs file in my_tool to print your name instead of 'Hello, world!'. Finally, run the project.",
            "hint": "The steps are: cargo new my_tool, then open my_tool/src/main.rs to edit, and finish with cd my_tool followed by cargo run.",
        },
    },
    {
        "day_index": 2,
        "title": "Variables & Mutability",
        "topic_slug": "variables",
        "theory": "In Rust, variables don’t change unless you explicitly allow them to. This helps keep your code safe and predictable. Add `mut` when you *want* something to be flexible.",
        "core_example": {
            "code": "fn main() {\n    let mut score = 10;\n    score = 20;\n}",
            "explanation": "Using `mut` gives you permission to update the value.",
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x = 5;\n    x = 10;\n}",
            "reason": "Without `mut`, Rust protects the value from being changed.",
        },
        "challenge": {
            "task": "Create one immutable variable and one mutable one.",
            "hint": "Remember: `let` for fixed, `let mut` for flexible.",
        },
    },
    {
        "day_index": 3,
        "title": "Data Types",
        "topic_slug": "data-types",
        "theory": "Rust is proudly statically typed. Today you’ll meet its basic building blocks: integers, floating-point numbers, booleans, and characters.",
        "core_example": {
            "code": "fn main() {\n    let x: i32 = 5;\n    let y: f64 = 3.2;\n}",
            "explanation": "You can let Rust infer types—or tell it exactly what you want.",
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x: i8 = 200;\n}",
            "reason": "Oops! i8 can only store numbers from -128 to 127.",
        },
        "challenge": {
            "task": "Create one variable each for: i32, bool, and char.",
            "hint": "Try using explicit type annotations to practice.",
        },
    },
    {
        "day_index": 4,
        "title": "Functions",
        "topic_slug": "functions",
        "theory": "Functions help you organize your thoughts (and your code). In Rust, every parameter needs a type, and the return type is clearly spelled out.",
        "core_example": {
            "code": "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
            "explanation": "A clean function with an implicit return—just drop the semicolon!",
        },
        "pitfall_example": {
            "code": "fn bad(a: i32, b: i32) {\n    a + b;\n}",
            "reason": "This function doesn’t say what it returns—and actually returns nothing.",
        },
        "challenge": {
            "task": "Write a function that multiplies two numbers.",
            "hint": "Don’t forget the return arrow: -> i32",
        },
    },
    {
        "day_index": 5,
        "title": "Control Flow",
        "topic_slug": "control-flow",
        "theory": "Rust gives you powerful tools—if, else, loop, while, and for—to guide your programs' decisions and actions.",
        "core_example": {
            "code": 'fn main() {\n    let x = 10;\n    if x > 5 {\n        println!("big");\n    }\n}',
            "explanation": "In Rust, `if` is an expression, which means it produces a value.",
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x = 10;\n    let y = if x {\n        1\n    } else {\n        0\n    };\n}",
            "reason": "Conditions must be true/false—not numbers or other types.",
        },
        "challenge": {
            "task": "Write a loop that prints the numbers from 1 to 5.",
            "hint": "Try: for i in 1..=5",
        },
    },
]
