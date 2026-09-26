import os
import io
import textwrap
from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image, ImageDraw, ImageFont

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
FONTS_DIR = os.path.join(STATIC_DIR, 'fonts')
IMAGES_DIR = os.path.join(STATIC_DIR, 'images')

def load_font(font_filename, size):
    font_path = os.path.join(FONTS_DIR, font_filename)
    if os.path.exists(font_path):
        try:
            return ImageFont.truetype(font_path, size)
        except Exception as e:
            print(f"Error loading font {font_filename}: {e}")
    try:
        return ImageFont.load_default()
    except Exception:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "Dussehra Greeting Card Generator"})

@app.route('/api/generate-card', methods=['POST'])
def generate_card():
    try:
        data = request.get_json(silent=True) or request.form
        
        recipient = data.get('recipient', 'Dear Family & Friends').strip()
        sender = data.get('sender', 'Dan Babi').strip()
        message = data.get('message', '').strip()
        template = data.get('template', 'royal_gold').strip()
        
        if not message:
            message = ("On this auspicious Vijayadashami, may the light of goodness shine brightly "
                       "in your life, bringing peace to your heart, happiness to your home, and "
                       "prosperity to your journey. May every challenge turn into an opportunity "
                       "and every new beginning bring success. Wishing you and your loved ones a "
                       "beautiful and blessed Dussehra!")

        bg_files = {
            'royal_gold': 'royal_gold_bg.jpg',
            'divine_light': 'divine_light_bg.jpg',
            'festive_heritage': 'festive_heritage_bg.jpg'
        }
        
        bg_filename = bg_files.get(template, 'royal_gold_bg.jpg')
        bg_path = os.path.join(IMAGES_DIR, bg_filename)
        
        CARD_WIDTH = 1080
        CARD_HEIGHT = 1350

        if os.path.exists(bg_path):
            img = Image.open(bg_path).convert("RGBA")
            img = img.resize((CARD_WIDTH, CARD_HEIGHT), Image.Resampling.LANCZOS)
        else:
            img = Image.new("RGBA", (CARD_WIDTH, CARD_HEIGHT), (42, 4, 11, 255))
            
        draw = ImageDraw.Draw(img)
        
        devanagari_font = load_font('RozhaOne-Regular.ttf', 64)
        heading_font = load_font('Poppins-Bold.ttf', 44)
        body_font = load_font('Poppins-Regular.ttf', 30)
        subhead_font = load_font('Poppins-SemiBold.ttf', 32)
        signature_font = load_font('Poppins-Bold.ttf', 36)

        if template == 'divine_light':
            gold_color = (255, 220, 130, 255)
            text_color = (250, 246, 235, 255)
            shadow_color = (0, 0, 0, 180)
            box_bg = (18, 12, 14, 160)
        elif template == 'festive_heritage':
            gold_color = (245, 205, 100, 255)
            text_color = (255, 250, 240, 255)
            shadow_color = (40, 4, 10, 200)
            box_bg = (60, 6, 18, 150)
        else:
            gold_color = (243, 229, 171, 255)
            text_color = (253, 251, 247, 255)
            shadow_color = (20, 2, 6, 220)
            box_bg = (42, 4, 11, 170)

        overlay = Image.new("RGBA", (CARD_WIDTH, CARD_HEIGHT), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        panel_margin_x = 100
        panel_top = 340
        panel_bottom = 1180
        overlay_draw.rounded_rectangle(
            [panel_margin_x, panel_top, CARD_WIDTH - panel_margin_x, panel_bottom],
            radius=24,
            fill=box_bg,
            outline=(212, 175, 55, 180),
            width=2
        )
        img = Image.alpha_composite(img, overlay)
        draw = ImageDraw.Draw(img)

        hindi_title = "शुभ विजयादशमी"
        hindi_bbox = draw.textbbox((0, 0), hindi_title, font=devanagari_font)
        h_width = hindi_bbox[2] - hindi_bbox[0]
        h_x = (CARD_WIDTH - h_width) // 2
        h_y = 120
        draw.text((h_x + 3, h_y + 3), hindi_title, font=devanagari_font, fill=shadow_color)
        draw.text((h_x, h_y), hindi_title, font=devanagari_font, fill=gold_color)

        eng_title = "HAPPY DUSSEHRA"
        eng_bbox = draw.textbbox((0, 0), eng_title, font=heading_font)
        e_width = eng_bbox[2] - eng_bbox[0]
        e_x = (CARD_WIDTH - e_width) // 2
        e_y = h_y + 85
        draw.text((e_x + 2, e_y + 2), eng_title, font=heading_font, fill=shadow_color)
        draw.text((e_x, e_y), eng_title, font=heading_font, fill=(255, 235, 180, 255))

        draw.line([(CARD_WIDTH // 2 - 120, e_y + 65), (CARD_WIDTH // 2 + 120, e_y + 65)], fill=(212, 175, 55, 255), width=2)

        if recipient:
            recip_text = f"To: {recipient}"
            r_bbox = draw.textbbox((0, 0), recip_text, font=subhead_font)
            r_width = r_bbox[2] - r_bbox[0]
            r_x = (CARD_WIDTH - r_width) // 2
            r_y = panel_top + 30
            draw.text((r_x + 1, r_y + 1), recip_text, font=subhead_font, fill=shadow_color)
            draw.text((r_x, r_y), recip_text, font=subhead_font, fill=gold_color)

        msg_margin = 150
        max_char_per_line = 44
        wrapped_lines = textwrap.wrap(message, width=max_char_per_line)
        
        line_height = 42
        msg_start_y = panel_top + 100 if recipient else panel_top + 60
        
        for idx, line in enumerate(wrapped_lines[:12]):
            m_bbox = draw.textbbox((0, 0), line, font=body_font)
            m_width = m_bbox[2] - m_bbox[0]
            m_x = (CARD_WIDTH - m_width) // 2
            curr_y = msg_start_y + (idx * line_height)
            draw.text((m_x + 1, curr_y + 1), line, font=body_font, fill=shadow_color)
            draw.text((m_x, curr_y), line, font=body_font, fill=text_color)

        blessing_1 = "Wishing You & Your Family"
        blessing_2 = "A Joyful, Blessed & Prosperous Dussehra"
        
        b1_bbox = draw.textbbox((0, 0), blessing_1, font=body_font)
        b1_width = b1_bbox[2] - b1_bbox[0]
        b1_x = (CARD_WIDTH - b1_width) // 2
        b1_y = panel_bottom - 170
        draw.text((b1_x, b1_y), blessing_1, font=body_font, fill=(230, 210, 160, 255))
        
        b2_bbox = draw.textbbox((0, 0), blessing_2, font=subhead_font)
        b2_width = b2_bbox[2] - b2_bbox[0]
        b2_x = (CARD_WIDTH - b2_width) // 2
        b2_y = b1_y + 45
        draw.text((b2_x + 1, b2_y + 1), blessing_2, font=subhead_font, fill=shadow_color)
        draw.text((b2_x, b2_y), blessing_2, font=subhead_font, fill=gold_color)

        if sender:
            sender_text = f"— With Warm Regards, {sender}"
            s_bbox = draw.textbbox((0, 0), sender_text, font=signature_font)
            s_width = s_bbox[2] - s_bbox[0]
            s_x = (CARD_WIDTH - s_width) // 2
            s_y = panel_bottom + 40
            draw.text((s_x + 2, s_y + 2), sender_text, font=signature_font, fill=shadow_color)
            draw.text((s_x, s_y), sender_text, font=signature_font, fill=gold_color)

        final_img = img.convert("RGB")
        img_io = io.BytesIO()
        final_img.save(img_io, 'PNG', quality=95)
        img_io.seek(0)

        filename = f"Dussehra_Greeting_{template}_{recipient.replace(' ', '_')}.png"
        return send_file(img_io, mimetype='image/png', as_attachment=True, download_name=filename)

    except Exception as e:
        print(f"Error generating card: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
