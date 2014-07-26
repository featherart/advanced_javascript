* Todo: look through the ember source code and try to understand what it is doing

scope & closures
- nested scope
- hoisting
- this
- closure

scope - where to look for things
more specifically, variables

scope lookup - variable is located in memory, somewhere
nested scopes

who is looking? 

JavaScript is a compiled language!! WTF?
The compiler in JS is significantly more complex than any other language.

Bash scripts and other types of interpreted scripts are definitely interpreted. They will fail in the middle. It goes top-down.

JS - syntax errors! Proof that it's impossible for it to be going top-down.

Let's treat the JS compiler like a person:

var foo = "bar"; // first variable declaration

function bar() { // 2nd declaration, a fn, still global scope
  var foo = "baz";
}

function baz(foo) {
  foo = "bam"; // no declaration here, no var keyword
  bam = "yay";
}

First task of the compiler: figure out variables
What are variable and function definitions? 
Line 1 has first declaration. This is the global scope.
JS treats this line like 2 separate operations that are processed
at different times. 
Line 3 has 2nd declaration.
Line 8 has no declaration!! No var keyword.

Scope - think of this in terms of object hashes. 
key = scope, value = var/fn

We need to recursively step into the fn and interpret

JIT - just in time; when it comes across a particularly large, complex
fn, it will defer compilation until later. It will compile just before runtime.

Looking at all the possible types a var can be, integer or string? 
The compiler makes a guess to optimize.

Hot swapping: when the compiler notices it has made an error in guessing, it will toss out the compilation then recompile

10 years ago people would have laughed if you said JS could be 20 times as slow as native compiled code. Today JS is running less than 2x native code!! JS keeps getting better, beating expectations.

We have compiled, now we execute.

LHS - left hand side of an assignment --> target
RHS - right hand side of an assignment --> source

Scope - when we reference a variable we have to look up the scope
"hey global scope, I have an LHS reference for a var named foo, ever heard of him?" If yes, then passed off. If not, then go fish!

We find var foo in global scope. RHS is a var, so it's easy. If it were also a var, the process would continue.

So we execute var (not shown). "hey scope of var, I have an LHS ref for scope of local"

Variable shadowing - foo is always in local scope now

Lexical lookup

Scope of "baz" - I have an LHS ref for var "foo"
in line 9 (bam = "yay") you are implicitly creating a global var, b/c there is no var declaration

RUN ALL YOUR CODE IN STRICT MODE!! "use strict"; at top of program

This will make your code run faster. Also it's no longer optional.
In ES6 you can't use certain features without running in strict.

In strict mode, you can't implicitly declare global vars. This is a good thing. You want the reference error that will be thrown when you try to reference a var that hasn't been declared.

* undefined !== undeclared 

In JS undefined is a variable, but it doesn't have a value
Undeclared is not at all there.

var foo = undefined; // this is the same 
var foo;              // as this

No we are declaring vars as a compiler:
var foo = "bar"; // first variable declaration

function bar() { // 2nd declaration, a fn, still global scope
  var foo = "baz";

  function baz(foo) {
    foo = "bam"; // param getting set
    bam = "yay"; // no declaration here, no var keyword
  }
  baz(); // not a global fn! won't behave like one, it's in scope of "bar"
}


bar();
foo;
bam;
baz(); // reference error!

compiler goes to look for a var baz in the global scope, but wont find it

var foo = function bar() {
  var foo = "baz";

  function baz(foo) {
    foo = bar;
    foo; // fn call
  }
  baz();
};

foo();
bar(); // error!

Named function expression - has a name: function baz()

anonymous function - no name, eg: function()

* avoid anonymous fns

arguments.callee -- old school, deprecated

Best, only way to reference a fn inside itself is to give it a name

Use named fn expressions:
1. b/c you can reference yourself inside your scope
2. you get a named function in your stack trace
3. you get a little bit of documentation b/c the name might suggest what it does

IIFE - Immediately invoked function expressions - with names

var foo;

try {
  foo.length;
}
catch(err) {  
  console.log(err);
}


Lexical scope - vs - Dynamic scope

Most languages use lexical scope, except Bash scripts
Perl will allow dynamic scope

