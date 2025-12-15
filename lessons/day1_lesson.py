LESSON= [{
  "day_index": 1,
  "title": "Setting Up Your Rust Environment (rustup & Cargo)",
  "topic_slug": "setup",
  "estimated_time_minutes": 20,
  "theory": "Rust uses two primary tools that you need to know: \n\n1. rustup: The toolchain installer. This is how you get Rust on your computer and manage different versions.\n2. Cargo: Rust's build system and package manager. Every serious Rust project uses Cargo to handle compiling, running, testing, and managing dependencies.\n\n### Step 1: Installing Rust with rustup\n\n**Scenario A: macOS / Linux Installation**\nOpen your terminal and run the following command. This downloads rustup and installs the latest stable version of Rust and Cargo.\n\n$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\n\nFollow the on-screen instructions (the default installation option (1) is usually fine).\n\n**Scenario B: Windows Installation**\nGo to the official Rust website and download the rustup-init.exe installer. Run the installer and follow the prompts. The installer may also install the necessary Visual Studio C++ Build Tools.\n\nVerification\nAfter installation, you should open a new terminal session and be able to run these commands:\n\n$ rustc --version (Shows the Rust compiler version)\n$ cargo --version (Shows the Cargo version)\n\n### Step 2: Creating a Project with Cargo\n\nCargo simplifies everything. Instead of manually creating files and running the compiler, you use Cargo. Let's create our first project, hello_cargo:\n\n$ cargo new hello_cargo\n\nThis command creates a new directory named hello_cargo with this standard structure:\n\n* **src/**: This is the directory where your source code (like `main.rs`) lives.\n* **src/main.rs**: This is where your main code lives. Cargo looks for the main entry point here.\n* **Cargo.toml**: This is the configuration file (manifest) for your project. It holds metadata (name, version) and lists any external libraries (dependencies) your project uses.\n\n",
  "core_example": {
    "code": "# 1. Change directory into your new project:\n$ cd hello_cargo\n\n# 2. Run the project (compiles and executes the code):\n$ cargo run\n\n# Output:\n# Compiling hello_cargo v0.1.0 (...\n# Finished dev [unoptimized + debuginfo] target(s) in 0.10s\n# Running target/debug/hello_cargo\nHello, world!",
    "explanation": "`cargo run` is the standard way to build and execute a Rust project. It handles calling the `rustc` compiler behind the scenes, compiles the code, and places the executable binary in the `target/debug/` directory, then runs it.",
    "tools_used": ["cargo"]
  },
  "pitfall_example": {
    "code": "# Manual 'Hello World' (Discouraged)\n$ rustc src/main.rs\n$ ./main\n\n# Why Cargo is better:\n$ cargo run\n",
    "reason": "While you can compile a single file manually with `rustc src/main.rs`, it is strongly discouraged. As soon as your project requires more than one file or any external dependencies (which all real-world apps do), Cargo becomes mandatory. Always use `cargo new` and `cargo run` to manage your projects professionally.",
    "tools_used": ["rustc", "cargo"]
  },
  "challenge": {
    "task": "Create a second, separate project named `my_tool` using `cargo new`. Then, modify the `src/main.rs` file in `my_tool` to print your name instead of 'Hello, world!'. Finally, run the project.",
    "hint": "The steps are: `cargo new my_tool`, then open `my_tool/src/main.rs` to edit the `println!` line, and finish with `cd my_tool` followed by `cargo run`.",
    "tools_used": ["cargo"]
  }
},]