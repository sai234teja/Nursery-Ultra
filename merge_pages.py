import os
import re

def revert_nav_links(html):
    html = html.replace('href="about.html"', 'href="#about"')
    html = html.replace('href="catalog.html"', 'href="#catalog"')
    html = html.replace('href="index.html#gallery"', 'href="#gallery"')
    html = html.replace('href="contact.html#testimonials"', 'href="#testimonials"')
    html = html.replace('href="location.html"', 'href="#location"')
    html = html.replace('href="contact.html"', 'href="#contact"')
    return html

def extract_section(content, section_id, class_name=""):
    if section_id:
        pattern = rf'(<section id="{section_id}"[^>]*>.*?</section>)'
    else:
        pattern = rf'(<section class="{class_name}"[^>]*>.*?</section>)'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1) if match else ""

# Read files
with open("index.html", "r", encoding="utf-8") as f: index_content = f.read()
with open("about.html", "r", encoding="utf-8") as f: about_content = f.read()
with open("catalog.html", "r", encoding="utf-8") as f: catalog_content = f.read()
with open("location.html", "r", encoding="utf-8") as f: location_content = f.read()
with open("contact.html", "r", encoding="utf-8") as f: contact_content = f.read()

# Header and Footer from index.html
head_match = re.search(r'(<!DOCTYPE html>.*?<main>)', index_content, re.DOTALL)
header_html = head_match.group(1) if head_match else ""

footer_match = re.search(r'(</main>.*?</html>)', index_content, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else ""

header_html = revert_nav_links(header_html)
footer_html = revert_nav_links(footer_html)

# Extract sections from respective files
hero_section = extract_section(index_content, "", "hero hero-asymmetric")
stats_section = extract_section(index_content, "stats")
gallery_section = extract_section(index_content, "gallery")
newsletter_section = extract_section(index_content, "", "newsletter section")

about_section = extract_section(about_content, "about")
catalog_section = extract_section(catalog_content, "catalog")
location_section = extract_section(location_content, "location")
contact_section = extract_section(contact_content, "contact")
testimonials_section = extract_section(contact_content, "testimonials")

# Merge
main_body = f"{hero_section}\n\n        {about_section}\n\n        {catalog_section}\n\n        {gallery_section}\n\n        {testimonials_section}\n\n        {stats_section}\n\n        {location_section}\n\n        {contact_section}\n\n        {newsletter_section}"
merged_html = f"{header_html}\n{main_body}\n{footer_html}"

with open("index.html", "w", encoding="utf-8") as f:
    f.write(merged_html)

print("index.html successfully rebuilt.")

# Clean up
os.remove("about.html")
os.remove("catalog.html")
os.remove("location.html")
os.remove("contact.html")
print("Extra HTML files deleted.")