JS does not have dynamic scope but has a mechanizm that behaves similarly

Nested Russian dolls - function scopes are totally nested within each other

function foo() {
  var bar = "bar";

  function baz() { // here you are deciding what the scope of this fn is
    console.log(bar);
  }
  baz();
}
foo();

baz() is always nested inside of foo() - lexical scope example

if you put baz() outside of foo() there is a totally different scope lookup

scope is determined at author time and compile time

ways to cheat lexical scope: eval()

var bar = "bar";

function foo(str) {
  eval(str);        // cheating lexical scope
  console.log(bar); // 42
}

foo('var bar = 42;');

Here you are cheating the lexical scope at runtime!

Eval is considered untrustable, etc. The real reason to hate eval:

As the compiler is going through code trying to figure out where vars are declared if it runs across an eval in the code it will forgoe all the optimizations that the JS engine would have done

Your code will run slower with eval()

If you write compilers in JS you might produce strings of code that need to be executed. In that case eval() may be useful. Even in that case there are other options.


2nd way of cheating lexical scope, the with keyword:

var obj = {
  a: 2, 
  b: 3,
  c: 4
};

obj.a = obj.b + obj.c;
obj.c = obj.b - obj.a;
 
with( obj) {  // here we're either accidentally creating globals 
              // or overriding
  a = b + c;
  c = b - a;
  d = 3; // look!
}

obj.d; // undefined
d; // 3 -- oops

"with" will always make your code run more slowly too
Strict mode allows "with" and "eval", however it will limit the scope
doesn't allow eval to modify existing scope - this is a performance feature

IIFE - phrase coined by Ben Almon

var foo = "foo";

(function() {
  var foo = "foo2";
  console.log(foo);
})();

console.log(foo);

We are trying to prevent ourselves from modifying the existing environment
this anonymous fn does not pollute the enclosing scope

b/c it has a parenthesis - other things will do - this adds it to the expression stack, the last () executes it

we've immediately executed it so it doesn't pollute the scope

return values that dont get assigned get thrown out

Block Scope
===========

If you are declaring vars across your fn's you will have scope issues

Principle of Priviledge or of Least Exposure

Means that you declare your vars in the smallest scope possible

ex - the i in a for loop

In ES6 you get the "let" keyword

function foo() {
  var bar = "bar";
  for (let i = 0; i < bar.length; i++) {
    console.log(bar.charAt(i));
  }
  console.log(i);
}

foo();

Yipes - some are saying "let" is the new "var"

Let allows you to bind to the scope of a block
Here its attaching to a for loop; limits the scope of the var to a smaller space

A better way to do this is using an explicit block:

function foo(bar) {
  let (baz = bar) {
    console.log(baz);
  }
  console.log(baz)
}

let (foo) {
  foo = "foo";
  console.log(foo);
}
foo; // reference error

https://github.com/getify/let-er

Kyle wrote a tool for lets

try{ throw void 0} catch
  (foo) {
    foo = "foo";
    console.log(foo);
}

foo; // reference error

More on this at https://gist.github.com/getify/5285514


1. Q: What type of scoping rule does JS have? 

A: Lexical

2. Q: What are different ways to change scope?

A:eval
functions
IIFE

3. Q: Whats the difference between undefined and undeclared?

A: undefined has been declared but hasnt got a value assigned


Hoisting Declarations
=====================

Hoisting is a made-up concept but it does represent a mental model

a; // 2
b;
var a = b;
var b = 2;
b;
a;

JavaScript will interpret like this:
var a;  // declarations get hoisted to the top
var b;  // even if they are inside if statements or for loops
a; 
b;
a = b;
b = 2;
b;  // 2
a;

So, basically, even if a var is declared inside of an if statement it
will still get created

* functions will get hoisted before variables

* things on the RHS get evaluated before LHS

function b() {
  return c; // returns undefined
}
var a;
var c;
var d;
a = b();
c = d();
a;
c;
d = function() {
  return b();
};

mutual recursion - where two fns call each other until resolved

function foo(bar) {
  if (bar) {
    console.log(baz);
    let baz = bar;   // hoisting has a let gotcha
                    // the dread temporal dead zone!
  }
}
foo("bar");

