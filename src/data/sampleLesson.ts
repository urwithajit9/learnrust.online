import { DailyLesson } from '@/types/lesson';

// Sample lesson data for demo/development when Firebase is not configured
export const sampleLessons: Record<number, DailyLesson> = {
  1: {
    day: 1,
    title: "Hello, World! & Variables",
    topicSlug: "Variables",
    estimatedTimeMinutes: 6,
    theory: "Rust variables are immutable by default. To make a variable changeable, you must explicitly declare it with the `mut` keyword. Rust also strongly enforces type safety.\n\nThis immutability-by-default approach helps prevent bugs and makes code easier to reason about. When you need a variable to change, you explicitly opt-in with `mut`.",
    coreExample: {
      code: `fn main() {
    let immutable_value = 10; // Immutable by default
    let mut mutable_value = 5; // Use mut keyword

    mutable_value = mutable_value + 1; // Works
    // immutable_value = 11; // Compile error!

    println!("Mutable value: {}", mutable_value);
}`,
      explanation: "This demonstrates immutability (default) versus mutability (`mut`). The last line uses a macro (`println!`) to output the result."
    },
    pitfallExample: {
      code: `fn main() {
    let x: u8 = 255;
    let y: i8 = x; // Type mismatch: u8 to i8
    println!("{}", y);
}`,
      errorHint: "Rust prevents implicit type conversion between unsigned integer (`u8`) and signed integer (`i8`). You must use explicit casting (`as`)."
    },
    challenge: {
      template: `fn main() {
    let num = 42;
    // FIX: Make this variable changeable
    let value = 100;
    value = 50;
    println!("Final value: {}", value);
}`,
      instructions: "Modify the `value` variable declaration so that it can be reassigned without causing a compilation error. Remember the keyword!",
      expectedOutput: "Final value: 50"
    }
  },
  2: {
    day: 2,
    title: "Ownership Basics",
    topicSlug: "Ownership",
    estimatedTimeMinutes: 8,
    theory: "Ownership is Rust's most unique feature. It enables memory safety without garbage collection. Every value in Rust has a single owner, and when the owner goes out of scope, the value is dropped.\n\nThe three rules of ownership:\n1. Each value has an owner\n2. There can only be one owner at a time\n3. When the owner goes out of scope, the value is dropped",
    coreExample: {
      code: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2
    
    // println!("{}", s1); // Error! s1 is no longer valid
    println!("{}", s2); // This works
}`,
      explanation: "When we assign s1 to s2, the ownership of the String is moved. s1 is no longer valid and cannot be used."
    },
    pitfallExample: {
      code: `fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    println!("{}", s); // Error! s was moved
}

fn takes_ownership(s: String) {
    println!("{}", s);
}`,
      errorHint: "When passing a String to a function, ownership is transferred. The original variable can no longer be used unless the function returns ownership."
    },
    challenge: {
      template: `fn main() {
    let s = String::from("hello");
    // FIX: Make this work without moving ownership
    print_string(s);
    println!("Original: {}", s);
}

fn print_string(s: String) {
    println!("Printed: {}", s);
}`,
      instructions: "Modify the function to borrow the string instead of taking ownership. Use a reference (&) to fix the code.",
      expectedOutput: "Printed: hello\nOriginal: hello"
    }
  }
};

export function getSampleLesson(day: number): DailyLesson | null {
  return sampleLessons[day] || null;
}
