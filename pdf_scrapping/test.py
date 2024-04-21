import spacy
from pypdf import PdfReader

# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")


# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")


def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_entities(text):
    entities = {
        "name": [],
        "email": [],
        "address": [],
        "work_experience": []
    }

    # Process the text using spaCy
    doc = nlp(text)

    # Extract email addresses
    for token in doc:
        if token.like_email:
            entities["email"].append(token.text)

    # Extract addresses
    for ent in doc.ents:
        if ent.label_ == "GPE" or ent.label_ == "LOC":
            entities["address"].append(ent.text)

    # Extract names and work experience
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["name"].append(ent.text)
        elif ent.text.lower() in ["work history", "work experience", "employment history"]:
            sentences = [sent.text.strip() for sent in doc.sents if ent.text.lower() in sent.text.lower()]
            entities["work_experience"].extend(sentences)

    return entities

# Example usage:
pdf_path = "output.pdf"
extracted_text = extract_text_from_pdf(pdf_path)

data = extract_entities(extracted_text)
print(extracted_text)
print("Name:", data["name"])
print("Emails:", data["email"])
print("Addresses:", data["address"])
print("Work Experience:", data["work_experience"])
