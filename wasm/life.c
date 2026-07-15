#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>


int size = 10;

int wrap(int x) {
	if (x < 0) {
		return x + size;
	} else {
		return x - size;
	}
}

void printState(int state[]) {
	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++) {
			if (state[i*size+j] == 0) {
				printf("\033[37;40m■ ");
			} else {
				printf("\033[94;40m■ ");
			}
		}
		printf("\n");
	}
}

int step(int state[]) {
	int clone[100] = {0};
	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j ++) {
			int count = 0;
			for (int k = -1; k <= 1; k++) {
				for (int l = -1; l <= 1; l++) {
					if (state[(i+k)*size+(l+j)] == 1 && !(k==0 & l==0)) {
						count ++;
					}
				}
			}
			//printf("%d ", count);
			//printf("%d, %d: %d;\n", i, j, count);
			if (count == 3 || (count == 2 && state[i*size+j] == 1)) {
				clone[i*size+j] = 1;
			} else {
				clone[i*size+j] = 0;
			}
		}
		//printf("\n");
	}
	memcpy(state,clone,sizeof(clone));
	//printState(clone);
}


int main() {
	int state[100] = {0};
	state[size*2+4] = 1;
	state[size*3+2] = 1;
	state[size*3+4] = 1;
	state[size*4+3] = 1;
	state[size*4+4] = 1;
	
	for (int i = 0; i < 50; i++) {
		sleep(1);
		system("clear");
		printState(state);
		step(state);
	}
	return 0;
}
