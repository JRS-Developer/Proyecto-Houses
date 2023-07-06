import pandas as pd
import tensorflow as tf
import tensorflow_decision_forests as tfdf

train_file_path = './train.csv'

# Read files
dataset = pd.read_csv(train_file_path)

# Transform data
label = "SalePrice"
dataset = dataset.loc[:,[ "YearBuilt", "GarageCars", label ]]
data_ds = tfdf.keras.pd_dataframe_to_tf_dataset(dataset, label=label, task = tfdf.keras.Task.REGRESSION)

for features, label in data_ds:
  print("Features:",features)
  print("label:", label)

# Train the model
rf = tfdf.keras.RandomForestModel(task = tfdf.keras.Task.REGRESSION)
rf.fit(x = data_ds)

# Evaluate the model
# ids = test_dataset.pop('Id')
# preds = rf.predict(test_ds)
# output = pd.DataFrame({'Id': ids, 'SalePrice': preds.squeeze()})

# Save the output
# print(output.head())

