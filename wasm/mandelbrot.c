int test(double a, double b, int upperBound) {
	double x = 0;
	double y = 0;
	int iterations = 0;
	while (iterations < upperBound) {
		iterations ++;
		double oldX = x;
		double oldY = y;
		x = oldX * oldX - oldY * oldY;
		y = 2 * oldX * oldY;
		x = x + a;
		y = y + b;
		if (x*x + y*y > 4) {
			return iterations;
		}
	}
	return 0;
}
