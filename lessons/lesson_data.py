LESSONS = [
    {
        "day_index": 1,
        "title": "Welcome to Rust!",
        "topic_slug": "intro",
        "estimated_time_minutes": 10,
        "theory": "Let’s start your Rust journey! You’ll learn what Rust is, why it was created, and what makes developers fall in love with it.",
        "core_example": {
            "code": "fn main() {\n    println!(\"Hello, Rust!\");\n}",
            "explanation": "Your very first Rust program—simple, clean, and the perfect starting point."
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x;\n    println!(\"{}\", x);\n}",
            "reason": "In Rust, every variable must be initialized before you use it. No exceptions!"
        },
        "challenge": {
            "task": "Print three different messages using println!—anything you like.",
            "hint": "Just call println!(\"your text\"); multiple times."
        }
    },
    {
        "day_index": 2,
        "title": "Variables & Mutability",
        "topic_slug": "variables",
        "theory": "In Rust, variables don’t change unless you explicitly allow them to. This helps keep your code safe and predictable. Add `mut` when you *want* something to be flexible.",
        "core_example": {
            "code": "fn main() {\n    let mut score = 10;\n    score = 20;\n}",
            "explanation": "Using `mut` gives you permission to update the value."
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x = 5;\n    x = 10;\n}",
            "reason": "Without `mut`, Rust protects the value from being changed."
        },
        "challenge": {
            "task": "Create one immutable variable and one mutable one.",
            "hint": "Remember: `let` for fixed, `let mut` for flexible."
        }
    },
    {
        "day_index": 3,
        "title": "Data Types",
        "topic_slug": "data-types",
        "theory": "Rust is proudly statically typed. Today you’ll meet its basic building blocks: integers, floating-point numbers, booleans, and characters.",
        "core_example": {
            "code": "fn main() {\n    let x: i32 = 5;\n    let y: f64 = 3.2;\n}",
            "explanation": "You can let Rust infer types—or tell it exactly what you want."
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x: i8 = 200;\n}",
            "reason": "Oops! i8 can only store numbers from -128 to 127."
        },
        "challenge": {
            "task": "Create one variable each for: i32, bool, and char.",
            "hint": "Try using explicit type annotations to practice."
        }
    },
    {
        "day_index": 4,
        "title": "Functions",
        "topic_slug": "functions",
        "theory": "Functions help you organize your thoughts (and your code). In Rust, every parameter needs a type, and the return type is clearly spelled out.",
        "core_example": {
            "code": "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
            "explanation": "A clean function with an implicit return—just drop the semicolon!"
        },
        "pitfall_example": {
            "code": "fn bad(a: i32, b: i32) {\n    a + b;\n}",
            "reason": "This function doesn’t say what it returns—and actually returns nothing."
        },
        "challenge": {
            "task": "Write a function that multiplies two numbers.",
            "hint": "Don’t forget the return arrow: -> i32"
        }
    },
    {
        "day_index": 5,
        "title": "Control Flow",
        "topic_slug": "control-flow",
        "theory": "Rust gives you powerful tools—if, else, loop, while, and for—to guide your programs' decisions and actions.",
        "core_example": {
            "code": "fn main() {\n    let x = 10;\n    if x > 5 {\n        println!(\"big\");\n    }\n}",
            "explanation": "In Rust, `if` is an expression, which means it produces a value."
        },
        "pitfall_example": {
            "code": "fn main() {\n    let x = 10;\n    let y = if x {\n        1\n    } else {\n        0\n    };\n}",
            "reason": "Conditions must be true/false—not numbers or other types."
        },
        "challenge": {
            "task": "Write a loop that prints the numbers from 1 to 5.",
            "hint": "Try: for i in 1..=5"
        }
    },
]
