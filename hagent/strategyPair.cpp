#include "stdafx.h"
#include "strategyPair.h"

strategyPair::strategyPair() {
    printf("incomplete strategyPair constructor\n");
    exit(1);
}

// the variable [me] names the teacher in the strategy pair
strategyPair::strategyPair(int _me, double ***_M, int _A[2], int _acts[2][2], int s1, int s2, int **assessment) {
    int i, j;
    
    me = _me;
    numStates = _A[0] * _A[1];
    
    teacher = new double*[numStates];
    follower = new double*[numStates];
    for (i = 0; i < numStates; i++) {
        teacher[i] = new double[_A[me]];
        follower[i] = new double[_A[1-me]];
    }
    
    // now for the follower strategy
    for (i = 0; i < numStates; i++) {
        for (j = 0; j < _A[1-me]; j++) {
            follower[i][j] = 0.0;            
        }
        if (i == s1)
            follower[i][_acts[1-me][1]] = 1.0;
        else if (i == s2)
            follower[i][_acts[1-me][0]] = 1.0;
        else {
            follower[i][_acts[1-me][0]] += 0.5;
            follower[i][_acts[1-me][1]] += 0.5;
        }        
    }

    // now for the teacher strategy
    int sum;
    for (i = 0; i < numStates; i++) {
        sum = 0;
        for (j = 0; j < _A[me]; j++)
            sum += assessment[i][j];

        for (j = 0; j < _A[me]; j++)
            teacher[i][j] = assessment[i][j] / (double)sum;
    }
    
}

strategyPair::~strategyPair() {
    int i;
    
    for (i = 0; i < numStates; i++) {
        delete teacher[i];
        delete follower[i];
    }
    delete teacher;
    delete follower;
}

bool strategyPair::isTeacher(int _me) {
    if (me == _me)
        return true;

    return false;
}