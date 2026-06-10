export interface CodeSnippet {
  id: string;
  code: string;
  name: string;
  description: string;
}

export type ProgrammingLanguage = 'javascript' | 'python' | 'rust' | 'cpp' | 'go' | 'htmlcss';
export type TypingMode = 'snippets' | 'structures' | 'chaos';

export const CODE_SNIPPETS: Record<ProgrammingLanguage, Record<TypingMode, CodeSnippet[]>> = {
  javascript: {
    snippets: [
      {
        id: 'js-qsort',
        name: 'Quick Sort',
        description: 'Standard quicksort algorithm in JavaScript.',
        code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`
      },
      {
        id: 'js-fetch',
        name: 'Fetch API with Timeout',
        description: 'Fetch resource with abort controller timeout.',
        code: `async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}`
      }
    ],
    structures: [
      {
        id: 'js-bst',
        name: 'Binary Search Tree Node',
        description: 'A standard node class for a BST.',
        code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
  
  insert(val) {
    if (val < this.value) {
      if (!this.left) this.left = new TreeNode(val);
      else this.left.insert(val);
    } else {
      if (!this.right) this.right = new TreeNode(val);
      else this.right.insert(val);
    }
  }
}`
      }
    ],
    chaos: [
      {
        id: 'js-chaos-regex',
        name: 'Regex Match and Map',
        description: 'Intense bracket nesting and template literals.',
        code: `const parse = (str) => {
  const rx = /\\\$\{([^}]+)\}/g;
  const matches = [...str.matchAll(rx)];
  return matches.map(([_, k]) => {
    const parts = k.split(/[.[\\]]/).filter(Boolean);
    return parts.reduce((acc, curr) => acc?.[curr], { data: { val: 42 } });
  });
};`
      }
    ]
  },
  python: {
    snippets: [
      {
        id: 'py-binary-search',
        name: 'Binary Search',
        description: 'Iterative binary search algorithm.',
        code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
      }
    ],
    structures: [
      {
        id: 'py-graph',
        name: 'Adjacency List Graph',
        description: 'Graph representation in Python using dict.',
        code: `class Graph:
    def __init__(self):
        self.adj_list = {}
        
    def add_vertex(self, vertex):
        if vertex not in self.adj_list:
            self.adj_list[vertex] = []
            
    def add_edge(self, v1, v2):
        self.add_vertex(v1)
        self.add_vertex(v2)
        self.adj_list[v1].append(v2)
        self.adj_list[v2].append(v1)`
      }
    ],
    chaos: [
      {
        id: 'py-chaos-comprehensions',
        name: 'Nested Comprehensions & Lambdas',
        description: 'Hard nested data processing with lambdas.',
        code: `process_data = lambda matrix: [
    [x * 2 if x % 2 == 0 else x ** 3 for x in row if x > 0]
    for row in matrix
    if any(val > 10 for val in row)
]`
      }
    ]
  },
  rust: {
    snippets: [
      {
        id: 'rs-threads',
        name: 'Thread Spawning',
        description: 'Spawning multiple worker threads in Rust.',
        code: `use std::thread;

fn spawn_workers(count: usize) {
    let mut handles = vec![];
    for i in 0..count {
        let handle = thread::spawn(move || {
            println!("Worker {} is running", i);
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.join().unwrap();
    }
}`
      }
    ],
    structures: [
      {
        id: 'rs-bst-enum',
        name: 'Recursive Node Option Enum',
        description: 'Binary tree definition using Rust enums.',
        code: `struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

impl Node {
    fn new(value: i32) -> Self {
        Node {
            value,
            left: None,
            right: None,
        }
    }
}`
      }
    ],
    chaos: [
      {
        id: 'rs-chaos-lifetimes',
        name: 'Lifetimes & Trait Bounds',
        description: 'Heavily decorated generic Rust code.',
        code: `pub struct Wrapper<'a, T>
where
    T: 'a + std::fmt::Debug + Clone,
{
    pub value: &'a T,
}

impl<'a, T> Wrapper<'a, T>
where
    T: std::fmt::Debug + Clone,
{
    pub fn print_val(&self) -> Result<(), &'static str> {
        println!("{:?}", self.value);
        Ok(())
    }
}`
      }
    ]
  },
  cpp: {
    snippets: [
      {
        id: 'cpp-fib',
        name: 'Memoized Fibonacci',
        description: 'Recursive Fibonacci with memoization.',
        code: `#include <vector>

long long fibonacci(int n, std::vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    return memo[n];
}`
      }
    ],
    structures: [
      {
        id: 'cpp-smart-pointers',
        name: 'Linked List Node Class',
        description: 'Linked list node using std::unique_ptr.',
        code: `#include <memory>

class ListNode {
public:
    int val;
    std::unique_ptr<ListNode> next;
    
    ListNode(int x) : val(x), next(nullptr) {}
};`
      }
    ],
    chaos: [
      {
        id: 'cpp-chaos-templates',
        name: 'Template Metaprogramming & Casts',
        description: 'A template function with complex brackets.',
        code: `template <typename T, typename U>
auto cast_and_multiply(T t, U u) -> decltype(t * u) {
    auto casted_t = static_cast<double>(t);
    auto casted_u = static_cast<double>(u);
    return reinterpret_cast<decltype(t * u)>(&(casted_t * casted_u));
}`
      }
    ]
  },
  go: {
    snippets: [
      {
        id: 'go-channel',
        name: 'Worker Pool Channels',
        description: 'Go routine channel sync.',
        code: `package main

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 100)
	results := make(chan int, 100)
	go worker(1, jobs, results)
}`
      }
    ],
    structures: [
      {
        id: 'go-struct',
        name: 'User JSON Struct',
        description: 'Struct with JSON tags in Go.',
        code: `type User struct {
	ID        int64    \`json:"id"\`
	Email     string   \`json:"email"\`
	Roles     []string \`json:"roles"\`
	IsActive  bool     \`json:"is_active"\`
}`
      }
    ],
    chaos: [
      {
        id: 'go-chaos-select',
        name: 'Select Multiplexing & Type Casts',
        description: 'Complex Go concurrency & assertions.',
        code: `func handleChannels(c1, c2 chan interface{}) {
	select {
	case v1 := <-c1:
		if val, ok := v1.(string); ok {
			println("Received string: " + val)
		}
	case v2, open := <-c2:
		if !open {
			return
		}
		println(v2)
	}
}`
      }
    ]
  },
  htmlcss: {
    snippets: [
      {
        id: 'html-grid',
        name: 'Grid Layout',
        description: 'Responsive CSS Grid snippet.',
        code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`
      }
    ],
    structures: [
      {
        id: 'html-form',
        name: 'Semantic Login Form',
        description: 'HTML5 semantic login form structure.',
        code: `<form id="login-form" class="auth-form">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" required minlength="8" />
  </div>
  <button type="submit">Log In</button>
</form>`
      }
    ],
    chaos: [
      {
        id: 'html-chaos-svg',
        name: 'Inline SVG Pathing',
        description: 'Inline SVG code with complex coordinates.',
        code: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="100%" stop-color="#ff2a5f" />
    </linearGradient>
  </defs>
  <path d="M10,20 Q30,90 50,50 T90,80" fill="none" stroke="url(#g)" />
</svg>`
      }
    ]
  }
};
