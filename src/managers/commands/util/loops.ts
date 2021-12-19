const loops = {
    for: (callback: (i: number) => any, iterations: number, i: number = 0) => {
        callback(i);
        i++;
        if (i === iterations) return;
        loops.for(callback, iterations, i);
    },
};

export default loops;
