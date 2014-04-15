// ---------------------------------------------
// Davis Putnam Core Functions
// ---------------------------------------------

(function(DavisPutnam) {
	
	// Init Davis Putnam with total number of atoms
	DavisPutnam.init = function(atom_count) {
		this.atoms = [];
		this.values = [];
		for(var i=0;i<atom_count;i++) {
			this.atoms.push(i+1);
			this.values.push(null);
		}
		this.propositions = [];
	};
	
	// Adds in a proposition to the propositions array
	DavisPutnam.addProp = function(clause) {
		this.propositions.push(clause);
	};
	
	// Running function
	DavisPutnam.run = function() {
		return this.solve(this.atoms,this.propositions,this.values);
	};
	
	// Solves the propositions to see if a set of values satisfies all the clauses
	DavisPutnam.solve = function(atoms, s, v) {
		// Copy value array for new iteration
		v = v.slice();
	
		while(true) {
			// Base case: all clauses satisfied
			if(s.length == 0) {
				for(var i=0;i<v.length;i++) {
					if(v[i] === null) {
						// Set unbound atoms to true
						v[i] = true;
					}
				}
				return v;
			}
	
			// Base case: unsatisfiable under V
			else {
				for(var i=0;i<s.length;i++) {
					if(s[i].length == 0) {
						// Some clauses is empty
						return null;
					}
				}
			}
	
			// Do pure literal assignment and forced assignment here
			var pure_lits = this.getPureLiterals(s);
			var singleton = null;
	
			// If there are pure literals
			if(pure_lits.length > 0) {
				this.obviousAssign(pure_lits[0], v);
				s = this.propagate(pure_lits[0], s, v);
			} 
			
			// Check singletons
			else if((singleton = this.nextSingleton(s)) != null) {
				this.obviousAssign(singleton, v);
				s = this.propagate(singleton, s, v);
			} else {
				break;
			}
		}
	
		// Pick first unbound atom and set it to true
		var index = 0;
		for(index = 0;index < v.length;index++) {
			if(v[index] == null) {
				break;
			}
		}
	
		// Assign true to the unbound atom
		v[index] = true;
	
		var s1 = this.propagate(index+1, s, v);
		var v_new = this.solve(atoms, s1, v);
		if(v_new != null) return v_new;
	
		// Set it to false instead
		v[index] = false;
	
		s1 = this.propagate(index+1, s, v);
		return this.solve(atoms, s1, v);
		
	};
	
	// Propagate a value of a (atom) through s (clauses)
	DavisPutnam.propagate = function(a, s, v) {
		s = this.copyDeep(s); // Don't mess with the original
		a = Math.abs(a);
	
		for(var i=0;i<s.length;i++) {
			for(var j=0;j<s[i].length;j++) {
		
				// Check to make sure atom is correct
				if(Math.abs(s[i][j]) != a) continue;
			
				// If atom == value, erase clause, else erase atom in clause
				if((s[i][j] > 0 && v[a-1]) || (s[i][j] < 0 && !v[a-1])) {
					s.splice(i--, 1);
					break;
				} else if(s[i][j] > 0 && v[a-1] == false) {
					s[i].splice(j--, 1);
				} else if(s[i][j] < 0 && v[a-1] == true) {
					s[i].splice(j--, 1);
				}
			}
		}
	
		return s;
	};
	
	// Assign value of literal to values list
	DavisPutnam.obviousAssign = function(l, v) {
		if(l > 0) {v[l-1] = true;}
		else {v[-l-1] = false;}
	};
	
	// Gets the next singleton in a set of clauses s by checking lengths
	// Returns null if none found
	DavisPutnam.nextSingleton = function(s) {
		for(var i=0;i<s.length;i++) {
			if(s[i].length == 1) {
				return s[i][0];
			}
		}
		return null;
	};
	
	// Function that gets all the pure literals in a set of clauses s
	DavisPutnam.getPureLiterals = function(s) {
		var literals = {};
		for(var i=0;i<s.length;i++) {
			for(var j=0;j<s[i].length;j++) {
			
				// Key by literal
				var key = Math.abs(s[i][j]);
				if(typeof(literals[key]) === "undefined") {
					literals[key] = s[i][j];
				} else if(literals[key] != s[i][j]) {
					literals[key] = null;
				} 
			
			}
		}
	
		// Now read from all the literals to see which ones have not been matched
		var pure_lits = [];
		var keys = Object.keys(literals);
		for(var i=0;i<keys.length;i++) {
			if(literals[keys[i]] != null) {
				pure_lits.push(literals[keys[i]]);
			}
		}
		return pure_lits;
	};
	
	// Copies an array recursively
	DavisPutnam.copyDeep = function(src) {
		var ret = [];
		for(var i=0;i<src.length;i++) {
			// Assuming everything is an array, arrays should have length property,
			// and pure numbers should not.
			if(typeof(src[i].length) === "undefined") {
				ret.push(src[i]);
			} else {
				ret.push(this.copyDeep(src[i]));
			}
		}
		return ret;
	};

	
} (window.DavisPutnam = window.DavisPutnam || {}));	

