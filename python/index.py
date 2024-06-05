import pandas as pd
import json
from sklearn.feature_extraction.text import TfidfVectorizer

# Load data from JSON file with utf-8 encoding
with open('python/output.json', 'r', encoding='utf-8') as file:
    data_list = json.load(file)

df = pd.DataFrame(data_list)

# Combine all descriptions into a list
descriptions = df['description'].tolist()

# Initialize the TF-IDF Vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=10)  # You can adjust max_features as needed

# Fit and transform the descriptions
tfidf_matrix = tfidf_vectorizer.fit_transform(descriptions)

# Get feature names (words)
feature_names = tfidf_vectorizer.get_feature_names_out()

# Convert the TF-IDF matrix to a DataFrame
tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=feature_names)

# Function to extract top N keywords
def extract_top_keywords(row, top_n=5):
    row_sorted = row.sort_values(ascending=False)
    return row_sorted.index[:top_n].tolist()

# Apply the function to each row
df['tags'] = tfidf_df.apply(extract_top_keywords, axis=1)

# Display the DataFrame with tags
print(df[['name', 'tags']])

# Convert DataFrame back to JSON
updated_data_list = df.to_dict(orient='records')

# Convert to JSON string
updated_data_json = json.dumps(updated_data_list, indent=2)

# Save to a file
with open('updated_products.json', 'w', encoding='utf-8') as file:
    file.write(updated_data_json)
