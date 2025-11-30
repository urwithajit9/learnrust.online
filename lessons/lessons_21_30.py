LESSONS = [
  {
    "day_index": 21,
    "title": "Pattern Matching: Rust’s Superpower",
    "topic_slug": "pattern-matching",
    "estimated_time_minutes": 14,
    "theory": "Pattern matching with match allows you to destructure and analyze values safely. It ensures all possibilities are covered, making your code more robust.",
    "core_example": {
      "explanation": "Match on an enum and handle each variant.",
      "code": "enum Light { Red, Yellow, Green }\nlet color = Light::Red;\nmatch color {\n    Light::Red => println!(\"Stop\"),\n    Light::Yellow => println!(\"Slow down\"),\n    Light::Green => println!(\"Go\"),\n}"
    },
    "pitfall_example": {
      "explanation": "Patterns must cover all variants, or include a wildcard.",
      "code": "enum Status { Ok, Error }\nlet s = Status::Ok;\nmatch s {\n    Status::Ok => println!(\"OK\"),\n    // ❌ missing Status::Error\n}"
    },
    "challenge": {
      "task": "Create a match expression that prints different messages for numbers: 0, 1–3, and anything else.",
      "hint": "Use ranges like 1..=3.",
      "expected_output": "Prints different text based on the number."
    }
  },
  {
    "day_index": 22,
    "title": "Vectors: Growable Lists",
    "topic_slug": "vectors",
    "estimated_time_minutes": 12,
    "theory": "Vectors (Vec<T>) are Rust’s growable arrays stored on the heap. They can push, pop, and iterate over elements efficiently.",
    "core_example": {
      "explanation": "Creating and modifying a vector.",
      "code": "let mut v = vec![1, 2, 3];\nv.push(4);\nprintln!(\"{:?}\", v);"
    },
    "pitfall_example": {
      "explanation": "Borrow checker prevents modifying while iterating immutably.",
      "code": "let mut v = vec![1,2,3];\nfor x in &v {\n    v.push(*x); // ❌ cannot modify while borrowed\n}"
    },
    "challenge": {
      "task": "Create a vector of strings and loop through it, printing each element.",
      "hint": "Use for item in &v.",
      "expected_output": "Prints each string in the vector."
    }
  },
  {
    "day_index": 23,
    "title": "HashMaps: Key–Value Storage",
    "topic_slug": "hashmaps",
    "estimated_time_minutes": 13,
    "theory": "HashMap<K, V> lets you associate keys with values. Useful for lookups, counting, or grouping data. Keys must implement Eq and Hash traits.",
    "core_example": {
      "explanation": "Insert and read from a HashMap.",
      "code": "use std::collections::HashMap;\nlet mut scores = HashMap::new();\nscores.insert(\"Alice\", 10);\nprintln!(\"{:?}\", scores.get(\"Alice\"));"
    },
    "pitfall_example": {
      "explanation": "HashMap::get returns an Option.",
      "code": "let map = HashMap::new();\nmap.get(\"nope\").unwrap(); // ❌ unwraps None"
    },
    "challenge": {
      "task": "Count the number of times each word appears in a vector.",
      "hint": "Use entry(word).or_insert(0).",
      "expected_output": "A map of word → count."
    }
  },
  {
    "day_index": 24,
    "title": "Error Handling with Result",
    "topic_slug": "result",
    "estimated_time_minutes": 15,
    "theory": "Rust does not use exceptions. Instead, it uses Result<T, E> to represent success or failure. This makes error handling explicit and safe.",
    "core_example": {
      "explanation": "Using match with Result.",
      "code": "fn divide(a: i32, b: i32) -> Result<i32, String> {\n    if b == 0 { Err(\"Cannot divide by zero\".to_string()) }\n    else { Ok(a / b) }\n}"
    },
    "pitfall_example": {
      "explanation": "Using unwrap() on an error will panic the program.",
      "code": "let f = std::fs::read_to_string(\"missing.txt\").unwrap(); // ❌"
    },
    "challenge": {
      "task": "Write a function that returns Err if input is negative, otherwise Ok doubled.",
      "hint": "Return Result<i32, String>.",
      "expected_output": "Correctly handles positive and negative inputs."
    }
  },
  {
    "day_index": 25,
    "title": "The Option Type: When a Value May Be Missing",
    "topic_slug": "option",
    "estimated_time_minutes": 12,
    "theory": "Option<T> represents a value that may or may not exist. Using Option forces you to handle missing cases safely.",
    "core_example": {
      "explanation": "Basic usage of Option.",
      "code": "fn get_first(v: &Vec<i32>) -> Option<i32> {\n    v.get(0).cloned()\n}"
    },
    "pitfall_example": {
      "explanation": "Unwrapping a None causes panic.",
      "code": "let x: Option<i32> = None;\nx.unwrap(); // ❌"
    },
    "challenge": {
      "task": "Create a function that returns the last element of a vector using Option.",
      "hint": "Use v.last().cloned().",
      "expected_output": "Returns Some(value) or None."
    }
  },
  {
    "day_index": 26,
    "title": "Generics: Write Flexible Functions",
    "topic_slug": "generics",
    "estimated_time_minutes": 14,
    "theory": "Generics allow code to be flexible and work with many types. They use placeholders like T or U to represent types.",
    "core_example": {
      "explanation": "Generic identity function.",
      "code": "fn identity<T>(x: T) -> T { x }"
    },
    "pitfall_example": {
      "explanation": "Traits may be needed for certain operations.",
      "code": "fn add<T>(a: T, b: T) -> T { a + b } // ❌ no + for generic T"
    },
    "challenge": {
      "task": "Write a generic wrapper function that returns a tuple (value, value).",
      "hint": "fn wrap<T>(x: T) -> (T, T).",
      "expected_output": "(5, 5) or any type duplicated."
    }
  },
  {
    "day_index": 27,
    "title": "Traits: Shared Behavior",
    "topic_slug": "traits",
    "estimated_time_minutes": 15,
    "theory": "Traits define shared behavior for multiple types. They are similar to interfaces in other languages but more powerful.",
    "core_example": {
      "explanation": "Implementing a custom trait.",
      "code": "trait Describe { fn describe(&self) -> String; }\nstruct User { name: String }\nimpl Describe for User {\n    fn describe(&self) -> String { format!(\"User: {}\", self.name) }\n}"
    },
    "pitfall_example": {
      "explanation": "Forgetting &self in trait methods.",
      "code": "trait Bad { fn say() -> String; } // ❌ cannot access instance data"
    },
    "challenge": {
      "task": "Create a trait Printable with fn print_item(&self). Implement it for a struct.",
      "hint": "Use println! inside the trait implementation.",
      "expected_output": "Your struct prints a custom message."
    }
  },
  {
    "day_index": 28,
    "title": "Trait Bounds & Where Clauses",
    "topic_slug": "trait-bounds",
    "estimated_time_minutes": 16,
    "theory": "Trait bounds ensure that generic types implement required traits. They enable operators, printing, cloning, and more.",
    "core_example": {
      "explanation": "Using a trait bound.",
      "code": "fn print_any<T: std::fmt::Debug>(x: T) {\n    println!(\"{:?}\", x);\n}"
    },
    "pitfall_example": {
      "explanation": "Long trait bounds clutter function signatures.",
      "code": "fn big<T: A + B + C + D>(x: T) {} // ❌ hard to read"
    },
    "challenge": {
      "task": "Rewrite a generic function using a where clause.",
      "hint": "Example: fn f<T>(x: T) where T: Debug.",
      "expected_output": "Cleaner, more readable signature."
    }
  },
  {
    "day_index": 29,
    "title": "Implementing Methods with impl",
    "topic_slug": "impl",
    "estimated_time_minutes": 14,
    "theory": "impl blocks let you define methods associated with a struct or enum. Methods receive &self or &mut self.",
    "core_example": {
      "explanation": "Add a method to a struct.",
      "code": "struct Point { x: i32, y: i32 }\nimpl Point {\n    fn dist_from_origin(&self) -> f64 {\n        ((self.x.pow(2) + self.y.pow(2)) as f64).sqrt()\n    }\n}"
    },
    "pitfall_example": {
      "explanation": "Trying to call a method before the impl block is visible.",
      "code": "p.do_stuff(); // ❌ method not in scope if struct isn't imported"
    },
    "challenge": {
      "task": "Add a method to a struct Rectangle that returns its area.",
      "hint": "Use self.width * self.height.",
      "expected_output": "Calling area() returns the correct value."
    }
  },
  {
    "day_index": 30,
    "title": "File Handling: Read & Write Files",
    "topic_slug": "file-handling",
    "estimated_time_minutes": 16,
    "theory": "Rust’s std::fs module provides tools to read, write, and modify files. Error handling is essential because file operations can fail.",
    "core_example": {
      "explanation": "Read file contents.",
      "code": "use std::fs;\nlet text = fs::read_to_string(\"notes.txt\")?;\nprintln!(\"{}\", text);"
    },
    "pitfall_example": {
      "explanation": "Ignoring file errors can cause panics.",
      "code": "use std::fs;\nfs::read_to_string(\"missing.txt\").unwrap(); // ❌"
    },
    "challenge": {
      "task": "Write a function that writes a message to a file, then reads it back.",
      "hint": "Use fs::write and fs::read_to_string.",
      "expected_output": "Successfully writes and prints the content."
    }
  }
]
