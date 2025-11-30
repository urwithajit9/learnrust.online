export interface CurriculumItem {
  date: string;
  day: string;
  topic: string;
  concept: string;
  phase: number;
}

export const curriculumData: CurriculumItem[] = [
  { date: "Dec 1", day: "Mon", topic: "Setup: Install Rust (rustup) & create a new project (cargo new).", concept: "Environment", phase: 1 },
  { date: "Dec 2", day: "Tue", topic: "First Code: main function and println! macro.", concept: "Execution", phase: 1 },
  { date: "Dec 3", day: "Wed", topic: "Variables: let keyword and scope.", concept: "Variables", phase: 1 },
  { date: "Dec 4", day: "Thu", topic: "Mutability: Using the mut keyword.", concept: "Variables", phase: 1 },
  { date: "Dec 5", day: "Fri", topic: "Shadowing: Redefining a variable using let.", concept: "Variables", phase: 1 },
  { date: "Dec 6", day: "Sat", topic: "Constants: Defining a const and its naming convention.", concept: "Variables", phase: 1 },
  { date: "Dec 7", day: "Sun", topic: "Review: Write a small program using let, mut, and shadowing.", concept: "Practice", phase: 1 },
  { date: "Dec 8", day: "Mon", topic: "Data Types: Integers (i8 to i128, u8 to u128).", concept: "Scalars", phase: 1 },
  { date: "Dec 9", day: "Tue", topic: "Data Types: Floating-Point (f32, f64) and Booleans.", concept: "Scalars", phase: 1 },
  { date: "Dec 10", day: "Wed", topic: "Compound Types: Arrays (fixed size) vs. Tuples (mixed types).", concept: "Compounds", phase: 1 },
  { date: "Dec 11", day: "Thu", topic: "Functions: Defining a function and calling it.", concept: "Functions", phase: 1 },
  { date: "Dec 12", day: "Fri", topic: "Functions: Parameters and the return arrow (->).", concept: "Functions", phase: 1 },
  { date: "Dec 13", day: "Sat", topic: "Control Flow: The if/else expression (used for assignment).", concept: "Flow", phase: 1 },
  { date: "Dec 14", day: "Sun", topic: "Review: Write a function that takes two f64s and returns the larger one using if/else.", concept: "Practice", phase: 1 },
  { date: "Dec 15", day: "Mon", topic: "Loops: The basic loop (infinite loop) and break.", concept: "Loops", phase: 1 },
  { date: "Dec 16", day: "Tue", topic: "Loops: The while condition loop.", concept: "Loops", phase: 1 },
  { date: "Dec 17", day: "Wed", topic: "Loops: Iterating over collections with for.", concept: "Loops", phase: 1 },
  { date: "Dec 18", day: "Thu", topic: "Ownership Rule 1: The Stack and the Heap (Read about memory).", concept: "Ownership", phase: 1 },
  { date: "Dec 19", day: "Fri", topic: "Ownership Rule 2: What is a 'move'? (Focus on integers vs. vectors).", concept: "Ownership", phase: 1 },
  { date: "Dec 20", day: "Sat", topic: "Ownership Rule 3: What is a 'clone'? (Deep copy).", concept: "Ownership", phase: 1 },
  { date: "Dec 21", day: "Sun", topic: "Review: Practice moving/cloning a String and a simple i32.", concept: "Practice", phase: 1 },
  { date: "Dec 22", day: "Mon", topic: "Borrowing: Passing data by reference (&).", concept: "Borrowing", phase: 1 },
  { date: "Dec 23", day: "Tue", topic: "Mutable References: Passing data by mutable reference (&mut).", concept: "Borrowing", phase: 1 },
  { date: "Dec 24", day: "Wed", topic: "The Rules of Borrowing: One mutable OR many immutable references.", concept: "Borrowing", phase: 1 },
  { date: "Dec 25", day: "Thu", topic: "Structs: Defining a simple named struct.", concept: "Structs", phase: 1 },
  { date: "Dec 26", day: "Fri", topic: "Structs: Creating and accessing instance fields.", concept: "Structs", phase: 1 },
  { date: "Dec 27", day: "Sat", topic: "Tuple Structs: Structs without named fields.", concept: "Structs", phase: 1 },
  { date: "Dec 28", day: "Sun", topic: "Review: Create a Point {x, y} struct and pass it to a function.", concept: "Practice", phase: 1 },
  { date: "Dec 29", day: "Mon", topic: "Enums: Defining a simple enum.", concept: "Enums", phase: 1 },
  { date: "Dec 30", day: "Tue", topic: "Enums: Enums with data (e.g., Message::Write(String)).", concept: "Enums", phase: 1 },
  { date: "Dec 31", day: "Wed", topic: "Methods: Implementing a simple method for a struct using impl.", concept: "Methods", phase: 1 },
  
  // Phase 2
  { date: "Jan 1", day: "Thu", topic: "Vectors: Creating and adding elements (push).", concept: "Collection", phase: 2 },
  { date: "Jan 2", day: "Fri", topic: "Vectors: Accessing elements by index (the & vs &mut rules).", concept: "Collection", phase: 2 },
  { date: "Jan 3", day: "Sat", topic: "Vectors: Using .get() for safe element access (returns Option<T>).", concept: "Safety", phase: 2 },
  { date: "Jan 4", day: "Sun", topic: "Review: Write a loop to print all elements in a Vector safely.", concept: "Practice", phase: 2 },
  { date: "Jan 5", day: "Mon", topic: "Strings: &str (string slice/immutable) vs. String (owned/mutable).", concept: "Strings", phase: 2 },
  { date: "Jan 6", day: "Tue", topic: "Strings: Creating and updating a String.", concept: "Strings", phase: 2 },
  { date: "Jan 7", day: "Wed", topic: "Strings: Concatenation using + vs .push_str().", concept: "Strings", phase: 2 },
  { date: "Jan 8", day: "Thu", topic: "HashMaps: Creating a new HashMap.", concept: "Collection", phase: 2 },
  { date: "Jan 9", day: "Fri", topic: "HashMaps: Inserting key-value pairs (insert).", concept: "Collection", phase: 2 },
  { date: "Jan 10", day: "Sat", topic: "HashMaps: Retrieving values (get).", concept: "Collection", phase: 2 },
  { date: "Jan 11", day: "Sun", topic: "Review: Create a HashMap<String, i32> and iterate over it.", concept: "Practice", phase: 2 },
  { date: "Jan 12", day: "Mon", topic: "Error Handling: The panic! macro and when to use it.", concept: "Error", phase: 2 },
  { date: "Jan 13", day: "Tue", topic: "match control flow: Basic usage on an enum.", concept: "Flow", phase: 2 },
  { date: "Jan 14", day: "Wed", topic: "Option<T>: Using match to handle Some(T) or None.", concept: "Robustness", phase: 2 },
  { date: "Jan 15", day: "Thu", topic: "if let: A concise way to handle single match cases.", concept: "Robustness", phase: 2 },
  { date: "Jan 16", day: "Fri", topic: "unwrap() and expect(): Using them (and why to avoid them).", concept: "Robustness", phase: 2 },
  { date: "Jan 17", day: "Sat", topic: "Result<T, E>: Understanding Ok(T) and Err(E).", concept: "Robustness", phase: 2 },
  { date: "Jan 18", day: "Sun", topic: "Review: Write a function that returns Option<i32> and handle it.", concept: "Practice", phase: 2 },
  { date: "Jan 19", day: "Mon", topic: "Propagating Errors: The ? operator.", concept: "Robustness", phase: 2 },
  { date: "Jan 20", day: "Tue", topic: "Box<T>: The simplest Smart Pointer for Heap allocation.", concept: "Smart Ptrs", phase: 2 },
  { date: "Jan 21", day: "Wed", topic: "Trait Objects: Polymorphism with Box<dyn Trait>.", concept: "Traits", phase: 2 },
  { date: "Jan 22", day: "Thu", topic: "Modules: Defining a module (mod) and separating code.", concept: "Organization", phase: 2 },
  { date: "Jan 23", day: "Fri", topic: "Modules: Using pub to expose items.", concept: "Organization", phase: 2 },
  { date: "Jan 24", day: "Sat", topic: "Modules: Bringing items into scope with use.", concept: "Organization", phase: 2 },
  { date: "Jan 25", day: "Sun", topic: "Review: Split a small program into main.rs and lib.rs.", concept: "Practice", phase: 2 },
  { date: "Jan 26", day: "Mon", topic: "External Crates: Adding a dependency in Cargo.toml.", concept: "Cargo", phase: 2 },
  { date: "Jan 27", day: "Tue", topic: "External Crates: Using the rand crate to generate a number.", concept: "Cargo", phase: 2 },
  { date: "Jan 28", day: "Wed", topic: "Testing: Writing a simple unit test with #[test].", concept: "Testing", phase: 2 },
  { date: "Jan 29", day: "Thu", topic: "Testing: Using assert!, assert_eq!, and assert_ne!.", concept: "Testing", phase: 2 },
  { date: "Jan 30", day: "Fri", topic: "Testing: Handling expected panics with #[should_panic].", concept: "Testing", phase: 2 },
  { date: "Jan 31", day: "Sat", topic: "Review: Write a function that divides numbers and test it.", concept: "Practice", phase: 2 },
  
  // Phase 3
  { date: "Feb 1", day: "Sun", topic: "Review: Final review of Result, ?, and match.", concept: "Practice", phase: 3 },
  { date: "Feb 2", day: "Mon", topic: "Traits: Defining a simple trait (e.g., Summary).", concept: "Traits", phase: 3 },
  { date: "Feb 3", day: "Tue", topic: "Traits: Implementing a trait for a struct.", concept: "Traits", phase: 3 },
  { date: "Feb 4", day: "Wed", topic: "Trait Bounds: Using impl Trait in function parameters.", concept: "Traits", phase: 3 },
  { date: "Feb 5", day: "Thu", topic: "Trait Bounds: Using the where clause for readability.", concept: "Traits", phase: 3 },
  { date: "Feb 6", day: "Fri", topic: "Trait Methods: Using a default implementation in a trait.", concept: "Traits", phase: 3 },
  { date: "Feb 7", day: "Sat", topic: "Generics: Using type parameters (<T>) in functions.", concept: "Generics", phase: 3 },
  { date: "Feb 8", day: "Sun", topic: "Review: Implement a trait for two different structs.", concept: "Practice", phase: 3 },
  { date: "Feb 9", day: "Mon", topic: "Generics: Using type parameters in Struct definitions.", concept: "Generics", phase: 3 },
  { date: "Feb 10", day: "Tue", topic: "Generics: Implementing methods for generic structs.", concept: "Generics", phase: 3 },
  { date: "Feb 11", day: "Wed", topic: "Lifetimes: What is a lifetime and why are they needed?", concept: "Lifetimes", phase: 3 },
  { date: "Feb 12", day: "Thu", topic: "Lifetimes: The 'Elision Rules' (implicit lifetimes).", concept: "Lifetimes", phase: 3 },
  { date: "Feb 13", day: "Fri", topic: "Lifetimes: Explicitly annotating input lifetimes ('a).", concept: "Lifetimes", phase: 3 },
  { date: "Feb 14", day: "Sat", topic: "Lifetimes: Annotating output lifetimes.", concept: "Lifetimes", phase: 3 },
  { date: "Feb 15", day: "Sun", topic: "Review: Write a function returning the longer of two string slices.", concept: "Practice", phase: 3 },
  { date: "Feb 16", day: "Mon", topic: "Closures: Defining a simple inline closure (|...| ...).", concept: "Functional", phase: 3 },
  { date: "Feb 17", day: "Tue", topic: "Closures: Capturing the environment (Fn, FnMut, FnOnce).", concept: "Functional", phase: 3 },
  { date: "Feb 18", day: "Wed", topic: "Iterators: The .iter() method on collections.", concept: "Iterators", phase: 3 },
  { date: "Feb 19", day: "Thu", topic: "Iterators: The .map() method.", concept: "Iterators", phase: 3 },
  { date: "Feb 20", day: "Fri", topic: "Iterators: The .filter() method.", concept: "Iterators", phase: 3 },
  { date: "Feb 21", day: "Sat", topic: "Iterators: The .collect() method.", concept: "Iterators", phase: 3 },
  { date: "Feb 22", day: "Sun", topic: "Review: Use an iterator chain on a vector of numbers.", concept: "Practice", phase: 3 },
  { date: "Feb 23", day: "Mon", topic: "Path resolution: Absolute (crate::) vs Relative (super::).", concept: "Organization", phase: 3 },
  { date: "Feb 24", day: "Tue", topic: "Rc<T>: Reference Counting for shared, immutable data.", concept: "Smart Ptrs", phase: 3 },
  { date: "Feb 25", day: "Wed", topic: "RefCell<T>: Interior Mutability.", concept: "Smart Ptrs", phase: 3 },
  { date: "Feb 26", day: "Thu", topic: "Rc + RefCell: Shared, mutable data pattern.", concept: "Smart Ptrs", phase: 3 },
  { date: "Feb 27", day: "Fri", topic: "Macros: Declarative (macro_rules!) vs Procedural.", concept: "Metaprogramming", phase: 3 },
  { date: "Feb 28", day: "Sat", topic: "Review: Review Rc, RefCell, and mutability rules.", concept: "Practice", phase: 3 },
  
  // Phase 4
  { date: "Mar 1", day: "Sun", topic: "Review: Final review of Traits and Generics.", concept: "Practice", phase: 4 },
  { date: "Mar 2", day: "Mon", topic: "Concurrency: Spawning a thread (std::thread::spawn).", concept: "Concurrency", phase: 4 },
  { date: "Mar 3", day: "Tue", topic: "Concurrency: Using join() to wait for threads.", concept: "Concurrency", phase: 4 },
  { date: "Mar 4", day: "Wed", topic: "Message Passing: Creating a channel (mpsc::channel).", concept: "Concurrency", phase: 4 },
  { date: "Mar 5", day: "Thu", topic: "Message Passing: Sending a message (tx.send(...)).", concept: "Concurrency", phase: 4 },
  { date: "Mar 6", day: "Fri", topic: "Message Passing: Receiving a message (rx.recv()).", concept: "Concurrency", phase: 4 },
  { date: "Mar 7", day: "Sat", topic: "Arc<T>: Atomically Reference Counted data.", concept: "Concurrency", phase: 4 },
  { date: "Mar 8", day: "Sun", topic: "Review: Threaded program sending data to main thread.", concept: "Practice", phase: 4 },
  { date: "Mar 9", day: "Mon", topic: "Mutex<T>: Mutual Exclusion for shared, mutable data.", concept: "Concurrency", phase: 4 },
  { date: "Mar 10", day: "Tue", topic: "Send and Sync: The thread-safety marker traits.", concept: "Concurrency", phase: 4 },
  { date: "Mar 11", day: "Wed", topic: "I/O: Opening a file with File::open.", concept: "I/O", phase: 4 },
  { date: "Mar 12", day: "Thu", topic: "I/O: Reading a file to a String.", concept: "I/O", phase: 4 },
  { date: "Mar 13", day: "Fri", topic: "I/O: Writing to a file.", concept: "I/O", phase: 4 },
  { date: "Mar 14", day: "Sat", topic: "Command Line Args: Reading std::env::args.", concept: "CLI", phase: 4 },
  { date: "Mar 15", day: "Sun", topic: "Review: Read a file specified by CLI args and print it.", concept: "Practice", phase: 4 },
  { date: "Mar 16", day: "Mon", topic: "Error Handling: Defining a custom error Enum.", concept: "Error", phase: 4 },
  { date: "Mar 17", day: "Tue", topic: "Error Handling: Implementing the From trait.", concept: "Error", phase: 4 },
  { date: "Mar 18", day: "Wed", topic: "Async/Await: Intro to async and await keywords.", concept: "Async", phase: 4 },
  { date: "Mar 19", day: "Thu", topic: "Async Runtimes: Basics of tokio or async-std.", concept: "Async", phase: 4 },
  { date: "Mar 20", day: "Fri", topic: "Unsafe Rust: When and why it is needed.", concept: "Advanced", phase: 4 },
  { date: "Mar 21", day: "Sat", topic: "Unsafe Rust: Calling an unsafe function.", concept: "Advanced", phase: 4 },
  { date: "Mar 22", day: "Sun", topic: "Review: Explore a popular crate (e.g., serde).", concept: "Exploration", phase: 4 },
  { date: "Mar 23", day: "Mon", topic: "Project Focus: Define a small CLI tool idea.", concept: "Planning", phase: 4 },
  { date: "Mar 24", day: "Tue", topic: "Project Focus: Sketch out structs and enums.", concept: "Planning", phase: 4 },
  { date: "Mar 25", day: "Wed", topic: "Project Focus: Implement core parsing logic.", concept: "Implementation", phase: 4 },
  { date: "Mar 26", day: "Thu", topic: "Project Focus: Implement main logic.", concept: "Implementation", phase: 4 },
  { date: "Mar 27", day: "Fri", topic: "Project Focus: Add error handling.", concept: "Implementation", phase: 4 },
  { date: "Mar 28", day: "Sat", topic: "Project Focus: Write integration tests.", concept: "Testing", phase: 4 },
  { date: "Mar 29", day: "Sun", topic: "Review: Final review of Ownership rules.", concept: "Review", phase: 4 },
  { date: "Mar 30", day: "Mon", topic: "Final: Look for a beginner project on GitHub.", concept: "Next Steps", phase: 4 },
  { date: "Mar 31", day: "Tue", topic: "Final: Research the Rust Roadmap for 2026.", concept: "Next Steps", phase: 4 },
];

export const phaseInfo = {
  1: { name: "Foundations", description: "Variables, Types, Ownership & Borrowing", color: "bg-primary" },
  2: { name: "Core Concepts", description: "Collections, Error Handling & Modules", color: "bg-accent" },
  3: { name: "Advanced Types", description: "Traits, Generics & Lifetimes", color: "bg-concept-collection" },
  4: { name: "Systems", description: "Concurrency, Async & Projects", color: "bg-concept-concurrency" },
};

export const getTodayItem = (): CurriculumItem | undefined => {
  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const todayStr = `${monthNames[today.getMonth()]} ${today.getDate()}`;
  return curriculumData.find(item => item.date === todayStr);
};

export const getItemsByPhase = (phase: number) => curriculumData.filter(item => item.phase === phase);

export const getItemsByConcept = (concept: string) => curriculumData.filter(item => item.concept === concept);

export const getAllConcepts = (): string[] => [...new Set(curriculumData.map(item => item.concept))];
