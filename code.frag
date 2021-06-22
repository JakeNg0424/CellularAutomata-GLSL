#define GRIDS sTD2DInputs

// Indices of grids plugged as inputs to the module
#define PREV 0
#define SEED 1

// Turns "1" for a single frame if the reset
// button it hit, otherwise stays "0"
uniform int uReset;

// Definition of a cell: position and state
struct Cell {
	ivec2 pos;
	int alive;
};

#define N_NEIGHBORS 25
ivec2 COORDS[N_NEIGHBORS] = ivec2[](
	ivec2(-2, -2), ivec2(-1, -2), ivec2(0, -2), ivec2(1, -2), ivec2(2, -2),
	ivec2(-2, -1), ivec2(-1, -1), ivec2(0, -1), ivec2(1, -1), ivec2(2, -1),
	ivec2(-2,  0), ivec2(-1,  0), ivec2(0,  0), ivec2(1,  0), ivec2(2,  0),
	ivec2(-2,  1), ivec2(-1,  1), ivec2(0,  1), ivec2(1,  1), ivec2(2,  1),
	ivec2(-2,  2), ivec2(-1,  2), ivec2(0,  2), ivec2(1,  2), ivec2(2,  2)
);

// Apply the transition rules
void checkNeighbours(inout Cell c) {
	// Sample neighbours
	int sum = 0;
	for(int i = 0; i < N_NEIGHBORS; i++) {
		sum += int(texelFetch(GRIDS[PREV], c.pos + COORDS[i], 0).r);
	}

	// Transition step
	if(sum == 4)
		c.alive = 1;
	else if (sum == 5 && c.alive == 1)
		c.alive = 1;
	else
		c.alive = 0;
}

out vec4 fragColor;
void main()
{
	// Read current cell
	Cell c;
	c.pos = ivec2(gl_FragCoord.xy);

	if(uReset == 1) {
		// Initialize cells from the SEED grid
		c.alive = int(texelFetch(GRIDS[SEED], c.pos, 0).r);
	} else {
		// Progress the simulation by a single step
		c.alive = int(texelFetch(GRIDS[PREV], c.pos, 0).r);
		checkNeighbours(c);
	}

	// Output cell state as a color:
	// white = alive / black = dead
	vec4 color = vec4(vec3(c.alive), 1.0);
	fragColor = TDOutputSwizzle(color);
}
