const math = require("mathjs");

class Five_Var_Stats {
  averages = {};
  max_values = {};
  min_values = {};
  medians = {};
  sample_std = {};
  population_std = {};
  sorted_data = {};
  q1 = {};
  q3 = {};
  pre_matrix = [];
  X;
  Y;
  B;
  slope;
  intercept;

  constructor(dataset, significant_figures) {
    this.dataset = dataset;
    (this.significant_figures = significant_figures),
      (this.fields = Object.keys(dataset[0]));
    this.sort_data();
    this.sort_to_var_array();
    this.average();
    this.max();
    this.min();
    this.median();
    this.sample_sd();
    this.population_sd();
    this.find_q1_q3();
    this.regression();
  }

  sort_data() {
    for (const field of this.fields) {
      const field_values = [];
      for (let object of this.dataset) {
        field_values.push(object[field]);
      }

      field_values.sort(function (a, b) {
        return a - b;
      });

      this.sorted_data[field] = field_values;
    }
  }

  sort_to_var_array() {
    for (const field of this.fields) {
      const field_values = [];
      for (let object of this.dataset) {
        field_values.push(object[field]);
      }
      this.pre_matrix.push(field_values);
    }
  }

  regression() {
    this.X = math.matrix([
      this.pre_matrix[0],
      math.ones(this.pre_matrix[0].length)._data,
    ]);

    this.Y = math.matrix([this.pre_matrix[1]]);

    this.B = math.multiply(
      math.inv(math.multiply(this.X, math.transpose(this.X))),
      math.multiply(this.X, math.transpose(this.Y))
    );

    this.slope = this.B.get([0, 0]);
    this.intercept = this.B.get([1, 0]);
  }

  average() {
    for (const field of this.fields) {
      let sum = 0;
      for (let i = 0; i < this.dataset.length; i++) {
        sum += parseFloat(this.dataset[i][field]);
      }
      this.averages[field] = parseFloat(
        (sum / this.dataset.length).toFixed(this.significant_figures)
      );
    }
  }

  max() {
    for (const field of this.fields) {
      let max = this.dataset[0][field];
      for (let i = 0; i < this.dataset.length; i++) {
        let int = parseFloat(this.dataset[i][field]);
        if (int > max) max = this.dataset[i][field];
        else continue;
      }
      this.max_values[field] = parseFloat(max);
    }
  }

  min() {
    for (const field of this.fields) {
      let min = this.dataset[0][field];
      for (let i = 0; i < this.dataset.length; i++) {
        let int = parseFloat(this.dataset[i][field]);
        if (int < min) min = this.dataset[i][field];
        else continue;
      }
      this.min_values[field] = parseFloat(min);
    }
  }

  median() {
    let is_even = this.dataset.length % 2 === 0;

    if (is_even) {
      const upper_index = this.dataset.length / 2;
      const lower_index = this.dataset.length / 2 - 1;

      for (const field of this.fields) {
        this.medians[field] = parseFloat(
          (
            (parseFloat(this.sorted_data[field][upper_index]) +
              parseFloat(this.sorted_data[field][lower_index])) /
            2
          ).toFixed(this.significant_figures)
        );
      }
    } else {
      const median_index = Math.floor(this.dataset.length / 2);

      for (const field of this.fields) {
        this.medians[field] = parseFloat(
          parseFloat(this.sorted_data[field][median_index]).toFixed(
            this.significant_figures
          )
        );
      }
    }
  }

  sample_sd() {
    for (const field of this.fields) {
      let sum_of_squares = 0;
      for (let object of this.dataset) {
        let delta = object[field] - this.averages[field];
        delta = parseFloat(delta * delta);
        sum_of_squares += delta;
      }
      const std = Math.sqrt(sum_of_squares / (this.dataset.length - 1)).toFixed(
        this.significant_figures
      );
      this.sample_std[field] = parseFloat(std);
    }
  }

  population_sd() {
    for (const field of this.fields) {
      let sum_of_squares = 0;
      for (let object of this.dataset) {
        let delta = object[field] - this.averages[field];
        delta = parseFloat(delta * delta);
        sum_of_squares += delta;
      }
      const std = Math.sqrt(sum_of_squares / this.dataset.length).toFixed(
        this.significant_figures
      );
      this.population_std[field] = parseFloat(std);
    }
  }

  find_q1_q3() {
    let is_even = this.dataset.length % 2 === 0;

    if (is_even) {
      const q1_lower_index = Math.floor(this.dataset.length / 4 - 1);
      const q1_upper_index = Math.ceil(this.dataset.length / 4);

      // q3
      let q3_upper_index = (3 * this.dataset.length) / 4;
      let q3_lower_index = q3_upper_index - 1;

      for (const field of this.fields) {
        this.q1[field] = parseFloat(
          (
            (parseFloat(this.sorted_data[field][q1_lower_index]) +
              parseFloat(this.sorted_data[field][q1_upper_index])) /
            2
          ).toFixed(this.significant_figures)
        );
        let q3_quartile =
          (parseFloat(this.sorted_data[field][q3_upper_index]) +
            parseFloat(this.sorted_data[field][q3_lower_index])) /
          2;
        this.q3[field] = q3_quartile;
      }
    } else {
      for (const field of this.fields) {
        let q1_index = Math.ceil(this.dataset.length / 4 - 1);
        this.q1[field] = parseFloat(this.sorted_data[field][q1_index]);

        let q3_index = Math.floor((3 * this.dataset.length) / 4);
        this.q3[field] = parseFloat(this.sorted_data[field][q3_index]);
      }
    }
  }
}

module.exports = Five_Var_Stats;

/*
// 0   1      2     3     4     5    6     7      8     9    10    11    12    13    14    15   16   17    18    19    20    21   22   23
50.1, 50.5, 50.9, 51.2, 53.5, 55.1, 58.7, 59.2, 59.9, 60.5, 60.9, 62.3, 63.4, 65.1, 65.1, 67.8, 68, 70.2, 71.2, 72.9, 73.3, 73.8, 75, 76.1

*/