This: implicit and default binding
=====

Every function has access to its own execution context, this keyword

4 rules to determine what this is pointing to:

1. was the fn called with "new"?
2. was the fn called with "call" or "apply" specifying an explicit this?
3. Implicit binding rule - use "bind" to bind it
4. If in strict mode - undefined; default is global

function foo() {
  console.log(this.bar);
}
var bar = "bar1";
var o2 = { bar: "bar2", foo: foo };
var o3 = { bar: "bar3", foo: foo };

foo();      // bar1
o2.foo();   // bar2
o3.foo();   // bar3


function foo(baz, bam) {
  console.log(this.bar + " " + baz + " " + bam);
}
var obj = { bar: "bar" };
foo = foo.bind(obj, "baz"); // hard binding to lock this into a particular value

foo("bam");

New keyword - 4 things happen:

1. brand new object gets created out of thin air
2. new object is linked to another object
3. object gets assigned to the this keyword (for the purposes of the fn call)
4. if no other object explicitly returned, this will get returned implicitly

function foo() {
  this.baz = "baz";
  console.log(this.bar + " " + baz);
}
var bar = "bar";
var baz = new foo();

1. What does a fns this point to? whats the default? - scope of fn
2. how do you borrow a fn by inmplicit assignement of this? - 
3. how do you explicitly bind this? - using call or apply
4. how can you force a specific this for a fn? why do that? why not? - use "bind"
5. how do you create a new this? - use "new"

foo.call  // calls foo
foo.bind   // foo will be executed later
foo.apply // only takes one extra param

With ES6 you get the (..) iterator!

Closures - shared scope
========

definition - when a fn remembers its lexical scope 
even if it is executing outside of it

function foo() {
  var bar = "bar";

  function baz() {
    console.log(bar);
  }

  bam(baz);
}
function bam(baz) {
  baz();
}
foo();

function foo() {
  var bar = "bar";

  setTimeout(function() { // inner fn closes over var bar
    console.log(bar);     // so it keeps access to it
  }, 1000);
}
foo();

cannonical example of closure:

for (var i = 1; i <= 5; i++) {
  setTimeout(function() {
    console.log("i: " + i); // i is always 6
  }, i * 1000);
}

Or w/ an IIFE:

for( var i = 1; i <=5; i++ ) {
  (function(i) {
    setTimeout(function() {
      console.log("i: " + i); // i is 1, 2, 3...6
    }, i*1000);
  })(i);
}

The Module Pattern: 
1. there must be an outer enclosing fn to create some scope
2. you must return at least an inner fn

var foo = (function() {
  var o = { bar: "bar" };

  return {
    bar: function() {
      console.log(o.bar);
    }
  };
})();
foo.bar();

jQuery just returns the inner fn, calls it $

Best practice: create a module, give it a name related to that task
treat the module like a namespace

This is a good example, using define:

define("foo", function() {
  var o = { bar: "bar" };

  return {
    bar: function() {
      console.log(o.bar);
    }
  };
});

foo.js:
var o = { bar: "bar" };
export function bar() {
  return o.bar;
}

otherthing.js:
import bar from "foo";
bar(); // "bar"

// making an API
var foo = (function() {
  var publicAPI = {
    bar: function() {
      publicAPI.baz();
    },
    baz: function() {
      console.log("baz");
    }
  };
})

1. whats a closure & how created? 
A - a fn creates a reference to lexical scope and keeps reference to it
2. how long does a scope thats been closed over stay around?
- as long as its needed
3. why doesnt a fn callback inside a loop behave as expected? how to fix?
- use IIFE or 'let'
4. how do you use a closure to create an encapsulated module? benefits?
- inner fn has closure, so that creates encapulation

Object-Orienting
================

Using prototypes
Inheritance vs/ Behavior Delegation or OO vs/ OLOO (Objects linked to other objects)

Every single object is built by a constructor call - e.g. new keyword

Inheritance - the blueprint metaphor
A class is the blueprint
This implies copying

An instance of a class will have access to its vars and methods

function Foo(who) {
  this.me = who;
}
Foo.prototype.identify = function() {
  return "I am " + this.me;
};

