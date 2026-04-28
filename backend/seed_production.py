"""Populate production database via the REST API."""
import os
import sys
import time
import urllib.request
import urllib.error
import json

API_URL = os.environ.get("API_URL", "https://onem2f-gallery-website.onrender.com/api")
API_KEY = os.environ.get("API_SECRET_KEY", "")

if not API_KEY:
    print("ERROR: set API_SECRET_KEY env var before running")
    sys.exit(1)

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
}

ARTWORKS = [
    {"title": "Hawaii Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/5.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Hawaii Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/09/1.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Hawaii Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/7.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Hawaii Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/4.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Hawaii Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/16-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Hawaii Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/15-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Jurassic Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/09/6-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Jurassic Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/19-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Jurassic Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/18-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Jurassic Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/10/ce13ade4-413d-4429-ac8f-20865b711b94-scaled.jpeg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Volcanic Thoughts", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/30-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Volcanic Thoughts", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/25-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Volcanic Thoughts", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/29.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Volcanic Thoughts", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/27.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "The Secret of the Seas", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/24-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "The Secret of the Seas", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/23-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "The Secret of the Seas", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/22-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "The Jumping Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/13-1-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "The Jumping Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/8-1-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "The Jumping Series", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/1-1-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Dialogues and Transformations", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/2-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Dialogues and Transformations", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/09/5-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Dialogues and Transformations", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/08/1-scaled.jpg", "category": "Acrylic on Canvas", "year": "2025"},
    {"title": "Sol e Mar Vermelho", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/1-1-scaled.jpg", "category": "Acrylic on stainless steel", "year": "2025"},
    {"title": "Sol e Mar Vermelho", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/2-scaled.jpg", "category": "Acrylic on stainless steel", "year": "2025"},
    {"title": "Sol e Mar Vermelho", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/3-scaled.jpg", "category": "Acrylic on stainless steel", "year": "2025"},
    {"title": "Overflowing", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/5-1-scaled.jpg", "category": "Acrylic on Porcelain", "year": "2025"},
    {"title": "Overflowing", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/6-1-scaled.jpg", "category": "Acrylic on Porcelain", "year": "2025"},
    {"title": "Overflowing", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/7-scaled.jpg", "category": "Acrylic on Porcelain", "year": "2025"},
    {"title": "Overflowing", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/05/9-scaled.jpg", "category": "Acrylic on Porcelain", "year": "2025"},
    {"title": "Growing", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/12/agqgafgadfgadfgdfgadfgadfg.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "I'm from another Galaxy", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_1487-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Carnivoro", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_8280-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Red Dancing with Yellow", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7392-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Gold Dancing with Blue", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7506-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Creepy Elegance", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7956-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Creepy", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7970-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Fire Dance", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_5003-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Dancing with the Frog", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_3246-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Dance Dance Dance", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_3229-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Ash Dance", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_3023-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Brasil", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/Brazil-2.jpg", "category": "Acrylic on Canvas", "year": "2024"},
    {"title": "Blue Hour", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7516-1-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Blue Papone", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7513-1-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Red Flower Power", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/IMG_7784-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "FireFall", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00144-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Vision", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00146-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Woooaaa", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00142-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Flamin' Go", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00143-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Intense Energy", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00147-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "The Universe is Crying", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00017-scaled-e1720626161110.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "While You Walk", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/07/image00103-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Maestro", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/maestro.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Ready", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/08/Sem-Titulo-1-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Steady", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/steady.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Go", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/go.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Nightwalk", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/nightwalk.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Reflection", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/reflection.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Golden Head", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/golden-head.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Red Question", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/red-question.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Free For Flowers", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/free-for-flowers.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Red Wish", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/red-wish_1920.jpg", "category": "Acrylic on Canvas", "year": "2024"},
    {"title": "The Observator", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/the-observator_1920.jpg", "category": "Acrylic on Canvas", "year": "2024"},
    {"title": "Throne", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/throne.jpg", "category": "Acrylic on Canvas", "year": "2024"},
    {"title": "Sensuality", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/sensuality.jpg", "category": "Acrylic on Canvas", "year": "2024"},
    {"title": "Blue Flower", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/blue-flower.jpg", "category": "Acrylic on Canvas", "year": "2024"},
    {"title": "Hippocampus", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/hippocampus_1920.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Yellow Splash", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/yellow-splash.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Spy", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/spy.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Impact", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/impact.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Magic Eye", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/magic-eye.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Red Satisfaction", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/01/red-satisfaction-711x1024-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Orange Satisfaction", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/orange-satisfaction.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Blue Satisfaction", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/blue-satisfaction.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Violet Satisfaction", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/violet-satisfaction.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Blood Orange Satisfaction", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/blood-orange-satisfaction.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Heartbeat in Holiday", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/01/heartbeat-in-holiday-1024x750-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Groovy Flowers", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/groovy-flowers.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Free Flying Flowers", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/free-flying-flowers.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Flowers Liberation", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/flowers-liberation.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Lightness", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/lightness.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Skydance", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/skydance.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Can You Read Me", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/can-you-read-me.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Orange Brainstorm", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/01/orange-brainstorm-745x1024-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Delicado", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2025/01/delicado-803x1024-1.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Come Dance", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/come-dance.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Come On", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/come-on.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Oktoberfest", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/oktoberfest.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "German Impression", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/german-impression.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Stairway 2", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/03/stairway-two.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Tigers", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/tigers.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Yellow Cow", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/yellow-cow.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Blue Bark", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/10/IMG_5390-scaled.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Ambiguous", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/ambiguous_1920.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Brazil", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/brazil_1920.jpg", "category": "Oil on Canvas", "year": "2024"},
    {"title": "Romantic Dog", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/romantic-dog.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Orgasmus", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/orgasmus.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "The Speed of the Skater in Motion", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/the-speed-of-the-skater-in-motion.jpg", "category": "Acrylic on Paper", "year": "2024"},
    {"title": "Emm 1", "image_url": "https://1m2f.b-cdn.net/wp-content/uploads/2024/02/emm-one.jpg", "category": "Acrylic on Paper", "year": "2024"},
]


def post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{API_URL}{path}",
        data=data,
        headers=HEADERS,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def wake_up():
    print("Acordando o backend...", end=" ", flush=True)
    try:
        with urllib.request.urlopen(f"{API_URL.replace('/api', '')}/health", timeout=60) as r:
            print(f"OK ({r.status})")
    except Exception as e:
        print(f"aviso: {e}")


wake_up()

existing_resp = urllib.request.urlopen(f"{API_URL}/artworks/?per_page=200", timeout=30)
existing = json.loads(existing_resp.read())
total = existing.get("total", 0)

if total >= len(ARTWORKS):
    print(f"Banco ja tem {total} obras. Nada a fazer.")
    sys.exit(0)

if total > 0:
    print(f"Limpando {total} obras parciais...")
    for art in existing.get("items", []):
        req = urllib.request.Request(
            f"{API_URL}/artworks/{art['id']}",
            headers=HEADERS,
            method="DELETE",
        )
        urllib.request.urlopen(req, timeout=10)
    print(f"{total} obras removidas. Iniciando seed completo...")

ok = 0
fail = 0
for i, artwork in enumerate(ARTWORKS, 1):
    payload = {**artwork, "artist": "Maria França", "available": "disponível"}
    status, body = post("/artworks/", payload)
    if status == 201:
        ok += 1
        print(f"[{i}/{len(ARTWORKS)}] OK {artwork['title']}")
    else:
        fail += 1
        print(f"[{i}/{len(ARTWORKS)}] FAIL {artwork['title']} - {status}: {body}")
    time.sleep(0.1)

print(f"\n{'='*40}")
print(f"{ok} obras inseridas  |  {fail} falhas")
