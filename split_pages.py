import os
import re

html_path = "index.html"
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

def replace_nav_links(html):
    html = html.replace('href="#about"', 'href="about.html"')
    html = html.replace('href="#catalog"', 'href="catalog.html"')
    html = html.replace('href="#gallery"', 'href="index.html#gallery"')
    html = html.replace('href="#testimonials"', 'href="contact.html#testimonials"')
    html = html.replace('href="#location"', 'href="location.html"')
    html = html.replace('href="#contact"', 'href="contact.html"')
    return html

# Extract head and body top
head_match = re.search(r'(<!DOCTYPE html>.*?<main>)', content, re.DOTALL)
header_html = head_match.group(1) if head_match else ""

# Extract footer and body bottom
footer_match = re.search(r'(</main>.*?</html>)', content, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else ""

# Extract sections
def extract_section(section_id, class_name=""):
    if section_id:
        pattern = rf'(<section id="{section_id}"[^>]*>.*?</section>)'
    else:
        pattern = rf'(<section class="{class_name}"[^>]*>.*?</section>)'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1) if match else ""

hero_section = extract_section("", "hero hero-asymmetric")
about_section = extract_section("about")
catalog_section = extract_section("catalog")
gallery_section = extract_section("gallery")
testimonials_section = extract_section("testimonials")
stats_section = extract_section("stats")
location_section = extract_section("location")
contact_section = extract_section("contact")
newsletter_section = extract_section("", "newsletter section")

# Prepare index.html content
# Teaser about
teaser_about = about_section
# Add learn more link
teaser_about = re.sub(r'(<ul class="features-list">)', r'<a href="about.html" class="btn btn-secondary" style="margin-top: 1rem;">Learn more</a>\n                    \1', teaser_about)
# Remove features and mission box for teaser? "brief About teaser (short version"
teaser_about = re.sub(r'<ul class="features-list">.*?</ul>', '', teaser_about, flags=re.DOTALL)
teaser_about = re.sub(r'<div class="about-image-placeholder">.*?</div>', '<div class="about-image-placeholder"><img src="assets/gallery1_pro.png" alt="About us" style="border-radius: var(--radius-lg); height: 100%; object-fit: cover;"></div>', teaser_about, flags=re.DOTALL)


# Teaser catalog
teaser_catalog = catalog_section
# Keep only first 3 plants
cards = re.findall(r'<div class="catalog-card.*?</div>\s*</div>', teaser_catalog, re.DOTALL)
teaser_catalog = re.sub(r'(<div class="catalog-grid editorial-catalog">).*?(</div>\s*</div>\s*</section>)', r'\1' + ''.join(cards[:3]) + r'\n<div style="text-align:center; width:100%; margin-top:2rem;"><a href="catalog.html" class="btn btn-primary">View full catalog</a></div>\2', teaser_catalog, flags=re.DOTALL)


index_main = f"{hero_section}\n{teaser_about}\n{teaser_catalog}\n{gallery_section}\n{stats_section}\n{newsletter_section}"
index_html = replace_nav_links(header_html) + "\n" + index_main + "\n" + replace_nav_links(footer_html)

# Prepare about.html
about_header = header_html.replace('<title>Leaf & Root Nursery | Premium Indoor & Outdoor Plants</title>', '<title>About Us | Leaf & Root Nursery</title>')
about_html = replace_nav_links(about_header) + "\n" + about_section + "\n" + replace_nav_links(footer_html)

# Prepare catalog.html
catalog_header = header_html.replace('<title>Leaf & Root Nursery | Premium Indoor & Outdoor Plants</title>', '<title>Plant Catalog | Leaf & Root Nursery</title>')
catalog_html = replace_nav_links(catalog_header) + "\n" + catalog_section + "\n" + replace_nav_links(footer_html)

# Prepare location.html
location_header = header_html.replace('<title>Leaf & Root Nursery | Premium Indoor & Outdoor Plants</title>', '<title>Visit Us | Leaf & Root Nursery</title>')
location_html = replace_nav_links(location_header) + "\n" + location_section + "\n" + replace_nav_links(footer_html)

# Prepare contact.html
contact_header = header_html.replace('<title>Leaf & Root Nursery | Premium Indoor & Outdoor Plants</title>', '<title>Contact Us | Leaf & Root Nursery</title>')
contact_html = replace_nav_links(contact_header) + "\n" + contact_section + "\n" + testimonials_section + "\n" + replace_nav_links(footer_html)

for filename, html in [("index.html", index_html), ("about.html", about_html), ("catalog.html", catalog_html), ("location.html", location_html), ("contact.html", contact_html)]:
    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)
print("Files created successfully.")
