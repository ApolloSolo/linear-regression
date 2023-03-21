function average(dataset_array, sig_fig) {
  let sum = 0;
  for (let i = 0; i < dataset_array.length; i++) {
    sum += dataset_array[i];
  }
  return (sum / dataset_array.length).toFixed(sig_fig);
}

module.exports = average;