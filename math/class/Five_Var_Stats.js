class Five_Var_Stats {
  averages = {};
  max_values = {};
  min_values = {};
  medians = {};
  sample_std = {};
  population_std = {};

  constructor(dataset, significant_figures) {
    this.dataset = dataset;
    (this.significant_figures = significant_figures),
      (this.fields = Object.keys(dataset[0]));
    this.average();
    this.max();
    this.min();
    this.median();
    this.sample_sd();
    this.population_sd();
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
        const field_values = [];
        for (let object of this.dataset) {
          field_values.push(object[field]);
        }

        field_values.sort(function (a, b) {
          return a - b;
        });

        this.medians[field] = parseFloat(
          (
            (parseFloat(field_values[upper_index]) +
              parseFloat(field_values[lower_index])) /
            2
          ).toFixed(this.significant_figures)
        );
      }
    } else {
      const median_index = Math.floor(this.dataset.length / 2);

      for (const field of this.fields) {
        const field_values = [];

        for (let object of this.dataset) {
          field_values.push(object[field]);
        }
        field_values.sort(function (a, b) {
          return a - b;
        });
        this.medians[field] = parseFloat(
          parseFloat(field_values[median_index]).toFixed(
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
}

module.exports = Five_Var_Stats;
