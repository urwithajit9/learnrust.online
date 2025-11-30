LESSONS = [
  {
    "day_index": 11,
    "title": "Understanding Ownership: The Heart of Rust",
    "topic_slug": "ownership-basics",
    "estimated_time_minutes": 12,
    "theory": "Ownership is Rust’s core rule to ensure memory safety without a garbage collector. Every value has exactly one owner, and when the owner goes out of scope, the value is dropped. This prevents accidental memory leaks and dangling references.",
    "core_example": {
      "explanation": "A variable owns its data, and when reassigned, ownership moves.",
      "code": "let s1 = String::from(\"hello\");\nlet s2 = s1; // ownership moves\n// println!(\"{}\", s1); // ❌ error: s1 no longer valid"
    },
    "pitfall_example": {
      "explanation": "Trying to use a moved value will cause a compile-time error.",
      "code": "let a = String::from(\"hi\");\nlet b = a;\nprintln!(\"{}\", a); // ❌ value used after move"
    },
    "challenge": {
      "task": "Create a String, move it to another variable, then try to print both. Observe the compiler error and fix it by using cloning.",
      "hint": "Use: let b = a.clone();",
      "expected_output": "Prints both values correctly using the cloned String."
    }
  },
  {
    "day_index": 12,
    "title": "Borrowing: Using Data Without Taking It",
    "topic_slug": "borrowing",
    "estimated_time_minutes": 10,
    "theory": "Borrowing lets you reference owned data without taking ownership. &T gives read-only access, &mut T gives mutable access. Rust ensures only one mutable reference exists at a time.",
    "core_example": {
      "explanation": "Immutable reference allows reading without owning.",
      "code": "let s = String::from(\"hello\");\nlet len = calculate_len(&s);\nfn calculate_len(x: &String) -> usize { x.len() }"
    },
    "pitfall_example": {
      "explanation": "You cannot borrow mutably while an immutable borrow exists.",
      "code": "let mut s = String::from(\"hello\");\nlet r1 = &s;\nlet r2 = &mut s; // ❌ cannot borrow mutably"
    },
    "challenge": {
      "task": "Write a function that takes &mut String and appends \"!\" to it.",
      "hint": "Use push_str inside the mutable borrow.",
      "expected_output": "\"hello\" becomes \"hello!\""
    }
  },
  {
    "day_index": 13,
    "title": "Lifetimes — Why Does Rust Need Them?",
    "topic_slug": "lifetimes-intro",
    "estimated_time_minutes": 13,
    "theory": "Lifetimes ensure that references remain valid. They prevent dangling memory by enforcing how long borrowed data must live. Often, lifetimes are inferred automatically.",
    "core_example": {
      "explanation": "Function with explicit lifetime parameter.",
      "code": "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}"
    },
    "pitfall_example": {
      "explanation": "Returning a reference to a local variable is not allowed.",
      "code": "fn bad() -> &String { // ❌ invalid\n    let s = String::from(\"hi\");\n    &s // drops here\n}"
    },
    "challenge": {
      "task": "Write a function that takes two string slices and returns the longer one.",
      "hint": "Use lifetime 'a on parameters and return type.",
      "expected_output": "Correctly returns the longer slice."
    }
  },
  {
    "day_index": 14,
    "title": "Functions: Clean, Reusable Logic",
    "topic_slug": "functions",
    "estimated_time_minutes": 10,
    "theory": "Functions help organize reusable logic. Rust returns the last expression unless you use return. Parameters must have explicit types.",
    "core_example": {
      "explanation": "A simple function returning a value.",
      "code": "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}"
    },
    "pitfall_example": {
      "explanation": "An extra semicolon turns an expression into a statement.",
      "code": "fn wrong(a: i32) -> i32 {\n    a + 1; // ❌ now returns () instead of i32\n}"
    },
    "challenge": {
      "task": "Write a function multiply(x, y) that returns x * y.",
      "hint": "Don't put a semicolon after the return expression.",
      "expected_output": "multiply(2, 3) → 6"
    }
  },
  {
    "day_index": 15,
    "title": "Modules: Organize Your Rust Project",
    "topic_slug": "modules",
    "estimated_time_minutes": 12,
    "theory": "Modules allow you to structure and separate code logically. Use mod to declare a module and pub to expose items outside the module.",
    "core_example": {
      "explanation": "Basic module with public function.",
      "code": "mod math_utils {\n    pub fn square(x: i32) -> i32 { x * x }\n}\nfn main() {\n    println!(\"{}\", math_utils::square(4));\n}"
    },
    "pitfall_example": {
      "explanation": "Forgetting pub makes items private.",
      "code": "mod m { fn hi() {} }\nm::hi(); // ❌ error: function is private"
    },
    "challenge": {
      "task": "Create a module printer with a pub fn greet(name) that prints a message.",
      "hint": "Use pub fn greet() inside a mod block.",
      "expected_output": "greet(\"Alice\") prints a friendly greeting."
    }
  },
  {
    "day_index": 16,
    "title": "Using the Standard Library: Your Toolbelt",
    "topic_slug": "std-library",
    "estimated_time_minutes": 10,
    "theory": "Rust's standard library includes collections, string utilities, filesystem tools, and more. Learning common modules like std::fs, std::env, and std::collections is key.",
    "core_example": {
      "explanation": "Using Vec from std::collections.",
      "code": "let mut v = Vec::new();\nv.push(1);\nv.push(2);"
    },
    "pitfall_example": {
      "explanation": "Indexing a vector can panic if out of bounds.",
      "code": "let v = vec![1,2,3];\nprintln!(\"{}\", v[5]); // ❌ panic"
    },
    "challenge": {
      "task": "Use std::fs::read_to_string to read a file and print it.",
      "hint": "Use expect() to handle errors for now.",
      "expected_output": "Reads file contents successfully."
    }
  },
  {
    "day_index": 17,
    "title": "Working with Strings",
    "topic_slug": "strings",
    "estimated_time_minutes": 12,
    "theory": "Rust has two main string types: String (growable, heap-allocated) and &str (string slice). String is often converted from &str with to_string or String::from.",
    "core_example": {
      "explanation": "Appending to a String.",
      "code": "let mut s = String::from(\"Rust\");\ns.push_str(\" is awesome!\");"
    },
    "pitfall_example": {
      "explanation": "Indexing a String is not allowed due to UTF-8 characters.",
      "code": "let s = String::from(\"hello\");\nlet c = s[0]; // ❌ cannot index strings"
    },
    "challenge": {
      "task": "Create a String, append text, then convert it back to &str.",
      "hint": "Use &my_string[..] to create a slice.",
      "expected_output": "Slice prints full updated string."
    }
  },
  {
    "day_index": 18,
    "title": "Tuples: Grouping Mixed Data",
    "topic_slug": "tuples",
    "estimated_time_minutes": 8,
    "theory": "Tuples group fixed-size values of different types. Useful for returning multiple values from functions.",
    "core_example": {
      "explanation": "Returning a tuple.",
      "code": "fn stats() -> (i32, f32) {\n    (5, 2.5)\n}"
    },
    "pitfall_example": {
      "explanation": "Tuples do not support named fields.",
      "code": "let p = (10, 20);\np.x // ❌ no named fields"
    },
    "challenge": {
      "task": "Write a function returning (sum, product) of two numbers.",
      "hint": "Return (a + b, a * b).",
      "expected_output": "Calling with 2 and 3 returns (5, 6)."
    }
  },
  {
    "day_index": 19,
    "title": "Structs: Create Your Own Data Types",
    "topic_slug": "structs",
    "estimated_time_minutes": 13,
    "theory": "Structs let you define custom data types with named fields. They’re incredibly useful for modeling real-world data.",
    "core_example": {
      "explanation": "Basic struct and initialization.",
      "code": "struct User { name: String, age: u8 }\nlet u = User { name: \"Bob\".to_string(), age: 30 };"
    },
    "pitfall_example": {
      "explanation": "Fields must be initialized in order and correctly.",
      "code": "let u = User { age: 20 }; // ❌ missing fields"
    },
    "challenge": {
      "task": "Create a Book struct with title and pages. Instantiate one and print it.",
      "hint": "Derive Debug for easy printing.",
      "expected_output": "Book { title: \"Rust 101\", pages: 120 }"
    }
  },
  {
    "day_index": 20,
    "title": "Enums: Powerful Type Variants",
    "topic_slug": "enums",
    "estimated_time_minutes": 14,
    "theory": "Enums let a type be one of several variants. Combined with match, they become one of Rust’s most expressive tools.",
    "core_example": {
      "explanation": "Basic enum with multiple variants.",
      "code": "enum Direction { Up, Down, Left, Right }\nlet d = Direction::Up;"
    },
    "pitfall_example": {
      "explanation": "You must handle all enum variants in match expressions.",
      "code": "match d {\n    Direction::Up => println!(\"up\"),\n    _ => {} // ok, but wildcard hides missing cases\n}"
    },
    "challenge": {
      "task": "Create an enum Message with variants Text(String), Quit, and Number(i32). Write a match to print each variant.",
      "hint": "Remember pattern matching syntax: Message::Text(t).",
      "expected_output": "Correctly prints for each variant type."
    }
  }
]
