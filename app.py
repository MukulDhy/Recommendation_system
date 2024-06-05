import nltk
import pandas as pd
import re
from nltk.stem.snowball import SnowballStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = pd.read_csv('products.csv')

columns_to_drop = ['Unnamed: 4', 'Unnamed: 6', 'Unnamed: 7']
data_cleaned = data.drop(columns=columns_to_drop)

data_cleaned = data_cleaned.dropna()

stemmer = SnowballStemmer('english')

def tokenize_stem(text):
    tokens = nltk.word_tokenize(text.lower())
    stemmed = [stemmer.stem(w) for w in tokens]
    return " ".join(stemmed)

data_cleaned['stemmed_tokens'] = data_cleaned.apply(lambda row: tokenize_stem(row['name'] + " " + row['description']), axis=1)

tfidf_vectorizer = TfidfVectorizer(tokenizer=tokenize_stem)

def cosine_sim(txt1, txt2):
    tfidf_matrix = tfidf_vectorizer.fit_transform([txt1, txt2])
    return cosine_similarity(tfidf_matrix)[0, 1]

def search_product(query):
    stemmed_query = tokenize_stem(query)
    data_cleaned['similarity'] = data_cleaned['stemmed_tokens'].apply(lambda x: cosine_sim(stemmed_query, x))
    res = data_cleaned.sort_values(by='similarity', ascending=False).head(10)[['name', 'description', 'price', 'category', 'image', 'brand']]
    return res.to_dict(orient='records')

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    results = search_product(query)
    return jsonify(results)

@app.route('/', methods=['GET'])
def homePage():
    return "<h1>This the python server used for calling serarch functionality</h1>"

if __name__ == '__main__':
    app.run(debug=True, port=8000)
