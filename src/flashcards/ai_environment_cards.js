const pairs = [
  // Neural network basics
  ['Node/neuron', 'A computational unit that receives inputs, applies weights and a bias, then passes the result through an activation function.'],
  ['Connection/dendrite', 'A link carrying information from one neuron to another; its strength is controlled by a weight.'],
  ['Weight/synapse', 'A learned numerical value that controls how strongly one input influences a neuron.'],
  ['Bias', "A learned offset added to a neuron's weighted input, allowing the activation threshold to shift."],
  ['Hidden layer', 'A layer between the input and output layers that learns intermediate features or representations.'],
  ['Perceptron', 'The simplest artificial neuron: it computes a weighted sum, adds a bias, and applies an activation function.'],
  ['Activation function', "A function applied to a neuron's weighted sum, usually introducing non-linearity."],
  ['Linearly separable', 'A dataset is linearly separable if one straight line, plane, or hyperplane can divide its classes.'],
  ['Sigmoid function', 'An S-shaped activation function that maps values to the range 0–1: σ(x) = 1 / (1 + e^(−x)).'],
  ['ReLU', 'The Rectified Linear Unit: f(x) = max(0, x). It outputs zero for negative values and x for positive values.'],
  ['Numerical forward pass', "Calculating a network's prediction step by step from the inputs through each layer to the output."],
  ['Gradient descent', 'An optimisation method that updates parameters in the direction that reduces the loss.'],
  ['Backward pass/backpropagation', 'Computing how much each parameter contributed to the error using the chain rule, producing gradients for gradient descent.'],

  // Hyperparameters
  ['Hyperparameter', 'A setting chosen by the user before training rather than learned automatically from the data.'],
  ['Learning rate (η)', 'The size of each parameter update; too large may overshoot, while too small makes learning slow.'],
  ['Batch size (B)', 'The number of training examples used to calculate one parameter update.'],
  ['Epoch (E)', 'One complete pass through the entire training dataset.'],
  ['Hidden neurons (H)', "The number of neurons in a hidden layer; this determines the layer's width or capacity."],
  ['Hidden layers (L)', "The number of hidden layers; this determines the network's depth."],

  // Counting weights and biases
  ['Number of weights in a fully connected layer', 'Number of inputs × number of neurons in the layer.'],
  ['Number of biases in a fully connected layer', 'The number of neurons in the layer (one bias per neuron).'],
  ['Total parameters for layer sizes n0, n1, ..., nL', 'Sum over l = 1..L of (n(l−1) × n(l) + n(l)) = Sum of n(l) × (n(l−1) + 1). The +1 accounts for one bias per neuron. Total parameters = weights + biases.'],

  // Activation functions
  ['Linear activation', 'f(x) = x; range is (−∞, ∞), producing a straight line. Common use: output layer for regression.'],
  ['Sigmoid activation', 'S-shaped; range is (0, 1), with saturation at both ends. Common use: binary classification output or probability.'],
  ['Tanh activation', 'S-shaped; range is (−1, 1), centred around zero. Common use: hidden layers in some smaller networks or recurrent models.'],
  ['ReLU activation', 'Zero for x < 0, linear for x ≥ 0; range is [0, ∞). Common use: general-purpose hidden layers in MLPs and CNNs.'],
  ['Softmax activation', 'Converts output scores into probabilities that sum to 1. Common use: multi-class classification output.'],

  // Matching networks to environmental data
  ['MLP: best use for environmental data', 'Tabular feature vectors, such as biomass predicted from plot measurements.'],
  ['CNN: best use for environmental data', 'Grid-like data with local spatial patterns, such as land-cover or wildlife images.'],
  ['RNN/LSTM: best use for environmental data', 'Ordered or time-dependent sequences, such as temperature or energy forecasts.'],
  ['Autoencoder: best use for environmental data', 'Reconstructing or compressing data; useful for detecting unusual sensor patterns through high reconstruction error.'],

  // Stationarity and time series
  ['Stationarity', 'A time series has a stable statistical structure over time, especially a constant mean, variance, and autocorrelation pattern.'],
  ['Stable mean and spread', 'The series fluctuates around a roughly constant average with a roughly constant variance.'],
  ['Changing mean', 'The average level shifts over time, often indicating a trend or non-stationarity.'],
  ['Changing spread', 'The variance changes over time; this is also called heteroscedasticity or volatility.'],
  ['Differencing', 'Subtracting an observation from a previous observation to remove trend and help make a series stationary. It approximates a derivative, not integration.'],
  ['ARIMA', 'A time-series model combining autoregression, differencing, and moving-average errors.'],
  ['SARIMA', 'Seasonal ARIMA; ARIMA extended to model repeating seasonal patterns.'],
  ['Seasonality', 'A predictable pattern that repeats at a fixed interval, such as daily, monthly, or yearly.'],

  // Short-term memory and LSTM gates
  ['Short-term memory model', 'A sequence model that uses recent information to help predict or interpret later observations. An LSTM is designed to retain useful information over longer sequences.'],
  ['Gate control mechanism', 'An LSTM mechanism that learns which information to discard, store, or reveal.'],
  ['Forget gate', 'Decides which information from the previous cell state should be discarded.'],
  ['Input gate', 'Decides which new information should be added to the cell state.'],
  ['Candidate state', 'New information proposed for addition to the cell state, usually transformed with tanh.'],
  ['Output gate', 'Decides which information from the cell state should be exposed as the current hidden state/output.'],
  ['Cell state', "The LSTM's long-term memory pathway, carrying selected information through the sequence."],

  // Diagnosing learning curves
  ['Training and validation loss both decrease', 'The model is learning effectively.'],
  ['Training loss decreases but validation loss increases', 'Overfitting; the model is memorising the training data.'],
  ['Both losses remain high and flat', 'Underfitting, poor features, an unsuitable model, or insufficient training.'],
  ['Both losses fluctuate strongly', 'Learning rate may be too high, or batches may be too small/noisy.'],
  ['Training and validation loss are both low and close', 'Good fit and likely good generalisation.'],
  ['Large gap between training and validation performance', 'Possible overfitting, data mismatch, or problems with the train/validation split.'],
  ['Validation loss improves, then worsens', 'Use early stopping around the point where validation loss is lowest.']
]

export const AI_ENVIRONMENT_CARDS = pairs.map(([front, back]) => ({ front, back }))
