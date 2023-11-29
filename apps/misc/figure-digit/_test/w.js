console.log('worker create');
onmessage = (e) => {
    console.log('Message in worker', e);
    const workerResult = `Result: ${e.data[0] + e.data[1]}`;
    console.log(workerResult);
    postMessage(workerResult);
  }