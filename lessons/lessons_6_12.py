LESSONS = [
  {
    "day_index": 6,
    "title": "Data Types: Understanding Rust's Building Blocks",
    "topic_slug": "data-types",
    "estimated_time_minutes": 10,
    "theory": "Today we explore Rust’s basic data types—the building blocks of everything you create. Even if you’ve never programmed before, think of data types as different containers built for different kinds of values. Rust is very strict about what type of data goes into each container, and that strictness helps you avoid bugs early. Rust has four main primitive categories: numbers, booleans, characters, and compound types. Numbers can be whole numbers (integers) or numbers with decimals (floats). Each number also has a size, meaning how much memory it uses. Characters represent a single letter, emoji, or symbol. Booleans are simply true or false. Compound types allow you to group values together—tuples for a fixed-size collection, and arrays for lists of the same type and fixed length. This may sound like a lot at first, but once you see them in action they become natural.",
    "core_example": {
      "code": "fn main() {\n    let age: u32 = 25;\n    let price: f64 = 19.99;\n    let is_active: bool = true;\n    let letter: char = 'A';\n    let coordinates: (i32, i32) = (10, 20);\n    let scores: [u8; 3] = [90, 85, 88];\n\n    println!(\"Age: {}\", age);\n    println!(\"Price: {}\", price);\n    println!(\"Active: {}\", is_active);\n    println!(\"Letter: {}\", letter);\n    println!(\"Coordinates: ({}, {})\", coordinates.0, coordinates.1);\n    println!(\"Scores: {:?}\", scores);\n}",
      "explanation": "This example introduces Rust’s basic types: integer (u32), floating-point number (f64), boolean (bool), character (char), tuple, and array. Each type requires precise values. Rust keeps you safe by preventing you from mixing incompatible types."
    },
    "pitfall_example": {
      "code": "fn main() {\n    let age = 25;\n    let price: f32 = age; // Error: cannot implicitly convert integer to float\n    println!(\"{}\", price);\n}",
      "errorHint": "Rust never performs automatic type conversion. You must convert values explicitly using the 'as' keyword (e.g., age as f32)."
    },
    "challenge": {
      "template": "fn main() {\n    // Create variables for your name's first letter, your age, and whether you like Rust.\n    // Then print them.\n\n    // TODO\n    \n    println!(\"Letter: {} Age: {} Likes Rust: {}\", letter, age, likes_rust);\n}",
      "instructions": "Declare three variables: a char for your first initial, an integer for your age, and a boolean indicating if you like Rust. Then print them exactly as shown.",
      "expectedOutput": "Letter: A Age: 25 Likes Rust: true"
    }
  },
  {
    "day_index": 7,
    "title": "Functions: Teaching Rust to Do Tasks",
    "topic_slug": "functions",
    "estimated_time_minutes": 10,
    "theory": "Functions allow you to organize your code into reusable blocks. Think of them like teaching Rust a new skill—once a function is defined, you can ask Rust to run it anytime. Functions can take inputs called parameters and return results. Rust cares deeply about the types of both parameters and return values. Function names should be snake_case, meaning lowercase with underscores. When writing functions, remember that the last expression without a semicolon becomes the return value. This might feel unusual at first but quickly becomes intuitive. Functions keep your code clean, readable, and easier to maintain.",
    "core_example": {
      "code": "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nfn main() {\n    let result = add(5, 7);\n    println!(\"Result: {}\", result);\n}",
      "explanation": "The function 'add' takes two integers and returns their sum. Notice there is no semicolon after 'a + b'—that means it's the return value. Rust encourages clear and simple functions like this."
    },
    "pitfall_example": {
      "code": "fn multiply(a: i32, b: i32) -> i32 {\n    return a * b;\n    a + b // This will never run\n}\n\nfn main() {\n    println!(\"{}\", multiply(2, 3));\n}",
      "errorHint": "Rust warns about unreachable code. Once you return early, any code after that won't run. Remove unnecessary return statements or unreachable expressions."
    },
    "challenge": {
      "template": "fn greet(name: &str) -> String {\n    // TODO: return a friendly message using the provided name\n}\n\nfn main() {\n    let msg = greet(\"Alex\");\n    println!(\"{}\", msg);\n}",
      "instructions": "Write a function that takes a name and returns a greeting message like \"Hello, Alex!\" Use String formatting.",
      "expectedOutput": "Hello, Alex!"
    }
  },
  {
    "day_index": 8,
    "title": "Ownership Basics: Rust’s Most Famous Rule",
    "topic_slug": "ownership",
    "estimated_time_minutes": 12,
    "theory": "Ownership is Rust’s way of managing memory safely without a garbage collector. While it might sound intimidating, at its heart ownership is about one simple rule: every value has exactly one owner at a time. When the owner goes out of scope, the value is dropped. Moving a value transfers ownership, while cloning explicitly duplicates data. These rules prevent accidental data access bugs and memory leaks. Beginners often find ownership strange at first, but with gentle practice it becomes second nature and even comforting, like having guardrails that keep you safe.",
    "core_example": {
      "code": "fn main() {\n    let name = String::from(\"Rust\");\n    let another = name; // Ownership moves here\n\n    println!(\"{}\", another);\n    // println!(\"{}\", name); // Error: name no longer owns the string\n}",
      "explanation": "The string's ownership moves to 'another'. After that, 'name' can no longer be used. This prevents double-frees and ensures safe memory management."
    },
    "pitfall_example": {
      "code": "fn main() {\n    let msg = String::from(\"Hello\");\n    takes(msg);\n    println!(\"{}\", msg); // Error: msg moved\n}\n\nfn takes(value: String) {\n    println!(\"{}\", value);\n}",
      "errorHint": "Passing a String into a function moves ownership unless you pass a reference instead. Use &value if you want to borrow it."
    },
    "challenge": {
      "template": "fn main() {\n    let city = String::from(\"Seoul\");\n    // TODO: create a clone of city and print both values\n\n    println!(\"City 1: {} City 2: {}\", city, copy_city);\n}",
      "instructions": "Clone the string so both variables are valid. Cloning duplicates the data instead of transferring ownership.",
      "expectedOutput": "City 1: Seoul City 2: Seoul"
    }
  },
  {
    "day_index": 9,
    "title": "Borrowing and References: Using Data Without Taking It",
    "topic_slug": "borrowing",
    "estimated_time_minutes": 12,
    "theory": "Borrowing lets you use data without taking ownership. Think of it like borrowing a book from a friend—you use it for a while, but you must give it back. References are Rust’s way of borrowing values. Immutable references (&T) allow you to read the data but not modify it, while mutable references (&mut T) let you change it but only if you have exclusive access. Borrowing ensures safe access to memory and eliminates entire categories of bugs like dangling pointers. Understanding borrowing is a major milestone in learning Rust.",
    "core_example": {
      "code": "fn print_length(s: &String) {\n    println!(\"Length: {}\", s.len());\n}\n\nfn main() {\n    let name = String::from(\"Alice\");\n    print_length(&name);\n    println!(\"Original still usable: {}\", name);\n}",
      "explanation": "The function receives a reference to the string instead of taking ownership. After the function call, the original value is still valid because ownership was not moved."
    },
    "pitfall_example": {
      "code": "fn main() {\n    let mut value = String::from(\"Hi\");\n    let r1 = &value;\n    let r2 = &mut value; // Error: cannot borrow mutably while immutably borrowed\n\n    println!(\"{} {}\", r1, r2);\n}",
      "errorHint": "You cannot have a mutable reference while immutable references exist. Rust enforces exclusive access for mutable references."
    },
    "challenge": {
      "template": "fn describe(text: &String) {\n    println!(\"Text: {} Length: {}\", text, text.len());\n}\n\nfn main() {\n    let msg = String::from(\"Learning Rust\");\n    // TODO: call describe using a reference\n}",
      "instructions": "Borrow the string and pass it as an immutable reference into the function.",
      "expectedOutput": "Text: Learning Rust Length: 13"
    }
  },
  {
    "day_index": 10,
    "title": "If, Else, and Conditions: Guiding Your Program’s Decisions",
    "topic_slug": "conditions",
    "estimated_time_minutes": 10,
    "theory": "Conditions help your program make decisions. Whether it's checking a password, comparing numbers, or choosing between actions, conditional expressions drive logic flow. Rust requires conditions to be strictly boolean—no automatic conversions from numbers or other types. If expressions can return values too, which lets you write clean and concise code.",
    "core_example": {
      "code": "fn main() {\n    let score = 85;\n\n    if score >= 90 {\n        println!(\"Excellent!\");\n    } else if score >= 75 {\n        println!(\"Good job!\");\n    } else {\n        println!(\"Keep practicing!\");\n    }\n}",
      "explanation": "Rust evaluates conditions strictly using booleans. The else-if chain allows multiple decisions based on ranges."
    },
    "pitfall_example": {
      "code": "fn main() {\n    let value = 5;\n    if value { // Error: value is an integer, not boolean\n        println!(\"Yes\");\n    }\n}",
      "errorHint": "Rust does not auto-convert integers to boolean. You must explicitly compare: value != 0."
    },
    "challenge": {
      "template": "fn main() {\n    let age = 20;\n\n    // TODO: print \"Adult\" if age >= 18, otherwise print \"Minor\"\n}",
      "instructions": "Use an if-else block to determine whether someone is an adult.",
      "expectedOutput": "Adult"
    }
  },
  {
    "day_index": 11,
    "title": "Loops: Repeating Work the Safe Way",
    "topic_slug": "loops",
    "estimated_time_minutes": 12,
    "theory": "Loops repeat code until a condition is met. Rust supports three main loop types: loop, while, and for. 'loop' repeats endlessly until you break out. 'while' continues as long as a condition is true. 'for' loops iterate over ranges or collections. Beginners often find the 'for' loop easiest because it avoids index mistakes and automatically borrows values. Looping is essential for tasks like processing user input, counting, or iterating over arrays.",
    "core_example": {
      "code": "fn main() {\n    for i in 1..4 {\n        println!(\"Number: {}\", i);\n    }\n}",
      "explanation": "The range 1..4 means 1, 2, 3. The for loop automatically iterates over the range without manual indexing."
    },
    "pitfall_example": {
      "code": "fn main() {\n    let nums = [1, 2, 3];\n    for i in 0..=3 { // Error at index 3\n        println!(\"{}\", nums[i]);\n    }\n}",
      "errorHint": "The array has only indexes 0, 1, and 2. Using 0..=3 tries to access index 3, causing a panic. Use nums.iter() instead."
    },
    "challenge": {
      "template": "fn main() {\n    let numbers = [3, 6, 9];\n\n    // TODO: loop over the array and print each number\n}",
      "instructions": "Use a for loop with numbers.iter() to print each value.",
      "expectedOutput": "3\n6\n9"
    }
  },
  {
    "day_index": 12,
    "title": "Strings: Working With Text in Rust",
    "topic_slug": "strings",
    "estimated_time_minutes": 12,
    "theory": "Strings in Rust come in two main flavors: string slices (&str) and owned Strings. A string slice is a view into some existing text, while a String is a growable, heap-allocated text type. Beginners often struggle because Strings behave differently from simple data types—their ownership matters, and modifying them requires mutability. Working with text becomes easy once you understand when to use &str versus String. A String is ideal when building or modifying text, while &str is great for read-only references.",
    "core_example": {
      "code": "fn main() {\n    let mut message = String::from(\"Hello\");\n    message.push_str(\", world!\");\n    println!(\"{}\", message);\n}",
      "explanation": "String::from creates a growable String. push_str appends additional text. Because message is mutable, it can be modified in place."
    },
    "pitfall_example": {
      "code": "fn main() {\n    let text = \"Hello\";\n    text.push_str(\"! \"); // Error: cannot modify &str\n}",
      "errorHint": "String slices (&str) are immutable. Convert to String if you need to modify: let mut s = text.to_string()."
    },
    "challenge": {
      "template": "fn main() {\n    let mut name = String::from(\"Rust\");\n    // TODO: append \" Programming\" to the string\n\n    println!(\"{}\", name);\n}",
      "instructions": "Use push_str to append additional text to the String.",
      "expectedOutput": "Rust Programming"
    }
  }
]
