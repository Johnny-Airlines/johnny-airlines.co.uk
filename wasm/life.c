#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

int wrap(int x, int y, int size)

void printState(int* state,int x) {
	for (int i = 0; i < x; i++) {
		for (int j = 0; j < x; j++) {
			printf("%d",*(state+i*x+j));
		}
		printf("\n");
	}
}

int main() {
	int state[100] = {0};
	printState(&state[0],10);
	return 0;
}
