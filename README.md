js-davis-putnam
===============

Davis Putnam Solver for Javascript

How to use:

First init the solver with the number of atoms you are using:

```js
DavisPutnam.init(10);
```

Then, add in propositions to the solver. Each number in a proposition
should reference an atom, and use negative values for negation:

```js
DavisPutnam.add_prop([1,2,-3]);

// OR
DavisPutnam.propositions = [[1,2,3],[2,-4]];
```

Finally, running it will return a list of values per each atom or null if it fails.

```js
var values = DavisPutnam.run();

// Example return: [true,true,false] OR null
```