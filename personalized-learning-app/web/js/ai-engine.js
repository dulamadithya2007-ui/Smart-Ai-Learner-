// SmartLearn AI Cognitive & Diagnostic Engine

const AIEngine = {
  // Built-in Knowledge Base for Topic-Specific Adaptive Quizzing & Tutoring
  knowledgeBase: {
    "Recursion": {
      summary: "Recursion is a programming technique where a function solves a problem by calling a smaller instance of itself until hitting a base case.",
      analogy: "Think of Russian Matryoshka nesting dolls: to reach the tiny wooden doll inside (the base case), you must open each larger doll one by one. If you forget the smallest solid doll, you will open dolls forever (Stack Overflow).",
      pitfalls: "Forgetting the base case, not progressing towards the base case (e.g. calling f(n) instead of f(n-1)), and redundant re-computation of subproblems without memoization.",
      codeExample: `// Classic Factorial in Java\nint factorial(int n) {\n    if (n <= 1) return 1; // Base Case\n    return n * factorial(n - 1); // Recursive Call\n}`,
      questions: [
        {
          id: "rec_q1",
          difficulty: "Easy",
          question: "What is the primary condition that prevents a recursive function from executing infinitely?",
          options: [
            { key: "A", text: "A base case with a terminating condition", correct: true },
            { key: "B", text: "A while loop around the function call", correct: false },
            { key: "C", text: "Allocating heap memory before calling", correct: false },
            { key: "D", text: "Increasing the recursion counter towards infinity", correct: false }
          ],
          explanation: "A base case provides the stopping criteria. Without it, the recursive function calls itself indefinitely until JVM memory is exhausted, throwing a StackOverflowError."
        },
        {
          id: "rec_q2",
          difficulty: "Medium",
          question: "Which computer memory segment is actively utilized to keep track of recursive function call frames?",
          options: [
            { key: "A", text: "Heap Memory", correct: false },
            { key: "B", text: "Call Stack Memory", correct: true },
            { key: "C", text: "Static PermGen / Metaspace", correct: false },
            { key: "D", text: "Virtual Page File on Disk", correct: false }
          ],
          explanation: "Every time a function is invoked, an activation record (stack frame) containing local variables and the return address is pushed onto the Call Stack. It is popped only when the function returns."
        },
        {
          id: "rec_q3",
          difficulty: "Hard",
          question: "What is Tail Call Recursion (TCR), and why is it beneficial in optimized compilers?",
          options: [
            { key: "A", text: "The recursive call occurs before any local variable declaration", correct: false },
            { key: "B", text: "The recursive call is the very last operation executed before return, allowing frame reuse", correct: true },
            { key: "C", text: "A recursive function that only processes the tail element of a LinkedList", correct: false },
            { key: "D", text: "Recursion that converts all parameters to static references", correct: false }
          ],
          explanation: "In tail recursion, the function's final action is the recursive call itself. Modern compilers can optimize this into an iterative jump, reusing the current stack frame with O(1) auxiliary space."
        }
      ]
    },
    "Object-Oriented Programming": {
      summary: "OOP organizes software design around objects (data + behavior) rather than functions and sequential logic.",
      analogy: "Think of an architectural blueprint of a house as a Class, and each actual house built on the street with unique paint colors and furniture as an Object.",
      pitfalls: "Tight coupling between classes, violating the Single Responsibility Principle, and deep inheritance hierarchies when composition would be cleaner.",
      codeExample: `// Polymorphic Dispatch\nAnimal a = new Dog();\na.makeSound(); // Dispatches dynamically to Dog's method`,
      questions: [
        {
          id: "oops_q1",
          difficulty: "Easy",
          question: "Which OOP pillar allows a subclass to provide a specific implementation of a method defined in its superclass?",
          options: [
            { key: "A", text: "Encapsulation", correct: false },
            { key: "B", text: "Polymorphism (Method Overriding)", correct: true },
            { key: "C", text: "Data Hiding", correct: false },
            { key: "D", text: "Composition", correct: false }
          ],
          explanation: "Method Overriding is runtime (dynamic) polymorphism. The JVM executes the subclass's version of the method based on the actual object runtime type."
        },
        {
          id: "oops_q2",
          difficulty: "Medium",
          question: "What is the key functional difference between an Interface and an Abstract Class in modern Java?",
          options: [
            { key: "A", text: "A class can implement multiple interfaces, but extend only one abstract class", correct: true },
            { key: "B", text: "Interfaces cannot have any method bodies even in Java 8+", correct: false },
            { key: "C", text: "Abstract classes cannot declare instance variables", correct: false },
            { key: "D", text: "Interfaces require explicit public constructors", correct: false }
          ],
          explanation: "Java enforces single inheritance for classes (including abstract classes) to avoid the Diamond Problem, while allowing multiple interface inheritance."
        }
      ]
    },
    "Data Structures & Trees": {
      summary: "Hierarchical data structures where each node has a value and references to child nodes (e.g., Binary Search Trees).",
      analogy: "Like a family ancestry tree or file folder system on your computer: root directory at the top, folders branching downward into sub-folders and files.",
      pitfalls: "Failing to balance trees resulting in degenerate linked lists with O(N) worst-case search times.",
      codeExample: `// In-Order Traversal (Left, Root, Right)\nvoid inOrder(Node root) {\n    if (root == null) return;\n    inOrder(root.left);\n    System.out.print(root.val + " ");\n    inOrder(root.right);\n}`,
      questions: [
        {
          id: "tree_q1",
          difficulty: "Easy",
          question: "In a Binary Search Tree (BST), which traversal order always yields elements in strictly sorted ascending order?",
          options: [
            { key: "A", text: "Pre-order (Root, Left, Right)", correct: false },
            { key: "B", text: "In-order (Left, Root, Right)", correct: true },
            { key: "C", text: "Post-order (Left, Right, Root)", correct: false },
            { key: "D", text: "Breadth-First Level-Order", correct: false }
          ],
          explanation: "In-order traversal visits all smaller nodes on the left first, then the root, then larger nodes on the right, producing a sorted sequence."
        },
        {
          id: "tree_q2",
          difficulty: "Medium",
          question: "What is the worst-case search time complexity of an unbalanced Binary Search Tree?",
          options: [
            { key: "A", text: "O(log N)", correct: false },
            { key: "B", text: "O(N)", correct: true },
            { key: "C", text: "O(1)", correct: false },
            { key: "D", text: "O(N log N)", correct: false }
          ],
          explanation: "When elements are inserted in already sorted order, an unbalanced BST degenerates into a single-line Linked List where search requires inspecting all N nodes."
        }
      ]
    }
  },

  // Fallback / Generic Questions for other user-typed topics
  getGenericQuestions(topic) {
    return [
      {
        id: "gen_q1",
        difficulty: "Easy",
        question: `In fundamental computer science, which core principle best describes mastering "${topic}"?`,
        options: [
          { key: "A", text: "Decomposing the problem into foundational axioms and verifiable subcomponents", correct: true },
          { key: "B", text: "Memorizing syntax without understanding underlying memory or execution models", correct: false },
          { key: "C", text: "Avoiding modular separation of concerns", correct: false },
          { key: "D", text: "Assuming runtime complexity is always constant O(1)", correct: false }
        ],
        explanation: `Mastering ${topic} requires understanding the core preconditions, data transformations, and invariant states rather than rote memorization.`
      },
      {
        id: "gen_q2",
        difficulty: "Medium",
        question: `When diagnosing performance bottlenecks or errors in "${topic}", which analytical approach is most effective?`,
        options: [
          { key: "A", text: "Boundary value analysis, unit test coverage, and systematic tracing", correct: true },
          { key: "B", text: "Randomly reordering statements until compilation succeeds", correct: false },
          { key: "C", text: "Suppressing runtime exception logs", correct: false },
          { key: "D", text: "Removing error validation checks", correct: false }
        ],
        explanation: `Systematic debugging through boundary conditions, invariant verification, and step-by-step state tracing quickly isolates root causes in ${topic}.`
      }
    ];
  },

  // VARK Modality Analysis
  analyzeVark(varkAnswers) {
    const scores = { Visual: 0, Auditory: 0, ReadWrite: 0, Kinesthetic: 0 };
    varkAnswers.forEach(ans => {
      if (scores.hasOwnProperty(ans)) scores[ans]++;
    });

    let dominant = "Visual";
    let maxScore = -1;
    for (const [mod, val] of Object.entries(scores)) {
      if (val > maxScore) {
        maxScore = val;
        dominant = mod;
      }
    }

    return { scores, dominant };
  },

  // Multi-modal Cognitive Study Strategies Generator
  generateStudyPlan(subject, topic, dominantStyle, spanMinutes) {
    const restMinutes = Math.max(5, Math.round(spanMinutes * 0.2));
    const cycleCount = Math.max(2, Math.floor(120 / (spanMinutes + restMinutes)));

    const styleStrategies = {
      Visual: [
        "<strong>Architectural Diagramming:</strong> Draw concept flowcharts, memory block maps, and call trees.",
        "<strong>Color-Coded Tracing:</strong> Use distinct colored pens/highlighters for stack frames, heap pointers, and base cases.",
        "<strong>Visual Sandbox:</strong> Use visualizers (e.g. VisuAlgo or Java Visualizer) to watch algorithms execute step-by-step."
      ],
      Auditory: [
        "<strong>Feynman Technique:</strong> Explain the mechanism out loud in simple non-technical terms as if teaching a beginner.",
        "<strong>Peer Dialogue:</strong> Discuss edge cases with a study partner or record your own summary and listen back.",
        "<strong>Audio Lectures & Podcasts:</strong> Listen to expert conceptual walkthroughs during your review intervals."
      ],
      ReadWrite: [
        "<strong>Structured Markdown Summaries:</strong> Write rigorous bulleted documentation detailing preconditions and postconditions.",
        "<strong>Paper Pseudocode:</strong> Handwrite complete algorithm traces on paper before writing actual code.",
        "<strong>Flashcards & Cheat Sheets:</strong> Formulate Q&A cards for time/space complexities and fundamental API methods."
      ],
      Kinesthetic: [
        "<strong>Interactive Coding Sandboxes:</strong> Write small failing test cases first (TDD) and debug them hands-on.",
        "<strong>Physical Object Modeling:</strong> Use index cards or sticky notes to physically simulate memory stacks or pointer movements.",
        "<strong>Build Mini-Projects:</strong> Apply the concept directly in a functioning CLI tool or mini web application."
      ]
    };

    return {
      subject,
      topic,
      dominantStyle,
      focusMinutes: spanMinutes,
      restMinutes: restMinutes,
      recommendedCycles: cycleCount,
      strategies: styleStrategies[dominantStyle] || styleStrategies.Visual
    };
  },

  // Intelligent AI Tutor Bot Responder
  async answerTutorQuery(topic, query, apiKey = null) {
    // If user provided a Gemini API Key, make an actual AI call
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert university Computer Science tutor helping a student learn ${topic}. Answer concisely with high pedagogical clarity. Query: ${query}`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn("External Gemini API call failed, falling back to local cognitive engine:", err);
      }
    }

    // Local Cognitive AI Engine response synthesis
    const qLower = query.toLowerCase();
    const topicData = this.knowledgeBase[topic];

    if (qLower.includes("analogy") || qLower.includes("metaphor") || qLower.includes("like i'm 5") || qLower.includes("eli5")) {
      if (topicData) {
        return `💡 <strong>Real-World Analogy for ${topic}:</strong><br><br>${topicData.analogy}`;
      }
      return `💡 <strong>Conceptual Analogy:</strong> Think of <em>${topic}</em> as a factory assembly line: raw input enters station 1, undergoes verified state transformations at each step, and produces a deterministic output. If any station fails its precondition, the whole pipeline signals an error.`;
    }

    if (qLower.includes("pitfall") || qLower.includes("mistake") || qLower.includes("error") || qLower.includes("bug")) {
      if (topicData) {
        return `⚠️ <strong>Common Pitfalls & Traps in ${topic}:</strong><br><br>${topicData.pitfalls}`;
      }
      return `⚠️ <strong>Key Pitfalls in ${topic}:</strong><br>1. Not verifying boundary conditions (off-by-one errors, null checks).<br>2. Neglecting time and space complexity scaling.<br>3. Over-complicating state transitions when a simpler invariant exists.`;
    }

    if (qLower.includes("code") || qLower.includes("example") || qLower.includes("implementation") || qLower.includes("trace")) {
      if (topicData) {
        return `💻 <strong>Implementation Blueprint for ${topic}:</strong><pre style="background:#0a0e17;padding:12px;border-radius:8px;margin-top:8px;font-size:0.85rem;overflow-x:auto;"><code>${topicData.codeExample}</code></pre>`;
      }
      return `💻 <strong>Implementation Trace:</strong><pre style="background:#0a0e17;padding:12px;border-radius:8px;margin-top:8px;font-size:0.85rem;"><code>// Standard Structural Pattern\npublic void process(${topic} input) {\n    // 1. Invariant check\n    Objects.requireNonNull(input);\n    // 2. State transformation\n    execute(input);\n}</code></pre>`;
    }

    // Default pedagogical response
    if (topicData) {
      return `🧠 <strong>Core Concept (${topic}):</strong><br><br>${topicData.summary}<br><br><strong>Why it matters:</strong> Mastering ${topic} is critical because it forms the backbone of scalable software engineering and algorithmic efficiency. Try asking for an <em>analogy</em> or <em>common pitfalls</em>!`;
    }

    return `🧠 <strong>Tutoring Guidance for ${topic}:</strong><br><br>To master <strong>${topic}</strong> effectively, break it down into three steps:<br>1. <strong>Formal Definition:</strong> What exact problem does it solve?<br>2. <strong>Invariant States:</strong> What conditions must always remain true before, during, and after execution?<br>3. <strong>Edge Cases:</strong> What happens with null, zero, negative, or maximum size inputs?`;
  }
};

