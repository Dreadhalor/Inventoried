export module BluebirdPlus {
  
  const Promise = require('bluebird');

  let queue = [];
  let running = false;
  const queuePromise = (args, fxn) => {
    let pair = {
      args: args,
      fxn: fxn
    }
    queue.push(pair);
    if (!running) advanceQueue();
  }
  const advanceQueue = () => {
    running = true;
    if (queue.length > 0){
      let pair = queue.pop();
      pair.fxn(pair.args)
        .then(success => advanceQueue())
        .catch(error => advanceQueue());
    } else running = false;
  }

  const nestedPromiseAll = (groups, fxn) => {
    return Promise.all(groups.map(
      group => Promise.all(group.map(
        single => fxn(single)
      ))
    ));
  }

  const sequentialPromiseAll = (groups: any[][], fxn) => {
    return Promise.each(
      groups,
      group => Promise.all(group.map(
        single => fxn(single)
      ))
    )
  }

  exports.queue = queuePromise;
  exports.nestedPromiseAll = nestedPromiseAll;
  exports.sequentialPromiseAll = sequentialPromiseAll;
}