var a1 = new Foo("a1");
var a2 = new Foo("a2");

a2.speak = function() {
  alert("hello, " + this.identify() + ". ");
};
a1.constructor === Foo;
a1.constructor === a2.constructor;
a1.__proto__ === Foo.prototype; // "dunder" proto; a getter
a1.__proto__ === a2.__proto__;


// shadowing
function Foo(who) {
  this.me = who;
}
Foo.prototype.identify = function() {
  return "I am " + this.me;
};

var a1 = new Foo("a1");
a1.identify(); // I am a1

a1.identify = function() { // this is where shadowing happens
  alert("hello, " + Foo.prototype. identify.call(this)+".");
};
a1.identify(); // alerts: hello I am a1

Shadowing gives you the ability to make classes
e.g. have a very simple base class that you add to with Inheritance

Super unicorn magic - this always points to the same value 
up the inheritance chain

1. what is a constructor? 
- new in front of a fn call
2. what is the prototype chain & where does it come from? 
- internal linkage from one object to another by new or by object.create
3. how does the prototype linkage affect an object?
- method delegation
4. how do we find out where an objects prototype points to? 3 ways
- __proto__, Object.prototype, this.prototype

Prototypal Inheritance
======================

1. how is JS prototype chain not like traditional inheritance?
- delegation or linking rather than a copying
2. what does prototype delegation mean and how does it describe object 
linking in js?
- 
3. what are benefits of this design pattern?
- classes are a static mechanism, they cant be changed
- with delegation you have more flexibility

Async Patterns
==============

Look at the exercises for an example of side by side comparisons &
examples of generators & promises

callbacks - why are they not sufficient
generators
promises

// callback hell
setTimeout(function() {
  console.log("one");
  setTimeout(function() {
    console.log("two");
    setTimeout(function() {
      console.log("three");
    }, 1000);
  }, 1000);
}, 1000);

// theres another way
function one(cb) {
  console.log("one")
}...etc.

Inversion of Control
====================
handing off control in a callback; pattern used with generators

Generators(yield)
==========

Run to completion semantic; 
generators are a new type of function that doesnt have the run to completion
semantic

You can use the yield keyword to pause a fn in the middle of execution

function* gen() {
  console.log("hello");
  yield;
  console.log("world");
}
var it = gen();
it.next(); // hello
it.next(); // world

you pause internally - it gives you an iterator

how is this related to Async?
yield - a two-way message-passing mechanism

function getData(d) {
  setTimeout(function() { run(d); }, 1000);
}
var run = coroutine(function*() {
  var x = 1 + (yield getData(10));
  var y = 1 + (yield getData(30));
  var answer = (yield getData("meaning of life: " + (x+y)));
  console.log(answer);
  // meaning of life 42
});

run();

Promises
========

Metaphor - You order a burger, pay, then get a #

Your burger isnt ready so you have to wait for your # to be called

promises are transactions that promise a future value
'continuation events'

when you call the fn it gives you a promise; an object on which you can
register an event handler that listens for the return

you call the resolved fn or rejected fn

// async pattern: native promise tasks
function getData(d) {
  return new Promise(function(resolve, reject) {
    setTimeout(function(){ resolve(d); }, 1000);
  });
}
 
var x;
get Data(10)
.then(function(num1) {
  x = 1 + num1;
  return getData(30);
})
.then(function(num2) {
  var y = 1 + num2;
  return getData("Meaning of life: " + (x + y));
})
.then(function(answer) {
  console.log(answer); // meaning of life 42
});

If an object is "thenable" it will give you a promise wrapper
you can use promise.resolve

Promises solve trust issues

https://github.com/getify/asynquence

asynquence.js - library created to automatically chain promises
less boilerplate so its easier to work with promises

generators + promises

generators dont have solution to inversion of control problem
yield promise

1. what is callback hell? why do callbacks suffer from inversion of control?
- inversion of control trust issue
- 
2. how do you pause a generator? how do you resume?
- yield
- .next
3. what is a promise? 
- a reciept
4. how does a promise resolve the inversion of control issue?
- we have to wait for the response but we control what happens next
5. how do we combine promises and generators for flow control?
- yield out a promise from a generator


